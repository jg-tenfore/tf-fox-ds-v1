/**
 * The golfer's saved payment methods for Instruction checkout — the Crane prototype's
 * `checkout-data.ts` `SAVED_PAYMENTS`, kept local so `pay=` deep links (`pay=pm-amex`, `pay=pm-visa`,
 * `pay=credit`) mean the same thing in both prototypes. Card art is Fox's shared `card-images` set.
 * All last-4s are invented.
 */
import { asset } from "@/utils/asset";

export interface SavedPayment {
    id: string;
    brand: "Amex" | "Visa" | "Mastercard";
    name: string;
    last4: string;
    exp: string;
    /** Set when the card has lapsed: shown nowhere in checkout. */
    expired?: string;
    logo: string;
}

export const SAVED_PAYMENTS: SavedPayment[] = [
    { id: "pm-amex", brand: "Amex", name: "American Express", last4: "3005", exp: "11/2029", logo: asset("card-images/Amex.svg") },
    { id: "pm-visa", brand: "Visa", name: "Visa", last4: "2521", exp: "09/2028", logo: asset("card-images/Visa.svg") },
    { id: "pm-mc", brand: "Mastercard", name: "Mastercard", last4: "6642", exp: "03/2027", logo: asset("card-images/Mastercard.svg") },
    { id: "pm-barclays", brand: "Mastercard", name: "Barclays", last4: "1180", exp: "05/2026", expired: "05/2026", logo: asset("card-images/Mastercard.svg") },
];

export const paymentById = (id: string) => SAVED_PAYMENTS.find((p) => p.id === id);

/** The first card that hasn't lapsed — what checkout selects by default. */
export const DEFAULT_CARD = SAVED_PAYMENTS.find((p) => !p.expired)!.id;
