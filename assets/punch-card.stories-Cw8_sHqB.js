import{i as e}from"./preload-helper-tpQASj4C.js";import{d as t}from"./iframe-BbsIfxGP.js";import{i as n,r}from"./wallet-experience-idFEBGPw.js";var i,a,o,s,c;e((()=>{i=t(),n(),a={title:`Profile ∕ Account/Wallet`,parameters:{layout:`fullscreen`,docs:{description:{component:`"Profile / Wallet · Punch Cards" — the punch-card experience in a modal: the
visual card, an activatable QR code with a countdown timer to scan at the
register, and packs to buy.`}}}},o={name:`Punch Cards`,render:()=>(0,i.jsx)(r,{initialModal:`punch`})},s={name:`Punch Card · QR`,render:()=>(0,i.jsx)(r,{initialModal:`punch`,punchQR:!0})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Punch Cards",
  render: () => <WalletExperience initialModal="punch" />
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Punch Card · QR",
  render: () => <WalletExperience initialModal="punch" punchQR />
}`,...s.parameters?.docs?.source}}},c=[`PunchCards`,`PunchCardQR`]}))();export{s as PunchCardQR,o as PunchCards,c as __namedExportsOrder,a as default};