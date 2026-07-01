import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";import{a as n,i as r,n as i,r as a,t as o}from"./flogolf-logo-f3BinAEQ.js";var s,c,l,u,d,f,p,m,h;e((()=>{s=t(),n(),i(),c={title:`Foundations/Golf Courses/FloGolf Lounge`,parameters:{layout:`fullscreen`,docs:{description:{component:"FloGolf Lounge brand imagery — auto-indexed from `images/flogolf/`. Drop new\nimages into that folder and they appear here automatically, ready to reuse\nacross stories and screens via `flogolfAssets` / `FlogolfLogo`.\n\nhttps://maps.app.goo.gl/XMFfrrW3ut8vtJzT9"}}}},l=({children:e})=>(0,s.jsx)(`div`,{className:`space-y-8 bg-primary p-8 text-primary`,children:e}),u=({title:e,count:t})=>(0,s.jsxs)(`div`,{className:`flex items-baseline justify-between border-b border-border-secondary pb-3`,children:[(0,s.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:e}),(0,s.jsxs)(`span`,{className:`text-xs text-tertiary tabular-nums`,children:[t,` image`,t===1?``:`s`]})]}),d=({assets:e})=>(0,s.jsx)(`div`,{className:`grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4`,children:e.map(e=>(0,s.jsxs)(`figure`,{className:`space-y-2`,children:[(0,s.jsx)(`div`,{className:`aspect-[4/3] overflow-hidden rounded-xl bg-secondary ring-1 ring-border-secondary`,children:(0,s.jsx)(`img`,{src:e.src,alt:e.name,className:`size-full object-cover`,loading:`lazy`})}),(0,s.jsx)(`figcaption`,{className:`truncate font-mono text-xs text-tertiary`,title:e.name,children:e.name})]},e.name))}),f={render:()=>(0,s.jsxs)(l,{children:[(0,s.jsx)(u,{title:`FloGolf Lounge — logo`,count:1}),(0,s.jsxs)(`div`,{className:`grid grid-cols-1 gap-6 sm:grid-cols-2`,children:[(0,s.jsxs)(`div`,{className:`space-y-3`,children:[(0,s.jsx)(`div`,{className:`flex items-center justify-center rounded-xl bg-primary p-12 ring-1 ring-border-secondary`,children:(0,s.jsx)(o,{className:`h-24 w-auto`})}),(0,s.jsx)(`p`,{className:`text-xs text-tertiary`,children:`On bg-primary`})]}),(0,s.jsxs)(`div`,{className:`space-y-3`,children:[(0,s.jsx)(`div`,{className:`flex items-center justify-center rounded-xl bg-primary-solid p-12 ring-1 ring-border-secondary`,children:(0,s.jsx)(o,{className:`h-24 w-auto`})}),(0,s.jsx)(`p`,{className:`text-xs text-tertiary`,children:`On bg-primary-solid`})]})]}),(0,s.jsxs)(`div`,{className:`flex flex-wrap items-end gap-6`,children:[(0,s.jsx)(o,{className:`h-10 w-auto`}),(0,s.jsx)(o,{className:`h-16 w-auto`}),(0,s.jsx)(o,{className:`h-24 w-auto`})]})]})},p={render:()=>(0,s.jsxs)(l,{children:[(0,s.jsx)(u,{title:`All FloGolf Lounge imagery`,count:a.length}),(0,s.jsx)(d,{assets:a})]})},m={render:()=>{let e=r(`photography`);return(0,s.jsxs)(l,{children:[(0,s.jsx)(u,{title:`Photography`,count:e.length}),(0,s.jsx)(d,{assets:e})]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Page>
            <SectionHeading title="FloGolf Lounge — logo" count={1} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                    <div className="flex items-center justify-center rounded-xl bg-primary p-12 ring-1 ring-border-secondary">
                        <FlogolfLogo className="h-24 w-auto" />
                    </div>
                    <p className="text-xs text-tertiary">On bg-primary</p>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-center rounded-xl bg-primary-solid p-12 ring-1 ring-border-secondary">
                        <FlogolfLogo className="h-24 w-auto" />
                    </div>
                    <p className="text-xs text-tertiary">On bg-primary-solid</p>
                </div>
            </div>
            <div className="flex flex-wrap items-end gap-6">
                <FlogolfLogo className="h-10 w-auto" />
                <FlogolfLogo className="h-16 w-auto" />
                <FlogolfLogo className="h-24 w-auto" />
            </div>
        </Page>
}`,...f.parameters?.docs?.source},description:{story:`The venue logo on its own — light and dark surfaces.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Page>
            <SectionHeading title="All FloGolf Lounge imagery" count={flogolfAssets.length} />
            <ImageGrid assets={flogolfAssets} />
        </Page>
}`,...p.parameters?.docs?.source},description:{story:`Every indexed FloGolf Lounge image, for reference and reuse.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const assets = flogolfImagesByCategory("photography");
    return <Page>
                <SectionHeading title="Photography" count={assets.length} />
                <ImageGrid assets={assets} />
            </Page>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Lounge and venue photography.`,...m.parameters?.docs?.description}}},h=[`Logo`,`AllImages`,`Photography`]}))();export{p as AllImages,f as Logo,m as Photography,h as __namedExportsOrder,c as default};