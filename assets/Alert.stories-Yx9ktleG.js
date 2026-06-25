import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{Fr as n,Lr as r,T as i,Vt as a,mr as o,n as s,tr as c}from"./dist-DtvLQRd8.js";import{n as l,t as u}from"./button-EClWuHCL.js";import{n as d,t as f}from"./alert-ayL7dWPi.js";var p,m,h,g,_,v,y,b;e((()=>{p=t(),s(),d(),l(),m={title:`Application Components/Alerts`,component:f,parameters:{layout:`centered`,docs:{description:{component:`Alerts surface time-sensitive course news to golfers — a confirmed tee time,
an aeration closure, or a failed payment. They lead with a featured icon, pair
a title with supporting text, and can carry inline actions or a dismiss
button. The monochromatic theme renders the \`brand\`/\`gray\` colors in greyscale
while success, warning, and error keep their hues so intent stays legible.`}}},argTypes:{color:{control:`select`,options:[`gray`,`brand`,`success`,`warning`,`error`]}}},h={args:{color:`success`,icon:o,title:`Tee time confirmed`,description:`You're booked on the Championship at 7:10 AM Saturday. A cart is included — arrive 20 minutes early.`},render:e=>(0,p.jsx)(`div`,{className:`w-[28rem]`,children:(0,p.jsx)(f,{...e})})},g={render:()=>(0,p.jsxs)(`div`,{className:`flex w-[28rem] flex-col gap-4`,children:[(0,p.jsx)(f,{color:`brand`,icon:a,title:`New booking window open`,description:`Members can now reserve tee times seven days ahead.`}),(0,p.jsx)(f,{color:`gray`,icon:o,title:`Round added to your calendar`,description:`We sent an invite to your inbox for Saturday morning.`}),(0,p.jsx)(f,{color:`success`,icon:c,title:`Tee time confirmed`,description:`You're on the Championship at 7:10 AM. See you at the first tee.`}),(0,p.jsx)(f,{color:`warning`,icon:i,title:`Course closed for aeration`,description:`The back nine is closed through Friday while greens recover. Front nine play continues as scheduled.`}),(0,p.jsx)(f,{color:`error`,icon:r,title:`Payment failed`,description:`We couldn't charge your card for the Saturday booking. Update your payment method to hold the slot.`})]})},_={render:()=>(0,p.jsx)(`div`,{className:`w-[28rem]`,children:(0,p.jsx)(f,{color:`warning`,icon:n,title:`Course closed for aeration`,description:`The Championship greens are being aerated this week. Want to play the Executive instead, or rebook for next weekend?`,onClose:()=>console.log(`alert dismissed`),actions:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(u,{size:`sm`,color:`link-gray`,children:`Dismiss`}),(0,p.jsx)(u,{size:`sm`,color:`link-color`,children:`View open tee times`})]})})})},v={render:()=>(0,p.jsx)(`div`,{className:`w-[28rem]`,children:(0,p.jsx)(f,{color:`error`,icon:r,title:`Payment failed`,description:`Your card was declined for the Saturday 7:10 AM booking. We'll hold the slot for 10 minutes while you retry.`,onClose:()=>console.log(`alert dismissed`),closeLabel:`Dismiss payment alert`})})},y={render:()=>(0,p.jsx)(`div`,{className:`w-[28rem]`,children:(0,p.jsx)(f,{icon:!1,color:`gray`,title:`Frost delay in effect`,description:`The first tee is held until 7:30 AM while the greens thaw. Grab a coffee in the clubhouse.`})})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    color: "success",
    icon: CalendarCheck01,
    title: "Tee time confirmed",
    description: "You're booked on the Championship at 7:10 AM Saturday. A cart is included — arrive 20 minutes early."
  },
  render: args => <div className="w-[28rem]">
            <Alert {...args} />
        </div>
}`,...h.parameters?.docs?.source},description:{story:`The default alert: tweak color, theme, title, and description live.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex w-[28rem] flex-col gap-4">
            <Alert color="brand" icon={InfoCircle} title="New booking window open" description="Members can now reserve tee times seven days ahead." />
            <Alert color="gray" icon={CalendarCheck01} title="Round added to your calendar" description="We sent an invite to your inbox for Saturday morning." />
            <Alert color="success" icon={CheckCircle} title="Tee time confirmed" description="You're on the Championship at 7:10 AM. See you at the first tee." />
            <Alert color="warning" icon={Tool01} title="Course closed for aeration" description="The back nine is closed through Friday while greens recover. Front nine play continues as scheduled." />
            <Alert color="error" icon={AlertCircle} title="Payment failed" description="We couldn't charge your card for the Saturday booking. Update your payment method to hold the slot." />
        </div>
}`,...g.parameters?.docs?.source},description:{story:`One alert per color, showing the full intent spectrum on the tee sheet.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[28rem]">
            <Alert color="warning" icon={AlertTriangle} title="Course closed for aeration" description="The Championship greens are being aerated this week. Want to play the Executive instead, or rebook for next weekend?" onClose={() => console.log("alert dismissed")} actions={<>
                        <Button size="sm" color="link-gray">
                            Dismiss
                        </Button>
                        <Button size="sm" color="link-color">
                            View open tee times
                        </Button>
                    </>} />
        </div>
}`,..._.parameters?.docs?.source},description:{story:`A warning with inline actions plus a dismiss button — the closure with next steps.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[28rem]">
            <Alert color="error" icon={AlertCircle} title="Payment failed" description="Your card was declined for the Saturday 7:10 AM booking. We'll hold the slot for 10 minutes while you retry." onClose={() => console.log("alert dismissed")} closeLabel="Dismiss payment alert" />
        </div>
}`,...v.parameters?.docs?.source},description:{story:`Dismissible error: a failed payment the golfer can clear once resolved.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[28rem]">
            <Alert icon={false} color="gray" title="Frost delay in effect" description="The first tee is held until 7:30 AM while the greens thaw. Grab a coffee in the clubhouse." />
        </div>
}`,...y.parameters?.docs?.source},description:{story:`Minimal: no leading icon, just a title and a line of supporting text.`,...y.parameters?.docs?.description}}},b=[`Playground`,`Colors`,`WithActions`,`Dismissible`,`Minimal`]}))();export{g as Colors,v as Dismissible,y as Minimal,h as Playground,_ as WithActions,b as __namedExportsOrder,m as default};