import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GiftCardFlow, SAMPLE_ORDER, SAMPLE_ORDER_FOR_ME } from "./nov-25-2026-gift-card-flow";

/**
 * Nov 25, 2026: the gift card page redone as a builder, after a builder-style gift card flow
 * on Mobbin (pick an amount, pick a design, choose how to send it, a small card preview).
 * Deals come first, so "Pay $50, get a $60 card" is the first choice a golfer sees.
 *
 * Add to cart carries the card through the shop's own layouts: Shop Checkout › 1. Cart,
 * 3. Checkout and 4. Confirmation, then the purchase email and the Profile › Wallet. Every
 * story is clickable from end to end; Pay now reports to the Actions panel.
 */
const meta = {
    title: "Reviews/Nov 25 – Gift Cards/Nov 25 – New Concept",
    id: "nov-25-2026-gift-card-builder",
    component: GiftCardFlow,
    parameters: { layout: "fullscreen" },
    args: { onPurchase: fn() },
} satisfies Meta<typeof GiftCardFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Shop page: opens on the $50 → $60 deal, the first design and "Someone else". */
export const Choose: Story = {};

/** Ready to go: deal, design, recipient and a message. */
export const FilledIn: Story = {
    name: "Filled in",
    args: {
        initialDesign: "birthday-gift",
        initialToFirstName: "Alex",
        initialToLastName: "Rivera",
        initialToEmail: "alex@example.com",
        initialToPhone: "(555) 010-2481",
        initialMessage: "Happy birthday! First round's on me.",
    },
};

/** A standard $50 picked while the $50 deal is live: the page offers the bigger card. */
export const DealNudge: Story = {
    name: "Standard amount · deal nudge",
    args: { initialAmount: { kind: "preset", value: 50 } },
};

/** A custom amount. */
export const CustomAmount: Story = {
    name: "Custom amount",
    args: {
        initialAmount: { kind: "custom" },
        initialCustom: "75",
        initialDesign: "desert-canyon",
        initialToFirstName: "Sam",
        initialToLastName: "Chen",
        initialToEmail: "sam@example.com",
    },
};

/** Add to cart with things missing: each field says what it needs. */
export const MissingDetails: Story = {
    name: "Missing details",
    args: { initialAmount: { kind: "custom" }, initialCustom: "", showErrors: true },
};

/** The confirm email and confirm phone don't match what was typed first. */
export const EmailsDontMatch: Story = {
    name: "Emails don't match",
    args: {
        initialToFirstName: "Alex",
        initialToLastName: "Rivera",
        initialToEmail: "alex@example.com",
        initialToConfirmEmail: "alex@exmaple.com",
        initialToPhone: "(555) 010-2481",
        initialToConfirmPhone: "(555) 010-2418",
        showErrors: true,
    },
};

/** Buying for yourself: no recipient fields. */
export const ForMe: Story = {
    name: "For me",
    args: { initialRecipient: "me", initialDesign: "coastal-cliffs" },
};

/** Emailed to the buyer to print and hand over: no recipient email needed. */
export const PrintAtHome: Story = {
    name: "Print it yourself",
    args: {
        initialDelivery: "print",
        initialDesign: "snowy-holiday",
        initialToFirstName: "Chris",
        initialToLastName: "Hale",
        initialMessage: "Merry Christmas — tee time's on me.",
    },
};

/** Shop Checkout › 1. Cart, with the gift card as the line item. */
export const Cart: Story = {
    args: { initialStep: "cart", initialOrder: SAMPLE_ORDER },
};

/** Shop Checkout › 3. Checkout: Send to and Delivery in place of Ship to and Shipping. */
export const Checkout: Story = {
    args: { initialStep: "checkout", initialOrder: SAMPLE_ORDER },
};

/** Shop Checkout › 4. Confirmation, with gift card details in place of returns. */
export const Confirmation: Story = {
    args: { initialStep: "confirmation", initialOrder: SAMPLE_ORDER },
};

/** The purchase email when the card is for you: the card, its code, a barcode and a QR code. */
export const SelfEmail: Story = {
    name: "Self Email",
    args: { initialStep: "email", initialOrder: SAMPLE_ORDER_FOR_ME },
};

/** The purchase email when the card is a gift: "Gift sent", no code for the buyer. */
export const GiftEmail: Story = {
    name: "Gift Email",
    args: { initialStep: "email", initialOrder: SAMPLE_ORDER },
};

/** Profile › Wallet after a gift: the card under Gift cards › Sent as gifts. */
export const Wallet: Story = {
    name: "Wallet · gift sent",
    args: { initialStep: "wallet", initialOrder: SAMPLE_ORDER },
};

/** Profile › Wallet after buying for yourself: the new card, marked New. */
export const WalletForMe: Story = {
    name: "Wallet · for me",
    args: { initialStep: "wallet", initialOrder: SAMPLE_ORDER_FOR_ME },
};

/** The Shop page at phone width (390). */
export const PhoneWidth: Story = {
    name: "Phone width",
    args: { initialToFirstName: "Alex", initialToLastName: "Rivera", initialToEmail: "alex@example.com" },
    decorators: [
        (Story) => (
            <div className="mx-auto w-[390px]">
                <Story />
            </div>
        ),
    ],
};
