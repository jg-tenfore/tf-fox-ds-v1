import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{n,t as r}from"./input-payment-CqoMoyzw.js";var i,a,o,s,c,l,u,d;e((()=>{i=t(),n(),a={title:`Base Components/Inputs/Input Payment`,component:r,parameters:{layout:`centered`,docs:{description:{component:`Input Payment is the card field at green-fee checkout — it auto-detects the
card brand, spaces the digits in groups of four, and surfaces the brand mark
inside the field. Hairline border, ink focus ring, no fill.`}}},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},label:{control:`text`},hint:{control:`text`},placeholder:{control:`text`},isDisabled:{control:`boolean`},isInvalid:{control:`boolean`}},args:{size:`md`,label:`Card number`,hint:`Charged when your group checks in at the starter.`,placeholder:`1234 1234 1234 1234`},decorators:[e=>(0,i.jsx)(`div`,{className:`w-80`,children:(0,i.jsx)(e,{})})]},o={},s={args:{label:`Card on file`,defaultValue:`4111111111111111`,hint:void 0}},c={args:{label:`Card number`,isRequired:!0,hint:`Required to hold the tee time.`}},l={args:{label:`Card number`,defaultValue:`4000000000000002`,isInvalid:!0,hint:`That card was declined. Try another.`}},u={args:{label:`Card number`,defaultValue:`5500005555555559`,isDisabled:!0}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Card on file",
    defaultValue: "4111111111111111",
    hint: undefined
  }
}`,...s.parameters?.docs?.source},description:{story:`Pre-filled to show Visa auto-detection at the green-fee desk.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Card number",
    isRequired: true,
    hint: "Required to hold the tee time."
  }
}`,...c.parameters?.docs?.source},description:{story:`Required field at checkout.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Card number",
    defaultValue: "4000000000000002",
    isInvalid: true,
    hint: "That card was declined. Try another."
  }
}`,...l.parameters?.docs?.source},description:{story:`Invalid — the card number was declined for the green fee.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Card number",
    defaultValue: "5500005555555559",
    isDisabled: true
  }
}`,...u.parameters?.docs?.source},description:{story:`Disabled while the charge is being authorized.`,...u.parameters?.docs?.description}}},d=[`Playground`,`VisaDetected`,`Required`,`Invalid`,`Disabled`]}))();export{u as Disabled,l as Invalid,o as Playground,c as Required,s as VisaDetected,d as __namedExportsOrder,a as default};