# Gemini Context: Terminal Portfolio

## Project Overview
This project is an interactive, terminal-style portfolio website for **Francis Escares Padua**. It is built using **React**, **TypeScript**, and **Vite**, offering a unique CLI-based user experience.

### Main Technologies
- **React 19**: Modern UI library for building the terminal interface.
- **TypeScript**: Ensures type safety across the codebase (configured with `verbatimModuleSyntax`).
- **Vite**: Provides a lightning-fast development environment and optimized production builds.
- **Styled Components**: Used for component-level styling and theme management.
- **Styled Normalize**: Provides a consistent baseline for CSS across different browsers.
- **Lodash**: Utilized for utility functions like unique ID generation.

## Git Workflow
- **Granular Commits**: Every granular change MUST be put into its own git commit. Commits should be frequent and describe the specific change made.
- **Commit Messages**: Use clear and descriptive commit messages that follow standard conventions (e.g., feat: ..., fix: ..., style: ..., refactor: ...).

## Project Structure
- `terminal-portfolio/src/components/`: Contains the core UI elements (`Terminal`, `Output`, `Prompt`).
- `terminal-portfolio/src/hooks/`: Houses custom hooks like `useTerminal.ts` which manages command history and processing logic.
- `terminal-portfolio/src/utils/`: Contains `commands.tsx` where all terminal commands (e.g., `help`, `about`, `projects`) and their corresponding React outputs are defined.
- `terminal-portfolio/src/styles/`: Defines `GlobalStyle.ts` and `themes.ts` (supporting Dark, Light, and Matrix themes).
- `terminal-portfolio/src/types/`: Centralized TypeScript interfaces and types.

## Key Commands
The following commands are defined in `terminal-portfolio/package.json`:

- **Development**: `npm run dev` or `pnpm dev`
  - Starts the Vite development server at `http://localhost:5173`.
- **Build**: `npm run build`
  - Compiles TypeScript and builds the project for production into the `dist/` directory.
- **Lint**: `npm run lint`
  - Runs ESLint to check for code quality issues.
- **Preview**: `npm run preview`
  - Previews the production build locally.

## Development Conventions
- **Type-Only Imports**: Due to `verbatimModuleSyntax: true` in `tsconfig.json`, always use `import type { ... }` when importing only TypeScript types or interfaces.
- **Command Extensibility**: New commands should be added to the `commands` object in `src/utils/commands.tsx`. Each command requires a `cmd` name, a `desc` (description), and an `action` function that returns a `React.ReactNode` or a `string`.
- **Styling**: Prefer `styled-components` for all styling. Use the `theme` prop to access colors and fonts defined in `src/styles/themes.ts`.
- **State Management**: The terminal state (command history) is managed within the `useTerminal` hook using React `useState` and `useCallback`.

## Portfolio Content
The portfolio contains information based on Francis's resume, including:
- **About**: UC Irvine CS student (Class of 2027), 3.9 GPA.
- **Experience**: AntAlmanac (Software Developer), Cyber@UCI (Infrastructure Engineer).
- **Projects**: Northstar (Go/React binary), Phoenix (MCP server), Cointegration Analyzer (C++/Python).
- **Competitions**: 1st Place at Western Regional CCDC.
- **Skills**: Go, C++, Python, TypeScript, Kubernetes, Docker, Ansible, etc.
