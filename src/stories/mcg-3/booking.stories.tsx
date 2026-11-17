import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { bookHref, clinicById, proHref, reviewHref, TODAY_ISO } from "@/components/mcg-3/instruction/data";
import { p3Story } from "./p3-story-kit";

/**
 * Booking (`/instruction/book`) and its confirmations (`/instruction/review`) — Prototype 3's
 * Square-style flow as rebuilt in Crane and ported back: the summary rail (instructor, lesson,
 * course, date/time, golfers, price, guardrails) beside each step — Date & time (date strip +
 * Morning / Afternoon / Evening board, waitlist), Details (golfers, questions, extras, note),
 * Sign in (guests only), Payment (lesson credit, saved cards, promo — always paid at booking) and
 * Review & confirm. Group programs register instead (sessions, participants with age rules, spots
 * left, waitlist when full). Golfers can cancel under the 24-hour rule but not reschedule.
 *
 * Every step is in the URL — `step`, `date`, `time`, `players` (+ `extras`, `pay`, `promo`,
 * `sessions`) — so each story below is a deep link. Stories are signed in as the sample golfer
 * Morgan Hale unless they say otherwise.
 */
const meta: Meta = {
    title: "Prototypes/MCG Prototype 3/Booking",
    id: "mcg-prototype-3-booking",
    parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const MK = { coach: "mike-kenny", service: "private-45", course: "falls-road" };
/** Mike Kenny's 9:00 AM opening today (Fri Oct 9) at Falls Road. */
const AT = { ...MK, date: "2026-10-09", time: "09:00" };
const book = (patch: Partial<Parameters<typeof bookHref>[0]> = {}, extra = "") => `${bookHref({ ...MK, ...patch })}${extra}`;
const REVIEW = "/instruction/review?coach=mike-kenny&service=private-45&course=falls-road";

/* ---- Private lesson ---------------------------------------------------- */

export const PickALessonFirst: Story = p3Story("/instruction/book", "Opened with no lesson chosen: choose an instructor, or browse clinics instead.", {}, "Nothing picked");
export const TimeBoard: Story = p3Story(
    book(),
    "Date & time for Mike Kenny's 45-minute private at Falls Road: Lesson · Course · Golfers bar, a week of days with open counts, booked and unavailable times struck through.",
    {},
    "Time board",
);
export const TimeSelected: Story = p3Story(book({ date: AT.date, time: AT.time }), "A time picked (from `?date=&time=`): the summary fills in and Continue lights up.", {}, "Time selected");
export const AnyInstructor: Story = p3Story(
    bookHref({ coach: "any", service: "private-60", course: "needwood" }),
    "“Any available instructor” at Needwood: every pro on one board, each open time tagged with who is free.",
    {},
    "Any instructor",
);
export const DayFull: Story = p3Story(
    bookHref({ coach: "mike-kenny", service: "junior-30", course: "falls-road", date: "2026-10-09" }),
    "A junior private on a Friday — weekends only, so nothing is open: the next opening and Join the waitlist instead of a dead end.",
    {},
    "Nothing open that day",
);
export const Waitlist: Story = p3Story(book({ step: "waitlist" }), "The waitlist: date range, times of day, days of the week, where to reach you. Nothing is charged until a slot is accepted.");
export const Details: Story = p3Story(
    book({ ...AT, players: 2, step: "details" }),
    "Details: golfers (price for the whole group), golfer 2 pre-filled from a sample guest, “What would you like to work on?”, extras and a note.",
);
export const SignInGate: Story = p3Story(
    book({ ...AT, step: "payment" }),
    "Signed out: payment needs an account, so the step becomes a sign-in. Nothing chosen is lost.",
    { signedIn: false },
    "Sign-in gate (guest)",
);
export const PaymentCard: Story = p3Story(book({ ...AT, step: "payment" }), "Payment with the saved card on file — always paid at booking.", {}, "Payment · card");
export const PaymentWithCredit: Story = p3Story(
    book({ ...AT, step: "payment" }, "&pay=credit"),
    "Payment with a lesson credit (Mike Kenny's 5-pack): the credit covers the lesson; the $4 facility fee still goes on the card on file.",
    {},
    "Payment · lesson credit",
);
export const PaymentWithPromo: Story = p3Story(
    book({ ...AT, step: "payment" }, "&promo=WELCOME10&extras=range-bucket"),
    "Card payment with WELCOME10 applied (10% off the lesson) and a range bucket extra.",
    {},
    "Payment · promo code",
);
export const ReviewAndConfirm: Story = p3Story(
    book({ ...AT, step: "confirm" }, "&pay=credit&extras=video-review"),
    "Review & confirm: lesson, golfers, extras and payment, each with Change. Confirm books it, spends the credit and goes to the confirmation.",
    {},
    "Review & confirm",
);

/* ---- Group programs ------------------------------------------------------ */

export const GroupProgram: Story = p3Story(
    bookHref({ coach: "mike-kenny", service: "clinic-adult-l2", course: "falls-road" }),
    "Registering for Mike Kenny's Adult Level 2 clinic: banner, instructor, schedule, spots left, every session, who it's for and what to bring, then participants.",
    {},
    "Program registration",
);
export const GroupParticipants: Story = p3Story(
    bookHref({ coach: "kate-schanuel", service: "clinic-junior-first", course: "crossvines", players: 2, step: "details" }),
    "A junior program (ages 7–10): each participant's date of birth is checked against the first session — one sample child is too old and the registration is blocked with the reason.",
    {},
    "Program participants (age rules)",
);
const SHORT_GAME_DATES = (clinicById("short-game-school-needwood")?.sessionDates ?? [])
    .filter((d) => d >= TODAY_ISO)
    .slice(0, 3)
    .join(",");
export const PickYourDates: Story = p3Story(
    `${bookHref({ coach: "any", service: "short-game-school-needwood", course: "needwood" })}&sessions=${SHORT_GAME_DATES}`,
    "A county clinic sold by the session: three dates chosen (`sessions=`), so Buy 3 get 50% off applies to the whole registration.",
    {},
    "County clinic · pick your dates",
);
export const CountyClinicRegistration: Story = p3Story(
    bookHref({ coach: "any", service: "ggr-northwest", course: "northwest" }),
    "A county clinic registration (Get Golf Ready at Northwest): all five dates come with it.",
    {},
    "County clinic registration",
);
export const ProgramFull: Story = p3Story(
    bookHref({ coach: "brent-wilkerson", service: "clinic-wedge", course: "needwood", step: "waitlist" }),
    "The Wedge Matrix Workshop is full: join the program's waitlist instead.",
    {},
    "Program full → waitlist",
);

/* ---- Confirmations --------------------------------------------------------- */

export const Confirmation: Story = p3Story(
    `${REVIEW}&date=2026-10-09&time=09:00&players=1&step=booked&confirmation=MCG-48213&pay=pm-amex&extras=video-review`,
    "“You're booked”: summary and payment, add to calendar, what to bring, the 24-hour cancellation window (cancel, no golfer reschedule), and the pack prompt.",
    {},
    "Confirmation · booked",
);
export const CreditConfirmation: Story = p3Story(
    `${REVIEW}&date=2026-10-09&time=09:00&players=1&step=booked&confirmation=MCG-48213&pay=credit&credit=1`,
    "Booked with a lesson credit: the credit covers the lesson, the $4 facility fee goes on the card on file, and the credits left with Mike Kenny.",
    {},
    "Confirmation · credit",
);
export const WaitlistConfirmation: Story = p3Story(
    `${REVIEW}&date=2026-10-09&players=1&step=waitlisted&confirmation=WL-10421&window=Oct 9 – Nov 6 · evening · Mon, Wed`,
    "On the waitlist: the window asked for, what happens next, leave the waitlist.",
    {},
    "Confirmation · waitlisted",
);
export const RegistrationConfirmation: Story = p3Story(
    "/instruction/review?coach=mike-kenny&service=clinic-adult-l2&course=falls-road&players=1&step=registered&confirmation=REG-20931&paid=189.00&pay=pm-amex",
    "Registered for a group program: every session date, what to bring and what's provided, cancellation.",
    {},
    "Confirmation · registered",
);
export const RateALesson: Story = p3Story(
    reviewHref({ coachId: "mike-kenny", serviceId: "private-45", courseSlug: "falls-road", date: "2026-10-02" }),
    "Without a confirmation, `/instruction/review` is the post-lesson review: verified, initials only, moderated.",
    {},
    "Review a lesson",
);

/* ---- End to end -------------------------------------------------------------- */

export const Flow: Story = p3Story(
    proHref("mike-kenny"),
    "Clickable: start on Mike Kenny's profile → Book a lesson → pick a time → details → payment (try the credit) → confirm → the confirmation.",
);
