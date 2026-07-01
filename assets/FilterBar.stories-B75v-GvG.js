import{i as e,l as t}from"./preload-helper-tpQASj4C.js";import{d as n,j as r}from"./iframe-JEutOpZn.js";import{$ as i,Qt as a,Tt as o,n as s,on as c}from"./dist-Ce7pAI2g.js";import{n as l,r as u,t as d}from"./cx-BIL-0sez.js";import{n as f,t as p}from"./button-C9G3p5hZ.js";import{i as m,t as h}from"./input-D4ddWauq.js";import{n as g,t as _}from"./select-ErSjk7Je.js";import{n as v,r as y,t as b}from"./button-group-CjlRA_ND.js";import{i as x,n as S,r as C,t as w}from"./tags-CUa8-Lcn.js";var T,E,D,O=e((()=>{T=n(),l(),E=u({root:`flex w-full flex-col gap-3`,toolbar:{base:`flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center`,compact:`gap-2 sm:gap-2`},search:{base:`w-full sm:max-w-xs sm:flex-1`,compact:`sm:max-w-56`},cluster:{base:`flex flex-wrap items-center gap-3 sm:ml-auto`,compact:`gap-2`},applied:{base:`flex w-full flex-wrap items-center gap-2`}}),D=({search:e,filters:t,actions:n,appliedTags:r,compact:i=!1,children:a,className:o,ref:s,...c})=>{let l=t||n||a;return(0,T.jsxs)(`div`,{ref:s,className:d(E.root,o),...c,children:[(0,T.jsxs)(`div`,{className:d(E.toolbar.base,i&&E.toolbar.compact),children:[e&&(0,T.jsx)(`div`,{className:d(E.search.base,i&&E.search.compact),children:e}),l&&(0,T.jsxs)(`div`,{className:d(E.cluster.base,i&&E.cluster.compact),children:[t,a,n]})]}),r&&(0,T.jsx)(`div`,{className:E.applied.base,children:r})]})},D.displayName=`FilterBar`,D.__docgenInfo={description:``,methods:[],displayName:`FilterBar`,props:{search:{required:!1,tsType:{name:`ReactNode`},description:"Search field slot — typically an `<Input icon={SearchLg} />`."},filters:{required:!1,tsType:{name:`ReactNode`},description:`Filter controls slot — Selects, a ButtonGroup segmented control, etc.`},actions:{required:!1,tsType:{name:`ReactNode`},description:`Action controls slot — e.g. a "Filters" button or "Add tee time" button.`},appliedTags:{required:!1,tsType:{name:`ReactNode`},description:"Applied-filter tags slot — typically a `TagGroup`/`TagList`."},compact:{required:!1,tsType:{name:`boolean`},description:`Compact mode tightens gaps and narrows the search field for dense layouts
such as embedded table headers.`,defaultValue:{value:`false`,computed:!1}},children:{required:!1,tsType:{name:`ReactNode`},description:`Escape hatch: arbitrary children rendered inside the toolbar cluster when
the named slots are not flexible enough.`},ref:{required:!1,tsType:{name:`Ref`,elements:[{name:`HTMLDivElement`}],raw:`Ref<HTMLDivElement>`},description:``},className:{required:!1,tsType:{name:`string`},description:``}},composes:[`Omit`]}})),k,A,j,M,N,P,F,I,L;e((()=>{k=n(),A=t(r()),s(),f(),y(),m(),g(),x(),O(),j={title:`Application Components/Filter Bars`,component:D,parameters:{layout:`padded`,docs:{description:{component:`The Filter Bar is the toolbar that sits above a tee sheet, member roster, or
results table. It composes the existing base components — a search Input, a
couple of filter Selects or a segmented ButtonGroup, a "Filters" button, and
an optional row of applied-filter Tags with a "Clear all" action. Everything
stays greyscale to match the monochromatic Sagamore clubhouse theme.`}}},argTypes:{compact:{control:`boolean`},search:{control:!1},filters:{control:!1},actions:{control:!1},appliedTags:{control:!1}},args:{compact:!1}},M=[{id:`north`,label:`North Course`},{id:`south`,label:`South Course`},{id:`links`,label:`The Links`},{id:`par3`,label:`Par-3 Short Course`}],N={args:{search:(0,k.jsx)(h,{icon:i,placeholder:`Search the sheet…`,"aria-label":`Search`}),filters:(0,k.jsx)(_,{"aria-label":`Course`,placeholder:`All courses`,items:M,children:e=>(0,k.jsx)(_.Item,{id:e.id,children:e.label})}),actions:(0,k.jsx)(p,{color:`secondary`,iconLeading:c,children:`Filters`})}},P={render:e=>{let[t,n]=(0,A.useState)(new Set([`18`]));return(0,k.jsx)(D,{...e,search:(0,k.jsx)(h,{icon:i,placeholder:`Search members…`,"aria-label":`Search members`}),filters:(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(_,{"aria-label":`Course`,placeholder:`All courses`,icon:o,items:M,children:e=>(0,k.jsx)(_.Item,{id:e.id,children:e.label})}),(0,k.jsxs)(b,{selectedKeys:t,onSelectionChange:e=>n(e),children:[(0,k.jsx)(v,{id:`9`,children:`9 holes`}),(0,k.jsx)(v,{id:`18`,children:`18 holes`})]})]}),actions:(0,k.jsx)(p,{color:`secondary`,iconLeading:c,children:`Filters`})})}},F={render:e=>{let[t,n]=(0,A.useState)([{id:`north`,label:`North Course`},{id:`morning`,label:`Before 10:00 AM`},{id:`members`,label:`Members only`},{id:`18`,label:`18 holes`}]),r=e=>n(t=>t.filter(t=>t.id!==e));return(0,k.jsx)(D,{...e,search:(0,k.jsx)(h,{icon:i,placeholder:`Search members…`,"aria-label":`Search members`}),filters:(0,k.jsx)(_,{"aria-label":`Course`,placeholder:`All courses`,icon:a,items:M,children:e=>(0,k.jsx)(_.Item,{id:e.id,children:e.label})}),actions:(0,k.jsx)(p,{color:`secondary`,iconLeading:c,children:`Filters`}),appliedTags:t.length>0&&(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(S,{label:`Applied filters`,onRemove:e=>[...e].forEach(e=>r(String(e))),children:(0,k.jsx)(C,{items:t,className:`flex flex-wrap items-center gap-2`,children:e=>(0,k.jsx)(w,{id:e.id,onClose:r,children:e.label})})}),(0,k.jsx)(p,{color:`link-gray`,size:`sm`,onClick:()=>n([]),children:`Clear all`})]})})}},I={args:{compact:!0,search:(0,k.jsx)(h,{size:`sm`,icon:i,placeholder:`Search…`,"aria-label":`Search`}),filters:(0,k.jsx)(_,{size:`sm`,"aria-label":`Course`,placeholder:`All courses`,items:M,children:e=>(0,k.jsx)(_.Item,{id:e.id,children:e.label})}),actions:(0,k.jsx)(p,{size:`sm`,color:`secondary`,iconLeading:c,children:`Filters`})}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    search: <Input icon={SearchLg} placeholder="Search the sheet…" aria-label="Search" />,
    filters: <Select aria-label="Course" placeholder="All courses" items={courses}>
                {item => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>,
    actions: <Button color="secondary" iconLeading={FilterFunnel01}>
                Filters
            </Button>
  }
}`,...N.parameters?.docs?.source},description:{story:"Bare playground — wire up the slots you need and tweak `compact` in controls.",...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [holes, setHoles] = useState<Set<string>>(new Set(["18"]));
    return <FilterBar {...args} search={<Input icon={SearchLg} placeholder="Search members…" aria-label="Search members" />} filters={<>
                        <Select aria-label="Course" placeholder="All courses" icon={MarkerPin01} items={courses}>
                            {item => <Select.Item id={item.id}>{item.label}</Select.Item>}
                        </Select>

                        <ButtonGroup selectedKeys={holes} onSelectionChange={keys => setHoles(keys as Set<string>)}>
                            <ButtonGroupItem id="9">9 holes</ButtonGroupItem>
                            <ButtonGroupItem id="18">18 holes</ButtonGroupItem>
                        </ButtonGroup>
                    </>} actions={<Button color="secondary" iconLeading={FilterFunnel01}>
                        Filters
                    </Button>} />;
  }
}`,...P.parameters?.docs?.source},description:{story:`The everyday tee-sheet toolbar: search by member, pick a course, choose how
many holes the group is playing, then open advanced Filters.`,...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [tags, setTags] = useState([{
      id: "north",
      label: "North Course"
    }, {
      id: "morning",
      label: "Before 10:00 AM"
    }, {
      id: "members",
      label: "Members only"
    }, {
      id: "18",
      label: "18 holes"
    }]);
    const removeTag = (id: string) => setTags(prev => prev.filter(t => t.id !== id));
    return <FilterBar {...args} search={<Input icon={SearchLg} placeholder="Search members…" aria-label="Search members" />} filters={<Select aria-label="Course" placeholder="All courses" icon={Flag05} items={courses}>
                        {item => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>} actions={<Button color="secondary" iconLeading={FilterFunnel01}>
                        Filters
                    </Button>} appliedTags={tags.length > 0 && <>
                            <TagGroup label="Applied filters" onRemove={keys => [...keys].forEach(k => removeTag(String(k)))}>
                                <TagList items={tags} className="flex flex-wrap items-center gap-2">
                                    {item => <Tag id={item.id} onClose={removeTag}>
                                            {item.label}
                                        </Tag>}
                                </TagList>
                            </TagGroup>

                            <Button color="link-gray" size="sm" onClick={() => setTags([])}>
                                Clear all
                            </Button>
                        </>} />;
  }
}`,...F.parameters?.docs?.source},description:{story:`After a few filters are applied, surface them as removable Tag chips with a
"Clear all" link — so the starter can see exactly which groups are showing.`,...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    compact: true,
    search: <Input size="sm" icon={SearchLg} placeholder="Search…" aria-label="Search" />,
    filters: <Select size="sm" aria-label="Course" placeholder="All courses" items={courses}>
                {item => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>,
    actions: <Button size="sm" color="secondary" iconLeading={FilterFunnel01}>
                Filters
            </Button>
  }
}`,...I.parameters?.docs?.source},description:{story:`Compact density for embedding inside a table header — tighter gaps and a
narrower search field, fewer controls to keep the row slim.`,...I.parameters?.docs?.description}}},L=[`Playground`,`TeeSheetFilters`,`WithAppliedTags`,`Compact`]}))();export{I as Compact,N as Playground,P as TeeSheetFilters,F as WithAppliedTags,L as __namedExportsOrder,j as default};