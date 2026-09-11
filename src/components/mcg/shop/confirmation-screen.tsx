"use client";

/**
 * `/cart/confirmation` — the receipt.
 *
 * Everything a golfer walking up to a county counter actually needs: the order number
 * to quote, which shop has it, when that shop is open, what's in the bag and what was
 * charged. No tracking number, no carrier, no delivery window — there is no shipment.
 *
 * The order comes from the stash the checkout wrote. A cold load falls back to the demo
 * receipt so the screen is never empty in Storybook or on a shared link.
 */

import { useEffect, useState } from "react";
import { CheckCircle, Clock, LifeBuoy01, MarkerPin01, Phone, Printer, RefreshCcw01, ShoppingBag03, User01 } from "@untitledui/icons";
import confetti from "canvas-confetti";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { mcgCourse, mcgCourses } from "@/components/foundations/mcg/mcg-assets";
import { MCG, McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import { PICKUP_HOURS, PICKUP_READY, money } from "@/components/mcg/shop-catalog";
import { DEMO_ORDER, type ShopOrder, countOf, readOrder } from "./order";
import { MicroLabel } from "./shop-ui";

/* ------------------------------------------------------------------ */
/* Rows                                                                */
/* ------------------------------------------------------------------ */

const PayRow = ({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "credit" }) => (
    <div className="flex items-center justify-between gap-4 py-3">
        <span className="text-secondary">{label}</span>
        <span className={tone === "credit" ? "shrink-0 text-success-primary tabular-nums" : "shrink-0 text-primary tabular-nums"}>{value}</span>
    </div>
);

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export interface ConfirmationScreenProps {
    /** Storybook fixture. Omit in the app so the stashed order drives the screen. */
    order?: ShopOrder;
}

export const ConfirmationScreen = ({ order: fixture }: ConfirmationScreenProps) => {
    // Read after mount — sessionStorage is client-only, and the server render must match.
    const [order, setOrder] = useState<ShopOrder>(fixture ?? DEMO_ORDER);

    useEffect(() => {
        if (fixture) return;
        const stashed = readOrder();
        if (stashed) setOrder(stashed);
    }, [fixture]);

    useEffect(() => {
        confetti({ particleCount: 140, spread: 75, startVelocity: 45, origin: { y: 0.35 } });
        const timer = window.setTimeout(() => confetti({ particleCount: 90, spread: 110, startVelocity: 32, origin: { y: 0.4 } }), 260);
        return () => window.clearTimeout(timer);
    }, []);

    const course = mcgCourse(order.courseSlug) ?? mcgCourses[0];
    const count = countOf(order.lines);
    const firstName = order.name.split(" ")[0];

    return (
        <McgShell>
            <McgPage width="3xl">
                <div className="overflow-hidden rounded-2xl bg-primary shadow-sm ring-1 ring-secondary ring-inset">
                    <div className="flex justify-center px-7 pt-7">
                        <FeaturedIcon icon={CheckCircle} size="lg" color="success" theme="light" />
                    </div>

                    <div className="px-7 pt-4 text-center">
                        <MicroLabel>Order confirmation</MicroLabel>
                        <p className="mt-1 text-lg font-semibold text-primary tabular-nums">{order.number}</p>
                    </div>

                    <div className="px-7 pt-4 pb-7 text-center">
                        <h1 className="text-2xl font-semibold text-primary">Thank you, {firstName}.</h1>
                        <p className="mt-2 text-md text-tertiary">
                            Your Pro Shop order is paid and on its way to the counter at {course.name}. Quote the order number when you collect.
                        </p>
                        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary">
                            <Clock className="size-4 text-fg-quaternary" aria-hidden="true" />
                            {PICKUP_READY[course.slug] ?? "Ready shortly"}
                        </p>
                    </div>

                    {/* ------------------------------ Pickup ------------------------------ */}
                    <section className="border-t border-secondary px-7 py-7">
                        <h2 className="text-lg font-semibold text-primary">Where to collect</h2>
                        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:justify-between">
                            <div className="flex gap-3">
                                <img src={course.logo} alt="" className="h-11 w-auto max-w-14 shrink-0 object-contain" />
                                <div>
                                    <p className="text-sm font-semibold text-primary">{course.name} Pro Shop</p>
                                    <p className="text-sm text-tertiary">{course.location}</p>
                                    <p className="mt-1 flex items-center gap-1.5 text-sm text-tertiary">
                                        <MarkerPin01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                                        Montgomery County Golf
                                    </p>
                                </div>
                            </div>
                            <div>
                                <MicroLabel>Shop hours</MicroLabel>
                                <p className="mt-1 text-sm font-medium text-primary">{PICKUP_HOURS[course.slug] ?? "Call for hours"}</p>
                                <p className="mt-1 text-sm text-tertiary">Held at the counter for 14 days</p>
                                <p className="text-sm text-tertiary">Bring photo ID</p>
                            </div>
                        </div>
                        <div className="mt-5 flex gap-3 rounded-xl bg-secondary p-4">
                            <User01 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                            <p className="text-sm text-tertiary">
                                <span className="font-semibold text-primary">Collected by {order.name}.</span> We'll text {order.phone} and email {order.email}{" "}
                                when it's ready. Someone else can collect if they bring the order number.
                            </p>
                        </div>
                    </section>

                    {/* ------------------------------- Items ------------------------------ */}
                    <section className="border-t border-secondary px-7 py-7">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold text-primary">
                                Items <span className="text-tertiary tabular-nums">({count})</span>
                            </h2>
                            <Badge color="success" size="md" type="pill-color">
                                Paid
                            </Badge>
                        </div>
                        <div className="mt-4 flex flex-col gap-4">
                            {order.lines.map((line) => (
                                <div key={line.id} className="flex items-center gap-3">
                                    <div className="relative size-14 shrink-0">
                                        <div className="size-full overflow-hidden rounded-lg bg-secondary ring-1 ring-secondary ring-inset">
                                            {line.image ? (
                                                <img src={line.image} alt="" className="size-full object-contain p-1.5" loading="lazy" />
                                            ) : (
                                                <span className="flex size-full items-center justify-center bg-brand-secondary text-[10px] font-bold text-brand-secondary">
                                                    MCG
                                                </span>
                                            )}
                                        </div>
                                        {line.qty > 1 && (
                                            <span className="absolute -top-2 -right-2 z-10 flex size-5 items-center justify-center rounded-full bg-primary-solid text-[10px] font-semibold text-white tabular-nums">
                                                {line.qty}
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-primary">{line.name}</p>
                                        {line.detail && <p className="truncate text-xs text-tertiary">{line.detail}</p>}
                                    </div>
                                    <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">{money(line.unitPrice * line.qty)}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ------------------------------ Payment ----------------------------- */}
                    <section className="border-t border-secondary px-7 py-7">
                        <h2 className="text-lg font-semibold text-primary">Payment</h2>
                        <div className="mt-4 flex flex-col divide-y divide-secondary border-y border-secondary text-sm">
                            <PayRow label={`Subtotal · ${count} ${count === 1 ? "item" : "items"}`} value={money(order.subtotal)} />
                            <PayRow label="Counter pickup" value="Free" tone="credit" />
                            <PayRow label="Maryland sales tax (6%)" value={money(order.tax)} />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-base font-semibold text-primary">Total charged</span>
                            <span className="text-base font-semibold text-primary tabular-nums">{money(order.total)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="flex items-center gap-2.5 text-sm text-secondary">
                                <img src={order.card.logo} alt={order.card.brand} className="h-6 w-auto" />
                                {order.card.brand} ···· {order.card.last4}
                            </span>
                            <span className="text-sm text-secondary tabular-nums">{money(order.total)}</span>
                        </div>
                        <p className="mt-4 text-xs text-tertiary">Paid online on {order.placedLabel}.</p>
                        <Button color="secondary" size="lg" iconLeading={Printer} className="mt-6 w-full">
                            Print this receipt
                        </Button>
                    </section>

                    {/* ------------------------------ Returns ----------------------------- */}
                    <section className="border-t border-secondary px-7 py-7">
                        <h2 className="text-lg font-semibold text-primary">Returns &amp; exchanges</h2>
                        <p className="mt-3 text-sm leading-relaxed text-tertiary">
                            Unused merchandise with the receipt can be returned within 30 days at any of the nine MCG pro shops. Gift cards, range tokens and
                            special orders are final sale. Sizes can be exchanged at the counter while you're there.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Button href="/shop" color="primary" size="lg" iconLeading={ShoppingBag03} className="w-full">
                                Back to the Pro Shop
                            </Button>
                            <Button href="/account" color="secondary" size="lg" iconLeading={RefreshCcw01} className="w-full">
                                View order in my account
                            </Button>
                        </div>
                    </section>

                    {/* -------------------------------- Help ------------------------------ */}
                    <section className="border-t border-secondary px-7 py-7">
                        <h2 className="text-lg font-semibold text-primary">Where to find help</h2>
                        <div className="mt-5 flex flex-col gap-5">
                            <div className="flex gap-3">
                                <Phone className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-semibold text-primary">Questions about this order</p>
                                    <p className="mt-1 text-sm text-tertiary">
                                        Call the {course.name} pro shop on{" "}
                                        <a href="tel:3017621600" className="font-medium text-brand-secondary hover:underline">
                                            {MCG.phone}
                                        </a>{" "}
                                        and quote {order.number}.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <LifeBuoy01 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-semibold text-primary">Trouble with the receipt or your account</p>
                                    <p className="mt-1 text-sm text-tertiary">
                                        Email{" "}
                                        <a href={`mailto:${MCG.email}`} className="font-medium text-brand-secondary hover:underline">
                                            {MCG.email}
                                        </a>{" "}
                                        — the county golf office answers weekdays.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </McgPage>
        </McgShell>
    );
};
