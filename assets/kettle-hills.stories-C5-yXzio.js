import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-BbsIfxGP.js";import{i as n,o as r}from"./sagamore-data-CJPedKNE.js";import{b as i,f as a,g as o,i as s,v as c}from"./tenfore-chrome-DMSNa9Ju.js";import{n as l,r as u,t as d}from"./club-style-guide-CgR3Rk9F.js";var f,p,m,h,g,_;e((()=>{f=t(),r(),o(),u(),p={title:`Design Systems/Kettle Hills`,parameters:{layout:`fullscreen`,docs:{description:{component:`"Design Systems / Kettle Hills" — the booking components in the Kettle Hills blue colorway.`}}}},m=n(`weekday`).filter(e=>e.spotsAvailable>0),h=s.navColor,g={name:`Style guide`,render:()=>(0,f.jsx)(d,{config:{club:s,accentName:`Kettle Hills blue`,accentValue:h,selectorCells:[{label:`Course`,value:`All Courses`},{label:`Date`,value:i(c)},{label:`Players`,value:`2 Players`}],menuTitle:`Course`,menuDefault:`All Courses`,menuSections:[{rows:[{value:`All Courses`,label:`All Courses`}]},{rows:[{value:`18 Holes`,label:`18 Holes`}]},{header:`9 Holes`,rows:[{value:`9 Holes (Ponds)`,label:`9 Holes (Ponds)`},{value:`9 Holes (Front Valley)`,label:`9 Holes (Front Valley)`},{value:`9 Holes (Rolling)`,label:`9 Holes (Rolling)`}]}],cards:(0,f.jsxs)(`div`,{className:`grid grid-cols-2 gap-3 sm:grid-cols-3`,children:[(0,f.jsx)(l,{state:`18 holes`,children:(0,f.jsx)(a,{slot:m[2],holesOverride:18,holesWord:!0})}),(0,f.jsx)(l,{state:`Nine · Ponds`,children:(0,f.jsx)(a,{slot:m[4],nineLabel:`Ponds`,nineColor:h,holesOverride:9,holesWord:!0})}),(0,f.jsx)(l,{state:`Nine · Rolling`,children:(0,f.jsx)(a,{slot:m[6],nineLabel:`Rolling`,nineColor:h,holesOverride:9,holesWord:!0})})]})}})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Style guide",
  render: () => <ClubStyleGuide config={{
    club: KETTLE_HILLS_CLUB,
    accentName: "Kettle Hills blue",
    accentValue: NAV,
    selectorCells: [{
      label: "Course",
      value: "All Courses"
    }, {
      label: "Date",
      value: fmtNice(DEFAULT_DATE)
    }, {
      label: "Players",
      value: "2 Players"
    }],
    menuTitle: "Course",
    menuDefault: "All Courses",
    menuSections: [{
      rows: [{
        value: "All Courses",
        label: "All Courses"
      }]
    }, {
      rows: [{
        value: "18 Holes",
        label: "18 Holes"
      }]
    }, {
      header: "9 Holes",
      rows: [{
        value: "9 Holes (Ponds)",
        label: "9 Holes (Ponds)"
      }, {
        value: "9 Holes (Front Valley)",
        label: "9 Holes (Front Valley)"
      }, {
        value: "9 Holes (Rolling)",
        label: "9 Holes (Rolling)"
      }]
    }],
    cards: <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <Eg state="18 holes">
                            <TeeCell slot={SLOTS[2]} holesOverride={18} holesWord />
                        </Eg>
                        <Eg state="Nine · Ponds">
                            <TeeCell slot={SLOTS[4]} nineLabel="Ponds" nineColor={NAV} holesOverride={9} holesWord />
                        </Eg>
                        <Eg state="Nine · Rolling">
                            <TeeCell slot={SLOTS[6]} nineLabel="Rolling" nineColor={NAV} holesOverride={9} holesWord />
                        </Eg>
                    </div>
  }} />
}`,...g.parameters?.docs?.source}}},_=[`Components`]}))();export{g as Components,_ as __namedExportsOrder,p as default};