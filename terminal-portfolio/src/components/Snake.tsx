import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

const GRID_W = 30;
const GRID_H = 15;
const TICK_MS = 120;

type Point = { x: number; y: number };
type Dir = 'up' | 'down' | 'left' | 'right';

const Container = styled.div`
  font-family: ${({ theme }) => theme.font};
`;

const Grid = styled.pre`
  margin: 0;
  line-height: 1.15;
  font-size: 14px;
  letter-spacing: 1px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

const ScoreText = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: bold;
`;

const GameOver = styled.div`
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.yellow};
`;

const Hint = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
  margin-top: 0.5rem;
`;

function randomFood(snake: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * GRID_W), y: Math.floor(Math.random() * GRID_H) };
  } while (snake.some(s => s.x === p.x && s.y === p.y));
  return p;
}

interface SnakeProps {
  onExit: () => void;
}

const Snake = ({ onExit }: SnakeProps) => {
  const [snake, setSnake] = useState<Point[]>([{ x: 15, y: 7 }]);
  const [food, setFood] = useState<Point>({ x: 20, y: 7 });
  const [dir, setDir] = useState<Dir>('right');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore] = useState(() => {
    return parseInt(localStorage.getItem('portfolio:snake-highscore') || '0');
  });
  const dirRef = useRef<Dir>('right');
  const gameOverRef = useRef(false);

  useEffect(() => { dirRef.current = dir; }, [dir]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); onExit(); return; }
    if (gameOverRef.current && e.key === 'Enter') {
      setSnake([{ x: 15, y: 7 }]);
      setFood({ x: 20, y: 7 });
      setDir('right');
      dirRef.current = 'right';
      setGameOver(false);
      gameOverRef.current = false;
      setScore(0);
      return;
    }
    const d = dirRef.current;
    if ((e.key === 'ArrowUp' || e.key === 'w') && d !== 'down') { setDir('up'); dirRef.current = 'up'; }
    if ((e.key === 'ArrowDown' || e.key === 's') && d !== 'up') { setDir('down'); dirRef.current = 'down'; }
    if ((e.key === 'ArrowLeft' || e.key === 'a') && d !== 'right') { setDir('left'); dirRef.current = 'left'; }
    if ((e.key === 'ArrowRight' || e.key === 'd') && d !== 'left') { setDir('right'); dirRef.current = 'right'; }
  }, [onExit]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { ...prev[0] };
        const d = dirRef.current;
        if (d === 'up') head.y--;
        if (d === 'down') head.y++;
        if (d === 'left') head.x--;
        if (d === 'right') head.x++;

        // Wall collision
        if (head.x < 0 || head.x >= GRID_W || head.y < 0 || head.y >= GRID_H) {
          setGameOver(true);
          gameOverRef.current = true;
          return prev;
        }

        // Self collision
        if (prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          gameOverRef.current = true;
          return prev;
        }

        const newSnake = [head, ...prev];

        // Food
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            const hs = parseInt(localStorage.getItem('portfolio:snake-highscore') || '0');
            if (newScore > hs) localStorage.setItem('portfolio:snake-highscore', String(newScore));
            return newScore;
          });
          setFood(randomFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [gameOver, food]);

  // Render grid
  const renderGrid = () => {
    const lines: string[] = [];
    const border_h = '+' + '-'.repeat(GRID_W) + '+';
    lines.push(border_h);

    for (let y = 0; y < GRID_H; y++) {
      let row = '|';
      for (let x = 0; x < GRID_W; x++) {
        const isHead = snake[0].x === x && snake[0].y === y;
        const isBody = !isHead && snake.some(s => s.x === x && s.y === y);
        const isFood = food.x === x && food.y === y;
        if (isHead) row += '@';
        else if (isBody) row += 'o';
        else if (isFood) row += '*';
        else row += ' ';
      }
      row += '|';
      lines.push(row);
    }

    lines.push(border_h);
    return lines.join('\n');
  };

  return (
    <Container>
      <Header>
        <span>SNAKE</span>
        <span>Score: <ScoreText>{score}</ScoreText> | High: <ScoreText>{Math.max(score, highScore)}</ScoreText></span>
      </Header>
      <Grid>{renderGrid()}</Grid>
      {gameOver && (
        <GameOver>Game Over! Score: {score}</GameOver>
      )}
      <Hint>
        {gameOver ? 'Press Enter to restart or Escape to exit.' : 'Arrow keys / WASD to move. Escape to exit.'}
      </Hint>
    </Container>
  );
};

export default Snake;
