import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{n,r,t as i}from"./sagamore-assets-6JmsGryk.js";import{n as a,t as o}from"./sagamore-logo-79WY9IO4.js";var s,c,l,u,d,f,p,m,h,g;e((()=>{s=t(),i(),a(),c={title:`Foundations/Golf Courses/Sagamore`,parameters:{layout:`fullscreen`,docs:{description:{component:"Sagamore Spring Golf Club brand imagery — auto-indexed from `images/sagamore/`.\nDrop new images into that folder and they appear here automatically, ready to\nreuse across stories and screens via `sagamoreAssets` / `SagamoreLogo`."}}}},l=({children:e})=>(0,s.jsx)(`div`,{className:`space-y-8 bg-primary p-8 text-primary`,children:e}),u=({title:e,count:t})=>(0,s.jsxs)(`div`,{className:`flex items-baseline justify-between border-b border-border-secondary pb-3`,children:[(0,s.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:e}),(0,s.jsxs)(`span`,{className:`text-xs text-tertiary tabular-nums`,children:[t,` image`,t===1?``:`s`]})]}),d=({assets:e})=>(0,s.jsx)(`div`,{className:`grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4`,children:e.map(e=>(0,s.jsxs)(`figure`,{className:`space-y-2`,children:[(0,s.jsx)(`div`,{className:`aspect-[4/3] overflow-hidden rounded-xl bg-secondary ring-1 ring-border-secondary`,children:(0,s.jsx)(`img`,{src:e.src,alt:e.name,className:`size-full object-cover`,loading:`lazy`})}),(0,s.jsx)(`figcaption`,{className:`truncate font-mono text-xs text-tertiary`,title:e.name,children:e.name})]},e.name))}),f={render:()=>(0,s.jsxs)(l,{children:[(0,s.jsx)(u,{title:`Sagamore Spring Golf Club — logo`,count:1}),(0,s.jsxs)(`div`,{className:`grid grid-cols-1 gap-6 sm:grid-cols-2`,children:[(0,s.jsxs)(`div`,{className:`space-y-3`,children:[(0,s.jsx)(`div`,{className:`flex items-center justify-center rounded-xl bg-primary p-12 ring-1 ring-border-secondary`,children:(0,s.jsx)(o,{className:`h-24 w-auto`})}),(0,s.jsx)(`p`,{className:`text-xs text-tertiary`,children:`On bg-primary`})]}),(0,s.jsxs)(`div`,{className:`space-y-3`,children:[(0,s.jsx)(`div`,{className:`flex items-center justify-center rounded-xl bg-primary-solid p-12 ring-1 ring-border-secondary`,children:(0,s.jsx)(o,{className:`h-24 w-auto`})}),(0,s.jsx)(`p`,{className:`text-xs text-tertiary`,children:`On bg-primary-solid`})]})]}),(0,s.jsxs)(`div`,{className:`flex flex-wrap items-end gap-6`,children:[(0,s.jsx)(o,{className:`h-10 w-auto`}),(0,s.jsx)(o,{className:`h-16 w-auto`}),(0,s.jsx)(o,{className:`h-24 w-auto`})]})]})},p={render:()=>(0,s.jsxs)(l,{children:[(0,s.jsx)(u,{title:`All Sagamore imagery`,count:n.length}),(0,s.jsx)(d,{assets:n})]})},m={render:()=>{let e=r(`photography`);return(0,s.jsxs)(l,{children:[(0,s.jsx)(u,{title:`Photography`,count:e.length}),(0,s.jsx)(d,{assets:e})]})}},h={render:()=>{let e=r(`dining`);return(0,s.jsxs)(l,{children:[(0,s.jsx)(u,{title:`Dining`,count:e.length}),(0,s.jsx)(d,{assets:e})]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Page>
            <SectionHeading title="Sagamore Spring Golf Club — logo" count={1} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                    <div className="flex items-center justify-center rounded-xl bg-primary p-12 ring-1 ring-border-secondary">
                        <SagamoreLogo className="h-24 w-auto" />
                    </div>
                    <p className="text-xs text-tertiary">On bg-primary</p>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-center rounded-xl bg-primary-solid p-12 ring-1 ring-border-secondary">
                        <SagamoreLogo className="h-24 w-auto" />
                    </div>
                    <p className="text-xs text-tertiary">On bg-primary-solid</p>
                </div>
            </div>
            <div className="flex flex-wrap items-end gap-6">
                <SagamoreLogo className="h-10 w-auto" />
                <SagamoreLogo className="h-16 w-auto" />
                <SagamoreLogo className="h-24 w-auto" />
            </div>
        </Page>
}`,...f.parameters?.docs?.source},description:{story:`The golf course logo on its own — light and dark surfaces.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Page>
            <SectionHeading title="All Sagamore imagery" count={sagamoreAssets.length} />
            <ImageGrid assets={sagamoreAssets} />
        </Page>
}`,...p.parameters?.docs?.source},description:{story:`Every indexed Sagamore image, for reference and reuse.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const assets = sagamoreImagesByCategory("photography");
    return <Page>
                <SectionHeading title="Photography" count={assets.length} />
                <ImageGrid assets={assets} />
            </Page>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Course and clubhouse photography.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const assets = sagamoreImagesByCategory("dining");
    return <Page>
                <SectionHeading title="Dining" count={assets.length} />
                <ImageGrid assets={assets} />
            </Page>;
  }
}`,...h.parameters?.docs?.source},description:{story:`Clubhouse dining imagery.`,...h.parameters?.docs?.description}}},g=[`Logo`,`AllImages`,`Photography`,`Dining`]}))();export{p as AllImages,h as Dining,f as Logo,m as Photography,g as __namedExportsOrder,c as default};