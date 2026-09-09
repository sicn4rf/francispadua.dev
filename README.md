# francispadua.dev

An interactive terminal portfolio. Type `help` and poke around.

Built with React 19, TypeScript, Vite and styled-components. No backend — the
filesystem, the command table, and the games all live in the bundle.

## Running it

```bash
npm install
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server on :5173 |
| `npm run build` | Typecheck, then production build to `dist/` |
| `npm run lint` | ESLint over `src/` |
| `npm run test` | Vitest suite |
| `npm run preview` | Serve the production build locally |

## Layout

```
src/
├── components/     Terminal chrome, side pane, games
├── hooks/          useTerminal — command dispatch, history, completion
├── utils/
│   ├── commands.tsx   The command table. Add commands here.
│   ├── fileSystem.ts  The virtual ~ tree that ls/cd/cat walk
│   ├── content.ts     Résumé data, in one place
│   └── audioManager.ts
├── styles/         Themes and global styles
└── types/
```

## Adding a command

Commands are entries in the `commands` record in `src/utils/commands.tsx`. Each
one takes `(args, ctx)` and returns a `ReactNode` or a string:

```tsx
whoami: {
  cmd: 'whoami',
  desc: 'Print the current user',
  action: () => 'visitor',
},
```

`ctx` carries the working directory, theme and sound setters, and the handles
for opening the side pane or taking over the screen with a full-screen component.

## Deployment

Pushes to `main` deploy to Vercel. `vercel.json` sets the SPA rewrite so deep
links fall through to `index.html`.
