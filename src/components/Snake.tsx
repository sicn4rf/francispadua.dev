import { useReducer, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { audioManager } from '../utils/audioManager';

const GRID_W = 32;
const GRID_H = 16;
const BASE_TICK = 130;
const MIN_TICK = 60;

type Point = { x: number; y: number };
type Dir = 'up' | 'down' | 'left' | 'right';

const HIGH_SCORE_KEY = 'portfolio:snake-highscore';

const readHighScore = () => {
  const raw = Number(localStorage.getItem(HIGH_SCORE_KEY));
  return Number.isFinite(raw) ? raw : 0;
};

interface State {
  snake: Point[];
  food: Point;
  dir: Dir;
  /** Applied at the next tick, so two quick turns can't fold the snake back on itself. */
  queued: Dir | null;
  score: number;
  highScore: number;
  over: boolean;
}

const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };

function randomFood(snake: Point[]): Point {
  const free: Point[] = [];
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      if (!snake.some(s => s.x === x && s.y === y)) free.push({ x, y });
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? { x: 0, y: 0 };
}

function initial(): State {
  const snake = [{ x: 8, y: 8 }];
  return {
    snake,
    food: randomFood(snake),
    dir: 'right',
    queued: null,
    score: 0,
    highScore: readHighScore(),
    over: false,
  };
}

type Action = { type: 'tick' } | { type: 'turn'; dir: Dir } | { type: 'restart' };

/**
 * The whole simulation is one pure reducer.
 *
 * The previous version ran the tick inside a `setSnake` updater and called
 * `setFood`/`setScore` from within it. State updaters must be pure — React 19
 * StrictMode double-invokes them, so a single apple could score twice and
 * reposition the food twice. Its effect also depended on `food`, tearing down
 * and rebuilding the interval on every apple and jittering the tick.
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'restart':
      return { ...initial(), highScore: state.highScore };

    case 'turn': {
      if (state.over) return state;
      // Compare against the direction actually in effect this tick.
      const effective = state.queued ?? state.dir;
      if (action.dir === OPPOSITE[effective] || action.dir === effective) return state;
      return { ...state, queued: action.dir };
    }

    case 'tick': {
      if (state.over) return state;

      const dir = state.queued ?? state.dir;
      const head = { ...state.snake[0] };
      if (dir === 'up') head.y--;
      if (dir === 'down') head.y++;
      if (dir === 'left') head.x--;
      if (dir === 'right') head.x++;

      const hitWall = head.x < 0 || head.x >= GRID_W || head.y < 0 || head.y >= GRID_H;
      // The tail tip vacates this tick, so it is only a collision if we grow.
      const ate = head.x === state.food.x && head.y === state.food.y;
      const body = ate ? state.snake : state.snake.slice(0, -1);
      const hitSelf = body.some(s => s.x === head.x && s.y === head.y);

      if (hitWall || hitSelf) return { ...state, dir, queued: null, over: true };

      const snake = [head, ...body];
      const score = ate ? state.score + 10 : state.score;

      return {
        ...state,
        snake,
        dir,
        queued: null,
        score,
        food: ate ? randomFood(snake) : state.food,
        highScore: Math.max(state.highScore, score),
      };
    }
  }
}

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

const Score = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: bold;
`;

const Board = styled.div`
  display: inline-block;
  line-height: 1;
  font-size: 15px;
  border: 1px solid ${({ theme }) => theme.colors.overlay};
  border-radius: 4px;
  padding: 6px 8px;
  overflow-x: auto;
  max-width: 100%;
`;

const Line = styled.div`
  white-space: pre;
  letter-spacing: 1px;
  height: 1.15em;
`;

const Head = styled.span`
  color: ${({ theme }) => theme.colors.green};
  font-weight: bold;
`;

const Body = styled.span`
  color: ${({ theme }) => theme.colors.teal};
`;

const Food = styled.span`
  color: ${({ theme }) => theme.colors.red};
`;

const GameOver = styled.div`
  margin-top: 0.75rem;
  color: ${({ theme }) => theme.colors.yellow};
`;

const Hint = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
  margin-top: 0.5rem;
`;

const KEY_TO_DIR: Record<string, Dir> = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right',
  k: 'up', j: 'down', h: 'left', l: 'right',
};

const Snake = ({ onExit }: { onExit: () => void }) => {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const scoreRef = useRef(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
        return;
      }
      // Keep arrow keys away from the terminal's history navigation behind us.
      e.stopPropagation();

      if (e.key === 'Enter') {
        dispatch({ type: 'restart' });
        return;
      }
      const dir = KEY_TO_DIR[e.key];
      if (dir) {
        e.preventDefault();
        dispatch({ type: 'turn', dir });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onExit]);

  // Speeds up as the snake grows; the interval is rebuilt only when it changes.
  const tickMs = Math.max(MIN_TICK, BASE_TICK - Math.floor(state.score / 30) * 8);

  useEffect(() => {
    if (state.over) return;
    const id = setInterval(() => dispatch({ type: 'tick' }), tickMs);
    return () => clearInterval(id);
  }, [state.over, tickMs]);

  // Persist outside the reducer — a reducer must not touch localStorage.
  useEffect(() => {
    if (state.score > scoreRef.current) {
      scoreRef.current = state.score;
      audioManager.keystroke();
    }
    if (state.score > readHighScore()) {
      localStorage.setItem(HIGH_SCORE_KEY, String(state.score));
    }
  }, [state.score]);

  useEffect(() => {
    if (state.over) audioManager.error();
  }, [state.over]);

  const cells = Array.from({ length: GRID_H }, (_, y) =>
    Array.from({ length: GRID_W }, (_, x) => {
      if (state.snake[0].x === x && state.snake[0].y === y) return 'head';
      if (state.snake.some(s => s.x === x && s.y === y)) return 'body';
      if (state.food.x === x && state.food.y === y) return 'food';
      return 'empty';
    }),
  );

  return (
    <Container>
      <Header>
        <span>SNAKE</span>
        <span>
          Score <Score>{state.score}</Score> · Best <Score>{state.highScore}</Score>
        </span>
      </Header>

      <Board role="img" aria-label={`Snake, score ${state.score}`}>
        {cells.map((row, y) => (
          <Line key={y}>
            {row.map((cell, x) => {
              if (cell === 'head') return <Head key={x}>█</Head>;
              if (cell === 'body') return <Body key={x}>▓</Body>;
              if (cell === 'food') return <Food key={x}>◆</Food>;
              return <span key={x}> </span>;
            })}
          </Line>
        ))}
      </Board>

      {state.over && <GameOver>Game over — {state.score} points.</GameOver>}

      <Hint>
        {state.over
          ? 'Enter to play again, Escape to exit.'
          : 'Arrows, WASD or HJKL to steer. Escape to exit.'}
      </Hint>
    </Container>
  );
};

export default Snake;
