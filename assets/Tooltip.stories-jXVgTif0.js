import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";import{n,t as r}from"./button-C9G3p5hZ.js";import{n as i,r as a,t as o}from"./tooltip-CTw5z4yE.js";var s,c,l,u,d,f,p;e((()=>{s=t(),n(),a(),c={title:`Base Components/Tooltip`,component:o,parameters:{layout:`centered`,docs:{description:{component:`Tooltips explain the small print on the tee sheet — what a twilight rate
means, whether a cart is included — without crowding the booking card. The
surface is ink-solid with white type, matching the monochromatic theme.`}}},argTypes:{title:{control:`text`},description:{control:`text`},arrow:{control:`boolean`},placement:{control:`select`,options:[`top`,`bottom`,`left`,`right`]},delay:{control:`number`}},args:{title:`Twilight rate`,description:`Discounted tee times after 4 PM.`,arrow:!0,placement:`top`,children:(0,s.jsx)(i,{children:(0,s.jsx)(r,{color:`secondary`,children:`Twilight rate`})})}},l={},u={args:{title:`Cart included`,description:void 0,children:(0,s.jsx)(i,{children:(0,s.jsx)(r,{color:`secondary`,children:`Cart included`})})}},d={args:{title:`Members only`,description:`This 7:10 AM slot is reserved for Sagamore members until 48 hours out.`,placement:`right`,children:(0,s.jsx)(i,{children:(0,s.jsx)(r,{color:`tertiary`,children:`Why is this locked?`})})}},f={args:{title:`Replay rate`,description:`Play the back nine again the same day for $30.`,defaultOpen:!0,placement:`bottom`,children:(0,s.jsx)(i,{children:(0,s.jsx)(r,{color:`secondary`,children:`Replay rate`})})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Cart included",
    description: undefined,
    children: <TooltipTrigger>
                <Button color="secondary">Cart included</Button>
            </TooltipTrigger>
  }
}`,...u.parameters?.docs?.source},description:{story:`Single-line note on what comes with the round.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Members only",
    description: "This 7:10 AM slot is reserved for Sagamore members until 48 hours out.",
    placement: "right",
    children: <TooltipTrigger>
                <Button color="tertiary">Why is this locked?</Button>
            </TooltipTrigger>
  }
}`,...d.parameters?.docs?.source},description:{story:`A fuller explanation with a title and supporting description.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Replay rate",
    description: "Play the back nine again the same day for $30.",
    defaultOpen: true,
    placement: "bottom",
    children: <TooltipTrigger>
                <Button color="secondary">Replay rate</Button>
            </TooltipTrigger>
  }
}`,...f.parameters?.docs?.source},description:{story:`Edge case — kept open so the surface is always visible in the docs.`,...f.parameters?.docs?.description}}},p=[`Playground`,`CartIncluded`,`MembersOnly`,`AlwaysOpen`]}))();export{f as AlwaysOpen,u as CartIncluded,d as MembersOnly,l as Playground,p as __namedExportsOrder,c as default};