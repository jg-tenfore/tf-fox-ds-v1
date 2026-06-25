import{i as e,l as t}from"./preload-helper-tpQASj4C.js";import{d as n,j as r}from"./iframe-DVR_kFd5.js";import{a as i,i as a,l as o,o as s}from"./sagamore-data-CJPedKNE.js";import{n as c,t as l}from"./tee-time-slot-BGuiPcDv.js";var u,d,f,p,m,h,g,_,v;e((()=>{u=n(),d=t(r()),c(),s(),f={title:`Booking/Molecules/Tee Time Slot`,tags:[`!dev`],component:l,parameters:{layout:`centered`,docs:{description:{component:`The tee-time slot is the tappable heart of the Sagamore Spring availability
screen — the Resy-style time chip a golfer taps to grab a spot. It shows the
tee time, the per-player green fee, and how many spots are left. Selected
slots fill in Sagamore green; everything else stays calm and monochrome.`}}},argTypes:{time:{control:`text`},price:{control:`number`},spotsAvailable:{control:{type:`range`,min:0,max:4,step:1}},isSelected:{control:`boolean`},isDisabled:{control:`boolean`},size:{control:`inline-radio`,options:[`sm`,`md`]}},args:{time:`7:10 AM`,price:62,spotsAvailable:4,isSelected:!1,isDisabled:!1,size:`md`}},p={},m={render:()=>(0,u.jsxs)(`div`,{className:`flex flex-wrap items-start gap-3`,children:[(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,u.jsx)(l,{time:`7:10 AM`,price:62,spotsAvailable:4}),(0,u.jsx)(`span`,{className:`text-xs text-tertiary`,children:`Default`})]}),(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,u.jsx)(l,{time:`7:20 AM`,price:62,spotsAvailable:4,isSelected:!0}),(0,u.jsx)(`span`,{className:`text-xs text-tertiary`,children:`Selected`})]}),(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,u.jsx)(l,{time:`7:30 AM`,price:62,spotsAvailable:1}),(0,u.jsx)(`span`,{className:`text-xs text-tertiary`,children:`Last spot`})]}),(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,u.jsx)(l,{time:`7:40 AM`,price:62,spotsAvailable:0}),(0,u.jsx)(`span`,{className:`text-xs text-tertiary`,children:`Full · disabled`})]})]})},h={render:()=>(0,u.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,u.jsx)(l,{size:`sm`,time:`9:00 AM`,price:62,spotsAvailable:4}),(0,u.jsx)(l,{size:`md`,time:`9:00 AM`,price:62,spotsAvailable:4})]})},g={render:()=>{let[e,t]=(0,d.useState)(null),n=i(`weekend`);return(0,u.jsx)(`div`,{className:`flex max-w-2xl flex-col gap-5`,children:Object.keys(n).map(r=>(0,u.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,u.jsx)(`h3`,{className:`text-sm font-semibold text-secondary`,children:o[r]}),(0,u.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:n[r].slice(0,6).map(n=>(0,u.jsx)(l,{teeTime:n,size:`sm`,isSelected:e===n.id,onPress:()=>t(n.id)},n.id))})]},r))})}},_={render:()=>(0,u.jsx)(`div`,{className:`flex max-w-xl flex-wrap gap-2`,children:a(`weekday`).slice(0,8).map(e=>(0,u.jsx)(l,{teeTime:e,size:`sm`},e.id))})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source},description:{story:`Tee up your own slot — twist the knobs to see every state.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-start gap-3">
            <div className="flex flex-col items-center gap-2">
                <TeeTimeSlot time="7:10 AM" price={62} spotsAvailable={4} />
                <span className="text-xs text-tertiary">Default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <TeeTimeSlot time="7:20 AM" price={62} spotsAvailable={4} isSelected />
                <span className="text-xs text-tertiary">Selected</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <TeeTimeSlot time="7:30 AM" price={62} spotsAvailable={1} />
                <span className="text-xs text-tertiary">Last spot</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <TeeTimeSlot time="7:40 AM" price={62} spotsAvailable={0} />
                <span className="text-xs text-tertiary">Full · disabled</span>
            </div>
        </div>
}`,...m.parameters?.docs?.source},description:{story:`Every shape a slot can take on the tee sheet, from wide open to fully booked.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-3">
            <TeeTimeSlot size="sm" time="9:00 AM" price={62} spotsAvailable={4} />
            <TeeTimeSlot size="md" time="9:00 AM" price={62} spotsAvailable={4} />
        </div>
}`,...h.parameters?.docs?.source},description:{story:"Two sizes: compact `sm` for dense tee sheets, roomy `md` for the booking screen.",...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const groups = groupTeeTimes("weekend");
    return <div className="flex max-w-2xl flex-col gap-5">
                {(Object.keys(groups) as TimeOfDay[]).map(window => <div key={window} className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-secondary">{timeOfDayLabels[window]}</h3>
                        <div className="flex flex-wrap gap-2">
                            {groups[window].slice(0, 6).map(slot => <TeeTimeSlot key={slot.id} teeTime={slot} size="sm" isSelected={selectedId === slot.id} onPress={() => setSelectedId(slot.id)} />)}
                        </div>
                    </div>)}
            </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:`A live morning row from the Sagamore tee sheet — tap a slot to lock it in.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const slots = generateTeeTimes("weekday").slice(0, 8);
    return <div className="flex max-w-xl flex-wrap gap-2">
                {slots.map(slot => <TeeTimeSlot key={slot.id} teeTime={slot} size="sm" />)}
            </div>;
  }
}`,..._.parameters?.docs?.source},description:{story:`Full tee sheet including sold-out slots, so you can see the muted disabled state inline.`,..._.parameters?.docs?.description}}},v=[`Playground`,`States`,`Sizes`,`Grid`,`FullSheetWithSoldOut`]}))();export{_ as FullSheetWithSoldOut,g as Grid,p as Playground,h as Sizes,m as States,v as __namedExportsOrder,f as default};