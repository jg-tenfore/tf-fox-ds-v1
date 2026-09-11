"use client";

/**
 * `/events/[id]` — one county event.
 *
 * Registration goes through the cart (`addToCart`, kind `"event"`) rather than
 * straight to activity. A county golfer regularly signs two juniors into a qualifier
 * and themselves into the senior scramble in one sitting, and the prototype should
 * let them pay once — so every registration in the Events section lands in the same
 * cart the Pro Shop and Tee Times use.
 *
 * A full event does not disable the card: it swaps the register action for a
 * waitlist join, which is the behaviour the Academy screens already settled on.
 */

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell01, Calendar, CheckCircle, Clock, InfoCircle, MarkerPin01, ShoppingCart01, Ticket02, Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { MCG, McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import {
    CATEGORY_UI,
    COURSE_NAME,
    eventById,
    fmtDate,
    isFull,
    MCG_EVENTS,
    type McgEvent,
    money0,
    spotsLeft,
} from "@/components/mcg/events-catalog";
import { useSession } from "@/components/mcg/session";
import { cx } from "@/utils/cx";
import { Capacity, CategoryPill, CourseChip, MetaLine, RelatedEventCard, SectionTitle, Stepper } from "./events-ui";

const money = (n: number) => (n === 0 ? "Free" : `$${n.toFixed(2)}`);

/** What one unit of this event's price buys — a player, a team, a couple, a family. */
const unitNoun = (unit: string) =>
    unit.includes("couple") ? "Couples" : unit.includes("family") ? "Families" : unit.includes("team") ? "Teams" : unit.includes("junior") ? "Juniors" : "Players";

const Row = ({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) => (
    <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <div>
            <p className="text-xs font-medium tracking-wide text-quaternary uppercase">{label}</p>
            <p className="text-sm text-secondary">{value}</p>
        </div>
    </div>
);

/* ------------------------------------------------------------------ */
/* Registration card                                                   */
/* ------------------------------------------------------------------ */

const RegisterCard = ({ event }: { event: McgEvent }) => {
    const { addToCart, cart } = useSession();
    const left = spotsLeft(event);
    const full = isFull(event);
    const noun = unitNoun(event.priceUnit);
    const [qty, setQty] = useState(1);
    const [waitlisted, setWaitlisted] = useState(false);

    const lineId = `event-${event.id}`;
    const inCart = cart.find((l) => l.id === lineId);
    const max = Math.min(left || 1, 8);

    const register = () =>
        addToCart({
            id: lineId,
            kind: "event",
            name: event.title,
            detail: `${fmtDate(event.isoDate)} · ${COURSE_NAME[event.courseSlug]}`,
            image: event.image,
            unitPrice: event.price,
            qty,
            href: `/events/${event.id}`,
        });

    if (waitlisted) {
        return (
            <div className="sticky top-6 rounded-2xl bg-primary p-5 shadow-lg ring-1 ring-secondary">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-secondary px-3 py-1 text-xs font-semibold text-warning-primary">
                    <Bell01 className="size-3.5" aria-hidden="true" /> On the waitlist
                </span>
                <p className="mt-3 text-md font-semibold text-primary">You're on the list</p>
                <p className="mt-1 text-sm text-tertiary">
                    The pro shop at {COURSE_NAME[event.courseSlug]} calls in order as spots open, usually in the week before play. Nothing is charged until you accept a spot.
                </p>
                <Button size="lg" color="secondary" href="/events" className="mt-4 w-full">
                    Back to all events
                </Button>
            </div>
        );
    }

    return (
        <div className="sticky top-6 rounded-2xl bg-primary p-5 shadow-lg ring-1 ring-secondary">
            <div className="flex items-baseline gap-1.5">
                <span className="text-display-xs font-semibold text-primary tabular-nums">{money0(event.price)}</span>
                <span className="text-sm text-tertiary">{event.priceUnit}</span>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                <MetaLine icon={Calendar}>{fmtDate(event.isoDate)}</MetaLine>
                <MetaLine icon={Clock}>{event.time}</MetaLine>
                <MetaLine icon={MarkerPin01}>{COURSE_NAME[event.courseSlug]}</MetaLine>
            </div>

            <div className="mt-4 border-t border-secondary pt-4">
                <Capacity capacity={event.capacity} registered={event.registered} />
            </div>

            {full ? (
                <>
                    <p className="mt-4 text-sm text-tertiary">
                        This field is full. Join the waitlist and the host course calls in order — most county events release four to six spots in the final week.
                    </p>
                    <Button size="lg" color="primary" className="mt-4 w-full" iconLeading={Bell01} onClick={() => setWaitlisted(true)}>
                        Join the waitlist
                    </Button>
                    <p className="mt-2.5 text-center text-xs text-tertiary">Free to join · nothing charged until you accept</p>
                </>
            ) : (
                <>
                    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-secondary p-3">
                        <div>
                            <p className="text-sm font-semibold text-primary">{noun}</p>
                            <p className="text-xs text-tertiary">Up to {max} per registration</p>
                        </div>
                        <Stepper value={qty} max={max} onChange={setQty} label={noun.toLowerCase()} />
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-secondary pt-4 text-sm">
                        <span className="text-tertiary tabular-nums">
                            {money(event.price)} × {qty}
                        </span>
                        <span className="font-semibold text-primary tabular-nums">{money(event.price * qty)}</span>
                    </div>

                    <Button size="lg" color="primary" className="mt-4 w-full" iconLeading={Ticket02} onClick={register}>
                        {inCart ? "Add another registration" : "Register"}
                    </Button>

                    {inCart && (
                        <Link
                            href="/cart"
                            className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline"
                        >
                            <ShoppingCart01 className="size-4" aria-hidden="true" />
                            {inCart.qty} in your cart — check out
                        </Link>
                    )}
                    <p className="mt-2.5 text-center text-xs text-tertiary">Free cancellation up to 48 hours before play</p>
                </>
            )}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const EventDetailScreen = ({ eventId }: { eventId: string }) => {
    const event = eventById(eventId);

    if (!event) {
        return (
            <McgShell>
                <McgPage width="3xl">
                    <h1 className="text-display-xs font-semibold text-primary">That event isn't on the calendar</h1>
                    <p className="mt-2 text-md text-tertiary">It may have finished, or the link may be out of date.</p>
                    <Button size="lg" href="/events" className="mt-6" iconLeading={ArrowLeft}>
                        All county events
                    </Button>
                </McgPage>
            </McgShell>
        );
    }

    const ui = CATEGORY_UI[event.category];
    // Same category first, then anything else at the same course — a golfer browsing
    // the senior scramble at Laytonsville wants the next senior scramble, or the next
    // thing at Laytonsville, in that order.
    const related = [
        ...MCG_EVENTS.filter((e) => e.id !== event.id && e.category === event.category),
        ...MCG_EVENTS.filter((e) => e.id !== event.id && e.category !== event.category && e.courseSlug === event.courseSlug),
    ].slice(0, 3);

    return (
        <McgShell>
            <McgPage width="6xl">
                <Link href="/events" className="mb-5 flex w-fit items-center gap-1.5 text-sm font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary">
                    <ArrowLeft className="size-4" aria-hidden="true" /> All county events
                </Link>

                {/* Hero */}
                <div className="relative aspect-[5/2] w-full overflow-hidden rounded-3xl bg-secondary_subtle ring-1 ring-secondary ring-inset">
                    <img src={event.image} alt="" className="size-full object-cover" />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                    <CategoryPill category={event.category} />
                    <CourseChip slug={event.courseSlug} />
                    {event.featured && <span className="rounded-full bg-brand-solid px-2.5 py-1 text-xs font-semibold text-white">Featured</span>}
                    {isFull(event) && <span className="rounded-full bg-error-secondary px-2.5 py-1 text-xs font-semibold text-error-primary">Waitlist only</span>}
                </div>

                <h1 className="mt-3 max-w-3xl text-display-sm font-semibold text-primary">{event.title}</h1>
                <p className="mt-2 text-md font-semibold text-brand-secondary">{event.organizer}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                    <MetaLine icon={Calendar}>{fmtDate(event.isoDate)}</MetaLine>
                    <MetaLine icon={Clock}>{event.time}</MetaLine>
                    <MetaLine icon={MarkerPin01}>{event.location}</MetaLine>
                    <MetaLine icon={Users01}>{event.format}</MetaLine>
                </div>

                {/* Body */}
                <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-3">
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        <section>
                            <SectionTitle>About this event</SectionTitle>
                            <p className="mt-3 text-md text-secondary">{event.description}</p>
                        </section>

                        <section>
                            <SectionTitle>What's included</SectionTitle>
                            <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {event.included.map((item) => (
                                    <li key={item} className="flex items-start gap-2.5">
                                        <CheckCircle className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                        <span className="text-sm text-secondary">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>Format &amp; eligibility</SectionTitle>
                            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <Row icon={Users01} label="Format" value={event.format} />
                                <Row icon={Ticket02} label="Entry" value={`${money0(event.price)} ${event.priceUnit}`} />
                                {event.eligibility && <Row icon={CheckCircle} label="Who can play" value={event.eligibility} />}
                                {event.series && <Row icon={Calendar} label="Series" value={event.series} />}
                                <Row icon={Clock} label="Check-in" value={event.location} />
                                <Row icon={InfoCircle} label="Run by" value={event.organizer} />
                            </div>
                        </section>

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>The course</SectionTitle>
                            <div className="mt-4 flex flex-col gap-3">
                                <CourseChip slug={event.courseSlug} size="md" />
                                <p className="text-sm text-tertiary">
                                    {COURSE_NAME[event.courseSlug]} is one of nine public courses run by {MCG.name}. Check in at {event.location.toLowerCase()}; the range opens an hour
                                    before the first tee time, and range balls are included in your entry.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Button size="sm" color="secondary" href="/tee-times">
                                        Book a practice round here
                                    </Button>
                                    <Button size="sm" color="link-color" href="/calendar">
                                        See everything at this course
                                    </Button>
                                </div>
                            </div>
                        </section>

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>Know before you go</SectionTitle>
                            <ul className="mt-3 flex flex-col gap-2">
                                {[
                                    "Arrive 30 minutes before your start time to check in at the pro shop.",
                                    "Free cancellation up to 48 hours before play; inside 48 hours the entry becomes a course credit.",
                                    "Weather calls are made two hours before the shotgun and sent by text and email.",
                                    "County residents already have a golf card on file — bring it, or look it up at check-in.",
                                ].map((line) => (
                                    <li key={line} className="flex items-start gap-2.5 text-sm text-tertiary">
                                        <span className={cx("mt-1.5 size-1.5 shrink-0 rounded-full", ui.dot)} />
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <RegisterCard event={event} />
                    </div>
                </div>

                {related.length > 0 && (
                    <section className="mt-14 border-t border-secondary pt-8">
                        <SectionTitle sub="Other county programming you can still get into.">More like this</SectionTitle>
                        <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((e) => (
                                <RelatedEventCard key={e.id} event={e} />
                            ))}
                        </div>
                    </section>
                )}
            </McgPage>
        </McgShell>
    );
};
