import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{$n as n,jt as r,n as i}from"./dist-DtvLQRd8.js";import{_ as a,h as o,r as s,v as c}from"./tenfore-chrome-_c7O2cjx.js";import{n as l,r as u,t as d}from"./club-style-guide-BwRPCsXq.js";var f,p,m,h,g,_;e((()=>{f=t(),i(),o(),u(),p={title:`Design Systems/FloGolf Indoor`,parameters:{layout:`fullscreen`,docs:{description:{component:`"Design Systems / FloGolf Indoor" — the simulator components in the FloGolf green colorway.`}}}},m=s.navColor,h=`flex h-14 w-28 shrink-0 flex-col justify-center gap-1 rounded-lg px-3`,g={name:`Style guide`,render:()=>(0,f.jsx)(d,{config:{club:s,accentName:`FloGolf green`,accentValue:m,calendarPrices:!1,selectorCells:[{label:`Date`,value:c(a)},{label:`Time`,value:`6:30 PM`},{label:`Players`,value:`4 Players`}],menuTitle:`Start time`,menuDefault:`1110`,menuSections:[{rows:[{value:`1110`,label:`6:30 PM`,right:`$20.00`},{value:`1140`,label:`7:00 PM`,right:`$27.50`},{value:`1170`,label:`7:30 PM`,right:`$27.50`},{value:`1200`,label:`8:00 PM`,right:`$27.50`}]}],cards:(0,f.jsxs)(`div`,{className:`flex flex-wrap gap-3`,children:[(0,f.jsx)(l,{state:`Open`,children:(0,f.jsxs)(`div`,{className:`${h} bg-primary ring-1 ring-secondary ring-inset`,children:[(0,f.jsx)(`span`,{className:`text-sm font-semibold text-primary tabular-nums`,children:`6:30 PM`}),(0,f.jsx)(`span`,{className:`text-xs font-semibold text-secondary tabular-nums`,children:`$20.00`})]})}),(0,f.jsx)(l,{state:`Selected`,children:(0,f.jsxs)(`div`,{className:`${h} text-white`,style:{backgroundColor:m},children:[(0,f.jsx)(`span`,{className:`text-sm font-semibold tabular-nums`,children:`6:30 PM`}),(0,f.jsxs)(`span`,{className:`flex items-center gap-1 text-xs`,children:[(0,f.jsx)(n,{className:`size-3.5`,"aria-hidden":`true`}),` Selected`]})]})}),(0,f.jsx)(l,{state:`Booked`,children:(0,f.jsxs)(`div`,{className:`${h} bg-quaternary ring-1 ring-secondary ring-inset`,children:[(0,f.jsx)(`span`,{className:`text-sm font-medium text-tertiary tabular-nums line-through`,children:`6:30 PM`}),(0,f.jsxs)(`span`,{className:`flex items-center gap-1 text-xs font-medium text-tertiary`,children:[(0,f.jsx)(r,{className:`size-3`,"aria-hidden":`true`}),` Booked`]})]})})]})}})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Style guide",
  render: () => <ClubStyleGuide config={{
    club: FLOGOLF_CLUB,
    accentName: "FloGolf green",
    accentValue: GREEN,
    calendarPrices: false,
    selectorCells: [{
      label: "Date",
      value: fmtNice(DEFAULT_DATE)
    }, {
      label: "Time",
      value: "6:30 PM"
    }, {
      label: "Players",
      value: "4 Players"
    }],
    menuTitle: "Start time",
    menuDefault: "1110",
    menuSections: [{
      rows: [{
        value: "1110",
        label: "6:30 PM",
        right: "$20.00"
      }, {
        value: "1140",
        label: "7:00 PM",
        right: "$27.50"
      }, {
        value: "1170",
        label: "7:30 PM",
        right: "$27.50"
      }, {
        value: "1200",
        label: "8:00 PM",
        right: "$27.50"
      }]
    }],
    cards: <div className="flex flex-wrap gap-3">
                        <Eg state="Open">
                            <div className={\`\${SLOT} bg-primary ring-1 ring-secondary ring-inset\`}>
                                <span className="text-sm font-semibold text-primary tabular-nums">6:30 PM</span>
                                <span className="text-xs font-semibold text-secondary tabular-nums">$20.00</span>
                            </div>
                        </Eg>
                        <Eg state="Selected">
                            <div className={\`\${SLOT} text-white\`} style={{
          backgroundColor: GREEN
        }}>
                                <span className="text-sm font-semibold tabular-nums">6:30 PM</span>
                                <span className="flex items-center gap-1 text-xs">
                                    <Check className="size-3.5" aria-hidden="true" /> Selected
                                </span>
                            </div>
                        </Eg>
                        <Eg state="Booked">
                            <div className={\`\${SLOT} bg-quaternary ring-1 ring-secondary ring-inset\`}>
                                <span className="text-sm font-medium text-tertiary tabular-nums line-through">6:30 PM</span>
                                <span className="flex items-center gap-1 text-xs font-medium text-tertiary">
                                    <Lock01 className="size-3" aria-hidden="true" /> Booked
                                </span>
                            </div>
                        </Eg>
                    </div>
  }} />
}`,...g.parameters?.docs?.source}}},_=[`Components`]}))();export{g as Components,_ as __namedExportsOrder,p as default};