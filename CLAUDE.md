# CLAUDE.md

Interactive terminal portfolio for Francis Padua. React 19 + TypeScript + Vite +
styled-components, deployed on Vercel. No backend.

## Conventions

- **`verbatimModuleSyntax` is on.** Import types with `import type { ... }`, always.
- **Styling is styled-components only.** Reach for `theme.colors.*` rather than
  hardcoding hex; every theme in `src/styles/themes.ts` implements the same
  `Theme` shape, so a literal colour will break under at least one theme.
- **Transient props take a `$` prefix** (`$active`, `$state`) so they don't reach the DOM.
- **Résumé facts live in `src/utils/content.ts`.** Commands, the virtual
  filesystem, and the side pane all read from it. Don't restate a date or a
  metric inline in a component — it will drift.

## Architecture

`useTerminal` owns command history and dispatch. It hands each command a
`TerminalContext` carrying the cwd, theme/sound setters, and two escape hatches:

- `openSidePanel(content)` — opens the split pane beside the terminal
- `setActiveComponent(node)` — takes over the terminal body (games, typing test)
- `setOverlay(node)` — draws *above* the terminal without unmounting it (matrix rain)

The context is held in a ref that is refreshed every render, so `processCommand`
stays referentially stable without a hand-maintained dependency list.

Games and the typing test are `React.lazy`, so they stay out of the initial chunk.

## Keyboard ownership

Only one thing may own the keyboard at a time, tracked by the terminal's `mode`:

| Mode | Owner |
|---|---|
| `NORMAL` | the prompt input |
| `GAME` | Snake / Wordle / typing test |
| `PANE` | the side pane |

Global listeners (the Konami sequence, `Ctrl-l`) must check the mode before
acting, or they will steal arrow keys from Snake and from history navigation.

## Testing

Vitest + jsdom. The pure logic is where the bugs have historically been — path
resolution, Wordle's duplicate-letter marking, typing-test accuracy — so that is
what the suite covers. `src/test/setup.ts` stubs `AudioContext` and `matchMedia`,
neither of which jsdom implements.

Run `npm run lint && npm run test && npm run build` before committing. CI runs
the same three.
