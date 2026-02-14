import { ThemeProvider } from 'styled-components';
import { Terminal } from './components/Terminal';
import { GlobalStyle } from './styles/GlobalStyle';
import { darkTheme } from './styles/themes';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <Terminal />
    </ThemeProvider>
  );
}

export default App;
