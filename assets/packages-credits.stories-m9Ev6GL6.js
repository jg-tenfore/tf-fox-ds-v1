import{i as e}from"./preload-helper-tpQASj4C.js";import{K as t,at as n,dt as r,n as i,r as a,st as o}from"./p3-story-kit-Be7IJaBG.js";var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{t(),i(),s={title:`Prototypes/Instruction/Packages & Credits`,id:`instruction-packages-credits`,parameters:{layout:`fullscreen`,docs:{description:{component:`"Instruction / Packages & Credits" — Flow B of the MCG Academy build.

These stories now show **Prototype 3's updated Packages & Credits (ported from the Crane MCG
prototype)**, each opened at the URL for that state. The story ids are the ones Flow B always
had, so links from Linear still land on the matching state. (The original Flow B components
still power Prototype 1's app; only these stories moved.)

Model A — the credit book MCG runs today — is the flow: packs per instructor, checkout, credits
in the wallet with an expiry date one year after purchase, redeemed at booking. Model B (the
volume discount) lives on as the loyalty-discount concept in My credits, and Model C (a
monthly plan) as the plans marked Concept.`}}}},c=`mike-kenny--pack-5`,l=a(r(),`The packages catalog.`,{},`1. Browse Packages`),u=a(r({pack:c}),`Mike Kenny's 5-lesson pack.`,{},`2. Package Details`),d=a(r({pack:c,step:`checkout`}),`Checkout for the pack (signed in as the sample golfer).`,{},`3. Buy — Checkout`),f=a(r({pack:c,step:`done`}),`“5 lessons are yours”.`,{},`4. Purchase Confirmation`),p=a(o(),`My lesson credits.`,{},`5. Wallet — Credit Balance`),m=a(`${n({coach:`mike-kenny`,service:`private-45`,course:`falls-road`,date:`2026-10-09`,time:`09:00`,step:`payment`})}&pay=credit`,"Booking payment with Mike Kenny's credit selected (`pay=credit`).",{},`6. Redeem at Booking`),h=a(o({extra:{demo:`after-booking`}}),"My credits one lesson later (`demo=after-booking`).",{},`7. Balance After Redemption`),g=a(o(),`My credits, where the loyalty-discount concept (Model B) sits beside the balances.`,{},`Model B — Discount Progress`),_=a(o({extra:{demo:`after-booking`}}),`My credits after a booking, with the loyalty-discount concept.`,{},`Model B — Discount Earned`),v=a(r({pack:`mike-kenny--sub-2`}),`Mike Kenny's 2-lessons-a-month plan (Concept).`,{},`Model C — Monthly Plan`),y=a(r({pack:`doug-hamilton--thrive-import`}),`Doug Hamilton's Thrive import.`,{},`Assigned Package`),b=a(o({extra:{demo:`spent-expired`}}),`My credits with a spent and an expired balance.`,{},`Expired / Zero Balance`),l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`p3Story(packagesHref(), "The packages catalog.", {}, "1. Browse Packages")`,...l.parameters?.docs?.source},description:{story:`Packs shown per instructor, because rates are tied to people and therefore packs are too.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: PACK
}), "Mike Kenny's 5-lesson pack.", {}, "2. Package Details")`,...u.parameters?.docs?.source},description:{story:`The pack as a product: what's included, how it works, restrictions, the fine print as fields.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: PACK,
  step: "checkout"
}), "Checkout for the pack (signed in as the sample golfer).", {}, "3. Buy — Checkout")`,...d.parameters?.docs?.source},description:{story:`Package purchase, with the credit's terms restated at the point of payment.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: PACK,
  step: "done"
}), "“5 lessons are yours”.", {}, "4. Purchase Confirmation")`,...f.parameters?.docs?.source},description:{story:`Credits issued, expiry stated, and an immediate call to book the first lesson.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`p3Story(creditsHref(), "My lesson credits.", {}, "5. Wallet — Credit Balance")`,...p.parameters?.docs?.source},description:{story:`Credits itemized by instructor, each with its own expiry — also how the Academy reports what it owes in lessons.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`p3Story(\`\${bookHref({
  coach: "mike-kenny",
  service: "private-45",
  course: "falls-road",
  date: "2026-10-09",
  time: "09:00",
  step: "payment"
})}&pay=credit\`, "Booking payment with Mike Kenny's credit selected (\`pay=credit\`).", {}, "6. Redeem at Booking")`,...m.parameters?.docs?.source},description:{story:`Spending a credit at booking: the credit covers the lesson, the facility fee still goes on the card.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`p3Story(creditsHref({
  extra: {
    demo: "after-booking"
  }
}), "My credits one lesson later (\`demo=after-booking\`).", {}, "7. Balance After Redemption")`,...h.parameters?.docs?.source},description:{story:`Four of five remaining, with the redemption history.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`p3Story(creditsHref(), "My credits, where the loyalty-discount concept (Model B) sits beside the balances.", {}, "Model B — Discount Progress")`,...g.parameters?.docs?.source},description:{story:`Model B survives as the loyalty-discount concept shown in My credits (no balance, nothing owed).`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`p3Story(creditsHref({
  extra: {
    demo: "after-booking"
  }
}), "My credits after a booking, with the loyalty-discount concept.", {}, "Model B — Discount Earned")`,..._.parameters?.docs?.source},description:{story:`P3 has no separate "discount earned" state; the closest is the same concept in My credits after
a lesson has been taken.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: "mike-kenny--sub-2"
}), "Mike Kenny's 2-lessons-a-month plan (Concept).", {}, "Model C — Monthly Plan")`,...v.parameters?.docs?.source},description:{story:`A monthly plan: start date, auto-renew, renewal notice. Nothing prepaid beyond the current cycle.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`p3Story(packagesHref({
  pack: "doug-hamilton--thrive-import"
}), "Doug Hamilton's Thrive import.", {}, "Assigned Package")`,...y.parameters?.docs?.source},description:{story:`Credits imported from Thrive: visible to the golfer holding them, never for sale.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`p3Story(creditsHref({
  extra: {
    demo: "spent-expired"
  }
}), "My credits with a spent and an expired balance.", {}, "Expired / Zero Balance")`,...b.parameters?.docs?.source},description:{story:`A used-up pack and one that expired with lessons still on it — the two states the Academy fields calls about.`,...b.parameters?.docs?.description}}},x=[`BrowsePackages`,`PackageDetails`,`BuyCheckout`,`PurchaseConfirmation`,`WalletCreditBalance`,`RedeemAtBooking`,`BalanceAfterRedemption`,`ModelBDiscountProgress`,`ModelBDiscountEarned`,`ModelCMonthlyPlan`,`AssignedPackage`,`ExpiredZeroBalance`]}))();export{y as AssignedPackage,h as BalanceAfterRedemption,l as BrowsePackages,d as BuyCheckout,b as ExpiredZeroBalance,_ as ModelBDiscountEarned,g as ModelBDiscountProgress,v as ModelCMonthlyPlan,u as PackageDetails,f as PurchaseConfirmation,m as RedeemAtBooking,p as WalletCreditBalance,x as __namedExportsOrder,s as default};