import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{n,t as r}from"./button-EClWuHCL.js";import{c as i,o as a}from"./sagamore-data-CJPedKNE.js";import{n as o,t as s}from"./round-card-wEl5xo6M.js";var c,l,u,d,f,p,m,h,g,_,v;e((()=>{c=t(),n(),o(),a(),l={title:`Booking/Molecules/Round Card`,tags:[`!dev`],component:s,parameters:{layout:`padded`,docs:{description:{component:`The round card is a Resy-style reservation card for the Sagamore Spring "My
rounds" list. It pairs a course photo with the tee date and time, a quick
holes · players · ride read, a status badge (green for upcoming, gray once
played, red if scrubbed), the party total, and a trailing slot for actions.`}}},decorators:[e=>(0,c.jsx)(`div`,{className:`mx-auto max-w-xl`,children:(0,c.jsx)(e,{})})]},u=e=>i.find(t=>t.status===e),d=(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(r,{color:`secondary`,size:`sm`,children:`View`}),(0,c.jsx)(r,{color:`link-destructive`,size:`sm`,children:`Cancel`})]}),f=(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(r,{color:`link-gray`,size:`sm`,children:`View`}),(0,c.jsx)(r,{color:`secondary`,size:`sm`,children:`Book again`})]}),p={args:{booking:u(`upcoming`),actions:d}},m={args:{booking:u(`upcoming`),actions:d}},h={args:{booking:u(`completed`),actions:f}},g={args:{booking:{...u(`completed`),id:`b-0900`,status:`cancelled`,dateLabel:`Fri, May 23`,timeLabel:`10:20 AM`},actions:(0,c.jsx)(r,{color:`secondary`,size:`sm`,children:`Rebook`})}},_={args:{booking:i[0]},render:()=>(0,c.jsx)(`div`,{className:`flex flex-col gap-3`,children:i.map(e=>(0,c.jsx)(s,{booking:e,actions:e.status===`completed`?f:d},e.id))})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    booking: byStatus("upcoming"),
    actions: upcomingActions
  }
}`,...p.parameters?.docs?.source},description:{story:`Play with the booking and actions live.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    booking: byStatus("upcoming"),
    actions: upcomingActions
  }
}`,...m.parameters?.docs?.source},description:{story:`A confirmed tee time at Sagamore Spring — green badge, ready to play.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    booking: byStatus("completed"),
    actions: completedActions
  }
}`,...h.parameters?.docs?.source},description:{story:`A round already walked — muted gray badge with a nudge to book again.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    booking: {
      ...byStatus("completed"),
      id: "b-0900",
      status: "cancelled",
      dateLabel: "Fri, May 23",
      timeLabel: "10:20 AM"
    },
    actions: <Button color="secondary" size="sm">
                Rebook
            </Button>
  }
}`,...g.parameters?.docs?.source},description:{story:`A scrubbed tee time — red badge, with the option to rebook the slot.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    booking: sampleBookings[0]
  },
  render: () => <div className="flex flex-col gap-3">
            {sampleBookings.map(booking => <RoundCard key={booking.id} booking={booking} actions={booking.status === "completed" ? completedActions : upcomingActions} />)}
        </div>
}`,..._.parameters?.docs?.source},description:{story:`The full "My rounds" stack — every Sagamore Spring booking with fitting actions.`,..._.parameters?.docs?.description}}},v=[`Playground`,`Upcoming`,`Completed`,`Cancelled`,`List`]}))();export{g as Cancelled,h as Completed,_ as List,p as Playground,m as Upcoming,v as __namedExportsOrder,l as default};