import{i as e}from"./preload-helper-tpQASj4C.js";import{V as t,n,nt as r,ot as i,r as a}from"./p3-story-kit-5DXER4Rj.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E;e((()=>{t(),n(),o={title:`Prototypes/MCG Prototype 3/Packages & credits`,id:`mcg-prototype-3-packages-credits`,parameters:{layout:`fullscreen`,docs:{description:{component:"Lesson packages, monthly plans and the lesson-credit wallet — Prototype 3's Packages & Credits,\nas rebuilt in Crane and ported back. Every state is a URL on `/instruction/packages`\n(`?lessons=`, `?coach=`, `?step=plans`, `?pack=<id>&step=checkout|done`) or `/instruction/credits`\n(`?bought=`, `?demo=`). Credits expire one year after purchase, shown as a real date per pack.\nBuying a pack calls the Instruction store's `buyPack`, so the new balance is in My credits\nstraight away (within one story)."}}}},s=`mike-kenny--pack-5`,c=`mike-kenny--sub-2`,l=a(i(),`The catalog: packs from seven instructors, filter chips, Save / Best value badges, credit dots, course chips, terms and price per lesson.`,{},`Packages`),u=a(i({extra:{lessons:`10`}}),"`?lessons=10` — only the 10-lesson packs (Mike Kenny, Doug Hamilton).",{},`Filtered to 10 lessons`),d=a(i({coach:`doug-hamilton`}),"`?coach=doug-hamilton` — “Showing Doug Hamilton's packs · Show all”, plus his monthly plan.",{},`One instructor's packs`),f=a(i({pack:s}),`What's included, how it works, restrictions, the fine print as fields (expiry date), and the price with its saving.`,{},`Pack detail`),p=a(i({pack:`doug-hamilton--thrive-import`}),`Credits carried over from Thrive: terms visible, never for sale — no price, no Buy.`,{},`Assigned pack (Thrive import)`),m=a(i({pack:s,step:`checkout`}),`Contact, saved cards, what you're agreeing to, order summary, Pay.`,{},`Checkout`),h=a(i({pack:s,step:`checkout`}),`An account is required: sign in or create one, then come back to this checkout.`,{signedIn:!1},`Checkout · signed out`),g=a(i({pack:s,step:`done`}),`“5 lessons are yours” — credits added to the wallet; Book a lesson with these credits goes to Booking for Mike Kenny.`,{},`Purchased`),_=a(i({step:`plans`}),"`?step=plans` — the monthly plans, marked Concept (“Model C”).",{},`Monthly plans`),v=a(i({pack:c}),`A plan's detail: what you get, how billing works, first billing date and auto-renew (both in the URL), then checkout.`,{},`Start a plan`),y=a(i({pack:c,step:`checkout`}),`The same checkout for a plan: charged on the first billing date, then monthly.`,{},`Plan checkout`),b=a(i({pack:c,step:`done`}),`The plan is set up: start date, renewal notice, Book your first lesson.`,{},`Plan started`),x=a(r(),`The wallet: totals, a balance per instructor (Mike Kenny's pack, Doug Hamilton's Thrive import) with expiry dates, the loyalty-discount concept, how credits work.`,{},`My credits`),S=a(r({extra:{bought:s}}),"`?bought=<pack>` — the confirmation's View my credits: “5 credits added” notice. (A story starts with a fresh store, so the new balance itself isn't there.)",{},`Credits after buying a pack`),C=a(r({extra:{demo:`after-booking`}}),`One credit spent with Mike Kenny: 4 of 5 left, with the redemption in the history.`,{},`Credits after a booking`),w=a(r({extra:{demo:`spent-expired`}}),`A used-up pack (buy another) and one that expired with two lessons on it (ask the Academy), plus MCG's open policy question.`,{},`Spent & expired`),T=a(r({extra:{demo:`empty`}}),`Empty wallet: Browse packages / Monthly plans and how credits work.`,{},`No credits`),l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`p3Story(packagesHref(), "The catalog: packs from seven instructors, filter chips, Save / Best value badges, credit dots, course chips, terms and price per lesson.", {}, "Packages")`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  extra: {
    lessons: "10"
  }
}), "\`?lessons=10\` — only the 10-lesson packs (Mike Kenny, Doug Hamilton).", {}, "Filtered to 10 lessons")`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  coach: "doug-hamilton"
}), "\`?coach=doug-hamilton\` — “Showing Doug Hamilton's packs · Show all”, plus his monthly plan.", {}, "One instructor's packs")`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: PACK
}), "What's included, how it works, restrictions, the fine print as fields (expiry date), and the price with its saving.", {}, "Pack detail")`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: "doug-hamilton--thrive-import"
}), "Credits carried over from Thrive: terms visible, never for sale — no price, no Buy.", {}, "Assigned pack (Thrive import)")`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: PACK,
  step: "checkout"
}), "Contact, saved cards, what you're agreeing to, order summary, Pay.", {}, "Checkout")`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: PACK,
  step: "checkout"
}), "An account is required: sign in or create one, then come back to this checkout.", {
  signedIn: false
}, "Checkout · signed out")`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: PACK,
  step: "done"
}), "“5 lessons are yours” — credits added to the wallet; Book a lesson with these credits goes to Booking for Mike Kenny.", {}, "Purchased")`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  step: "plans"
}), "\`?step=plans\` — the monthly plans, marked Concept (“Model C”).", {}, "Monthly plans")`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: PLAN
}), "A plan's detail: what you get, how billing works, first billing date and auto-renew (both in the URL), then checkout.", {}, "Start a plan")`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: PLAN,
  step: "checkout"
}), "The same checkout for a plan: charged on the first billing date, then monthly.", {}, "Plan checkout")`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: PLAN,
  step: "done"
}), "The plan is set up: start date, renewal notice, Book your first lesson.", {}, "Plan started")`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`p3Story(creditsHref(), "The wallet: totals, a balance per instructor (Mike Kenny's pack, Doug Hamilton's Thrive import) with expiry dates, the loyalty-discount concept, how credits work.", {}, "My credits")`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`p3Story(creditsHref({
  extra: {
    bought: PACK
  }
}), "\`?bought=<pack>\` — the confirmation's View my credits: “5 credits added” notice. (A story starts with a fresh store, so the new balance itself isn't there.)", {}, "Credits after buying a pack")`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`p3Story(creditsHref({
  extra: {
    demo: "after-booking"
  }
}), "One credit spent with Mike Kenny: 4 of 5 left, with the redemption in the history.", {}, "Credits after a booking")`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`p3Story(creditsHref({
  extra: {
    demo: "spent-expired"
  }
}), "A used-up pack (buy another) and one that expired with two lessons on it (ask the Academy), plus MCG's open policy question.", {}, "Spent & expired")`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`p3Story(creditsHref({
  extra: {
    demo: "empty"
  }
}), "Empty wallet: Browse packages / Monthly plans and how credits work.", {}, "No credits")`,...T.parameters?.docs?.source}}},E=[`Packages`,`FilteredTenLessons`,`OneInstructorsPacks`,`PackDetail`,`AssignedPack`,`Checkout`,`CheckoutSignedOut`,`Purchased`,`MonthlyPlans`,`StartAPlan`,`PlanCheckout`,`PlanStarted`,`MyCredits`,`JustBought`,`AfterABooking`,`SpentAndExpired`,`NoCredits`]}))();export{C as AfterABooking,p as AssignedPack,m as Checkout,h as CheckoutSignedOut,u as FilteredTenLessons,S as JustBought,_ as MonthlyPlans,x as MyCredits,T as NoCredits,d as OneInstructorsPacks,f as PackDetail,l as Packages,y as PlanCheckout,b as PlanStarted,g as Purchased,w as SpentAndExpired,v as StartAPlan,E as __namedExportsOrder,o as default};