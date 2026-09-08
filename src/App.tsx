import { useState, useCallback, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { Terminal } from './components/Terminal';
import { GlobalStyle } from './styles/GlobalStyle';
import { themes, DEFAULT_THEME } from './styles/themes';

const STORAGE_KEY = 'portfolio:theme';

function App() {
  const [themeName, setThemeName] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && themes[saved] ? saved : DEFAULT_THEME;
  });

  const theme = themes[themeName] ?? themes[DEFAULT_THEME];

  const handleSetTheme = useCallback((name: string) => {
    if (!themes[name]) return;
    setThemeName(name);
    localStorage.setItem(STORAGE_KEY, name);
  }, []);

  // Keep the browser chrome (address bar, scrollbars) in step with the theme.
  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme.colors.background);
    document.documentElement.style.colorScheme =
      themeName === 'latte' ? 'light' : 'dark';
  }, [theme, themeName]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Terminal currentTheme={themeName} setTheme={handleSetTheme} />
    </ThemeProvider>
  );
}

export default App;
