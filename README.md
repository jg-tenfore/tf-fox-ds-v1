# Tenfore — Sagamore Golf Design System

A React Native (Expo) design system for a golf tee-time booking experience,
built around a fictional reference course, **Sagamore Golf Club**. The visual
language is **monochromatic and minimal** — a single neutral grey ramp, no
accent hue, restrained type.

## Stack

| Layer | Choice |
| --- | --- |
| Runtime | [Expo](https://expo.dev) SDK 56 · React Native 0.85 · React 19.2 |
| Language | TypeScript 6 |
| Navigation | Expo Router (file-based, `src/app`) |
| Styling | [NativeWind](https://www.nativewind.dev) v4 (Tailwind v3 utilities for RN) |
| Theme | Monochromatic token set in [`tailwind.config.js`](./tailwind.config.js) |

> Native, not web: this targets iOS / Android (and RN-web). Untitled UI React was
> evaluated but is a web-only (DOM/Tailwind) library and is **not** compatible
> with React Native, so the system is built natively with NativeWind.

> ⚠️ Do not enable `experiments.reactCompiler` in `app.json` — React Compiler is
> currently incompatible with NativeWind's `className` transform.

## Getting started

```bash
npm install
npm run ios      # or: npm run android | npm run web
```

## Project structure

```
src/
  app/                     # Expo Router routes (index = the Sagamore tee sheet)
  design-system/
    components/            # Text, Button, Badge, Card, Input, TeeTimeCard
    data/sagamore.ts       # Fictional Sagamore Golf Club reference data
    lib/cx.ts              # className combiner
    index.ts               # public barrel
  components/ · hooks/ · constants/   # Expo template scaffolding
tailwind.config.js         # monochromatic palette + type/radius scale
```

## Design tokens

The palette is a single `mono` grey ramp (`mono-0` … `mono-1000`) with semantic
aliases used by components: `paper`, `canvas`, `ink`, `ink-muted`, `line`,
`primary`. See [`tailwind.config.js`](./tailwind.config.js).

## Reference domain

All copy, mock data, and edge cases revolve around Sagamore Golf Club — an
18-hole championship course and a 9-hole executive course — and the act of a
golfer booking a tee time (rates, twilight pricing, members-only slots, waitlists,
maintenance windows). See [`src/design-system/data/sagamore.ts`](./src/design-system/data/sagamore.ts).

## Roadmap

- [ ] Storybook for React Native — port every component into stories with
      golf-themed use cases and edge cases for QA.
- [ ] Expand the component set toward Untitled UI parity (avatars, toggles,
      modals, date/time pickers, tabs, etc.).
