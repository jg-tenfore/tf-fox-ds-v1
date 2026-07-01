import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";import{i as n,n as r}from"./input-D4ddWauq.js";import{n as i,t as a}from"./input-group-DOf63Amd.js";var o,s,c,l,u,d,f,p;e((()=>{o=t(),n(),i(),s={title:`Base Components/Inputs/Input Group`,component:a,parameters:{layout:`centered`,docs:{description:{component:`Input Group pairs the field with addons set off by their own hairline box —
a currency symbol on a green fee, the club's domain on a member URL, a units
suffix on a yardage. Same ink focus ring, no fill.`}}},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},label:{control:`text`},hint:{control:`text`}},args:{size:`md`,label:`Green fee`,hint:`Per player, weekday twilight rate.`,leadingAddon:(0,o.jsx)(a.Prefix,{children:`$`}),children:(0,o.jsx)(r,{placeholder:`65.00`})},decorators:[e=>(0,o.jsx)(`div`,{className:`w-80`,children:(0,o.jsx)(e,{})})]},c={},l={args:{label:`Green fee`,leadingAddon:(0,o.jsx)(a.Prefix,{children:`$`}),trailingAddon:void 0,children:(0,o.jsx)(r,{placeholder:`65.00`})}},u={args:{label:`Longest drive`,hint:`Recorded on the 7th tee.`,leadingAddon:void 0,trailingAddon:(0,o.jsx)(a.Prefix,{children:`yds`}),children:(0,o.jsx)(r,{placeholder:`295`})}},d={args:{label:`Member profile URL`,hint:void 0,leadingAddon:(0,o.jsx)(a.Prefix,{children:`https://`}),trailingAddon:(0,o.jsx)(a.Prefix,{children:`.sagamore.golf`}),children:(0,o.jsx)(r,{placeholder:`olivia-rhye`})}},f={args:{label:`Locker number`,hint:void 0,prefix:`SAG-`,leadingAddon:void 0,children:(0,o.jsx)(r,{placeholder:`142`})}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Green fee",
    leadingAddon: <InputGroup.Prefix>$</InputGroup.Prefix>,
    trailingAddon: undefined,
    children: <InputBase placeholder="65.00" />
  }
}`,...l.parameters?.docs?.source},description:{story:`Leading addon — a currency symbol on the green fee.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Longest drive",
    hint: "Recorded on the 7th tee.",
    leadingAddon: undefined,
    trailingAddon: <InputGroup.Prefix>yds</InputGroup.Prefix>,
    children: <InputBase placeholder="295" />
  }
}`,...u.parameters?.docs?.source},description:{story:`Trailing addon — a units suffix on a recorded drive.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Member profile URL",
    hint: undefined,
    leadingAddon: <InputGroup.Prefix>https://</InputGroup.Prefix>,
    trailingAddon: <InputGroup.Prefix>.sagamore.golf</InputGroup.Prefix>,
    children: <InputBase placeholder="olivia-rhye" />
  }
}`,...d.parameters?.docs?.source},description:{story:`Both addons — protocol and domain around the member's vanity URL.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Locker number",
    hint: undefined,
    prefix: "SAG-",
    leadingAddon: undefined,
    children: <InputBase placeholder="142" />
  }
}`,...f.parameters?.docs?.source},description:{story:`Inline prefix text — club code shown inside the same box.`,...f.parameters?.docs?.description}}},p=[`Playground`,`LeadingAddon`,`TrailingAddon`,`LeadingAndTrailing`,`Prefix`]}))();export{l as LeadingAddon,d as LeadingAndTrailing,c as Playground,f as Prefix,u as TrailingAddon,p as __namedExportsOrder,s as default};