# Terminal Portfolio Elevation Plan

> **Aesthetic:** Sleek Dev Tool (iTerm2/VS Code inspired)
> **Tech:** React 19 + TypeScript + Vite + styled-components
> **Deploy:** Vercel

---

## Phase 1: Terminal Chrome & Visual Polish

The terminal should look and feel like a real, polished terminal emulator. This phase wraps the existing terminal in a proper window frame and adds visual refinements.

### Task 1.1 — Window Frame Component

Create a `WindowFrame` component that wraps the terminal with:

- **Title bar** with macOS-style traffic light dots (red/yellow/green) — purely decorative
- Title text: `francis@portfolio: ~`
- Fake minimize/maximize/close buttons (right side)
- Subtle drop shadow and rounded corners on the outer frame
- Dark border matching the Catppuccin Frappé palette

### Task 1.2 — Status Bar Component

Add a bottom status bar to the terminal window with:

- Current "directory" path (e.g., `~/` or `~/projects`)
- Active theme name
- Sound toggle indicator (speaker icon on/off)
- Command count or session uptime
- Styled as a muted bar with small monospace text

### Task 1.3 — Welcome Banner with ASCII Art

Replace the plain welcome message with:

- A figlet-style ASCII art name banner (FRANCIS PADUA) using a clean font
- Subtitle: `CS @ UCI '27 | Software Developer | Infrastructure Engineer`
- `Type 'help' to get started.` hint
- Render with a typewriter animation (characters appear one at a time, fast)

### Task 1.4 — Improved Typography & Spacing

- Add Fira Code (or JetBrains Mono) via Google Fonts with ligature support
- Tune line-height, letter-spacing, and padding for readability
- Add subtle syntax-highlighting-style coloring to command outputs (section headers, values, links each get distinct colors)
- Improve the command output layout: consistent indentation, separators between sections

### Task 1.5 — Smooth Animations

- Fade-in for new command output blocks
- Cursor blink animation on the input line (block cursor, not default)
- Subtle slide-up for each new output entry
- Page load: terminal "boots up" with a brief fake boot sequence (2-3 lines, ~1 second total)

---

## Phase 2: Audio System

Keyboard sounds and feedback audio to make the terminal feel tactile.

### Task 2.1 — Audio Engine

- Create an `AudioManager` utility class (singleton) that handles loading and playing sounds
- Support volume control and mute toggle
- Store mute preference in localStorage
- Use the Web Audio API for low-latency playback

### Task 2.2 — Sound Effects

Source or generate short audio clips for:

- **Keystroke:** Mechanical keyboard click (play on each keypress in the input, with slight pitch randomization)
- **Command execute:** Subtle "enter" sound on pressing Enter
- **Error:** Short error beep for unknown commands
- **Success/special:** Soft chime for Easter eggs or game wins
- **Boot:** Brief startup sound on page load

### Task 2.3 — Sound Command & Status Bar Integration

- Add a `sound` command: `sound on`, `sound off`, `sound volume <0-100>`
- Update the status bar to show current sound state
- Persist preference to localStorage

---

## Phase 3: File System Simulation (Hybrid Mode)

Keep all existing commands working as-is, but add `cd`, `ls`, `cat` as alternative navigation that maps to the same content.

### Task 3.1 — Virtual File System Data Structure

Define an in-memory file tree:

```
~/
├── about.txt          → same content as `about` command
├── contact.txt        → same content as `contact` command
├── now.txt            → "now" page content
├── resume.pdf         → triggers download
├── projects/
│   ├── northstar.md
│   ├── phoenix.md
│   └── cointegration-analyzer.md
├── experience/
│   ├── antalmanac.md
│   └── cyberuci.md
├── education/
│   └── uci.md
├── skills.txt
├── competitions/
│   └── wrccdc.md
├── awards.txt
└── .secret            → Easter egg hidden file
```

### Task 3.2 — Implement `ls` Command

- Lists files/directories in the current virtual directory
- Support `ls -a` to show hidden files (dotfiles)
- Color directories differently from files
- Show file "sizes" (character count of content) if `-l` flag is used

### Task 3.3 — Implement `cd` Command

- Navigate between virtual directories
- Support `cd ..`, `cd ~`, `cd /`, relative and absolute paths
- Update the prompt to show current directory: `visitor@terminal:~/projects$`
- Update the status bar path indicator

### Task 3.4 — Implement `cat` Command

- Display the contents of a virtual file
- Render markdown-like content with styled formatting
- Error message for non-existent files
- Support `cat` on directories → "Is a directory"

### Task 3.5 — Implement `pwd` Command

- Print the current virtual working directory

---

## Phase 4: New Content & Commands

### Task 4.1 — `now` Command / now.txt

Add a "now" page with sections:

- **Building:** Current projects you're working on
- **Learning:** Technologies/topics you're studying
- **Reading/Listening:** Books, podcasts, music
- **Goals:** Short-term goals

Content (placeholder to be filled in by Francis):

```
CURRENTLY
=========

> Building
  - [project name] — description
  - [project name] — description

> Learning
  - [topic] — why/how

> Reading / Listening
  - [book/podcast/album]

> Goals
  - [goal] — progress
```

### Task 4.2 — `awards` Command / awards.txt

Display certifications and competition wins:

- WRCCDC 1st Place (Nov 2025) — 30-team Western Regional competition, Kubernetes/Docker security

### Task 4.3 — `history` Command

- Show the last N commands entered in the session
- Support `history clear` to reset

### Task 4.4 — Command History Navigation

- **Up/Down arrow keys** cycle through previously entered commands (like a real terminal)
- Store session command history in state

### Task 4.5 — Tab Autocomplete

- Pressing Tab auto-completes the current partial command
- If multiple matches, show all options (like bash)
- Also autocomplete file/directory paths for `cd`, `ls`, `cat`

### Task 4.6 — `theme` Command Enhancement

- `theme list` — show all available themes
- `theme set <name>` — switch theme live
- Show a preview swatch of colors for each theme in `theme list`
- Persist theme choice to localStorage

---

## Phase 5: Typing Test

A built-in typing test with two modes: word mode (Monkeytype-style) and code mode.

### Task 5.1 — Typing Test Engine

- Create a `TypingTest` component that renders inside the terminal output area
- Track: WPM (words per minute), raw WPM, accuracy %, characters typed, errors
- Timer options: 15s, 30s, 60s
- Real-time stats display during the test
- Results summary at the end with stats

### Task 5.2 — Word Mode

- Random common English words (pool of ~200 words)
- Words displayed in a flowing block, current word highlighted
- Correctly typed words turn green, errors turn red
- Current character position highlighted with an underline/cursor

### Task 5.3 — Code Mode

- Code snippets in Go, Python, TypeScript (Francis's languages)
- User picks language: `typingtest code go`, `typingtest code python`, `typingtest code ts`
- Snippets are real, readable code (function definitions, algorithms, etc.)
- Syntax-colored display of the target code

### Task 5.4 — Typing Test Command Interface

- `typingtest` or `tt` — starts word mode with 30s default
- `typingtest words 15|30|60` — word mode with specific time
- `typingtest code go|python|ts` — code mode
- `typingtest stats` — show best scores (persisted to localStorage)
- Escape key to quit mid-test

---

## Phase 6: Mini-Games

### Task 6.1 — Snake Game

- `snake` command launches the game inside the terminal
- ASCII-rendered grid (~30x15)
- Arrow key controls
- Score tracking, increasing speed
- Game over screen with score and "play again?" prompt
- High score persisted to localStorage
- Renders in a fixed-size box within the terminal output

### Task 6.2 — Wordle Clone

- `wordle` command starts a new game
- 6 guesses, 5-letter words
- Color-coded feedback: green (correct position), yellow (wrong position), gray (not in word)
- ASCII-rendered letter grid
- On-screen keyboard showing used letters
- Stats tracking: games played, win %, streak (persisted to localStorage)
- `wordle stats` to view stats

---

## Phase 7: Easter Eggs & Personality

### Task 7.1 — Hidden Commands

- `sudo` → "Nice try. You don't have root access here."
- `rm -rf /` → "I'm not falling for that one."
- `vim` → "You've entered vim. Good luck getting out. (just kidding, type 'q' or any command)"
- `cowsay <message>` → ASCII cow saying the message
- `neofetch` → System info card with ASCII art (shows "OS: PortfolioOS", "Shell: francis-sh", "Terminal: portfolio-term", "CPU: React 19", "Memory: too many Chrome tabs", etc.)
- `matrix` → Brief Matrix-style rain animation (3-5 seconds), then returns to normal

### Task 7.2 — Hidden Files

- `cat .secret` → A fun message or joke
- `cat .bashrc` → Fake bashrc with humorous aliases like `alias sleep="echo 'CS students don't sleep'"`

### Task 7.3 — Konami Code

- Entering the Konami code (↑↑↓↓←→←→BA) triggers a visual effect:
  - Screen briefly inverts colors or flashes
  - Displays a secret message or unlocks a hidden theme

---

## Phase 8: Performance, Polish & Deploy

### Task 8.1 — Responsive Design

- Mobile-friendly layout (terminal scales down, touch-friendly input)
- Virtual keyboard works properly on mobile
- Adjust font sizes for small screens
- Consider a "tap to focus" hint on mobile

### Task 8.2 — SEO & Meta Tags

- Add Open Graph meta tags (title, description, image)
- Generate an OG image showing the terminal with a sample command
- Add proper `<title>`, description, and favicon
- Structured data for personal portfolio

### Task 8.3 — Performance Optimization

- Lazy load game components and typing test (code-split with React.lazy)
- Virtualize long terminal output history (only render visible lines)
- Preload audio files
- Optimize ASCII art rendering

### Task 8.4 — Vercel Deployment

- Add `vercel.json` with SPA rewrites
- Configure build command and output directory
- Set up custom domain if available
- Add analytics (Vercel Analytics or simple page view tracking)

### Task 8.5 — Final QA Pass

- Test all commands end-to-end
- Test all games and typing test
- Test audio on different browsers
- Test theme switching
- Test file system navigation
- Test mobile experience
- Test keyboard shortcuts (arrow keys, tab, Konami code)
- Cross-browser check (Chrome, Firefox, Safari)

---

## Phase Summary

| Phase | Focus | Key Deliverables |
|-------|-------|-----------------|
| 1 | Visual Polish | Window frame, status bar, ASCII banner, animations, boot sequence |
| 2 | Audio | Keyboard sounds, error beeps, sound controls |
| 3 | File System | cd, ls, cat, pwd, virtual directory tree |
| 4 | Content & UX | now page, awards, command history, tab complete, theme command |
| 5 | Typing Test | Word mode, code mode, WPM tracking, leaderboard |
| 6 | Mini-Games | Snake, Wordle with score persistence |
| 7 | Easter Eggs | Hidden commands, neofetch, cowsay, Konami code |
| 8 | Ship It | Responsive, SEO, performance, Vercel deploy, QA |

---

## Technical Notes

- **State management:** Keep using React hooks + context. No need for Redux — the app is self-contained.
- **Audio files:** Use small .mp3 or .wav files in `/public/sounds/`. Can generate with free SFX tools or use royalty-free clips.
- **localStorage keys:** Namespace all keys with `portfolio:` prefix (e.g., `portfolio:theme`, `portfolio:sound`, `portfolio:snake-highscore`).
- **Component structure:** Each game and the typing test should be self-contained components that render inside the terminal output area and capture keyboard input while active.
- **File system:** The virtual FS is just a JSON tree in memory — no backend needed. Content maps directly to existing command outputs.
