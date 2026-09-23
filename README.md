# Tenfore Golf — Fox Design System

**▶ Storybook — the component library:** https://jg-tenfore.github.io/tf-fox-ds-v1/
**▶ MCG Prototype 1 — the clickable product:** https://jg-tenfore.github.io/tf-fox-ds-v1/prototype/
**▶ MCG Prototype 2 — a separate copy for independent changes:** https://jg-tenfore.github.io/tf-fox-ds-v1/prototype-2/
**▶ MCG Prototype 3 — the hybrid of 1 and 2:** https://jg-tenfore.github.io/tf-fox-ds-v1/prototype-3/

A design system **and** a working product prototype for Tenfore's golf booking platform, built around
**Montgomery County Golf** — a nine-course public county system in Maryland (Falls Road, Northwest,
Hampshire Greens, Laytonsville, Little Bennett, Needwood, The Crossvines, Rattlewood, and Sligo Creek).

Storybook and Prototype 1 are built from **the same source tree**. There is no copy step between them, which is
the point: a component fixed in the prototype is fixed in Storybook, and vice versa. Prototype 2 is the
exception by design — see [Prototype 2](#prototype-2).

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

npm run storybook          # component library      → http://localhost:6017
npm run dev                # MCG prototype 1        → http://localhost:3000
npm run dev:2              # MCG prototype 2        → http://localhost:3001
npm run dev:3              # MCG prototype 3        → http://localhost:3002

npm run build:prototype    # prototype 1 static export to out/
npm run build:prototype-2  # prototype 2 static export to prototype-2/out/
npm run build:prototype-3  # prototype 3 static export to prototype-3/out/
npm run build:pages        # all four, combined into dist/ exactly as CI publishes it
```

`predev` / `prebuild` mirror `images/` and `creditCards/` into `public/` using the same mapping as
`.storybook/main.ts`, so both surfaces read identical files.

### Deploying

`.github/workflows/deploy-pages.yml` runs on push to `main` (or on demand): typecheck → build Storybook →
build prototype 1 → build prototype 2 → build prototype 3 → combine → publish to `gh-pages`. All four URLs
update in one commit.

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
| `/instruction/review` | Post-lesson review prompt — the only way a verified review is created |
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

## Prototype 2

A second, independent copy of the MCG prototype, for changes that must not affect Prototype 1.

| | Prototype 1 | Prototype 2 | Prototype 3 |
| --- | --- | --- | --- |
| **URL** | `/tf-fox-ds-v1/prototype/` | `/tf-fox-ds-v1/prototype-2/` | `/tf-fox-ds-v1/prototype-3/` |
| **Local** | `npm run dev` → :3000 | `npm run dev:2` → :3001 | `npm run dev:3` → :3002 |
| **Screens** | `src/components/mcg`, `instruction` | `src/components/mcg-2`, `instruction-2` | `src/components/mcg-3`, `instruction-3` |
| **Routes** | `src/app` | `prototype-2/app` | `prototype-3/app` |
| **Session** | `mcg-prototype-session-v1` | `mcg-p2-…` | `mcg-p3-…` |
| **Storybook** | **MCG Prototype** stories | Linked only | **MCG Prototype 3** stories |

Prototype 2 started as an exact copy of Prototype 1 on 2026-09-15 (including the Academy review, group
pricing and sign-up-rule work).

**What's different so far — combined Instruction (from the Sep 15 check-in with Weston):**

- **One Instruction tab.** Clinics is no longer its own tab; `/clinics` opens Instruction filtered to group
  clinics, and clinic pages light the Instruction tab.
- **One catalog** (`src/components/mcg-2/instruction/offerings.ts`): Academy private lessons, Academy programs
  and county clinics as one list of offerings — type (golf, ready for others), format (private or group),
  instructors, courses, skill set, price.
- **Filter step by step** on `/instruction`: course first, then browse by **Services** or **Instructors**, then
  private/group and skill set (Beginner-friendly, Kid-friendly, Advanced, Short game & chipping, Putting,
  On-course). Filters stay in the URL.
- **Service first:** `/instruction/service/[id]` — choose an instructor or **Any available**, then book.
- **Instructor first:** the profile opens with "What they offer" — private lessons, group clinics, packages.
- **Square-style booking** (modelled on the Square Appointments screens in `references/091526`):
  Service → Instructor → Extras → Date & time → Checkout. The instructor step is a radio list with "Any
  available instructor" selected by default; Extras are optional add-ons (sample items); Date & time is a
  week strip with Morning / Afternoon / Evening times, "Go to next available" and a waitlist; Checkout puts
  contact info, golfers, payment (pay now, pay at the lesson, or a lesson credit), a note and the
  cancellation policy on one page. A lesson summary with edit pencils sits beside every step. Everything below the screens — `base`, `application`, `foundations`, the
tokens in `src/styles`, and the shared Explorations chrome — is still shared, so a design-system fix
reaches both. Edit files under the `-2` folders to change Prototype 2 only.

## Prototype 3 — the hybrid

Built after MCG reviewed both prototypes: Prototype 2's search and result tiles, Prototype 1's time board and
waitlist, plus their own asks. It started as a copy of Prototype 2 on 2026-09-23.

- **One search step that gathers everything.** Multi-select courses, formats, skill sets and days of the week,
  plus a date range — so nobody filters their way to an empty calendar three screens later. The search lives in
  the query string and is carried into the booking steps.
- **More formats:** private lessons, group clinics, junior camps, junior league and Op 36. The last three are
  **sample programs** MCG doesn't run today, each labelled as such on its page.
- **Services / Instructors** moved out of the right-hand corner to above the search.
- **Result tiles and instructor pricing** kept exactly as Prototype 2 had them.
- **No Extras step.** Extras are a field on the checkout screen instead.
- **Prototype 1's time board**, pre-filled from the search, with open times tinted and bordered so they stand
  out from booked ones.
- **Prototype 1's waitlist**, plus a date range, times of day and days of the week.
- **An account is required to book.** Sign-in sits inside checkout, so nothing already chosen is lost, and
  signing in fills the contact details.
- **Lesson packages** get a banner at the top of Instruction — bought ahead, then spent at checkout.

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
