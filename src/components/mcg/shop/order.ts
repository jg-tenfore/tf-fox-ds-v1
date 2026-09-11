/**
 * The order a Pro Shop checkout hands to the confirmation screen.
 *
 * `checkout()` empties the cart and writes an `ActivityItem` — enough for the account
 * page, but a receipt needs the lines, the card and the pickup counter too. Rather than
 * widen the shared session contract for one screen, the checkout stashes the finished
 * order in `sessionStorage` and the confirmation reads it back. It survives the client
 * route push, it dies with the tab, and nothing else in the prototype depends on it.
 *
 * A cold load of `/cart/confirmation` (a shared link, or a Storybook story) finds
 * nothing there and falls back to `DEMO_ORDER`, so the screen is never blank.
 */

import type { CartLine } from "@/components/mcg/session";
import { MD_TAX_RATE, SHOP_PRODUCTS } from "@/components/mcg/shop-catalog";
import { asset } from "@/utils/asset";

const KEY = "mcg-shop-last-order-v1";

export interface OrderCard {
    /** Display name, e.g. "Visa". */
    brand: string;
    last4: string;
    /** Card-brand mark from the shared `card-images` set. */
    logo: string;
}

export interface ShopOrder {
    /** Human order number printed on the receipt and at the counter. */
    number: string;
    placedLabel: string;
    /** Slug of the MCG course the order is collected from. */
    courseSlug: string;
    name: string;
    email: string;
    phone: string;
    card: OrderCard;
    lines: CartLine[];
    subtotal: number;
    tax: number;
    total: number;
}

/** The cards on file in the prototype wallet. */
export const SAVED_CARDS: (OrderCard & { id: string; exp: string; isDefault?: boolean })[] = [
    { id: "visa", brand: "Visa", last4: "4821", exp: "09/2028", logo: asset("card-images/Visa.svg"), isDefault: true },
    { id: "mastercard", brand: "Mastercard", last4: "6642", exp: "03/2027", logo: asset("card-images/Mastercard.svg") },
    { id: "amex", brand: "American Express", last4: "3005", exp: "11/2029", logo: asset("card-images/Amex.svg") },
];

/** MoCo order numbers are the year plus a running counter — this mimics the format. */
export const nextOrderNumber = () => `MCG-${new Date().getFullYear()}-${Math.floor(100_000 + Math.random() * 899_999)}`;

export const subtotalOf = (lines: CartLine[]) => lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);
export const countOf = (lines: CartLine[]) => lines.reduce((sum, line) => sum + line.qty, 0);
export const taxOn = (subtotal: number) => subtotal * MD_TAX_RATE;

export const writeOrder = (order: ShopOrder) => {
    try {
        window.sessionStorage.setItem(KEY, JSON.stringify(order));
    } catch {
        /* storage blocked — the confirmation falls back to the demo receipt */
    }
};

export const readOrder = (): ShopOrder | null => {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.sessionStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as ShopOrder) : null;
    } catch {
        return null;
    }
};

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

/**
 * Build a demo cart line from a real catalog product.
 *
 * Returns `null` rather than throwing when a slug has left the catalog — this fixture
 * is only sample data, and a retired product shouldn't take the whole Shop down at
 * module load. The callers filter the nulls out.
 */
const line = (slug: string, qty: number, detail?: string): CartLine | null => {
    const product = SHOP_PRODUCTS.find((p) => p.slug === slug);
    if (!product) return null;
    return {
        id: [slug, detail].filter(Boolean).join("--"),
        kind: "product",
        name: product.name,
        detail,
        image: product.image,
        unitPrice: product.price,
        qty,
        href: `/shop/${slug}`,
    };
};

/** A believable basket: a dozen balls, a crest cap, a glove and a bag of tees. */
export const DEMO_CART_LINES: CartLine[] = [
    line("titleist-trufeel-double-dozen", 1, "Double dozen (24) · White"),
    line("titleist-players-cabretta-glove", 1, "M/L · White"),
    line("pride-prolength-tees", 1, '2 ¾"'),
    line("mcg-egift-card", 1, "$50"),
].filter((l): l is CartLine => l !== null);

const DEMO_SUBTOTAL = subtotalOf(DEMO_CART_LINES);

/** The receipt a cold load of `/cart/confirmation` shows. */
export const DEMO_ORDER: ShopOrder = {
    number: "MCG-2026-418206",
    placedLabel: "September 10, 2026 at 8:42 AM",
    courseSlug: "needwood",
    name: "Justin Girard",
    email: "hello@girardjustin.com",
    phone: "(240) 555-0117",
    card: SAVED_CARDS[0],
    lines: DEMO_CART_LINES,
    subtotal: DEMO_SUBTOTAL,
    tax: taxOn(DEMO_SUBTOTAL),
    total: DEMO_SUBTOTAL + taxOn(DEMO_SUBTOTAL),
};
