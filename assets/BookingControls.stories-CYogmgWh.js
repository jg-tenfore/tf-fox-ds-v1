import{i as e,l as t}from"./preload-helper-tpQASj4C.js";import{d as n,j as r}from"./iframe-JEutOpZn.js";import{i,n as a,r as o,t as s}from"./booking-filters-fPSTSAES.js";import{n as c,t as l}from"./player-stepper-DSJN5DFw.js";var u,d,f,p,m,h,g,_,v;e((()=>{u=n(),d=t(r()),i(),c(),f={title:`Booking/Molecules/Booking Controls`,tags:[`!dev`],parameters:{layout:`centered`,docs:{description:{component:`The compact controls that sit atop the Sagamore Spring tee sheet: how many in
your group, how long you're playing, whether you're walking or riding, and when
you want to tee off. Selected segments light up in the club green; everything
else stays monochrome.`}}}},p={render:()=>{let[e,t]=(0,d.useState)(2);return(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-3`,children:[(0,u.jsx)(`span`,{className:`text-sm font-medium text-secondary`,children:`Players in your group`}),(0,u.jsx)(l,{label:`Players`,value:e,onChange:t}),(0,u.jsxs)(`span`,{className:`text-sm text-tertiary`,children:[`Booking for `,e,` `,e===1?`golfer`:`golfers`]})]})}},m={render:()=>{let[e,t]=(0,d.useState)(18);return(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-3`,children:[(0,u.jsx)(`span`,{className:`text-sm font-medium text-secondary`,children:`How many holes?`}),(0,u.jsx)(s,{value:e,onChange:t})]})}},h={render:()=>{let[e,t]=(0,d.useState)(`walking`);return(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-3`,children:[(0,u.jsx)(`span`,{className:`text-sm font-medium text-secondary`,children:`Walking or riding?`}),(0,u.jsx)(a,{value:e,onChange:t})]})}},g={render:()=>{let[e,t]=(0,d.useState)(`morning`);return(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-3`,children:[(0,u.jsx)(`span`,{className:`text-sm font-medium text-secondary`,children:`When do you want to tee off?`}),(0,u.jsx)(o,{value:e,onChange:t})]})}},_={render:()=>{let[e,t]=(0,d.useState)(4),[n,r]=(0,d.useState)(18),[i,c]=(0,d.useState)(`cart`),[f,p]=(0,d.useState)(`morning`);return(0,u.jsxs)(`div`,{className:`flex max-w-3xl flex-col gap-6 rounded-2xl bg-primary p-6 ring-1 ring-secondary`,children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`h3`,{className:`text-lg font-semibold text-primary`,children:`Book a tee time`}),(0,u.jsx)(`p`,{className:`text-sm text-tertiary`,children:`Sagamore Spring Golf Club · Lynnfield, MA`})]}),(0,u.jsxs)(`div`,{className:`flex flex-wrap items-end gap-x-8 gap-y-5`,children:[(0,u.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,u.jsx)(`span`,{className:`text-sm font-medium text-secondary`,children:`Players`}),(0,u.jsx)(l,{label:`Players`,value:e,onChange:t,size:`sm`})]}),(0,u.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,u.jsx)(`span`,{className:`text-sm font-medium text-secondary`,children:`Holes`}),(0,u.jsx)(s,{value:n,onChange:r,size:`sm`})]}),(0,u.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,u.jsx)(`span`,{className:`text-sm font-medium text-secondary`,children:`Ride`}),(0,u.jsx)(a,{value:i,onChange:c,size:`sm`})]}),(0,u.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,u.jsx)(`span`,{className:`text-sm font-medium text-secondary`,children:`Tee-off window`}),(0,u.jsx)(o,{value:f,onChange:p,size:`sm`})]})]}),(0,u.jsxs)(`p`,{className:`text-sm text-tertiary`,children:[e,` `,e===1?`player`:`players`,` · `,n,` holes · `,i===`cart`?`riding`:`walking`,` · `,f]})]})}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [players, setPlayers] = useState(2);
    return <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-secondary">Players in your group</span>
                <PlayerStepper label="Players" value={players} onChange={setPlayers} />
                <span className="text-sm text-tertiary">
                    Booking for {players} {players === 1 ? "golfer" : "golfers"}
                </span>
            </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Party size — dial your group from a solo loop up to a full foursome.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [holes, setHoles] = useState<HoleCount>(18);
    return <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-secondary">How many holes?</span>
                <HolesFilter value={holes} onChange={setHoles} />
            </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Round length — a quick nine after work or the full eighteen.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [ride, setRide] = useState<RideType>("walking");
    return <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-secondary">Walking or riding?</span>
                <RideFilter value={ride} onChange={setRide} />
            </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`Getting around — walk the fairways or grab a cart.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [time, setTime] = useState<TimeOfDayType>("morning");
    return <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-secondary">When do you want to tee off?</span>
                <TimeOfDayFilter value={time} onChange={setTime} />
            </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:`Booking window — beat the heat in the morning or chase the twilight rate.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [players, setPlayers] = useState(4);
    const [holes, setHoles] = useState<HoleCount>(18);
    const [ride, setRide] = useState<RideType>("cart");
    const [time, setTime] = useState<TimeOfDayType>("morning");
    return <div className="flex max-w-3xl flex-col gap-6 rounded-2xl bg-primary p-6 ring-1 ring-secondary">
                <div>
                    <h3 className="text-lg font-semibold text-primary">Book a tee time</h3>
                    <p className="text-sm text-tertiary">Sagamore Spring Golf Club · Lynnfield, MA</p>
                </div>

                <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-secondary">Players</span>
                        <PlayerStepper label="Players" value={players} onChange={setPlayers} size="sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-secondary">Holes</span>
                        <HolesFilter value={holes} onChange={setHoles} size="sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-secondary">Ride</span>
                        <RideFilter value={ride} onChange={setRide} size="sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-secondary">Tee-off window</span>
                        <TimeOfDayFilter value={time} onChange={setTime} size="sm" />
                    </div>
                </div>

                <p className="text-sm text-tertiary">
                    {players} {players === 1 ? "player" : "players"} · {holes} holes · {ride === "cart" ? "riding" : "walking"} · {time}
                </p>
            </div>;
  }
}`,..._.parameters?.docs?.source},description:{story:`Every control together, as they'd line up in the reservation widget.`,..._.parameters?.docs?.description}}},v=[`PartySize`,`Holes`,`Ride`,`TimeOfDay`,`AllControls`]}))();export{_ as AllControls,m as Holes,p as PartySize,h as Ride,g as TimeOfDay,v as __namedExportsOrder,f as default};