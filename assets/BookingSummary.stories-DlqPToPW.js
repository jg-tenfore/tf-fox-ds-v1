import{i as e}from"./preload-helper-tpQASj4C.js";import{n as t,t as n}from"./booking-summary-ECXXbo0d.js";var r,i,a,o,s,c;e((()=>{t(),r={title:`Booking/Molecules/Booking Summary`,tags:[`!dev`],component:n,parameters:{layout:`centered`,docs:{description:{component:`The booking summary is the scorecard for the checkout — the Resy-style
reservation recap a golfer reviews before locking in a tee time at Sagamore
Spring. It restates the round (date, time, holes, players, ride), itemizes
every charge, and tallies the total. Pure and composable: feed it props, it
adds up the rest.`}}},argTypes:{dateLabel:{control:`text`},timeLabel:{control:`text`},holes:{control:`inline-radio`,options:[9,18]},players:{control:{type:`range`,min:1,max:4,step:1}},ride:{control:`inline-radio`,options:[`walking`,`cart`]},total:{control:`number`}},args:{dateLabel:`Sat, Jun 21`,timeLabel:`7:10 AM`,holes:18,players:4,ride:`cart`,lineItems:[{label:`Green fees · 4 × $70`,amount:280},{label:`Riding cart · 2 × $18`,amount:36}]}},i={},a={args:{dateLabel:`Sat, Jun 21`,timeLabel:`8:30 AM`,holes:18,players:4,ride:`cart`,lineItems:[{label:`Green fees · 4 × $70`,amount:280},{label:`Riding cart · 2 × $18`,amount:36}]}},o={args:{dateLabel:`Wed, Jun 18`,timeLabel:`4:40 PM`,holes:18,players:2,ride:`walking`,lineItems:[{label:`Twilight green fees · 2 × $32`,amount:64}]}},s={args:{dateLabel:`Sun, Jun 22`,timeLabel:`9:50 AM`,holes:18,players:4,ride:`cart`,lineItems:[{label:`Green fees · 4 × $70`,amount:280},{label:`Riding cart · 2 × $18`,amount:36},{label:`Club rental · 2 × $35`,amount:70},{label:`Range balls · 4 × $8`,amount:32}]}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Tweak the round and watch the card recompute the total from the line items.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    dateLabel: "Sat, Jun 21",
    timeLabel: "8:30 AM",
    holes: 18,
    players: 4,
    ride: "cart",
    lineItems: [{
      label: "Green fees · 4 × $70",
      amount: 280
    }, {
      label: "Riding cart · 2 × $18",
      amount: 36
    }]
  }
}`,...a.parameters?.docs?.source},description:{story:`A full foursome riding 18 on a Saturday — green fees plus a pair of shared carts.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    dateLabel: "Wed, Jun 18",
    timeLabel: "4:40 PM",
    holes: 18,
    players: 2,
    ride: "walking",
    lineItems: [{
      label: "Twilight green fees · 2 × $32",
      amount: 64
    }]
  }
}`,...o.parameters?.docs?.source},description:{story:`Two walking 18 after 3 PM at the flat twilight rate — the value play of the day.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    dateLabel: "Sun, Jun 22",
    timeLabel: "9:50 AM",
    holes: 18,
    players: 4,
    ride: "cart",
    lineItems: [{
      label: "Green fees · 4 × $70",
      amount: 280
    }, {
      label: "Riding cart · 2 × $18",
      amount: 36
    }, {
      label: "Club rental · 2 × $35",
      amount: 70
    }, {
      label: "Range balls · 4 × $8",
      amount: 32
    }]
  }
}`,...s.parameters?.docs?.source},description:{story:`The works: green fees, a cart, rental sticks, and a bucket to warm up on the range.`,...s.parameters?.docs?.description}}},c=[`Playground`,`FoursomeRiding`,`TwilightWalk`,`WithAddOns`]}))();export{a as FoursomeRiding,i as Playground,o as TwilightWalk,s as WithAddOns,c as __namedExportsOrder,r as default};