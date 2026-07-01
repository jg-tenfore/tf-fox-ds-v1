import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";import{n,t as r}from"./pin-input-Cub5pE1l.js";var i,a,o,s,c,l,u,d;e((()=>{i=t(),n(),a={title:`Base Components/Inputs/Pin Input`,component:r,parameters:{layout:`centered`,docs:{description:{component:`Pin Input is the four-digit code a member punches in at the kiosk to check
in for a round — big ink boxes that light to near-black as they fill. Built
from compound parts: PinInput, .Label, .Group, .Slot, .Description.`}}},argTypes:{size:{control:`inline-radio`,options:[`xxxs`,`xxs`,`xs`,`sm`,`md`,`lg`]},disabled:{control:`boolean`},invalid:{control:`boolean`}},args:{size:`xs`,disabled:!1,invalid:!1},render:e=>(0,i.jsxs)(r,{...e,children:[(0,i.jsx)(r.Label,{children:`Member check-in PIN`}),(0,i.jsxs)(r.Group,{maxLength:4,children:[(0,i.jsx)(r.Slot,{index:0}),(0,i.jsx)(r.Slot,{index:1}),(0,i.jsx)(r.Slot,{index:2}),(0,i.jsx)(r.Slot,{index:3})]}),(0,i.jsx)(r.Description,{children:`Enter the 4-digit code from your booking confirmation.`})]})},o={},s={args:{size:`lg`},render:e=>(0,i.jsxs)(r,{...e,children:[(0,i.jsx)(r.Label,{children:`Check-in PIN`}),(0,i.jsxs)(r.Group,{maxLength:4,children:[(0,i.jsx)(r.Slot,{index:0}),(0,i.jsx)(r.Slot,{index:1}),(0,i.jsx)(r.Slot,{index:2}),(0,i.jsx)(r.Slot,{index:3})]})]})},c={args:{size:`xs`},render:e=>(0,i.jsxs)(r,{...e,children:[(0,i.jsx)(r.Label,{children:`Member account code`}),(0,i.jsxs)(r.Group,{maxLength:6,children:[(0,i.jsx)(r.Slot,{index:0}),(0,i.jsx)(r.Slot,{index:1}),(0,i.jsx)(r.Slot,{index:2}),(0,i.jsx)(r.Separator,{}),(0,i.jsx)(r.Slot,{index:3}),(0,i.jsx)(r.Slot,{index:4}),(0,i.jsx)(r.Slot,{index:5})]}),(0,i.jsx)(r.Description,{children:`Six digits, found on your membership card.`})]})},l={args:{size:`xs`,invalid:!0},render:e=>(0,i.jsxs)(r,{...e,children:[(0,i.jsx)(r.Label,{children:`Check-in PIN`}),(0,i.jsxs)(r.Group,{maxLength:4,children:[(0,i.jsx)(r.Slot,{index:0}),(0,i.jsx)(r.Slot,{index:1}),(0,i.jsx)(r.Slot,{index:2}),(0,i.jsx)(r.Slot,{index:3})]}),(0,i.jsx)(r.Description,{children:`That PIN didn’t match. Check your confirmation email.`})]})},u={args:{size:`xs`,disabled:!0},render:e=>(0,i.jsxs)(r,{...e,children:[(0,i.jsx)(r.Label,{children:`Check-in PIN`}),(0,i.jsxs)(r.Group,{maxLength:4,children:[(0,i.jsx)(r.Slot,{index:0}),(0,i.jsx)(r.Slot,{index:1}),(0,i.jsx)(r.Slot,{index:2}),(0,i.jsx)(r.Slot,{index:3})]})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    size: "lg"
  },
  render: args => <PinInput {...args}>
            <PinInput.Label>Check-in PIN</PinInput.Label>
            <PinInput.Group maxLength={4}>
                <PinInput.Slot index={0} />
                <PinInput.Slot index={1} />
                <PinInput.Slot index={2} />
                <PinInput.Slot index={3} />
            </PinInput.Group>
        </PinInput>
}`,...s.parameters?.docs?.source},description:{story:`Large display boxes for the lobby check-in kiosk.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    size: "xs"
  },
  render: args => <PinInput {...args}>
            <PinInput.Label>Member account code</PinInput.Label>
            <PinInput.Group maxLength={6}>
                <PinInput.Slot index={0} />
                <PinInput.Slot index={1} />
                <PinInput.Slot index={2} />
                <PinInput.Separator />
                <PinInput.Slot index={3} />
                <PinInput.Slot index={4} />
                <PinInput.Slot index={5} />
            </PinInput.Group>
            <PinInput.Description>Six digits, found on your membership card.</PinInput.Description>
        </PinInput>
}`,...c.parameters?.docs?.source},description:{story:`Six digits with a separator — a longer member account code.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    size: "xs",
    invalid: true
  },
  render: args => <PinInput {...args}>
            <PinInput.Label>Check-in PIN</PinInput.Label>
            <PinInput.Group maxLength={4}>
                <PinInput.Slot index={0} />
                <PinInput.Slot index={1} />
                <PinInput.Slot index={2} />
                <PinInput.Slot index={3} />
            </PinInput.Group>
            <PinInput.Description>That PIN didn’t match. Check your confirmation email.</PinInput.Description>
        </PinInput>
}`,...l.parameters?.docs?.source},description:{story:`Invalid — the entered PIN didn't match the booking.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    size: "xs",
    disabled: true
  },
  render: args => <PinInput {...args}>
            <PinInput.Label>Check-in PIN</PinInput.Label>
            <PinInput.Group maxLength={4}>
                <PinInput.Slot index={0} />
                <PinInput.Slot index={1} />
                <PinInput.Slot index={2} />
                <PinInput.Slot index={3} />
            </PinInput.Group>
        </PinInput>
}`,...u.parameters?.docs?.source},description:{story:`Disabled while the kiosk syncs with the tee sheet.`,...u.parameters?.docs?.description}}},d=[`Playground`,`LargeKiosk`,`WithSeparator`,`Invalid`,`Disabled`]}))();export{u as Disabled,l as Invalid,s as LargeKiosk,o as Playground,c as WithSeparator,d as __namedExportsOrder,a as default};