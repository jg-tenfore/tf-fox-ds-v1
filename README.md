# Tenfore Golf — Fox Design System

**▶ Live Storybook environment: https://jg-tenfore.github.io/tf-fox-ds-v1/**

A design system **and** product exploration for a Resy/OpenTable-style **tee-time booking** experience at **Sagamore Spring Golf Club** (1287 Main St, Lynnfield, MA — public, 18 holes, par 70). It pairs a reusable, token-driven component library with end-to-end booking flows and a set of reference-driven design explorations.

---

## Stack

- **React 19** + TypeScript
- **Tailwind CSS v4** — fully token-driven theme (`src/styles/theme.css`)
- **React Aria Components** for accessibility and behavior
- **Untitled UI React** as the component foundation
- **Storybook 10** (`@storybook/nextjs-vite`), deployed to **GitHub Pages**

## Brand & theming

- **Monochrome + green accent.** The brand ramp is the club's fairway green (**#339C5D**), so every brand-derived token — primary CTAs, links, focus rings, toggles, active/selected states — renders green, while text / background / border tokens stay neutral.
- **Tenfore logo** as `TfLogo` (color / black / white wordmark) and `TfLogoMark` (square icon marks).
- **Sagamore course photography** is auto-indexed from `images/sagamore/` and filtered to **high-resolution only** for crisp heroes, cards, and galleries.
- To re-skin, edit the `--color-brand-*` ramp in `src/styles/theme.css`; everything updates at the token level.

## Storybook categories

1. **Foundations** — Colors, Typography, Spacing, Effect Styles, Border, Radius, Logos, Icons, and the Sagamore brand asset index (all driven by real theme tokens).
2. **Base Components** — buttons & button groups, inputs (text, group, date, file, number, payment, tags, pin), selects / combobox / multi-select, checkbox / radio / toggle, tags, badges & badge groups, avatars, tooltip, slider, social buttons, dropdowns, form, file-upload trigger, progress indicators.
3. **Application Components** — alerts, breadcrumbs, card headers, filter bars, progress steps, header navigations, modals, carousel, date picker (+ date-time), table, tabs, pagination, file upload, loading indicator, slideout menus, empty state.
4. **Account** — log in, sign up (incl. social-leading and header-nav variants), verification, and forgot-password pages.
5. **Booking** — the tee-time domain, built atomically:
   - **Content/data:** `src/components/booking/sagamore-data.ts` — course facts, green-fee rates (9/18 × weekday/weekend × walk/cart), twilight pricing, add-ons, a deterministic tee-time generator, and sample bookings.
   - **Molecules:** tee-time slot, date selector, player stepper, booking filters, booking summary, round card.
   - **Pages:** Availability · Checkout · Confirmation · My Rounds.
6. **Explorations** — real booking GUIs recreated for Sagamore and normalized to the core design system (same palette + font, only layout differs): **GolfNow · Google · SevenRooms · Tenfore**, plus combined **Google + SevenRooms** and **SevenRooms + GolfNow** directions.

## Architecture

- **Atomic design:** content/data → molecules → page templates. A single content source (`sagamore-data`) feeds every screen.
- **Strict token usage:** semantic color tokens only, the system body font, and centralized high-res imagery — so the whole library (and all explorations) share one visual language.

## Develop

```bash
npm install
npm run storybook        # dev server at http://localhost:6006
npm run build-storybook  # static build → storybook-static/
```

## Deploy

The built Storybook is served from the **`gh-pages`** branch via GitHub Pages. Because Pages serves at a repo subpath, the production build sets the Vite `base` to `/tf-fox-ds-v1/` (`.storybook/main.ts`) and the Sagamore image base is relative, so assets resolve under the subpath. To redeploy: `npm run build-storybook`, then publish `storybook-static/` to `gh-pages`.

---

Built on the [Untitled UI React](https://www.untitledui.com/react) starter kit (MIT).
