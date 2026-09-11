import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LessonPackagesFlow } from "@/components/instruction/lesson-packages-flow";

/**
 * "Instruction / Packages & Credits" — Flow B of the MCG Academy build.
 *
 * The part MCG called the most complex piece of the whole thing: money taken today for
 * lessons owed later, tracked per instructor because rates are set per instructor.
 *
 * All three candidate models are built. Model A (stories 1–7) is the credit book MCG
 * runs today — a balance created on purchase and relieved lesson by lesson, which is
 * what makes per-instructor liability reportable. Model B is the volume discount raised
 * on the call: no pack, no balance, and the fifth lesson discounted once four are
 * taken. Model C is a monthly plan, which keeps the recurring revenue Model B gives up
 * without accruing the liability Model A does.
 */
const meta: Meta<typeof LessonPackagesFlow> = {
    title: "Instruction/Packages & Credits",
    component: LessonPackagesFlow,
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof LessonPackagesFlow>;

/* -------------------------- Model A — credit book -------------------------- */

/**
 * Packs shown per instructor, because rates are tied to people and therefore packs are
 * too. Grouped so the fragmentation reads as a choice rather than an accident.
 */
export const BrowsePackages: Story = {
    name: "1. Browse Packages",
    args: { step: "browse" },
};

/**
 * The pack as a product: how it works, what's included, and what the restrictions are —
 * the three copy blocks from the Sagamore prototype. Expiry and transferability are now
 * fields rather than prose, which turns most of MCG's open policy questions into
 * settings. Only "what if the instructor leaves" is still unanswered.
 */
export const PackageDetails: Story = {
    name: "2. Package Details",
    args: { step: "details", packageId: "mike-kenny--pack-5" },
};

/**
 * Package purchase on the Shop Checkout pattern, with the credit's terms restated at
 * the point of payment.
 */
export const BuyCheckout: Story = {
    name: "3. Buy — Checkout",
    args: { step: "checkout", packageId: "mike-kenny--pack-5" },
};

/**
 * Credits issued, expiry stated, and an immediate call to book the first lesson — the
 * moment a pack turns into a scheduled commitment instead of a balance that drifts.
 */
export const PurchaseConfirmation: Story = {
    name: "4. Purchase Confirmation",
    args: { step: "confirmation", packageId: "mike-kenny--pack-5" },
};

/**
 * Credits in the MCG wallet alongside gift cards and punch cards, itemized by
 * instructor with their own expiry. One balance per instructor is also exactly how the
 * Academy reports what it still owes in lessons.
 */
export const WalletCreditBalance: Story = {
    name: "5. Wallet — Credit Balance",
    args: { step: "wallet" },
};

/**
 * Picking which credit to spend when a golfer holds packs from two instructors —
 * because a credit is tied to the person who sold it, choosing the balance also
 * chooses who teaches.
 */
export const RedeemAtBooking: Story = {
    name: "6. Redeem at Booking",
    args: { step: "redeem" },
};

/**
 * Four of five remaining, with the relief history. The golfer view and the Academy's
 * liability view are the same ledger read from opposite ends.
 */
export const BalanceAfterRedemption: Story = {
    name: "7. Balance After Redemption",
    args: { step: "after" },
};

/* ------------------------ Model B — volume discount ------------------------ */

/**
 * The grocery-store mechanic from the call. No balance and nothing owed — a meter
 * showing three of four lessons taken and what the next one unlocks.
 */
export const ModelBDiscountProgress: Story = {
    name: "Model B — Discount Progress",
    args: { step: "volume-progress" },
};

/**
 * The payoff: the fifth lesson at half price, applied automatically at checkout with
 * nothing to redeem and no liability behind it.
 */
export const ModelBDiscountEarned: Story = {
    name: "Model B — Discount Earned",
    args: { step: "volume-earned" },
};

/* -------------------------- Model C — subscription -------------------------- */

/**
 * The third model, lifted from the Sagamore prototype's resource-package step: a
 * monthly plan with a start date, auto-renew, and a renewal notice. Nothing is prepaid
 * beyond the current cycle, so no liability accrues — but unlike a pure discount the
 * revenue and the commitment are both predictable.
 */
export const ModelCMonthlyPlan: Story = {
    name: "Model C — Monthly Plan",
    args: { step: "subscription", subscriptionId: "mike-kenny--sub-2" },
};

/* -------------------------------- edge states ------------------------------ */

/**
 * Credits imported from the old Thrive system: visible to the golfer holding them,
 * absent from the catalog, no buy button. The balances that need somewhere to live on
 * day one of a migration.
 */
export const AssignedPackage: Story = {
    name: "Assigned Package",
    args: { step: "assigned" },
};

/**
 * A pack that's been used up and one that expired with two lessons still on it — the
 * two states the Academy actually fields phone calls about.
 */
export const ExpiredZeroBalance: Story = {
    name: "Expired / Zero Balance",
    args: { step: "expired" },
};
