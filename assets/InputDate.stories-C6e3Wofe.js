import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{ir as n,n as r}from"./dist-DtvLQRd8.js";import{r as i,t as a}from"./input-date-BSudWpdv.js";var o,s,c,l,u,d,f,p,m;e((()=>{o=t(),r(),i(),s={title:`Base Components/Inputs/Input Date`,component:a,parameters:{layout:`centered`,docs:{description:{component:`Input Date is the segmented field a member fills when picking a round date —
type the month, day, year straight into the boxes. Ink-on-white, no fill,
the active segment flips to the club's near-black.`}}},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},label:{control:`text`},hint:{control:`text`},isDisabled:{control:`boolean`},isInvalid:{control:`boolean`}},args:{size:`md`,label:`Round date`,hint:`Tee sheet opens 14 days out.`},decorators:[e=>(0,o.jsx)(`div`,{className:`w-80`,children:(0,o.jsx)(e,{})})]},c={},l={render:e=>(0,o.jsxs)(`div`,{className:`flex w-80 flex-col gap-4`,children:[(0,o.jsx)(a,{...e,size:`sm`,hint:void 0,label:`Small`}),(0,o.jsx)(a,{...e,size:`md`,hint:void 0,label:`Medium`}),(0,o.jsx)(a,{...e,size:`lg`,hint:void 0,label:`Large`})]}),decorators:[e=>(0,o.jsx)(e,{})]},u={args:{label:`Round date`,icon:n}},d={args:{label:`Round date`,tooltip:`Members may book up to 14 days in advance.`}},f={args:{label:`Round date`,icon:n,isInvalid:!0,hint:`That date is beyond the 14-day window.`}},p={args:{label:`Round date`,icon:n,isDisabled:!0}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex w-80 flex-col gap-4">
            <InputDate {...args} size="sm" hint={undefined} label="Small" />
            <InputDate {...args} size="md" hint={undefined} label="Medium" />
            <InputDate {...args} size="lg" hint={undefined} label="Large" />
        </div>,
  decorators: [Story => <Story />]
}`,...l.parameters?.docs?.source},description:{story:`Three sizes for the booking form.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Round date",
    icon: Calendar
  }
}`,...u.parameters?.docs?.source},description:{story:`Leading calendar icon for the round date.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Round date",
    tooltip: "Members may book up to 14 days in advance."
  }
}`,...d.parameters?.docs?.source},description:{story:`Help tooltip explaining the booking window.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Round date",
    icon: Calendar,
    isInvalid: true,
    hint: "That date is beyond the 14-day window."
  }
}`,...f.parameters?.docs?.source},description:{story:`Invalid — the chosen date falls outside the booking window.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Round date",
    icon: Calendar,
    isDisabled: true
  }
}`,...p.parameters?.docs?.source},description:{story:`Disabled while the tee sheet is being rebuilt.`,...p.parameters?.docs?.description}}},m=[`Playground`,`Sizes`,`WithIcon`,`WithTooltip`,`Invalid`,`Disabled`]}))();export{p as Disabled,f as Invalid,c as Playground,l as Sizes,u as WithIcon,d as WithTooltip,m as __namedExportsOrder,s as default};