export interface Command {
  cmd: string;
  desc: string;
  action: (args: string[]) => React.ReactNode | string;
}

export interface HistoryItem {
  id: string;
  command: string;
  output: React.ReactNode | string;
}

export interface Theme {
  colors: {
    background: string;
    foreground: string;
    prompt: string;
    command: string;
    result: string;
    error: string;
    link: string;
  };
  font: string;
}
