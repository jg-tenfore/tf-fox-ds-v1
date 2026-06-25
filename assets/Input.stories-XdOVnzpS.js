import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{$ as n,Dt as r,j as i,n as a}from"./dist-DtvLQRd8.js";import{i as o,t as s}from"./input-BVdHvg1n.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{c=t(),a(),o(),l={title:`Base Components/Inputs/Input`,component:s,parameters:{layout:`centered`,docs:{description:{component:`Inputs collect everything a golfer types while booking — the email for the
confirmation, a promo code, searching the tee sheet. Minimal: hairline
border, ink focus ring, no fill.`}}},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},isInvalid:{control:`boolean`},isDisabled:{control:`boolean`},label:{control:`text`},hint:{control:`text`},placeholder:{control:`text`}},args:{label:`Email address`,placeholder:`you@email.com`,hint:`We’ll send your tee-time confirmation here.`,size:`md`},decorators:[e=>(0,c.jsx)(`div`,{className:`w-80`,children:(0,c.jsx)(e,{})})]},u={},d={render:e=>(0,c.jsxs)(`div`,{className:`flex w-80 flex-col gap-4`,children:[(0,c.jsx)(s,{...e,size:`sm`,hint:void 0,label:`Small`}),(0,c.jsx)(s,{...e,size:`md`,hint:void 0,label:`Medium`}),(0,c.jsx)(s,{...e,size:`lg`,hint:void 0,label:`Large`})]}),decorators:[e=>(0,c.jsx)(e,{})]},f={args:{label:`Confirmation email`,icon:r,placeholder:`you@email.com`}},p={args:{label:`Member email`,tooltip:`Your tee-time confirmation and scorecard are sent here.`,placeholder:`you@email.com`}},m={args:{label:`Member name`,placeholder:`Olivia Rhye`,isRequired:!0,hint:`As it appears on your membership card.`}},h={args:{label:`Promo code`,icon:i,placeholder:`SAGAMORE20`,hint:`Members save 20% on twilight rounds.`}},g={args:{label:void 0,icon:n,placeholder:`Search tee times…`,hint:void 0}},_={args:{label:`Member portal password`,type:`password`,placeholder:`Enter your password`,hint:void 0}},v={args:{label:`Confirmation email`,type:`email`,icon:r,placeholder:`you@email.com`}},y={args:{label:`Confirmation email`,icon:r,placeholder:`you@email.com`,isDisabled:!0}},b={args:{label:`Promo code`,icon:i,placeholder:`Enter code`,isInvalid:!0,hint:`That code isn’t valid for this tee time.`}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex w-80 flex-col gap-4">
            <Input {...args} size="sm" hint={undefined} label="Small" />
            <Input {...args} size="md" hint={undefined} label="Medium" />
            <Input {...args} size="lg" hint={undefined} label="Large" />
        </div>,
  decorators: [Story => <Story />]
}`,...d.parameters?.docs?.source},description:{story:`Three sizes for the member booking form — sm, md, lg.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Confirmation email",
    icon: Mail01,
    placeholder: "you@email.com"
  }
}`,...f.parameters?.docs?.source},description:{story:`Leading icon for the confirmation email field.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Member email",
    tooltip: "Your tee-time confirmation and scorecard are sent here.",
    placeholder: "you@email.com"
  }
}`,...p.parameters?.docs?.source},description:{story:`Help tooltip explaining where the confirmation lands.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Member name",
    placeholder: "Olivia Rhye",
    isRequired: true,
    hint: "As it appears on your membership card."
  }
}`,...m.parameters?.docs?.source},description:{story:`Required field — a member name is needed to hold the booking.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Promo code",
    icon: Tag01,
    placeholder: "SAGAMORE20",
    hint: "Members save 20% on twilight rounds."
  }
}`,...h.parameters?.docs?.source},description:{story:`Promo code with a member savings hint.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    label: undefined,
    icon: SearchLg,
    placeholder: "Search tee times…",
    hint: undefined
  }
}`,...g.parameters?.docs?.source},description:{story:`Search field with no label for filtering the tee sheet.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Member portal password",
    type: "password",
    placeholder: "Enter your password",
    hint: undefined
  }
}`,..._.parameters?.docs?.source},description:{story:`Password type with a built-in visibility toggle, for the member portal.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Confirmation email",
    type: "email",
    icon: Mail01,
    placeholder: "you@email.com"
  }
}`,...v.parameters?.docs?.source},description:{story:`Email type for the booking confirmation address.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Confirmation email",
    icon: Mail01,
    placeholder: "you@email.com",
    isDisabled: true
  }
}`,...y.parameters?.docs?.source},description:{story:`Disabled — the field is locked while the round is being processed.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Promo code",
    icon: Tag01,
    placeholder: "Enter code",
    isInvalid: true,
    hint: "That code isn’t valid for this tee time."
  }
}`,...b.parameters?.docs?.source},description:{story:`Validation edge case — an invalid promo code at checkout.`,...b.parameters?.docs?.description}}},x=[`Playground`,`Sizes`,`WithIcon`,`WithTooltip`,`Required`,`PromoCode`,`SearchTeeSheet`,`Password`,`EmailType`,`Disabled`,`Invalid`]}))();export{y as Disabled,v as EmailType,b as Invalid,_ as Password,u as Playground,h as PromoCode,m as Required,g as SearchTeeSheet,d as Sizes,f as WithIcon,p as WithTooltip,x as __namedExportsOrder,l as default};