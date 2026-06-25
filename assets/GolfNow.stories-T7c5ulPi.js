import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-DVR_kFd5.js";import{$ as n,Ct as r,Jn as i,R as a,Un as o,Vt as s,_ as c,dt as ee,f as l,ir as u,j as d,m as f,n as te,nn as p}from"./dist-DtvLQRd8.js";import{n as ne,t as m}from"./button-EClWuHCL.js";import{i as re,t as h}from"./input-BVdHvg1n.js";import{i as ie,t as g}from"./badges-DxlZn62T.js";import{r as ae,t as _}from"./checkbox-DWRxF4Qu.js";import{n as v,t as y}from"./avatar-CQrzFL6B.js";import{r as b,t as x}from"./sagamore-assets-6JmsGryk.js";import{n as S,t as C}from"./sagamore-logo-79WY9IO4.js";import{n as w,t as T}from"./player-stepper-DIuQiH7I.js";import{i as E,n as D,o as oe,r as O}from"./sagamore-data-CJPedKNE.js";var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{k=t(),te(),v(),ie(),ne(),ae(),re(),w(),oe(),x(),S(),A={title:`Explorations/GolfNow`,tags:[`!dev`],parameters:{layout:`fullscreen`,docs:{description:{component:`GolfNow-faithful exploration of the Sagamore Spring tee-time experience.
Reproduces the marketplace's search-results + checkout GUI — header, filter
rail, dark tee-time cards with Hot Deal badges, and the players/checkout
screen — using real Sagamore data and golf edge cases (spots left, 9 vs 18,
walking vs riding, twilight pricing, last-minute discounts, ratings).`}}}},j=b(`photography`)[0]?.src??``,M=4.3,N=187,P=12.4,F=e=>e.map((e,t)=>{let n=e.timeOfDay===`twilight`,r=t%6==2||n&&t%3==0,i=n&&t%2==0?9:18,a=n||t%4!=1,o=r?e.price+(n?8:14):void 0;return{...e,holes:i,ride:a?`cart`:`walking`,cartIncluded:a,isHotDeal:r,wasPrice:o}}),I=F(E(`weekday`).filter(e=>e.timeOfDay===`morning`&&e.spotsAvailable>0)).slice(0,6),L=F(E(`weekday`).filter(e=>e.timeOfDay===`midday`&&e.spotsAvailable>0)).slice(0,12),R=F(E(`weekday`).filter(e=>e.timeOfDay===`twilight`&&e.spotsAvailable>0)).slice(0,6),z=[...I,...L,...R].filter(e=>e.isHotDeal).length,B=()=>(0,k.jsxs)(`header`,{className:`bg-primary`,children:[(0,k.jsx)(`div`,{className:`border-b border-secondary bg-secondary`,children:(0,k.jsxs)(`div`,{className:`mx-auto flex h-7 max-w-[1200px] items-center gap-5 px-4 text-xs font-medium tracking-wide text-tertiary uppercase`,children:[(0,k.jsx)(`span`,{children:`Sagamore TV`}),(0,k.jsx)(`span`,{children:`Pro Shop`}),(0,k.jsx)(`span`,{children:`On Course`})]})}),(0,k.jsxs)(`div`,{className:`mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-4`,children:[(0,k.jsx)(C,{className:`h-9 w-auto`}),(0,k.jsxs)(`nav`,{className:`hidden items-center gap-5 text-sm font-semibold text-secondary md:flex`,children:[(0,k.jsx)(`a`,{className:`font-bold text-brand-secondary`,children:`Hot Deals`}),(0,k.jsx)(`a`,{children:`Courses Near Me`}),(0,k.jsx)(`a`,{children:`Destinations`}),(0,k.jsx)(`a`,{children:`Best Courses`}),(0,k.jsx)(`a`,{children:`Rewards & Credits`}),(0,k.jsx)(`a`,{children:`Gift Cards`})]}),(0,k.jsxs)(`div`,{className:`ml-auto flex items-center gap-3`,children:[(0,k.jsx)(y,{size:`sm`,initials:`JG`}),(0,k.jsxs)(`div`,{className:`hidden text-right leading-tight sm:block`,children:[(0,k.jsx)(`p`,{className:`text-xs text-tertiary`,children:`Hi, Justin`}),(0,k.jsx)(`p`,{className:`text-xs font-bold text-brand-secondary`,children:`Rewards: 1,240`})]})]})]})]}),V=()=>(0,k.jsx)(`div`,{className:`border-b border-secondary bg-secondary`,children:(0,k.jsxs)(`div`,{className:`mx-auto flex max-w-[1200px] flex-wrap items-center gap-3 px-4 py-3`,children:[(0,k.jsxs)(`div`,{className:`flex flex-1 items-center gap-2 rounded-full bg-primary px-2 py-1 shadow-xs ring-1 ring-secondary`,children:[(0,k.jsxs)(`div`,{className:`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-secondary`,children:[(0,k.jsx)(u,{className:`size-4 text-fg-quaternary`,"aria-hidden":`true`}),`Thu, Jun 18`]}),(0,k.jsx)(`span`,{className:`h-5 w-px bg-border-secondary`}),(0,k.jsxs)(`div`,{className:`flex flex-1 items-center gap-1.5 px-3 py-1.5 text-sm text-secondary`,children:[(0,k.jsx)(r,{className:`size-4 text-fg-quaternary`,"aria-hidden":`true`}),D.name,` — Lynnfield, MA`]}),(0,k.jsxs)(`button`,{type:`button`,className:`flex items-center gap-1.5 rounded-full bg-brand-solid px-5 py-2 text-sm font-semibold text-white hover:bg-brand-solid_hover`,children:[(0,k.jsx)(n,{className:`size-4`,"aria-hidden":`true`}),`Search`]})]}),(0,k.jsxs)(`button`,{type:`button`,className:`flex items-center gap-1.5 rounded-full bg-brand-solid px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-solid_hover`,children:[(0,k.jsx)(d,{className:`size-4`,"aria-hidden":`true`}),`Hot Deals Near Me`]})]})}),H=({value:e,className:t})=>(0,k.jsx)(`span`,{className:`flex items-center gap-0.5 ${t??``}`,"aria-label":`${e} out of 5 stars`,children:Array.from({length:5}).map((t,n)=>(0,k.jsx)(a,{className:`size-3.5 ${n+1<=Math.round(e)?`fill-current text-warning-primary`:`text-quaternary`}`,"aria-hidden":`true`},n))}),U=()=>(0,k.jsx)(`aside`,{className:`w-full shrink-0 lg:w-[300px]`,children:(0,k.jsxs)(`div`,{className:`overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary`,children:[(0,k.jsxs)(`div`,{className:`relative`,children:[(0,k.jsx)(`img`,{src:j,alt:D.name,className:`h-44 w-full object-cover`}),(0,k.jsx)(`span`,{className:`absolute top-3 left-3 rounded bg-primary-solid px-2 py-1 text-xs font-semibold text-white`,children:`Sagamore Spring`}),(0,k.jsx)(`button`,{type:`button`,className:`absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-primary p-1 shadow ring-1 ring-secondary`,children:(0,k.jsx)(i,{className:`size-4 text-fg-secondary`,"aria-hidden":`true`})}),(0,k.jsx)(`button`,{type:`button`,className:`absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-primary p-1 shadow ring-1 ring-secondary`,children:(0,k.jsx)(o,{className:`size-4 text-fg-secondary`,"aria-hidden":`true`})})]}),(0,k.jsxs)(`div`,{className:`space-y-3 p-4`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`h2`,{className:`text-lg leading-snug font-bold text-primary`,children:D.name}),(0,k.jsx)(`p`,{className:`text-sm text-tertiary`,children:D.address})]}),(0,k.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,k.jsx)(H,{value:M}),(0,k.jsx)(`span`,{className:`text-xs font-semibold text-secondary tabular-nums`,children:M.toFixed(1)}),(0,k.jsxs)(`a`,{className:`text-xs font-semibold text-brand-secondary underline`,children:[N,` Reviews`]})]}),(0,k.jsxs)(`div`,{className:`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary`,children:[(0,k.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,k.jsx)(p,{className:`size-3.5 text-fg-quaternary`,"aria-hidden":`true`}),` Holes `,D.holes,` · Par `,D.par]}),(0,k.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,k.jsx)(r,{className:`size-3.5 text-fg-quaternary`,"aria-hidden":`true`}),` `,P,` mi away`]}),(0,k.jsxs)(`span`,{children:[`Length `,D.yards.toLocaleString(),` yds`]})]}),(0,k.jsxs)(`p`,{className:`text-sm leading-relaxed text-tertiary`,children:[`Sagamore Spring Golf Club is a classic New England public course established in `,D.established,`. Tree-lined fairways and true-rolling greens make it a local favorite for walkers and riders alike.`]}),(0,k.jsxs)(`div`,{className:`flex items-center gap-3 border-t border-secondary pt-3 text-xs font-semibold text-brand-secondary`,children:[(0,k.jsx)(`a`,{className:`underline`,children:`Read More…`}),(0,k.jsx)(`a`,{className:`underline`,children:`Directions`}),(0,k.jsx)(`a`,{className:`underline`,children:`Details`})]}),(0,k.jsxs)(`div`,{className:`flex items-start gap-2 rounded-lg bg-secondary p-3 text-xs text-tertiary`,children:[(0,k.jsx)(c,{className:`mt-0.5 size-4 shrink-0 text-fg-quaternary`,"aria-hidden":`true`}),(0,k.jsxs)(`p`,{children:[(0,k.jsx)(`span`,{className:`font-semibold text-secondary`,children:`Free cancellation`}),` up to 24 hrs before tee time. Rain check guaranteed for weather closures.`]})]}),(0,k.jsxs)(`div`,{className:`flex items-center gap-2 border-t border-secondary pt-3 text-xs text-tertiary`,children:[(0,k.jsx)(ee,{className:`size-3.5 text-fg-quaternary`,"aria-hidden":`true`}),D.phone]})]})]})}),W=({icon:e,label:t,active:n})=>(0,k.jsxs)(`button`,{type:`button`,className:`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${n?`border-transparent bg-brand-solid text-white hover:bg-brand-solid_hover`:`border-secondary bg-primary text-secondary hover:bg-secondary_hover`}`,children:[(0,k.jsx)(e,{className:`size-4`,"aria-hidden":`true`}),t]}),G=()=>(0,k.jsxs)(`div`,{className:`mb-4`,children:[(0,k.jsx)(`div`,{className:`mb-3 flex flex-wrap items-center justify-between gap-2`,children:(0,k.jsxs)(`h1`,{className:`text-lg text-primary`,children:[(0,k.jsx)(`span`,{className:`font-normal text-tertiary`,children:`Showing Tee Times for: `}),(0,k.jsx)(`span`,{className:`font-bold`,children:D.name}),(0,k.jsx)(`span`,{className:`font-normal text-tertiary`,children:` on Thu, Jun 18`})]})}),(0,k.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,k.jsxs)(`div`,{className:`flex items-center gap-1 rounded-full bg-primary px-2 py-1 ring-1 ring-secondary`,children:[(0,k.jsx)(`button`,{type:`button`,className:`rounded-full p-1.5 hover:bg-secondary_hover`,children:(0,k.jsx)(i,{className:`size-4 text-fg-quaternary`,"aria-hidden":`true`})}),(0,k.jsxs)(`span`,{className:`flex items-center gap-1.5 px-2 text-sm font-semibold text-secondary`,children:[(0,k.jsx)(u,{className:`size-4 text-fg-quaternary`,"aria-hidden":`true`}),` Thu, Jun 18`]}),(0,k.jsx)(`button`,{type:`button`,className:`rounded-full p-1.5 hover:bg-secondary_hover`,children:(0,k.jsx)(o,{className:`size-4 text-fg-quaternary`,"aria-hidden":`true`})})]}),(0,k.jsx)(W,{icon:d,label:`Off`,active:!0}),(0,k.jsx)(W,{icon:u,label:`Time`}),(0,k.jsx)(W,{icon:d,label:`Price`}),(0,k.jsx)(W,{icon:l,label:`Golfers`}),(0,k.jsx)(W,{icon:p,label:`Holes`})]}),(0,k.jsxs)(`p`,{className:`mt-2 flex items-center gap-1.5 text-xs text-tertiary`,children:[(0,k.jsx)(s,{className:`size-3.5 text-fg-quaternary`,"aria-hidden":`true`}),`Convenience fee details · `,z,` Hot Deals available today`]})]}),K=({slot:e})=>{let[t,n]=e.label.split(` `);return(0,k.jsxs)(`button`,{type:`button`,className:`group relative flex flex-col overflow-hidden rounded-lg text-left shadow-sm ring-1 ring-secondary transition hover:shadow-md`,children:[(0,k.jsxs)(`div`,{className:`relative flex items-baseline gap-1 bg-primary-solid px-3 py-2 text-white`,children:[(0,k.jsx)(`span`,{className:`text-lg font-bold tabular-nums`,children:t}),(0,k.jsx)(`span`,{className:`text-xs font-semibold`,children:n}),e.isHotDeal&&(0,k.jsx)(`span`,{className:`absolute top-1.5 right-1.5`,children:(0,k.jsx)(g,{color:`brand`,size:`sm`,type:`pill-color`,children:`Hot Deal`})})]}),(0,k.jsxs)(`div`,{className:`flex flex-1 flex-col gap-1.5 bg-secondary px-3 py-2.5`,children:[(0,k.jsxs)(`div`,{className:`flex items-baseline gap-1.5`,children:[(0,k.jsx)(`span`,{className:`text-xl font-bold tabular-nums text-primary`,children:O(e.price)}),e.wasPrice&&(0,k.jsx)(`span`,{className:`text-xs text-tertiary line-through tabular-nums`,children:O(e.wasPrice)})]}),(0,k.jsxs)(`p`,{className:`text-xs font-medium text-tertiary`,children:[`Prepaid · `,e.holes,` Holes · `,e.cartIncluded?`Cart incl.`:`Walking`]}),(0,k.jsxs)(`div`,{className:`flex items-center gap-3 text-xs text-tertiary`,children:[(0,k.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,k.jsx)(p,{className:`size-3 text-fg-quaternary`,"aria-hidden":`true`}),` `,e.holes]}),(0,k.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,k.jsx)(l,{className:`size-3 text-fg-quaternary`,"aria-hidden":`true`}),` 1–`,e.spotsAvailable]}),e.timeOfDay===`twilight`&&(0,k.jsx)(g,{color:`gray`,size:`sm`,type:`pill-color`,children:`Twilight`})]}),(0,k.jsxs)(`div`,{className:`flex items-center justify-between border-t border-secondary pt-1.5`,children:[(0,k.jsxs)(`span`,{className:`text-xs text-quaternary`,children:[`+ `,O(2.49),` fee`]}),(0,k.jsx)(`span`,{className:`text-xs font-bold ${e.spotsAvailable<=1?`text-warning-primary`:`text-tertiary`}`,children:e.spotsAvailable===1?`1 left`:`${e.spotsAvailable} left`})]})]})]})},q=({title:e,slots:t})=>(0,k.jsxs)(`section`,{className:`mb-6`,children:[(0,k.jsxs)(`h3`,{className:`mb-2 text-sm font-bold text-primary`,children:[e,` `,(0,k.jsxs)(`span`,{className:`font-normal text-tertiary`,children:[`· `,t.length,` times`]})]}),(0,k.jsx)(`div`,{className:`grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6`,children:t.map(e=>(0,k.jsx)(K,{slot:e},e.id))})]}),J={render:()=>(0,k.jsxs)(`div`,{className:`min-h-screen bg-secondary text-primary`,children:[(0,k.jsx)(B,{}),(0,k.jsx)(V,{}),(0,k.jsx)(`div`,{className:`mx-auto max-w-[1200px] px-4 py-5`,children:(0,k.jsxs)(`div`,{className:`flex flex-col gap-5 lg:flex-row`,children:[(0,k.jsx)(U,{}),(0,k.jsxs)(`main`,{className:`min-w-0 flex-1`,children:[(0,k.jsx)(G,{}),(0,k.jsx)(q,{title:`Morning Tee Times`,slots:I}),(0,k.jsx)(q,{title:`Midday Tee Times`,slots:L}),(0,k.jsx)(q,{title:`Twilight Tee Times`,slots:R})]})]})})]})},Y=L.find(e=>e.isHotDeal)??L[3],X=({label:e,amount:t,accent:n,strong:r,info:i})=>(0,k.jsxs)(`div`,{className:`flex items-center justify-between gap-4 py-1 text-sm`,children:[(0,k.jsxs)(`span`,{className:`flex items-center gap-1 ${r?`font-bold text-primary`:`text-secondary`}`,children:[i&&(0,k.jsx)(s,{className:`size-3.5 text-fg-quaternary`,"aria-hidden":`true`}),e]}),(0,k.jsx)(`span`,{className:`tabular-nums ${n?`font-bold text-brand-secondary`:r?`font-bold text-primary`:`text-primary`}`,children:t})]}),Z=({children:e})=>(0,k.jsx)(`span`,{className:`rounded-full border border-secondary bg-primary px-3 py-1 text-xs font-semibold text-secondary`,children:e}),Q={render:()=>{let e=Y.price,t=2.49,n=Y.wasPrice?Y.wasPrice-Y.price:0,r=e+t+0;return(0,k.jsxs)(`div`,{className:`min-h-screen bg-secondary text-primary`,children:[(0,k.jsx)(B,{}),(0,k.jsxs)(`div`,{className:`mx-auto max-w-[1100px] px-4 py-6`,children:[(0,k.jsxs)(`div`,{className:`grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]`,children:[(0,k.jsxs)(`div`,{className:`space-y-5`,children:[(0,k.jsxs)(`div`,{className:`relative overflow-hidden rounded-xl ring-1 ring-secondary`,children:[(0,k.jsx)(`img`,{src:j,alt:D.name,className:`h-72 w-full object-cover`}),(0,k.jsx)(`span`,{className:`absolute top-3 left-3 rounded bg-primary-solid px-2 py-1 text-xs font-semibold text-white`,children:`Sagamore Spring`})]}),(0,k.jsxs)(`div`,{className:`flex gap-5 border-b border-secondary text-sm font-semibold`,children:[(0,k.jsx)(`a`,{className:`border-b-2 border-brand pb-2 text-brand-secondary`,children:`Info`}),(0,k.jsx)(`a`,{className:`pb-2 text-tertiary`,children:`Location`}),(0,k.jsx)(`a`,{className:`pb-2 text-tertiary`,children:`Notes & Policies`})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`h1`,{className:`text-2xl font-bold text-primary`,children:D.name}),(0,k.jsx)(`p`,{className:`text-sm text-tertiary`,children:D.address}),(0,k.jsxs)(`div`,{className:`mt-1.5 flex items-center gap-2`,children:[(0,k.jsx)(H,{value:M}),(0,k.jsxs)(`a`,{className:`text-xs font-semibold text-brand-secondary underline`,children:[N,` Reviews`]})]})]}),(0,k.jsxs)(`p`,{className:`text-sm leading-relaxed text-tertiary`,children:[`Established in `,D.established,`, Sagamore Spring Golf Club is a well-regarded public 18 perfect for golfers of every level. Walk or ride tree-lined fairways with greens that run true to form.`]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`h2`,{className:`mb-2 text-sm font-bold text-primary`,children:`Tee Details`}),(0,k.jsx)(`div`,{className:`overflow-hidden rounded-lg ring-1 ring-secondary`,children:(0,k.jsxs)(`table`,{className:`w-full text-sm`,children:[(0,k.jsx)(`thead`,{children:(0,k.jsxs)(`tr`,{className:`bg-primary-solid text-left text-white`,children:[(0,k.jsx)(`th`,{className:`px-4 py-2 font-semibold`,children:`Tee`}),(0,k.jsx)(`th`,{className:`px-4 py-2 font-semibold`,children:`Par`}),(0,k.jsx)(`th`,{className:`px-4 py-2 font-semibold`,children:`Length`}),(0,k.jsx)(`th`,{className:`px-4 py-2 font-semibold`,children:`Rating`}),(0,k.jsx)(`th`,{className:`px-4 py-2 font-semibold`,children:`Slope`})]})}),(0,k.jsxs)(`tbody`,{className:`bg-primary`,children:[(0,k.jsxs)(`tr`,{className:`border-b border-secondary`,children:[(0,k.jsx)(`td`,{className:`px-4 py-2 text-secondary`,children:`Blue (18-hole)`}),(0,k.jsx)(`td`,{className:`px-4 py-2 tabular-nums text-secondary`,children:`70`}),(0,k.jsx)(`td`,{className:`px-4 py-2 tabular-nums text-secondary`,children:`5,936 yards`}),(0,k.jsx)(`td`,{className:`px-4 py-2 tabular-nums text-secondary`,children:`68.4`}),(0,k.jsx)(`td`,{className:`px-4 py-2 tabular-nums text-secondary`,children:`119`})]}),(0,k.jsxs)(`tr`,{children:[(0,k.jsx)(`td`,{className:`px-4 py-2 text-secondary`,children:`White (18-hole)`}),(0,k.jsx)(`td`,{className:`px-4 py-2 tabular-nums text-secondary`,children:`70`}),(0,k.jsx)(`td`,{className:`px-4 py-2 tabular-nums text-secondary`,children:`5,512 yards`}),(0,k.jsx)(`td`,{className:`px-4 py-2 tabular-nums text-secondary`,children:`66.9`}),(0,k.jsx)(`td`,{className:`px-4 py-2 tabular-nums text-secondary`,children:`114`})]})]})]})})]})]}),(0,k.jsx)(`aside`,{className:`space-y-4`,children:(0,k.jsxs)(`div`,{className:`overflow-hidden rounded-xl bg-primary ring-1 ring-secondary`,children:[(0,k.jsxs)(`div`,{className:`grid grid-cols-3 gap-2 border-b border-secondary p-4 text-sm`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`p`,{className:`text-xs text-tertiary`,children:`Date`}),(0,k.jsx)(`p`,{className:`font-semibold text-primary`,children:`Thu, Jun 18`})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`p`,{className:`text-xs text-tertiary`,children:`Time`}),(0,k.jsx)(`p`,{className:`font-semibold text-primary`,children:Y.label})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`p`,{className:`text-xs text-tertiary`,children:`Holes`}),(0,k.jsx)(`p`,{className:`font-semibold text-primary`,children:Y.holes})]}),(0,k.jsxs)(`div`,{className:`col-span-3 mt-1 flex flex-wrap items-center gap-2`,children:[(0,k.jsxs)(Z,{children:[`Prepaid · `,Y.holes,` Holes`]}),(0,k.jsx)(Z,{children:Y.cartIncluded?`Riding cart`:`Walking`}),Y.timeOfDay===`twilight`&&(0,k.jsx)(Z,{children:`Twilight`}),Y.isHotDeal&&(0,k.jsx)(g,{color:`brand`,size:`md`,type:`pill-color`,children:`Hot Deal`})]})]}),(0,k.jsxs)(`div`,{className:`flex items-center justify-between gap-3 bg-brand-solid px-4 py-3`,children:[(0,k.jsxs)(`div`,{className:`text-white`,children:[(0,k.jsx)(`p`,{className:`text-sm font-bold`,children:`Sagamore Rewards`}),(0,k.jsx)(`p`,{className:`text-xs text-primary_on-brand`,children:`+ 56 to be earned on this tee time`})]}),(0,k.jsx)(`span`,{className:`text-lg font-bold text-white`,children:`+ 56`})]}),(0,k.jsxs)(`div`,{className:`space-y-4 p-4`,children:[(0,k.jsxs)(`p`,{className:`text-lg font-bold text-primary tabular-nums`,children:[O(e),` `,(0,k.jsx)(`span`,{className:`text-sm font-normal text-tertiary`,children:`/ golfer`})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`p`,{className:`mb-2 text-sm font-semibold text-secondary`,children:`Number of Golfers`}),(0,k.jsx)(T,{defaultValue:1,max:Y.spotsAvailable}),(0,k.jsxs)(`p`,{className:`mt-1.5 flex items-center gap-1 text-xs text-warning-primary`,children:[(0,k.jsx)(s,{className:`size-3.5`,"aria-hidden":`true`}),Y.spotsAvailable===1?`Only 1 spot left`:`${Y.spotsAvailable} spots left`,` on this slot`]})]}),(0,k.jsxs)(`div`,{className:`border-t border-secondary pt-3`,children:[(0,k.jsx)(X,{label:`Green Fees (1 Golfer x ${O(e)})`,amount:O(e)}),(0,k.jsx)(X,{label:`Convenience Fee`,amount:O(t),info:!0}),(0,k.jsx)(X,{label:`Estimated Taxes`,amount:O(0)}),n>0&&(0,k.jsx)(X,{label:`Hot Deal Discount`,amount:`-${O(n)}`,accent:!0,info:!0}),(0,k.jsx)(`div`,{className:`mt-1 border-t border-secondary pt-2`,children:(0,k.jsx)(X,{label:`Total`,amount:O(r),strong:!0})})]}),(0,k.jsx)(m,{size:`lg`,className:`w-full justify-center`,children:`Continue to Book`}),(0,k.jsxs)(`p`,{className:`flex items-start gap-1.5 text-xs text-tertiary`,children:[(0,k.jsx)(c,{className:`mt-0.5 size-3.5 shrink-0 text-fg-quaternary`,"aria-hidden":`true`}),`Free cancellation up to 24 hrs before tee time. Weather rain checks honored.`]})]})]})})]}),(0,k.jsxs)(`div`,{className:`mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]`,children:[(0,k.jsxs)(`div`,{className:`space-y-5 rounded-xl bg-primary p-5 ring-1 ring-secondary`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`h2`,{className:`text-sm font-bold text-primary`,children:`Secure Checkout`}),(0,k.jsx)(`p`,{className:`mt-1 text-md font-semibold text-primary`,children:D.name}),(0,k.jsxs)(`p`,{className:`text-sm text-tertiary`,children:[`Prepaid · `,Y.holes,` Holes`]}),(0,k.jsxs)(`div`,{className:`mt-2 flex flex-wrap items-center gap-3 text-sm text-secondary`,children:[(0,k.jsxs)(`span`,{children:[`Thu, Jun 18 · `,Y.label]}),(0,k.jsx)(Z,{children:Y.cartIncluded?`Riding cart`:`Walking`}),(0,k.jsxs)(Z,{children:[Y.holes,` Holes`]}),(0,k.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,k.jsx)(l,{className:`size-3.5 text-fg-quaternary`,"aria-hidden":`true`}),` 1 golfer`]})]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`h3`,{className:`mb-3 text-sm font-bold text-primary`,children:`Payment Options`}),(0,k.jsxs)(`div`,{className:`grid grid-cols-1 gap-3 sm:grid-cols-2`,children:[(0,k.jsx)(h,{label:`Billing Name`,placeholder:`Justin Girard`,isRequired:!0}),(0,k.jsx)(h,{label:`Billing Address`,placeholder:`33 Rich St`,isRequired:!0}),(0,k.jsx)(h,{label:`City / State`,placeholder:`Lynnfield, MA`,isRequired:!0}),(0,k.jsx)(h,{label:`Postal Code`,placeholder:`01940`,isRequired:!0}),(0,k.jsx)(h,{label:`Card Number`,icon:f,placeholder:`•••• •••• •••• 1009`,isRequired:!0}),(0,k.jsx)(h,{label:`Phone Number`,placeholder:`(617) 470-7879`})]}),(0,k.jsxs)(`label`,{className:`mt-3 flex items-center gap-2`,children:[(0,k.jsx)(_,{}),` `,(0,k.jsx)(`span`,{className:`text-sm text-secondary`,children:`Save billing address to my account profile`})]})]}),(0,k.jsxs)(`div`,{className:`border-t border-secondary pt-4`,children:[(0,k.jsx)(`h3`,{className:`mb-2 text-sm font-bold text-primary`,children:`Stay Connected`}),(0,k.jsxs)(`div`,{className:`space-y-2`,children:[(0,k.jsxs)(`label`,{className:`flex items-center gap-2`,children:[(0,k.jsx)(_,{}),` `,(0,k.jsx)(`span`,{className:`text-sm text-tertiary`,children:`Send me offers and news from Sagamore Spring by email`})]}),(0,k.jsxs)(`label`,{className:`flex items-center gap-2`,children:[(0,k.jsx)(_,{}),` `,(0,k.jsx)(`span`,{className:`text-sm text-tertiary`,children:`Send me a text reminder about my reservation`})]})]})]}),(0,k.jsxs)(`div`,{className:`border-t border-secondary pt-4 text-sm font-semibold text-brand-secondary`,children:[(0,k.jsx)(`a`,{className:`mr-4 underline`,children:`Add a promo code or credit`}),(0,k.jsx)(`a`,{className:`underline`,children:`Add a gift card`})]})]}),(0,k.jsxs)(`aside`,{className:`space-y-4`,children:[(0,k.jsxs)(`div`,{className:`rounded-xl bg-primary p-5 ring-1 ring-secondary`,children:[(0,k.jsx)(`h3`,{className:`mb-3 text-sm font-bold text-primary`,children:`Summary`}),(0,k.jsx)(X,{label:`Green Fees (1 Golfer x ${O(e)})`,amount:O(e)}),(0,k.jsx)(X,{label:`Convenience Fee`,amount:O(t),info:!0}),(0,k.jsx)(X,{label:`Estimated Taxes`,amount:O(0)}),n>0&&(0,k.jsx)(X,{label:`Total Discounts`,amount:`-${O(n)}`,accent:!0,info:!0}),(0,k.jsxs)(`div`,{className:`mt-2 space-y-1 border-t border-secondary pt-2`,children:[(0,k.jsx)(X,{label:`Total`,amount:O(r),strong:!0}),(0,k.jsx)(X,{label:`Due at Course`,amount:O(0)}),(0,k.jsx)(X,{label:`Total Due Now`,amount:O(r),accent:!0})]}),(0,k.jsxs)(`p`,{className:`mt-3 flex items-start gap-1.5 text-xs text-tertiary`,children:[(0,k.jsx)(s,{className:`mt-0.5 size-3.5 shrink-0 text-fg-quaternary`,"aria-hidden":`true`}),`This tee time requires advance payment through Sagamore Spring.`]})]}),(0,k.jsxs)(`label`,{className:`flex items-start gap-2 rounded-xl bg-primary p-4 ring-1 ring-secondary`,children:[(0,k.jsx)(_,{}),(0,k.jsxs)(`span`,{className:`text-xs text-tertiary`,children:[`By checking the box and clicking below, I agree to the `,(0,k.jsx)(`span`,{className:`font-semibold text-brand-secondary`,children:`Terms of Use`}),`,`,` `,(0,k.jsx)(`span`,{className:`font-semibold text-brand-secondary`,children:`Privacy Policy`}),`, and`,` `,(0,k.jsx)(`span`,{className:`font-semibold text-brand-secondary`,children:`Cancellation & Weather Policy`}),`.`]})]}),(0,k.jsxs)(m,{size:`lg`,className:`w-full justify-center`,children:[`Make Your Reservation — `,O(r)]})]})]})]})]})}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-secondary text-primary">
            <TopBar />
            <SearchRow />
            <div className="mx-auto max-w-[1200px] px-4 py-5">
                <div className="flex flex-col gap-5 lg:flex-row">
                    <CourseRail />
                    <main className="min-w-0 flex-1">
                        <FilterBar />
                        <TeeGroup title="Morning Tee Times" slots={morning} />
                        <TeeGroup title="Midday Tee Times" slots={midday} />
                        <TeeGroup title="Twilight Tee Times" slots={twilight} />
                    </main>
                </div>
            </div>
        </div>
}`,...J.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => {
    const greenFees = selected.price;
    const fee = 2.49;
    const taxes = 0;
    const discount = selected.wasPrice ? selected.wasPrice - selected.price : 0;
    const total = greenFees + fee + taxes;
    return <div className="min-h-screen bg-secondary text-primary">
                <TopBar />

                <div className="mx-auto max-w-[1100px] px-4 py-6">
                    {/* Course hero + booking panel */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                        {/* Left: course info */}
                        <div className="space-y-5">
                            <div className="relative overflow-hidden rounded-xl ring-1 ring-secondary">
                                <img src={heroPhoto} alt={course.name} className="h-72 w-full object-cover" />
                                <span className="absolute top-3 left-3 rounded bg-primary-solid px-2 py-1 text-xs font-semibold text-white">
                                    Sagamore Spring
                                </span>
                            </div>

                            <div className="flex gap-5 border-b border-secondary text-sm font-semibold">
                                <a className="border-b-2 border-brand pb-2 text-brand-secondary">Info</a>
                                <a className="pb-2 text-tertiary">Location</a>
                                <a className="pb-2 text-tertiary">Notes &amp; Policies</a>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-primary">{course.name}</h1>
                                <p className="text-sm text-tertiary">{course.address}</p>
                                <div className="mt-1.5 flex items-center gap-2">
                                    <Stars value={courseRating} />
                                    <a className="text-xs font-semibold text-brand-secondary underline">{reviewCount} Reviews</a>
                                </div>
                            </div>

                            <p className="text-sm leading-relaxed text-tertiary">
                                Established in {course.established}, Sagamore Spring Golf Club is a well-regarded public 18 perfect for golfers of every
                                level. Walk or ride tree-lined fairways with greens that run true to form.
                            </p>

                            {/* Tee details table */}
                            <div>
                                <h2 className="mb-2 text-sm font-bold text-primary">Tee Details</h2>
                                <div className="overflow-hidden rounded-lg ring-1 ring-secondary">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-primary-solid text-left text-white">
                                                <th className="px-4 py-2 font-semibold">Tee</th>
                                                <th className="px-4 py-2 font-semibold">Par</th>
                                                <th className="px-4 py-2 font-semibold">Length</th>
                                                <th className="px-4 py-2 font-semibold">Rating</th>
                                                <th className="px-4 py-2 font-semibold">Slope</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-primary">
                                            <tr className="border-b border-secondary">
                                                <td className="px-4 py-2 text-secondary">Blue (18-hole)</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">70</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">5,936 yards</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">68.4</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">119</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 text-secondary">White (18-hole)</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">70</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">5,512 yards</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">66.9</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">114</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right: booking panel */}
                        <aside className="space-y-4">
                            <div className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary">
                                <div className="grid grid-cols-3 gap-2 border-b border-secondary p-4 text-sm">
                                    <div>
                                        <p className="text-xs text-tertiary">Date</p>
                                        <p className="font-semibold text-primary">Thu, Jun 18</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-tertiary">Time</p>
                                        <p className="font-semibold text-primary">{selected.label}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-tertiary">Holes</p>
                                        <p className="font-semibold text-primary">{selected.holes}</p>
                                    </div>
                                    <div className="col-span-3 mt-1 flex flex-wrap items-center gap-2">
                                        <Pill>Prepaid · {selected.holes} Holes</Pill>
                                        <Pill>{selected.cartIncluded ? "Riding cart" : "Walking"}</Pill>
                                        {selected.timeOfDay === "twilight" && <Pill>Twilight</Pill>}
                                        {selected.isHotDeal && <Badge color="brand" size="md" type="pill-color">
                                                Hot Deal
                                            </Badge>}
                                    </div>
                                </div>

                                {/* Rewards banner */}
                                <div className="flex items-center justify-between gap-3 bg-brand-solid px-4 py-3">
                                    <div className="text-white">
                                        <p className="text-sm font-bold">Sagamore Rewards</p>
                                        <p className="text-xs text-primary_on-brand">+ 56 to be earned on this tee time</p>
                                    </div>
                                    <span className="text-lg font-bold text-white">+ 56</span>
                                </div>

                                <div className="space-y-4 p-4">
                                    <p className="text-lg font-bold text-primary tabular-nums">
                                        {formatPrice(greenFees)} <span className="text-sm font-normal text-tertiary">/ golfer</span>
                                    </p>

                                    <div>
                                        <p className="mb-2 text-sm font-semibold text-secondary">Number of Golfers</p>
                                        <PlayerStepper defaultValue={1} max={selected.spotsAvailable} />
                                        <p className="mt-1.5 flex items-center gap-1 text-xs text-warning-primary">
                                            <InfoCircle className="size-3.5" aria-hidden="true" />
                                            {selected.spotsAvailable === 1 ? "Only 1 spot left" : \`\${selected.spotsAvailable} spots left\`} on this slot
                                        </p>
                                    </div>

                                    <div className="border-t border-secondary pt-3">
                                        <SummaryRow label={\`Green Fees (1 Golfer x \${formatPrice(greenFees)})\`} amount={formatPrice(greenFees)} />
                                        <SummaryRow label="Convenience Fee" amount={formatPrice(fee)} info />
                                        <SummaryRow label="Estimated Taxes" amount={formatPrice(taxes)} />
                                        {discount > 0 && <SummaryRow label="Hot Deal Discount" amount={\`-\${formatPrice(discount)}\`} accent info />}
                                        <div className="mt-1 border-t border-secondary pt-2">
                                            <SummaryRow label="Total" amount={formatPrice(total)} strong />
                                        </div>
                                    </div>

                                    <Button size="lg" className="w-full justify-center">
                                        Continue to Book
                                    </Button>

                                    <p className="flex items-start gap-1.5 text-xs text-tertiary">
                                        <Umbrella03 className="mt-0.5 size-3.5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                        Free cancellation up to 24 hrs before tee time. Weather rain checks honored.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Secure checkout block (lower section of the GolfNow checkout) */}
                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
                        <div className="space-y-5 rounded-xl bg-primary p-5 ring-1 ring-secondary">
                            <div>
                                <h2 className="text-sm font-bold text-primary">Secure Checkout</h2>
                                <p className="mt-1 text-md font-semibold text-primary">{course.name}</p>
                                <p className="text-sm text-tertiary">Prepaid · {selected.holes} Holes</p>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-secondary">
                                    <span>Thu, Jun 18 · {selected.label}</span>
                                    <Pill>{selected.cartIncluded ? "Riding cart" : "Walking"}</Pill>
                                    <Pill>{selected.holes} Holes</Pill>
                                    <span className="flex items-center gap-1">
                                        <Users01 className="size-3.5 text-fg-quaternary" aria-hidden="true" /> 1 golfer
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 text-sm font-bold text-primary">Payment Options</h3>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <Input label="Billing Name" placeholder="Justin Girard" isRequired />
                                    <Input label="Billing Address" placeholder="33 Rich St" isRequired />
                                    <Input label="City / State" placeholder="Lynnfield, MA" isRequired />
                                    <Input label="Postal Code" placeholder="01940" isRequired />
                                    <Input label="Card Number" icon={User01} placeholder="•••• •••• •••• 1009" isRequired />
                                    <Input label="Phone Number" placeholder="(617) 470-7879" />
                                </div>
                                <label className="mt-3 flex items-center gap-2">
                                    <Checkbox /> <span className="text-sm text-secondary">Save billing address to my account profile</span>
                                </label>
                            </div>

                            <div className="border-t border-secondary pt-4">
                                <h3 className="mb-2 text-sm font-bold text-primary">Stay Connected</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <Checkbox /> <span className="text-sm text-tertiary">Send me offers and news from Sagamore Spring by email</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <Checkbox /> <span className="text-sm text-tertiary">Send me a text reminder about my reservation</span>
                                    </label>
                                </div>
                            </div>

                            <div className="border-t border-secondary pt-4 text-sm font-semibold text-brand-secondary">
                                <a className="mr-4 underline">Add a promo code or credit</a>
                                <a className="underline">Add a gift card</a>
                            </div>
                        </div>

                        {/* Summary sidebar */}
                        <aside className="space-y-4">
                            <div className="rounded-xl bg-primary p-5 ring-1 ring-secondary">
                                <h3 className="mb-3 text-sm font-bold text-primary">Summary</h3>
                                <SummaryRow label={\`Green Fees (1 Golfer x \${formatPrice(greenFees)})\`} amount={formatPrice(greenFees)} />
                                <SummaryRow label="Convenience Fee" amount={formatPrice(fee)} info />
                                <SummaryRow label="Estimated Taxes" amount={formatPrice(taxes)} />
                                {discount > 0 && <SummaryRow label="Total Discounts" amount={\`-\${formatPrice(discount)}\`} accent info />}
                                <div className="mt-2 space-y-1 border-t border-secondary pt-2">
                                    <SummaryRow label="Total" amount={formatPrice(total)} strong />
                                    <SummaryRow label="Due at Course" amount={formatPrice(0)} />
                                    <SummaryRow label="Total Due Now" amount={formatPrice(total)} accent />
                                </div>
                                <p className="mt-3 flex items-start gap-1.5 text-xs text-tertiary">
                                    <InfoCircle className="mt-0.5 size-3.5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                    This tee time requires advance payment through Sagamore Spring.
                                </p>
                            </div>

                            <label className="flex items-start gap-2 rounded-xl bg-primary p-4 ring-1 ring-secondary">
                                <Checkbox />
                                <span className="text-xs text-tertiary">
                                    By checking the box and clicking below, I agree to the <span className="font-semibold text-brand-secondary">Terms of Use</span>,{" "}
                                    <span className="font-semibold text-brand-secondary">Privacy Policy</span>, and{" "}
                                    <span className="font-semibold text-brand-secondary">Cancellation &amp; Weather Policy</span>.
                                </span>
                            </label>

                            <Button size="lg" className="w-full justify-center">
                                Make Your Reservation — {formatPrice(total)}
                            </Button>
                        </aside>
                    </div>
                </div>
            </div>;
  }
}`,...Q.parameters?.docs?.source}}},$=[`SearchResults`,`Checkout`]}))();export{Q as Checkout,J as SearchResults,$ as __namedExportsOrder,A as default};