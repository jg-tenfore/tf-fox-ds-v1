import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GiftCardPage } from "@/components/gift-cards/gift-card-page";

/**
 * Nov 25, 2026: the shop's Gift Card page as it works on the live Fox site today
 * (fox.tenfore.golf/dunes/shop/gift-cards), rebuilt with the Fox design system and
 * without the shop's side rail. The starting point for the next round of changes.
 *
 * Send as a Gift and Purchase as Gift open the gift form, as on the live site. Buy for Myself,
 * Purchase for Myself and Add Gift to Cart report to the Actions panel. On the live site a
 * signed-out golfer goes to sign-in first.
 */
const meta = {
    title: "Reviews/Nov 25 – Gift Cards/Nov 24 – Jarrette",
    id: "nov-25-2026-gift-cards",
    component: GiftCardPage,
    parameters: { layout: "fullscreen" },
    args: { onPurchase: fn(), onAddGiftToCart: fn() },
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

/** Send as a Gift on the $60 for $50 offer: the gift form. */
export const SendAsGift: Story = {
    name: "Send as a Gift",
    args: { initialGift: { offerId: 3 } },
};

/** The gift form filled in, ready for Add Gift to Cart. */
export const SendAsGiftFilledIn: Story = {
    name: "Send as a Gift · filled in",
    args: {
        initialGift: { offerId: 3 },
        giftDefaults: {
            firstName: "Alex",
            lastName: "Rivera",
            email: "alex@example.com",
            confirmEmail: "alex@example.com",
            phone: "(555) 010-2481",
            confirmPhone: "(555) 010-2481",
            message: "Happy birthday! See you on the first tee.",
        },
    },
};

/** Add Gift to Cart with nothing filled in, and a confirm email that doesn't match. */
export const SendAsGiftMissingDetails: Story = {
    name: "Send as a Gift · missing details",
    args: { initialGift: { offerId: 3 }, giftDefaults: { email: "alex@example.com", confirmEmail: "alex@exmaple.com" }, showGiftErrors: true },
};

/** Purchase as Gift with $25 typed on the page. */
export const PurchaseAsGift: Story = {
    name: "Purchase as Gift · $25",
    args: { initialGift: { amount: 25 } },
};

/** Purchase as Gift with no amount: the live page lets it through, so the form asks for one. */
export const PurchaseAsGiftNoAmount: Story = {
    name: "Purchase as Gift · no amount",
    args: { initialGift: { amount: null } },
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
