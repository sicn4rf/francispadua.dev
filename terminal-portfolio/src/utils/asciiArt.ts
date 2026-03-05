export const BANNER_LINES = [
  ' ███████████ ███████████     █████████   ██████   █████   █████████  █████  █████████ ',
  '░░███░░░░░░█░░███░░░░░███   ███░░░░░███ ░░██████ ░░███   ███░░░░░███░░███  ███░░░░░███',
  ' ░███   █ ░  ░███    ░███  ░███    ░███  ░███░███ ░███  ███     ░░░  ░███ ░███    ░░░ ',
  ' ░███████    ░██████████   ░███████████  ░███░░███░███ ░███          ░███ ░░█████████ ',
  ' ░███░░░█    ░███░░░░░███  ░███░░░░░███  ░███ ░░██████ ░███          ░███  ░░░░░░░░███',
  ' ░███  ░     ░███    ░███  ░███    ░███  ░███  ░░█████ ░░███     ███ ░███  ███    ░███',
  ' █████       █████   █████ █████   █████ █████  ░░█████ ░░█████████  █████░░█████████ ',
  '░░░░░       ░░░░░   ░░░░░ ░░░░░   ░░░░░ ░░░░░    ░░░░░   ░░░░░░░░░  ░░░░░  ░░░░░░░░░  ',
];

export const BOOT_LINES = [
  '[    0.000] Initializing PortfolioOS v2.0...',
  '[    0.142] Loading kernel modules.............. OK',
  '[    0.387] Mounting filesystem................. OK',
  '[    0.512] Starting audio subsystem............ OK',
  '[    0.698] Establishing network connection..... OK',
  '[    0.815] Loading user profile: francis....... OK',
  '[    1.000] System ready.',
];

export const NEOFETCH = `
       ████████████           visitor@portfolio
     ██            ██         -----------------
   ██    ██    ██    ██       OS:       PortfolioOS 2.0
  ██    ████  ████    ██      Host:     francis-terminal
  ██                  ██      Kernel:   React 19.2.0
  ██    ██████████    ██      Shell:    francis-sh
   ██    ██    ██    ██       Terminal: portfolio-term
     ██            ██         CPU:      Vite 7.2.4
       ████████████           Memory:   too many Chrome tabs
         ██    ██             Uptime:   since you opened this
         ██    ██             Theme:    cursor
`;

export const COW_TEMPLATE = (message: string) => {
  const line = '-'.repeat(message.length + 2);
  return `
 ${line}
< ${message} >
 ${line}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
};
