# Project Development Guide: Terminal Portfolio

This guide documents the development process and the granular changes made to build the interactive terminal portfolio.

## Development History

### 1. Initial Project Scaffolding
- **Files**: `package.json`, `tsconfig*.json`, `vite.config.ts`, `index.html`, `eslint.config.js`
- **Purpose**: Set up the React + TypeScript development environment using Vite. Configured TypeScript for strict type checking and ESLint for code quality.
- **Commit Message**: `feat: initial project scaffold with Vite and TypeScript`

### 2. Styling and Theming
- **Files**: `src/styles/GlobalStyle.ts`, `src/styles/themes.ts`, `src/index.css`, `src/App.css`
- **Purpose**: Established the visual identity of the terminal. Defined themes (Dark, Light, Matrix) and global styles using `styled-components` and `styled-normalize`.
- **Commit Message**: `style: define global styles and themes`

### 3. Terminal Components and Types
- **Files**: `src/types/index.ts`, `src/components/Output.tsx`, `src/components/Prompt.tsx`, `src/components/Terminal.tsx`
- **Purpose**: Created the core UI components for the terminal. `Terminal.tsx` handles input and layout, `Output.tsx` renders command results, and `Prompt.tsx` displays the interactive prompt. Defined TypeScript interfaces for commands and history.
- **Commit Message**: `feat: implement terminal components and types`

### 4. Command Processing Logic
- **Files**: `src/hooks/useTerminal.ts`
- **Purpose**: Developed the custom hook `useTerminal` to manage the terminal's state (command history) and logic for processing user input.
- **Commit Message**: `feat: add useTerminal hook and command processing logic`

### 5. Portfolio Content and Commands
- **Files**: `src/utils/commands.tsx`
- **Purpose**: Defined the set of available terminal commands (`help`, `about`, `experience`, `projects`, etc.) and their corresponding React outputs, containing Francis's professional information.
- **Commit Message**: `feat: define portfolio commands and content`

### 6. Application Integration
- **Files**: `src/App.tsx`, `src/main.tsx`, `src/styled.d.ts`
- **Purpose**: Connected the `Terminal` component to the main `App` entry point and provided the `ThemeProvider` for consistent styling.
- **Commit Message**: `feat: connect terminal to App component`

### 7. Documentation and Workflow
- **Files**: `.gemini/GEMINI.md`, `.gitignore`, `README.md`
- **Purpose**: Added project-level documentation, configured Git to ignore build artifacts, and established a workflow mandate for granular commits.
- **Commit Message**: `docs: add project documentation and git workflow`

---

## Git Workflow Mandate
As specified in `.gemini/GEMINI.md`, every granular change must be committed to git with a descriptive message. This ensures a clear audit trail and easier debugging.
