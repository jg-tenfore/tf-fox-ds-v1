import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { creditsHref, packagesHref } from "@/components/mcg-3/instruction/data";
import { p3Story } from "./p3-story-kit";

/**
 * Lesson packages, monthly plans and the lesson-credit wallet — Prototype 3's Packages & Credits,
 * as rebuilt in Crane and ported back. Every state is a URL on `/instruction/packages`
 * (`?lessons=`, `?coach=`, `?step=plans`, `?pack=<id>&step=checkout|done`) or `/instruction/credits`
 * (`?bought=`, `?demo=`). Credits expire one year after purchase, shown as a real date per pack.
 * Buying a pack calls the Instruction store's `buyPack`, so the new balance is in My credits
 * straight away (within one story).
 */
const meta: Meta = {
    title: "Prototypes/MCG Prototype 3/Packages & credits",
    id: "mcg-prototype-3-packages-credits",
    parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const PACK = "mike-kenny--pack-5";
const PLAN = "mike-kenny--sub-2";

export const Packages: Story = p3Story(packagesHref(), "The catalog: packs from seven instructors, filter chips, Save / Best value badges, credit dots, course chips, terms and price per lesson.", {}, "Packages");
export const FilteredTenLessons: Story = p3Story(packagesHref({ extra: { lessons: "10" } }), "`?lessons=10` — only the 10-lesson packs (Mike Kenny, Doug Hamilton).", {}, "Filtered to 10 lessons");
export const OneInstructorsPacks: Story = p3Story(packagesHref({ coach: "doug-hamilton" }), "`?coach=doug-hamilton` — “Showing Doug Hamilton's packs · Show all”, plus his monthly plan.", {}, "One instructor's packs");
export const PackDetail: Story = p3Story(packagesHref({ pack: PACK }), "What's included, how it works, restrictions, the fine print as fields (expiry date), and the price with its saving.", {}, "Pack detail");
export const AssignedPack: Story = p3Story(
    packagesHref({ pack: "doug-hamilton--thrive-import" }),
    "Credits carried over from Thrive: terms visible, never for sale — no price, no Buy.",
    {},
    "Assigned pack (Thrive import)",
);
export const Checkout: Story = p3Story(packagesHref({ pack: PACK, step: "checkout" }), "Contact, saved cards, what you're agreeing to, order summary, Pay.", {}, "Checkout");
export const CheckoutSignedOut: Story = p3Story(
    packagesHref({ pack: PACK, step: "checkout" }),
    "An account is required: sign in or create one, then come back to this checkout.",
    { signedIn: false },
    "Checkout · signed out",
);
export const Purchased: Story = p3Story(
    packagesHref({ pack: PACK, step: "done" }),
    "“5 lessons are yours” — credits added to the wallet; Book a lesson with these credits goes to Booking for Mike Kenny.",
    {},
    "Purchased",
);
export const MonthlyPlans: Story = p3Story(packagesHref({ step: "plans" }), "`?step=plans` — the monthly plans, marked Concept (“Model C”).", {}, "Monthly plans");
export const StartAPlan: Story = p3Story(packagesHref({ pack: PLAN }), "A plan's detail: what you get, how billing works, first billing date and auto-renew (both in the URL), then checkout.", {}, "Start a plan");
export const PlanCheckout: Story = p3Story(packagesHref({ pack: PLAN, step: "checkout" }), "The same checkout for a plan: charged on the first billing date, then monthly.", {}, "Plan checkout");
export const PlanStarted: Story = p3Story(packagesHref({ pack: PLAN, step: "done" }), "The plan is set up: start date, renewal notice, Book your first lesson.", {}, "Plan started");
export const MyCredits: Story = p3Story(
    creditsHref(),
    "The wallet: totals, a balance per instructor (Mike Kenny's pack, Doug Hamilton's Thrive import) with expiry dates, the loyalty-discount concept, how credits work.",
    {},
    "My credits",
);
export const JustBought: Story = p3Story(
    creditsHref({ extra: { bought: PACK } }),
    "`?bought=<pack>` — the confirmation's View my credits: “5 credits added” notice. (A story starts with a fresh store, so the new balance itself isn't there.)",
    {},
    "Credits after buying a pack",
);
export const AfterABooking: Story = p3Story(creditsHref({ extra: { demo: "after-booking" } }), "One credit spent with Mike Kenny: 4 of 5 left, with the redemption in the history.", {}, "Credits after a booking");
export const SpentAndExpired: Story = p3Story(
    creditsHref({ extra: { demo: "spent-expired" } }),
    "A used-up pack (buy another) and one that expired with two lessons on it (ask the Academy), plus MCG's open policy question.",
    {},
    "Spent & expired",
);
export const NoCredits: Story = p3Story(creditsHref({ extra: { demo: "empty" } }), "Empty wallet: Browse packages / Monthly plans and how credits work.", {}, "No credits");
