import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

const WORDS = [
  'crane', 'slate', 'trace', 'audio', 'raise', 'stare', 'arise', 'learn',
  'stern', 'crate', 'irate', 'snare', 'adieu', 'route', 'saint', 'outer',
  'react', 'train', 'plant', 'share', 'heart', 'stone', 'smart', 'ocean',
  'earth', 'house', 'light', 'world', 'night', 'water', 'dream', 'space',
  'brain', 'cloud', 'flame', 'steel', 'pearl', 'tiger', 'quiet', 'waste',
  'solid', 'royal', 'panel', 'rapid', 'blend', 'frost', 'brave', 'grace',
  'prime', 'drift', 'scope', 'focus', 'pixel', 'stack', 'debug', 'build',
  'parse', 'query', 'cache', 'fetch', 'proxy', 'merge', 'patch', 'trunk',
];

const MAX_GUESSES = 6;

const Container = styled.div`
  font-family: ${({ theme }) => theme.font};
  max-width: 300px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

const Row = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
  justify-content: center;
`;

const Cell = styled.div<{ $state: 'correct' | 'present' | 'absent' | 'empty' | 'active' }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  border-radius: 4px;
  border: 2px solid ${({ theme, $state }) => {
    if ($state === 'empty') return theme.colors.surface;
    if ($state === 'active') return theme.colors.muted;
    return 'transparent';
  }};
  background: ${({ theme, $state }) => {
    if ($state === 'correct') return theme.colors.green;
    if ($state === 'present') return theme.colors.yellow;
    if ($state === 'absent') return theme.colors.surface;
    return 'transparent';
  }};
  color: ${({ theme, $state }) => {
    if ($state === 'correct' || $state === 'present') return theme.colors.background;
    return theme.colors.foreground;
  }};
  transition: background 0.2s, border-color 0.2s;
`;

const Keyboard = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const KeyRow = styled.div`
  display: flex;
  gap: 3px;
  justify-content: center;
`;

const Key = styled.span<{ $state: 'correct' | 'present' | 'absent' | 'unused' }>`
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 11px;
  text-transform: uppercase;
  min-width: 20px;
  text-align: center;
  background: ${({ theme, $state }) => {
    if ($state === 'correct') return theme.colors.green;
    if ($state === 'present') return theme.colors.yellow;
    if ($state === 'absent') return theme.colors.surface;
    return theme.colors.surface;
  }};
  color: ${({ theme, $state }) => {
    if ($state === 'correct' || $state === 'present') return '#1e1e2e';
    if ($state === 'absent') return theme.colors.muted;
    return theme.colors.foreground;
  }};
  opacity: ${({ $state }) => $state === 'absent' ? 0.5 : 1};
`;

const Message = styled.div`
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.yellow};
`;

const Hint = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
  margin-top: 0.5rem;
`;

const KEYBOARD_ROWS = [
  'qwertyuiop'.split(''),
  'asdfghjkl'.split(''),
  'zxcvbnm'.split(''),
];

interface WordleProps {
  onExit: () => void;
}

const Wordle = ({ onExit }: WordleProps) => {
  const [answer] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getLetterState = (guess: string, index: number): 'correct' | 'present' | 'absent' => {
    if (guess[index] === answer[index]) return 'correct';
    if (answer.includes(guess[index])) return 'present';
    return 'absent';
  };

  const getKeyState = useCallback((letter: string): 'correct' | 'present' | 'absent' | 'unused' => {
    let best: 'correct' | 'present' | 'absent' | 'unused' = 'unused';
    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === letter) {
          const state = getLetterState(guess, i);
          if (state === 'correct') return 'correct';
          if (state === 'present') best = 'present';
          if (state === 'absent' && best === 'unused') best = 'absent';
        }
      }
    }
    return best;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guesses, answer]);

  const updateStats = useCallback((didWin: boolean) => {
    const raw = localStorage.getItem('portfolio:wordle-stats');
    const stats = raw ? JSON.parse(raw) : { played: 0, won: 0, streak: 0 };
    stats.played++;
    if (didWin) { stats.won++; stats.streak++; }
    else { stats.streak = 0; }
    localStorage.setItem('portfolio:wordle-stats', JSON.stringify(stats));
  }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); onExit(); return; }
    if (gameOver) {
      if (e.key === 'Enter') {
        // Reload component
        onExit();
      }
      return;
    }

    if (e.key === 'Enter' && current.length === 5) {
      const newGuesses = [...guesses, current];
      setGuesses(newGuesses);
      if (current === answer) {
        setGameOver(true);
        setWon(true);
        updateStats(true);
      } else if (newGuesses.length >= MAX_GUESSES) {
        setGameOver(true);
        updateStats(false);
      }
      setCurrent('');
    } else if (e.key === 'Backspace') {
      setCurrent(prev => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && current.length < 5) {
      setCurrent(prev => prev + e.key.toLowerCase());
    }
  }, [current, guesses, answer, gameOver, onExit, updateStats]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const renderRow = (guess: string | null, rowIndex: number) => {
    const isCurrentRow = rowIndex === guesses.length && !gameOver;
    const cells = [];

    for (let i = 0; i < 5; i++) {
      let char = '';
      let state: 'correct' | 'present' | 'absent' | 'empty' | 'active' = 'empty';

      if (guess) {
        char = guess[i];
        state = getLetterState(guess, i);
      } else if (isCurrentRow && i < current.length) {
        char = current[i];
        state = 'active';
      }

      cells.push(<Cell key={i} $state={state}>{char}</Cell>);
    }

    return <Row key={rowIndex}>{cells}</Row>;
  };

  const rows = [];
  for (let i = 0; i < MAX_GUESSES; i++) {
    rows.push(renderRow(guesses[i] || null, i));
  }

  return (
    <Container ref={containerRef} tabIndex={0}>
      <Header>WORDLE — Guess the 5-letter word</Header>

      {rows}

      <Keyboard>
        {KEYBOARD_ROWS.map((row, i) => (
          <KeyRow key={i}>
            {row.map(letter => (
              <Key key={letter} $state={getKeyState(letter)}>{letter}</Key>
            ))}
          </KeyRow>
        ))}
      </Keyboard>

      {gameOver && (
        <Message>
          {won
            ? `You got it in ${guesses.length}/${MAX_GUESSES}!`
            : `The word was "${answer}".`}
        </Message>
      )}

      <Hint>
        {gameOver ? 'Press Escape to exit.' : 'Type a 5-letter word and press Enter. Escape to exit.'}
      </Hint>
    </Container>
  );
};

export default Wordle;
