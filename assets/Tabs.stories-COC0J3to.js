import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-JEutOpZn.js";import{n,r}from"./tabs-OwqEdpE1.js";import{a as i,i as a,o,r as s,s as c,t as l}from"./sagamore-DSNO8sBh.js";var u,d,f,p,m,h,g;e((()=>{u=t(),r(),c(),d={title:`Application Components/Tabs`,component:n,parameters:{layout:`centered`,docs:{description:{component:`Tabs let golfers switch between tee sheets without leaving the page — flipping
between today and the weekend, or between the Championship and Executive
courses. The monochromatic theme renders every variant in greyscale.`}}}},f={render:()=>(0,u.jsxs)(n,{className:`w-100`,children:[(0,u.jsxs)(n.List,{type:`button-border`,size:`md`,children:[(0,u.jsx)(n.Item,{id:`today`,children:`Today`}),(0,u.jsx)(n.Item,{id:`tomorrow`,children:`Tomorrow`}),(0,u.jsx)(n.Item,{id:`weekend`,children:`This weekend`})]}),(0,u.jsx)(n.Panel,{id:`today`,className:`pt-4 text-sm text-secondary`,children:`6 tee times open on the Championship today.`}),(0,u.jsx)(n.Panel,{id:`tomorrow`,className:`pt-4 text-sm text-secondary`,children:`Tomorrow’s sheet opens at 6:00 AM — book early for morning frost delays.`}),(0,u.jsx)(n.Panel,{id:`weekend`,className:`pt-4 text-sm text-secondary`,children:`Weekend rates apply Saturday and Sunday until noon.`})]})},p={render:()=>(0,u.jsxs)(n,{className:`w-120`,children:[(0,u.jsxs)(n.List,{type:`underline`,size:`md`,children:[(0,u.jsx)(n.Item,{id:`championship`,badge:4,children:`The Championship`}),(0,u.jsx)(n.Item,{id:`executive`,badge:2,children:`The Executive`})]}),l.map(e=>(0,u.jsxs)(n.Panel,{id:e.id,className:`pt-4 text-sm text-secondary`,children:[(0,u.jsxs)(`p`,{className:`font-semibold text-primary`,children:[e.name,` — `,e.holes,` holes, par `,e.par]}),(0,u.jsx)(`p`,{className:`mt-1`,children:e.description})]},e.id))]})},m={render:()=>(0,u.jsxs)(n,{className:`w-120`,children:[(0,u.jsxs)(n.List,{type:`button-minimal`,size:`sm`,children:[(0,u.jsx)(n.Item,{id:`standard`,children:s.standard}),(0,u.jsx)(n.Item,{id:`twilight`,children:s.twilight}),(0,u.jsx)(n.Item,{id:`member`,children:s.member}),(0,u.jsx)(n.Item,{id:`replay`,children:s.replay})]}),(0,u.jsx)(n.Panel,{id:`standard`,className:`pt-4 text-sm text-secondary`,children:i.filter(e=>e.rate===`standard`).map(e=>(0,u.jsxs)(`div`,{children:[e.label,` · `,o(e.price),` · `,a[e.status]]},e.id))}),(0,u.jsx)(n.Panel,{id:`twilight`,className:`pt-4 text-sm text-secondary`,children:`Twilight pricing begins at 4:00 PM — carts included.`}),(0,u.jsx)(n.Panel,{id:`member`,className:`pt-4 text-sm text-secondary`,children:`Member tee times are complimentary and open seven days ahead.`}),(0,u.jsx)(n.Panel,{id:`replay`,className:`pt-4 text-sm text-secondary`,children:`Replay the Executive after your round for a reduced rate.`})]})},h={render:()=>(0,u.jsxs)(n,{className:`w-100`,disabledKeys:[`maintenance`],children:[(0,u.jsxs)(n.List,{type:`button-gray`,size:`md`,children:[(0,u.jsx)(n.Item,{id:`front`,children:`Front nine`}),(0,u.jsx)(n.Item,{id:`back`,children:`Back nine`}),(0,u.jsx)(n.Item,{id:`maintenance`,children:`Aeration (closed)`})]}),(0,u.jsx)(n.Panel,{id:`front`,className:`pt-4 text-sm text-secondary`,children:`Holes 1–9 are open and walking the full loop.`}),(0,u.jsx)(n.Panel,{id:`back`,className:`pt-4 text-sm text-secondary`,children:`Holes 10–18 are cart-path only after recent rain.`}),(0,u.jsx)(n.Panel,{id:`maintenance`,className:`pt-4 text-sm text-secondary`,children:`Greens are being aerated this week — back online Friday.`})]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs className="w-100">
            <Tabs.List type="button-border" size="md">
                <Tabs.Item id="today">Today</Tabs.Item>
                <Tabs.Item id="tomorrow">Tomorrow</Tabs.Item>
                <Tabs.Item id="weekend">This weekend</Tabs.Item>
            </Tabs.List>
            <Tabs.Panel id="today" className="pt-4 text-sm text-secondary">
                6 tee times open on the Championship today.
            </Tabs.Panel>
            <Tabs.Panel id="tomorrow" className="pt-4 text-sm text-secondary">
                Tomorrow’s sheet opens at 6:00 AM — book early for morning frost delays.
            </Tabs.Panel>
            <Tabs.Panel id="weekend" className="pt-4 text-sm text-secondary">
                Weekend rates apply Saturday and Sunday until noon.
            </Tabs.Panel>
        </Tabs>
}`,...f.parameters?.docs?.source},description:{story:`Default tee-sheet switcher: today, tomorrow, and the weekend.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs className="w-120">
            <Tabs.List type="underline" size="md">
                <Tabs.Item id="championship" badge={4}>
                    The Championship
                </Tabs.Item>
                <Tabs.Item id="executive" badge={2}>
                    The Executive
                </Tabs.Item>
            </Tabs.List>
            {COURSES.map(course => <Tabs.Panel key={course.id} id={course.id} className="pt-4 text-sm text-secondary">
                    <p className="font-semibold text-primary">
                        {course.name} — {course.holes} holes, par {course.par}
                    </p>
                    <p className="mt-1">{course.description}</p>
                </Tabs.Panel>)}
        </Tabs>
}`,...p.parameters?.docs?.source},description:{story:`Underline tabs switching between the two Sagamore courses, with slot counts.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs className="w-120">
            <Tabs.List type="button-minimal" size="sm">
                <Tabs.Item id="standard">{RATE_LABELS.standard}</Tabs.Item>
                <Tabs.Item id="twilight">{RATE_LABELS.twilight}</Tabs.Item>
                <Tabs.Item id="member">{RATE_LABELS.member}</Tabs.Item>
                <Tabs.Item id="replay">{RATE_LABELS.replay}</Tabs.Item>
            </Tabs.List>
            <Tabs.Panel id="standard" className="pt-4 text-sm text-secondary">
                {TEE_TIMES.filter(t => t.rate === "standard").map(t => <div key={t.id}>
                        {t.label} · {formatPrice(t.price)} · {STATUS_LABELS[t.status]}
                    </div>)}
            </Tabs.Panel>
            <Tabs.Panel id="twilight" className="pt-4 text-sm text-secondary">
                Twilight pricing begins at 4:00 PM — carts included.
            </Tabs.Panel>
            <Tabs.Panel id="member" className="pt-4 text-sm text-secondary">
                Member tee times are complimentary and open seven days ahead.
            </Tabs.Panel>
            <Tabs.Panel id="replay" className="pt-4 text-sm text-secondary">
                Replay the Executive after your round for a reduced rate.
            </Tabs.Panel>
        </Tabs>
}`,...m.parameters?.docs?.source},description:{story:`Pill-style tabs filtering the tee sheet by rate type.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs className="w-100" disabledKeys={["maintenance"]}>
            <Tabs.List type="button-gray" size="md">
                <Tabs.Item id="front">Front nine</Tabs.Item>
                <Tabs.Item id="back">Back nine</Tabs.Item>
                <Tabs.Item id="maintenance">Aeration (closed)</Tabs.Item>
            </Tabs.List>
            <Tabs.Panel id="front" className="pt-4 text-sm text-secondary">
                Holes 1–9 are open and walking the full loop.
            </Tabs.Panel>
            <Tabs.Panel id="back" className="pt-4 text-sm text-secondary">
                Holes 10–18 are cart-path only after recent rain.
            </Tabs.Panel>
            <Tabs.Panel id="maintenance" className="pt-4 text-sm text-secondary">
                Greens are being aerated this week — back online Friday.
            </Tabs.Panel>
        </Tabs>
}`,...h.parameters?.docs?.source},description:{story:`Edge case: a disabled tab. The maintenance window on the back nine can't be
booked, so its tab is disabled while the others stay live.`,...h.parameters?.docs?.description}}},g=[`Playground`,`CourseSwitcher`,`RateFilter`,`WithDisabledTab`]}))();export{p as CourseSwitcher,f as Playground,m as RateFilter,h as WithDisabledTab,g as __namedExportsOrder,d as default};