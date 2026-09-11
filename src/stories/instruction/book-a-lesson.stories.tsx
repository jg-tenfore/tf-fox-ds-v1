import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LessonBookingFlow } from "@/components/instruction/lesson-booking-flow";

/**
 * "Instruction / Book a Lesson" — Flow A of the MCG Academy build.
 *
 * One component, `LessonBookingFlow`, covering the whole golfer-facing path from
 * browsing the catalog to a booked lesson. Each story opens the flow on a different
 * state; from there every screen is clickable, so a reviewer can trace the booking end
 * to end or jump straight to the state they care about.
 *
 * The flow is **service-first** — you pick what you want before who teaches it. That's
 * the order the Sagamore prototype argues for, and the only one that can carry a group
 * clinic (fixed roster) and a private lesson (open calendar) through the same steps.
 *
 * Numbered stories are steps in the sequence. Named stories are branches.
 */
const meta: Meta<typeof LessonBookingFlow> = {
    title: "Instruction/Book a Lesson",
    component: LessonBookingFlow,
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof LessonBookingFlow>;

/* ---------------------------- the sequence ---------------------------- */

/**
 * One catalog holding privates, playing lessons, multi-week clinics and junior camps,
 * filtered by chips. Privates and programs render as the same card because they're the
 * same object with different capacity — the structural change that lets lessons be
 * built into the clinics system rather than beside it.
 */
export const Catalog: Story = {
    name: "1. Lessons & Clinics",
    args: { step: "catalog" },
};

/**
 * Instructors for the chosen lesson, priced with their own adjustment on top of the
 * academy rate. "Any available instructor" leads — a first-class choice rather than a
 * fallback, so nobody has to pick a person before they pick a time.
 */
export const ChooseInstructor: Story = {
    name: "2. Choose an Instructor",
    args: { step: "instructor", serviceId: "private-45" },
};

/**
 * One instructor's day, split into Morning / Afternoon / Evening rather than a flat
 * wall of cells, with the lesson's guardrails applied. Booked and blocked times stay
 * visible so the day reads honestly.
 */
export const PickATime: Story = {
    name: "3. Pick a Time",
    args: { step: "time", serviceId: "private-45", coachId: "mike-kenny" },
};

/**
 * Party size as an option on one service rather than five separate ones — the total
 * climbs slowly because the instructor's hour is the same either way, so each golfer
 * pays less. Participant cards follow the Tee Time Details pattern.
 */
export const LessonDetails: Story = {
    name: "4. Lesson Details",
    args: { step: "details", serviceId: "private-45", coachId: "mike-kenny", players: 1 },
};

/**
 * Card capture and charge at booking — the behavior MCG wants for anything booked
 * online. The saved card is what later lets an instructor book and charge a student
 * directly, which is the thing CoachNow shipped without.
 */
export const CheckoutPayNow: Story = {
    name: "5. Checkout — Pay Now",
    args: { step: "checkout", serviceId: "private-45", coachId: "mike-kenny", payWith: "card" },
};

/**
 * The same checkout with a lesson credit applied. This is the seam where Packages &
 * Credits meets booking: the credit covers the lesson, the facility fee is still
 * charged, and the golfer sees what will be left.
 */
export const CheckoutUseCredit: Story = {
    name: "6. Checkout — Use a Credit",
    args: { step: "checkout", serviceId: "private-45", coachId: "mike-kenny", payWith: "credit" },
};

/**
 * The receipt both the golfer and the instructor work from — who, when, where, what was
 * charged, what credits remain, and a cross-sell into the same instructor's programs.
 */
export const Confirmation: Story = {
    name: "7. Confirmation",
    args: { step: "confirmation", serviceId: "private-45", coachId: "mike-kenny", payWith: "credit" },
};

/* ------------------------------ branches ------------------------------ */

/**
 * The fix for the CoachNow dead end, applied at the front of the flow. Every open slot
 * at the course across every instructor, merged onto one board, each time labelled with
 * whoever is free — so the golfer still knows who they're getting before they pay.
 */
export const AnyAvailableInstructor: Story = {
    name: "Any Available Instructor",
    args: { step: "time", serviceId: "private-45", coachId: "any", courseSlug: "laytonsville" },
};

/**
 * A six-week clinic booked through the same flow as a private. No instructor step and
 * no calendar — a program has a fixed schedule and a roster, so capacity replaces
 * availability and the rail collapses to three steps.
 */
export const GroupProgram: Story = {
    name: "Group Program",
    args: { step: "details", serviceId: "clinic-adult-l2" },
};

/**
 * A program at capacity. Full turns into a waitlist rather than a dead card — the
 * golfer states what they want and keeps their place until it opens.
 */
export const ProgramFullWaitlist: Story = {
    name: "Program Full — Waitlist",
    args: { step: "waitlist", serviceId: "clinic-wedge" },
};

/**
 * Nobody free all day. Three ways out instead of a back button: widen to any
 * instructor, join the waitlist, or try tomorrow.
 */
export const NoAvailability: Story = {
    name: "No Availability",
    args: { step: "time", serviceId: "private-45", coachId: "mike-kenny", fullyBooked: true },
};

/**
 * The waitlist itself — preferred daypart, preferred days, and a nudge showing how many
 * slots widening to any instructor would put in front of you.
 */
export const JoinTheWaitlist: Story = {
    name: "Join the Waitlist",
    args: { step: "waitlist", serviceId: "private-45", coachId: "mike-kenny" },
};

/**
 * Every instructor at one course in parallel columns for one day. The CoachNow feature
 * MCG pays for and has never switched on, and the shape a Pro Shop counter view would
 * later borrow.
 */
export const FacilityCalendar: Story = {
    name: "Facility Calendar",
    args: { step: "facility", courseSlug: "falls-road" },
};

/**
 * Doug teaches at Laytonsville, Little Bennett and Falls Road. One menu, a course
 * selector, and availability that follows the course — instead of CoachNow's nine
 * duplicated menu items.
 */
export const CrossCourseInstructor: Story = {
    name: "Cross-Course Instructor",
    args: { step: "profile", coachId: "doug-hamilton", highlightCourseSwitcher: true },
};

/**
 * Three golfers on one lesson: the total climbs slowly, the per-golfer cost drops
 * sharply, and one person pays. The multi-person case MCG already sells but can't
 * book cleanly today.
 */
export const MultiPersonLesson: Story = {
    name: "3-Person Lesson",
    args: { step: "details", serviceId: "private-45", coachId: "doug-hamilton", players: 3 },
};

/**
 * A junior private, which caps at two golfers and is offered weekends only. The
 * guardrail belongs to the service, so it narrows the calendar rather than the other
 * way round.
 */
export const JuniorLesson: Story = {
    name: "Junior Lesson",
    args: { step: "details", serviceId: "junior-30", coachId: "kate-schanuel", players: 2 },
};
