import{i as e,l as t}from"./preload-helper-tpQASj4C.js";import{d as n,j as r}from"./iframe-DVR_kFd5.js";import{B as i,Un as a,Ut as o,n as s,nn as c}from"./dist-DtvLQRd8.js";import{Cn as l,bn as u,t as d,xn as f}from"./exports-DkrSnyBY.js";import{n as p,r as m,t as h}from"./cx-BIL-0sez.js";import{n as g,t as _}from"./is-react-component-Dhq-fHgk.js";var v,y,b,x,S,C,w,T,E,D=e((()=>{v=n(),y=t(r()),s(),d(),p(),_(),b=m({list:`flex items-center gap-1.5`,divider:`size-4 shrink-0 text-fg-quaternary`,item:{text:h(`flex items-center gap-1.5 rounded-sm text-sm font-semibold outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2`,`text-quaternary hover:text-secondary`),button:h(`flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2`,`text-quaternary hover:bg-primary_hover hover:text-secondary`)},current:{text:`flex items-center gap-1.5 text-sm font-semibold text-secondary`,button:`flex items-center gap-1.5 rounded-md bg-primary_hover px-2 py-1 text-sm font-semibold text-secondary`},icon:`size-4 shrink-0 text-fg-quaternary transition-inherit-all`}),x={chevron:a,slash:i},S=({icon:e,children:t})=>(0,v.jsxs)(v.Fragment,{children:[(0,y.isValidElement)(e)&&e,g(e)&&(0,v.jsx)(e,{"data-icon":!0,className:b.icon}),t]}),C=({href:e,routerOptions:t,icon:n,current:r,type:i=`text`,className:a,children:o,...s})=>{let c=r||!e;return(0,v.jsx)(f,{...s,className:h(`flex items-center gap-1.5`,a),children:c?(0,v.jsx)(`span`,{"aria-current":`page`,className:b.current[i],children:(0,v.jsx)(S,{icon:n,children:o})}):(0,v.jsx)(l,{href:e,routerOptions:t,className:b.item[i],children:(0,v.jsx)(S,{icon:n,children:o})})})},w=({items:e,divider:t=`chevron`,showHomeIcon:n=!1,type:r=`text`,className:i,children:a,...s})=>{let c=x[t],l=e?e.map((t,i)=>{let a=i===e.length-1,s=n&&i===0&&!t.icon?o:t.icon;return(0,v.jsxs)(y.Fragment,{children:[(0,v.jsx)(C,{href:t.href,icon:s,current:t.current??a,type:r,children:t.label}),!a&&(0,v.jsx)(c,{"aria-hidden":`true`,className:b.divider})]},i)}):a;return(0,v.jsx)(u,{"aria-label":`Breadcrumb`,...s,className:h(b.list,i),children:l})},T=w,E=({divider:e=`chevron`,className:t})=>{let n=x[e];return(0,v.jsx)(n,{"aria-hidden":`true`,className:h(b.divider,t)})},T.Item=C,T.Divider=E,C.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbItem`,props:{className:{required:!1,tsType:{name:`string`},description:`Additional classes for the crumb wrapper.`},href:{required:!1,tsType:{name:`AriaLinkProps["href"]`,raw:`AriaLinkProps["href"]`},description:`Destination for the crumb. When omitted the crumb renders as plain text.`},routerOptions:{required:!1,tsType:{name:`AriaLinkProps["routerOptions"]`,raw:`AriaLinkProps["routerOptions"]`},description:`Options for the configured client side router.`},icon:{required:!1,tsType:{name:`union`,raw:`FC<{ className?: string }> | ReactNode`,elements:[{name:`FC`,elements:[{name:`signature`,type:`object`,raw:`{ className?: string }`,signature:{properties:[{key:`className`,value:{name:`string`,required:!1}}]}}],raw:`FC<{ className?: string }>`},{name:`ReactNode`}]},description:`Optional leading icon (component reference or element).`},current:{required:!1,tsType:{name:`boolean`},description:`Marks this crumb as the current page (rendered as non-link text).`},type:{required:!1,tsType:{name:`union`,raw:`"text" | "button"`,elements:[{name:`literal`,value:`"text"`},{name:`literal`,value:`"button"`}]},description:`Visual style of the crumb.`,defaultValue:{value:`"text"`,computed:!1}},children:{required:!0,tsType:{name:`ReactNode`},description:``}},composes:[`Omit`]},w.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbsComponent`,props:{className:{required:!1,tsType:{name:`string`},description:`Additional classes for the nav element.`},items:{required:!1,tsType:{name:`Array`,elements:[{name:`BreadcrumbItemData`}],raw:`BreadcrumbItemData[]`},description:"The crumbs to render. When omitted, pass compound `Breadcrumbs.Item` children."},divider:{required:!1,tsType:{name:`union`,raw:`"chevron" | "slash"`,elements:[{name:`literal`,value:`"chevron"`},{name:`literal`,value:`"slash"`}]},description:`The divider rendered between crumbs.`,defaultValue:{value:`"chevron"`,computed:!1}},showHomeIcon:{required:!1,tsType:{name:`boolean`},description:`Shows a leading home icon on the first crumb.`,defaultValue:{value:`false`,computed:!1}},type:{required:!1,tsType:{name:`union`,raw:`"text" | "button"`,elements:[{name:`literal`,value:`"text"`},{name:`literal`,value:`"button"`}]},description:`Visual style applied to every crumb.`,defaultValue:{value:`"text"`,computed:!1}},children:{required:!1,tsType:{name:`ReactNode`},description:"Compound children, used when `items` is not provided."}},composes:[`Omit`]}})),O,k,A,j,M,N,P,F,I,L;e((()=>{O=n(),s(),D(),k={title:`Application Components/Breadcrumbs`,component:T,parameters:{layout:`centered`,docs:{description:{component:`Breadcrumbs trace a golfer's path through the clubhouse — from the front door
down to a single hole or a booking confirmation. The current page sits at the
end as plain text while every prior crumb is a muted link that brightens on
hover. The monochromatic Sagamore theme keeps every divider in greyscale.`}}}},A=[{label:`Home`,href:`/`},{label:`Courses`,href:`/courses`},{label:`Championship`,href:`/courses/championship`},{label:`Hole 7`}],j={args:{items:A,divider:`chevron`,type:`text`,showHomeIcon:!1}},M={args:{items:A,divider:`chevron`}},N={args:{items:[{label:`Dashboard`,href:`/`},{label:`Tee sheet`,href:`/tee-sheet`},{label:`Booking`}],divider:`slash`}},P={args:{items:A,divider:`chevron`,showHomeIcon:!0}},F={args:{items:A,divider:`chevron`,type:`button`,showHomeIcon:!0}},I={render:()=>(0,O.jsxs)(T,{divider:`chevron`,children:[(0,O.jsx)(T.Item,{href:`/`,icon:o,children:`Home`}),(0,O.jsx)(T.Divider,{divider:`chevron`}),(0,O.jsx)(T.Item,{href:`/courses`,children:`Courses`}),(0,O.jsx)(T.Divider,{divider:`chevron`}),(0,O.jsx)(T.Item,{icon:c,current:!0,children:`Hole 7`})]})},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    items: courseTrail,
    divider: "chevron",
    type: "text",
    showHomeIcon: false
  }
}`,...j.parameters?.docs?.source},description:{story:`Default trail down to a single hole on the Championship course.`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    items: courseTrail,
    divider: "chevron"
  }
}`,...M.parameters?.docs?.source},description:{story:`Chevron dividers — the default Untitled UI separator.`,...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Dashboard",
      href: "/"
    }, {
      label: "Tee sheet",
      href: "/tee-sheet"
    }, {
      label: "Booking"
    }],
    divider: "slash"
  }
}`,...N.parameters?.docs?.source},description:{story:`Slash dividers for a more compact, typographic trail.`,...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    items: courseTrail,
    divider: "chevron",
    showHomeIcon: true
  }
}`,...P.parameters?.docs?.source},description:{story:`A leading home icon anchors the trail at the clubhouse front door.`,...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    items: courseTrail,
    divider: "chevron",
    type: "button",
    showHomeIcon: true
  }
}`,...F.parameters?.docs?.source},description:{story:`Button-style crumbs with hover backgrounds, useful in toolbars.`,...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <Breadcrumbs divider="chevron">
            <Breadcrumbs.Item href="/" icon={HomeLine}>
                Home
            </Breadcrumbs.Item>
            <Breadcrumbs.Divider divider="chevron" />
            <Breadcrumbs.Item href="/courses">Courses</Breadcrumbs.Item>
            <Breadcrumbs.Divider divider="chevron" />
            <Breadcrumbs.Item icon={Flag01} current>
                Hole 7
            </Breadcrumbs.Item>
        </Breadcrumbs>
}`,...I.parameters?.docs?.source},description:{story:"Per-crumb icons via the compound API instead of the `items` array.",...I.parameters?.docs?.description}}},L=[`Playground`,`ChevronDivider`,`SlashDivider`,`WithHomeIcon`,`ButtonStyle`,`CompoundWithIcons`]}))();export{F as ButtonStyle,M as ChevronDivider,I as CompoundWithIcons,j as Playground,N as SlashDivider,P as WithHomeIcon,L as __namedExportsOrder,k as default};