"use client";

/**
 * Shared pieces for the Grill screens.
 *
 * Deliberately the same vocabulary as the Instruction kit — micro-labels, meta lines,
 * course chips, chip filters — so a golfer moving from booking a lesson to ordering a
 * burger doesn't cross a visual seam. Nothing new at the token level.
 */
import type { FC, ReactNode } from "react";
import { Check, Clock, MarkerPin01, Minus, Phone, Plus, Tag01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { COURSE_LOGO, COURSE_NAME } from "@/components/instruction/instruction-catalog";
import { cx } from "@/utils/cx";
import {
    type GrillVenue,
    type MenuItem,
    OFFER_KIND_COLOR,
    OFFER_KIND_LABEL,
    type Offer,
    VENUE_KIND_COLOR,
    VENUE_KIND_LABEL,
    money,
    offerWindowNote,
} from "../grill-menu";

/** Uppercase micro-label — the Tee Time selector bar treatment. */
export const MicroLabel = ({ children }: { children: ReactNode }) => (
    <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">{children}</span>
);

/** An icon + text meta line. */
export const MetaLine = ({ icon: Icon, children }: { icon: FC<{ className?: string }>; children: ReactNode }) => (
    <span className="flex items-center gap-1.5 text-sm text-tertiary">
        <Icon className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        {children}
    </span>
);

export const SectionTitle = ({ children, sub }: { children: ReactNode; sub?: string }) => (
    <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-primary">{children}</h2>
        {sub && <p className="max-w-3xl text-sm text-tertiary">{sub}</p>}
    </div>
);

/** Full grill / snack window / beverage cart, colored so the nine sort at a glance. */
export const VenueKindBadge = ({ venue, size = "sm" }: { venue: GrillVenue; size?: "sm" | "md" }) => (
    <Badge color={VENUE_KIND_COLOR[venue.kind]} size={size} type="pill-color">
        {VENUE_KIND_LABEL[venue.kind]}
    </Badge>
);

/** A course's brand logo chip — how every MCG screen names where you are. */
export const CourseChip = ({ slug, size = "sm" }: { slug: string; size?: "sm" | "md" }) => (
    <span
        className={cx(
            "bg-secondary_subtle inline-flex items-center gap-2 rounded-full ring-1 ring-secondary ring-inset",
            size === "sm" ? "py-1 pr-3 pl-1.5" : "py-1.5 pr-3.5 pl-2",
        )}
    >
        <img src={COURSE_LOGO[slug]} alt="" className={cx("w-auto rounded-full bg-primary object-contain", size === "sm" ? "h-5" : "h-6")} />
        <span className={cx("font-semibold text-secondary", size === "sm" ? "text-xs" : "text-sm")}>{COURSE_NAME[slug]}</span>
    </span>
);

/** A venue's week, as posted on the door. */
export const HoursList = ({ venue }: { venue: GrillVenue }) => (
    <div className="flex flex-col gap-1">
        {venue.hours.map((h) => (
            <div key={h.days} className="flex items-baseline justify-between gap-6 text-sm">
                <span className="text-tertiary">{h.days}</span>
                <span className={cx("font-medium tabular-nums", h.time === "Closed" ? "text-quaternary" : "text-secondary")}>{h.time}</span>
            </div>
        ))}
    </div>
);

/** One of the nine courses on the picker. */
export const VenueCard = ({ venue, onSelect, selected }: { venue: GrillVenue; onSelect?: () => void; selected?: boolean }) => {
    const orderable = venue.kind !== "cart";

    return (
        <div
            className={cx(
                "flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 transition duration-100 ease-linear ring-inset",
                selected ? "ring-2 ring-brand" : "ring-secondary",
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <img src={COURSE_LOGO[venue.slug]} alt="" className="size-11 shrink-0 rounded-full bg-secondary object-contain p-1" />
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-md font-semibold text-primary">{venue.name}</span>
                        <span className="truncate text-xs text-tertiary">{COURSE_NAME[venue.slug]}</span>
                    </div>
                </div>
                <VenueKindBadge venue={venue} />
            </div>

            <p className="text-sm text-tertiary">{venue.blurb}</p>

            <div className="flex flex-col gap-1.5 border-t border-secondary pt-4">
                <MetaLine icon={Clock}>
                    {venue.hours[0].days} · {venue.hours[0].time}
                </MetaLine>
                <MetaLine icon={MarkerPin01}>{venue.where}</MetaLine>
                <MetaLine icon={Phone}>{venue.phone}</MetaLine>
            </div>

            {orderable ? (
                <Button size="sm" color="primary" onClick={onSelect} className="self-start">
                    See the menu
                </Button>
            ) : (
                <>
                    <p className="bg-secondary_subtle rounded-xl px-3.5 py-3 text-xs text-tertiary">
                        No order-ahead here — the cart takes card on the fairway, and the pro shop keeps a cooler.
                    </p>
                    <Button size="sm" color="secondary" onClick={onSelect} className="self-start">
                        What&rsquo;s on the cart
                    </Button>
                </>
            )}
        </div>
    );
};

/** Section tabs across the top of a menu board. */
export const MenuTabs = <T extends string>({
    options,
    value,
    onChange,
}: {
    options: { id: T; label: string; count: number }[];
    value: T;
    onChange: (id: T) => void;
}) => (
    <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
            <button
                key={o.id}
                type="button"
                onClick={() => onChange(o.id)}
                className={cx(
                    "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
                    value === o.id ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
                )}
            >
                {o.label}
                <span className={cx("text-xs tabular-nums", value === o.id ? "text-white/70" : "text-quaternary")}>{o.count}</span>
            </button>
        ))}
    </div>
);

/** One line on the menu board, with the stepper the order rail shares. */
export const MenuItemRow = ({ item, qty, onAdd, onRemove }: { item: MenuItem; qty: number; onAdd: () => void; onRemove: () => void }) => (
    <div
        className={cx(
            "flex flex-wrap items-start justify-between gap-4 rounded-xl bg-primary px-4 py-3.5 ring-1 transition duration-100 ease-linear ring-inset",
            qty > 0 ? "ring-2 ring-brand" : "ring-secondary",
        )}
    >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-primary">{item.name}</span>
                {item.popular && (
                    <Badge color="warning" size="sm" type="pill-color">
                        Popular
                    </Badge>
                )}
                {item.tags?.map((t) => (
                    <Badge key={t} color="gray" size="sm" type="modern">
                        {t}
                    </Badge>
                ))}
            </div>
            <span className="text-sm text-tertiary">{item.desc}</span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
            <span className="text-sm font-semibold text-primary tabular-nums">{money(item.price)}</span>
            {qty > 0 ? (
                <QtyStepper qty={qty} onAdd={onAdd} onRemove={onRemove} />
            ) : (
                <Button size="sm" color="secondary" iconLeading={Plus} onClick={onAdd}>
                    Add
                </Button>
            )}
        </div>
    </div>
);

/** Minus / count / plus, used on the board and in the rail. */
export const QtyStepper = ({ qty, onAdd, onRemove }: { qty: number; onAdd: () => void; onRemove: () => void }) => (
    <div className="flex items-center gap-1 rounded-full bg-primary p-1 ring-1 ring-secondary ring-inset">
        <button
            type="button"
            onClick={onRemove}
            aria-label="Remove one"
            className="flex size-7 items-center justify-center rounded-full text-fg-quaternary transition duration-100 ease-linear hover:bg-secondary_hover hover:text-fg-secondary"
        >
            <Minus className="size-3.5" aria-hidden="true" />
        </button>
        <span className="min-w-5 text-center text-sm font-semibold text-primary tabular-nums">{qty}</span>
        <button
            type="button"
            onClick={onAdd}
            aria-label="Add one"
            className="flex size-7 items-center justify-center rounded-full text-fg-quaternary transition duration-100 ease-linear hover:bg-secondary_hover hover:text-fg-secondary"
        >
            <Plus className="size-3.5" aria-hidden="true" />
        </button>
    </div>
);

/**
 * A label / value line in the order summary.
 *
 * `credit` is the deal line: the only number on a receipt that goes the other way, so
 * it is the only one allowed a colour.
 */
export const SummaryLine = ({
    label,
    value,
    muted,
    strong,
    credit,
}: {
    label: ReactNode;
    value: ReactNode;
    muted?: boolean;
    strong?: boolean;
    credit?: boolean;
}) => (
    <div className="flex items-baseline justify-between gap-4 py-0.5">
        <span
            className={cx(
                "text-sm",
                strong ? "font-semibold text-primary" : credit ? "font-medium text-success-primary" : muted ? "text-quaternary" : "text-tertiary",
            )}
        >
            {label}
        </span>
        <span
            className={cx(
                "text-sm tabular-nums",
                strong ? "font-semibold text-primary" : credit ? "font-medium text-success-primary" : muted ? "text-quaternary" : "text-secondary",
            )}
        >
            {value}
        </span>
    </div>
);

/* ------------------------------------------------------------------ */
/* Deals                                                               */
/* ------------------------------------------------------------------ */

/**
 * The shelf the offers sit on.
 *
 * Deals need to read as a different *kind* of thing from the board underneath, or
 * they're just six more menu rows. So the shelf is the one brand-section panel on the
 * screen — the treatment the marketing pages use for a CTA — and the cards inside it
 * stay on `bg-primary` so the prices are still read against the same white the board
 * uses. No new tokens, just the contrast turned up for one block.
 */
export const OffersShelf = ({ title, sub, action, children }: { title: string; sub: string; action?: ReactNode; children: ReactNode }) => (
    <section className="flex flex-col gap-4 rounded-2xl bg-brand-section p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2">
                    <Tag01 className="size-5 shrink-0 text-fg-white" aria-hidden="true" />
                    <h2 className="text-lg font-semibold text-primary_on-brand">{title}</h2>
                </span>
                <p className="max-w-2xl text-sm text-tertiary_on-brand">{sub}</p>
            </div>
            {action}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
);

/**
 * One deal.
 *
 * An offer only earns its place if the golfer can see the arithmetic, so the card
 * always shows what's in it, what the parts cost separately, and what the saving is —
 * all of which come off the offer record rather than out of the copy. A deal outside
 * its hours is shown rather than hidden: someone who missed the early-bird by ten
 * minutes should be able to see that that is what happened.
 */
export const OfferCard = ({
    offer,
    open = true,
    nowMinutes,
    qty = 0,
    onAdd,
    onRemove,
    readOnly,
}: {
    offer: Offer;
    open?: boolean;
    nowMinutes?: number;
    qty?: number;
    onAdd?: () => void;
    onRemove?: () => void;
    /** Cart venues can't take an order — the card states the price and stops there. */
    readOnly?: boolean;
}) => {
    const note = offerWindowNote(offer, nowMinutes);

    return (
        <div
            className={cx(
                "flex flex-col gap-3 rounded-xl bg-primary p-4 ring-1 transition duration-100 ease-linear ring-inset",
                qty > 0 ? "ring-2 ring-brand" : "ring-secondary",
                !open && "opacity-60",
            )}
        >
            <div className="flex flex-wrap items-center gap-2">
                <Badge color={OFFER_KIND_COLOR[offer.kind]} size="sm" type="pill-color">
                    {OFFER_KIND_LABEL[offer.kind]}
                </Badge>
                {open ? (
                    <Badge color="success" size="sm" type="pill-color">
                        Save {money(offer.saving)}
                    </Badge>
                ) : (
                    <Badge color="gray" size="sm" type="modern">
                        {note}
                    </Badge>
                )}
                {offer.tags?.map((t) => (
                    <Badge key={t} color="gray" size="sm" type="modern">
                        {t}
                    </Badge>
                ))}
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-primary">{offer.name}</span>
                <span className="text-xs text-tertiary">{offer.blurb}</span>
            </div>

            <ul className="flex flex-col gap-1">
                {offer.includes.map((part) => (
                    <li key={part.label} className="flex items-start gap-1.5 text-xs text-tertiary">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-fg-success-secondary" aria-hidden="true" />
                        <span>
                            {part.qty > 1 && <span className="font-semibold text-secondary tabular-nums">{part.qty}× </span>}
                            {part.label}
                        </span>
                    </li>
                ))}
            </ul>

            {open && note && <MetaLine icon={Clock}>{note}</MetaLine>}

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-secondary pt-3">
                <span className="flex items-baseline gap-2">
                    <span className="text-md font-semibold text-primary tabular-nums">{money(offer.price)}</span>
                    <span className="text-xs text-quaternary tabular-nums line-through">{money(offer.alaCarte)}</span>
                </span>

                {readOnly ? (
                    <span className="text-xs text-tertiary">Ask the driver</span>
                ) : !open ? (
                    <span className="text-xs text-tertiary">{note}</span>
                ) : qty > 0 ? (
                    <QtyStepper qty={qty} onAdd={onAdd ?? (() => {})} onRemove={onRemove ?? (() => {})} />
                ) : (
                    <Button size="sm" color="secondary" iconLeading={Plus} onClick={onAdd}>
                        Add deal
                    </Button>
                )}
            </div>
        </div>
    );
};
