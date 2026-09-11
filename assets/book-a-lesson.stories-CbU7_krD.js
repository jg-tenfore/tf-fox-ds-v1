import{i as e}from"./preload-helper-tpQASj4C.js";import{n as t,t as n}from"./lesson-booking-flow-DeAMyc3V.js";var r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b;e((()=>{t(),r={title:`Instruction/Book a Lesson`,component:n,parameters:{layout:`fullscreen`,docs:{description:{component:`"Instruction / Book a Lesson" — Flow A of the MCG Academy build.

One component, \`LessonBookingFlow\`, covering the whole golfer-facing path from
browsing the catalog to a booked lesson. Each story opens the flow on a different
state; from there every screen is clickable, so a reviewer can trace the booking end
to end or jump straight to the state they care about.

The flow is **service-first** — you pick what you want before who teaches it. That's
the order the Sagamore prototype argues for, and the only one that can carry a group
clinic (fixed roster) and a private lesson (open calendar) through the same steps.

Numbered stories are steps in the sequence. Named stories are branches.`}}}},i={name:`1. Lessons & Clinics`,args:{step:`catalog`}},a={name:`2. Choose an Instructor`,args:{step:`instructor`,serviceId:`private-45`}},o={name:`3. Pick a Time`,args:{step:`time`,serviceId:`private-45`,coachId:`mike-kenny`}},s={name:`4. Lesson Details`,args:{step:`details`,serviceId:`private-45`,coachId:`mike-kenny`,players:1}},c={name:`5. Checkout — Pay Now`,args:{step:`checkout`,serviceId:`private-45`,coachId:`mike-kenny`,payWith:`card`}},l={name:`6. Checkout — Use a Credit`,args:{step:`checkout`,serviceId:`private-45`,coachId:`mike-kenny`,payWith:`credit`}},u={name:`7. Confirmation`,args:{step:`confirmation`,serviceId:`private-45`,coachId:`mike-kenny`,payWith:`credit`}},d={name:`Any Available Instructor`,args:{step:`time`,serviceId:`private-45`,coachId:`any`,courseSlug:`laytonsville`}},f={name:`Group Program`,args:{step:`details`,serviceId:`clinic-adult-l2`}},p={name:`Program Full — Waitlist`,args:{step:`waitlist`,serviceId:`clinic-wedge`}},m={name:`No Availability`,args:{step:`time`,serviceId:`private-45`,coachId:`mike-kenny`,fullyBooked:!0}},h={name:`Join the Waitlist`,args:{step:`waitlist`,serviceId:`private-45`,coachId:`mike-kenny`}},g={name:`Facility Calendar`,args:{step:`facility`,courseSlug:`falls-road`}},_={name:`Cross-Course Instructor`,args:{step:`profile`,coachId:`doug-hamilton`,highlightCourseSwitcher:!0}},v={name:`3-Person Lesson`,args:{step:`details`,serviceId:`private-45`,coachId:`doug-hamilton`,players:3}},y={name:`Junior Lesson`,args:{step:`details`,serviceId:`junior-30`,coachId:`kate-schanuel`,players:2}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "1. Lessons & Clinics",
  args: {
    step: "catalog"
  }
}`,...i.parameters?.docs?.source},description:{story:`One catalog holding privates, playing lessons, multi-week clinics and junior camps,
filtered by chips. Privates and programs render as the same card because they're the
same object with different capacity — the structural change that lets lessons be
built into the clinics system rather than beside it.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "2. Choose an Instructor",
  args: {
    step: "instructor",
    serviceId: "private-45"
  }
}`,...a.parameters?.docs?.source},description:{story:`Instructors for the chosen lesson, priced with their own adjustment on top of the
academy rate. "Any available instructor" leads — a first-class choice rather than a
fallback, so nobody has to pick a person before they pick a time.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "3. Pick a Time",
  args: {
    step: "time",
    serviceId: "private-45",
    coachId: "mike-kenny"
  }
}`,...o.parameters?.docs?.source},description:{story:`One instructor's day, split into Morning / Afternoon / Evening rather than a flat
wall of cells, with the lesson's guardrails applied. Booked and blocked times stay
visible so the day reads honestly.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "4. Lesson Details",
  args: {
    step: "details",
    serviceId: "private-45",
    coachId: "mike-kenny",
    players: 1
  }
}`,...s.parameters?.docs?.source},description:{story:`Party size as an option on one service rather than five separate ones — the total
climbs slowly because the instructor's hour is the same either way, so each golfer
pays less. Participant cards follow the Tee Time Details pattern.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "5. Checkout — Pay Now",
  args: {
    step: "checkout",
    serviceId: "private-45",
    coachId: "mike-kenny",
    payWith: "card"
  }
}`,...c.parameters?.docs?.source},description:{story:`Card capture and charge at booking — the behavior MCG wants for anything booked
online. The saved card is what later lets an instructor book and charge a student
directly, which is the thing CoachNow shipped without.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "6. Checkout — Use a Credit",
  args: {
    step: "checkout",
    serviceId: "private-45",
    coachId: "mike-kenny",
    payWith: "credit"
  }
}`,...l.parameters?.docs?.source},description:{story:`The same checkout with a lesson credit applied. This is the seam where Packages &
Credits meets booking: the credit covers the lesson, the facility fee is still
charged, and the golfer sees what will be left.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "7. Confirmation",
  args: {
    step: "confirmation",
    serviceId: "private-45",
    coachId: "mike-kenny",
    payWith: "credit"
  }
}`,...u.parameters?.docs?.source},description:{story:`The receipt both the golfer and the instructor work from — who, when, where, what was
charged, what credits remain, and a cross-sell into the same instructor's programs.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Any Available Instructor",
  args: {
    step: "time",
    serviceId: "private-45",
    coachId: "any",
    courseSlug: "laytonsville"
  }
}`,...d.parameters?.docs?.source},description:{story:`The fix for the CoachNow dead end, applied at the front of the flow. Every open slot
at the course across every instructor, merged onto one board, each time labelled with
whoever is free — so the golfer still knows who they're getting before they pay.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Group Program",
  args: {
    step: "details",
    serviceId: "clinic-adult-l2"
  }
}`,...f.parameters?.docs?.source},description:{story:`A six-week clinic booked through the same flow as a private. No instructor step and
no calendar — a program has a fixed schedule and a roster, so capacity replaces
availability and the rail collapses to three steps.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Program Full — Waitlist",
  args: {
    step: "waitlist",
    serviceId: "clinic-wedge"
  }
}`,...p.parameters?.docs?.source},description:{story:`A program at capacity. Full turns into a waitlist rather than a dead card — the
golfer states what they want and keeps their place until it opens.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "No Availability",
  args: {
    step: "time",
    serviceId: "private-45",
    coachId: "mike-kenny",
    fullyBooked: true
  }
}`,...m.parameters?.docs?.source},description:{story:`Nobody free all day. Three ways out instead of a back button: widen to any
instructor, join the waitlist, or try tomorrow.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Join the Waitlist",
  args: {
    step: "waitlist",
    serviceId: "private-45",
    coachId: "mike-kenny"
  }
}`,...h.parameters?.docs?.source},description:{story:`The waitlist itself — preferred daypart, preferred days, and a nudge showing how many
slots widening to any instructor would put in front of you.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Facility Calendar",
  args: {
    step: "facility",
    courseSlug: "falls-road"
  }
}`,...g.parameters?.docs?.source},description:{story:`Every instructor at one course in parallel columns for one day. The CoachNow feature
MCG pays for and has never switched on, and the shape a Pro Shop counter view would
later borrow.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Cross-Course Instructor",
  args: {
    step: "profile",
    coachId: "doug-hamilton",
    highlightCourseSwitcher: true
  }
}`,..._.parameters?.docs?.source},description:{story:`Doug teaches at Laytonsville, Little Bennett and Falls Road. One menu, a course
selector, and availability that follows the course — instead of CoachNow's nine
duplicated menu items.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "3-Person Lesson",
  args: {
    step: "details",
    serviceId: "private-45",
    coachId: "doug-hamilton",
    players: 3
  }
}`,...v.parameters?.docs?.source},description:{story:`Three golfers on one lesson: the total climbs slowly, the per-golfer cost drops
sharply, and one person pays. The multi-person case MCG already sells but can't
book cleanly today.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Junior Lesson",
  args: {
    step: "details",
    serviceId: "junior-30",
    coachId: "kate-schanuel",
    players: 2
  }
}`,...y.parameters?.docs?.source},description:{story:`A junior private, which caps at two golfers and is offered weekends only. The
guardrail belongs to the service, so it narrows the calendar rather than the other
way round.`,...y.parameters?.docs?.description}}},b=[`Catalog`,`ChooseInstructor`,`PickATime`,`LessonDetails`,`CheckoutPayNow`,`CheckoutUseCredit`,`Confirmation`,`AnyAvailableInstructor`,`GroupProgram`,`ProgramFullWaitlist`,`NoAvailability`,`JoinTheWaitlist`,`FacilityCalendar`,`CrossCourseInstructor`,`MultiPersonLesson`,`JuniorLesson`]}))();export{d as AnyAvailableInstructor,i as Catalog,c as CheckoutPayNow,l as CheckoutUseCredit,a as ChooseInstructor,u as Confirmation,_ as CrossCourseInstructor,g as FacilityCalendar,f as GroupProgram,h as JoinTheWaitlist,y as JuniorLesson,s as LessonDetails,v as MultiPersonLesson,m as NoAvailability,o as PickATime,p as ProgramFullWaitlist,b as __namedExportsOrder,r as default};