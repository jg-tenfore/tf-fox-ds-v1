import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag03, Tag01, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { course } from "@/components/booking/sagamore-data";
import { STORE_PRODUCTS } from "@/components/store/store-catalog";
import { cx } from "@/utils/cx";
import { SiteFooter } from "./tenfore-chrome";

/**
 * "Cart / Cart" — the Pro Shop cart, laid out like the Checkout page (two-column:
 * line items + order summary). Products come from the shop-all catalog. Includes a
 * promo-code / gift-card field placed in the summary above the totals (Shopify-style
 * placement). No hold countdown — this is a merchandise cart.
 */
const meta: Meta = {
    title: "Shop Checkout/Cart",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const money = (n: number) => `$${n.toFixed(2)}`;
const priceOf = (p: (typeof STORE_PRODUCTS)[number]) => (p.onSale && p.salePrice ? p.salePrice : p.price);

/** Black header bar — matches the Checkout screen. */
const CartHeader = () => (
    <header className="relative flex flex-col items-center gap-2 bg-primary-solid px-6 py-6 text-center">
        <button type="button" aria-label="Back" className="absolute top-1/2 left-6 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition duration-100 ease-linear hover:bg-white/20">
            <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <SagamoreLogo className="h-12 w-auto" />
        <span className="text-base font-semibold text-white">{course.name}</span>
    </header>
);

interface Line {
    product: (typeof STORE_PRODUCTS)[number];
    variant: string;
    qty: number;
}

const pick = (cat: string) => STORE_PRODUCTS.find((p) => p.category === cat)!;
const INITIAL: Line[] = [
    { product: pick("apparel"), variant: "White · L", qty: 1 },
    { product: pick("shoes"), variant: "Size 10.5", qty: 1 },
    { product: pick("equipment"), variant: "Dozen", qty: 2 },
];

const CartScreen = () => {
    const [lines, setLines] = useState<Line[]>(INITIAL);
    const [code, setCode] = useState("");
    const [applied, setApplied] = useState<string | null>(null);

    const setQty = (i: number, delta: number) => setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, qty: Math.max(1, l.qty + delta) } : l)));
    const remove = (i: number) => setLines((ls) => ls.filter((_, idx) => idx !== i));

    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + priceOf(l.product) * l.qty, 0);
    const discount = applied ? Math.min(20, subtotal) : 0;
    const shipping = lines.length ? 19.9 : 0;
    const taxes = (subtotal - discount) * 0.0625;
    const total = subtotal - discount + shipping + taxes;

    const apply = () => {
        if (code.trim()) setApplied(code.trim().toUpperCase());
    };

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <CartHeader />

            <main className="mx-auto w-full max-w-[1080px] flex-1 px-6 pt-10 pb-20">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    {/* Left — line items */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-display-sm font-semibold text-primary">Your cart</h1>
                            <p className="mt-2 text-md text-tertiary">Review your Pro Shop items before checkout.</p>
                        </div>

                        <section className="flex flex-col rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                            <header className="border-b border-secondary px-5 py-4">
                                <h3 className="text-md font-semibold text-primary">
                                    {count} {count === 1 ? "item" : "items"}
                                </h3>
                            </header>

                            {lines.length === 0 ? (
                                <p className="px-5 py-10 text-center text-sm text-tertiary">Your cart is empty.</p>
                            ) : (
                                <div className="divide-y divide-secondary px-5">
                                    {lines.map((l, i) => (
                                        <div key={l.product.id} className="flex items-center gap-4 py-4">
                                            <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-secondary ring-1 ring-secondary ring-inset">
                                                <img src={l.product.src} alt={l.product.title} className="size-full object-contain p-2" loading="lazy" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-primary">{l.product.title}</p>
                                                <p className="text-xs text-tertiary">{l.variant}</p>
                                                <div className="mt-2 flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            aria-label="Decrease"
                                                            disabled={l.qty <= 1}
                                                            onClick={() => setQty(i, -1)}
                                                            className="flex size-7 items-center justify-center rounded-full ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:opacity-50"
                                                        >
                                                            <Minus className="size-3.5 text-fg-secondary" aria-hidden="true" />
                                                        </button>
                                                        <span className="w-5 text-center text-sm font-semibold text-primary tabular-nums">{l.qty}</span>
                                                        <button
                                                            type="button"
                                                            aria-label="Increase"
                                                            onClick={() => setQty(i, 1)}
                                                            className="flex size-7 items-center justify-center rounded-full ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover"
                                                        >
                                                            <Plus className="size-3.5 text-fg-secondary" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                    <button type="button" onClick={() => remove(i)} className="flex items-center gap-1 text-xs font-medium text-tertiary transition duration-100 ease-linear hover:text-error-primary">
                                                        <Trash01 className="size-3.5" aria-hidden="true" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="shrink-0 text-sm font-semibold text-primary tabular-nums">{money(priceOf(l.product) * l.qty)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right — order summary */}
                    <aside className="flex flex-col gap-4">
                        <section className="flex flex-col rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                            <header className="border-b border-secondary px-5 py-4">
                                <h3 className="text-md font-semibold text-primary">Order summary</h3>
                            </header>

                            {/* Promo code — Shopify-style placement, above the totals */}
                            <div className="border-b border-secondary px-5 py-4">
                                {applied ? (
                                    <div className="flex items-center justify-between gap-3 rounded-lg bg-success-primary px-3 py-2.5">
                                        <span className="flex items-center gap-2 text-sm font-semibold text-success-primary">
                                            <Tag01 className="size-4" aria-hidden="true" /> {applied} applied
                                        </span>
                                        <button type="button" onClick={() => setApplied(null)} className="text-xs font-semibold text-secondary underline underline-offset-2">
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-2">
                                        <Input aria-label="Discount code or gift card" placeholder="Discount code or gift card" value={code} onChange={setCode} wrapperClassName="flex-1" />
                                        <Button color="primary" size="md" onClick={apply} isDisabled={!code.trim()}>
                                            Apply
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="flex flex-col gap-2.5 px-5 py-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-tertiary">
                                        Subtotal · {count} {count === 1 ? "item" : "items"}
                                    </span>
                                    <span className="font-medium text-primary tabular-nums">{money(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-tertiary">Discount</span>
                                        <span className="font-medium text-success-primary tabular-nums">−{money(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-tertiary">Shipping</span>
                                    <span className="font-medium text-primary tabular-nums">{money(shipping)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-tertiary">Estimated taxes</span>
                                    <span className="font-medium text-primary tabular-nums">{money(taxes)}</span>
                                </div>
                                <div className="mt-1 flex items-baseline justify-between border-t border-secondary pt-3">
                                    <span className="text-md font-semibold text-primary">Total</span>
                                    <span className="text-md font-semibold text-primary tabular-nums">
                                        <span className="mr-1 text-xs font-medium text-tertiary">USD</span>
                                        {money(total)}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <Button color="primary" size="lg" iconLeading={ShoppingBag03} className="w-full" isDisabled={lines.length === 0}>
                            Checkout
                        </Button>
                        <p className="text-center text-xs text-tertiary">Shipping and final taxes are confirmed at checkout.</p>
                    </aside>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
};

export const Default: Story = {
    name: "Cart",
    render: () => <CartScreen />,
};
