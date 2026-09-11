import{i as e}from"./preload-helper-tpQASj4C.js";import{r as t,t as n}from"./book-screen-Cy-8Huqy.js";var r,i,a,o,s,c,l;e((()=>{t(),r={title:`MCG Prototype/Lesson Booking`,component:n,parameters:{layout:`fullscreen`,docs:{description:{component:`"MCG Prototype / Lesson Booking" — \`/instruction/book\`, the back half of the
instructor-first path.

The Academy's flow is: pick a pro on \`/instruction\`, pick a lesson from that pro's
profile, then land here for time, details and payment. Because the first two
decisions are already made, the rail is three steps rather than five.

The routed page reads its selection from the query string (so a booking link is
shareable) or a session hand-off. A Storybook iframe has neither, so these stories
pass the selection in directly — the same component the route renders.`}}}},i={name:`Time — 45-Minute Private with Mike Kenny`,args:{selection:{coachId:`mike-kenny`,serviceId:`private-45`,courseSlug:`falls-road`}}},a={name:`Time — Doug Hamilton (three courses)`,args:{selection:{coachId:`doug-hamilton`,serviceId:`private-45`,courseSlug:`laytonsville`}}},o={name:`Time — Junior Private (weekends only)`,args:{selection:{coachId:`kate-schanuel`,serviceId:`junior-30`,courseSlug:`falls-road`}}},s={name:`Time — 9-Hole Playing Lesson`,args:{selection:{coachId:`mike-dickson`,serviceId:`playing-9`,courseSlug:`little-bennett`}}},c={name:`Opened without a selection`,args:{}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "Time — 45-Minute Private with Mike Kenny",
  args: {
    selection: {
      coachId: "mike-kenny",
      serviceId: "private-45",
      courseSlug: "falls-road"
    }
  }
}`,...i.parameters?.docs?.source},description:{story:`The standard case: the Director's 45-minute private at his home course.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "Time — Doug Hamilton (three courses)",
  args: {
    selection: {
      coachId: "doug-hamilton",
      serviceId: "private-45",
      courseSlug: "laytonsville"
    }
  }
}`,...a.parameters?.docs?.source},description:{story:`A cross-course instructor: the course cell offers all three of Doug's courses.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Time — Junior Private (weekends only)",
  args: {
    selection: {
      coachId: "kate-schanuel",
      serviceId: "junior-30",
      courseSlug: "falls-road"
    }
  }
}`,...o.parameters?.docs?.source},description:{story:`A guardrailed lesson — the junior private is weekends only, so most of the day is closed.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Time — 9-Hole Playing Lesson",
  args: {
    selection: {
      coachId: "mike-dickson",
      serviceId: "playing-9",
      courseSlug: "little-bennett"
    }
  }
}`,...s.parameters?.docs?.source},description:{story:`The on-course playing lesson: afternoons in season only.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Opened without a selection",
  args: {}
}`,...c.parameters?.docs?.source},description:{story:`Opened without a selection — a link that lost its query string, or someone typing
the URL. It says so and sends them back to pick a pro rather than silently booking
a lesson nobody chose.`,...c.parameters?.docs?.description}}},l=[`PickATime`,`CrossCourse`,`Guardrailed`,`PlayingLesson`,`ColdStart`]}))();export{c as ColdStart,a as CrossCourse,o as Guardrailed,i as PickATime,s as PlayingLesson,l as __namedExportsOrder,r as default};