import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";import{n,t as r}from"./progress-indicators-CX7NDHjP.js";var i,a,o,s,c,l,u;e((()=>{i=t(),n(),a={title:`Base Components/Progress Indicators`,component:r,parameters:{layout:`padded`,docs:{description:{component:`Progress bars track how full a tee block is and how far along the season
pass a member has played at Sagamore. The fill is the near-black brand
foreground under the monochromatic theme.`}}},argTypes:{value:{control:{type:`range`,min:0,max:100,step:1}},labelPosition:{control:`inline-radio`,options:[`right`,`bottom`,`top-floating`,`bottom-floating`]}},args:{value:64,labelPosition:`right`},decorators:[e=>(0,i.jsx)(`div`,{className:`w-80`,children:(0,i.jsx)(e,{})})]},o={},s={render:()=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-10`,children:[(0,i.jsx)(r,{value:64,labelPosition:`right`}),(0,i.jsx)(r,{value:64,labelPosition:`bottom`}),(0,i.jsx)(r,{value:64,labelPosition:`top-floating`}),(0,i.jsx)(r,{value:64,labelPosition:`bottom-floating`})]})},c={args:{value:12,min:0,max:18,labelPosition:`right`,valueFormatter:e=>`${e} / 18 holes`}},l={render:()=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,i.jsx)(r,{value:20,labelPosition:`right`}),(0,i.jsx)(r,{value:55,labelPosition:`right`}),(0,i.jsx)(r,{value:90,labelPosition:`right`})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Tee block at 64% capacity.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-10">
            <ProgressBar value={64} labelPosition="right" />
            <ProgressBar value={64} labelPosition="bottom" />
            <ProgressBar value={64} labelPosition="top-floating" />
            <ProgressBar value={64} labelPosition="bottom-floating" />
        </div>
}`,...s.parameters?.docs?.source},description:{story:`Every label position.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    value: 12,
    min: 0,
    max: 18,
    labelPosition: "right",
    valueFormatter: value => \`\${value} / 18 holes\`
  }
}`,...c.parameters?.docs?.source},description:{story:`A custom formatter — holes played out of 18 rather than a percentage.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
            <ProgressBar value={20} labelPosition="right" />
            <ProgressBar value={55} labelPosition="right" />
            <ProgressBar value={90} labelPosition="right" />
        </div>
}`,...l.parameters?.docs?.source},description:{story:`Season-pass fill at three stages.`,...l.parameters?.docs?.description}}},u=[`Playground`,`LabelPositions`,`CustomFormatter`,`SeasonProgress`]}))();export{c as CustomFormatter,s as LabelPositions,o as Playground,l as SeasonProgress,u as __namedExportsOrder,a as default};