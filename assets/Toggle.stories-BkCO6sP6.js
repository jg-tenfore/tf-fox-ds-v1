import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";import{r as n,t as r}from"./toggle-F9jxvyai.js";var i,a,o,s,c,l,u,d;e((()=>{i=t(),n(),a={title:`Base Components/Toggle`,component:r,parameters:{layout:`centered`,docs:{description:{component:`Toggles flip the tee-sheet filters and booking preferences at Sagamore —
twilight-only rates, members-only times, walking instead of riding. The "on"
state is near-black under the monochromatic theme.`}}},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`]},slim:{control:`boolean`},isDisabled:{control:`boolean`},isSelected:{control:`boolean`},label:{control:`text`},hint:{control:`text`}},args:{label:`Show twilight rates only`,size:`sm`}},o={},s={args:{label:`Members-only tee times`,hint:`Restrict the sheet to times reserved for Sagamore members.`,defaultSelected:!0}},c={render:e=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,i.jsx)(r,{...e,defaultSelected:!0,label:`Show twilight rates only`}),(0,i.jsx)(r,{...e,label:`Members-only tee times`}),(0,i.jsx)(r,{...e,label:`Walking (no cart)`,hint:`Cart not required for this round.`})]})},l={render:e=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,i.jsx)(r,{...e,size:`sm`,defaultSelected:!0,label:`Show twilight rates only (small)`}),(0,i.jsx)(r,{...e,size:`md`,defaultSelected:!0,label:`Show twilight rates only (medium)`}),(0,i.jsx)(r,{...e,slim:!0,defaultSelected:!0,label:`Walking (no cart) — slim`})]})},u={args:{label:`Members-only tee times`,hint:`Always on for member accounts.`,isDisabled:!0,defaultSelected:!0}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Members-only tee times",
    hint: "Restrict the sheet to times reserved for Sagamore members.",
    defaultSelected: true
  }
}`,...s.parameters?.docs?.source},description:{story:`A toggle with a supporting hint in the tee-sheet filter panel.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-4">
            <Toggle {...args} defaultSelected label="Show twilight rates only" />
            <Toggle {...args} label="Members-only tee times" />
            <Toggle {...args} label="Walking (no cart)" hint="Cart not required for this round." />
        </div>
}`,...c.parameters?.docs?.source},description:{story:`The filters stacked in the booking sidebar.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-4">
            <Toggle {...args} size="sm" defaultSelected label="Show twilight rates only (small)" />
            <Toggle {...args} size="md" defaultSelected label="Show twilight rates only (medium)" />
            <Toggle {...args} slim defaultSelected label="Walking (no cart) — slim" />
        </div>
}`,...l.parameters?.docs?.source},description:{story:`Default and slim variants across both sizes.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Members-only tee times",
    hint: "Always on for member accounts.",
    isDisabled: true,
    defaultSelected: true
  }
}`,...u.parameters?.docs?.source},description:{story:`Edge case — a filter locked on for member accounts.`,...u.parameters?.docs?.description}}},d=[`Playground`,`WithHint`,`TeeSheetFilters`,`Variants`,`Disabled`]}))();export{u as Disabled,o as Playground,c as TeeSheetFilters,l as Variants,s as WithHint,d as __namedExportsOrder,a as default};