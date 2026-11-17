import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { bookHref, instructionHref, serviceHref } from "@/components/mcg-3/instruction/data";
import { p3Story } from "./p3-story-kit";

/**
 * "MCG Prototype 3 / Instruction" — the original walk through Prototype 3's Instruction flow
 * (search → choose an instructor → choose a time → checkout), now showing **Prototype 3's updated
 * flow, ported from the Crane MCG prototype**: a lighter hub (format tiles, a compact search ·
 * course · Filters bar, filters behind a button), service pages with every instructor and the
 * group-size price table, a step-railed booking with the summary rail, and payment at booking.
 *
 * Every story is a URL on the P3 app (`/tf-fox-ds-v1/prototype-3/`) mounted in an in-memory router,
 * so it stays clickable. Instruction's "today" is Fri Oct 9, 2026. Story ids are unchanged (Linear
 * links to them); the newer states have their own stories under Instruction hub, Lessons & programs,
 * Instructor profile, Booking and Packages & credits.
 */
const meta: Meta = {
    title: "Prototypes/MCG Prototype 3/Instruction",
    id: "mcg-prototype-3-instruction",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const BRENT = { coach: "brent-wilkerson", service: "private-45", course: "falls-road" };
/** Brent's first opening: 9:00 AM today at Falls Road. */
const AT = { ...BRENT, date: "2026-10-09", time: "09:00" };

/* ---- Step 1: one search that gathers everything --------------------- */

export const Search: Story = p3Story(instructionHref(), "The hub: header, Services | Instructors, the compact search · course · Filters bar, the format tiles and short result sections.", {}, "1. Search — the Instruction hub");

export const SearchMultiCourse: Story = p3Story(
    instructionHref({ courses: ["falls-road", "needwood"], formats: ["clinic", "junior-league"], days: [2] }),
    "Two courses, two formats, Tuesdays — the filters are all in the URL, so the hub lands filtered with a one-line summary and removable chips.",
    {},
    "1b. Search — two courses, two formats, Tuesdays",
);

export const SearchDateRange: Story = p3Story(
    instructionHref({ formats: ["junior-camp", "junior-league", "op36"], from: "2026-10-12", to: "2026-11-30" }),
    "Junior programs between Oct 12 and Nov 30, 2026.",
    {},
    "1c. Search — a date range, juniors only",
);

export const SearchByInstructor: Story = p3Story(instructionHref({ view: "instructors", courses: ["falls-road"] }), "The Instructors tab narrowed to Falls Road.", {}, "1d. Search — browsing by instructor");

export const SearchEmpty: Story = p3Story(
    instructionHref({ courses: ["hampshire-greens"], formats: ["op36"], days: [1] }),
    "Op 36 at Hampshire Greens on Mondays: nothing matches, so the empty state offers Clear filters and Edit filters.",
    {},
    "1e. Search — nothing matches",
);

/* ---- Step 2: choose an instructor ----------------------------------- */

export const ChooseInstructor: Story = p3Story(
    serviceHref("private-45", "falls-road"),
    "The 45-minute private at Falls Road: every instructor who teaches it with their price and next opening, Book each, Any available instructor, and the group-size price table.",
    {},
    "2. Choose an instructor (or any)",
);

/* ---- Step 3: the time board ----------------------------------------- */

export const ChooseTime: Story = p3Story(
    bookHref(BRENT),
    "Date & time for Brent Wilkerson's 45-minute private at Falls Road: a week of days with open counts, then the Morning / Afternoon / Evening board; booked and unavailable times struck through.",
    {},
    "3. Choose a time",
);

export const ChooseTimeAnyInstructor: Story = p3Story(
    bookHref({ ...BRENT, coach: "any" }),
    "Any available instructor at Falls Road: every pro on one board, each open time tagged with who is free.",
    {},
    "3b. Choose a time — any available instructor",
);

export const Waitlist: Story = p3Story(bookHref({ ...BRENT, step: "waitlist" }), "The waitlist: date range, times of day, days of the week, where to reach you.", {}, "3c. Waitlist — dates, times of day, days of the week");

/* ---- Step 4: payment ------------------------------------------------- */

export const Checkout: Story = p3Story(
    bookHref({ ...AT, step: "payment" }),
    "Payment, signed in as the sample golfer: saved cards (and a lesson credit when one applies), promo code, paid at booking. Signed out, this step becomes a sign-in — see Booking › Sign-in gate.",
    {},
    "4. Checkout — payment at booking",
);

export const CheckoutWithExtras: Story = p3Story(
    `${bookHref({ ...AT, step: "payment" })}&extras=video-review,range-bucket`,
    "The same payment step with two lesson extras (`extras=video-review,range-bucket`) in the order summary.",
    {},
    "4b. Checkout — with lesson extras",
);
