"use client";

/**
 * `/grill/order` — the order-ahead confirmation.
 *
 * The whole point of ordering ahead is the pickup window, so that is the headline and
 * everything else is a receipt underneath it. The order number is what the golfer
 * reads out at the counter; it's deliberately short and spoken, not a UUID.
 *
 * The order arrives from `/grill` through the one-hop handoff in `grill-menu`. Opened
 * cold — a shared link, or a Storybook story — it falls back to a sample order so the
 * screen is never empty.
 */
import { useEffect, useState } from "react";
import { Calendar, CheckCircle, Clock, MarkerPin01, Phone, Receipt, Tag01, Ticket02 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { COURSE_NAME } from "@/components/instruction/instruction-catalog";
import { type GrillOrder, PICKUP, SAMPLE_ORDER, lineCount, money, readStashedOrder, venueBySlug } from "../grill-menu";
import { McgPage, McgShell } from "../mcg-chrome";
import { CourseChip, MetaLine, MicroLabel, SectionTitle, SummaryLine } from "./grill-ui";

export interface GrillOrderScreenProps {
    /** Force a specific order — how the stories stay deterministic. */
    order?: GrillOrder;
}

export const GrillOrderScreen = ({ order: forced }: GrillOrderScreenProps) => {
    // Read the handoff after mount so the server-rendered HTML and the first client
    // render agree — the same rule the session provider follows.
    const [order, setOrder] = useState<GrillOrder>(forced ?? SAMPLE_ORDER);
    useEffect(() => {
        if (forced) return;
        const stashed = readStashedOrder();
        if (stashed) setOrder(stashed);
    }, [forced]);

    const venue = venueBySlug(order.venueSlug);
    const pickup = PICKUP[order.pickup];
    const count = lineCount(order.lines);
    // An order stashed by an older build of the prototype has no `savings` field, so
    // the receipt treats a missing saving as no saving rather than as a broken total.
    const savings = order.savings ?? 0;

    return (
        <McgShell>
            <McgPage width="3xl">
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-success-secondary">
                        <CheckCircle className="size-7 text-fg-success-primary" aria-hidden="true" />
                    </span>
                    <h1 className="text-display-sm font-semibold text-primary">Order in</h1>
                    <p className="max-w-lg text-md text-tertiary">
                        {venue?.name} has it. Give them the order number at the counter — nothing has been charged, you pay when you pick it up.
                    </p>
                </div>

                {/* The two things that matter, big: the number and the window. */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <MicroLabel>Order number</MicroLabel>
                        <span className="text-display-xs font-semibold text-primary tabular-nums">{order.number}</span>
                        <MetaLine icon={Ticket02}>
                            {count} {count === 1 ? "item" : "items"} · pay at pickup
                        </MetaLine>
                        {savings > 0 && (
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-success-primary">
                                <Tag01 className="size-4 shrink-0" aria-hidden="true" />
                                {money(savings)} off with today&rsquo;s deals
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <MicroLabel>Pickup</MicroLabel>
                        <span className="text-lg font-semibold text-primary">{pickup.label}</span>
                        <MetaLine icon={Clock}>{order.readyLabel}</MetaLine>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-secondary pb-5">
                        <div className="flex flex-col gap-2">
                            <span className="text-md font-semibold text-primary">{venue?.name}</span>
                            <CourseChip slug={order.venueSlug} />
                        </div>
                        <Badge color="success" size="md" type="pill-color">
                            Confirmed
                        </Badge>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <MicroLabel>Where</MicroLabel>
                            <MetaLine icon={MarkerPin01}>{venue?.where}</MetaLine>
                            <MetaLine icon={Phone}>{venue?.phone}</MetaLine>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <MicroLabel>When</MicroLabel>
                            <MetaLine icon={Calendar}>{order.placedLabel}</MetaLine>
                            <MetaLine icon={Clock}>{pickup.detail}</MetaLine>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-secondary pt-5">
                        <MicroLabel>Your order</MicroLabel>
                        {order.lines.map((l) => (
                            <div key={l.itemId} className="flex items-baseline justify-between gap-4">
                                <span className="flex min-w-0 flex-col gap-0.5">
                                    <span className="text-sm text-secondary">
                                        <span className="font-semibold text-primary tabular-nums">{l.qty}×</span> {l.name}
                                        {l.offerId && (
                                            <Badge color="success" size="sm" type="pill-color" className="ml-2 align-middle">
                                                Deal
                                            </Badge>
                                        )}
                                    </span>
                                    {l.detail && <span className="text-xs text-tertiary">{l.detail}</span>}
                                </span>
                                <span className="shrink-0 text-sm text-secondary tabular-nums">{money(l.price * l.qty)}</span>
                            </div>
                        ))}
                    </div>

                    {order.note && (
                        <div className="bg-secondary_subtle rounded-xl px-4 py-3.5">
                            <p className="text-sm text-tertiary">
                                <span className="font-semibold text-secondary">Your note: </span>
                                {order.note}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col border-t border-secondary pt-5">
                        {savings > 0 ? (
                            <>
                                <SummaryLine label="À la carte" value={money(order.subtotal + savings)} />
                                <SummaryLine label="Deals" value={`− ${money(savings)}`} credit />
                                <SummaryLine label="Subtotal" value={money(order.subtotal)} />
                            </>
                        ) : (
                            <SummaryLine label="Subtotal" value={money(order.subtotal)} />
                        )}
                        <SummaryLine label="MD food tax (6%)" value={money(order.foodTax)} muted />
                        {order.alcoholTax > 0 && <SummaryLine label="MD alcohol tax (9%)" value={money(order.alcoholTax)} muted />}
                        <div className="mt-2 border-t border-secondary pt-2.5">
                            <SummaryLine label="Due at pickup" value={money(order.total)} strong />
                        </div>
                    </div>

                    {order.alcoholTax > 0 && (
                        <p className="bg-secondary_subtle rounded-xl px-4 py-3.5 text-sm text-tertiary">
                            There&rsquo;s alcohol on this order — bring ID. Cans only past the pro shop door, and the starter can refuse service on the tee.
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3 border-t border-secondary pt-5">
                        <Button size="md" color="primary" href="/grill" iconLeading={Receipt}>
                            Order something else
                        </Button>
                        <Button size="md" color="secondary" href="/account">
                            See it in my account
                        </Button>
                        <Button size="md" color="link-gray" href="/tee-times">
                            Back to tee times
                        </Button>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                    <SectionTitle sub="Call the counter if your group falls behind — they'll hold it rather than let it sit.">Running late?</SectionTitle>
                    <MetaLine icon={Phone}>
                        {venue?.name} · {venue?.phone}
                    </MetaLine>
                    <p className="text-sm text-tertiary">
                        Nothing has been charged. An order that isn&rsquo;t collected by close is cancelled on its own — no fee, no call needed.
                    </p>
                </div>

                <p className="mt-4 text-center text-xs text-quaternary">{COURSE_NAME[order.venueSlug]} · Montgomery County Golf</p>
            </McgPage>
        </McgShell>
    );
};

export default GrillOrderScreen;
