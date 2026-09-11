import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-BbsIfxGP.js";import{a as n,h as r,o as i,v as a}from"./blocks-CacTolO1.js";var o=e((()=>{r()}));function s(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...a(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n,{title:`Introduction`}),`
`,`
`,`
`,`
`,`
`,`
`,(0,l.jsx)(`p`,{style:{fontSize:13,fontWeight:700,letterSpacing:`0.14em`,textTransform:`uppercase`,color:`#667085`,margin:`0 0 6px`},children:(0,l.jsx)(t.p,{children:`Tenfore Golf`})}),`
`,(0,l.jsx)(t.h1,{id:`fox-design-system`,children:`Fox Design System`}),`
`,(0,l.jsx)(`p`,{style:{fontSize:20,lineHeight:1.55,color:`#475467`,maxWidth:680,margin:`6px 0 0`},children:(0,l.jsx)(t.p,{children:`The component library, booking product, and multi-club theming system behind Tenfore's golf
experiences — built on Untitled UI, Tailwind CSS v4, and React Aria, and documented end-to-end here in Storybook.`})}),`
`,(0,l.jsx)(`p`,{style:{fontSize:14,color:`#98a2b3`,margin:`18px 0 0`},children:(0,l.jsx)(t.p,{children:`562 stories \xA0·\xA0 13 categories \xA0·\xA0 4 club colorways \xA0·\xA0 WCAG AA`})}),`
`,(0,l.jsxs)(`div`,{style:{display:`flex`,gap:16,flexWrap:`wrap`,margin:`28px 0 0`},children:[(0,l.jsxs)(`div`,{style:{flex:`1 1 320px`,border:`1px solid #e4e7ec`,borderRadius:12,padding:`18px 20px`,background:`#fff`},children:[(0,l.jsx)(`p`,{style:{fontSize:12,fontWeight:700,letterSpacing:`0.1em`,textTransform:`uppercase`,color:`#667085`,margin:0},children:(0,l.jsx)(t.p,{children:`You are here`})}),(0,l.jsx)(`p`,{style:{fontSize:17,fontWeight:600,color:`#101828`,margin:`8px 0 4px`},children:`Storybook — the library`}),(0,l.jsx)(`p`,{style:{fontSize:14,lineHeight:1.5,color:`#475467`,margin:0},children:(0,l.jsx)(t.p,{children:`Every component and screen in isolation, with all of its states. The place to review and validate a change.`})})]}),(0,l.jsxs)(`div`,{style:{flex:`1 1 320px`,border:`1px solid #1e8e4e`,borderRadius:12,padding:`18px 20px`,background:`#f6fef9`},children:[(0,l.jsx)(`p`,{style:{fontSize:12,fontWeight:700,letterSpacing:`0.1em`,textTransform:`uppercase`,color:`#1e8e4e`,margin:0},children:(0,l.jsx)(t.p,{children:`New`})}),(0,l.jsx)(`p`,{style:{fontSize:17,fontWeight:600,color:`#101828`,margin:`8px 0 4px`},children:(0,l.jsx)(d,{path:`/`,children:`MCG Prototype — the product ↗`})}),(0,l.jsx)(`p`,{style:{fontSize:14,lineHeight:1.5,color:`#475467`,margin:0},children:(0,l.jsx)(t.p,{children:`A clickable seven-tab booking experience for Montgomery County Golf. Real URLs, real navigation, and a session
that carries a cart and a booking history across the whole app.`})})]})]}),`
`,(0,l.jsx)(t.h2,{id:`the-mcg-prototype`,children:`The MCG Prototype`}),`
`,(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.strong,{children:`Montgomery County Golf`}),` is a nine-course public county system in Maryland — Falls Road, Northwest,
Hampshire Greens, Laytonsville, Little Bennett, Needwood, The Crossvines, Rattlewood, and Sligo Creek. The prototype is the whole
product assembled around it, and it's the artifact to put in front of a stakeholder when a Storybook story
isn't enough.`]}),`
`,(0,l.jsxs)(t.p,{children:[`Every tab in the global nav works. Browsing is open — nothing is gated — and `,(0,l.jsx)(t.strong,{children:`any credentials sign you in`}),`.`]}),`
`,(0,l.jsx)(p,{}),`
`,(0,l.jsx)(t.h3,{id:`state-that-carries`,children:`State that carries`}),`
`,(0,l.jsxs)(t.p,{children:[`The prototype keeps one object in `,(0,l.jsx)(t.code,{children:`localStorage`}),`, so a walkthrough behaves like an application rather than a
slide deck:`]}),`
`,(0,l.jsxs)(t.ul,{children:[`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Add to cart`}),` → the nav badge and total update, and the cart survives a refresh`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Book a tee time or a lesson`}),` → it shows up in `,(0,l.jsx)(t.strong,{children:`Account → Activity`})]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Buy a lesson package`}),` → credits land in `,(0,l.jsx)(t.strong,{children:`Account → Wallet`}),` and can be spent at lesson checkout`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Set county residency`}),` anywhere → every course reprices to the resident rate`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Account → Settings → Reset prototype data`}),` clears it all for the next demo`]}),`
`]}),`
`,(0,l.jsx)(t.h3,{id:`why-it-cant-drift-from-this-storybook`,children:`Why it can't drift from this Storybook`}),`
`,(0,l.jsxs)(t.p,{children:[`Both are built from the same source tree — there is no copy step between them. Each screen's UI lives in
`,(0,l.jsx)(t.strong,{children:`one file`}),` under `,(0,l.jsx)(t.code,{children:`src/components/`}),`, and neither the route nor the story contains any markup of its own:`]}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{children:`src/components/mcg/tee-times/tee-sheet-screen.tsx     ← the screen (one copy)
        │
        ├── src/app/tee-times/page.tsx                ← the route: a thin wrapper
        └── src/stories/mcg/tee-times.stories.tsx     ← the story: renders the same component
`})}),`
`,(0,l.jsxs)(t.p,{children:[`Validate a change in either place and the other already has it. The `,(0,l.jsx)(t.strong,{children:`MCG Prototype`}),` category in the
sidebar is those same screens, story by story.`]}),`
`,(0,l.jsxs)(t.p,{children:[`Two details make it work: `,(0,l.jsx)(t.code,{children:`asset()`}),` resolves brand imagery for both hosts (Storybook serves images at the
site root, the prototype from a nested base path), and `,(0,l.jsx)(t.code,{children:`useSession()`}),` returns an inert session when no
provider is present, so a component that reads the cart renders unchanged inside a story.`]}),`
`,(0,l.jsx)(t.h2,{id:`the-map`,children:`The map`}),`
`,(0,l.jsxs)(t.p,{children:[`| Category | Stories | What's inside |
| --- | --- | --- |
| `,(0,l.jsx)(t.strong,{children:`Foundations`}),` | 45 | Design tokens & primitives — Colors, Typography, Spacing, Radius, Border, Effect Styles, Icons, Logos, and Golf Courses brand data. |
| `,(0,l.jsx)(t.strong,{children:`MCG Prototype`}),` | 54 | Every screen in the prototype above, rendered from the same components the routes use. |
| `,(0,l.jsx)(t.strong,{children:`Instruction`}),` | 32 | The MCG Academy — lesson catalog, instructor selection, facility calendar, waitlists, and three package pricing models with a comparison page. |
| `,(0,l.jsx)(t.strong,{children:`Components`}),` | 255 | The Untitled UI core and application kit, in semantic sub-folders — Actions, Forms, Navigation, Feedback & Status, Layout & Structure, Media & Visuals. |
| `,(0,l.jsx)(t.strong,{children:`Design Systems`}),` | 70 | Colorways, color-theory combinations, and per-club style guides (Kettle Hills, Sagamore, FloGolf). |
| `,(0,l.jsx)(t.strong,{children:`Booking`}),` | 31 | The tee-time booking engine — molecules (search, calendars, slot cards) and full pages. |
| `,(0,l.jsx)(t.strong,{children:`Global Nav`}),` | 27 | The Sagamore/Kettle-Hills product surfaces — Tee Times, Pro Shop, Events, Calendar, Clinics, Restaurant. |
| `,(0,l.jsx)(t.strong,{children:`Profile ∕ Account`}),` | 15 | Overview, Activity, Wallet, Memberships, Golf Buddies, My Account. |
| `,(0,l.jsx)(t.strong,{children:`Explorations`}),` | 13 | Alternate concepts & integrations — GolfNow, Google, SevenRooms, and combined flows. |
| `,(0,l.jsx)(t.strong,{children:`Sign in ∕ Sign up`}),` | 9 | Authentication screens — log in, sign up, verification, forgot password. |
| `,(0,l.jsx)(t.strong,{children:`Tee Time Checkout · Shop Checkout`}),` | 10 | The earlier per-club checkout and confirmation flows. |`]}),`
`,(0,l.jsx)(t.h2,{id:`the-instruction-category`,children:`The Instruction category`}),`
`,(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.strong,{children:`Instruction`}),` is the MCG Academy, and the most recent product work. It answers a live question: whether
Tenfore can replace CoachNow for a 25-instructor county academy. Two flows, built to be argued over:`]}),`
`,(0,l.jsxs)(t.ul,{children:[`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Book a Lesson`}),` — service-first, so privates and multi-week clinics share one catalog and one checkout.
"Any available instructor" is a first-class choice rather than a fallback, which is the fix for landing on
one pro's empty calendar and starting over.`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Packages & Credits`}),` — three pricing models side by side (a credit book, a volume discount, a monthly
plan), with a `,(0,l.jsx)(t.strong,{children:`Model Comparison`}),` page scoring them across ten dimensions.`]}),`
`]}),`
`,(0,l.jsxs)(t.p,{children:[`Pricing is one academy menu plus a per-instructor adjustment, not a catalog per pro — see
`,(0,l.jsx)(t.strong,{children:`Instruction → Elements → Pricing Model`}),` for the argument in one table.`]}),`
`,(0,l.jsx)(t.h2,{id:`multi-club-theming--design-systems`,children:`Multi-club theming & Design Systems`}),`
`,(0,l.jsxs)(t.p,{children:[`A single helper, `,(0,l.jsx)(t.code,{children:`clubBrandStyle(color)`}),`, re-points the brand namespace tokens so an entire screen adopts a
club's color with no per-component edits. The `,(0,l.jsx)(t.strong,{children:`Design Systems`}),` category showcases this:`]}),`
`,(0,l.jsxs)(t.ul,{children:[`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Colorways`}),` — the full booking style guide rendered in each hue of the utility palette.`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Color Theory`}),` — analogous, complementary, and triadic harmonies derived from real OKLCH hue.`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Kettle Hills · Sagamore · FloGolf · MCG`}),` — the live per-club colorways (blue, near-black, green, green).`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Accessibility`}),` — every brand surface uses the `,(0,l.jsx)(t.code,{children:`-700`}),` shade and clears `,(0,l.jsx)(t.strong,{children:`WCAG AA (4.5:1)`}),`; each guide badges its worst-case contrast.`]}),`
`]}),`
`,(0,l.jsxs)(t.p,{children:[`One known limit: `,(0,l.jsx)(t.code,{children:`clubBrandStyle`}),` re-points the mid and solid brand tokens but not the light ones
(`,(0,l.jsx)(t.code,{children:`bg-brand-primary`}),` / `,(0,l.jsx)(t.code,{children:`bg-brand-secondary`}),` resolve through `,(0,l.jsx)(t.code,{children:`--color-brand-50/100`}),` at `,(0,l.jsx)(t.code,{children:`:root`}),`), so a
re-skinned club still shows the default ramp's light tints behind selected states.`]}),`
`,(0,l.jsx)(t.h2,{id:`foundations--components`,children:`Foundations & components`}),`
`,(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.strong,{children:`Foundations`}),` documents the tokens everything is built from — the semantic color system (`,(0,l.jsx)(t.code,{children:`text-primary`}),`,
`,(0,l.jsx)(t.code,{children:`bg-brand-solid`}),`, `,(0,l.jsx)(t.code,{children:`fg-success-primary`}),`, …), the type scale, spacing, radius, and the brand logos for each
golf course. `,(0,l.jsx)(t.strong,{children:`Components`}),` is the Untitled UI library those tokens dress.`]}),`
`,(0,l.jsx)(t.h2,{id:`how-its-built`,children:`How it's built`}),`
`,(0,l.jsxs)(t.ul,{children:[`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`React 19`}),` + `,(0,l.jsx)(t.strong,{children:`TypeScript`}),` throughout`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Tailwind CSS v4`}),` with a semantic, light/dark-aware token system (`,(0,l.jsx)(t.code,{children:`src/styles/theme.css`}),`, `,(0,l.jsx)(t.code,{children:`palette.css`}),`)`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`React Aria Components`}),` as the accessibility foundation (imported as `,(0,l.jsx)(t.code,{children:`Aria*`}),`)`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Storybook 10`}),` (`,(0,l.jsx)(t.code,{children:`@storybook/nextjs-vite`}),`) for documentation and visual testing`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.strong,{children:`Next.js 16`}),` static export for the prototype — both deploy to the same GitHub Pages site in one build`]}),`
`]}),`
`,(0,l.jsx)(t.h3,{id:`running-it-locally`,children:`Running it locally`}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-bash`,children:`npm run storybook   # this library      → http://localhost:6017
npm run dev         # the MCG prototype → http://localhost:3000
npm run build:pages # both, combined exactly as CI publishes them
`})}),`
`,(0,l.jsx)(t.h3,{id:`conventions`,children:`Conventions`}),`
`,(0,l.jsxs)(t.ul,{children:[`
`,(0,l.jsxs)(t.li,{children:[`Files are `,(0,l.jsx)(t.strong,{children:`kebab-case`}),`; React Aria imports are prefixed `,(0,l.jsx)(t.strong,{children:(0,l.jsx)(t.code,{children:`Aria*`})}),`.`]}),`
`,(0,l.jsxs)(t.li,{children:[`Style with `,(0,l.jsx)(t.strong,{children:`semantic tokens`}),` (`,(0,l.jsx)(t.code,{children:`text-secondary`}),`, `,(0,l.jsx)(t.code,{children:`bg-primary`}),`) — never literal color classes.`]}),`
`,(0,l.jsxs)(t.li,{children:[`Screens live in `,(0,l.jsx)(t.code,{children:`src/components/`}),`; routes and stories are thin wrappers that render them.`]}),`
`]})]})}function c(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,l.jsx)(t,{...e,children:(0,l.jsx)(s,{...e})}):s(e)}var l,u,d,f,p;e((()=>{l=t(),o(),i(),u=()=>{if(typeof window>`u`)return`https://jg-tenfore.github.io/tf-fox-ds-v1/prototype`;let{origin:e,pathname:t}=window.location,n=t.indexOf(`/iframe.html`),r=n>0?t.slice(0,n+1):`/`;return r===`/`?`http://localhost:3000`:`${e}${r}prototype`},d=({path:e=`/`,children:t})=>(0,l.jsx)(`a`,{href:`${u()}${e}`,target:`_blank`,rel:`noreferrer`,style:{fontWeight:600},children:t}),f=[[`Home`,`/`,`Quick-book across all nine courses, the course portfolio with green fees, the Academy`],[`Tee Times`,`/tee-times/`,`All nine sheets intertwined into one board sorted by the clock, course pills, a resident-rate switch, per-course rate card → checkout → confirmation`],[`Shop`,`/shop/`,`A 53-SKU county pro shop (25 of them MCG crest merchandise) → product → cart → pickup-at-course checkout`],[`Events`,`/events/`,`27 county events — leagues, the County Amateur, junior tour qualifiers, charity scrambles`],[`Instruction`,`/instruction/`,`The MCG Academy — 23 real instructors across nine courses; pick a pro, pick their lesson, then time, details and payment`],[`Calendar`,`/calendar/`,`One month view across all nine courses — events, clinics and Academy programs`],[`Clinics`,`/clinics/`,`14 county clinic programs, filtered by level, age and course`],[`Grill`,`/grill/`,`Course grills and snack bars, with order-ahead for the turn`],[`Sign up`,`/signup/`,`Sign up → verify → account, plus sign in and password reset`],[`Account`,`/account/`,`Profile hub, activity history, lesson-credit wallet, settings`]],p=()=>(0,l.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,margin:`16px 0 0`},children:[(0,l.jsx)(`thead`,{children:(0,l.jsxs)(`tr`,{children:[(0,l.jsx)(`th`,{style:{textAlign:`left`,padding:`8px 12px 8px 0`,borderBottom:`1px solid #e4e7ec`,fontSize:13,color:`#667085`,width:140},children:`Tab`}),(0,l.jsx)(`th`,{style:{textAlign:`left`,padding:`8px 0`,borderBottom:`1px solid #e4e7ec`,fontSize:13,color:`#667085`},children:`What's there`})]})}),(0,l.jsx)(`tbody`,{children:f.map(([e,t,n])=>(0,l.jsxs)(`tr`,{children:[(0,l.jsx)(`td`,{style:{padding:`10px 12px 10px 0`,borderBottom:`1px solid #f2f4f7`,verticalAlign:`top`,whiteSpace:`nowrap`},children:(0,l.jsxs)(d,{path:t,children:[e,` ↗`]})}),(0,l.jsx)(`td`,{style:{padding:`10px 0`,borderBottom:`1px solid #f2f4f7`,fontSize:14,lineHeight:1.55,color:`#475467`},children:n})]},t))})]})}))();export{d as Proto,f as TABS,p as TabTable,c as default,u as protoBase};