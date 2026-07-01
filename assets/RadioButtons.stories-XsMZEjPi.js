import{i as e,l as t}from"./preload-helper-tpQASj4C.js";import{d as n,j as r}from"./iframe-JEutOpZn.js";import{i,n as a,r as o,t as s}from"./radio-buttons-olYsaS87.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w;e((()=>{c=n(),l=t(r()),i(),u={title:`Base Components/RadioButtons`,component:o,parameters:{layout:`centered`,docs:{description:{component:`Radio groups let a golfer pick exactly one option while booking — how many
holes they're playing, whether they're riding or walking, or which rate
applies. Monochromatic: the selected dot fills near-black, everything else
stays greyscale.`}}},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`]},isDisabled:{control:`boolean`},orientation:{control:`inline-radio`,options:[`vertical`,`horizontal`]}},args:{size:`sm`,"aria-label":`Players in your group`,children:(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(s,{value:`1`,label:`1 player`}),(0,c.jsx)(s,{value:`2`,label:`2 players`}),(0,c.jsx)(s,{value:`3`,label:`3 players`}),(0,c.jsx)(s,{value:`4`,label:`4 players`})]})},render:e=>(0,c.jsx)(o,{...e,defaultValue:`2`})},d={},f={render:e=>(0,c.jsxs)(o,{...e,"aria-label":`Number of holes`,defaultValue:`18`,children:[(0,c.jsx)(s,{value:`9`,label:`9 holes`}),(0,c.jsx)(s,{value:`18`,label:`18 holes`}),(0,c.jsx)(s,{value:`27`,label:`27 holes`})]})},p={args:{orientation:`horizontal`},render:e=>(0,c.jsxs)(o,{...e,"aria-label":`Getting around`,defaultValue:`ride`,className:`flex-row gap-6`,children:[(0,c.jsx)(s,{value:`ride`,label:`Ride (cart)`}),(0,c.jsx)(s,{value:`walk`,label:`Walk`})]})},m={render:e=>(0,c.jsxs)(o,{...e,"aria-label":`Rate type`,defaultValue:`standard`,children:[(0,c.jsx)(s,{value:`standard`,label:`Standard`,hint:`Full price, all 18 holes.`}),(0,c.jsx)(s,{value:`twilight`,label:`Twilight`,hint:`After 3:00 PM, reduced rate.`}),(0,c.jsx)(s,{value:`member`,label:`Member`,hint:`Sagamore members only.`})]})},h={render:e=>(0,c.jsxs)(o,{...e,"aria-label":`Choose your course`,defaultValue:`lakeside`,children:[(0,c.jsx)(s,{value:`lakeside`,label:`Lakeside`,hint:`Par 72 — water on the back nine.`}),(0,c.jsx)(s,{value:`ridge`,label:`The Ridge`,hint:`Par 70 — tight, tree-lined fairways.`}),(0,c.jsx)(s,{value:`links`,label:`Sagamore Links`,hint:`Par 71 — open, windswept links style.`})]})},g={render:e=>(0,c.jsx)(o,{...e,"aria-label":`Cart add-on`,defaultValue:`cart`,children:(0,c.jsx)(s,{value:`cart`,label:`Add a cart ($20)`,hint:`Shared two-seater, keys at the bag drop.`})})},_={render:e=>(0,c.jsxs)(`div`,{className:`flex flex-col gap-8`,children:[(0,c.jsxs)(o,{...e,size:`sm`,"aria-label":`Number of holes (small)`,defaultValue:`18`,children:[(0,c.jsx)(s,{value:`9`,label:`9 holes`}),(0,c.jsx)(s,{value:`18`,label:`18 holes`}),(0,c.jsx)(s,{value:`27`,label:`27 holes`})]}),(0,c.jsxs)(o,{...e,size:`md`,"aria-label":`Number of holes (medium)`,defaultValue:`18`,children:[(0,c.jsx)(s,{value:`9`,label:`9 holes`}),(0,c.jsx)(s,{value:`18`,label:`18 holes`}),(0,c.jsx)(s,{value:`27`,label:`27 holes`})]})]})},v={args:{size:`md`}},y={render:e=>(0,c.jsxs)(`div`,{className:`flex flex-col gap-8`,children:[(0,c.jsxs)(o,{...e,"aria-label":`Getting around (vertical)`,defaultValue:`ride`,children:[(0,c.jsx)(s,{value:`ride`,label:`Ride (cart)`}),(0,c.jsx)(s,{value:`walk`,label:`Walk`})]}),(0,c.jsxs)(o,{...e,"aria-label":`Getting around (horizontal)`,orientation:`horizontal`,defaultValue:`ride`,className:`flex-row gap-6`,children:[(0,c.jsx)(s,{value:`ride`,label:`Ride (cart)`}),(0,c.jsx)(s,{value:`walk`,label:`Walk`})]})]})},b={render:e=>{let[t,n]=(0,l.useState)(`2`);return(0,c.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,c.jsxs)(o,{...e,"aria-label":`Players in your group`,value:t,onChange:n,children:[(0,c.jsx)(s,{value:`1`,label:`1 player`}),(0,c.jsx)(s,{value:`2`,label:`2 players`}),(0,c.jsx)(s,{value:`3`,label:`3 players`}),(0,c.jsx)(s,{value:`4`,label:`4 players`})]}),(0,c.jsxs)(`p`,{className:`text-sm text-tertiary`,children:[`Booking for `,t,` on the Lakeside course.`]})]})}},x={render:e=>(0,c.jsxs)(o,{...e,"aria-label":`Rate type`,defaultValue:`standard`,children:[(0,c.jsx)(s,{value:`standard`,label:`Standard`,hint:`Full price, all 18 holes.`}),(0,c.jsx)(s,{value:`twilight`,label:`Twilight`,hint:`Opens at 3:00 PM.`,isDisabled:!0}),(0,c.jsx)(s,{value:`member`,label:`Member`,hint:`Sagamore members only.`})]})},S={args:{isDisabled:!0},render:e=>(0,c.jsxs)(o,{...e,"aria-label":`Rate type`,defaultValue:`standard`,children:[(0,c.jsx)(s,{value:`standard`,label:`Standard`,hint:`Full price, all 18 holes.`}),(0,c.jsx)(s,{value:`twilight`,label:`Twilight`,hint:`Opens at 3:00 PM.`}),(0,c.jsx)(s,{value:`member`,label:`Member`,hint:`Sagamore members only.`})]})},C={render:()=>(0,c.jsxs)(`div`,{className:`flex items-center gap-6`,children:[(0,c.jsx)(a,{}),(0,c.jsx)(a,{isSelected:!0}),(0,c.jsx)(a,{isDisabled:!0}),(0,c.jsx)(a,{isSelected:!0,isDisabled:!0}),(0,c.jsx)(a,{size:`md`,isSelected:!0})]})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <RadioGroup {...args} aria-label="Number of holes" defaultValue="18">
            <RadioButton value="9" label="9 holes" />
            <RadioButton value="18" label="18 holes" />
            <RadioButton value="27" label="27 holes" />
        </RadioGroup>
}`,...f.parameters?.docs?.source},description:{story:`How many holes is the round — the most common choice on the tee sheet.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: "horizontal"
  },
  render: args => <RadioGroup {...args} aria-label="Getting around" defaultValue="ride" className="flex-row gap-6">
            <RadioButton value="ride" label="Ride (cart)" />
            <RadioButton value="walk" label="Walk" />
        </RadioGroup>
}`,...p.parameters?.docs?.source},description:{story:`Ride or walk — a two-option group laid out side by side.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <RadioGroup {...args} aria-label="Rate type" defaultValue="standard">
            <RadioButton value="standard" label="Standard" hint="Full price, all 18 holes." />
            <RadioButton value="twilight" label="Twilight" hint="After 3:00 PM, reduced rate." />
            <RadioButton value="member" label="Member" hint="Sagamore members only." />
        </RadioGroup>
}`,...m.parameters?.docs?.source},description:{story:`Rate type, with a hint under each option.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <RadioGroup {...args} aria-label="Choose your course" defaultValue="lakeside">
            <RadioButton value="lakeside" label="Lakeside" hint="Par 72 — water on the back nine." />
            <RadioButton value="ridge" label="The Ridge" hint="Par 70 — tight, tree-lined fairways." />
            <RadioButton value="links" label="Sagamore Links" hint="Par 71 — open, windswept links style." />
        </RadioGroup>
}`,...h.parameters?.docs?.source},description:{story:`Course selection with supporting text for each layout.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <RadioGroup {...args} aria-label="Cart add-on" defaultValue="cart">
            <RadioButton value="cart" label="Add a cart ($20)" hint="Shared two-seater, keys at the bag drop." />
        </RadioGroup>
}`,...g.parameters?.docs?.source},description:{story:`A single radio button on its own, outside a multi-option group.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-8">
            <RadioGroup {...args} size="sm" aria-label="Number of holes (small)" defaultValue="18">
                <RadioButton value="9" label="9 holes" />
                <RadioButton value="18" label="18 holes" />
                <RadioButton value="27" label="27 holes" />
            </RadioGroup>
            <RadioGroup {...args} size="md" aria-label="Number of holes (medium)" defaultValue="18">
                <RadioButton value="9" label="9 holes" />
                <RadioButton value="18" label="18 holes" />
                <RadioButton value="27" label="27 holes" />
            </RadioGroup>
        </div>
}`,..._.parameters?.docs?.source},description:{story:`Both sizes — small for the dense tee sheet, medium for the on-course kiosk.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    size: "md"
  }
}`,...v.parameters?.docs?.source},description:{story:`Larger touch target for the on-course kiosk.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-8">
            <RadioGroup {...args} aria-label="Getting around (vertical)" defaultValue="ride">
                <RadioButton value="ride" label="Ride (cart)" />
                <RadioButton value="walk" label="Walk" />
            </RadioGroup>
            <RadioGroup {...args} aria-label="Getting around (horizontal)" orientation="horizontal" defaultValue="ride" className="flex-row gap-6">
                <RadioButton value="ride" label="Ride (cart)" />
                <RadioButton value="walk" label="Walk" />
            </RadioGroup>
        </div>
}`,...y.parameters?.docs?.source},description:{story:`Vertical (default) versus horizontal layout for the same choice.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [players, setPlayers] = useState("2");
    return <div className="flex flex-col gap-4">
                <RadioGroup {...args} aria-label="Players in your group" value={players} onChange={setPlayers}>
                    <RadioButton value="1" label="1 player" />
                    <RadioButton value="2" label="2 players" />
                    <RadioButton value="3" label="3 players" />
                    <RadioButton value="4" label="4 players" />
                </RadioGroup>
                <p className="text-sm text-tertiary">Booking for {players} on the Lakeside course.</p>
            </div>;
  }
}`,...b.parameters?.docs?.source},description:{story:`Controlled selection — the booking summary updates as you choose.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <RadioGroup {...args} aria-label="Rate type" defaultValue="standard">
            <RadioButton value="standard" label="Standard" hint="Full price, all 18 holes." />
            <RadioButton value="twilight" label="Twilight" hint="Opens at 3:00 PM." isDisabled />
            <RadioButton value="member" label="Member" hint="Sagamore members only." />
        </RadioGroup>
}`,...x.parameters?.docs?.source},description:{story:`A single disabled option inside an otherwise live group — twilight isn't open yet.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    isDisabled: true
  },
  render: args => <RadioGroup {...args} aria-label="Rate type" defaultValue="standard">
            <RadioButton value="standard" label="Standard" hint="Full price, all 18 holes." />
            <RadioButton value="twilight" label="Twilight" hint="Opens at 3:00 PM." />
            <RadioButton value="member" label="Member" hint="Sagamore members only." />
        </RadioGroup>
}`,...S.parameters?.docs?.source},description:{story:`Edge case — the whole group is disabled while the rate card is being updated.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-6">
            <RadioButtonBase />
            <RadioButtonBase isSelected />
            <RadioButtonBase isDisabled />
            <RadioButtonBase isSelected isDisabled />
            <RadioButtonBase size="md" isSelected />
        </div>
}`,...C.parameters?.docs?.source},description:{story:`The raw dot indicator (RadioButtonBase) across every visual state.`,...C.parameters?.docs?.description}}},w=[`Playground`,`NumberOfHoles`,`RideOrWalk`,`RateType`,`CourseSelection`,`SingleButton`,`Sizes`,`MediumSize`,`Orientation`,`Controlled`,`DisabledOption`,`Disabled`,`BaseStates`]}))();export{C as BaseStates,b as Controlled,h as CourseSelection,S as Disabled,x as DisabledOption,v as MediumSize,f as NumberOfHoles,y as Orientation,d as Playground,m as RateType,p as RideOrWalk,g as SingleButton,_ as Sizes,w as __namedExportsOrder,u as default};