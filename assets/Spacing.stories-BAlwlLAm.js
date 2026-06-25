import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";var n,r,i,a,o,s,c;e((()=>{n=t(),r=({n:e,utility:t})=>{let r=`${e*.25}rem`,i=`${e*4}px`;return(0,n.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,n.jsx)(`div`,{className:`flex h-3 w-48 items-center`,children:(0,n.jsx)(`div`,{className:`h-3 rounded-sm bg-brand-solid`,style:{width:`calc(var(--spacing) * ${e})`}})}),(0,n.jsxs)(`div`,{className:`font-mono text-xs text-tertiary`,children:[(0,n.jsx)(`span`,{className:`text-secondary`,children:e}),` · `,r,` · `,i,t?(0,n.jsxs)(`span`,{className:`text-quaternary`,children:[` · `,t]}):null]})]})},i=[{n:.5,utility:`p-0.5`},{n:1,utility:`p-1`},{n:1.5,utility:`p-1.5`},{n:2,utility:`p-2`},{n:2.5,utility:`p-2.5`},{n:3,utility:`p-3`},{n:3.5,utility:`p-3.5`},{n:4,utility:`p-4`},{n:5,utility:`p-5`},{n:6,utility:`p-6`},{n:8,utility:`p-8`},{n:10,utility:`p-10`},{n:12,utility:`p-12`},{n:16,utility:`p-16`},{n:20,utility:`p-20`},{n:24,utility:`p-24`},{n:32,utility:`p-32`},{n:40,utility:`p-40`},{n:48,utility:`p-48`},{n:64,utility:`p-64`},{n:80,utility:`p-80`},{n:96,utility:`p-96`}],a={title:`Foundations/Spacing`,parameters:{layout:`fullscreen`}},o={render:()=>(0,n.jsxs)(`div`,{className:`space-y-8 bg-primary p-8 text-primary`,children:[(0,n.jsxs)(`div`,{className:`space-y-1`,children:[(0,n.jsx)(`h1`,{className:`text-lg font-semibold text-primary`,children:`Spacing scale`}),(0,n.jsx)(`p`,{className:`font-mono text-xs text-tertiary`,children:`--spacing = 0.25rem = 4px · step N = calc(var(--spacing) * N) = N × 4px`})]}),(0,n.jsx)(`div`,{className:`space-y-3`,children:i.map(e=>(0,n.jsx)(r,{n:e.n,utility:e.utility},e.n))})]})},s={render:()=>(0,n.jsxs)(`div`,{className:`space-y-8 bg-primary p-8 text-primary`,children:[(0,n.jsxs)(`div`,{className:`space-y-1`,children:[(0,n.jsx)(`h1`,{className:`text-lg font-semibold text-primary`,children:`Usage example`}),(0,n.jsx)(`p`,{className:`font-mono text-xs text-tertiary`,children:`A tee-time card using p-4 (padding) and gap-3 (vertical rhythm).`})]}),(0,n.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-sm border border-secondary bg-primary p-4 sm:max-w-sm`,children:[(0,n.jsxs)(`div`,{className:`flex items-center justify-between gap-3`,children:[(0,n.jsx)(`span`,{className:`text-sm font-semibold text-primary`,children:`Sagamore — Front Nine`}),(0,n.jsx)(`span`,{className:`font-mono text-xs text-quaternary`,children:`gap-3`})]}),(0,n.jsx)(`p`,{className:`text-sm text-tertiary`,children:`Saturday · 7:40 AM · 4 players`}),(0,n.jsxs)(`div`,{className:`flex items-center gap-2 border-t border-secondary pt-3`,children:[(0,n.jsx)(`div`,{className:`size-8 rounded-sm bg-brand-solid`}),(0,n.jsx)(`span`,{className:`text-xs text-secondary`,children:`$120 per group`})]})]}),(0,n.jsxs)(`div`,{className:`font-mono text-xs text-tertiary`,children:[`Card padding: `,(0,n.jsx)(`span`,{className:`text-secondary`,children:`p-4`}),` (16px) · Item gap:`,` `,(0,n.jsx)(`span`,{className:`text-secondary`,children:`gap-3`}),` (12px) · Divider pad:`,` `,(0,n.jsx)(`span`,{className:`text-secondary`,children:`pt-3`}),` (12px)`]})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 bg-primary p-8 text-primary">
            <div className="space-y-1">
                <h1 className="text-lg font-semibold text-primary">Spacing scale</h1>
                <p className="font-mono text-xs text-tertiary">
                    --spacing = 0.25rem = 4px · step N = calc(var(--spacing) * N) = N × 4px
                </p>
            </div>
            <div className="space-y-3">
                {steps.map(step => <SpacingRow key={step.n} n={step.n} utility={step.utility} />)}
            </div>
        </div>
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 bg-primary p-8 text-primary">
            <div className="space-y-1">
                <h1 className="text-lg font-semibold text-primary">Usage example</h1>
                <p className="font-mono text-xs text-tertiary">
                    A tee-time card using p-4 (padding) and gap-3 (vertical rhythm).
                </p>
            </div>

            <div className="flex flex-col gap-3 rounded-sm border border-secondary bg-primary p-4 sm:max-w-sm">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-primary">Sagamore — Front Nine</span>
                    <span className="font-mono text-xs text-quaternary">gap-3</span>
                </div>
                <p className="text-sm text-tertiary">Saturday · 7:40 AM · 4 players</p>
                <div className="flex items-center gap-2 border-t border-secondary pt-3">
                    <div className="size-8 rounded-sm bg-brand-solid" />
                    <span className="text-xs text-secondary">$120 per group</span>
                </div>
            </div>

            <div className="font-mono text-xs text-tertiary">
                Card padding: <span className="text-secondary">p-4</span> (16px) · Item gap:{" "}
                <span className="text-secondary">gap-3</span> (12px) · Divider pad:{" "}
                <span className="text-secondary">pt-3</span> (12px)
            </div>
        </div>
}`,...s.parameters?.docs?.source}}},c=[`Scale`,`UsageExample`]}))();export{o as Scale,s as UsageExample,c as __namedExportsOrder,a as default};