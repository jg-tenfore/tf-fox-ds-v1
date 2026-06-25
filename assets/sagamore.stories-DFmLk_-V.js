import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{i as n,o as r}from"./sagamore-data-CJPedKNE.js";import{_ as i,c as a,d as o,h as s,v as c}from"./tenfore-chrome-_c7O2cjx.js";import{n as l,r as u,t as d}from"./club-style-guide-BwRPCsXq.js";var f,p,m,h,g,_;e((()=>{f=t(),r(),s(),u(),p={title:`Design Systems/Sagamore`,parameters:{layout:`fullscreen`,docs:{description:{component:`"Design Systems / Sagamore" — the booking components in the Sagamore black colorway.`}}}},m=n(`weekday`).filter(e=>e.spotsAvailable>0),h=a.navColor,g={name:`Style guide`,render:()=>(0,f.jsx)(d,{config:{club:a,accentName:`Sagamore black`,accentValue:`Primary solid · near-black`,selectorCells:[{label:`Course`,value:`All Courses`},{label:`Date`,value:c(i)},{label:`Players`,value:`2 Players`}],menuTitle:`Course`,menuDefault:`All Courses`,menuSections:[{rows:[{value:`All Courses`,label:`All Courses`}]},{rows:[{value:`18 Holes`,label:`18 Holes`}]},{header:`9 Holes`,rows:[{value:`9 Holes (Back)`,label:`9 Holes (Back)`},{value:`9 Holes (Front)`,label:`9 Holes (Front)`}]}],cards:(0,f.jsxs)(`div`,{className:`grid grid-cols-2 gap-3 sm:grid-cols-3`,children:[(0,f.jsx)(l,{state:`18 holes`,children:(0,f.jsx)(o,{slot:m[2],holesOverride:18,holesWord:!0})}),(0,f.jsx)(l,{state:`Nine · Back 9`,children:(0,f.jsx)(o,{slot:m[4],nineLabel:`Back 9`,nineColor:h,holesOverride:9,holesWord:!0})}),(0,f.jsx)(l,{state:`Nine · Front 9`,children:(0,f.jsx)(o,{slot:m[6],nineLabel:`Front 9`,nineColor:h,holesOverride:9,holesWord:!0})})]})}})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Style guide",
  render: () => <ClubStyleGuide config={{
    club: SAGAMORE_CLUB,
    accentName: "Sagamore black",
    accentValue: "Primary solid · near-black",
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
        value: "9 Holes (Back)",
        label: "9 Holes (Back)"
      }, {
        value: "9 Holes (Front)",
        label: "9 Holes (Front)"
      }]
    }],
    cards: <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <Eg state="18 holes">
                            <TeeCell slot={SLOTS[2]} holesOverride={18} holesWord />
                        </Eg>
                        <Eg state="Nine · Back 9">
                            <TeeCell slot={SLOTS[4]} nineLabel="Back 9" nineColor={NAV} holesOverride={9} holesWord />
                        </Eg>
                        <Eg state="Nine · Front 9">
                            <TeeCell slot={SLOTS[6]} nineLabel="Front 9" nineColor={NAV} holesOverride={9} holesWord />
                        </Eg>
                    </div>
  }} />
}`,...g.parameters?.docs?.source}}},_=[`Components`]}))();export{g as Components,_ as __namedExportsOrder,p as default};