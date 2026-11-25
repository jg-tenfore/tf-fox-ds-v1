import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { B, Block, Links, List, SummaryPage } from "./summary-kit";

/** Nov 25, 2026: the live Gift Card page rebuilt as a base, then redone as a gift card builder. */

const S = "nov-25-2026-gift-cards--";
const G = "nov-25-2026-gift-card-builder--";

function Nov25Summary() {
    return (
        <SummaryPage
            eyebrow="Nov 25, 2026 · Jarrette"
            title="Gift cards: today's page, then a builder"
            intro="First, the shop's Gift Card page from the live Fox site, rebuilt with the Fox design system as a base: same parts, same order, same rules, no side rail. Then the same job redone as a gift card builder, after a builder-style gift card flow on Mobbin, with the deals first, then carried through the shop's own cart, checkout and confirmation, the purchase email and the wallet."
            meta={["Source: fox.tenfore.golf/dunes/shop/gift-cards", "Today's page · 10 stories", "New Concept · 16 stories"]}
        >
            <Block title="What's on the page">
                <List
                    items={[
                        <>
                            <B>Special offers.</B> Each one reads “Pay $50, get a $60 gift card”, with what it's good for, an end date and a limit per customer
                            when set. Each has <B>Buy for Myself</B> and <B>Send as a Gift</B>.
                        </>,
                        <>
                            <B>Sold out.</B> The offer stays on the page, greyed, with a Sold out badge and both buttons turned off.
                        </>,
                        <>
                            <B>A custom amount</B> in dollars, and an optional <B>personal message</B> that goes in the gift card email.
                        </>,
                        <>
                            <B>Purchase for Myself</B> or <B>Purchase as Gift</B> for the custom amount.
                        </>,
                        <>
                            <B>The gift form.</B> Send as a Gift and Purchase as Gift open it: <B>From</B> (the signed-in golfer, with Change), <B>To</B> (first
                            and last name, email and confirm email, phone and confirm phone, both optional), the offer or amount being sent, a personal message,
                            then <B>Back</B> or <B>Add Gift to Cart</B>.
                        </>,
                    ]}
                />
                <Links
                    links={[
                        [`${S}default`, "The page"],
                        [`${S}amount-required`, "Amount required"],
                        [`${S}filled-in`, "Filled in"],
                        [`${S}send-as-gift`, "Send as a Gift"],
                        [`${S}send-as-gift-filled-in`, "Gift form · filled in"],
                        [`${S}send-as-gift-missing-details`, "Gift form · missing details"],
                        [`${S}purchase-as-gift`, "Purchase as Gift · $25"],
                        [`${S}purchase-as-gift-no-amount`, "Purchase as Gift · no amount"],
                        [`${S}no-special-offers`, "No special offers"],
                        [`${S}phone-width`, "Phone width"],
                    ]}
                />
            </Block>

            <Block title="How it behaves on the live site">
                <List
                    items={[
                        "Every purchase button sends a signed-out golfer to sign-in first, then back.",
                        "Send as a Gift and Purchase as Gift then open a separate gift form (/gift-cards/gift?offerId=… or ?amount=…). It's rebuilt here from a screenshot of the signed-in form.",
                        "Purchase for Myself with no amount shows “Amount is required”. Purchase as Gift goes on without one.",
                        "An amount of 0 or letters stops Purchase for Myself without a message. Here it shows “Amount is required” instead.",
                    ]}
                />
                <p>In Storybook, Buy for Myself, Purchase for Myself and Add Gift to Cart report what they would buy in the Actions panel.</p>
            </Block>

            <Block title="Differences from the live page">
                <List
                    items={[
                        "Fox's brand green and type, in place of The Dunes' blue.",
                        "Send as a Gift and Purchase as Gift use Fox's secondary button. Fox has no outline button in the brand color.",
                        "No side rail, breadcrumb or site header, as asked.",
                    ]}
                />
            </Block>

            <Block title="The gift card builder">
                <p>The same job in three steps on the Shop page, with a small card preview and a running total beside them the whole way.</p>
                <List
                    items={[
                        <>
                            <B>1 · Choose an amount.</B> Deals come first: “+$10 bonus · Pay $50 · Get a $60 card”. Sold-out deals stay visible and turned off.
                            Then $25, $50, $100 or $200, or any amount from $10 to $500. Picking $50 while the $50 deal is live offers “Same $50, bigger card”.
                        </>,
                        <>
                            <B>2 · Pick a design.</B> Ten golf cards in three groups. Classic: Sunrise fairway, On the green, Clubhouse lights, Autumn round.
                            Destinations: Desert canyon, Coastal cliffs, Mountain lake. Holidays &amp; occasions: Snowy holiday, Birthday gift, Fireworks night.
                        </>,
                        <>
                            <B>3 · Who&apos;s it for?</B> Someone else (email it to them, or email it to you to print), with the gift form&apos;s fields folded
                            in: <B>From</B> (you, with Change), their first and last name, email and confirm email, phone and confirm phone (optional), and a
                            message. Printing needs only their name. Or you: the card is saved to your account.
                        </>,
                        <>
                            <B>Add to cart</B> goes into the shop&apos;s own layouts: <B>Cart</B> (Shop Checkout 1), <B>Checkout</B> (Shop Checkout 3) with Send
                            to and Delivery in place of Ship to and Shipping, and <B>Confirmation</B> (Shop Checkout 4) with gift card details in place of
                            returns. No shipping or tax, and the deal bonus shows as its own line.
                        </>,
                        <>
                            <B>Purchase email</B>, laid out like the Gift Cards › Purchase email template. <B>Self Email</B> shows the card, its 12-digit code,
                            and a barcode and QR code to scan at the Pro Shop; <B>Gift Email</B> shows “Gift sent” and the recipient, without the code.
                        </>,
                        <>
                            <B>Wallet</B> (Profile › Wallet): a card bought for yourself shows under Gift cards, marked New. A gift shows under Sent as gifts.
                        </>,
                    ]}
                />
                <Links
                    links={[
                        [`${G}choose`, "Open the builder"],
                        [`${G}deal-nudge`, "Deal nudge"],
                        [`${G}missing-details`, "Missing details"],
                        [`${G}emails-dont-match`, "Emails don't match"],
                        [`${G}for-me`, "For me"],
                        [`${G}cart`, "Cart"],
                        [`${G}checkout`, "Checkout"],
                        [`${G}confirmation`, "Confirmation"],
                        [`${G}self-email`, "Self Email"],
                        [`${G}gift-email`, "Gift Email"],
                        [`${G}wallet`, "Wallet · gift sent"],
                        [`${G}wallet-for-me`, "Wallet · for me"],
                        [`${G}phone-width`, "Phone width"],
                    ]}
                />
            </Block>

            <Block title="Still open">
                <List
                    items={[
                        "The $200 → $250 deal is a sample, added to show more than one deal. The live shop has the other two.",
                        "The $10 to $500 limit on custom amounts is a sample rule.",
                        "Sign-in: the live site asks for it before buying. The builder assumes a signed-in golfer.",
                        "Whether a gift can be scheduled for a later date.",
                        "The gift form's error messages, its “$25.00 gift card” box for Purchase as Gift, and asking for an amount when none was typed are best guesses; the screenshot only shows the offer case.",
                        "What the recipient's phone number is used for (a text with the card?).",
                    ]}
                />
            </Block>
        </SummaryPage>
    );
}

const meta = {
    title: "Reviews/Nov 25 – Gift Cards/Summary",
    id: "nov-25-2026-gift-cards-summary",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = { render: () => <Nov25Summary /> };
