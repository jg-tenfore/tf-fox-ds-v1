import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{r as n,t as r}from"./checkbox-DWRxF4Qu.js";var i,a,o,s,c,l,u,d;e((()=>{i=t(),n(),a={title:`Base Components/Checkbox`,component:r,parameters:{layout:`centered`,docs:{description:{component:`Checkboxes capture the small commitments in the Sagamore booking flow —
agreeing to the cancellation policy, adding a cart, opting into reminders.
Monochromatic: the checked state is near-black, never coloured.`}}},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`]},isDisabled:{control:`boolean`},isIndeterminate:{control:`boolean`},isSelected:{control:`boolean`},label:{control:`text`},hint:{control:`text`}},args:{label:`Add a cart ($20)`,size:`sm`}},o={},s={args:{label:`I agree to Sagamore’s cancellation policy`,hint:`Free cancellation up to 24 hours before your tee time.`}},c={render:e=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,i.jsx)(r,{...e,defaultSelected:!0,label:`Add a cart ($20)`}),(0,i.jsx)(r,{...e,label:`Email me tee-time reminders`}),(0,i.jsx)(r,{...e,label:`I agree to Sagamore’s cancellation policy`,hint:`Free cancellation up to 24 hours before your tee time.`})]})},l={render:e=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,i.jsx)(r,{...e,size:`sm`,defaultSelected:!0,label:`Members-only tee times (small)`}),(0,i.jsx)(r,{...e,size:`md`,defaultSelected:!0,label:`Members-only tee times (medium)`})]})},u={render:e=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,i.jsx)(r,{...e,isIndeterminate:!0,label:`Add all four players to the group`,hint:`Two of four spots already filled.`}),(0,i.jsx)(r,{...e,isDisabled:!0,defaultSelected:!0,label:`Add a cart ($20)`,hint:`Cart included with this twilight rate.`})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "I agree to Sagamore’s cancellation policy",
    hint: "Free cancellation up to 24 hours before your tee time."
  }
}`,...s.parameters?.docs?.source},description:{story:`A checkbox paired with a supporting hint at checkout.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-4">
            <Checkbox {...args} defaultSelected label="Add a cart ($20)" />
            <Checkbox {...args} label="Email me tee-time reminders" />
            <Checkbox {...args} label="I agree to Sagamore’s cancellation policy" hint="Free cancellation up to 24 hours before your tee time." />
        </div>
}`,...c.parameters?.docs?.source},description:{story:`The booking add-ons a golfer toggles before paying.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-4">
            <Checkbox {...args} size="sm" defaultSelected label="Members-only tee times (small)" />
            <Checkbox {...args} size="md" defaultSelected label="Members-only tee times (medium)" />
        </div>
}`,...l.parameters?.docs?.source},description:{story:`Both sizes, selected, for the dense vs. comfortable tee-sheet layouts.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-4">
            <Checkbox {...args} isIndeterminate label="Add all four players to the group" hint="Two of four spots already filled." />
            <Checkbox {...args} isDisabled defaultSelected label="Add a cart ($20)" hint="Cart included with this twilight rate." />
        </div>
}`,...u.parameters?.docs?.source},description:{story:`Edge cases — an indeterminate "select all" header and a locked add-on.`,...u.parameters?.docs?.description}}},d=[`Playground`,`WithHint`,`BookingOptions`,`Sizes`,`EdgeCases`]}))();export{c as BookingOptions,u as EdgeCases,o as Playground,l as Sizes,s as WithHint,d as __namedExportsOrder,a as default};