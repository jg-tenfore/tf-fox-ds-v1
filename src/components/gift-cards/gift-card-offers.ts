/**
 * Gift card special offers, as the live Fox shop shows them today
 * (fox.tenfore.golf/dunes/shop/gift-cards, Nov 25, 2026): pay one amount, get a larger card.
 */

export interface GiftCardOffer {
    id: number;
    /** Short name, shown above the headline (e.g. "$60 for $50"). */
    name: string;
    /** What the golfer pays. */
    price: number;
    /** What the gift card is worth. */
    value: number;
    /** One line under the headline. */
    description: string;
    /** What the card can be spent on. */
    goodFor: string[];
    /** Last day the offer can be bought, as YYYY-MM-DD. */
    endsOn?: string;
    /** How many one golfer can buy. */
    limitPerCustomer?: number;
    soldOut?: boolean;
}

export const GOOD_FOR = ["golf", "food & drink", "alcohol", "merchandise"];

export const GIFT_CARD_OFFERS: GiftCardOffer[] = [
    {
        id: 3,
        name: "$60 for $50",
        price: 50,
        value: 60,
        description: "A decent value.",
        goodFor: GOOD_FOR,
    },
    {
        id: 4,
        name: "$120 Gift Card for $100",
        price: 100,
        value: 120,
        description: "a great deal!",
        goodFor: GOOD_FOR,
        endsOn: "2026-11-30",
        limitPerCustomer: 2,
        soldOut: true,
    },
];

/** "Pay $50, get a $60 gift card" */
export const offerHeadline = (offer: GiftCardOffer) => `Pay $${offer.price}, get a $${offer.value} gift card`;

/** "Nov 30, 2026" */
export const formatOfferDate = (isoDate: string) =>
    new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** What a purchase button asks for. The live site sends both kinds to sign-in first, then on to checkout or the gift form. */
export type GiftCardPurchase = { recipient: "myself" | "gift"; offerId: number } | { recipient: "myself" | "gift"; amount: number | null; message: string };
