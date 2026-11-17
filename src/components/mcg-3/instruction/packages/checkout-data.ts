/**
 * Saved cards for the pack checkout — the Fox stand-in for Crane's `checkout/checkout-data.ts`
 * (`SAVED_PAYMENTS`). Fake sample cards only; card art is Fox's `card-images/` set via `asset()`.
 * The expired one is there so the disabled row reads, as in Crane.
 */
import { asset } from "@/utils/asset";

export type CardBrand = "Visa" | "Mastercard" | "Amex";

export interface SavedPayment {
    id: string;
    brand: CardBrand;
    /** Printed name ("American Express", or the issuer). */
    name: string;
    last4: string;
    /** "MM/YYYY" — set when the card can no longer be used. */
    expired?: string;
}

export const SAVED_PAYMENTS: SavedPayment[] = [
    { id: "pm-amex", brand: "Amex", name: "American Express", last4: "3005" },
    { id: "pm-visa", brand: "Visa", name: "Visa", last4: "4821" },
    { id: "pm-mc", brand: "Mastercard", name: "Mastercard", last4: "6642" },
    { id: "pm-old-mc", brand: "Mastercard", name: "Mastercard", last4: "1180", expired: "05/2026" },
];

/** The brand's card art (Fox `public/card-images`). */
export const cardArt = (brand: CardBrand) => asset(`card-images/${brand}.svg`);

/** The sample billing address printed under each card (invented, like the golfer). */
export const BILLING_LINE = "14 Fairway Ct, Rockville, MD 20850";

/** Guess a brand from the first digit, the way card forms do. */
export const brandOf = (digits: string): CardBrand => (digits.startsWith("3") ? "Amex" : digits.startsWith("5") || digits.startsWith("2") ? "Mastercard" : "Visa");
