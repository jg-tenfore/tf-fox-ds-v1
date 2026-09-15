"use client";

/**
 * Prototype 2 — booking a private lesson, the way Square Appointments books a haircut.
 *
 * Modelled on the Renegade Barber Co. flow Weston walked through (references/091526):
 *
 *  - **One summary card on every step**, on the right, with an edit pencil on each thing
 *    already chosen. The golfer never loses sight of what they're booking.
 *  - **Extras** ("Add more to your lesson?") — rows that toggle to "✓ Added".
 *  - **Date & time** — a month header with arrows, a seven-day strip (past days struck
 *    through), Morning / Afternoon / Evening chips, "No availability until …" with
 *    *Go to next available* or *Join the waitlist*.
 *  - **Checkout** — "held for 10 minutes", contact info first, then who's golfing, a
 *    collapsible note, the cancellation policy, and Due today vs Due at lesson.
 *
 * Service and instructor are chosen before this component mounts (on the Instruction
 * page and the service page), so it opens on Extras. Group programs keep the existing
 * flow — their dates are fixed, so there is no time to pick.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bell01, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, Edit03, MarkerPin01, Plus, Users01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import {
    ANY_INSTRUCTOR,
    COURSE_NAME,
    CREDIT_BALANCES,
    type Coach,
    DAYPARTS,
    GOLFER,
    type LessonService,
    type Participant,
    type Slot,
    anyInstructorDay,
    applyGuardrails,
    coachById,
    coachDay,
    isoOf,
    money,
    money0,
    servicePrice,
    slotLabel,
} from "@/components/instruction-2/instruction-catalog";
import { CoachAvatar, StepRail } from "@/components/instruction-2/instruction-ui";
import { McgPage, McgShell } from "@/components/mcg-2/mcg-chrome";
import { BookingQuestions, EligibilityFields } from "@/components/mcg-2/registration/registration-ui";
import { ageRangeLabel, checkEligibility, missingBookingAnswers } from "@/components/mcg-2/registration-rules";
import { newId, useSession } from "@/components/mcg-2/session";
import { DEFAULT_DATE } from "@/stories/explorations/tee-search-popovers";
import { cx } from "@/utils/cx";
import { SQUARE_RAIL } from "./booking-rail";
import { serviceHref } from "./service-href";

/* ------------------------------------------------------------------ */
/* Extras                                                              */
/* ------------------------------------------------------------------ */

export interface LessonExtra {
    id: string;
    name: string;
    desc: string;
    price: number;
    /** Added to the lesson's length, where the extra takes time. */
    minutes?: number;
}

/**
 * Sample add-ons — MCG doesn't publish any. Chosen to be things a county facility
 * plausibly sells alongside a lesson, and labelled as samples on the page.
 */
export const LESSON_EXTRAS: LessonExtra[] = [
    { id: "range-bucket", name: "Large range bucket", desc: "Warm up before the lesson, or keep hitting what you just learned.", price: 12 },
    { id: "video-review", name: "Swing video review", desc: "Your lesson filmed on the bay, with the instructor's notes on the clip afterwards.", price: 25, minutes: 15 },
    { id: "club-fitting", name: "Club fitting consult", desc: "Fifteen minutes on the launch monitor checking lie, loft and shaft.", price: 40, minutes: 15 },
    { id: "rental-clubs", name: "Rental clubs", desc: "A full set for the lesson, if you're not bringing your own.", price: 15 },
];

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

/** "Today" in the prototype — the same fixed date every other MCG screen uses. */
const TODAY = DEFAULT_DATE;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const sameDay = (a: Date, b: Date) => isoOf(a) === isoOf(b);
const isPast = (d: Date) => startOfDay(d) < startOfDay(TODAY);
const weekStart = (d: Date) => addDays(d, -d.getDay());

const fmtLong = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
const fmtDay = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
const fmtShort = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** The bookable board for a day: one instructor's slots, or every instructor's merged. */
const dayFor = (service: LessonService, coachId: string, courseSlug: string, date: Date): Slot[] => {
    const raw = coachId === "any" ? anyInstructorDay(courseSlug, date) : coachDay(coachId, courseSlug, date);
    return applyGuardrails(raw, service, date);
};

const openOn = (service: LessonService, coachId: string, courseSlug: string, date: Date) =>
    !isPast(date) && dayFor(service, coachId, courseSlug, date).some((s) => s.status === "open");

/** The next day from `from` (inclusive) with an open slot, within eight weeks. */
const nextAvailable = (service: LessonService, coachId: string, courseSlug: string, from: Date): Date | null => {
    for (let i = 0; i < 56; i++) {
        const d = addDays(from, i);
        if (openOn(service, coachId, courseSlug, d)) return d;
    }
    return null;
};

/* ------------------------------------------------------------------ */
/* Summary card                                                        */
/* ------------------------------------------------------------------ */

export type SquareStep = "extras" | "time" | "checkout" | "confirmation";

const EditButton = ({ label, href, onClick }: { label: string; href?: string; onClick?: () => void }) => {
    const cls = "flex size-8 shrink-0 items-center justify-center rounded-lg text-fg-quaternary transition duration-100 ease-linear hover:bg-primary_hover hover:text-fg-secondary";
    return href ? (
        <Link href={href} aria-label={label} className={cls}>
            <Edit03 className="size-4" aria-hidden="true" />
        </Link>
    ) : (
        <button type="button" aria-label={label} onClick={onClick} className={cls}>
            <Edit03 className="size-4" aria-hidden="true" />
        </button>
    );
};

interface SummaryProps {
    service: LessonService;
    coach: Coach;
    anyMode: boolean;
    courseSlug: string;
    date: Date | null;
    minutes: number | null;
    players: number;
    extras: LessonExtra[];
    lessonTotal: number;
    facilityFee: number;
    creditCovers: boolean;
    payAtLesson: boolean;
    /** Show the money breakdown (checkout) rather than just the lesson line. */
    detailed: boolean;
    onEditTime?: () => void;
    onEditExtras?: () => void;
    /** Booked — nothing is editable any more. */
    locked?: boolean;
    footer?: React.ReactNode;
}

const SquareSummary = ({
    service,
    coach,
    anyMode,
    courseSlug,
    date,
    minutes,
    players,
    extras,
    lessonTotal,
    facilityFee,
    creditCovers,
    payAtLesson,
    detailed,
    onEditTime,
    onEditExtras,
    locked,
    footer,
}: SummaryProps) => {
    const extrasTotal = extras.reduce((n, e) => n + e.price, 0);
    const lessonCharge = creditCovers ? 0 : lessonTotal;
    const total = lessonCharge + extrasTotal + facilityFee;
    const extraMinutes = extras.reduce((n, e) => n + (e.minutes ?? 0), 0);
    const endMinutes = minutes !== null ? minutes + service.durationMin + extraMinutes : null;

    return (
        <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-primary">Lesson summary</h2>
            <div className="flex flex-col divide-y divide-secondary rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
                {date && minutes !== null && (
                    <div className="flex items-start gap-3 p-4">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                            <Calendar className="size-5 text-fg-secondary" aria-hidden="true" />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col">
                            <span className="text-sm font-semibold text-primary">{fmtShort(date)}</span>
                            <span className="text-sm text-tertiary">
                                {slotLabel(minutes)} – {endMinutes !== null ? slotLabel(endMinutes) : ""}
                            </span>
                            <span className="text-xs text-tertiary">{COURSE_NAME[courseSlug]}</span>
                        </div>
                        {onEditTime && <EditButton label="Change date and time" onClick={onEditTime} />}
                    </div>
                )}

                <div className="flex items-start gap-3 p-4">
                    <CoachAvatar coach={coach} size="sm" />
                    <div className="flex min-w-0 flex-1 flex-col">
                        <span className="text-sm font-semibold text-primary">{service.name}</span>
                        <span className="text-sm text-tertiary">
                            {anyMode ? (coach.isAny ? "with any instructor" : `with ${coach.name} (first available)`) : `with ${coach.name}`}
                            {players > 1 ? ` · ${players} golfers` : ""}
                        </span>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">{coach.isAny ? `from ${money0(lessonTotal)}` : money(lessonTotal)}</span>
                    {!locked && <EditButton label="Change instructor" href={serviceHref(service.id, courseSlug)} />}
                </div>

                {extras.length > 0 && (
                    <div className="flex items-start gap-3 p-4">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                            <Plus className="size-4 text-fg-secondary" aria-hidden="true" />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            {extras.map((e) => (
                                <span key={e.id} className="flex justify-between gap-3 text-sm text-secondary">
                                    <span className="truncate">{e.name}</span>
                                    <span className="tabular-nums">{money(e.price)}</span>
                                </span>
                            ))}
                        </div>
                        {onEditExtras && <EditButton label="Change extras" onClick={onEditExtras} />}
                    </div>
                )}

                {detailed && (
                    <div className="flex flex-col gap-2 p-4 text-sm">
                        <Row label="Subtotal" value={money(lessonTotal + extrasTotal)} />
                        {creditCovers && <Row label="Lesson credit" value={`−${money(lessonTotal)}`} tone="credit" />}
                        <Row label="Facility fee" value={money(facilityFee)} />
                        <Row label="Total" value={money(total)} strong />
                        <div className="mt-1 flex flex-col gap-1 border-t border-secondary pt-3">
                            <Row label="Due today" value={money(payAtLesson ? 0 : total)} strong />
                            <Row label="Due at lesson" value={money(payAtLesson ? total : 0)} />
                        </div>
                    </div>
                )}
            </div>
            {footer}
        </aside>
    );
};

const Row = ({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: "credit" }) => (
    <div className="flex items-center justify-between gap-3">
        <span className={cx(strong ? "font-semibold text-primary" : "text-tertiary")}>{label}</span>
        <span className={cx("tabular-nums", strong ? "font-semibold text-primary" : "text-secondary", tone === "credit" && "text-success-primary")}>{value}</span>
    </div>
);

/* ------------------------------------------------------------------ */
/* Week strip                                                          */
/* ------------------------------------------------------------------ */

const WeekStrip = ({
    selected,
    onSelect,
    isOpen,
}: {
    selected: Date;
    onSelect: (d: Date) => void;
    /** Whether a day has any open time — closed future days stay selectable, like Square's. */
    isOpen: (d: Date) => boolean;
}) => {
    const [anchor, setAnchor] = useState(() => weekStart(selected));
    const [expanded, setExpanded] = useState(false);

    useEffect(() => setAnchor(weekStart(selected)), [selected]);

    const days = Array.from({ length: 7 }, (_, i) => addDays(anchor, i));
    // The week strip is titled by the month most of its days fall in.
    const month = addDays(anchor, 3);
    const monthDays = useMemo(() => {
        const first = new Date(selected.getFullYear(), selected.getMonth(), 1);
        const lead = first.getDay();
        const count = new Date(selected.getFullYear(), selected.getMonth() + 1, 0).getDate();
        return [...Array.from({ length: lead }, () => null), ...Array.from({ length: count }, (_, i) => new Date(first.getFullYear(), first.getMonth(), i + 1))];
    }, [selected]);
    const canGoBack = weekStart(anchor) > weekStart(TODAY);

    const DayCell = ({ d }: { d: Date }) => {
        const past = isPast(d);
        const active = sameDay(d, selected);
        return (
            <button
                type="button"
                disabled={past}
                onClick={() => onSelect(d)}
                aria-pressed={active}
                aria-label={fmtDay(d)}
                className={cx(
                    "flex flex-col items-center gap-1 rounded-xl py-2.5 text-sm transition duration-100 ease-linear",
                    active ? "bg-brand-solid text-white" : past ? "cursor-not-allowed text-quaternary" : "text-primary hover:bg-primary_hover",
                    sameDay(d, TODAY) && !active && "ring-1 ring-secondary ring-inset",
                )}
            >
                <span className={cx("text-xs", active ? "text-white" : "text-tertiary")}>{DOW[d.getDay()]}</span>
                <span className={cx("font-semibold tabular-nums", past && "line-through")}>{d.getDate()}</span>
                <span className={cx("size-1 rounded-full", !past && isOpen(d) ? (active ? "bg-white" : "bg-brand-solid") : "bg-transparent")} aria-hidden="true" />
            </button>
        );
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h2 className="text-display-xs font-semibold text-primary">
                    {(expanded ? selected : month).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </h2>
                {!expanded && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            aria-label="Previous week"
                            disabled={!canGoBack}
                            onClick={() => setAnchor((a) => addDays(a, -7))}
                            className="flex size-10 items-center justify-center rounded-lg bg-secondary text-fg-secondary transition duration-100 ease-linear hover:bg-secondary_hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronLeft className="size-5" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next week"
                            onClick={() => setAnchor((a) => addDays(a, 7))}
                            className="flex size-10 items-center justify-center rounded-lg bg-secondary text-fg-secondary transition duration-100 ease-linear hover:bg-secondary_hover"
                        >
                            <ChevronRight className="size-5" aria-hidden="true" />
                        </button>
                    </div>
                )}
            </div>

            {expanded ? (
                <div className="grid grid-cols-7 gap-1">
                    {DOW.map((d) => (
                        <span key={d} className="text-center text-xs text-tertiary">
                            {d}
                        </span>
                    ))}
                    {monthDays.map((d, i) => (d ? <DayCell key={isoOf(d)} d={d} /> : <span key={`blank-${i}`} />))}
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-1">
                    {days.map((d) => (
                        <DayCell key={isoOf(d)} d={d} />
                    ))}
                </div>
            )}

            <button
                type="button"
                aria-label={expanded ? "Show one week" : "Show the whole month"}
                aria-expanded={expanded}
                onClick={() => setExpanded((v) => !v)}
                className="mx-auto flex size-8 items-center justify-center rounded-full bg-secondary text-fg-secondary transition duration-100 ease-linear hover:bg-secondary_hover"
            >
                <ChevronDown className={cx("size-4 transition duration-100 ease-linear", expanded && "rotate-180")} aria-hidden="true" />
            </button>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Flow                                                                */
/* ------------------------------------------------------------------ */

export interface SquareBookingProps {
    service: LessonService;
    /** An instructor id, or `"any"`. */
    coachId: string;
    courseSlug: string;
    /** Stories and deep links: open on a later step. */
    initialStep?: SquareStep;
    initialExtras?: string[];
}

const FACILITY_FEE = 4;

export const SquareBookingFlow = ({ service, coachId, courseSlug, initialStep = "extras", initialExtras = [] }: SquareBookingProps) => {
    const { user, addActivity } = useSession();
    const anyMode = coachId === "any";
    const pickedCoach = coachById(coachId) ?? ANY_INSTRUCTOR;

    const [step, setStep] = useState<SquareStep>(initialStep);
    const [extraIds, setExtraIds] = useState<string[]>(initialExtras);
    const [date, setDate] = useState<Date>(() => nextAvailable(service, coachId, courseSlug, TODAY) ?? TODAY);
    const [minutes, setMinutes] = useState<number | null>(null);
    const [waitlist, setWaitlist] = useState<"closed" | "open" | "joined">("closed");
    const [waitDaypart, setWaitDaypart] = useState("any");

    // Checkout
    const host = user ?? GOLFER;
    const [contact, setContact] = useState({ phone: host.phone, first: host.first, last: host.last, email: host.email });
    const [players, setPlayers] = useState(1);
    const [guests, setGuests] = useState<Participant[]>([]);
    const [hostAnswers, setHostAnswers] = useState<Participant>({ first: host.first, last: host.last, email: host.email, phone: host.phone });
    const [bookingAnswers, setBookingAnswers] = useState<Record<string, string>>({});
    const [noteOpen, setNoteOpen] = useState(false);
    const [note, setNote] = useState("");
    const [pay, setPay] = useState<"now" | "lesson" | "credit">("now");

    const extras = LESSON_EXTRAS.filter((e) => extraIds.includes(e.id));
    const slots = dayFor(service, coachId, courseSlug, date);
    const picked = slots.find((s) => s.minutes === minutes && s.status === "open");
    // In "any" mode the instructor is whoever is free at the chosen time.
    const coach: Coach = anyMode ? (picked?.coachId ? (coachById(picked.coachId) ?? ANY_INSTRUCTOR) : ANY_INSTRUCTOR) : pickedCoach;
    const lessonTotal = coach.isAny
        ? Math.min(...slots.filter((s) => s.coachId).map((s) => servicePrice(service, coachById(s.coachId!), players)), servicePrice(service, undefined, players))
        : servicePrice(service, coach, players);

    const credit = !coach.isAny ? CREDIT_BALANCES.find((b) => b.coachId === coach.id && b.creditsRemaining > 0) : undefined;
    const creditEligible = Boolean(credit && service.id === "private-45" && players === 1);
    const creditCovers = pay === "credit" && creditEligible;
    const payAtLesson = pay === "lesson";

    const rails = service.rules;
    const asOf = isoOf(date);
    const golfers: Participant[] = [{ ...hostAnswers, first: contact.first, last: contact.last, email: contact.email, phone: contact.phone }, ...guests].slice(0, players);
    const eligibility = golfers.map((g, i) => checkEligibility(rails, g, asOf, g.first || `Golfer ${i + 1}`));
    const contactMissing = !contact.first.trim() || !contact.last.trim() || !contact.email.trim() || !contact.phone.trim();
    const guestsMissing = guests.slice(0, players - 1).some((g) => !g.first.trim());
    const blocked = eligibility.some((r) => r.problems.length > 0);
    const incomplete = contactMissing || guestsMissing || eligibility.some((r) => r.incomplete) || missingBookingAnswers(rails, bookingAnswers).length > 0;

    const total = (creditCovers ? 0 : lessonTotal) + extras.reduce((n, e) => n + e.price, 0) + FACILITY_FEE;

    const top = useRef<HTMLDivElement>(null);
    const go = (next: SquareStep) => {
        setStep(next);
        top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Record the booking once, the first time the confirmation shows.
    const recorded = useRef(false);
    useEffect(() => {
        if (step !== "confirmation" || recorded.current || minutes === null) return;
        recorded.current = true;
        addActivity({
            id: newId("lesson"),
            kind: "lesson",
            title: service.name,
            detail: `with ${coach.name} · ${COURSE_NAME[courseSlug]}${extras.length ? ` · ${extras.length} extra${extras.length === 1 ? "" : "s"}` : ""}`,
            isoDate: isoOf(date),
            dateLabel: fmtShort(date),
            timeLabel: slotLabel(minutes),
            courseSlug,
            amount: payAtLesson ? 0 : total,
            status: "Upcoming",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    const railIndex = { extras: 2, time: 3, checkout: 4, confirmation: 5 }[step];

    const summary = (footer?: React.ReactNode, detailed = false) => (
        <SquareSummary
            service={service}
            coach={coach}
            anyMode={anyMode}
            courseSlug={courseSlug}
            date={minutes !== null ? date : null}
            minutes={minutes}
            players={players}
            extras={extras}
            lessonTotal={lessonTotal}
            facilityFee={FACILITY_FEE}
            creditCovers={creditCovers}
            payAtLesson={payAtLesson}
            detailed={detailed}
            onEditTime={step !== "time" && step !== "confirmation" ? () => go("time") : undefined}
            onEditExtras={step !== "extras" && step !== "confirmation" ? () => go("extras") : undefined}
            locked={step === "confirmation"}
            footer={footer}
        />
    );

    const layout = (main: React.ReactNode, side: React.ReactNode) => (
        <McgShell bg="primary">
            <McgPage width="6xl">
                <div ref={top} className="scroll-mt-24">
                    {step !== "confirmation" && (
                        <div className="mb-6 flex flex-col gap-4">
                            <Link
                                href={serviceHref(service.id, courseSlug)}
                                className="flex w-fit items-center gap-1.5 text-sm font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary"
                            >
                                <ArrowLeft className="size-4" aria-hidden="true" />
                                {service.name}
                            </Link>
                            <StepRail steps={SQUARE_RAIL} current={railIndex} />
                        </div>
                    )}
                    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
                        <div className="flex min-w-0 flex-col gap-8">{main}</div>
                        {side}
                    </div>
                </div>
            </McgPage>
        </McgShell>
    );

    /* ---------------- Extras ---------------- */
    if (step === "extras") {
        return layout(
            <>
                <div className="flex flex-col gap-1">
                    <h1 className="text-display-xs font-semibold text-primary">Add more to your lesson?</h1>
                    <p className="text-sm text-tertiary">Optional. Skip straight to a time if you just want the lesson.</p>
                </div>
                <div className="flex flex-col divide-y divide-secondary">
                    {LESSON_EXTRAS.map((extra) => {
                        const added = extraIds.includes(extra.id);
                        return (
                            <button
                                key={extra.id}
                                type="button"
                                aria-pressed={added}
                                onClick={() => setExtraIds((ids) => (added ? ids.filter((x) => x !== extra.id) : [...ids, extra.id]))}
                                className="-mx-3 flex flex-col items-start gap-1 rounded-xl px-3 py-4 text-left transition duration-100 ease-linear hover:bg-primary_hover"
                            >
                                <span className="text-md font-semibold text-primary">{extra.name}</span>
                                <span className="text-sm text-tertiary">{extra.desc}</span>
                                <span className="text-sm text-secondary tabular-nums">
                                    {money(extra.price)}
                                    {extra.minutes ? ` · +${extra.minutes} min` : ""}
                                </span>
                                {added ? (
                                    <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-brand-secondary">
                                        <CheckCircle className="size-4" aria-hidden="true" /> Added
                                    </span>
                                ) : (
                                    <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-tertiary">
                                        <Plus className="size-4" aria-hidden="true" /> Add
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                <p className="text-xs text-quaternary">Sample extras for this prototype — MCG doesn&rsquo;t publish lesson add-ons.</p>
            </>,
            summary(
                <Button size="lg" color="primary" iconTrailing={ArrowRight} className="w-full" onClick={() => go("time")}>
                    {extras.length ? "Next" : "Skip — choose a time"}
                </Button>,
            ),
        );
    }

    /* ---------------- Date & time ---------------- */
    if (step === "time") {
        const open = slots.filter((s) => s.status === "open");
        const next = open.length === 0 ? nextAvailable(service, coachId, courseSlug, addDays(date, 1)) : null;
        const isToday = sameDay(date, TODAY);

        const WaitlistPanel = () =>
            waitlist === "joined" ? (
                <div className="flex items-start gap-3 rounded-xl bg-success-primary p-4 ring-1 ring-secondary ring-inset">
                    <CheckCircle className="mt-0.5 size-5 shrink-0 text-fg-success-primary" aria-hidden="true" />
                    <p className="text-sm text-secondary">
                        You&rsquo;re on the waitlist for {fmtDay(date)} ({DAYPARTS.find((d) => d.id === waitDaypart)?.label.toLowerCase() ?? "any time"}). We&rsquo;ll text{" "}
                        {contact.phone} if a {service.name.toLowerCase()} opens up.
                    </p>
                </div>
            ) : waitlist === "open" ? (
                <div className="flex flex-col gap-3 rounded-xl bg-secondary p-4 ring-1 ring-secondary ring-inset">
                    <p className="text-sm font-semibold text-primary">When works for you on {fmtDay(date)}?</p>
                    <div className="flex flex-wrap gap-2">
                        {[{ id: "any", label: "Any time" }, ...DAYPARTS].map((d) => (
                            <button
                                key={d.id}
                                type="button"
                                onClick={() => setWaitDaypart(d.id)}
                                className={cx(
                                    "rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
                                    waitDaypart === d.id ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
                                )}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                    <Button size="md" color="primary" iconLeading={Bell01} className="w-fit" onClick={() => setWaitlist("joined")}>
                        Join the waitlist
                    </Button>
                </div>
            ) : (
                <Button size="lg" color="secondary" className="w-full" onClick={() => setWaitlist("open")}>
                    Join the waitlist
                </Button>
            );

        return layout(
            <>
                <WeekStrip
                    selected={date}
                    onSelect={(d) => {
                        setDate(d);
                        setMinutes(null);
                        setWaitlist("closed");
                    }}
                    isOpen={(d) => openOn(service, coachId, courseSlug, d)}
                />

                <p className="border-t border-secondary pt-4 text-center text-sm text-tertiary">
                    Times are shown in Eastern Time{anyMode ? ` · every instructor at ${COURSE_NAME[courseSlug]}` : ` · ${COURSE_NAME[courseSlug]}`}.
                </p>

                <div className="flex flex-col gap-5">
                    <h2 className="text-lg font-semibold text-primary">
                        {isToday ? "Today, " : ""}
                        {fmtLong(date)}
                    </h2>

                    {open.length === 0 ? (
                        <div className="flex flex-col gap-4">
                            <p className="text-md text-secondary">{next ? `No availability until ${fmtDay(next)}.` : "No availability in the next eight weeks."}</p>
                            {next && (
                                <Button
                                    size="lg"
                                    color="primary"
                                    className="w-full"
                                    onClick={() => {
                                        setDate(next);
                                        setWaitlist("closed");
                                    }}
                                >
                                    Go to next available
                                </Button>
                            )}
                            <span className="text-center text-sm text-tertiary">or</span>
                            <WaitlistPanel />
                        </div>
                    ) : (
                        <>
                            {DAYPARTS.map((daypart) => {
                                const inPart = open.filter((s) => s.minutes >= daypart.start && s.minutes < daypart.end);
                                return (
                                    <div key={daypart.id} className="flex flex-col gap-2.5">
                                        <h3 className="text-sm font-semibold text-primary">{daypart.label}</h3>
                                        {inPart.length === 0 ? (
                                            <p className="text-sm text-tertiary">No availability</p>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                                                {inPart.map((s) => {
                                                    const active = minutes === s.minutes;
                                                    const who = anyMode && s.coachId ? coachById(s.coachId)?.name : undefined;
                                                    return (
                                                        <button
                                                            key={s.minutes}
                                                            type="button"
                                                            aria-pressed={active}
                                                            onClick={() => setMinutes(s.minutes)}
                                                            className={cx(
                                                                "flex flex-col items-center rounded-xl px-3 py-3 text-sm font-semibold transition duration-100 ease-linear",
                                                                active ? "bg-brand-solid text-white" : "bg-secondary text-primary hover:bg-secondary_hover",
                                                            )}
                                                        >
                                                            {slotLabel(s.minutes)}
                                                            {who && <span className={cx("text-xs font-normal", active ? "text-white" : "text-tertiary")}>{who}</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div className="flex flex-col gap-2.5 border-t border-secondary pt-5">
                                <h3 className="text-sm font-semibold text-primary">Don&rsquo;t see your preference?</h3>
                                <WaitlistPanel />
                            </div>
                        </>
                    )}
                </div>
            </>,
            summary(
                <Button size="lg" color="primary" iconTrailing={ArrowRight} className="w-full" isDisabled={minutes === null} onClick={() => go("checkout")}>
                    {minutes === null ? "Choose a time" : "Next"}
                </Button>,
            ),
        );
    }

    /* ---------------- Checkout ---------------- */
    if (step === "checkout") {
        const setGuest = (i: number, patch: Partial<Participant>) =>
            setGuests((list) => {
                const next = [...list];
                while (next.length <= i) next.push({ first: "", last: "", email: "", phone: "" });
                next[i] = { ...next[i], ...patch };
                return next;
            });

        return layout(
            <>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-display-xs font-semibold text-primary">Checkout</h1>
                    <p className="flex items-center gap-1.5 text-sm text-tertiary">
                        <Clock className="size-4" aria-hidden="true" />
                        Lesson held for 10 minutes
                    </p>
                </div>

                {/* Contact info */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-primary">Contact info</h2>
                        {!user && (
                            <Link href="/signin" className="text-sm font-semibold text-primary underline">
                                Sign in
                            </Link>
                        )}
                    </div>
                    <Input label="Phone number" type="tel" value={contact.phone} onChange={(v) => setContact((c) => ({ ...c, phone: v }))} isRequired />
                    <p className="text-xs text-tertiary">We&rsquo;ll text you a confirmation and a reminder the day before. Reply STOP to opt out.</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Input label="First name" value={contact.first} onChange={(v) => setContact((c) => ({ ...c, first: v }))} isRequired />
                        <Input label="Last name" value={contact.last} onChange={(v) => setContact((c) => ({ ...c, last: v }))} isRequired />
                    </div>
                    <Input label="Email" type="email" value={contact.email} onChange={(v) => setContact((c) => ({ ...c, email: v }))} isRequired />
                </section>

                {/* Who's golfing */}
                <section className="flex flex-col gap-4 border-t border-secondary pt-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-primary">Who&rsquo;s taking the lesson</h2>
                        <p className="text-sm text-tertiary">
                            {service.maxPlayers > 1 ? `Up to ${service.maxPlayers} golfers — the price is set for the whole group.` : "One golfer."}
                            {rails?.age ? ` ${ageRangeLabel(rails.age)}, checked against the lesson date.` : ""}
                        </p>
                    </div>

                    {service.maxPlayers > 1 && (
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                            {Array.from({ length: service.maxPlayers }, (_, i) => i + 1).map((n) => {
                                const active = players === n;
                                const price = coach.isAny ? servicePrice(service, undefined, n) : servicePrice(service, coach, n);
                                return (
                                    <button
                                        key={n}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => setPlayers(n)}
                                        className={cx(
                                            "flex flex-col items-start gap-0.5 rounded-xl px-4 py-3 text-left ring-1 transition duration-100 ease-linear ring-inset",
                                            active ? "bg-brand-primary ring-2 ring-brand" : "bg-primary ring-secondary hover:bg-primary_hover",
                                        )}
                                    >
                                        <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                                            <Users01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                            {n} {n === 1 ? "golfer" : "golfers"}
                                        </span>
                                        <span className="text-sm text-secondary tabular-nums">{money0(price)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-secondary ring-inset">
                            <p className="text-sm font-semibold text-primary">
                                {contact.first || "You"} {contact.last}
                                <span className="font-normal text-tertiary"> · booking contact</span>
                            </p>
                            <EligibilityFields rules={rails} value={hostAnswers} onChange={(patch) => setHostAnswers((h) => ({ ...h, ...patch }))} result={eligibility[0]} />
                            {!rails?.age && !(rails?.questions ?? []).some((q) => q.per === "golfer") && <p className="text-sm text-tertiary">Nothing else needed.</p>}
                        </div>
                        {Array.from({ length: players - 1 }, (_, i) => {
                            const g = guests[i] ?? { first: "", last: "", email: "", phone: "" };
                            return (
                                <div key={i} className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-secondary ring-inset">
                                    <p className="text-sm font-semibold text-primary">Golfer {i + 2}</p>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Input label="First name" value={g.first} onChange={(v) => setGuest(i, { first: v })} isRequired />
                                        <Input label="Last name" value={g.last} onChange={(v) => setGuest(i, { last: v })} />
                                    </div>
                                    <EligibilityFields rules={rails} value={g} onChange={(patch) => setGuest(i, patch)} result={eligibility[i + 1]} />
                                </div>
                            );
                        })}
                    </div>

                    <BookingQuestions rules={rails} answers={bookingAnswers} onChange={(id, v) => setBookingAnswers((a) => ({ ...a, [id]: v }))} />
                </section>

                {/* Payment */}
                <section className="flex flex-col gap-3 border-t border-secondary pt-8">
                    <h2 className="text-lg font-semibold text-primary">Payment</h2>
                    {[
                        { id: "now" as const, label: "Pay now", sub: "Visa ···· 4242", show: true },
                        { id: "lesson" as const, label: "Pay at the lesson", sub: `Pay at the ${COURSE_NAME[courseSlug]} pro shop when you check in`, show: true },
                        {
                            id: "credit" as const,
                            label: "Use a lesson credit",
                            sub: credit ? `${credit.creditsRemaining} left with ${coach.name} — covers the lesson, not extras` : "",
                            show: creditEligible,
                        },
                    ]
                        .filter((o) => o.show)
                        .map((o) => {
                            const active = pay === o.id;
                            return (
                                <button
                                    key={o.id}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => setPay(o.id)}
                                    className={cx(
                                        "flex items-center gap-3 rounded-xl px-4 py-3.5 text-left ring-1 transition duration-100 ease-linear ring-inset",
                                        active ? "bg-brand-primary ring-2 ring-brand" : "bg-primary ring-secondary hover:bg-primary_hover",
                                    )}
                                >
                                    <span className={cx("flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset", active ? "bg-brand-solid ring-transparent" : "ring-primary")}>
                                        {active && <span className="size-2 rounded-full bg-white" />}
                                    </span>
                                    <span className="flex min-w-0 flex-col">
                                        <span className="text-sm font-semibold text-primary">{o.label}</span>
                                        <span className="text-sm text-tertiary">{o.sub}</span>
                                    </span>
                                </button>
                            );
                        })}
                </section>

                {/* Note */}
                <section className="flex flex-col gap-3 border-t border-secondary pt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-primary">Lesson note</h2>
                        {!noteOpen && (
                            <button type="button" onClick={() => setNoteOpen(true)} className="text-sm font-semibold text-primary underline">
                                Add
                            </button>
                        )}
                    </div>
                    {noteOpen && <TextArea aria-label="Lesson note" rows={3} value={note} onChange={setNote} placeholder="Anything the instructor should know before you arrive." />}
                </section>

                {/* Policy */}
                <section className="flex flex-col gap-1 border-t border-secondary pt-8">
                    <h2 className="text-lg font-semibold text-primary">Cancellation policy</h2>
                    <p className="text-sm text-tertiary">Cancel or reschedule at least 24 hours before your lesson. Later cancellations are charged in full, or use the credit.</p>
                </section>
            </>,
            summary(
                <div className="flex flex-col gap-2">
                    <Button size="lg" color="primary" className="w-full" isDisabled={blocked || incomplete} onClick={() => go("confirmation")}>
                        Book lesson
                    </Button>
                    {(blocked || incomplete) && (
                        <p className="text-center text-xs text-tertiary">{blocked ? "Someone on this booking can't take this lesson." : "Fill in the required details to book."}</p>
                    )}
                </div>,
                true,
            ),
        );
    }

    /* ---------------- Confirmation ---------------- */
    return layout(
        <div className="flex flex-col items-start gap-5">
            <CheckCircle className="size-12 text-fg-success-primary" aria-hidden="true" />
            <div className="flex flex-col gap-2">
                <h1 className="text-display-xs font-semibold text-primary">You&rsquo;re booked</h1>
                <p className="text-md text-tertiary">
                    {service.name} with {coach.name} on {minutes !== null ? `${fmtDay(date)} at ${slotLabel(minutes)}` : fmtDay(date)}. A confirmation is on its way to {contact.email}
                    {contact.phone ? ` and ${contact.phone}` : ""}.
                </p>
                {payAtLesson && <Badge color="warning" size="md" type="pill-color">{`${money(total)} due at the lesson`}</Badge>}
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-secondary p-4 text-sm text-secondary">
                <MarkerPin01 className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                Check in at the {COURSE_NAME[courseSlug]} pro shop 10 minutes before your lesson.
            </div>
            <div className="flex flex-wrap gap-3">
                <Button size="lg" color="primary" iconLeading={Calendar}>
                    Add to calendar
                </Button>
                {!coach.isAny && (
                    <Button size="lg" color="secondary" href={`/instruction/pro/${coach.id}`}>
                        More with {coach.name}
                    </Button>
                )}
                <Button size="lg" color="link-gray" href="/instruction">
                    All instruction
                </Button>
            </div>
        </div>,
        summary(null, true),
    );
};
