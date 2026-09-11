import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-BbsIfxGP.js";import{a as n,i as r,r as i,t as a}from"./mcg-assets-CcJxDQjX.js";var o,s,c,l,u,d,f,p;e((()=>{o=t(),a(),s={title:`Foundations/Golf Courses/MCG`,parameters:{layout:`fullscreen`,docs:{description:{component:"Montgomery County Golf (MCG) brand assets — the group logo, each course's\nbrand logo, and course photography. Auto-served from `images/mcg/` via the\n`mcg-images` staticDirs mapping; reuse across stories and screens via the\n`mcgCourses` / `mcgLogo` / `mcgPhotography` exports.\n\nMCG runs a portfolio of public courses across Montgomery County, MD.\nhttps://www.mcggolf.com/courses/all-mcg-golf-courses"}}}},c=({children:e})=>(0,o.jsx)(`div`,{className:`space-y-8 bg-primary p-8 text-primary`,children:e}),l=({title:e,count:t})=>(0,o.jsxs)(`div`,{className:`flex items-baseline justify-between border-b border-border-secondary pb-3`,children:[(0,o.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:e}),(0,o.jsxs)(`span`,{className:`text-xs text-tertiary tabular-nums`,children:[t,` item`,t===1?``:`s`]})]}),u={render:()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(l,{title:`Montgomery County Golf — group logo`,count:1}),(0,o.jsxs)(`div`,{className:`grid grid-cols-1 gap-6 sm:grid-cols-2`,children:[(0,o.jsxs)(`div`,{className:`space-y-3`,children:[(0,o.jsx)(`div`,{className:`flex items-center justify-center rounded-xl bg-primary p-12 ring-1 ring-border-secondary`,children:(0,o.jsx)(`img`,{src:r,alt:`Montgomery County Golf`,className:`h-20 w-auto`})}),(0,o.jsx)(`p`,{className:`text-xs text-tertiary`,children:`On bg-primary`})]}),(0,o.jsxs)(`div`,{className:`space-y-3`,children:[(0,o.jsx)(`div`,{className:`flex items-center justify-center rounded-xl bg-primary-solid p-12 ring-1 ring-border-secondary`,children:(0,o.jsx)(`img`,{src:r,alt:`Montgomery County Golf`,className:`h-20 w-auto`})}),(0,o.jsx)(`p`,{className:`text-xs text-tertiary`,children:`On bg-primary-solid`})]})]})]})},d={render:()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(l,{title:`MCG courses`,count:i.length}),(0,o.jsx)(`div`,{className:`grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4`,children:i.map(e=>(0,o.jsxs)(`figure`,{className:`space-y-3`,children:[(0,o.jsx)(`div`,{className:`flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-primary p-8 ring-1 ring-border-secondary`,children:(0,o.jsx)(`img`,{src:e.logo,alt:`${e.name} logo`,className:`max-h-full max-w-full object-contain`,loading:`lazy`})}),(0,o.jsxs)(`figcaption`,{children:[(0,o.jsx)(`p`,{className:`text-sm font-semibold text-primary`,children:e.name}),(0,o.jsx)(`p`,{className:`text-xs text-tertiary`,children:e.location}),(0,o.jsx)(`p`,{className:`mt-1 font-mono text-[11px] text-quaternary`,title:e.logo,children:e.logo})]})]},e.slug))})]})},f={render:()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(l,{title:`Course photography`,count:n.length}),(0,o.jsx)(`div`,{className:`grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4`,children:n.map(e=>(0,o.jsxs)(`figure`,{className:`space-y-2`,children:[(0,o.jsx)(`div`,{className:`aspect-[3/2] overflow-hidden rounded-xl bg-secondary ring-1 ring-border-secondary`,children:(0,o.jsx)(`img`,{src:e.src,alt:e.name,className:`size-full object-cover`,loading:`lazy`})}),(0,o.jsxs)(`figcaption`,{className:`text-xs text-tertiary`,children:[(0,o.jsx)(`span`,{className:`font-medium text-secondary`,children:e.course}),` · `,e.name]})]},e.src))})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Page>
            <SectionHeading title="Montgomery County Golf — group logo" count={1} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                    <div className="flex items-center justify-center rounded-xl bg-primary p-12 ring-1 ring-border-secondary">
                        <img src={mcgLogo} alt="Montgomery County Golf" className="h-20 w-auto" />
                    </div>
                    <p className="text-xs text-tertiary">On bg-primary</p>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-center rounded-xl bg-primary-solid p-12 ring-1 ring-border-secondary">
                        <img src={mcgLogo} alt="Montgomery County Golf" className="h-20 w-auto" />
                    </div>
                    <p className="text-xs text-tertiary">On bg-primary-solid</p>
                </div>
            </div>
        </Page>
}`,...u.parameters?.docs?.source},description:{story:`The MCG group logo on light and dark surfaces.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Page>
            <SectionHeading title="MCG courses" count={mcgCourses.length} />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                {mcgCourses.map(course => <figure key={course.slug} className="space-y-3">
                        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-primary p-8 ring-1 ring-border-secondary">
                            <img src={course.logo} alt={\`\${course.name} logo\`} className="max-h-full max-w-full object-contain" loading="lazy" />
                        </div>
                        <figcaption>
                            <p className="text-sm font-semibold text-primary">{course.name}</p>
                            <p className="text-xs text-tertiary">{course.location}</p>
                            <p className="mt-1 font-mono text-[11px] text-quaternary" title={course.logo}>
                                {course.logo}
                            </p>
                        </figcaption>
                    </figure>)}
            </div>
        </Page>
}`,...d.parameters?.docs?.source},description:{story:`Every MCG course's brand logo, with name + location.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Page>
            <SectionHeading title="Course photography" count={mcgPhotography.length} />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
                {mcgPhotography.map(photo => <figure key={photo.src} className="space-y-2">
                        <div className="aspect-[3/2] overflow-hidden rounded-xl bg-secondary ring-1 ring-border-secondary">
                            <img src={photo.src} alt={photo.name} className="size-full object-cover" loading="lazy" />
                        </div>
                        <figcaption className="text-xs text-tertiary">
                            <span className="font-medium text-secondary">{photo.course}</span> · {photo.name}
                        </figcaption>
                    </figure>)}
            </div>
        </Page>
}`,...f.parameters?.docs?.source},description:{story:`Course photography available in the asset set.`,...f.parameters?.docs?.description}}},p=[`GroupLogo`,`CourseLogos`,`Photography`]}))();export{d as CourseLogos,u as GroupLogo,f as Photography,p as __namedExportsOrder,s as default};