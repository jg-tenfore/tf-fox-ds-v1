import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { bookHref, instructionHref, proHref } from "@/components/mcg-3/instruction/data";
import { p3Story } from "@/stories/mcg-3/p3-story-kit";

/**
 * "Instruction / Book a Lesson" — Flow A of the MCG Academy build.
 *
 * These stories now show **Prototype 3's updated booking flow (ported from the Crane MCG
 * prototype)**: each one opens the P3 Instruction screens at the URL for that state, and from
 * there every screen is clickable. The story ids are the ones Flow A always had, so links from
 * Linear still land on the matching step. (The original Flow A components still power
 * Prototype 1's app; only these stories moved.)
 *
 * The flow is still **service-first** — you pick what you want before who teaches it — and every
 * step is a URL (`/instruction`, `/instruction/service/:id`, `/instruction/book?coach&service&course`
 * + `step`, `date`, `time`, `players`, `pay`, `extras`). Payment is always taken at booking;
 * golfers can cancel under the 24-hour rule but not reschedule.
 *
 * Numbered stories are steps in the sequence. Named stories are branches.
 */
const meta: Meta = {
    title: "Prototypes/Instruction/Book a Lesson",
    id: "instruction-book-a-lesson",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const MK = { coach: "mike-kenny", service: "private-45", course: "falls-road" };
/** Mike Kenny's 9:00 AM opening today (Fri Oct 9, 2026) at Falls Road. */
const AT = { ...MK, date: "2026-10-09", time: "09:00" };

/* ---------------------------- the sequence ---------------------------- */

/** One catalog — privates, clinics, junior camps, junior league and Op 36 — as format tiles and short result sections, with filters behind a button. */
export const Catalog: Story = p3Story(instructionHref(), "The Instruction hub: format tiles, the compact search · course · Filters bar, and short result sections.", {}, "1. Lessons & Clinics");

/** Every instructor who teaches the 45-minute private at Falls Road, each with their own price and next opening — plus "Any available instructor". */
export const ChooseInstructor: Story = p3Story("/instruction/service/private-45?course=falls-road", "The private lesson's service page: instructors with Book links and the group-size price table.", {}, "2. Choose an Instructor");

/** One instructor's week, then the day split into Morning / Afternoon / Evening; booked and blocked times stay visible. */
export const PickATime: Story = p3Story(bookHref(MK), "Date & time for Mike Kenny's 45-minute private at Falls Road.", {}, "3. Pick a Time");

/** Party size, golfer cards, "What would you like to work on?", extras and a note. */
export const LessonDetails: Story = p3Story(bookHref({ ...AT, players: 1, step: "details" }), "The Details step for one golfer.", {}, "4. Lesson Details");

/** Card on file, charged at booking. */
export const CheckoutPayNow: Story = p3Story(bookHref({ ...AT, step: "payment" }), "Payment with the saved card — always paid at booking.", {}, "5. Checkout — Pay Now");

/** The same payment step with a lesson credit: it covers the lesson, the $4 facility fee still goes on the card. */
export const CheckoutUseCredit: Story = p3Story(`${bookHref({ ...AT, step: "payment" })}&pay=credit`, "Payment with Mike Kenny's lesson credit selected (`pay=credit`).", {}, "6. Checkout — Use a Credit");

/** The confirmation both the golfer and the instructor work from. */
export const Confirmation: Story = p3Story(
    "/instruction/review?coach=mike-kenny&service=private-45&course=falls-road&date=2026-10-09&time=09:00&players=1&step=booked&confirmation=MCG-48213&pay=credit&credit=1",
    "“You're booked” with a lesson credit: summary, credits left with Mike Kenny, add to calendar, the 24-hour cancellation window.",
    {},
    "7. Confirmation",
);

/* ------------------------------ branches ------------------------------ */

/** Every open slot at the course across every instructor, merged onto one board, each labelled with whoever is free. */
export const AnyAvailableInstructor: Story = p3Story(bookHref({ ...MK, coach: "any", course: "laytonsville" }), "Any available instructor at Laytonsville.", {}, "Any Available Instructor");

/** A multi-week Academy clinic, registered through the same booking page (sessions → participants → payment). */
export const GroupProgram: Story = p3Story(bookHref({ coach: "mike-kenny", service: "clinic-adult-l2", course: "falls-road" }), "Registering for the Adult Level 2 clinic.", {}, "Group Program");

/** A program at capacity: full turns into a waitlist rather than a dead card. */
export const ProgramFullWaitlist: Story = p3Story(
    bookHref({ coach: "brent-wilkerson", service: "clinic-wedge", course: "needwood", step: "waitlist" }),
    "The Wedge Matrix Workshop is full: join its waitlist.",
    {},
    "Program Full — Waitlist",
);

/** Nothing open on the day asked for: the next opening and Join the waitlist instead of a back button. */
export const NoAvailability: Story = p3Story(
    bookHref({ coach: "mike-kenny", service: "junior-30", course: "falls-road", date: "2026-10-09" }),
    "A junior private (weekends only) on a Friday: nothing open that day, so the board offers the next opening and the waitlist.",
    {},
    "No Availability",
);

/** The waitlist itself — dates, preferred times of day and days of the week. */
export const JoinTheWaitlist: Story = p3Story(bookHref({ ...MK, step: "waitlist" }), "Mike Kenny's waitlist.", {}, "Join the Waitlist");

/**
 * Every instructor at one course on one board for one day. P3 has no separate facility calendar;
 * the closest state is the any-instructor board, where each open time names who is free.
 */
export const FacilityCalendar: Story = p3Story(bookHref({ ...MK, coach: "any" }), "The any-instructor board at Falls Road (P3's closest state to a facility calendar).", {}, "Facility Calendar");

/** Doug teaches at Laytonsville, Little Bennett and Falls Road: one menu, course chips, a calendar at each. */
export const CrossCourseInstructor: Story = p3Story(proHref("doug-hamilton"), "Doug Hamilton's profile: three home courses and his own group-size pricing.", {}, "Cross-Course Instructor");

/** Three golfers on one lesson: the total climbs slowly and the per-golfer cost drops. */
export const MultiPersonLesson: Story = p3Story(
    bookHref({ coach: "doug-hamilton", service: "private-45", course: "falls-road", date: "2026-10-09", time: "10:30", players: 3, step: "details" }),
    "Doug Hamilton's 45-minute private for three golfers (`players=3`).",
    {},
    "3-Person Lesson",
);

/** A junior private (ages 7–17, weekends only): the lesson opens on a child, with date of birth checked. */
export const JuniorLesson: Story = p3Story(
    bookHref({ coach: "kate-schanuel", service: "junior-30", course: "falls-road", date: "2026-10-10", time: "09:00", players: 2, step: "details" }),
    "Kate Schanuel's 30-minute junior private at Falls Road on Saturday, Oct 10, for two juniors: the lesson opens on a child, with each date of birth checked.",
    {},
    "Junior Lesson",
);

/**
 * Sign-up rules: a golfer outside the age range is blocked inline with the reason. The junior
 * private's sample golfers are all 7–17, and golfers can't be set through the URL, so this opens
 * the closest state that blocks on age — two participants for First Swings (ages 7–10), where one
 * sample child is 11.
 */
export const JuniorLessonIneligible: Story = p3Story(
    bookHref({ coach: "kate-schanuel", service: "clinic-junior-first", course: "crossvines", players: 2, step: "details" }),
    "First Swings (ages 7–10) for two juniors: the 11-year-old is outside the range, so registration is blocked with the reason.",
    {},
    "Junior Lesson — golfer outside the age range",
);
