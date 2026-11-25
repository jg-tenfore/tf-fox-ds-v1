/**
 * Data for the gift card builder (Reviews › Nov 25 – Gift Cards › Nov 25 – New Concept): card designs, deals,
 * standard amounts, saved cards and sample purchase history. Sample club and people only.
 */
import { asset } from "@/utils/asset";
import autumnRound from "./art/autumn-round.jpg";
import birthdayGift from "./art/birthday-gift.jpg";
import celebrationFireworks from "./art/celebration-fireworks.jpg";
import clubhouseLights from "./art/clubhouse-lights.jpg";
import coastalCliffs from "./art/coastal-cliffs.jpg";
import desertCanyon from "./art/desert-canyon.jpg";
import holidaySnow from "./art/holiday-snow.jpg";
import mountainValley from "./art/mountain-valley.jpg";
import onTheGreen from "./art/on-the-green.jpg";
import sunriseFairway from "./art/sunrise-fairway.jpg";

type ImageSource = string | { src: string };
export const imageSrc = (img: ImageSource) => (typeof img === "string" ? img : img.src);

export const CLUB_NAME = "Sagamore Spring";

/** What every card can be spent on, as the live shop words it. */
export const GOOD_FOR = "golf, food & drink, alcohol and merchandise";

export type DesignTheme = "classic" | "destinations" | "occasions";

export interface CardDesign {
    id: string;
    name: string;
    art: ImageSource;
    theme: DesignTheme;
}

/** The groups in "Pick a design", in order. */
export const DESIGN_THEMES: { id: DesignTheme; label: string }[] = [
    { id: "classic", label: "Classic" },
    { id: "destinations", label: "Destinations" },
    { id: "occasions", label: "Holidays & occasions" },
];

export const CARD_DESIGNS: CardDesign[] = [
    { id: "sunrise-fairway", name: "Sunrise fairway", art: sunriseFairway, theme: "classic" },
    { id: "on-the-green", name: "On the green", art: onTheGreen, theme: "classic" },
    { id: "clubhouse-lights", name: "Clubhouse lights", art: clubhouseLights, theme: "classic" },
    { id: "autumn-round", name: "Autumn round", art: autumnRound, theme: "classic" },
    { id: "desert-canyon", name: "Desert canyon", art: desertCanyon, theme: "destinations" },
    { id: "coastal-cliffs", name: "Coastal cliffs", art: coastalCliffs, theme: "destinations" },
    { id: "mountain-lake", name: "Mountain lake", art: mountainValley, theme: "destinations" },
    { id: "snowy-holiday", name: "Snowy holiday", art: holidaySnow, theme: "occasions" },
    { id: "birthday-gift", name: "Birthday gift", art: birthdayGift, theme: "occasions" },
    { id: "fireworks-night", name: "Fireworks night", art: celebrationFireworks, theme: "occasions" },
];

export interface GiftCardDeal {
    id: string;
    /** What the golfer pays. */
    price: number;
    /** What the card is worth. */
    value: number;
    /** Last day it can be bought, YYYY-MM-DD. */
    endsOn?: string;
    limitPerCustomer?: number;
    soldOut?: boolean;
    /** Not on the live site: added to show more than one deal. */
    sample?: boolean;
}

/** The first two match the live Fox shop today; the third is a sample. */
export const GIFT_CARD_DEALS: GiftCardDeal[] = [
    { id: "deal-60-for-50", price: 50, value: 60 },
    { id: "deal-250-for-200", price: 200, value: 250, endsOn: "2026-12-31", limitPerCustomer: 2, sample: true },
    { id: "deal-120-for-100", price: 100, value: 120, endsOn: "2026-11-30", limitPerCustomer: 2, soldOut: true },
];

export const STANDARD_AMOUNTS = [25, 50, 100, 200];

/** Custom amounts: a sample rule to review. */
export const CUSTOM_MIN = 10;
export const CUSTOM_MAX = 500;

export const MESSAGE_MAX = 300;

/** The signed-in sample golfer. */
export const BUYER = { name: "Morgan Hale", email: "morgan.hale@example.com" };

export const SAVED_CARDS = [
    { id: "visa", brand: "Visa", last4: "4821", exp: "09/2028", logo: asset("card-images/Visa.svg"), isDefault: true },
    { id: "mastercard", brand: "Mastercard", last4: "6642", exp: "03/2027", logo: asset("card-images/Mastercard.svg") },
];

export type Recipient = "someone" | "me";
export type Delivery = "email" | "print";

export interface GiftCardPurchaseRecord {
    id: string;
    date: string;
    designId: string;
    value: number;
    paid: number;
    recipient: Recipient;
    delivery: Delivery;
    toName?: string;
    toEmail?: string;
    code: string;
}

export const SAMPLE_HISTORY: GiftCardPurchaseRecord[] = [
    {
        id: "gc-1",
        date: "2026-11-02",
        designId: "autumn-round",
        value: 100,
        paid: 100,
        recipient: "someone",
        delivery: "email",
        toName: "Jordan Lee",
        toEmail: "jordan.lee@example.com",
        code: "GC-7Q2K-31MD",
    },
    { id: "gc-2", date: "2026-10-14", designId: "on-the-green", value: 60, paid: 50, recipient: "me", delivery: "email", code: "GC-5H8P-90TA" },
];

export const money = (n: number) => `$${n.toFixed(2)}`;
export const money0 = (n: number) => (Number.isInteger(n) ? `$${n}` : money(n));

export const formatDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** "GC-••••-31MD", or "••••••••3352" for a 12-digit card code. */
export const maskCode = (code: string) => (/^\d{12}$/.test(code) ? `••••••••${code.slice(-4)}` : code.replace(/^(GC-)[A-Z0-9]{4}/, "$1••••"));
