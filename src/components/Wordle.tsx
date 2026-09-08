import { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { audioManager } from '../utils/audioManager';
import {
  MAX_GUESSES,
  WORD_LENGTH,
  WORDS,
  isValidWord,
  keyStates,
  markGuess,
  recordGame,
  loadStats,
  type KeyState,
  type LetterState,
} from '../utils/wordle';

type CellState = LetterState | 'empty' | 'active';

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-5px); }
  60%      { transform: translateX(5px); }
`;

const Container = styled.div`
  max-width: 330px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

const Row = styled.div<{ $invalid?: boolean }>`
  display: flex;
  gap: 5px;
  margin-bottom: 5px;
  justify-content: center;
  animation: ${p => (p.$invalid ? shake : 'none')} 0.3s ease;
`;

const Cell = styled.div<{ $state: CellState }>`
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 19px;
  text-transform: uppercase;
  border-radius: 4px;
  border: 2px solid
    ${({ theme, $state }) =>
      $state === 'empty'
        ? theme.colors.overlay
        : $state === 'active'
          ? theme.colors.muted
          : 'transparent'};
  background: ${({ theme, $state }) =>
    $state === 'correct'
      ? theme.colors.green
      : $state === 'present'
        ? theme.colors.yellow
        : $state === 'absent'
          ? theme.colors.overlay
          : 'transparent'};
  color: ${({ theme, $state }) =>
    $state === 'correct' || $state === 'present'
      ? theme.colors.background
      : theme.colors.foreground};
  transition: background 0.15s, border-color 0.15s;
`;

const Keyboard = styled.div`
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const KeyRow = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
`;

const Key = styled.button<{ $state: KeyState }>`
  padding: 8px 0;
  width: 28px;
  border: none;
  border-radius: 3px;
  font-family: inherit;
  font-size: 12px;
  text-transform: uppercase;
  cursor: pointer;
  background: ${({ theme, $state }) =>
    $state === 'correct'
      ? theme.colors.green
      : $state === 'present'
        ? theme.colors.yellow
        : theme.colors.overlay};
  color: ${({ theme, $state }) =>
    $state === 'correct' || $state === 'present'
      ? theme.colors.background
      : $state === 'absent'
        ? theme.colors.muted
        : theme.colors.foreground};
  opacity: ${({ $state }) => ($state === 'absent' ? 0.45 : 1)};
`;

const Message = styled.div<{ $tone: 'win' | 'lose' | 'warn' }>`
  margin-top: 1rem;
  text-align: center;
  color: ${({ theme, $tone }) =>
    $tone === 'win' ? theme.colors.green : $tone === 'lose' ? theme.colors.red : theme.colors.yellow};
`;

const Hint = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
  margin-top: 0.75rem;
  text-align: center;
`;

const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map(r => r.split(''));

const pickWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const Wordle = ({ onExit }: { onExit: () => void }) => {
  const [answer, setAnswer] = useState(pickWord);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [invalid, setInvalid] = useState(false);
  const [stats, setStats] = useState(loadStats);

  const keys = useMemo(() => keyStates(guesses, answer), [guesses, answer]);
  const marks = useMemo(() => guesses.map(g => markGuess(g, answer)), [guesses, answer]);

  const reset = useCallback(() => {
    setAnswer(pickWord());
    setGuesses([]);
    setCurrent('');
    setStatus('playing');
    setInvalid(false);
  }, []);

  const submit = useCallback(() => {
    if (current.length !== WORD_LENGTH) return;

    if (!isValidWord(current)) {
      // Reject rather than burn a guess on a non-word.
      setInvalid(true);
      audioManager.error();
      setTimeout(() => setInvalid(false), 350);
      return;
    }

    const next = [...guesses, current];
    setGuesses(next);
    setCurrent('');

    if (current === answer) {
      setStatus('won');
      setStats(recordGame(true));
      audioManager.success();
    } else if (next.length >= MAX_GUESSES) {
      setStatus('lost');
      setStats(recordGame(false));
      audioManager.error();
    }
  }, [current, guesses, answer]);

  const press = useCallback(
    (key: string) => {
      if (status !== 'playing') {
        if (key === 'Enter') reset();
        return;
      }
      if (key === 'Enter') return submit();
      if (key === 'Backspace') return setCurrent(prev => prev.slice(0, -1));
      if (/^[a-zA-Z]$/.test(key) && current.length < WORD_LENGTH) {
        audioManager.keystroke();
        setCurrent(prev => prev + key.toLowerCase());
      }
    },
    [status, current, submit, reset],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
        return;
      }
      // Stop arrow keys and letters reaching the terminal behind the game.
      e.stopPropagation();
      press(e.key);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [press, onExit]);

  const cellState = (row: number, col: number): CellState => {
    if (row < guesses.length) return marks[row][col];
    if (row === guesses.length && status === 'playing') {
      return col < current.length ? 'active' : 'empty';
    }
    return 'empty';
  };

  const letter = (row: number, col: number) =>
    row < guesses.length ? guesses[row][col] : row === guesses.length ? current[col] ?? '' : '';

  return (
    <Container>
      <Header>
        <span>WORDLE</span>
        <span>
          {stats.played > 0 && `${stats.won}/${stats.played} · streak ${stats.streak}`}
        </span>
      </Header>

      {Array.from({ length: MAX_GUESSES }, (_, row) => (
        <Row key={row} $invalid={invalid && row === guesses.length}>
          {Array.from({ length: WORD_LENGTH }, (_, col) => (
            <Cell key={col} $state={cellState(row, col)}>
              {letter(row, col)}
            </Cell>
          ))}
        </Row>
      ))}

      <Keyboard>
        {KEYBOARD_ROWS.map((row, i) => (
          <KeyRow key={i}>
            {row.map(l => (
              <Key key={l} $state={keys.get(l) ?? 'unused'} onClick={() => press(l)}>
                {l}
              </Key>
            ))}
          </KeyRow>
        ))}
      </Keyboard>

      {invalid && <Message $tone="warn">Not in word list.</Message>}

      {status === 'won' && (
        <Message $tone="win">
          Got it in {guesses.length}/{MAX_GUESSES}.
        </Message>
      )}
      {status === 'lost' && <Message $tone="lose">The word was “{answer}”.</Message>}

      <Hint>
        {status === 'playing'
          ? 'Type a 5-letter word and press Enter. Escape to exit.'
          : 'Press Enter to play again, or Escape to exit.'}
      </Hint>
    </Container>
  );
};

export default Wordle;
