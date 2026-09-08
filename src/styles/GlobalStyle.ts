import { createGlobalStyle, keyframes, css } from 'styled-components';
import { normalize } from 'styled-normalize';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(3px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
`;

/** Guard for motion-sensitive rules: `${prefersReducedMotion} { animation: none; }` */
export const prefersReducedMotion = css`
  @media (prefers-reduced-motion: reduce)
`;

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.foreground};
    font-family: ${({ theme }) => theme.font};
    font-size: 14px;
    line-height: 1.6;
    overflow: hidden;
    transition: background-color 0.25s ease, color 0.25s ease;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
  }

  a {
    color: ${({ theme }) => theme.colors.link};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  /* Keyboard users need to see where they are; mouse users do not need the ring. */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: 2px;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.overlay};
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.muted};
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accent}44;
    color: ${({ theme }) => theme.colors.foreground};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
