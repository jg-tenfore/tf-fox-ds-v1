import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{n,t as r}from"./button-EClWuHCL.js";import{i,t as a}from"./input-BVdHvg1n.js";import{n as o,t as s}from"./form-wKDAk6Bt.js";var c,l,u,d,f;e((()=>{c=t(),n(),o(),i(),l={title:`Base Components/Form`,component:s,parameters:{layout:`centered`,docs:{description:{component:"`Form` is a thin wrapper over React Aria's `Form` that wires up native and\nserver-driven validation for the fields inside it. Here it powers the\nSagamore member sign-up — native HTML validation fires on submit."}}}},u={render:()=>(0,c.jsxs)(s,{onSubmit:e=>e.preventDefault(),className:`flex w-80 flex-col gap-4`,children:[(0,c.jsx)(a,{isRequired:!0,name:`name`,label:`Full name`,placeholder:`Olivia Rhye`}),(0,c.jsx)(a,{isRequired:!0,type:`email`,name:`email`,label:`Email`,placeholder:`olivia@sagamore.golf`}),(0,c.jsx)(r,{type:`submit`,className:`mt-2`,children:`Reserve tee time`})]})},d={render:()=>(0,c.jsxs)(s,{validationBehavior:`native`,onSubmit:e=>e.preventDefault(),className:`flex w-80 flex-col gap-4`,children:[(0,c.jsx)(a,{isRequired:!0,name:`member-id`,label:`Member ID`,placeholder:`SAG-00000`}),(0,c.jsx)(a,{isRequired:!0,type:`tel`,name:`phone`,label:`Phone`,placeholder:`(555) 000-0000`}),(0,c.jsxs)(`div`,{className:`mt-2 flex gap-3`,children:[(0,c.jsx)(r,{type:`submit`,children:`Save`}),(0,c.jsx)(r,{type:`reset`,color:`secondary`,children:`Reset`})]})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Form onSubmit={e => e.preventDefault()} className="flex w-80 flex-col gap-4">
            <Input isRequired name="name" label="Full name" placeholder="Olivia Rhye" />
            <Input isRequired type="email" name="email" label="Email" placeholder="olivia@sagamore.golf" />
            <Button type="submit" className="mt-2">
                Reserve tee time
            </Button>
        </Form>
}`,...u.parameters?.docs?.source},description:{story:`A small booking-contact form. Submit with an empty field to see validation.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Form validationBehavior="native" onSubmit={e => e.preventDefault()} className="flex w-80 flex-col gap-4">
            <Input isRequired name="member-id" label="Member ID" placeholder="SAG-00000" />
            <Input isRequired type="tel" name="phone" label="Phone" placeholder="(555) 000-0000" />
            <div className="mt-2 flex gap-3">
                <Button type="submit">Save</Button>
                <Button type="reset" color="secondary">
                    Reset
                </Button>
            </div>
        </Form>
}`,...d.parameters?.docs?.source},description:{story:`Validation behaviour set to native — the browser surfaces field errors.`,...d.parameters?.docs?.description}}},f=[`Playground`,`NativeValidation`]}))();export{d as NativeValidation,u as Playground,f as __namedExportsOrder,l as default};