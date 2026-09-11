"use client";

/**
 * `/cart` — everything the golfer has picked up, ready to hand to checkout.
 *
 * The cart is shared across the whole prototype, so a tee time, a lesson and a dozen
 * balls can sit in it together. Merchandise gets a quantity stepper; a booked tee time
 * or a lesson seat doesn't — you can't buy two of the same 8:10 at Needwood — so those
 * lines show their count and a remove control instead.
 *
 * `lines` is an escape hatch for Storybook: pass a fixture and the screen drives local
 * state instead of the session, which is how the populated story renders without a
 * provider. The route passes nothing and the session is the single source of truth.
 */

import { useState } from "react";
import { ArrowLeft, ArrowRight, MarkerPin01, ShoppingBag03, Ticket02, Trash01 } from "@untitledui/icons";
import Link from "next/link";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { McgHero, McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import { type CartLine, useSession } from "@/components/mcg/session";
import { MCG_LOGO_PRODUCTS, money } from "@/components/mcg/shop-catalog";
import { countOf, subtotalOf, taxOn } from "./order";
import { Panel, ProductTile, QtyStepper, SummaryRow } from "./shop-ui";

/** Non-merchandise lines are one-of-a-kind bookings, not stock. */
const isCountable = (line: CartLine) => line.kind === "product" || line.kind === "package";

const KIND_LABEL: Record<CartLine["kind"], string> = {
    product: "Pro Shop",
    "tee-time": "Tee time",
    lesson: "Lesson",
    clinic: "Clinic",
    event: "Event",
    package: "Package",
    membership: "Membership",
};

/* ------------------------------------------------------------------ */
/* Line                                                                */
/* ------------------------------------------------------------------ */

const CartRow = ({ line, onQty, onRemove }: { line: CartLine; onQty: (qty: number) => void; onRemove: () => void }) => (
    <div className="flex items-start gap-4 py-5">
        <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-secondary ring-1 ring-secondary ring-inset">
            {line.image ? (
                <img src={line.image} alt="" className="size-full object-contain p-2" loading="lazy" />
            ) : (
                <span className="flex size-full items-center justify-center bg-brand-secondary">
                    <Ticket02 className="size-7 text-fg-brand-primary" aria-hidden="true" />
                </span>
            )}
        </div>

        <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
                <Badge color={line.kind === "product" ? "gray" : "brand"} size="sm" type="pill-color">
                    {KIND_LABEL[line.kind]}
                </Badge>
                {line.href && (
                    <Link href={line.href} className="text-xs font-medium text-brand-secondary transition duration-100 ease-linear hover:underline">
                        View item
                    </Link>
                )}
            </div>
            <p className="mt-1.5 text-sm font-semibold text-primary">{line.name}</p>
            {line.detail && <p className="text-xs text-tertiary">{line.detail}</p>}
            <p className="mt-0.5 text-xs text-tertiary tabular-nums">{money(line.unitPrice)} each</p>

            <div className="mt-3 flex flex-wrap items-center gap-4">
                {isCountable(line) ? (
                    <QtyStepper qty={line.qty} onChange={onQty} min={1} max={20} label={`Quantity of ${line.name}`} />
                ) : (
                    <span className="text-xs font-medium text-secondary tabular-nums">Qty {line.qty}</span>
                )}
                <button
                    type="button"
                    onClick={onRemove}
                    className="flex items-center gap-1 text-xs font-medium text-tertiary transition duration-100 ease-linear hover:text-error-primary"
                >
                    <Trash01 className="size-3.5" aria-hidden="true" /> Remove
                </button>
            </div>
        </div>

        <p className="shrink-0 text-sm font-semibold text-primary tabular-nums">{money(line.unitPrice * line.qty)}</p>
    </div>
);

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export interface CartScreenProps {
    /** Storybook fixture. Omit in the app so the session drives the screen. */
    lines?: CartLine[];
}

export const CartScreen = ({ lines: fixture }: CartScreenProps) => {
    const session = useSession();
    const [local, setLocal] = useState<CartLine[]>(fixture ?? []);

    const isFixture = fixture !== undefined;
    const lines = isFixture ? local : session.cart;

    const setQty = (id: string, qty: number) =>
        isFixture ? setLocal((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty } : l)))) : session.setQty(id, qty);
    const remove = (id: string) => (isFixture ? setLocal((ls) => ls.filter((l) => l.id !== id)) : session.removeFromCart(id));

    const count = countOf(lines);
    const subtotal = subtotalOf(lines);
    const tax = taxOn(subtotal);
    const total = subtotal + tax;

    return (
        <McgShell>
            <McgHero
                title="Your cart"
                blurb={
                    count === 0
                        ? "Nothing here yet — the Pro Shop is a good place to start."
                        : `${count} ${count === 1 ? "item" : "items"} held for collection at the MCG course you choose at checkout.`
                }
                right={
                    <Button href="/shop" color="secondary" size="md" iconLeading={ArrowLeft}>
                        Keep shopping
                    </Button>
                }
            />

            <McgPage>
                {lines.length === 0 ? (
                    /* ------------------------------- Empty ------------------------------ */
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col items-center gap-4 rounded-2xl bg-primary px-6 py-16 text-center ring-1 ring-secondary ring-inset">
                            <FeaturedIcon icon={ShoppingBag03} size="lg" color="gray" theme="modern" />
                            <h2 className="text-xl font-semibold text-primary">Your cart is empty</h2>
                            <p className="max-w-md text-sm text-tertiary">
                                County-crest caps, a dozen balls, a gift card for someone who plays Needwood every Saturday — it all starts in the Pro Shop.
                            </p>
                            <div className="mt-2 flex flex-wrap justify-center gap-3">
                                <Button href="/shop" color="primary" size="lg" iconTrailing={ArrowRight}>
                                    Browse the Pro Shop
                                </Button>
                                <Button href="/tee-times" color="secondary" size="lg">
                                    Book a tee time
                                </Button>
                            </div>
                        </div>

                        {/* The empty state still merchandises — the crest shelf is what sells. */}
                        <section>
                            <h3 className="text-lg font-semibold text-primary">Start with the MCG logo shelf</h3>
                            <p className="mt-1 text-sm text-tertiary">Made for the county, sold at all nine courses.</p>
                            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
                                {MCG_LOGO_PRODUCTS.slice(0, 4).map((product) => (
                                    <ProductTile
                                        key={product.slug}
                                        product={product}
                                        saved={session.saved.includes(product.slug)}
                                        onToggleSave={() => session.toggleSaved(product.slug)}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                ) : (
                    /* ------------------------------ Populated --------------------------- */
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                        <Panel
                            title={`${count} ${count === 1 ? "item" : "items"}`}
                            action={
                                <button
                                    type="button"
                                    onClick={() => (isFixture ? setLocal([]) : session.clearCart())}
                                    className="text-xs font-semibold text-tertiary transition duration-100 ease-linear hover:text-error-primary"
                                >
                                    Empty cart
                                </button>
                            }
                        >
                            <div className="divide-y divide-secondary px-5">
                                {lines.map((line) => (
                                    <CartRow key={line.id} line={line} onQty={(qty) => setQty(line.id, qty)} onRemove={() => remove(line.id)} />
                                ))}
                            </div>
                        </Panel>

                        <aside className="flex flex-col gap-4">
                            <Panel title="Order summary">
                                <div className="flex flex-col gap-2.5 px-5 py-4 text-sm">
                                    <SummaryRow label={`Subtotal · ${count} ${count === 1 ? "item" : "items"}`} value={money(subtotal)} />
                                    <SummaryRow label="Counter pickup" value="Free" tone="credit" />
                                    <SummaryRow label="Maryland sales tax (6%)" value={money(tax)} />
                                    <SummaryRow label="Total" value={money(total)} tone="total" />
                                </div>
                            </Panel>

                            <Button href="/cart/checkout" color="primary" size="lg" iconTrailing={ArrowRight} className="w-full">
                                Checkout
                            </Button>

                            <div className="flex gap-3 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
                                <MarkerPin01 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                <p className="text-sm text-tertiary">
                                    <span className="font-semibold text-primary">Pickup, not shipping.</span> You'll pick the course to collect from on the next
                                    step. Orders are held at the counter for 14 days.
                                </p>
                            </div>

                            <Link
                                href="/shop"
                                className="text-center text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline"
                            >
                                Keep shopping
                            </Link>
                        </aside>
                    </div>
                )}
            </McgPage>
        </McgShell>
    );
};
