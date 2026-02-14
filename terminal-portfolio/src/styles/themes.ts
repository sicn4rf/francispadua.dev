import type { DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  colors: {
    background: '#1D2A35',
    foreground: '#E0E0E0',
    prompt: '#05CE91',
    command: '#F0F0F0',
    result: '#B0BEC5',
    error: '#FF5252',
    link: '#64B5F6',
  },
  font: "'Fira Code', 'Courier New', monospace",
};

export const lightTheme: DefaultTheme = {
  colors: {
    background: '#FFFFFF',
    foreground: '#333333',
    prompt: '#0066CC',
    command: '#000000',
    result: '#555555',
    error: '#D32F2F',
    link: '#0066CC',
  },
  font: "'Fira Code', 'Courier New', monospace",
};

export const matrixTheme: DefaultTheme = {
  colors: {
    background: '#0D0208',
    foreground: '#00FF41',
    prompt: '#008F11',
    command: '#00FF41',
    result: '#003B00',
    error: '#FF0000',
    link: '#008F11',
  },
  font: "'Courier New', monospace",
};
