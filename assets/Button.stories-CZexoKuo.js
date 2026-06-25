import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{Tr as n,Yt as r,ir as i,n as a}from"./dist-DtvLQRd8.js";import{n as o,t as s}from"./button-EClWuHCL.js";var c,l,u,d,f,p,m,h;e((()=>{c=t(),a(),o(),l={title:`Base Components/Button`,component:s,parameters:{layout:`centered`,docs:{description:{component:`Buttons drive every action in the Sagamore booking flow — reserving a tee
time, joining a waitlist, cancelling a round. With the monochromatic theme,
the primary action is near-black; everything else is greyscale.`}}},argTypes:{color:{control:`select`,options:[`primary`,`secondary`,`tertiary`,`link-gray`,`link-color`,`primary-destructive`,`secondary-destructive`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`,`xl`]},isLoading:{control:`boolean`},isDisabled:{control:`boolean`},children:{control:`text`}},args:{color:`primary`,size:`md`,children:`Book tee time`}},u={},d={render:e=>(0,c.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,c.jsx)(s,{...e,color:`primary`,children:`Reserve`}),(0,c.jsx)(s,{...e,color:`secondary`,children:`Add to round`}),(0,c.jsx)(s,{...e,color:`tertiary`,children:`View details`}),(0,c.jsx)(s,{...e,color:`link-gray`,children:`Change date`}),(0,c.jsx)(s,{...e,color:`primary-destructive`,children:`Cancel booking`})]})},f={render:e=>(0,c.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,c.jsx)(s,{...e,size:`sm`,children:`Small`}),(0,c.jsx)(s,{...e,size:`md`,children:`Medium`}),(0,c.jsx)(s,{...e,size:`lg`,children:`Large`}),(0,c.jsx)(s,{...e,size:`xl`,children:`Extra large`})]})},p={render:e=>(0,c.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,c.jsx)(s,{...e,iconLeading:i,children:`Pick a date`}),(0,c.jsx)(s,{...e,color:`secondary`,iconTrailing:n,children:`Continue to checkout`}),(0,c.jsx)(s,{...e,color:`tertiary`,iconLeading:r,children:`Course info`})]})},m={render:e=>(0,c.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,c.jsx)(s,{...e,children:`Book tee time`}),(0,c.jsx)(s,{...e,isLoading:!0,children:`Reserving…`}),(0,c.jsx)(s,{...e,isDisabled:!0,children:`Fully booked`}),(0,c.jsx)(s,{...e,color:`secondary`,children:`Join waitlist`})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-wrap items-center gap-3">
            <Button {...args} color="primary">
                Reserve
            </Button>
            <Button {...args} color="secondary">
                Add to round
            </Button>
            <Button {...args} color="tertiary">
                View details
            </Button>
            <Button {...args} color="link-gray">
                Change date
            </Button>
            <Button {...args} color="primary-destructive">
                Cancel booking
            </Button>
        </div>
}`,...d.parameters?.docs?.source},description:{story:`Every colour variant, rendered greyscale by the Sagamore theme.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-wrap items-center gap-3">
            <Button {...args} size="sm">
                Small
            </Button>
            <Button {...args} size="md">
                Medium
            </Button>
            <Button {...args} size="lg">
                Large
            </Button>
            <Button {...args} size="xl">
                Extra large
            </Button>
        </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-wrap items-center gap-3">
            <Button {...args} iconLeading={Calendar}>
                Pick a date
            </Button>
            <Button {...args} color="secondary" iconTrailing={ArrowRight}>
                Continue to checkout
            </Button>
            <Button {...args} color="tertiary" iconLeading={Flag06}>
                Course info
            </Button>
        </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-wrap items-center gap-3">
            <Button {...args}>Book tee time</Button>
            <Button {...args} isLoading>
                Reserving…
            </Button>
            <Button {...args} isDisabled>
                Fully booked
            </Button>
            <Button {...args} color="secondary">
                Join waitlist
            </Button>
        </div>
}`,...m.parameters?.docs?.source},description:{story:`Booking flow states — the same action across its lifecycle.`,...m.parameters?.docs?.description}}},h=[`Playground`,`Variants`,`Sizes`,`WithIcons`,`BookingStates`]}))();export{m as BookingStates,u as Playground,f as Sizes,d as Variants,p as WithIcons,h as __namedExportsOrder,l as default};