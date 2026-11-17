import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { bookHref, creditsHref, packagesHref } from "@/components/mcg-3/instruction/data";
import { p3Story } from "@/stories/mcg-3/p3-story-kit";

/**
 * "Instruction / Packages & Credits" — Flow B of the MCG Academy build.
 *
 * These stories now show **Prototype 3's updated Packages & Credits (ported from the Crane MCG
 * prototype)**, each opened at the URL for that state. The story ids are the ones Flow B always
 * had, so links from Linear still land on the matching state. (The original Flow B components
 * still power Prototype 1's app; only these stories moved.)
 *
 * Model A — the credit book MCG runs today — is the flow: packs per instructor, checkout, credits
 * in the wallet with an expiry date one year after purchase, redeemed at booking. Model B (the
 * volume discount) lives on as the loyalty-discount concept in My credits, and Model C (a
 * monthly plan) as the plans marked Concept.
 */
const meta: Meta = {
    title: "Prototypes/Instruction/Packages & Credits",
    id: "instruction-packages-credits",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const PACK = "mike-kenny--pack-5";

/* -------------------------- Model A — credit book -------------------------- */

/** Packs shown per instructor, because rates are tied to people and therefore packs are too. */
export const BrowsePackages: Story = p3Story(packagesHref(), "The packages catalog.", {}, "1. Browse Packages");

/** The pack as a product: what's included, how it works, restrictions, the fine print as fields. */
export const PackageDetails: Story = p3Story(packagesHref({ pack: PACK }), "Mike Kenny's 5-lesson pack.", {}, "2. Package Details");

/** Package purchase, with the credit's terms restated at the point of payment. */
export const BuyCheckout: Story = p3Story(packagesHref({ pack: PACK, step: "checkout" }), "Checkout for the pack (signed in as the sample golfer).", {}, "3. Buy — Checkout");

/** Credits issued, expiry stated, and an immediate call to book the first lesson. */
export const PurchaseConfirmation: Story = p3Story(packagesHref({ pack: PACK, step: "done" }), "“5 lessons are yours”.", {}, "4. Purchase Confirmation");

/** Credits itemized by instructor, each with its own expiry — also how the Academy reports what it owes in lessons. */
export const WalletCreditBalance: Story = p3Story(creditsHref(), "My lesson credits.", {}, "5. Wallet — Credit Balance");

/** Spending a credit at booking: the credit covers the lesson, the facility fee still goes on the card. */
export const RedeemAtBooking: Story = p3Story(
    `${bookHref({ coach: "mike-kenny", service: "private-45", course: "falls-road", date: "2026-10-09", time: "09:00", step: "payment" })}&pay=credit`,
    "Booking payment with Mike Kenny's credit selected (`pay=credit`).",
    {},
    "6. Redeem at Booking",
);

/** Four of five remaining, with the redemption history. */
export const BalanceAfterRedemption: Story = p3Story(creditsHref({ extra: { demo: "after-booking" } }), "My credits one lesson later (`demo=after-booking`).", {}, "7. Balance After Redemption");

/* ------------------------ Model B — volume discount ------------------------ */

/** Model B survives as the loyalty-discount concept shown in My credits (no balance, nothing owed). */
export const ModelBDiscountProgress: Story = p3Story(creditsHref(), "My credits, where the loyalty-discount concept (Model B) sits beside the balances.", {}, "Model B — Discount Progress");

/**
 * P3 has no separate "discount earned" state; the closest is the same concept in My credits after
 * a lesson has been taken.
 */
export const ModelBDiscountEarned: Story = p3Story(creditsHref({ extra: { demo: "after-booking" } }), "My credits after a booking, with the loyalty-discount concept.", {}, "Model B — Discount Earned");

/* -------------------------- Model C — subscription -------------------------- */

/** A monthly plan: start date, auto-renew, renewal notice. Nothing prepaid beyond the current cycle. */
export const ModelCMonthlyPlan: Story = p3Story(packagesHref({ pack: "mike-kenny--sub-2" }), "Mike Kenny's 2-lessons-a-month plan (Concept).", {}, "Model C — Monthly Plan");

/* -------------------------------- edge states ------------------------------ */

/** Credits imported from Thrive: visible to the golfer holding them, never for sale. */
export const AssignedPackage: Story = p3Story(packagesHref({ pack: "doug-hamilton--thrive-import" }), "Doug Hamilton's Thrive import.", {}, "Assigned Package");

/** A used-up pack and one that expired with lessons still on it — the two states the Academy fields calls about. */
export const ExpiredZeroBalance: Story = p3Story(creditsHref({ extra: { demo: "spent-expired" } }), "My credits with a spent and an expired balance.", {}, "Expired / Zero Balance");
