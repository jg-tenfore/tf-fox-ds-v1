import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{n,t as r}from"./slider-Culc5-0o.js";var i,a,o,s,c,l,u,d,f,p,m,h,g,_,v;e((()=>{i=t(),n(),a={title:`Base Components/Slider`,component:r,parameters:{layout:`centered`,docs:{description:{component:`Sliders narrow the tee sheet — set a per-player price ceiling for the round,
cap the group size, or carve out a booking window. Monochromatic: a hairline
quaternary track with an ink-filled range and grab handles.

Built on React Aria's \`Slider\`. Single value or an array for multiple thumbs;
\`labelPosition\` controls how the readout sits ("default" hidden, "bottom"
inline, "top-floating" tooltip); \`labelFormatter\` formats each thumb, and
without it the value renders as a percentage.`}}},argTypes:{labelPosition:{control:`inline-radio`,options:[`default`,`bottom`,`top-floating`],description:`Where the thumb value readout sits.`},minValue:{control:`number`},maxValue:{control:`number`},step:{control:`number`},isDisabled:{control:`boolean`},labelFormatter:{control:!1,table:{disable:!0}}},args:{minValue:0,maxValue:120,step:5,defaultValue:55,labelPosition:`bottom`,labelFormatter:e=>`$${e}`},decorators:[e=>(0,i.jsx)(`div`,{className:`w-80`,children:(0,i.jsx)(e,{})})]},o={},s={args:{defaultValue:89,labelFormatter:e=>`$${e}`}},c={args:{defaultValue:[30,89],labelFormatter:e=>`$${e}`}},l={args:{minValue:0,maxValue:120,step:5,defaultValue:[25,60,95],labelFormatter:e=>`$${e}`}},u={args:{labelPosition:`default`,defaultValue:89,labelFormatter:e=>`$${e}`}},d={args:{labelPosition:`bottom`,defaultValue:89,labelFormatter:e=>`$${e}`}},f={args:{labelPosition:`top-floating`,defaultValue:[30,89],labelFormatter:e=>`$${e}`}},p={args:{minValue:-2,maxValue:36,step:.5,defaultValue:[8,18],labelPosition:`top-floating`,labelFormatter:e=>e>0?`${e}`:`+${Math.abs(e)}`}},m={args:{minValue:1,maxValue:4,step:1,defaultValue:4,labelFormatter:e=>`${e} ${e===1?`player`:`players`}`}},h={args:{minValue:360,maxValue:720,step:15,defaultValue:[450,600],labelPosition:`top-floating`,labelFormatter:e=>{let t=Math.floor(e/60),n=e%60,r=t>=12?`PM`:`AM`;return`${t%12==0?12:t%12}:${n.toString().padStart(2,`0`)} ${r}`}}},g={args:{minValue:0,maxValue:100,step:5,defaultValue:75,labelPosition:`bottom`,labelFormatter:void 0}},_={args:{defaultValue:89,isDisabled:!0,labelFormatter:e=>`$${e}`}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: 89,
    labelFormatter: (value: number) => \`$\${value}\`
  }
}`,...s.parameters?.docs?.source},description:{story:`Single thumb — cap the per-player green fee at one price ceiling.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: [30, 89],
    labelFormatter: (value: number) => \`$\${value}\`
  }
}`,...c.parameters?.docs?.source},description:{story:`Two thumbs set a price range across the tee sheet.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    minValue: 0,
    maxValue: 120,
    step: 5,
    defaultValue: [25, 60, 95],
    labelFormatter: (value: number) => \`$\${value}\`
  }
}`,...l.parameters?.docs?.source},description:{story:`Three thumbs — early, mid, and late tee-time price tiers on one rail.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    labelPosition: "default",
    defaultValue: 89,
    labelFormatter: (value: number) => \`$\${value}\`
  }
}`,...u.parameters?.docs?.source},description:{story:'No readout — `labelPosition: "default"` hides the value for a compact filter.',...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    labelPosition: "bottom",
    defaultValue: 89,
    labelFormatter: (value: number) => \`$\${value}\`
  }
}`,...d.parameters?.docs?.source},description:{story:`Inline readout below the handle — the default tee-sheet treatment.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    labelPosition: "top-floating",
    defaultValue: [30, 89],
    labelFormatter: (value: number) => \`$\${value}\`
  }
}`,...f.parameters?.docs?.source},description:{story:`Floating tooltip above the handle — a clear callout while dragging.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    minValue: -2,
    maxValue: 36,
    step: 0.5,
    defaultValue: [8, 18],
    labelPosition: "top-floating",
    labelFormatter: (value: number) => value > 0 ? \`\${value}\` : \`+\${Math.abs(value)}\`
  }
}`,...p.parameters?.docs?.source},description:{story:`Custom min/max/step — handicap index from +2 to 36 in half-stroke steps.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    minValue: 1,
    maxValue: 4,
    step: 1,
    defaultValue: 4,
    labelFormatter: (value: number) => \`\${value} \${value === 1 ? "player" : "players"}\`
  }
}`,...m.parameters?.docs?.source},description:{story:`Whole-number group size for the booking — 1 to 4 players.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    minValue: 6 * 60,
    maxValue: 12 * 60,
    step: 15,
    defaultValue: [7 * 60 + 30, 10 * 60],
    labelPosition: "top-floating",
    labelFormatter: (value: number) => {
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      const period = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 === 0 ? 12 : hours % 12;
      return \`\${hour12}:\${minutes.toString().padStart(2, "0")} \${period}\`;
    }
  }
}`,...h.parameters?.docs?.source},description:{story:`Custom value formatting — a morning booking window rendered as clock times.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    minValue: 0,
    maxValue: 100,
    step: 5,
    defaultValue: 75,
    labelPosition: "bottom",
    labelFormatter: undefined
  }
}`,...g.parameters?.docs?.source},description:{story:"Default percent formatting — drop `labelFormatter` and the value reads as a percentage (course-occupancy cap).",...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: 89,
    isDisabled: true,
    labelFormatter: (value: number) => \`$\${value}\`
  }
}`,..._.parameters?.docs?.source},description:{story:`Edge case — a locked filter on a fully booked morning.`,..._.parameters?.docs?.description}}},v=[`Playground`,`SingleThumb`,`Range`,`MultipleThumbs`,`LabelHidden`,`LabelBottom`,`LabelFloating`,`MinMaxStep`,`GroupSize`,`TimeWindow`,`PercentFormat`,`Disabled`]}))();export{_ as Disabled,m as GroupSize,d as LabelBottom,f as LabelFloating,u as LabelHidden,p as MinMaxStep,l as MultipleThumbs,g as PercentFormat,o as Playground,c as Range,s as SingleThumb,h as TimeWindow,v as __namedExportsOrder,a as default};