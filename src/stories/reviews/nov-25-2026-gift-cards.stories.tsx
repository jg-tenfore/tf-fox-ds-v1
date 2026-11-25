import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GiftCardPage } from "@/components/gift-cards/gift-card-page";

/**
 * Nov 25, 2026: the shop's Gift Card page as it works on the live Fox site today
 * (fox.tenfore.golf/dunes/shop/gift-cards), rebuilt with the Fox design system and
 * without the shop's side rail. The starting point for the next round of changes.
 *
 * Every purchase button reports to the Actions panel. On the live site each one sends a
 * signed-out golfer to sign-in first, then on to checkout or the gift form.
 */
const meta = {
    title: "Reviews/Nov 25 – Gift Cards/Nov 24 – Jarrette",
    id: "nov-25-2026-gift-cards",
    component: GiftCardPage,
    parameters: { layout: "fullscreen" },
    args: { onPurchase: fn() },
} satisfies Meta<typeof GiftCardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** As the live page opens: one offer on sale, one sold out, and an empty amount. */
export const Default: Story = {};

/** Purchase for Myself with no amount. */
export const AmountRequired: Story = {
    name: "Amount required",
    args: { showAmountError: true },
};

/** A custom amount and a message, ready to buy. */
export const FilledIn: Story = {
    name: "Filled in",
    args: { defaultAmount: "25.00", defaultMessage: "Happy birthday! See you on the first tee." },
};

/** No offers running: only the custom amount is left. */
export const NoSpecialOffers: Story = {
    name: "No special offers",
    args: { offers: [] },
};

/** The same page at phone width (390). */
export const PhoneWidth: Story = {
    name: "Phone width",
    decorators: [
        (Story) => (
            <div className="mx-auto w-[390px]">
                <Story />
            </div>
        ),
    ],
};
