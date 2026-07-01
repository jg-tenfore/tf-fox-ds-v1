import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";import{$ as n,Yt as r,ir as i,n as a}from"./dist-Ce7pAI2g.js";import{n as o,t as s}from"./button-C9G3p5hZ.js";import{n as c,t as l}from"./empty-state-3Bo9Nnlf.js";var u,d,f,p,m,h;e((()=>{u=t(),a(),c(),o(),d={title:`Application Components/EmptyState`,component:l,parameters:{layout:`centered`,docs:{description:{component:"EmptyState fills the quiet moments in the Sagamore booking flow — a tee sheet\nwith nothing open, a saved-rounds list before the member's first booking. It\nis a compound component: compose `Header`, `FeaturedIcon`, `Content`, `Title`,\n`Description`, and `Footer`. Monochromatic, so the featured icon stays `gray`."}}},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}},args:{size:`md`},render:e=>(0,u.jsxs)(l,{...e,children:[(0,u.jsx)(l.Header,{children:(0,u.jsx)(l.FeaturedIcon,{color:`gray`,icon:n})}),(0,u.jsxs)(l.Content,{children:[(0,u.jsx)(l.Title,{children:`No tee times available`}),(0,u.jsx)(l.Description,{children:`There are no open slots on The Championship for this date. Try a different day or join the waitlist.`})]}),(0,u.jsxs)(l.Footer,{children:[(0,u.jsx)(s,{color:`secondary`,iconLeading:i,children:`Change date`}),(0,u.jsx)(s,{color:`primary`,children:`Join waitlist`})]})]})},f={},p={render:e=>(0,u.jsxs)(l,{...e,children:[(0,u.jsx)(l.Header,{children:(0,u.jsx)(l.FeaturedIcon,{color:`gray`,icon:r})}),(0,u.jsxs)(l.Content,{children:[(0,u.jsx)(l.Title,{children:`No saved rounds yet`}),(0,u.jsx)(l.Description,{children:`Your booked rounds at Sagamore will appear here. Reserve a tee time to get started.`})]}),(0,u.jsx)(l.Footer,{children:(0,u.jsx)(s,{color:`primary`,children:`Book a tee time`})})]})},m={args:{size:`sm`},render:e=>(0,u.jsxs)(l,{...e,children:[(0,u.jsx)(l.Header,{pattern:`none`,children:(0,u.jsx)(l.FeaturedIcon,{color:`gray`,icon:n})}),(0,u.jsxs)(l.Content,{children:[(0,u.jsx)(l.Title,{children:`No results`}),(0,u.jsx)(l.Description,{children:`No tee times match your filters — try clearing the rate or holes filter.`})]})]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <EmptyState {...args}>
            <EmptyState.Header>
                <EmptyState.FeaturedIcon color="gray" icon={Flag06} />
            </EmptyState.Header>
            <EmptyState.Content>
                <EmptyState.Title>No saved rounds yet</EmptyState.Title>
                <EmptyState.Description>
                    Your booked rounds at Sagamore will appear here. Reserve a tee
                    time to get started.
                </EmptyState.Description>
            </EmptyState.Content>
            <EmptyState.Footer>
                <Button color="primary">Book a tee time</Button>
            </EmptyState.Footer>
        </EmptyState>
}`,...p.parameters?.docs?.source},description:{story:`Before a member has booked anything — their saved rounds list is empty.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    size: "sm"
  },
  render: args => <EmptyState {...args}>
            <EmptyState.Header pattern="none">
                <EmptyState.FeaturedIcon color="gray" icon={SearchLg} />
            </EmptyState.Header>
            <EmptyState.Content>
                <EmptyState.Title>No results</EmptyState.Title>
                <EmptyState.Description>
                    No tee times match your filters — try clearing the rate or holes
                    filter.
                </EmptyState.Description>
            </EmptyState.Content>
        </EmptyState>
}`,...m.parameters?.docs?.source},description:{story:`Edge case: a footerless, minimal empty state — just icon, title, copy.`,...m.parameters?.docs?.description}}},h=[`Playground`,`SavedRounds`,`MinimalNoFooter`]}))();export{m as MinimalNoFooter,f as Playground,p as SavedRounds,h as __namedExportsOrder,d as default};