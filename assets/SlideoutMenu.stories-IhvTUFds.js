import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-BL8-forT.js";import{n,t as r}from"./button-Bm1PnFe0.js";import{i,t as a}from"./input-D6aNArPO.js";import{r as o,t as s}from"./checkbox-CvLmVuNY.js";import{r as c,t as l}from"./toggle-DOE887u4.js";import{n as u,t as d}from"./slideout-menu-CS1rB0up.js";var f,p,m,h,g;e((()=>{f=t(),n(),o(),i(),c(),u(),p={title:`Design System/Components/Actions/Slideout Menu`,id:`components-actions-slideout-menu`,component:d,parameters:{layout:`centered`,docs:{description:{component:"The Slideout Menu glides in from the right edge of the clubhouse, a quiet panel for\ntidying up a tee time without leaving the page. It is built on react-aria-components:\n`SlideoutMenu.Trigger` wraps the opening Button, and the drawer renders a `close`\nrender prop so Save and Cancel can latch the panel shut. The drawer always slides from\nthe right; its width is set by `max-w-100` and can be widened via `className`."}}},argTypes:{isDismissable:{control:`boolean`,description:`Allow closing the drawer by clicking the overlay.`}}},m={args:{children:null},render:()=>(0,f.jsxs)(d.Trigger,{children:[(0,f.jsx)(r,{color:`secondary`,children:`Edit booking`}),(0,f.jsx)(d,{isDismissable:!0,children:({close:e})=>(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)(d.Header,{onClose:e,children:[(0,f.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:`Edit booking`}),(0,f.jsx)(`p`,{className:`mt-1 text-sm text-tertiary`,children:`Adjust the details for this tee time at Sagamore.`})]}),(0,f.jsxs)(d.Content,{children:[(0,f.jsx)(a,{label:`Member name`,placeholder:`Olivia Rhye`,defaultValue:`Olivia Rhye`}),(0,f.jsx)(a,{label:`Tee time`,placeholder:`8:40 AM`,defaultValue:`8:40 AM`}),(0,f.jsx)(a,{label:`Players`,placeholder:`4`,defaultValue:`4`}),(0,f.jsx)(a,{label:`Note for the starter`,placeholder:`Walking, no cart`})]}),(0,f.jsxs)(d.Footer,{className:`flex justify-end gap-3`,children:[(0,f.jsx)(r,{color:`secondary`,onClick:e,children:`Cancel`}),(0,f.jsx)(r,{color:`primary`,onClick:e,children:`Save changes`})]})]})})]})},h={args:{children:null},render:()=>(0,f.jsxs)(d.Trigger,{children:[(0,f.jsx)(r,{color:`secondary`,children:`Tee sheet filters`}),(0,f.jsx)(d,{isDismissable:!0,className:`max-w-110`,children:({close:e})=>(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)(d.Header,{onClose:e,children:[(0,f.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:`Tee sheet filters`}),(0,f.jsx)(`p`,{className:`mt-1 text-sm text-tertiary`,children:`Narrow the front-desk view to the bookings that matter.`})]}),(0,f.jsxs)(d.Content,{children:[(0,f.jsx)(l,{label:`Open slots only`,hint:`Hide tee times that are already booked.`,defaultSelected:!0}),(0,f.jsx)(l,{label:`Members only`,hint:`Exclude guest and outing bookings.`}),(0,f.jsx)(l,{label:`Carts requested`}),(0,f.jsxs)(`div`,{className:`flex flex-col gap-3 border-t border-secondary pt-5`,children:[(0,f.jsx)(`p`,{className:`text-sm font-medium text-secondary`,children:`Course`}),(0,f.jsx)(s,{label:`Highlands (18)`,defaultSelected:!0}),(0,f.jsx)(s,{label:`Meadows (9)`}),(0,f.jsx)(s,{label:`Practice range`})]})]}),(0,f.jsxs)(d.Footer,{className:`flex justify-end gap-3`,children:[(0,f.jsx)(r,{color:`link-gray`,onClick:e,children:`Clear all`}),(0,f.jsx)(r,{color:`primary`,onClick:e,children:`Apply filters`})]})]})})]})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source},description:{story:`A right-side "Edit booking" drawer with a few fields and Save/Cancel in the footer.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source},description:{story:`A wider "Tee sheet filters" drawer with toggles and checkboxes; width widened via className.`,...h.parameters?.docs?.description}}},g=[`Default`,`Filters`]}))();export{m as Default,h as Filters,g as __namedExportsOrder,p as default};