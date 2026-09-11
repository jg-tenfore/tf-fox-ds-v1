"use client";

/**
 * Shared UI for the MCG Events, Calendar and Clinics screens.
 *
 * Nothing new is introduced at the token level — the MCG green comes from
 * `McgShell`'s brand override, exactly as it does on the Instruction screens. The
 * pieces the Academy already got right are reused rather than re-cut: `CapacityMeter`
 * (including its waitlist state) and `ServiceCard` both come straight from
 * `instruction-ui`, so a county clinic and an Academy clinic look like siblings
 * because they are rendered by the same components.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { Calendar, Check, ChevronDown, MarkerPin01, Minus, Plus, Users01 } from "@untitledui/icons";
import { COURSE_LOGO, type LessonService } from "@/components/instruction/instruction-catalog";
import { CapacityMeter } from "@/components/instruction/instruction-ui";
import {
    CATEGORY_UI,
    COURSE_NAME,
    fmtDateShort,
    isFull,
    type McgClinic,
    type McgEvent,
    money0,
    spotsLeft,
} from "@/components/mcg/events-catalog";
import { cx } from "@/utils/cx";

/* ------------------------------------------------------------------ */
/* Capacity                                                            */
/* ------------------------------------------------------------------ */

/**
 * `CapacityMeter` reads three fields off a `LessonService`. Rather than fork it for
 * events, wrap the two numbers an event has in the shape it expects — one meter, one
 * waitlist behaviour, everywhere in the prototype.
 */
const asService = (capacity: number, registered: number): LessonService => ({
    id: "capacity",
    name: "",
    kind: "group",
    audience: "adult",
    meta: "",
    desc: "",
    durationMin: 0,
    minPlayers: 1,
    maxPlayers: 1,
    basePrice: 0,
    priceByPlayers: { 1: 0 },
    tags: [],
    section: "",
    capacity,
    registered,
});

export const Capacity = ({ capacity, registered, compact }: { capacity: number; registered: number; compact?: boolean }) => (
    <CapacityMeter service={asService(capacity, registered)} compact={compact} />
);

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

export const SectionTitle = ({ children, sub }: { children: ReactNode; sub?: string }) => (
    <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-primary">{children}</h2>
        {sub && <p className="max-w-3xl text-sm text-tertiary">{sub}</p>}
    </div>
);

export const MicroLabel = ({ children }: { children: ReactNode }) => (
    <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">{children}</span>
);

export const MetaLine = ({ icon: Icon, children }: { icon: typeof Calendar; children: ReactNode }) => (
    <span className="flex items-center gap-1.5 text-sm text-tertiary">
        <Icon className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        {children}
    </span>
);

/** A course's brand logo chip — how every MCG screen names which course you're at. */
export const CourseChip = ({ slug, size = "sm" }: { slug: string; size?: "sm" | "md" }) => (
    <span className={cx("inline-flex items-center gap-2 rounded-full bg-secondary_subtle ring-1 ring-secondary ring-inset", size === "sm" ? "py-1 pr-3 pl-1.5" : "py-1.5 pr-3.5 pl-2")}>
        <img src={COURSE_LOGO[slug]} alt="" className={cx("w-auto rounded-full bg-primary object-contain", size === "sm" ? "h-5" : "h-6")} />
        <span className={cx("font-semibold text-secondary", size === "sm" ? "text-xs" : "text-sm")}>{COURSE_NAME[slug]}</span>
    </span>
);

/** Category pill, with its icon — the Events colour key in miniature. */
export const CategoryPill = ({ category }: { category: McgEvent["category"] }) => {
    const ui = CATEGORY_UI[category];
    return (
        <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", ui.bg, ui.fg)}>
            <ui.Icon className="size-3.5" aria-hidden="true" />
            {ui.label}
        </span>
    );
};

/** Spots-left line. Full turns into a waitlist prompt rather than a dead end. */
export const SpotsLine = ({ capacity, registered }: { capacity: number; registered: number }) => {
    const left = spotsLeft({ capacity, registered });
    const full = left === 0;
    const low = left > 0 && left <= 8;
    return (
        <span className={cx("text-xs font-semibold tabular-nums", full ? "text-error-primary" : low ? "text-warning-primary" : "text-tertiary")}>
            {full ? "Full — join the waitlist" : low ? `Only ${left} ${left === 1 ? "spot" : "spots"} left` : `${left} of ${capacity} spots left`}
        </span>
    );
};

/* ------------------------------------------------------------------ */
/* Filter controls                                                     */
/* ------------------------------------------------------------------ */

/** A row of filter chips, the county's primary narrowing control. */
export const FilterChips = <T extends string>({ options, value, onChange }: { options: { id: T; label: string }[]; value: T; onChange: (id: T) => void }) => (
    <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
            <button
                key={o.id}
                type="button"
                onClick={() => onChange(o.id)}
                className={cx(
                    "rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
                    value === o.id ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
                )}
            >
                {o.label}
            </button>
        ))}
    </div>
);

/** A labelled dropdown — used for course and month, where a chip row would be too long. */
export const SelectMenu = <T extends string>({
    label,
    value,
    options,
    open,
    onOpen,
    onChange,
}: {
    label: string;
    value: T;
    options: { id: T; label: string }[];
    open: boolean;
    onOpen: () => void;
    onChange: (id: T) => void;
}) => {
    const current = options.find((o) => o.id === value);
    return (
        <div className="relative">
            <button
                type="button"
                onClick={onOpen}
                className={cx(
                    "flex items-center gap-2 rounded-full py-2 pr-3 pl-4 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
                    value === options[0]?.id ? "bg-primary text-secondary ring-secondary hover:bg-primary_hover" : "bg-brand-solid text-white ring-transparent",
                )}
            >
                <span className={cx("font-normal", value === options[0]?.id ? "text-tertiary" : "text-white/70")}>{label}</span>
                {current?.label}
                <ChevronDown className={cx("size-4 transition duration-100 ease-linear", open && "rotate-180")} aria-hidden="true" />
            </button>
            {open && (
                <>
                    <button type="button" aria-hidden tabIndex={-1} onClick={onOpen} className="fixed inset-0 z-40 cursor-default" />
                    <div className="absolute top-full left-0 z-50 mt-2 max-h-80 min-w-56 overflow-y-auto rounded-xl bg-primary p-1.5 shadow-lg ring-1 ring-secondary">
                        {options.map((o) => (
                            <button
                                key={o.id}
                                type="button"
                                onClick={() => onChange(o.id)}
                                className={cx(
                                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition duration-100 ease-linear",
                                    value === o.id ? "bg-active font-medium text-primary" : "text-secondary hover:bg-primary_hover",
                                )}
                            >
                                {o.label}
                                {value === o.id && <Check className="size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Party-size stepper                                                  */
/* ------------------------------------------------------------------ */

export const Stepper = ({ value, min = 1, max, onChange, label }: { value: number; min?: number; max: number; onChange: (n: number) => void; label: string }) => (
    <div className="flex items-center gap-2">
        <button
            type="button"
            aria-label={`Fewer ${label}`}
            disabled={value <= min}
            onClick={() => onChange(Math.max(min, value - 1))}
            className="flex size-8 items-center justify-center rounded-full ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Minus className="size-4 text-fg-secondary" aria-hidden="true" />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-primary tabular-nums">{value}</span>
        <button
            type="button"
            aria-label={`More ${label}`}
            disabled={value >= max}
            onClick={() => onChange(Math.min(max, value + 1))}
            className="flex size-8 items-center justify-center rounded-full ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Plus className="size-4 text-fg-secondary" aria-hidden="true" />
        </button>
    </div>
);

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

/** One event in the browse grid. Photo-led, with the capacity state carried on the card. */
export const EventCard = ({ event }: { event: McgEvent }) => {
    const full = isFull(event);
    return (
        <Link
            href={`/events/${event.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary_subtle">
                <img src={event.image} alt="" loading="lazy" className="size-full object-cover" />
                <span className="absolute top-3 left-3">
                    <CategoryPill category={event.category} />
                </span>
                {full && <span className="absolute top-3 right-3 rounded-full bg-error-solid px-2.5 py-1 text-xs font-semibold text-white">Waitlist</span>}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-sm font-semibold text-brand-secondary">{fmtDateShort(event.isoDate)}</span>
                        <span className="text-md font-semibold text-primary">{event.title}</span>
                    </div>
                    <div className="flex shrink-0 flex-col items-end">
                        <span className="text-lg font-semibold text-primary tabular-nums">{money0(event.price)}</span>
                        {event.price > 0 && <span className="text-xs text-tertiary">{event.priceUnit}</span>}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <MetaLine icon={Calendar}>{event.time}</MetaLine>
                    <MetaLine icon={MarkerPin01}>{COURSE_NAME[event.courseSlug]}</MetaLine>
                </div>
                <MetaLine icon={Users01}>{event.format}</MetaLine>

                <div className="mt-auto flex flex-col gap-3 border-t border-secondary pt-3.5">
                    <Capacity capacity={event.capacity} registered={event.registered} compact />
                    <div className="flex items-center justify-between gap-3">
                        {event.series ? <span className="truncate text-xs text-tertiary">{event.series}</span> : <span className="truncate text-xs text-tertiary">{event.organizer}</span>}
                        <span className="shrink-0 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear group-hover:underline">
                            {full ? "Join waitlist" : "Register"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

/** A slim event tile for the "related events" rail — no capacity, no CTA. */
export const RelatedEventCard = ({ event }: { event: McgEvent }) => (
    <Link href={`/events/${event.id}`} className="group flex flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring">
        <div className="aspect-[3/2] w-full overflow-hidden rounded-2xl ring-1 ring-secondary ring-inset">
            <img src={event.image} alt="" loading="lazy" className="size-full object-cover" />
        </div>
        <p className="mt-3 text-sm font-semibold text-brand-secondary">{fmtDateShort(event.isoDate)}</p>
        <p className="mt-0.5 line-clamp-2 text-md font-semibold text-primary transition duration-100 ease-linear group-hover:underline">{event.title}</p>
        <p className="mt-1 text-sm text-tertiary">
            {COURSE_NAME[event.courseSlug]} · {event.time}
        </p>
    </Link>
);

/** One county clinic in the Clinics grid. */
export const ClinicCard = ({ clinic, levelBadge }: { clinic: McgClinic; levelBadge: ReactNode }) => {
    const full = isFull(clinic);
    return (
        <Link
            href={`/clinics/${clinic.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
            <div className="relative aspect-[16/7] w-full overflow-hidden bg-secondary_subtle">
                <img src={clinic.image} alt="" loading="lazy" className="size-full object-cover" />
                {clinic.price === 0 && <span className="absolute top-3 left-3 rounded-full bg-success-solid px-2.5 py-1 text-xs font-semibold text-white">Free</span>}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-md font-semibold text-primary">{clinic.title}</span>
                            {levelBadge}
                        </div>
                        <span className="text-sm text-tertiary">
                            {clinic.schedule} · {clinic.sessions} {clinic.sessions === 1 ? "session" : "sessions"}
                        </span>
                    </div>
                    <div className="flex shrink-0 flex-col items-end">
                        <span className="text-lg font-semibold text-primary tabular-nums">{money0(clinic.price)}</span>
                        {clinic.price > 0 && <span className="text-xs text-tertiary">{clinic.priceUnit}</span>}
                    </div>
                </div>

                <p className="line-clamp-2 text-sm text-tertiary">{clinic.description}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <MetaLine icon={MarkerPin01}>{COURSE_NAME[clinic.courseSlug]}</MetaLine>
                    <MetaLine icon={Users01}>{clinic.audience}</MetaLine>
                </div>

                <div className="mt-auto flex flex-col gap-3 border-t border-secondary pt-3.5">
                    <Capacity capacity={clinic.capacity} registered={clinic.registered} compact />
                    <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[10px] font-semibold text-brand-secondary ring-1 ring-secondary ring-inset">
                                {clinic.instructor.initials}
                            </span>
                            <span className="truncate text-sm text-secondary">with {clinic.instructor.name}</span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear group-hover:underline">
                            {full ? "Join waitlist" : "Enrol"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

export const NoResults = ({ noun, onClear }: { noun: string; onClear: () => void }) => (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-md font-semibold text-primary">No {noun} match those filters</p>
        <p className="text-sm text-tertiary">The county runs programming at all nine courses — try widening the search.</p>
        <button type="button" onClick={onClear} className="mt-2 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline">
            Clear all filters
        </button>
    </div>
);
