import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ArrowLeft, Calendar, CheckCircle, Clock, MarkerPin01, Minus, Plus, Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { GOLF_EVENTS, type GolfEvent } from "@/components/events/events-catalog";
import { cx } from "@/utils/cx";
import { CONCEPT_UI } from "./events-ui";
import { money, StarRating } from "./store-ui";
import { SAGAMORE_CLUB, SiteFooter, TopNav } from "./tenfore-chrome";

/**
 * "Tenfore Fox / Events / Event Details" — a single-event page modeled on the
 * Resy event layout: hero image, an about / what's-included / host / where /
 * policy column, and a sticky registration card (quantity stepper, price, total,
 * Register). Re-skinned with design-system tokens.
 */
const meta: Meta = {
    title: "Global Nav/Events/Event Details",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const unitNoun = (unit: string) =>
    unit.includes("team") ? "Teams" : unit.includes("family") ? "Families" : unit.includes("couple") ? "Couples" : unit.includes("junior") ? "Juniors" : "Players";

const Row = ({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) => (
    <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <div>
            <p className="text-xs font-medium tracking-wide text-quaternary uppercase">{label}</p>
            <p className="text-sm text-secondary">{value}</p>
        </div>
    </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-semibold text-primary">{children}</h2>;

interface Registration {
    registeredOn: string;
    paidOn: string;
    amountPaid: number;
    players: number;
}

const EventDetail = ({ event, registration }: { event: GolfEvent; registration?: Registration }) => {
    const cs = CONCEPT_UI[event.concept];
    const soldOut = event.spotsLeft === 0;
    const maxQty = Math.min(event.spotsLeft || 0, 8);
    const [qty, setQty] = useState(1);
    const related = GOLF_EVENTS.filter((e) => e.id !== event.id && e.concept === event.concept).slice(0, 3);
    const initials = event.host
        ? event.host
              .replace(/,.*$/, "")
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
        : "";

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Events" club={SAGAMORE_CLUB} />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
                <button type="button" className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary">
                    <ArrowLeft className="size-4" aria-hidden="true" /> All events
                </button>

                {/* Hero */}
                <div className="relative aspect-[5/2] w-full overflow-hidden rounded-3xl bg-secondary_subtle ring-1 ring-secondary ring-inset">
                    <img src={event.image} alt={event.title} className="size-full object-cover" />
                </div>

                {/* Title block */}
                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", cs.bg, cs.fg)}>
                        <cs.Icon className="size-3.5" aria-hidden="true" />
                        {cs.label}
                    </span>
                    {event.charity && <span className="rounded-full bg-utility-pink-50 px-3 py-1 text-xs font-semibold text-utility-pink-700">Charity · proceeds donated</span>}
                    {event.featured && <span className="rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-brand-secondary">Featured</span>}
                </div>
                <h1 className="mt-3 max-w-3xl text-display-sm font-semibold text-primary">{event.title}</h1>
                <p className="mt-2 text-md font-semibold text-brand-secondary">{event.presenter}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-tertiary">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
                        {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="size-4 text-fg-quaternary" aria-hidden="true" />
                        {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MarkerPin01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                        {event.location}
                    </span>
                    <StarRating rating={event.rating} count={event.reviews} />
                </div>

                {/* Two-column body */}
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
                            <SectionTitle>Event details</SectionTitle>
                            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <Row icon={Calendar} label="Date" value={event.date} />
                                <Row icon={Clock} label="Time" value={event.time} />
                                <Row icon={Users01} label="Format" value={event.format} />
                                <Row icon={MarkerPin01} label="Location" value={`${event.location} · ${SAGAMORE_CLUB.name}`} />
                                {event.ageGroup && <Row icon={Users01} label="Eligibility" value={event.ageGroup} />}
                                {event.series && <Row icon={Calendar} label="Series" value={event.series} />}
                            </div>
                        </section>

                        {event.host && (
                            <section className="border-t border-secondary pt-8">
                                <SectionTitle>Your host</SectionTitle>
                                <div className="mt-4 flex items-center gap-4">
                                    <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-primary text-lg font-semibold text-brand-secondary ring-1 ring-secondary ring-inset">
                                        {initials}
                                    </span>
                                    <div>
                                        <p className="text-md font-semibold text-primary">{event.host}</p>
                                        <p className="text-sm text-tertiary">Sagamore teaching professional — leading clinics and player development at the club.</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>Where</SectionTitle>
                            <p className="mt-3 text-sm font-medium text-secondary">{SAGAMORE_CLUB.name}</p>
                            <p className="text-sm text-tertiary">{SAGAMORE_CLUB.addressLine}</p>
                            <p className="mt-1 text-sm text-tertiary">Check in at the {event.location}.</p>
                        </section>

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>Know before you go</SectionTitle>
                            <p className="mt-3 text-sm text-tertiary">
                                Free cancellation up to 48 hours before start time. Registration is {event.priceUnit}; please arrive 15 minutes early to check in. Weather updates are sent by email.
                            </p>
                        </section>
                    </div>

                    {/* Sticky card — registration form, or the receipt once registered */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 rounded-2xl bg-primary p-5 shadow-lg ring-1 ring-secondary">
                            {registration ? (
                                <>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-secondary px-3 py-1 text-xs font-semibold text-success-primary">
                                        <CheckCircle className="size-3.5" aria-hidden="true" /> Registered
                                    </span>
                                    <p className="mt-3 text-md font-semibold text-primary">You're all set</p>
                                    <p className="text-sm text-tertiary">
                                        {event.date} · {event.time}
                                    </p>
                                    <dl className="mt-4 flex flex-col gap-2.5 border-t border-secondary pt-4 text-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <dt className="text-tertiary">Registered on</dt>
                                            <dd className="font-medium text-primary">{registration.registeredOn}</dd>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <dt className="text-tertiary">{unitNoun(event.priceUnit)}</dt>
                                            <dd className="font-medium text-primary tabular-nums">{registration.players}</dd>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <dt className="text-tertiary">Amount paid</dt>
                                            <dd className="font-semibold text-primary tabular-nums">{money(registration.amountPaid)}</dd>
                                        </div>
                                        <div className="flex items-start justify-between gap-3">
                                            <dt className="text-tertiary">Paid on</dt>
                                            <dd className="text-right text-secondary">
                                                {registration.paidOn}
                                                <br />
                                                Visa ···· 0497
                                            </dd>
                                        </div>
                                    </dl>
                                    <Button size="lg" color="secondary" className="mt-4 w-full" iconLeading={Calendar}>
                                        Add to calendar
                                    </Button>
                                    <button type="button" className="mt-3 w-full text-center text-sm font-semibold text-error-primary">
                                        Cancel registration
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-display-xs font-semibold text-primary tabular-nums">{money(event.price)}</span>
                                        <span className="text-sm text-tertiary">{event.priceUnit}</span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-secondary">
                                        <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
                                        {event.date} · {event.time}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-secondary p-3">
                                        <div>
                                            <p className="text-sm font-semibold text-primary">{unitNoun(event.priceUnit)}</p>
                                            <p className={cx("text-xs tabular-nums", event.spotsLeft <= 6 && event.spotsLeft > 0 ? "text-warning-primary" : "text-tertiary")}>
                                                {soldOut ? "Sold out" : `${event.spotsLeft} spots left`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                aria-label="Decrease"
                                                disabled={qty <= 1 || soldOut}
                                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                                className="flex size-8 items-center justify-center rounded-full ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:opacity-50"
                                            >
                                                <Minus className="size-4 text-fg-secondary" aria-hidden="true" />
                                            </button>
                                            <span className="w-5 text-center text-sm font-semibold text-primary tabular-nums">{qty}</span>
                                            <button
                                                type="button"
                                                aria-label="Increase"
                                                disabled={qty >= maxQty || soldOut}
                                                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                                                className="flex size-8 items-center justify-center rounded-full ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:opacity-50"
                                            >
                                                <Plus className="size-4 text-fg-secondary" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-secondary pt-4 text-sm">
                                        <span className="text-tertiary">
                                            {money(event.price)} × {qty}
                                        </span>
                                        <span className="font-semibold text-primary tabular-nums">{money(event.price * qty)}</span>
                                    </div>

                                    <Button size="lg" color="primary" className="mt-4 w-full" isDisabled={soldOut}>
                                        {soldOut ? "Sold out" : "Register"}
                                    </Button>
                                    <p className="mt-2.5 text-center text-xs text-tertiary">Free cancellation up to 48 hours before</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related */}
                {related.length > 0 && (
                    <section className="mt-14 border-t border-secondary pt-8">
                        <SectionTitle>More {cs.label.toLowerCase()} events</SectionTitle>
                        <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((e) => (
                                <RelatedCard key={e.id} event={e} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <SiteFooter club={SAGAMORE_CLUB} />
        </div>
    );
};

/** A slim related-event tile (avoids the full card's grid assumptions). */
const RelatedCard = ({ event }: { event: GolfEvent }) => (
    <div className="flex flex-col">
        <div className="aspect-[3/2] w-full overflow-hidden rounded-2xl ring-1 ring-secondary ring-inset">
            <img src={event.image} alt={event.title} loading="lazy" className="size-full object-cover" />
        </div>
        <p className="mt-3 text-sm font-semibold text-brand-secondary">{event.presenter}</p>
        <p className="mt-0.5 line-clamp-2 text-md font-semibold text-primary">{event.title}</p>
        <p className="mt-1 text-sm text-tertiary">
            {event.date} · {event.time}
        </p>
    </div>
);

export const Default: Story = {
    name: "Event Details",
    render: () => <EventDetail event={GOLF_EVENTS.find((e) => e.id === "scramble-summer-kickoff")!} />,
};

export const Clinic: Story = {
    name: "Event Details · Clinic",
    render: () => <EventDetail event={GOLF_EVENTS.find((e) => e.id === "clinic-short-game")!} />,
};

export const Charity: Story = {
    name: "Event Details · Charity",
    render: () => <EventDetail event={GOLF_EVENTS.find((e) => e.id === "charity-pink-out")!} />,
};

export const Registered: Story = {
    name: "Event Details · Registered",
    render: () => (
        <EventDetail
            event={GOLF_EVENTS.find((e) => e.id === "scramble-summer-kickoff")!}
            registration={{ registeredOn: "Jun 24, 2026", paidOn: "Jun 24, 2026", amountPaid: 120, players: 1 }}
        />
    ),
};
