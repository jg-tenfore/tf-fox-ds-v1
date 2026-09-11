"use client";

/**
 * `/cart/checkout` — contact, pickup course, card, pay.
 *
 * The county doesn't ship. Every order is collected at a pro shop counter, so the step
 * that would be a shipping address in a retail checkout is a choice between nine
 * courses — each with its own hours and its own turnaround. That choice is the only
 * required decision on this page; everything else is prefilled from the session.
 *
 * Paying writes the order twice: `checkout()` turns the cart into an `ActivityItem` the
 * account page can read, and `writeOrder()` stashes the receipt for the confirmation
 * screen. Then the router pushes to `/cart/confirmation`.
 */

import { useState } from "react";
import { ArrowLeft, Check, Clock, CreditCard01, Lock01, Mail01, Phone, ShoppingBag03 } from "@untitledui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { TextArea } from "@/components/base/textarea/textarea";
import { mcgCourses } from "@/components/foundations/mcg/mcg-assets";
import { McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import { type ActivityItem, type CartLine, DEMO_USER, newId, useSession } from "@/components/mcg/session";
import { PICKUP_HOURS, PICKUP_READY, money } from "@/components/mcg/shop-catalog";
import { cx } from "@/utils/cx";
import { SAVED_CARDS, type ShopOrder, countOf, nextOrderNumber, subtotalOf, taxOn, writeOrder } from "./order";
import { MicroLabel, Panel, SummaryRow } from "./shop-ui";

/* ------------------------------------------------------------------ */
/* Step rail                                                           */
/* ------------------------------------------------------------------ */

const STEPS = ["Cart", "Checkout", "Confirmation"];

const StepRail = ({ current }: { current: number }) => (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        {STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-3">
                <span className={cx("flex items-center gap-2", index === current ? "font-semibold text-primary" : "text-tertiary")}>
                    <span
                        className={cx(
                            "flex size-6 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                            index < current && "bg-brand-secondary text-brand-secondary",
                            index === current && "bg-brand-solid text-white",
                            index > current && "bg-secondary text-quaternary",
                        )}
                    >
                        {index < current ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
                    </span>
                    {step}
                </span>
                {index < STEPS.length - 1 && <span className="h-px w-6 bg-quaternary" aria-hidden="true" />}
            </li>
        ))}
    </ol>
);

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export interface CheckoutScreenProps {
    /** Storybook fixture. Omit in the app so the session drives the screen. */
    lines?: CartLine[];
}

export const CheckoutScreen = ({ lines: fixture }: CheckoutScreenProps) => {
    const router = useRouter();
    const session = useSession();
    const user = session.user ?? DEMO_USER;

    const lines = fixture ?? session.cart;

    const [first, setFirst] = useState(user.first);
    const [last, setLast] = useState(user.last);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [courseSlug, setCourseSlug] = useState(session.courseSlug || mcgCourses[0].slug);
    const [cardId, setCardId] = useState(SAVED_CARDS[0].id);
    const [note, setNote] = useState("");
    const [textMe, setTextMe] = useState(true);
    const [isPaying, setIsPaying] = useState(false);

    const count = countOf(lines);
    const subtotal = subtotalOf(lines);
    const tax = taxOn(subtotal);
    const total = subtotal + tax;

    const course = mcgCourses.find((c) => c.slug === courseSlug) ?? mcgCourses[0];
    const card = SAVED_CARDS.find((c) => c.id === cardId) ?? SAVED_CARDS[0];

    const pay = () => {
        setIsPaying(true);

        const now = new Date();
        const order: ShopOrder = {
            number: nextOrderNumber(),
            placedLabel: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            courseSlug: course.slug,
            name: `${first} ${last}`.trim(),
            email,
            phone,
            card: { brand: card.brand, last4: card.last4, logo: card.logo },
            lines,
            subtotal,
            tax,
            total,
        };
        writeOrder(order);

        const activity: ActivityItem = {
            id: newId("purchase"),
            kind: "purchase",
            title: `Pro Shop order · ${count} ${count === 1 ? "item" : "items"}`,
            detail: `Collect at ${course.name} — order ${order.number}`,
            isoDate: now.toISOString().slice(0, 10),
            dateLabel: order.placedLabel,
            courseSlug: course.slug,
            amount: total,
            status: "Upcoming",
        };
        session.checkout([activity]);

        router.push("/cart/confirmation");
    };

    /* ----------------------------- Empty cart ----------------------------- */
    if (lines.length === 0) {
        return (
            <McgShell>
                <McgPage width="3xl">
                    <div className="flex flex-col items-center gap-3 rounded-2xl bg-primary px-6 py-16 text-center ring-1 ring-secondary ring-inset">
                        <h1 className="text-xl font-semibold text-primary">There's nothing to check out</h1>
                        <p className="max-w-md text-sm text-tertiary">
                            Your cart emptied out — add something from the Pro Shop and we'll hold it at the counter.
                        </p>
                        <Button href="/shop" color="primary" size="md" className="mt-2">
                            Back to the Pro Shop
                        </Button>
                    </div>
                </McgPage>
            </McgShell>
        );
    }

    return (
        <McgShell>
            <McgPage>
                <div className="flex flex-col gap-4">
                    <StepRail current={1} />
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-display-sm font-semibold text-primary">Checkout</h1>
                            <p className="mt-2 text-md text-tertiary">Pick the counter you'll collect from, confirm your card, and we'll have it bagged.</p>
                        </div>
                        <Button href="/cart" color="link-gray" size="md" iconLeading={ArrowLeft}>
                            Back to cart
                        </Button>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                    {/* ------------------------------- Form ------------------------------- */}
                    <div className="flex flex-col gap-6">
                        <Panel title="Contact">
                            <div className="flex flex-col gap-4 px-5 py-5">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Input label="First name" value={first} onChange={setFirst} isRequired />
                                    <Input label="Last name" value={last} onChange={setLast} isRequired />
                                </div>
                                <Input
                                    label="Email"
                                    type="email"
                                    icon={Mail01}
                                    value={email}
                                    onChange={setEmail}
                                    hint="Your receipt and pickup notice go here."
                                    isRequired
                                />
                                <Input label="Mobile" type="tel" icon={Phone} value={phone} onChange={setPhone} isRequired />
                                <Checkbox
                                    label="Text me when the order is on the counter"
                                    hint="We only text about this order."
                                    isSelected={textMe}
                                    onChange={setTextMe}
                                />
                            </div>
                        </Panel>

                        {/* Pickup — the county model. No shipping options anywhere on this page. */}
                        <Panel
                            title="Collect from"
                            action={
                                <Badge color="brand" size="sm" type="pill-color">
                                    Pickup only
                                </Badge>
                            }
                        >
                            <div className="flex flex-col gap-3 px-5 py-5">
                                <p className="text-sm text-tertiary">
                                    Montgomery County Golf doesn't ship. Choose the pro shop that's convenient — any of the nine can hold your order for 14
                                    days.
                                </p>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {mcgCourses.map((option) => {
                                        const isActive = option.slug === courseSlug;
                                        return (
                                            <button
                                                key={option.slug}
                                                type="button"
                                                onClick={() => setCourseSlug(option.slug)}
                                                aria-pressed={isActive}
                                                className={cx(
                                                    "flex items-start gap-3 rounded-xl p-4 text-left transition duration-100 ease-linear ring-inset",
                                                    isActive
                                                        ? "bg-brand-secondary ring-2 ring-brand"
                                                        : "bg-primary ring-1 ring-secondary hover:bg-primary_hover",
                                                )}
                                            >
                                                <RadioButtonBase size="md" isSelected={isActive} />
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex items-center gap-2">
                                                        <img src={option.logo} alt="" className="h-6 w-auto max-w-10 object-contain" loading="lazy" />
                                                        <span className="truncate text-sm font-semibold text-primary">{option.name}</span>
                                                    </span>
                                                    <span className="mt-1.5 block text-xs text-tertiary">{option.location}</span>
                                                    <span className="mt-0.5 block text-xs text-tertiary">{PICKUP_HOURS[option.slug]}</span>
                                                    <span className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-brand-secondary">
                                                        <Clock className="size-3.5" aria-hidden="true" />
                                                        {PICKUP_READY[option.slug]}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <TextArea
                                    label="Note for the shop (optional)"
                                    placeholder="e.g. holding this for my son's birthday — please don't open the box."
                                    rows={2}
                                    value={note}
                                    onChange={setNote}
                                />
                            </div>
                        </Panel>

                        <Panel
                            title="Payment"
                            action={
                                <span className="flex items-center gap-1.5 text-xs font-medium text-tertiary">
                                    <Lock01 className="size-3.5" aria-hidden="true" /> Secured by the county payment gateway
                                </span>
                            }
                        >
                            <div className="flex flex-col gap-3 px-5 py-5">
                                {SAVED_CARDS.map((option) => {
                                    const isActive = option.id === cardId;
                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => setCardId(option.id)}
                                            aria-pressed={isActive}
                                            className={cx(
                                                "flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition duration-100 ease-linear ring-inset",
                                                isActive ? "bg-brand-secondary ring-2 ring-brand" : "bg-primary ring-1 ring-secondary hover:bg-primary_hover",
                                            )}
                                        >
                                            <RadioButtonBase size="md" isSelected={isActive} />
                                            <img src={option.logo} alt="" className="h-6 w-auto shrink-0" />
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-semibold text-primary">
                                                    {option.brand} ···· {option.last4}
                                                </span>
                                                <span className="block text-xs text-tertiary tabular-nums">Expires {option.exp}</span>
                                            </span>
                                            {option.isDefault && (
                                                <Badge color="gray" size="sm" type="modern">
                                                    Default
                                                </Badge>
                                            )}
                                        </button>
                                    );
                                })}
                                <button
                                    type="button"
                                    className="flex items-center gap-2 self-start text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline"
                                >
                                    <CreditCard01 className="size-4" aria-hidden="true" /> Use a different card
                                </button>
                                <p className="text-xs text-tertiary">
                                    You can also pay at the counter when you collect — call the shop and we'll switch the order over.
                                </p>
                            </div>
                        </Panel>
                    </div>

                    {/* ------------------------------ Summary ----------------------------- */}
                    <aside className="flex flex-col gap-4">
                        <Panel
                            title="Order summary"
                            action={
                                <Link href="/cart" className="text-xs font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline">
                                    Edit
                                </Link>
                            }
                        >
                            <div className="flex flex-col gap-4 border-b border-secondary px-5 py-4">
                                {lines.map((line) => (
                                    <div key={line.id} className="flex items-center gap-3">
                                        <div className="relative size-12 shrink-0">
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
                                                <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary-solid text-[10px] font-semibold text-white tabular-nums">
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

                            <div className="flex flex-col gap-2.5 px-5 py-4 text-sm">
                                <SummaryRow label={`Subtotal · ${count} ${count === 1 ? "item" : "items"}`} value={money(subtotal)} />
                                <SummaryRow label="Counter pickup" value="Free" tone="credit" />
                                <SummaryRow label="Maryland sales tax (6%)" value={money(tax)} />
                                <SummaryRow label="Total" value={money(total)} tone="total" />
                            </div>
                        </Panel>

                        <div className="flex flex-col gap-2 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
                            <MicroLabel>Collecting from</MicroLabel>
                            <div className="flex items-center gap-2.5">
                                <img src={course.logo} alt="" className="h-8 w-auto max-w-12 object-contain" />
                                <div>
                                    <p className="text-sm font-semibold text-primary">{course.name}</p>
                                    <p className="text-xs text-tertiary">{course.location}</p>
                                </div>
                            </div>
                            <p className="text-xs text-tertiary">{PICKUP_HOURS[course.slug]}</p>
                            <p className="text-xs font-medium text-brand-secondary">{PICKUP_READY[course.slug]}</p>
                        </div>

                        <Button
                            color="primary"
                            size="xl"
                            iconLeading={ShoppingBag03}
                            className="w-full"
                            isLoading={isPaying}
                            showTextWhileLoading
                            onClick={pay}
                        >
                            Pay {money(total)}
                        </Button>
                        <p className="text-center text-xs text-tertiary">
                            Bring photo ID to the counter. Orders are held 14 days, then refunded to the card above.
                        </p>
                    </aside>
                </div>
            </McgPage>
        </McgShell>
    );
};
