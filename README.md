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
- **Course photography** for all three venues (Sagamore, Kettle Hills, FloGolf Lounge) is auto-indexed from `images/<course>/` and filtered to **high-resolution only** for crisp heroes, cards, and galleries.
- **Per-club nav branding** in the Tenfore Fox flow: each venue carries its own logo and nav color (Sagamore black, Kettle Hills `#0E319E`, FloGolf `#143620`).
- To re-skin, edit the `--color-brand-*` ramp in `src/styles/theme.css`; everything updates at the token level.

## Storybook categories

1. **Foundations** — Colors, Typography, Spacing, Effect Styles, Border, Radius, Logos, Icons, and a **Golf Courses** brand-asset index (auto-indexed photography + logos for **Sagamore**, **Kettle Hills**, and **FloGolf Lounge**), all driven by real theme tokens.
2. **Base Components** — buttons & button groups, inputs (text, group, date, file, number, payment, tags, pin), selects / combobox / multi-select, checkbox / radio / toggle, tags, badges & badge groups, avatars, tooltip, slider, social buttons, dropdowns, form, file-upload trigger, progress indicators.
3. **Application Components** — alerts, breadcrumbs, card headers, filter bars, progress steps, header navigations, modals, carousel, date picker (+ date-time), table, tabs, pagination, file upload, loading indicator, slideout menus, empty state.
4. **Account** — log in, sign up (incl. social-leading and header-nav variants), verification, and forgot-password pages.
5. **Tenfore Fox** — the productized booking experiences, skinned per-club via a shared brand override (`clubBrandStyle`) and chrome (`tenfore-chrome.tsx`):
   - **Tee Times** — **18 Holes (Sagamore)**, **3 Courses (Kettle Hills)**, and **FloGolf Indoor**. The course picker (a single-select checkmark menu) filters the live tee sheet (**All Courses** · **18 Holes** · a single nine); 18-hole and nine rounds intermix by tee time. FloGolf is a synced bay × time simulator grid with a tap-start/tap-end range selector, capacity/2-bay rules, and a top-center error toast.
   - **Checkout** & **Confirmation** — per-player checkout (editable players/transportation, hold countdown, FAQ) and a receipt-style confirmation (carousel, payment details, reviews) — both under the black confirmation header.
   - **Pro Shop** — a storefront (**Shop All** grid with working filters + saved/wishlist, **Product** detail with image gallery/lightbox and a reviews flyout) over a 105-item golf catalog (`src/components/store/store-catalog.ts`), brand logos matched to product type.
   - **Restaurant** — a dinner-reservation flow (Main Room / Bar seatings, a 14-day "book another day" grid that reacts to party size + seating) with **Today** and **Tomorrow** states.
6. **Booking** *(domain layer — hidden from the sidebar)* — the atomic tee-time domain that backs the screens: content/data (`src/components/booking/sagamore-data.ts` — course facts, green-fee rates, twilight pricing, add-ons, a deterministic tee-time generator, sample bookings), molecules (tee-time slot, date selector, player stepper, booking filters, summary, round card), and pages (Availability · Checkout · Confirmation · My Rounds).
7. **Explorations** *(pinned to the bottom)* — reference-driven design studies normalized to the core design system (same palette + font, layout differs). Currently visible: **Alt Concepts June**. Earlier GolfNow / Google / SevenRooms directions (and their combinations) are retained in code but hidden from the sidebar.

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
