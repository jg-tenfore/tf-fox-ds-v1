import{i as e,l as t}from"./preload-helper-tpQASj4C.js";import{F as n,d as ee}from"./iframe-D3Wtnow_.js";import{A as r,B as te,C as ne,D as re,E as ie,F as ae,Ft as oe,G as se,H as ce,I as le,K as ue,L as i,M as a,Mt as o,N as s,O as c,P as l,Q as de,R as u,S as d,T as f,Tt as fe,U as pe,V as me,W as he,Y as ge,Z as p,_ as _e,_t as m,b as ve,d as ye,f as h,g,h as _,j as v,jt as y,k as b,kt as x,l as S,lt as C,m as w,n as T,nt as E,p as D,r as O,rt as k,u as A,v as j,w as M,x as N,y as be,z as xe}from"./p3-story-kit-Be7IJaBG.js";var Se=e((()=>{_e(),_(),be(),N(),ne(),D(),h(),ye(),A(),S()})),P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{P=ee(),F=t(n()),xe(),se(),b(),ue(),re(),pe(),le(),me(),Se(),T(),I={title:`Prototypes/Instruction/Elements`,id:`instruction-elements`,parameters:{layout:`fullscreen`,docs:{description:{component:`"Instruction / Elements" — the pieces the Instruction screens are assembled from.

These stories now show **Prototype 3's updated elements (ported from the Crane MCG prototype)**:
the shared kit (\`src/components/mcg-3/instruction/kit.tsx\` — avatars, ratings, course chips, the
time board, the step rail), the hub's result and instructor cards (\`hub/hub-ui.tsx\`) and the
packages pieces (\`packages/index.ts\`). All of it is Fox Untitled UI components and semantic
tokens, skinned MCG green by the P3 shell. The story ids are unchanged; the original Flow A/B
elements still power Prototype 1's app.`}}}},L=()=>{},R={path:`/instruction`,push:L,replace:L},z=({children:e})=>(0,P.jsx)(he,{children:(0,P.jsx)(ce,{children:(0,P.jsx)(te,{value:R,children:(0,P.jsx)(u,{children:(0,P.jsx)(i,{children:(0,P.jsx)(`div`,{className:`flex flex-col gap-12`,children:e})})})})})}),B=({title:e,note:t,children:n})=>(0,P.jsxs)(`section`,{className:`flex flex-col gap-4`,children:[(0,P.jsxs)(`div`,{className:`flex flex-col gap-1 border-b border-secondary pb-3`,children:[(0,P.jsx)(`h2`,{className:`text-lg font-semibold text-primary`,children:e}),(0,P.jsx)(`p`,{className:`max-w-3xl text-sm text-tertiary`,children:t})]}),n]}),V=`2026-10-09`,H=y(`private-45`),U=x(`mike-kenny`),W=x(`doug-hamilton`),G=fe(H,`mike-kenny`,`falls-road`,oe(V)),K=()=>{let[e,t]=(0,F.useState)(540);return(0,P.jsx)(a,{slots:G,priceFor:()=>o(H,U,1),selected:e,onSelect:e=>t(e.minutes)})},q=()=>{let[e,t]=(0,F.useState)(1);return(0,P.jsx)(ae,{steps:c,current:e,onStep:e=>t(c.findIndex(t=>t.id===e))})},J=[`private-45`,`clinic-adult-l2`,`ggr-northwest`,`junior-league-northwest`].map(e=>k(e)).filter(e=>!!e),Y=E(J).filter(e=>e.instructor.id===`mike-kenny`||e.instructor.id===`doug-hamilton`),X={name:`All Elements`,render:()=>(0,P.jsxs)(z,{children:[(0,P.jsxs)(B,{title:`People, ratings, courses`,note:`Headshots (or initials on a tinted disc for “any instructor” and county staff), a half-star rating, and home courses as logo chips.`,children:[(0,P.jsxs)(`div`,{className:`flex flex-wrap items-center gap-4`,children:[[`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,P.jsx)(r,{photo:U.photo,initials:U.initials,name:U.name,size:e},e)),(0,P.jsx)(r,{initials:`AI`,size:`lg`}),(0,P.jsx)(l,{rating:4.5}),(0,P.jsx)(l,{rating:3.8,size:`sm`})]}),(0,P.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:W.courseSlugs.map(e=>(0,P.jsx)(v,{slug:e},e))})]}),(0,P.jsx)(B,{title:`Result cards`,note:`A private lesson has no photo (every private would share one); a group program — Academy or county — leads with its art. Both carry badges, skill sets, who teaches and the price.`,children:(0,P.jsx)(`div`,{className:`grid items-start gap-4 md:grid-cols-2 lg:grid-cols-4`,children:J.map(e=>e.format===`private`?(0,P.jsx)(f,{offering:e,href:m(e.id,`falls-road`)},e.key):(0,P.jsx)(ie,{offering:e,href:m(e.id)},e.key))})}),(0,P.jsx)(B,{title:`Instructor cards`,note:`The Instructors tab: headshot, credential, title, home courses, what they teach that matches, lessons from $, next opening and the sample rating.`,children:(0,P.jsx)(`div`,{className:`grid items-start gap-4 md:grid-cols-2`,children:Y.map(e=>(0,P.jsx)(M,{entry:e},e.instructor.id??e.instructor.name))})}),(0,P.jsxs)(B,{title:`Time board`,note:`Morning / Afternoon / Evening, each with its open count. Open times are white tiles with the price; booked and unavailable times stay visible, struck through.`,children:[(0,P.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:G.slice(0,4).map(e=>(0,P.jsx)(`div`,{className:`w-28`,children:(0,P.jsx)(s,{slot:e,price:e.status===`open`?o(H,U,1):void 0})},e.minutes))}),(0,P.jsx)(`div`,{className:`rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset`,children:(0,P.jsx)(K,{})})]}),(0,P.jsx)(B,{title:`Step rail`,note:`The booking's steps across the top: done steps link back, the current one is green, later ones muted. Under 768 it collapses to “Step 2 of 5” and a bar.`,children:(0,P.jsx)(`div`,{className:`rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset`,children:(0,P.jsx)(q,{})})}),(0,P.jsxs)(B,{title:`Packs, plans and credits`,note:`A pack per instructor (full and compact), a monthly plan (concept), a wallet balance with credit dots and its expiry date, and “How lesson credits work”.`,children:[(0,P.jsxs)(`div`,{className:`grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3`,children:[(0,P.jsx)(g,{pack:p(`mike-kenny--pack-5`)}),(0,P.jsx)(g,{pack:p(`doug-hamilton--pack-10`),variant:`compact`}),(0,P.jsx)(w,{plan:de(`mike-kenny--sub-2`)})]}),(0,P.jsx)(`div`,{className:`grid items-start gap-4 md:grid-cols-2`,children:ge.map(e=>(0,P.jsx)(ve,{balance:e},e.id))}),(0,P.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,P.jsx)(d,{total:5,remaining:4}),(0,P.jsx)(d,{total:10,remaining:3,size:`sm`})]}),(0,P.jsx)(j,{})]})]})},Z=O(C(),`Prototype 3's Instruction landing — its compact header (eyebrow, title, Services | Instructors) above the search bar and format tiles.`,{},`Academy Hero`),Q=O(m(`private-45`,`falls-road`),`The 45-minute private at Falls Road: the price by group size, then each instructor with their own price — one Academy menu, adjusted per instructor.`,{},`Pricing Model`),X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  name: "All Elements",
  render: () => <Sheet>
            <Spec title="People, ratings, courses" note="Headshots (or initials on a tinted disc for “any instructor” and county staff), a half-star rating, and home courses as logo chips.">
                <div className="flex flex-wrap items-center gap-4">
                    {(["xs", "sm", "md", "lg", "xl"] as const).map(size => <CoachAvatar key={size} photo={mikeKenny.photo} initials={mikeKenny.initials} name={mikeKenny.name} size={size} />)}
                    <CoachAvatar initials="AI" size="lg" />
                    <StarRating rating={4.5} />
                    <StarRating rating={3.8} size="sm" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {dougHamilton.courseSlugs.map(slug => <CourseChip key={slug} slug={slug} />)}
                </div>
            </Spec>

            <Spec title="Result cards" note="A private lesson has no photo (every private would share one); a group program — Academy or county — leads with its art. Both carry badges, skill sets, who teaches and the price.">
                <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {offerings.map(o => o.format === "private" ? <PrivateLessonCard key={o.key} offering={o} href={serviceHref(o.id, "falls-road")} /> : <ProgramCard key={o.key} offering={o} href={serviceHref(o.id)} />)}
                </div>
            </Spec>

            <Spec title="Instructor cards" note="The Instructors tab: headshot, credential, title, home courses, what they teach that matches, lessons from $, next opening and the sample rating.">
                <div className="grid items-start gap-4 md:grid-cols-2">
                    {instructorEntries.map(e => <InstructorCard key={e.instructor.id ?? e.instructor.name} entry={e} />)}
                </div>
            </Spec>

            <Spec title="Time board" note="Morning / Afternoon / Evening, each with its open count. Open times are white tiles with the price; booked and unavailable times stay visible, struck through.">
                <div className="flex flex-wrap gap-2">
                    {board.slice(0, 4).map(s => <div key={s.minutes} className="w-28">
                            <SlotButton slot={s} price={s.status === "open" ? servicePrice(private45, mikeKenny, 1) : undefined} />
                        </div>)}
                </div>
                <div className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                    <BoardDemo />
                </div>
            </Spec>

            <Spec title="Step rail" note="The booking's steps across the top: done steps link back, the current one is green, later ones muted. Under 768 it collapses to “Step 2 of 5” and a bar.">
                <div className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                    <RailDemo />
                </div>
            </Spec>

            <Spec title="Packs, plans and credits" note="A pack per instructor (full and compact), a monthly plan (concept), a wallet balance with credit dots and its expiry date, and “How lesson credits work”.">
                <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <PackCard pack={packageById("mike-kenny--pack-5")!} />
                    <PackCard pack={packageById("doug-hamilton--pack-10")!} variant="compact" />
                    <MonthlyPlanCard plan={subscriptionById("mike-kenny--sub-2")!} />
                </div>
                <div className="grid items-start gap-4 md:grid-cols-2">
                    {CREDIT_BALANCES.map(b => <CreditBalanceCard key={b.id} balance={b} />)}
                </div>
                <div className="flex items-center gap-4">
                    <CreditDots total={5} remaining={4} />
                    <CreditDots total={10} remaining={3} size="sm" />
                </div>
                <CreditsExplainer />
            </Spec>
        </Sheet>
}`,...X.parameters?.docs?.source},description:{story:`The full element set on one page — how the Instruction screens are actually assembled.`,...X.parameters?.docs?.description}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`p3Story(instructionHref(), "Prototype 3's Instruction landing — its compact header (eyebrow, title, Services | Instructors) above the search bar and format tiles.", {}, "Academy Hero")`,...Z.parameters?.docs?.source},description:{story:`The hub's compact header, in place: the Instruction landing at its default URL.`,...Z.parameters?.docs?.description}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`p3Story(serviceHref("private-45", "falls-road"), "The 45-minute private at Falls Road: the price by group size, then each instructor with their own price — one Academy menu, adjusted per instructor.", {}, "Pricing Model")`,...Q.parameters?.docs?.source},description:{story:`Instructor pricing: the private lesson's group-size price table and each instructor's own rate.`,...Q.parameters?.docs?.description}}},$=[`AllElements`,`Hero`,`PricingModel`]}))();export{X as AllElements,Z as Hero,Q as PricingModel,$ as __namedExportsOrder,I as default};