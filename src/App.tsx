import { useState, useCallback } from 'react';
import { ThemeProvider } from 'styled-components';
import { Terminal } from './components/Terminal';
import { GlobalStyle } from './styles/GlobalStyle';
import { themes, cursorTheme } from './styles/themes';

function App() {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem('portfolio:theme') || 'cursor';
  });

  const theme = themes[themeName] || cursorTheme;

  const handleSetTheme = useCallback((name: string) => {
    setThemeName(name);
    localStorage.setItem('portfolio:theme', name);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Terminal currentTheme={themeName} setTheme={handleSetTheme} />
    </ThemeProvider>
  );
}

export default App;
