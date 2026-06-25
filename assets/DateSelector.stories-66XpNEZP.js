import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{n,t as r}from"./date-selector-DX925VNg.js";var i,a,o,s,c,l,u;e((()=>{i=t(),n(),a={title:`Booking/Molecules/Date Selector`,tags:[`!dev`],component:r,parameters:{layout:`centered`,docs:{description:{component:`The Date Selector is the top of the Sagamore Spring booking flow — a
scrollable row of date chips, just like OpenTable's. Pick the day you tee
off and the tee sheet below updates to match. The selected chip turns
Sagamore green; today wears a small marker so you never lose your place.`}}},argTypes:{days:{control:{type:`number`,min:1,max:30}},value:{control:!1},defaultValue:{control:!1},startDate:{control:!1},onChange:{action:`date-selected`}},args:{days:7},decorators:[e=>(0,i.jsx)(`div`,{className:`w-[480px] max-w-full`,children:(0,i.jsx)(e,{})})]},o={},s={args:{days:7}},c={args:{days:7}},l={args:{days:7,defaultValue:(()=>{let e=new Date;return e.setDate(e.getDate()+3),e})()}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Tweak the day count and watch the strip in the controls panel.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    days: 7
  }
}`,...s.parameters?.docs?.source},description:{story:`Two weeks of tee-off dates — the standard Sagamore Spring booking window.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    days: 7
  }
}`,...c.parameters?.docs?.source},description:{story:`A tighter seven-day view for booking your round earlier in the week.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    days: 7,
    defaultValue: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      return date;
    })()
  }
}`,...l.parameters?.docs?.source},description:{story:`Arriving with a day already locked in — here we tee off three days out.`,...l.parameters?.docs?.description}}},u=[`Playground`,`Default`,`Week`,`Preselected`]}))();export{s as Default,o as Playground,l as Preselected,c as Week,u as __namedExportsOrder,a as default};