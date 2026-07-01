import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";import{G as n,K as r,ot as i,st as a,t as o}from"./exports-C3MqGbMz.js";import{n as s,t as c}from"./cx-BIL-0sez.js";import{n as l,t as u}from"./button-C9G3p5hZ.js";import{i as d,t as f}from"./input-D4ddWauq.js";import{r as p,t as m}from"./checkbox-C88IS67N.js";import{n as h,t as g}from"./close-button-CfSONmld.js";import{r as _,t as v}from"./toggle-F9jxvyai.js";var y,b,x,S,C,w,T,E,D,O=e((()=>{y=t(),o(),h(),s(),b=e=>(0,y.jsx)(r,{...e,className:t=>c(`fixed inset-0 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden ease-linear md:pl-10`,t.isEntering&&`duration-300 animate-in fade-in`,t.isExiting&&`duration-500 animate-out fade-out`,typeof e.className==`function`?e.className(t):e.className)}),b.displayName=`ModalOverlay`,x=e=>(0,y.jsx)(n,{...e,className:t=>c(`inset-y-0 right-0 h-full w-full max-w-100 shadow-xl transition`,t.isEntering&&`duration-300 animate-in slide-in-from-right`,t.isExiting&&`duration-500 animate-out slide-out-to-right`,typeof e.className==`function`?e.className(t):e.className)}),x.displayName=`Modal`,S=e=>(0,y.jsx)(a,{role:`dialog`,"aria-label":`Slideout menu`,...e,className:c(`relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-primary ring-1 ring-secondary_alt outline-hidden`,e.className)}),S.displayName=`Dialog`,C=({children:e,dialogClassName:t,...n})=>(0,y.jsx)(b,{...n,children:(0,y.jsx)(x,{className:e=>c(typeof n.className==`function`?n.className(e):n.className),children:n=>(0,y.jsx)(S,{className:t,children:({close:t})=>typeof e==`function`?e({...n,close:t}):e})})}),C.displayName=`SlideoutMenu`,w=({role:e=`main`,...t})=>(0,y.jsx)(`div`,{role:e,...t,className:c(`flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 md:px-6`,t.className)}),w.displayName=`SlideoutContent`,T=({className:e,children:t,onClose:n,...r})=>(0,y.jsxs)(`header`,{...r,className:c(`relative z-1 w-full px-4 pt-6 md:px-6`,e),children:[t,(0,y.jsx)(g,{size:`sm`,className:`absolute top-3 right-3 shrink-0`,onClick:n})]}),T.displayName=`SlideoutHeader`,E=e=>(0,y.jsx)(`footer`,{...e,className:c(`w-full p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6`,e.className)}),E.displayName=`SlideoutFooter`,D=C,D.displayName=`SlideoutMenu`,D.Trigger=i,D.Content=w,D.Header=T,D.Footer=E,b.__docgenInfo={description:``,methods:[],displayName:`ModalOverlay`,composes:[`AriaModalOverlayProps`,`RefAttributes`]},x.__docgenInfo={description:``,methods:[],displayName:`Modal`,composes:[`AriaModalOverlayProps`,`RefAttributes`]},S.__docgenInfo={description:``,methods:[],displayName:`Dialog`,composes:[`AriaDialogProps`,`RefAttributes`]},C.__docgenInfo={description:``,methods:[],displayName:`SlideoutMenu`,props:{children:{required:!0,tsType:{name:`union`,raw:`ReactNode | ((children: AriaModalRenderProps & { close: () => void }) => ReactNode)`,elements:[{name:`ReactNode`},{name:`unknown`}]},description:``},dialogClassName:{required:!1,tsType:{name:`string`},description:``}},composes:[`Omit`,`RefAttributes`]}})),k,A,j,M,N;e((()=>{k=t(),l(),p(),d(),_(),O(),A={title:`Application Components/Slideout Menu`,component:D,parameters:{layout:`centered`,docs:{description:{component:"The Slideout Menu glides in from the right edge of the clubhouse, a quiet panel for\ntidying up a tee time without leaving the page. It is built on react-aria-components:\n`SlideoutMenu.Trigger` wraps the opening Button, and the drawer renders a `close`\nrender prop so Save and Cancel can latch the panel shut. The drawer always slides from\nthe right; its width is set by `max-w-100` and can be widened via `className`."}}},argTypes:{isDismissable:{control:`boolean`,description:`Allow closing the drawer by clicking the overlay.`}}},j={args:{children:null},render:()=>(0,k.jsxs)(D.Trigger,{children:[(0,k.jsx)(u,{color:`secondary`,children:`Edit booking`}),(0,k.jsx)(D,{isDismissable:!0,children:({close:e})=>(0,k.jsxs)(k.Fragment,{children:[(0,k.jsxs)(D.Header,{onClose:e,children:[(0,k.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:`Edit booking`}),(0,k.jsx)(`p`,{className:`mt-1 text-sm text-tertiary`,children:`Adjust the details for this tee time at Sagamore.`})]}),(0,k.jsxs)(D.Content,{children:[(0,k.jsx)(f,{label:`Member name`,placeholder:`Olivia Rhye`,defaultValue:`Olivia Rhye`}),(0,k.jsx)(f,{label:`Tee time`,placeholder:`8:40 AM`,defaultValue:`8:40 AM`}),(0,k.jsx)(f,{label:`Players`,placeholder:`4`,defaultValue:`4`}),(0,k.jsx)(f,{label:`Note for the starter`,placeholder:`Walking, no cart`})]}),(0,k.jsxs)(D.Footer,{className:`flex justify-end gap-3`,children:[(0,k.jsx)(u,{color:`secondary`,onClick:e,children:`Cancel`}),(0,k.jsx)(u,{color:`primary`,onClick:e,children:`Save changes`})]})]})})]})},M={args:{children:null},render:()=>(0,k.jsxs)(D.Trigger,{children:[(0,k.jsx)(u,{color:`secondary`,children:`Tee sheet filters`}),(0,k.jsx)(D,{isDismissable:!0,className:`max-w-110`,children:({close:e})=>(0,k.jsxs)(k.Fragment,{children:[(0,k.jsxs)(D.Header,{onClose:e,children:[(0,k.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:`Tee sheet filters`}),(0,k.jsx)(`p`,{className:`mt-1 text-sm text-tertiary`,children:`Narrow the front-desk view to the bookings that matter.`})]}),(0,k.jsxs)(D.Content,{children:[(0,k.jsx)(v,{label:`Open slots only`,hint:`Hide tee times that are already booked.`,defaultSelected:!0}),(0,k.jsx)(v,{label:`Members only`,hint:`Exclude guest and outing bookings.`}),(0,k.jsx)(v,{label:`Carts requested`}),(0,k.jsxs)(`div`,{className:`flex flex-col gap-3 border-t border-secondary pt-5`,children:[(0,k.jsx)(`p`,{className:`text-sm font-medium text-secondary`,children:`Course`}),(0,k.jsx)(m,{label:`Highlands (18)`,defaultSelected:!0}),(0,k.jsx)(m,{label:`Meadows (9)`}),(0,k.jsx)(m,{label:`Practice range`})]})]}),(0,k.jsxs)(D.Footer,{className:`flex justify-end gap-3`,children:[(0,k.jsx)(u,{color:`link-gray`,onClick:e,children:`Clear all`}),(0,k.jsx)(u,{color:`primary`,onClick:e,children:`Apply filters`})]})]})})]})},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <SlideoutMenu.Trigger>
            <Button color="secondary">Edit booking</Button>
            <SlideoutMenu isDismissable>
                {({
        close
      }) => <>
                        <SlideoutMenu.Header onClose={close}>
                            <h2 className="text-lg font-semibold text-primary">Edit booking</h2>
                            <p className="mt-1 text-sm text-tertiary">Adjust the details for this tee time at Sagamore.</p>
                        </SlideoutMenu.Header>

                        <SlideoutMenu.Content>
                            <Input label="Member name" placeholder="Olivia Rhye" defaultValue="Olivia Rhye" />
                            <Input label="Tee time" placeholder="8:40 AM" defaultValue="8:40 AM" />
                            <Input label="Players" placeholder="4" defaultValue="4" />
                            <Input label="Note for the starter" placeholder="Walking, no cart" />
                        </SlideoutMenu.Content>

                        <SlideoutMenu.Footer className="flex justify-end gap-3">
                            <Button color="secondary" onClick={close}>
                                Cancel
                            </Button>
                            <Button color="primary" onClick={close}>
                                Save changes
                            </Button>
                        </SlideoutMenu.Footer>
                    </>}
            </SlideoutMenu>
        </SlideoutMenu.Trigger>
}`,...j.parameters?.docs?.source},description:{story:`A right-side "Edit booking" drawer with a few fields and Save/Cancel in the footer.`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <SlideoutMenu.Trigger>
            <Button color="secondary">Tee sheet filters</Button>
            <SlideoutMenu isDismissable className="max-w-110">
                {({
        close
      }) => <>
                        <SlideoutMenu.Header onClose={close}>
                            <h2 className="text-lg font-semibold text-primary">Tee sheet filters</h2>
                            <p className="mt-1 text-sm text-tertiary">Narrow the front-desk view to the bookings that matter.</p>
                        </SlideoutMenu.Header>

                        <SlideoutMenu.Content>
                            <Toggle label="Open slots only" hint="Hide tee times that are already booked." defaultSelected />
                            <Toggle label="Members only" hint="Exclude guest and outing bookings." />
                            <Toggle label="Carts requested" />

                            <div className="flex flex-col gap-3 border-t border-secondary pt-5">
                                <p className="text-sm font-medium text-secondary">Course</p>
                                <Checkbox label="Highlands (18)" defaultSelected />
                                <Checkbox label="Meadows (9)" />
                                <Checkbox label="Practice range" />
                            </div>
                        </SlideoutMenu.Content>

                        <SlideoutMenu.Footer className="flex justify-end gap-3">
                            <Button color="link-gray" onClick={close}>
                                Clear all
                            </Button>
                            <Button color="primary" onClick={close}>
                                Apply filters
                            </Button>
                        </SlideoutMenu.Footer>
                    </>}
            </SlideoutMenu>
        </SlideoutMenu.Trigger>
}`,...M.parameters?.docs?.source},description:{story:`A wider "Tee sheet filters" drawer with toggles and checkboxes; width widened via className.`,...M.parameters?.docs?.description}}},N=[`Default`,`Filters`]}))();export{j as Default,M as Filters,N as __namedExportsOrder,A as default};