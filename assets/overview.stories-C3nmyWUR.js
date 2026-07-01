import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";import{K as n,n as r}from"./dist-Ce7pAI2g.js";import{i,r as a}from"./badges-DTnZ6G-Y.js";import{i as o,n as s}from"./color-harmony-D4hk0bOr.js";var c,l,u,d,f,p,m;e((()=>{c=t(),r(),i(),o(),l={title:`Design Systems/Overview`,parameters:{layout:`fullscreen`,docs:{description:{component:`"Design Systems / Overview" — a concise index of everything in the Design
Systems category: the folders, the shared component catalog, the theming
mechanism, and the accessibility guarantees.`}}}},u=({title:e,children:t})=>(0,c.jsxs)(`section`,{className:`border-t border-secondary py-8 first:border-t-0 first:pt-0`,children:[(0,c.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:e}),(0,c.jsx)(`div`,{className:`mt-4`,children:t})]}),d=[{name:`Overview`,count:`this page`,blurb:`Index of the category — folders, components, theming, accessibility.`},{name:`Colorways`,count:`15 stories`,blurb:`The full Sagamore booking style guide themed in one hue each, drawn from the design-system utility palette (Brand, Red → Neutral).`},{name:`Color Theory`,count:`51 stories`,blurb:`The same style guide built from color-theory harmonies: Analogous, Complementary, and Triadic, each across all 17 chromatic base hues.`},{name:`Kettle Hills`,count:`1 story`,blurb:`Live club colorway — Kettle Hills blue (#0E319E).`},{name:`Sagamore`,count:`1 story`,blurb:`Live club colorway — Sagamore near-black.`},{name:`FloGolf Indoor`,count:`1 story`,blurb:`Live simulator colorway — FloGolf green (#143620), prices hidden.`}],f=[{name:`Global navigation`,source:`TopNav`,note:`Brand-colored top bar with the club logo and active-tab underline.`},{name:`Selector cells`,source:`DropdownCell`,note:`The booking bar — labeled cells with values and a chevron.`},{name:`Single-select menu`,source:`MenuRow`,note:`Dropdown rows with a brand-colored check on the selection.`},{name:`Date picker`,source:`CalendarPanel`,note:`Best-rate, today, and selected day render in the brand color.`},{name:`Slot / tee cards`,source:`TeeCell`,note:`Bookable cards; banners and selected fills take the accent color.`},{name:`Buttons`,source:`Button`,note:`Primary + link styles inherit the brand color; secondary/tertiary stay neutral.`},{name:`Footer`,source:`SiteFooter`,note:`Dark site footer with club contact details.`}],p={name:`Overview`,render:()=>(0,c.jsx)(`div`,{className:`min-h-dvh bg-secondary`,children:(0,c.jsxs)(`div`,{className:`mx-auto max-w-3xl px-6 py-12`,children:[(0,c.jsxs)(`header`,{children:[(0,c.jsx)(`p`,{className:`text-xs font-semibold tracking-wide text-quaternary uppercase`,children:`Design System`}),(0,c.jsx)(`h1`,{className:`mt-1 text-display-sm font-semibold text-primary`,children:`Design Systems — Overview`}),(0,c.jsxs)(`p`,{className:`mt-3 text-md text-tertiary`,children:[`One booking style guide, replayed across every colorway and color-theory combination the system supports. Each story is the same top-down component catalog wrapped in a single brand override, so you can read a whole colorway in one scroll. Every brand surface meets `,(0,c.jsx)(`span`,{className:`font-medium text-secondary`,children:`WCAG AA`}),`.`]}),(0,c.jsxs)(`div`,{className:`mt-4 flex flex-wrap items-center gap-2`,children:[(0,c.jsx)(a,{color:`success`,size:`md`,iconLeading:n,children:`WCAG AA`}),(0,c.jsxs)(`span`,{className:`text-sm text-tertiary`,children:[`69 themed guides · `,s.length,` chromatic hues · 1 theming helper`]})]})]}),(0,c.jsxs)(`div`,{className:`mt-10 flex flex-col`,children:[(0,c.jsx)(u,{title:`Folders`,children:(0,c.jsx)(`div`,{className:`overflow-hidden rounded-xl ring-1 ring-secondary`,children:(0,c.jsxs)(`table`,{className:`w-full text-left text-sm`,children:[(0,c.jsx)(`thead`,{className:`bg-secondary text-xs tracking-wide text-quaternary uppercase`,children:(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`th`,{className:`px-4 py-2.5 font-semibold`,children:`Folder`}),(0,c.jsx)(`th`,{className:`px-4 py-2.5 font-semibold`,children:`Stories`}),(0,c.jsx)(`th`,{className:`px-4 py-2.5 font-semibold`,children:`What it is`})]})}),(0,c.jsx)(`tbody`,{className:`divide-y divide-secondary bg-primary`,children:d.map(e=>(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{className:`px-4 py-3 font-semibold whitespace-nowrap text-primary`,children:e.name}),(0,c.jsx)(`td`,{className:`px-4 py-3 whitespace-nowrap text-tertiary tabular-nums`,children:e.count}),(0,c.jsx)(`td`,{className:`px-4 py-3 text-tertiary`,children:e.blurb})]},e.name))})]})})}),(0,c.jsxs)(u,{title:`Component catalog`,children:[(0,c.jsx)(`p`,{className:`mb-4 max-w-xl text-sm text-tertiary`,children:`Every guide documents these seven booking components in order, in the guide's colorway and styled states.`}),(0,c.jsx)(`ul`,{className:`flex flex-col gap-3`,children:f.map((e,t)=>(0,c.jsxs)(`li`,{className:`flex gap-3`,children:[(0,c.jsx)(`span`,{className:`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-fg-brand-primary tabular-nums ring-1 ring-secondary ring-inset`,children:t+1}),(0,c.jsxs)(`div`,{children:[(0,c.jsxs)(`p`,{className:`text-sm font-semibold text-primary`,children:[e.name,` `,(0,c.jsx)(`span`,{className:`font-mono text-xs font-normal text-quaternary`,children:e.source})]}),(0,c.jsx)(`p`,{className:`text-sm text-tertiary`,children:e.note})]})]},e.source))})]}),(0,c.jsx)(u,{title:`Theming`,children:(0,c.jsxs)(`p`,{className:`max-w-xl text-sm text-tertiary`,children:[`A single helper, `,(0,c.jsx)(`span`,{className:`font-mono text-xs text-secondary`,children:`clubBrandStyle(color)`}),`, re-points the brand namespace tokens (`,(0,c.jsx)(`span`,{className:`font-mono text-xs text-secondary`,children:`--text-color-brand-*`}),`,`,` `,(0,c.jsx)(`span`,{className:`font-mono text-xs text-secondary`,children:`--color-fg-brand-*`}),`,`,` `,(0,c.jsx)(`span`,{className:`font-mono text-xs text-secondary`,children:`--color-bg-brand-solid`}),`, and friends) to one color. Wrapping a guide in that style makes nav, buttons, checks, calendar accents, and card banners all follow the colorway — no per-component theming. The full 22-family Tailwind palette is authored explicitly in`,` `,(0,c.jsx)(`span`,{className:`font-mono text-xs text-secondary`,children:`palette.css`}),` so no hue gets tree-shaken away.`]})}),(0,c.jsx)(u,{title:`Accessibility`,children:(0,c.jsxs)(`p`,{className:`max-w-xl text-sm text-tertiary`,children:[`All brand surfaces use the `,(0,c.jsx)(`span`,{className:`font-mono text-xs text-secondary`,children:`-700`}),` shade, where white text and fills clear WCAG AA (4.5:1) against every hue. Contrast ratios are baked from the OKLCH/RGB token values in `,(0,c.jsx)(`span`,{className:`font-mono text-xs text-secondary`,children:`contrast.ts`}),`, and each guide header shows a badge with its worst-case ratio.`]})}),(0,c.jsx)(u,{title:`Source`,children:(0,c.jsxs)(`ul`,{className:`flex flex-col gap-1.5 font-mono text-xs text-tertiary`,children:[(0,c.jsx)(`li`,{children:`club-style-guide.tsx — the reusable top-down guide + GuideConfig`}),(0,c.jsx)(`li`,{children:`combo-style-guide.tsx — builds a guide from a base hue × theory`}),(0,c.jsx)(`li`,{children:`color-harmony.ts — wheel placement + analogous/complementary/triadic`}),(0,c.jsx)(`li`,{children:`contrast.ts — baked WCAG contrast ratios`}),(0,c.jsx)(`li`,{children:`tenfore-chrome.tsx — shared booking chrome (TopNav, TeeCell, clubBrandStyle…)`}),(0,c.jsx)(`li`,{children:`styles/palette.css — explicit Tailwind base color ramps`})]})})]})]})})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Overview",
  render: () => <div className="min-h-dvh bg-secondary">
            <div className="mx-auto max-w-3xl px-6 py-12">
                <header>
                    <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Design System</p>
                    <h1 className="mt-1 text-display-sm font-semibold text-primary">Design Systems — Overview</h1>
                    <p className="mt-3 text-md text-tertiary">
                        One booking style guide, replayed across every colorway and color-theory combination the system supports.
                        Each story is the same top-down component catalog wrapped in a single brand override, so you can read a whole
                        colorway in one scroll. Every brand surface meets <span className="font-medium text-secondary">WCAG AA</span>.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <BadgeWithIcon color="success" size="md" iconLeading={ShieldTick}>
                            WCAG AA
                        </BadgeWithIcon>
                        <span className="text-sm text-tertiary">69 themed guides · {WHEEL.length} chromatic hues · 1 theming helper</span>
                    </div>
                </header>

                <div className="mt-10 flex flex-col">
                    <Section title="Folders">
                        <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-secondary text-xs tracking-wide text-quaternary uppercase">
                                    <tr>
                                        <th className="px-4 py-2.5 font-semibold">Folder</th>
                                        <th className="px-4 py-2.5 font-semibold">Stories</th>
                                        <th className="px-4 py-2.5 font-semibold">What it is</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary bg-primary">
                                    {FOLDERS.map(f => <tr key={f.name}>
                                            <td className="px-4 py-3 font-semibold whitespace-nowrap text-primary">{f.name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-tertiary tabular-nums">{f.count}</td>
                                            <td className="px-4 py-3 text-tertiary">{f.blurb}</td>
                                        </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <Section title="Component catalog">
                        <p className="mb-4 max-w-xl text-sm text-tertiary">
                            Every guide documents these seven booking components in order, in the guide's colorway and styled states.
                        </p>
                        <ul className="flex flex-col gap-3">
                            {COMPONENTS.map((c, i) => <li key={c.source} className="flex gap-3">
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-fg-brand-primary tabular-nums ring-1 ring-secondary ring-inset">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-primary">
                                            {c.name} <span className="font-mono text-xs font-normal text-quaternary">{c.source}</span>
                                        </p>
                                        <p className="text-sm text-tertiary">{c.note}</p>
                                    </div>
                                </li>)}
                        </ul>
                    </Section>

                    <Section title="Theming">
                        <p className="max-w-xl text-sm text-tertiary">
                            A single helper, <span className="font-mono text-xs text-secondary">clubBrandStyle(color)</span>, re-points the
                            brand namespace tokens (<span className="font-mono text-xs text-secondary">--text-color-brand-*</span>,{" "}
                            <span className="font-mono text-xs text-secondary">--color-fg-brand-*</span>,{" "}
                            <span className="font-mono text-xs text-secondary">--color-bg-brand-solid</span>, and friends) to one color.
                            Wrapping a guide in that style makes nav, buttons, checks, calendar accents, and card banners all follow the
                            colorway — no per-component theming. The full 22-family Tailwind palette is authored explicitly in{" "}
                            <span className="font-mono text-xs text-secondary">palette.css</span> so no hue gets tree-shaken away.
                        </p>
                    </Section>

                    <Section title="Accessibility">
                        <p className="max-w-xl text-sm text-tertiary">
                            All brand surfaces use the <span className="font-mono text-xs text-secondary">-700</span> shade, where white
                            text and fills clear WCAG AA (4.5:1) against every hue. Contrast ratios are baked from the OKLCH/RGB token
                            values in <span className="font-mono text-xs text-secondary">contrast.ts</span>, and each guide header shows a
                            badge with its worst-case ratio.
                        </p>
                    </Section>

                    <Section title="Source">
                        <ul className="flex flex-col gap-1.5 font-mono text-xs text-tertiary">
                            <li>club-style-guide.tsx — the reusable top-down guide + GuideConfig</li>
                            <li>combo-style-guide.tsx — builds a guide from a base hue × theory</li>
                            <li>color-harmony.ts — wheel placement + analogous/complementary/triadic</li>
                            <li>contrast.ts — baked WCAG contrast ratios</li>
                            <li>tenfore-chrome.tsx — shared booking chrome (TopNav, TeeCell, clubBrandStyle…)</li>
                            <li>styles/palette.css — explicit Tailwind base color ramps</li>
                        </ul>
                    </Section>
                </div>
            </div>
        </div>
}`,...p.parameters?.docs?.source}}},m=[`Overview`]}))();export{p as Overview,m as __namedExportsOrder,l as default};