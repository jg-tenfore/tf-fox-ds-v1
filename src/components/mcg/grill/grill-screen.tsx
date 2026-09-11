"use client";

/**
 * `/grill` — food & drink across the nine MCG courses.
 *
 * The screen is one component in two states, driven by `step`, the same way the
 * Instruction flows work: pick a course, then order from that course's board. Keeping
 * both in one component is what lets a story open on either and stay clickable.
 *
 * The thing this screen is really for is the order-ahead. A muni golfer's problem is
 * not choosing between twelve burgers — it's that the turn takes twenty minutes when
 * the window has a line. So the order rail leads with *when you want it*, and the
 * pickup options a venue can honour come from the venue itself: a snack window cannot
 * fire a burger at 17, so it never offers to.
 *
 * Above the board sits the deals shelf. Offers are ordinary order lines — they go into
 * the same rail, under the same tax split — but they are a different *kind* of thing
 * from a menu item, so they get their own panel rather than a "specials" tab nobody
 * opens. Which deals a venue shows, and whether the clock allows them, are both
 * decided in `grill-menu`: this screen only renders the answer.
 */
import { useState } from "react";
import { AlertTriangle, ArrowLeft, Clock, InfoCircle, MarkerPin01, Phone, Star01 } from "@untitledui/icons";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { TextArea } from "@/components/base/textarea/textarea";
import { cx } from "@/utils/cx";
import {
    COURSE_VENUES,
    type GrillOrder,
    type MenuItem,
    NOW_MINUTES,
    OFFERS,
    type Offer,
    type OrderLine,
    PICKUP,
    type PickupId,
    READY_WINDOW,
    type SectionId,
    TODAY_ISO,
    TODAY_LABEL,
    VENUES,
    clockLabel,
    isAlcohol,
    itemById,
    lineCount,
    money,
    nextOrderNumber,
    offerById,
    offerLine,
    offersFor,
    priceOrder,
    sectionsFor,
    stashOrder,
    venueBySlug,
} from "../grill-menu";
import { McgHero, McgPage, McgShell } from "../mcg-chrome";
import { newId, useSession } from "../session";
import {
    CourseChip,
    HoursList,
    MenuItemRow,
    MenuTabs,
    MetaLine,
    MicroLabel,
    OfferCard,
    OffersShelf,
    QtyStepper,
    SectionTitle,
    SummaryLine,
    VenueCard,
    VenueKindBadge,
} from "./grill-ui";

export interface GrillScreenProps {
    /** "courses" opens the picker, "menu" opens a venue's board. */
    step?: "courses" | "menu";
    venueSlug?: string;
    /** Which menu tab is open. */
    section?: SectionId;
    /** Start with a plausible order already in the rail, for the order-ahead story. */
    seeded?: boolean;
    /** Offers already in the rail, by offer id — `{ "combo-burger": 2 }`. */
    seededOffers?: Record<string, number>;
    pickup?: PickupId;
    /**
     * The wall clock, in minutes past midnight, which decides which time-gated deals
     * are live. Defaults to the prototype's 9:20 AM; a story moves it to show the
     * early-bird open, or everything but the all-day deals shut.
     */
    nowMinutes?: number;
    /** Open the deals shelf fully expanded rather than showing the first six. */
    allDeals?: boolean;
}

/** What a seeded story starts with: two burgers, fries and a four-pack of Boh. */
const SEED: Record<string, number> = { "mcg-burger": 2, fries: 1, boh: 4 };

/** How many deals the shelf shows before it asks to be expanded. */
const SHELF_LIMIT = 6;

const COUNTS = {
    grill: VENUES.filter((v) => v.kind === "grill").length,
    window: VENUES.filter((v) => v.kind === "window").length,
    cart: VENUES.filter((v) => v.kind === "cart").length,
};

export const GrillScreen = ({
    step: initialStep = "courses",
    venueSlug: initialVenue = "falls-road",
    section: initialSection,
    seeded = false,
    seededOffers,
    pickup: initialPickup,
    nowMinutes = NOW_MINUTES,
    allDeals = false,
}: GrillScreenProps) => {
    const router = useRouter();
    const { addActivity } = useSession();

    const [step, setStep] = useState<"courses" | "menu">(initialStep);
    const [venueSlug, setVenueSlug] = useState(initialVenue);
    const [qty, setQty] = useState<Record<string, number>>(seeded ? SEED : {});
    // Offers are counted separately from items: they share the rail, but an offer id
    // and an item id live in different namespaces and must not collide.
    const [offerQty, setOfferQty] = useState<Record<string, number>>(seededOffers ?? {});
    const [note, setNote] = useState(seeded ? "Cart 22 — we'll be on 9 around 11:10." : "");
    const [expandedDeals, setExpandedDeals] = useState(allDeals);

    const venue = venueBySlug(venueSlug) ?? VENUES[0];
    const groups = sectionsFor(venueSlug);
    const deals = offersFor(venueSlug, nowMinutes);
    const shownDeals = expandedDeals ? deals : deals.slice(0, SHELF_LIMIT);
    const [section, setSection] = useState<SectionId>(initialSection ?? groups[0]?.section.id ?? "grill");
    const [pickup, setPickup] = useState<PickupId>(initialPickup ?? venue.pickup[0]?.id ?? "turn");

    const openVenue = (slug: string) => {
        const next = venueBySlug(slug);
        setVenueSlug(slug);
        setSection(sectionsFor(slug)[0]?.section.id ?? "grill");
        setPickup(next?.pickup[0]?.id ?? "turn");
        setQty({});
        setOfferQty({});
        setExpandedDeals(allDeals);
        setStep("menu");
    };

    const add = (id: string) => setQty((q) => ({ ...q, [id]: (q[id] ?? 0) + 1 }));
    const remove = (id: string) =>
        setQty((q) => {
            const next = (q[id] ?? 0) - 1;
            if (next <= 0) {
                const { [id]: _gone, ...rest } = q;
                return rest;
            }
            return { ...q, [id]: next };
        });

    /**
     * Add a deal.
     *
     * An offer built around a pickup point moves the rail to it — a turn special that
     * lands in an order set to "now, at the counter" is just a discount with a lie
     * attached — but only if this venue can honour that pickup in the first place.
     */
    const addOffer = (offer: Offer) => {
        setOfferQty((q) => ({ ...q, [offer.id]: (q[offer.id] ?? 0) + 1 }));
        if (offer.pickup && venue.pickup.some((p) => p.id === offer.pickup)) setPickup(offer.pickup);
    };

    const removeOffer = (id: string) =>
        setOfferQty((q) => {
            const next = (q[id] ?? 0) - 1;
            if (next <= 0) {
                const { [id]: _gone, ...rest } = q;
                return rest;
            }
            return { ...q, [id]: next };
        });

    /**
     * The rail's contents: deals first, because they're what the order is built around,
     * then the à-la-carte items in menu order so the receipt reads like the board.
     */
    const offerLines: OrderLine[] = Object.entries(offerQty)
        .map(([id, n]) => {
            const offer = offerById(id);
            return offer ? offerLine(offer, n) : null;
        })
        .filter((l): l is OrderLine => l !== null);

    const itemLines: OrderLine[] = Object.entries(qty)
        .map(([id, n]) => {
            const item = itemById(id);
            return item ? { itemId: id, name: item.name, price: item.price, qty: n, alcohol: isAlcohol(item) } : null;
        })
        .filter((l): l is OrderLine => l !== null);

    const lines: OrderLine[] = [...offerLines, ...itemLines];

    const totals = priceOrder(lines);
    const count = lineCount(lines);

    /**
     * Place the order.
     *
     * A grill order never touches the shared cart: it's paid at the window, it can't
     * ship with a Pro Shop order, and clearing the cart to check it out would take an
     * unrelated shopping basket with it. So it records a single `dining` activity —
     * the durable record that shows up under My account — and parks the line items for
     * the one hop to the confirmation.
     */
    const place = () => {
        const order: GrillOrder = {
            number: nextOrderNumber(),
            venueSlug,
            lines,
            pickup,
            readyLabel: READY_WINDOW[pickup],
            placedLabel: TODAY_LABEL,
            isoDate: TODAY_ISO,
            ...totals,
            note: note.trim() || undefined,
        };

        stashOrder(order);
        addActivity({
            id: newId("dining"),
            kind: "dining",
            title: venue.name,
            detail: [
                `Order ${order.number}`,
                `${count} ${count === 1 ? "item" : "items"}`,
                PICKUP[pickup].label.toLowerCase(),
                totals.savings > 0 ? `saved ${money(totals.savings)}` : null,
            ]
                .filter(Boolean)
                .join(" · "),
            isoDate: TODAY_ISO,
            dateLabel: TODAY_LABEL,
            timeLabel: order.readyLabel,
            courseSlug: venueSlug,
            amount: order.total,
            status: "Upcoming",
        });

        router.push("/grill/order/");
    };

    /* ================================================================ */
    /* 1 — Which course are you playing?                                */
    /* ================================================================ */
    if (step === "courses") {
        return (
            <McgShell>
                <McgHero
                    title="Food & drink at the turn"
                    blurb="Four of the nine courses run a full grill, three run a snack window, and Laytonsville and Rattlewood run a cart. Order ahead at any of the seven with a counter and it'll be waiting when you make the turn — and every board carries combos, turn specials and golf bundles priced under the parts."
                    right={
                        <div className="flex flex-wrap gap-3">
                            <StatTile n={COUNTS.grill} label="Full grills" />
                            <StatTile n={COUNTS.window} label="Snack windows" />
                            <StatTile n={COUNTS.cart} label="Cart only" />
                            <StatTile n={OFFERS.length} label="Deals running" />
                        </div>
                    }
                />
                <McgPage>
                    <SectionTitle sub="Every MCG course, and what you can actually get to eat there.">Where you&rsquo;re playing</SectionTitle>
                    <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {COURSE_VENUES.map(({ course, venue: v }) => (
                            <VenueCard key={course.slug} venue={v} selected={v.slug === venueSlug} onSelect={() => openVenue(v.slug)} />
                        ))}
                    </div>

                    <div className="mt-8 flex items-start gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <InfoCircle className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-primary">One county alcohol rule, nine courses</span>
                            <p className="max-w-3xl text-sm text-tertiary">
                                Cans only past the pro shop door — no glass on any MCG course. Wine by the glass and bottles at The Crossvines stay on the
                                terrace. Maryland charges 9% on alcohol and 6% on food, which is why your order shows two tax lines.
                            </p>
                        </div>
                    </div>
                </McgPage>
            </McgShell>
        );
    }

    /* ================================================================ */
    /* 2a — Cart only: a stock list, not a menu                         */
    /* ================================================================ */
    /**
     * Laytonsville and Rattlewood have no counter, so there is nothing to order ahead
     * and no rail to put it in. Showing an order form that can't be honoured would be
     * worse than showing none — so this is a stock list and a schedule, and the page
     * says so.
     */
    if (venue.kind === "cart") {
        return (
            <McgShell>
                <McgHero
                    title={venue.name}
                    blurb={venue.blurb}
                    right={
                        <div className="flex flex-col items-start gap-2.5 lg:items-end">
                            <VenueKindBadge venue={venue} size="md" />
                            <CourseChip slug={venue.slug} size="md" />
                        </div>
                    }
                />
                <McgPage width="5xl">
                    <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep("courses")}>
                        All nine courses
                    </Button>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <section className="flex flex-col gap-2.5 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                            <MicroLabel>When the cart runs</MicroLabel>
                            <HoursList venue={venue} />
                        </section>
                        <section className="flex flex-col gap-2.5 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                            <MicroLabel>Finding it</MicroLabel>
                            <MetaLine icon={MarkerPin01}>{venue.where}</MetaLine>
                            <MetaLine icon={Phone}>{venue.phone}</MetaLine>
                            <MetaLine icon={Clock}>Card and cash on the cart. No order-ahead.</MetaLine>
                        </section>
                    </div>

                    {deals.length > 0 && (
                        <div className="mt-6">
                            <OffersShelf
                                title="Deals the cart can do"
                                sub="No counter means no order-ahead, but the driver still rings a cooler pack as one item — and at one price."
                            >
                                {deals.map(({ offer, open: isOpen }) => (
                                    <OfferCard key={offer.id} offer={offer} open={isOpen} nowMinutes={nowMinutes} readOnly />
                                ))}
                            </OffersShelf>
                        </div>
                    )}

                    <div className="mt-6 flex flex-col gap-4">
                        <SectionTitle sub="Roughly what's on the cart, and what the pro shop cooler keeps the rest of the week.">On board</SectionTitle>
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            {groups
                                .flatMap((g) => g.items)
                                .map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between gap-4 rounded-xl bg-primary px-4 py-3 ring-1 ring-secondary ring-inset"
                                    >
                                        <div className="flex min-w-0 flex-col">
                                            <span className="text-sm font-semibold text-primary">{item.name}</span>
                                            <span className="text-xs text-tertiary">{item.desc}</span>
                                        </div>
                                        <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">{money(item.price)}</span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="mt-6 flex items-start gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <InfoCircle className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                        <p className="max-w-3xl text-sm text-tertiary">
                            Want a burger before you play Laytonsville? Needwood is eleven minutes up Muncaster Mill and the grill opens at 7.
                        </p>
                    </div>
                </McgPage>
            </McgShell>
        );
    }

    /* ================================================================ */
    /* 2b — The board, and the order rail                               */
    /* ================================================================ */
    const open = groups.find((g) => g.section.id === section) ?? groups[0];

    return (
        <McgShell>
            <McgHero
                title={venue.name}
                blurb={venue.blurb}
                right={
                    <div className="flex flex-col items-start gap-2.5 lg:items-end">
                        <VenueKindBadge venue={venue} size="md" />
                        <CourseChip slug={venue.slug} size="md" />
                    </div>
                }
            />
            <McgPage>
                <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep("courses")}>
                    All nine courses
                </Button>

                <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    {/* ---------------- the board ---------------- */}
                    <div className="flex flex-col gap-6">
                        <section className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset sm:p-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="flex flex-col gap-2.5">
                                    <MicroLabel>Hours</MicroLabel>
                                    <HoursList venue={venue} />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <MicroLabel>Finding it</MicroLabel>
                                    <MetaLine icon={MarkerPin01}>{venue.where}</MetaLine>
                                    <MetaLine icon={Phone}>{venue.phone}</MetaLine>
                                    <MetaLine icon={Clock}>Kitchen runs about 10 minutes behind a full tee sheet</MetaLine>
                                </div>
                            </div>
                            {venue.signature && (
                                <div className="bg-secondary_subtle flex items-start gap-2.5 rounded-xl px-4 py-3.5">
                                    <Star01 className="mt-0.5 size-4 shrink-0 fill-current text-fg-warning-secondary" aria-hidden="true" />
                                    <p className="text-sm text-tertiary">
                                        <span className="font-semibold text-secondary">Get this: </span>
                                        {venue.signature}
                                    </p>
                                </div>
                            )}
                        </section>

                        {deals.length > 0 && (
                            <OffersShelf
                                title={`Deals at ${venue.name}`}
                                sub={`Priced below the parts, rung as one item. It's ${clockLabel(nowMinutes)} — the deals that keep hours say so on the card.`}
                                action={
                                    deals.length > SHELF_LIMIT && (
                                        <Button size="sm" color="secondary" onClick={() => setExpandedDeals((v) => !v)}>
                                            {expandedDeals ? "Show fewer" : `See all ${deals.length} deals`}
                                        </Button>
                                    )
                                }
                            >
                                {shownDeals.map(({ offer, open: isOpen }) => (
                                    <OfferCard
                                        key={offer.id}
                                        offer={offer}
                                        open={isOpen}
                                        nowMinutes={nowMinutes}
                                        qty={offerQty[offer.id] ?? 0}
                                        onAdd={() => addOffer(offer)}
                                        onRemove={() => removeOffer(offer.id)}
                                    />
                                ))}
                            </OffersShelf>
                        )}

                        <div className="flex flex-col gap-4">
                            <MenuTabs
                                value={section}
                                onChange={setSection}
                                options={groups.map((g) => ({ id: g.section.id, label: g.section.label, count: g.items.length }))}
                            />
                            {open && (
                                <>
                                    <SectionTitle sub={open.section.blurb}>{open.section.label}</SectionTitle>
                                    <div className="flex flex-col gap-2.5">
                                        {open.items.map((item: MenuItem) => (
                                            <MenuItemRow
                                                key={item.id}
                                                item={item}
                                                qty={qty[item.id] ?? 0}
                                                onAdd={() => add(item.id)}
                                                onRemove={() => remove(item.id)}
                                            />
                                        ))}
                                    </div>
                                    {open.section.alcohol && (
                                        <div className="bg-secondary_subtle flex items-start gap-2.5 rounded-xl px-4 py-3.5">
                                            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-fg-warning-primary" aria-hidden="true" />
                                            <p className="text-sm text-tertiary">
                                                21 and over. ID is checked at pickup, not at checkout — and the starter can refuse service on the tee.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* ---------------- the order rail ---------------- */}
                    <aside className="flex flex-col gap-5 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset lg:sticky lg:top-6 lg:self-start">
                        <SectionTitle sub={count === 0 ? "Add something from the board and pick a time." : undefined}>Order ahead</SectionTitle>

                        {count === 0 ? (
                            <p className="bg-secondary_subtle rounded-xl px-4 py-5 text-center text-sm text-tertiary">Nothing in the order yet.</p>
                        ) : (
                            <>
                                <div className="flex flex-col gap-3">
                                    {lines.map((l) => (
                                        <div key={l.itemId} className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 flex-col gap-0.5">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="truncate text-sm font-semibold text-primary">{l.name}</span>
                                                    {l.offerId && (
                                                        <Badge color="success" size="sm" type="pill-color">
                                                            Deal
                                                        </Badge>
                                                    )}
                                                </span>
                                                {l.detail && <span className="text-xs text-tertiary">{l.detail}</span>}
                                                <span className="text-xs text-tertiary tabular-nums">
                                                    {money(l.price)} each
                                                    {l.alaCarte !== undefined && l.alaCarte > l.price && (
                                                        <span className="text-quaternary line-through"> {money(l.alaCarte)}</span>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2.5">
                                                <QtyStepper
                                                    qty={l.qty}
                                                    onAdd={() => (l.offerId ? addOffer(offerById(l.offerId)!) : add(l.itemId))}
                                                    onRemove={() => (l.offerId ? removeOffer(l.offerId) : remove(l.itemId))}
                                                />
                                                <span className="w-14 text-right text-sm font-semibold text-primary tabular-nums">
                                                    {money(l.price * l.qty)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-3 border-t border-secondary pt-4">
                                    <MicroLabel>When do you want it?</MicroLabel>
                                    {venue.pickup.map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setPickup(p.id)}
                                            className={cx(
                                                "flex items-start gap-3 rounded-xl px-4 py-3.5 text-left ring-1 transition duration-100 ease-linear ring-inset",
                                                pickup === p.id ? "bg-brand-primary ring-2 ring-brand" : "bg-primary ring-secondary hover:bg-primary_hover",
                                            )}
                                        >
                                            <RadioButtonBase size="md" isSelected={pickup === p.id} />
                                            <span className="flex min-w-0 flex-col gap-0.5">
                                                <span className="text-sm font-semibold text-primary">{p.label}</span>
                                                <span className="text-xs text-tertiary">{p.detail}</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <TextArea
                                    label="Anything we should know?"
                                    placeholder="Cart number, allergies, no onions…"
                                    rows={2}
                                    value={note}
                                    onChange={setNote}
                                />

                                <div className="flex flex-col border-t border-secondary pt-4">
                                    {totals.savings > 0 ? (
                                        <>
                                            <SummaryLine
                                                label={`À la carte · ${count} ${count === 1 ? "item" : "items"}`}
                                                value={money(totals.subtotal + totals.savings)}
                                            />
                                            <SummaryLine label="Deals" value={`− ${money(totals.savings)}`} credit />
                                            <SummaryLine label="Subtotal" value={money(totals.subtotal)} />
                                        </>
                                    ) : (
                                        <SummaryLine label={`Subtotal · ${count} ${count === 1 ? "item" : "items"}`} value={money(totals.subtotal)} />
                                    )}
                                    <SummaryLine label="MD food tax (6%)" value={money(totals.foodTax)} muted />
                                    {totals.alcoholTax > 0 && <SummaryLine label="MD alcohol tax (9%)" value={money(totals.alcoholTax)} muted />}
                                    <div className="mt-2 border-t border-secondary pt-2.5">
                                        <SummaryLine label="Total" value={money(totals.total)} strong />
                                    </div>
                                </div>

                                <Button size="lg" color="primary" onClick={place}>
                                    Place order · {money(totals.total)}
                                </Button>
                                <p className="text-xs text-tertiary">Pay at pickup — card, cash or your MCG account. We don&rsquo;t charge anything now.</p>
                            </>
                        )}
                    </aside>
                </div>
            </McgPage>
        </McgShell>
    );
};

/** A number + label tile in the hero, matching the Instruction hero's right rail. */
const StatTile = ({ n, label }: { n: number; label: string }) => (
    <div className="bg-secondary_subtle rounded-xl px-4 py-3 ring-1 ring-secondary ring-inset">
        <div className="text-lg font-semibold text-primary tabular-nums">{n}</div>
        <div className="text-xs text-tertiary">{label}</div>
    </div>
);

export default GrillScreen;
