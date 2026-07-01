import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";var n,r,i,a,o,s,c,l,u,d,f;e((()=>{n=t(),r=[{name:`border-primary`,utility:`border-primary`},{name:`border-secondary`,utility:`border-secondary`},{name:`border-secondary_alt`,utility:`border-secondary_alt`},{name:`border-tertiary`,utility:`border-tertiary`},{name:`border-brand`,utility:`border-brand`},{name:`border-brand_alt`,utility:`border-brand_alt`},{name:`border-error`,utility:`border-error`},{name:`border-error_subtle`,utility:`border-error_subtle`}],i=[{utility:`border-0`,px:`0px`},{utility:`border`,px:`1px`},{utility:`border-2`,px:`2px`},{utility:`border-4`,px:`4px`},{utility:`border-8`,px:`8px`}],a=({name:e,utility:t})=>{let r=`--color-border-${e.replace(/^border-/,``)}`;return(0,n.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,n.jsx)(`div`,{className:t?`bg-primary rounded-lg size-28 border-2 ${t}`:`bg-primary rounded-lg size-28`,style:t?void 0:{border:`2px solid var(${r})`}}),(0,n.jsx)(`span`,{className:`text-xs font-mono text-tertiary`,children:e})]})},o=({utility:e,px:t})=>(0,n.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,n.jsx)(`div`,{className:`bg-primary rounded-lg size-28 border-primary ${e}`}),(0,n.jsxs)(`span`,{className:`text-xs font-mono text-tertiary`,children:[e,` (`,t,`)`]})]}),s=({children:e})=>(0,n.jsx)(`div`,{className:`grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4`,children:e}),c={title:`Foundations/Border`,parameters:{layout:`fullscreen`}},l={render:()=>(0,n.jsx)(`div`,{className:`bg-primary text-primary p-8 space-y-10`,children:(0,n.jsxs)(`div`,{className:`space-y-4`,children:[(0,n.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:`Border colors`}),(0,n.jsx)(s,{children:r.map(e=>(0,n.jsx)(a,{...e},e.name))})]})})},u={render:()=>(0,n.jsx)(`div`,{className:`bg-primary text-primary p-8 space-y-10`,children:(0,n.jsxs)(`div`,{className:`space-y-4`,children:[(0,n.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:`Border widths`}),(0,n.jsx)(s,{children:i.map(e=>(0,n.jsx)(o,{...e},e.utility))})]})})},d={render:()=>(0,n.jsxs)(`div`,{className:`bg-primary text-primary p-8 space-y-10`,children:[(0,n.jsxs)(`div`,{className:`space-y-4`,children:[(0,n.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:`Border colors`}),(0,n.jsx)(s,{children:r.map(e=>(0,n.jsx)(a,{...e},e.name))})]}),(0,n.jsxs)(`div`,{className:`space-y-4`,children:[(0,n.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:`Border widths`}),(0,n.jsx)(s,{children:i.map(e=>(0,n.jsx)(o,{...e},e.utility))})]})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="bg-primary text-primary p-8 space-y-10">
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-primary">Border colors</h2>
                <Grid>
                    {borderColors.map(token => <BorderColorTile key={token.name} {...token} />)}
                </Grid>
            </div>
        </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="bg-primary text-primary p-8 space-y-10">
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-primary">Border widths</h2>
                <Grid>
                    {borderWidths.map(token => <BorderWidthTile key={token.utility} {...token} />)}
                </Grid>
            </div>
        </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="bg-primary text-primary p-8 space-y-10">
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-primary">Border colors</h2>
                <Grid>
                    {borderColors.map(token => <BorderColorTile key={token.name} {...token} />)}
                </Grid>
            </div>
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-primary">Border widths</h2>
                <Grid>
                    {borderWidths.map(token => <BorderWidthTile key={token.utility} {...token} />)}
                </Grid>
            </div>
        </div>
}`,...d.parameters?.docs?.source}}},f=[`Colors`,`Widths`,`AllBorders`]}))();export{d as AllBorders,l as Colors,u as Widths,f as __namedExportsOrder,c as default};