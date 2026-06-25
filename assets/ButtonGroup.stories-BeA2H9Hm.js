import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{P as n,dr as r,mt as i,n as a,nn as o}from"./dist-DtvLQRd8.js";import{n as s,r as c,t as l}from"./button-group-DgWK8anD.js";var u,d,f,p,m,h,g;e((()=>{u=t(),a(),c(),d={title:`Base Components/Button Group`,component:l,parameters:{layout:`centered`,docs:{description:{component:`Button groups switch between mutually-exclusive views on the Sagamore tee
sheet — holes played, time of day, course. Single-selection, segmented, and
near-black in the selected state under the monochromatic theme.`}}},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}},args:{size:`md`}},f={render:e=>(0,u.jsxs)(l,{...e,defaultSelectedKeys:[`18`],children:[(0,u.jsx)(s,{id:`9`,children:`9 holes`}),(0,u.jsx)(s,{id:`18`,children:`18 holes`}),(0,u.jsx)(s,{id:`27`,children:`27 holes`})]})},p={render:e=>(0,u.jsxs)(l,{...e,defaultSelectedKeys:[`all`],children:[(0,u.jsx)(s,{id:`all`,iconLeading:o,children:`All day`}),(0,u.jsx)(s,{id:`am`,iconLeading:n,children:`Morning`}),(0,u.jsx)(s,{id:`pm`,iconLeading:i,children:`Twilight`})]})},m={render:e=>(0,u.jsxs)(l,{...e,defaultSelectedKeys:[`day`],"aria-label":`Calendar view`,children:[(0,u.jsx)(s,{id:`day`,iconLeading:n,"aria-label":`Day`}),(0,u.jsx)(s,{id:`week`,iconLeading:r,"aria-label":`Week`}),(0,u.jsx)(s,{id:`month`,iconLeading:o,"aria-label":`Month`})]})},h={render:()=>(0,u.jsx)(`div`,{className:`flex flex-col items-start gap-4`,children:[`sm`,`md`,`lg`].map(e=>(0,u.jsxs)(l,{size:e,defaultSelectedKeys:[`18`],children:[(0,u.jsx)(s,{id:`9`,children:`9 holes`}),(0,u.jsx)(s,{id:`18`,children:`18 holes`}),(0,u.jsx)(s,{id:`27`,children:`27 holes`})]},e))})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <ButtonGroup {...args} defaultSelectedKeys={["18"]}>
            <ButtonGroupItem id="9">9 holes</ButtonGroupItem>
            <ButtonGroupItem id="18">18 holes</ButtonGroupItem>
            <ButtonGroupItem id="27">27 holes</ButtonGroupItem>
        </ButtonGroup>
}`,...f.parameters?.docs?.source},description:{story:`Pick how many holes to book.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <ButtonGroup {...args} defaultSelectedKeys={["all"]}>
            <ButtonGroupItem id="all" iconLeading={Flag01}>
                All day
            </ButtonGroupItem>
            <ButtonGroupItem id="am" iconLeading={Sun}>
                Morning
            </ButtonGroupItem>
            <ButtonGroupItem id="pm" iconLeading={Moon01}>
                Twilight
            </ButtonGroupItem>
        </ButtonGroup>
}`,...p.parameters?.docs?.source},description:{story:`Leading icons label the round type.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <ButtonGroup {...args} defaultSelectedKeys={["day"]} aria-label="Calendar view">
            <ButtonGroupItem id="day" iconLeading={Sun} aria-label="Day" />
            <ButtonGroupItem id="week" iconLeading={CalendarDate} aria-label="Week" />
            <ButtonGroupItem id="month" iconLeading={Flag01} aria-label="Month" />
        </ButtonGroup>
}`,...m.parameters?.docs?.source},description:{story:`Icon-only group — calendar view switcher on the booking page.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-4">
            {(["sm", "md", "lg"] as const).map(size => <ButtonGroup key={size} size={size} defaultSelectedKeys={["18"]}>
                    <ButtonGroupItem id="9">9 holes</ButtonGroupItem>
                    <ButtonGroupItem id="18">18 holes</ButtonGroupItem>
                    <ButtonGroupItem id="27">27 holes</ButtonGroupItem>
                </ButtonGroup>)}
        </div>
}`,...h.parameters?.docs?.source},description:{story:`The three sizes stacked.`,...h.parameters?.docs?.description}}},g=[`Playground`,`WithIcons`,`IconOnly`,`Sizes`]}))();export{m as IconOnly,f as Playground,h as Sizes,p as WithIcons,g as __namedExportsOrder,d as default};