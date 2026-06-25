import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{ct as n,it as r,n as i,nn as a}from"./dist-DtvLQRd8.js";import{n as o,r as s,t as c}from"./cx-BIL-0sez.js";import{n as l,t as u}from"./button-EClWuHCL.js";import{n as d,t as f}from"./featured-icon-BmnZpxKA.js";import{i as p,t as m}from"./badges-DxlZn62T.js";import{n as h,t as g}from"./avatar-label-group-d_hlwJg_.js";var _,v,y,b=e((()=>{_=t(),o(),v=s({sm:{root:`gap-3 pb-4`,content:`gap-1`,titleRow:`gap-2`,title:`text-md font-semibold text-primary`,supportingText:`text-sm text-tertiary`},md:{root:`gap-4 pb-5`,content:`gap-1`,titleRow:`gap-2`,title:`text-lg font-semibold text-primary`,supportingText:`text-sm text-tertiary`},lg:{root:`gap-4 pb-5`,content:`gap-1`,titleRow:`gap-2.5`,title:`text-xl font-semibold text-primary`,supportingText:`text-md text-tertiary`}}),y=({size:e=`md`,title:t,supportingText:n,leading:r,badge:i,actions:a,withBorder:o=!1,className:s})=>(0,_.jsxs)(`header`,{className:c(`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between`,v[e].root,o&&`border-b border-secondary`,s),children:[(0,_.jsxs)(`div`,{className:c(`flex min-w-0 flex-1 items-start`,v[e].content),children:[r&&(0,_.jsx)(`div`,{className:`shrink-0`,children:r}),(0,_.jsxs)(`div`,{className:c(`flex min-w-0 flex-1 flex-col`,v[e].content),children:[(0,_.jsxs)(`div`,{className:c(`flex items-center`,v[e].titleRow),children:[(0,_.jsx)(`h2`,{className:c(`min-w-0 truncate`,v[e].title),children:t}),i&&(0,_.jsx)(`div`,{className:`shrink-0`,children:i})]}),n&&(0,_.jsx)(`p`,{className:v[e].supportingText,children:n})]})]}),a&&(0,_.jsx)(`div`,{className:`flex shrink-0 items-center gap-3`,children:a})]}),y.__docgenInfo={description:``,methods:[],displayName:`CardHeader`,props:{size:{required:!1,tsType:{name:`unknown`},description:`The size variant of the card header.`,defaultValue:{value:`"md"`,computed:!1}},title:{required:!0,tsType:{name:`ReactNode`},description:`The main heading text.`},supportingText:{required:!1,tsType:{name:`ReactNode`},description:`Optional supporting text shown beneath the title.`},leading:{required:!1,tsType:{name:`ReactNode`},description:`Optional leading element such as an avatar, badge or featured icon.`},badge:{required:!1,tsType:{name:`ReactNode`},description:`Optional badge shown next to the title (e.g. a count).`},actions:{required:!1,tsType:{name:`ReactNode`},description:`Optional trailing actions slot (e.g. buttons).`},withBorder:{required:!1,tsType:{name:`boolean`},description:`Whether to render a bottom divider/border.`,defaultValue:{value:`false`,computed:!1}},className:{required:!1,tsType:{name:`string`},description:`Additional class names for the root element.`}}}})),x,S,C,w,T,E,D,O,k;e((()=>{x=t(),i(),b(),h(),p(),l(),d(),S={title:`Application Components/Card Headers`,component:y,parameters:{layout:`padded`,docs:{description:{component:`The Card Header sits at the top of a card or section — a tee sheet, a member
list, a round history. It pairs a title (with an optional count badge and
leading element) against a trailing actions slot. The monochromatic
"Sagamore" theme keeps everything greyscale.`}}},argTypes:{size:{control:`radio`,options:[`sm`,`md`,`lg`]},withBorder:{control:`boolean`},title:{control:`text`},supportingText:{control:`text`}},args:{size:`md`,withBorder:!0,title:`Tee sheet — today`,supportingText:`Every booked tee time across all 18 holes.`},decorators:[e=>(0,x.jsx)(`div`,{className:`w-full max-w-3xl`,children:(0,x.jsx)(e,{})})]},C={},w={args:{withBorder:!1,title:`Course conditions`,supportingText:`Greens running at 11 on the stimp. Cart path only on 4 and 12.`}},T={args:{title:`Recent rounds`,supportingText:`Scores posted by members over the last seven days.`,actions:(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(u,{size:`md`,color:`secondary`,iconLeading:r,children:`Refresh`}),(0,x.jsx)(u,{size:`md`,color:`link-color`,children:`View all`})]})}},E={args:{title:`Members`,supportingText:`Active memberships at Sagamore this season.`,badge:(0,x.jsx)(m,{size:`md`,color:`gray`,type:`pill-color`,children:`240`}),actions:(0,x.jsx)(u,{size:`md`,color:`primary`,iconLeading:n,children:`Add member`})}},D={args:{title:``,supportingText:``,withBorder:!0,leading:(0,x.jsx)(g,{size:`md`,src:`https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80`,alt:`Olivia Rhye`,title:`Olivia Rhye`,subtitle:`Head professional · Lessons & fittings`}),actions:(0,x.jsx)(u,{size:`md`,color:`secondary`,children:`Book a lesson`})}},O={render:()=>(0,x.jsx)(`div`,{className:`flex flex-col gap-10`,children:[`sm`,`md`,`lg`].map(e=>(0,x.jsx)(y,{size:e,withBorder:!0,leading:(0,x.jsx)(f,{icon:a,color:`gray`,theme:`modern`,size:e===`lg`?`lg`:`md`}),title:`Front nine — ${e}`,supportingText:`Pin positions and pace-of-play notes for the front side.`,badge:(0,x.jsx)(m,{size:`sm`,color:`gray`,type:`pill-color`,children:`9`}),actions:(0,x.jsx)(u,{size:`md`,color:`link-color`,children:`View all`})},e))})},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    withBorder: false,
    title: "Course conditions",
    supportingText: "Greens running at 11 on the stimp. Cart path only on 4 and 12."
  }
}`,...w.parameters?.docs?.source},description:{story:`Just a title and supporting text — the bare scorecard.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Recent rounds",
    supportingText: "Scores posted by members over the last seven days.",
    actions: <>
                <Button size="md" color="secondary" iconLeading={RefreshCw01}>
                    Refresh
                </Button>
                <Button size="md" color="link-color">
                    View all
                </Button>
            </>
  }
}`,...T.parameters?.docs?.source},description:{story:`Title on the left, a button group of actions tucked on the right.`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Members",
    supportingText: "Active memberships at Sagamore this season.",
    badge: <Badge size="md" color="gray" type="pill-color">
                240
            </Badge>,
    actions: <Button size="md" color="primary" iconLeading={Plus}>
                Add member
            </Button>
  }
}`,...E.parameters?.docs?.source},description:{story:`A count badge sits beside the title — 240 members on the roster.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    title: "",
    supportingText: "",
    withBorder: true,
    leading: <AvatarLabelGroup size="md" src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" alt="Olivia Rhye" title="Olivia Rhye" subtitle="Head professional · Lessons & fittings" />,
    actions: <Button size="md" color="secondary">
                Book a lesson
            </Button>
  }
}`,...D.parameters?.docs?.source},description:{story:`A leading AvatarLabelGroup — the head pro fronting the lesson schedule.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-10">
            {(["sm", "md", "lg"] as const).map(size => <CardHeader key={size} size={size} withBorder leading={<FeaturedIcon icon={Flag01} color="gray" theme="modern" size={size === "lg" ? "lg" : "md"} />} title={\`Front nine — \${size}\`} supportingText="Pin positions and pace-of-play notes for the front side." badge={<Badge size="sm" color="gray" type="pill-color">
                            9
                        </Badge>} actions={<Button size="md" color="link-color">
                            View all
                        </Button>} />)}
        </div>
}`,...O.parameters?.docs?.source},description:{story:`All three sizes, with a leading featured icon and a count badge.`,...O.parameters?.docs?.description}}},k=[`Playground`,`Simple`,`WithActions`,`WithBadge`,`WithAvatar`,`Sizes`]}))();export{C as Playground,w as Simple,O as Sizes,T as WithActions,D as WithAvatar,E as WithBadge,k as __namedExportsOrder,S as default};