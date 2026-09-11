import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-BbsIfxGP.js";import{n,t as r}from"./textarea-DhNuCNiG.js";var i,a,o,s,c,l,u,d;e((()=>{i=t(),n(),a={title:`Components/Forms/Textarea`,component:r,parameters:{layout:`centered`,docs:{description:{component:`Textareas capture the free-form notes a golfer leaves while booking — special
requests for the round, messages for the pro shop. Minimal: hairline border,
ink focus ring, no fill.`}}},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`]},isDisabled:{control:`boolean`},isRequired:{control:`boolean`},label:{control:`text`},hint:{control:`text`},placeholder:{control:`text`},rows:{control:`number`}},args:{label:`Special requests for your round`,placeholder:`Please pair us with another twosome.`,hint:`Our starter will do their best to accommodate.`,size:`md`,rows:4},decorators:[e=>(0,i.jsx)(`div`,{className:`w-80`,children:(0,i.jsx)(e,{})})]},o={},s={args:{label:`Notes for the pro shop`,placeholder:`Reserve a cart and two rental sets, please.`,hint:`Rentals are subject to availability.`}},c={args:{label:`Reason for cancellation`,placeholder:`Tell us why you're cancelling this tee time.`,hint:`Required for refunds within 24 hours of your round.`,isRequired:!0}},l={args:{size:`sm`,label:`Quick note`,placeholder:`Running 10 minutes late.`,hint:void 0,rows:2}},u={args:{label:`Special requests for your round`,placeholder:`Please pair us with another twosome.`,hint:`This round has already been checked in.`,isDisabled:!0}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Notes for the pro shop",
    placeholder: "Reserve a cart and two rental sets, please.",
    hint: "Rentals are subject to availability."
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Reason for cancellation",
    placeholder: "Tell us why you're cancelling this tee time.",
    hint: "Required for refunds within 24 hours of your round.",
    isRequired: true
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    size: "sm",
    label: "Quick note",
    placeholder: "Running 10 minutes late.",
    hint: undefined,
    rows: 2
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Special requests for your round",
    placeholder: "Please pair us with another twosome.",
    hint: "This round has already been checked in.",
    isDisabled: true
  }
}`,...u.parameters?.docs?.source},description:{story:`Edge case — notes are locked once the round is checked in.`,...u.parameters?.docs?.description}}},d=[`Playground`,`ProShopNotes`,`Required`,`SmallSize`,`Disabled`]}))();export{u as Disabled,o as Playground,s as ProShopNotes,c as Required,l as SmallSize,d as __namedExportsOrder,a as default};