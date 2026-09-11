import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MCG_COURSES } from "@/components/mcg/tee-times-data";
import { TeeCheckoutScreen } from "@/components/mcg/tee-times/tee-checkout-screen";
import { TeeConfirmationScreen } from "@/components/mcg/tee-times/tee-confirmation-screen";
import { TeeSheetScreen } from "@/components/mcg/tee-times/tee-sheet-screen";

/**
 * "MCG Prototype / Tee Times" — the three screens of the county booking path, rendered
 * from the exact components the `/tee-times` routes render. Nothing here is a copy: a
 * change to a screen shows up in both places or neither.
 *
 * Outside the prototype there is no session provider and no stored booking, so each
 * screen falls back to its own demo state — which is what makes these stories reviewable
 * on their own.
 */
const meta: Meta = {
    title: "MCG Prototype/Tee Times",
    parameters: {
        layout: "fullscreen",
        // The screens use next/navigation (useRouter, Link), so they need the App Router mock.
        nextjs: { appDirectory: true },
    },
};

export default meta;
type Story = StoryObj;

/** The county board: all nine courses intertwined and sorted by the clock. */
export const TeeSheet: Story = {
    name: "Tee Sheet",
    render: () => <TeeSheetScreen />,
};

/** The same board with Montgomery County resident rates switched on across every card. */
export const ResidentRates: Story = {
    name: "Tee Sheet — Resident Rates",
    render: () => <TeeSheetScreen resident />,
};

/** A county Saturday after the 7:00 AM release: every course full, every pill disabled. */
export const NoAvailability: Story = {
    name: "No Availability",
    render: () => <TeeSheetScreen soldOut={MCG_COURSES.map((course) => course.slug)} />,
};

/** Per-player checkout — rate class per golfer, transportation, resident switch, hold clock. */
export const Checkout: Story = {
    name: "Checkout",
    render: () => <TeeCheckoutScreen resident />,
};

/** The last thirty seconds of the hold, so the expiry path can be reviewed without waiting. */
export const CheckoutHoldExpiring: Story = {
    name: "Checkout — Hold Expiring",
    render: () => <TeeCheckoutScreen holdSeconds={20} />,
};

/** The receipt: confirmation number, course mark, every line of what was charged. */
export const Confirmation: Story = {
    name: "Confirmation",
    render: () => <TeeConfirmationScreen />,
};
