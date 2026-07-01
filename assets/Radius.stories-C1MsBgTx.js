import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";var n,r,i,a,o,s,c,l,u,d;e((()=>{n=t(),r={title:`Foundations/Radius`,parameters:{layout:`fullscreen`,docs:{description:{component:"The Sagamore border-radius scale. Every corner across the design system rounds\nto one of these steps — from crisp square cards (`rounded-none`) through the\ndefault `rounded-sm` used on most surfaces, up to the fully circular\n`rounded-full` used for avatars, dots, and pill buttons."}}}},i=[{name:`rounded-none`,rounded:`rounded-none`,value:`0px`},{name:`rounded-xs`,rounded:`rounded-xs`,value:`0.125rem (2px)`},{name:`rounded-sm`,rounded:`rounded-sm`,value:`0.25rem (4px)`},{name:`rounded-md`,rounded:`rounded-md`,value:`0.375rem (6px)`},{name:`rounded-lg`,rounded:`rounded-lg`,value:`0.5rem (8px)`},{name:`rounded-xl`,rounded:`rounded-xl`,value:`0.75rem (12px)`},{name:`rounded-2xl`,rounded:`rounded-2xl`,value:`1rem (16px)`},{name:`rounded-3xl`,rounded:`rounded-3xl`,value:`1.5rem (24px)`}],a={name:`rounded-full`,rounded:`rounded-full`,value:`9999px`},o=({name:e,rounded:t,value:r})=>(0,n.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,n.jsx)(`div`,{className:`size-28 bg-brand-solid ${t}`}),(0,n.jsxs)(`div`,{className:`text-xs font-mono text-tertiary`,children:[(0,n.jsx)(`div`,{children:e}),(0,n.jsx)(`div`,{children:r})]})]}),s=({tokens:e})=>(0,n.jsx)(`div`,{className:`grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6`,children:e.map(e=>(0,n.jsx)(o,{...e},e.name))}),c={render:()=>(0,n.jsxs)(`div`,{className:`bg-primary text-primary p-8 space-y-8`,children:[(0,n.jsx)(`h2`,{className:`text-lg font-semibold text-secondary`,children:`Radius scale`}),(0,n.jsx)(s,{tokens:i})]})},l={render:()=>(0,n.jsxs)(`div`,{className:`bg-primary text-primary p-8 space-y-8`,children:[(0,n.jsx)(`h2`,{className:`text-lg font-semibold text-secondary`,children:`rounded-full`}),(0,n.jsxs)(`div`,{className:`flex flex-wrap items-end gap-8`,children:[(0,n.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,n.jsx)(`div`,{className:`size-28 bg-brand-solid rounded-full`}),(0,n.jsxs)(`div`,{className:`text-xs font-mono text-tertiary`,children:[(0,n.jsx)(`div`,{children:a.name}),(0,n.jsx)(`div`,{children:a.value})]})]}),(0,n.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,n.jsx)(`div`,{className:`flex h-12 w-44 items-center justify-center bg-brand-solid rounded-full text-sm font-medium text-white`,children:`Book tee time`}),(0,n.jsxs)(`div`,{className:`text-xs font-mono text-tertiary`,children:[(0,n.jsx)(`div`,{children:a.name}),(0,n.jsx)(`div`,{children:`pill button`})]})]})]})]})},u={render:()=>(0,n.jsxs)(`div`,{className:`bg-primary text-primary p-8 space-y-8`,children:[(0,n.jsx)(`h2`,{className:`text-lg font-semibold text-secondary`,children:`All radii`}),(0,n.jsx)(s,{tokens:[...i,a]})]})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="bg-primary text-primary p-8 space-y-8">
            <h2 className="text-lg font-semibold text-secondary">Radius scale</h2>
            <Grid tokens={SCALE} />
        </div>
}`,...c.parameters?.docs?.source},description:{story:"The full radius scale from `rounded-none` through `rounded-3xl`.",...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="bg-primary text-primary p-8 space-y-8">
            <h2 className="text-lg font-semibold text-secondary">rounded-full</h2>
            <div className="flex flex-wrap items-end gap-8">
                <div className="flex flex-col gap-3">
                    <div className="size-28 bg-brand-solid rounded-full" />
                    <div className="text-xs font-mono text-tertiary">
                        <div>{FULL.name}</div>
                        <div>{FULL.value}</div>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex h-12 w-44 items-center justify-center bg-brand-solid rounded-full text-sm font-medium text-white">
                        Book tee time
                    </div>
                    <div className="text-xs font-mono text-tertiary">
                        <div>{FULL.name}</div>
                        <div>pill button</div>
                    </div>
                </div>
            </div>
        </div>
}`,...l.parameters?.docs?.source},description:{story:"`rounded-full` on a square (becomes a circle) and on a wide pill.",...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="bg-primary text-primary p-8 space-y-8">
            <h2 className="text-lg font-semibold text-secondary">All radii</h2>
            <Grid tokens={[...SCALE, FULL]} />
        </div>
}`,...u.parameters?.docs?.source},description:{story:`Every radius token in the system, scale and full together.`,...u.parameters?.docs?.description}}},d=[`Scale`,`Full`,`AllRadii`]}))();export{u as AllRadii,l as Full,c as Scale,d as __namedExportsOrder,r as default};