# Tenfore Golf — Fox Design System

**▶ Storybook — the component library:** https://jg-tenfore.github.io/tf-fox-ds-v1/
**▶ MCG Prototype — the clickable product:** https://jg-tenfore.github.io/tf-fox-ds-v1/prototype/

A design system **and** a working product prototype for Tenfore's golf booking platform, built around
**Montgomery County Golf** — a nine-course public county system in Maryland (Falls Road, Northwest,
Hampshire Greens, Laytonsville, Little Bennett, Needwood, The Crossvines, Rattlewood, and Sligo Creek).

The two links above are built from **the same source tree**. There is no copy step between them, which is
the point: a component fixed in the prototype is fixed in Storybook, and vice versa.

---

## The two surfaces

| | Storybook | MCG Prototype |
| --- | --- | --- |
| **URL** | `/tf-fox-ds-v1/` | `/tf-fox-ds-v1/prototype/` |
| **What it is** | Every component and screen in isolation, with its states | A clickable seven-tab product you can walk end to end |
| **Who it's for** | Design and engineering review | Stakeholder demos — MCG, and internal scoping |
| **Built by** | `npm run build-storybook` (Vite) | `npm run build:prototype` (Next.js static export) |
| **Routing** | Story ids | Real URLs, real navigation |
| **State** | Per-story props | A persistent session in `localStorage` |

### How they stay 1:1

Each screen's UI lives in **one file** under `src/components/`, as a client component that renders its own
page shell:

```
src/components/mcg/tee-times/tee-sheet-screen.tsx     ← the screen (one copy)
        │
        ├── src/app/tee-times/page.tsx                ← the route: a thin wrapper
        └── src/stories/mcg/tee-times.stories.tsx     ← the story: renders the same component
```

Neither the route nor the story contains markup. Validate a change in either place and the other already
has it — drift isn't a process problem to manage, it's structurally impossible.

Two details make this work:

- **`asset()`** (`src/utils/asset.ts`) resolves brand imagery for both hosts. Storybook serves images at the
  site root via `staticDirs`; the prototype serves them from a nested `basePath` with trailing-slash routes,
  where a bare relative path would resolve against the current route. One call site, both correct.
- **`useSession()`** (`src/components/mcg/session.tsx`) returns an inert session when no provider is present,
  so a component that reads the cart works unchanged inside a story.

---

## Running it locally

```bash
npm install

npm run storybook        # component library      → http://localhost:6017
npm run dev              # MCG prototype          → http://localhost:3000

npm run build:prototype  # static export to out/
npm run build:pages      # both, combined into dist/ exactly as CI publishes it
```

`predev` / `prebuild` mirror `images/` and `creditCards/` into `public/` using the same mapping as
`.storybook/main.ts`, so both surfaces read identical files.

### Deploying

`.github/workflows/deploy-pages.yml` runs on push to `main` (or on demand): typecheck → build Storybook →
build the prototype → combine → publish to `gh-pages`. Both URLs update in one commit.

---

## The MCG Prototype

Every tab in the global nav works. Browsing is open — nothing is gated behind sign-in — and any credentials
are accepted.

| Route | What's there |
| --- | --- |
| `/` | Quick-book across all nine courses, the course portfolio with green fees, the Academy, resident rate |
| `/tee-times` | All nine sheets **intertwined into one board** sorted by time, course pills, resident-rate switch, per-course rate card |
| `/tee-times/checkout` | Per-player checkout — rate class per golfer, transportation, resident switch, hold countdown |
| `/tee-times/confirmation` | Receipt, add-to-calendar |
| `/shop`, `/shop/[slug]` | Pro shop storefront and product detail |
| `/cart`, `/cart/checkout`, `/cart/confirmation` | Cart through pickup-at-course checkout |
| `/events`, `/events/[id]` | County leagues, scrambles, championships, junior programs |
| `/calendar` | One month view across all nine courses — events, clinics and Academy programs |
| `/clinics`, `/clinics/[id]` | The county clinic program |
| `/instruction` | **MCG Academy** — the instructor roster, the front door to booking a lesson |
| `/instruction/pro/[id]` | Instructor profile — gallery, one-off reservations, availability, packages, programs, reviews |
| `/instruction/instructors/[id]` | The compact roster-faithful detail page (alternative layout, kept for comparison) |
| `/instruction/book` | Time → details → payment, with instructor and lesson already chosen |
| `/instruction/packages` | Lesson packages, and the three pricing models under evaluation |
| `/instruction/credits` | Lesson-credit wallet — balances per instructor |
| `/grill`, `/grill/order` | Course grills and snack bars — order ahead for the turn, and the pickup receipt |
| `/signin`, `/signup`, `/verify`, `/forgot-password` | The full account-creation path |
| `/account`, `/account/activity`, `/account/wallet`, `/account/settings` | Profile hub, history, lesson credits, settings |

### State that carries

The prototype keeps one object in `localStorage`, so a walkthrough behaves like an application rather than a
slide deck:

- Add to cart → the nav badge and total update, and the cart survives a refresh
- Book a tee time or a lesson → it appears in **Account → Activity**
- Buy a lesson package → credits appear in **Account → Wallet** and can be spent at lesson checkout
- Sign in → the nav swaps to the account menu
- **Account → Settings → Reset prototype data** clears everything for the next demo

---

## Known issues

Two things are deliberately left alone; neither is caused by the MCG work.

- **`clubBrandStyle` doesn't re-skin the light brand tokens.** It re-points the mid and
  solid brand tokens, but `bg-brand-primary` / `bg-brand-secondary` resolve through
  `--color-brand-50/100`, which are declared at `:root` — a custom property substitutes
  in the context of the element that *declares* it, so overriding the ramp further down
  has no effect. The derived aliases have to be overridden directly. Invisible for MCG
  (the default ramp is also green), but **Kettle Hills (blue) and FloGolf render green
  tints** behind selected states and `brand` badges.
- **Six Breadcrumbs stories fail** (`src/stories/Breadcrumbs.stories.tsx`). Pre-existing
  and unrelated — verified against a clean checkout before this session's work. Every
  other story passes.

## Stack

- **React 19** + TypeScript
- **Tailwind CSS v4** — fully token-driven theme (`src/styles/theme.css`)
- **React Aria Components** for accessibility and behavior
- **Untitled UI React** as the component foundation
- **Storybook 10** (`@storybook/nextjs-vite`) + **Next.js 16** static export, both to GitHub Pages

## Brand & theming

- **Monochrome + green accent.** The brand ramp is a fairway green, so every brand-derived token — CTAs,
  links, focus rings, toggles, selected states — renders green while text / background / border tokens stay
  neutral.
- **Per-club nav branding.** Each venue carries its own logo and nav color through `clubBrandStyle`:
  Sagamore black, Kettle Hills `#0E319E`, FloGolf `#143620`, MCG green `#1E8E4E`.
  *Note:* `clubBrandStyle` re-points the mid and solid brand tokens but not the light ones
  (`bg-brand-primary` / `bg-brand-secondary` resolve through `--color-brand-50/100` at `:root`), so a
  re-skinned club still shows the default ramp's light tints behind selected states.
- To re-skin globally, edit the `--color-brand-*` ramp in `src/styles/theme.css`.

## Storybook categories

1. **Foundations** — colors, typography, spacing, effect styles, border, radius, logos, icons, and a
   **Golf Courses** brand-asset index (auto-indexed photography + logos for Sagamore, Kettle Hills, FloGolf
   and MCG).
2. **Components** — base and application components under semantic sub-folders (Actions, Forms, Navigation,
   Feedback & Status, Layout & Structure, Media & Visuals).
3. **MCG Prototype** — every screen in the prototype, rendered from the same components the routes use.
4. **Instruction** — the MCG Academy category: a service-first lesson catalog, "any available instructor",
   the facility calendar, waitlists, and three package pricing models (credit book / volume discount /
   monthly plan) with a comparison page.
5. **Global Nav · Tee Time Checkout · Shop Checkout · Profile ∕ Account · Sign in ∕ Sign up** — the earlier
   Sagamore- and Kettle-Hills-skinned product explorations.
6. **Design Systems** — per-club style guides and color-theory studies.
7. **Explorations** — reference-driven design studies (GolfNow, Google, SevenRooms and combinations).

## Architecture

```
src/
├── app/                    Next.js routes — thin wrappers, no markup
├── components/
│   ├── base/               Core UI (Button, Input, Select, Badge, …)
│   ├── application/        Complex patterns (Modal, Table, Tabs, DatePicker, …)
│   ├── foundations/        Design tokens, logos, brand assets per club
│   ├── instruction/        MCG Academy — catalog, UI kit, two flows
│   ├── mcg/                MCG prototype — session, chrome, and one file per screen
│   ├── booking/ events/ store/   Domain catalogs and molecules
│   └── shared-assets/      Illustrations, patterns, credit cards
├── stories/                Storybook — renders the components above
├── styles/                 theme.css, globals.css, typography.css
└── utils/                  cx, asset, helpers
```

## Conventions

See `CLAUDE.md` for the full set. The load-bearing ones:

- **Semantic color tokens only** — `text-primary`, `bg-secondary`, `ring-secondary`. Never `text-gray-900`.
- **kebab-case filenames**, everywhere.
- **`Aria*` import prefix** for `react-aria-components`.
- `transition duration-100 ease-linear` for hover and state changes.
