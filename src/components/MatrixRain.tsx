import { useEffect, useRef } from 'react';
import styled from 'styled-components';

/**
 * Draws *over* the terminal rather than replacing it. The previous version was
 * mounted through setActiveComponent, which unmounts the terminal body — so
 * the banner, the scrollback and the prompt all vanished for four seconds and
 * the canvas painted black over what was left.
 */
const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  cursor: pointer;
`;

const Dismiss = styled.div`
  position: absolute;
  bottom: 34px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 41;
  color: #00ff41;
  font-size: 11px;
  letter-spacing: 1px;
  pointer-events: none;
  text-shadow: 0 0 8px rgba(0, 255, 65, 0.6);
`;

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

const MatrixRain = ({ duration = 6000, onDone }: { duration?: number; onDone: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Held in a ref so the animation effect never restarts when the parent
  // re-renders with a fresh callback identity.
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fontSize = 14;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const next = Math.ceil(width / fontSize);
      // Preserve existing column positions so a resize doesn't restart the rain.
      drops = Array.from({ length: next }, (_, i) =>
        i < columns ? drops[i] : Math.random() * -50,
      );
      columns = next;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    let animId = 0;
    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();

      // Low-alpha wash over the previous frame leaves the comet trails.
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[(Math.random() * CHARS.length) | 0];
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.94 ? '#d6ffd6' : '#00ff41';
        ctx.fillText(char, i * fontSize, y);

        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    };

    // Respect the OS setting: one static frame instead of an animation.
    draw();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cancelAnimationFrame(animId);
    }

    const finish = () => doneRef.current();
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      finish();
    };
    window.addEventListener('keydown', onKey, { once: true });
    canvas.addEventListener('pointerdown', finish, { once: true });

    const timer = setTimeout(finish, duration);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(timer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKey);
    };
  }, [duration]);

  return (
    <>
      <Canvas ref={canvasRef} />
      <Dismiss>press any key</Dismiss>
    </>
  );
};

export default MatrixRain;
