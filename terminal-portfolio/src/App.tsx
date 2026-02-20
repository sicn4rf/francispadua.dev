import { ThemeProvider } from 'styled-components';
import { Terminal } from './components/Terminal';
import { GlobalStyle } from './styles/GlobalStyle';
import { catppuccinFrappeTheme } from './styles/themes';

function App() {
  return (
    <ThemeProvider theme={catppuccinFrappeTheme}>
      <GlobalStyle />
      <Terminal />
    </ThemeProvider>
  );
}

export default App;
