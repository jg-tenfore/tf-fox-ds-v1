"use client";

/**
 * Prototype 3 — booking a private lesson, the way Square Appointments books a haircut.
 *
 * Modelled on the Renegade Barber Co. flow Weston walked through (references/091526):
 *
 *  - **One summary card on every step**, on the right, with an edit pencil on each thing
 *    already chosen. The golfer never loses sight of what they're booking.
 *  - **Date & time** — Prototype 1's board, which MCG preferred: the lesson, course and
 *    date sit in a row of controls (pre-filled from the search step), and the day is
 *    laid out Morning / Afternoon / Evening with booked times visible but clearly
 *    subordinate to the open ones.
 *  - **Waitlist** — Prototype 1's fuller version: a date range, preferred times of day
 *    and preferred days of the week.
 *  - **Checkout** — "held for 10 minutes", contact info first, then who's golfing, a
 *    collapsible note, the cancellation policy, and Due today vs Due at lesson.
 *
 * Service and instructor are chosen before this component mounts (on the Instruction
 * page and the service page), so it opens on the date and time. Square's "Add more to
 * your appointment?" step is gone: MCG called it extra clicking, so extras are a field
 * on the checkout screen instead. Group programs keep the existing flow — their dates
 * are fixed, so there is no time to pick.
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
    PRIVATE_SERVICES,
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
    serviceById,
    servicePrice,
    slotLabel,
} from "@/components/instruction-3/instruction-catalog";
import { CoachAvatar, DaypartSlots, StepRail } from "@/components/instruction-3/instruction-ui";
import { NativeSelect } from "@/components/base/select/select-native";
import { McgPage, McgShell } from "@/components/mcg-3/mcg-chrome";
import { BookingQuestions, EligibilityFields } from "@/components/mcg-3/registration/registration-ui";
import { PackPrompt } from "./credits-explainer";
import { SignInGate } from "./sign-in-gate";
import { ageRangeLabel, checkEligibility, missingBookingAnswers } from "@/components/mcg-3/registration-rules";
import { newId, useSession } from "@/components/mcg-3/session";
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
const dateOfIso = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
};
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

export type SquareStep = "time" | "waitlist" | "checkout" | "confirmation";

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
    /** The date the golfer asked for on the search step, ISO. */
    searchFrom?: string;
    searchTo?: string;
}

const FACILITY_FEE = 4;

export const SquareBookingFlow = ({ service: initialService, coachId, courseSlug, initialStep = "time", initialExtras = [], searchFrom, searchTo }: SquareBookingProps) => {
    // Prototype 1 let a golfer switch between the 30, 45 and 60-minute lesson on this
    // screen rather than walking back a step, so Prototype 3 does too.
    const [serviceId, setServiceId] = useState(initialService.id);
    const service = serviceById(serviceId) ?? initialService;
    const { user, addActivity, signIn } = useSession();
    const anyMode = coachId === "any";
    const pickedCoach = coachById(coachId) ?? ANY_INSTRUCTOR;

    const [step, setStep] = useState<SquareStep>(initialStep);
    const [extraIds, setExtraIds] = useState<string[]>(initialExtras);
    // The search step already asked for dates — start there rather than asking again.
    const searchStart = searchFrom ? dateOfIso(searchFrom) : null;
    const [date, setDate] = useState<Date>(() => {
        const from = searchStart && searchStart > TODAY ? searchStart : TODAY;
        return nextAvailable(service, coachId, courseSlug, from) ?? from;
    });
    const [course, setCourse] = useState(courseSlug);
    const [minutes, setMinutes] = useState<number | null>(null);
    const [waitFrom, setWaitFrom] = useState(searchFrom ?? isoOf(TODAY));
    const [waitTo, setWaitTo] = useState(searchTo ?? "");
    const [waitDayparts, setWaitDayparts] = useState<string[]>(["any"]);
    const [waitDays, setWaitDays] = useState<number[]>([]);
    const [waitlisted, setWaitlisted] = useState(false);

    // Checkout
    const host = user ?? GOLFER;
    const [contact, setContact] = useState({ phone: host.phone, first: host.first, last: host.last, email: host.email });

    // Signing in at checkout fills the contact block from the account, rather than
    // making the golfer type what MCG already knows.
    useEffect(() => {
        if (user) setContact((c) => ({ ...c, first: user.first, last: user.last, email: user.email, phone: user.phone || c.phone }));
    }, [user]);
    const [players, setPlayers] = useState(1);
    const [guests, setGuests] = useState<Participant[]>([]);
    const [hostAnswers, setHostAnswers] = useState<Participant>({ first: host.first, last: host.last, email: host.email, phone: host.phone });
    const [bookingAnswers, setBookingAnswers] = useState<Record<string, string>>({});
    const [noteOpen, setNoteOpen] = useState(false);
    const [note, setNote] = useState("");
    const [pay, setPay] = useState<"now" | "lesson" | "credit">("now");
    // MCG wants every booking attached to an account, without losing the booking to do
    // it: browsing and choosing stay open, and the account is settled here at checkout.
    const signedIn = Boolean(user);

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

    const railIndex = { time: 2, waitlist: 2, checkout: 3, confirmation: 4 }[step];

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
            onEditTime={step === "checkout" ? () => go("time") : undefined}
            onEditExtras={undefined}
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

    /* ---------------- Date & time (Prototype 1's board) ---------------- */
    if (step === "time") {
        const open = slots.filter((s) => s.status === "open");
        const next = open.length === 0 ? nextAvailable(service, coachId, course, addDays(date, 1)) : null;
        const courseOptions = anyMode ? Object.keys(COURSE_NAME) : pickedCoach.courseSlugs;

        return layout(
            <>
                <div className="flex flex-col gap-1">
                    <h1 className="text-display-xs font-semibold text-primary">Choose a time</h1>
                    <p className="text-sm text-tertiary">
                        Carried over from your search{searchFrom ? ` — from ${fmtShort(dateOfIso(searchFrom))}` : ""}. Change any of it here without starting again.
                    </p>
                </div>

                {/* The three things a golfer changes at this step, filled in from the search */}
                <div className="grid gap-3 sm:grid-cols-3">
                    <NativeSelect
                        label="Lesson"
                        value={service.id}
                        onChange={(e) => {
                            setServiceId(e.target.value);
                            setMinutes(null);
                            setPlayers(1);
                        }}
                        options={PRIVATE_SERVICES.map((s) => ({ label: `${s.name} · ${s.durationMin} min`, value: s.id }))}
                    />
                    <NativeSelect
                        label="Course"
                        value={course}
                        onChange={(e) => {
                            setCourse(e.target.value);
                            setMinutes(null);
                        }}
                        options={courseOptions.map((slug) => ({ label: COURSE_NAME[slug], value: slug }))}
                    />
                    <Input
                        label="Date"
                        type="date"
                        value={isoOf(date)}
                        onChange={(v) => {
                            if (!v) return;
                            setDate(dateOfIso(v));
                            setMinutes(null);
                        }}
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-primary">{sameDay(date, TODAY) ? `Today, ${fmtLong(date)}` : fmtLong(date)}</h2>
                    <span className="text-sm text-tertiary tabular-nums">
                        {open.length} open · {slots.length - open.length} taken
                    </span>
                </div>

                {/* A week of shortcuts, so a different day is one tap rather than a date picker */}
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 7 }, (_, i) => addDays(TODAY, i)).map((d) => {
                        const has = openOn(service, coachId, course, d);
                        const active = sameDay(d, date);
                        return (
                            <button
                                key={isoOf(d)}
                                type="button"
                                aria-pressed={active}
                                onClick={() => {
                                    setDate(d);
                                    setMinutes(null);
                                }}
                                className={cx(
                                    "flex flex-col items-center rounded-xl px-3.5 py-2 text-sm transition duration-100 ease-linear ring-inset",
                                    active ? "bg-brand-solid text-white" : has ? "bg-primary text-primary ring-1 ring-secondary hover:ring-brand" : "bg-secondary text-quaternary",
                                )}
                            >
                                <span className={cx("text-xs", active ? "text-white/80" : "text-tertiary")}>{DOW[d.getDay()]}</span>
                                <span className="font-semibold tabular-nums">{d.getDate()}</span>
                            </button>
                        );
                    })}
                </div>

                {open.length === 0 ? (
                    <div className="flex flex-col gap-4 rounded-2xl bg-secondary p-6">
                        <p className="text-md text-secondary">{next ? `Nothing open on this day. The next opening is ${fmtDay(next)}.` : "Nothing open in the next eight weeks."}</p>
                        <div className="flex flex-wrap gap-3">
                            {next && (
                                <Button
                                    size="lg"
                                    color="primary"
                                    onClick={() => {
                                        setDate(next);
                                        setMinutes(null);
                                    }}
                                >
                                    Go to {fmtShort(next)}
                                </Button>
                            )}
                            <Button size="lg" color="secondary" iconLeading={Bell01} onClick={() => go("waitlist")}>
                                Join the waitlist
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <DaypartSlots
                            slots={slots}
                            price={coach.isAny ? undefined : servicePrice(service, coach, players)}
                            selected={minutes}
                            onSelect={setMinutes}
                            noteFor={(slot) => (anyMode && slot.coachId ? coachById(slot.coachId)?.name : undefined)}
                        />
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary pt-5">
                            <p className="text-sm text-tertiary">Don&rsquo;t see a time that works?</p>
                            <Button size="md" color="secondary" iconLeading={Bell01} onClick={() => go("waitlist")}>
                                Join the waitlist
                            </Button>
                        </div>
                    </>
                )}
            </>,
            summary(
                <Button size="lg" color="primary" iconTrailing={ArrowRight} className="w-full" isDisabled={minutes === null} onClick={() => go("checkout")}>
                    {minutes === null ? "Choose a time" : "Next"}
                </Button>,
            ),
        );
    }

    /* ---------------- Waitlist (Prototype 1's, plus a date range) ---------------- */
    if (step === "waitlist") {
        const toggleDaypart = (id: string) =>
            setWaitDayparts((list) => (id === "any" ? ["any"] : list.includes(id) ? list.filter((x) => x !== id) : [...list.filter((x) => x !== "any"), id]));

        return layout(
            waitlisted ? (
                <div className="flex flex-col items-start gap-5">
                    <CheckCircle className="size-12 text-fg-success-primary" aria-hidden="true" />
                    <div className="flex flex-col gap-2">
                        <h1 className="text-display-xs font-semibold text-primary">You&rsquo;re on the waitlist</h1>
                        <p className="text-md text-tertiary">
                            {service.name} with {coach.isAny ? `any instructor at ${COURSE_NAME[course]}` : coach.name}, between {fmtShort(dateOfIso(waitFrom))}
                            {waitTo ? ` and ${fmtShort(dateOfIso(waitTo))}` : " and whenever something opens"}. We&rsquo;ll text {contact.phone} the moment a slot
                            matches — first to reply takes it.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button size="lg" color="secondary" onClick={() => go("time")}>
                            Back to times
                        </Button>
                        <Button size="lg" color="link-gray" href="/instruction">
                            All instruction
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-display-xs font-semibold text-primary">Join the waitlist</h1>
                        <p className="text-sm text-tertiary">
                            Tell us when you could play and we&rsquo;ll text you the moment {coach.isAny ? "an instructor" : coach.name} has a slot. Nothing is charged
                            until you accept.
                        </p>
                    </div>

                    <section className="flex flex-col gap-3">
                        <h2 className="text-sm font-semibold text-primary">Between which dates?</h2>
                        <div className="flex flex-wrap gap-3">
                            <Input label="From" type="date" value={waitFrom} onChange={setWaitFrom} className="w-44" />
                            <Input label="To" type="date" value={waitTo} onChange={setWaitTo} className="w-44" hint="Leave blank for no end date" />
                        </div>
                    </section>

                    <section className="flex flex-col gap-3">
                        <h2 className="text-sm font-semibold text-primary">Times of day that work</h2>
                        <div className="flex flex-wrap gap-2">
                            {[{ id: "any", label: "Any time" }, ...DAYPARTS].map((d) => {
                                const on = waitDayparts.includes(d.id);
                                return (
                                    <button
                                        key={d.id}
                                        type="button"
                                        aria-pressed={on}
                                        onClick={() => toggleDaypart(d.id)}
                                        className={cx(
                                            "rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
                                            on ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
                                        )}
                                    >
                                        {d.label}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="flex flex-col gap-3">
                        <h2 className="text-sm font-semibold text-primary">Days that work</h2>
                        <div className="flex flex-wrap gap-2">
                            {DOW.map((label, value) => {
                                const on = waitDays.includes(value);
                                return (
                                    <button
                                        key={label}
                                        type="button"
                                        aria-pressed={on}
                                        onClick={() => setWaitDays((list) => (on ? list.filter((d) => d !== value) : [...list, value]))}
                                        className={cx(
                                            "w-12 rounded-full py-1.5 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
                                            on ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
                                        )}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-tertiary">{waitDays.length === 0 ? "Any day" : `${waitDays.length} ${waitDays.length === 1 ? "day" : "days"} selected`}</p>
                    </section>

                    <section className="flex flex-col gap-3 border-t border-secondary pt-6">
                        <h2 className="text-sm font-semibold text-primary">Where to reach you</h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Input label="Mobile" type="tel" value={contact.phone} onChange={(v) => setContact((c) => ({ ...c, phone: v }))} isRequired />
                            <Input label="Email" type="email" value={contact.email} onChange={(v) => setContact((c) => ({ ...c, email: v }))} isRequired />
                        </div>
                    </section>
                </>
            ),
            summary(
                waitlisted ? null : (
                    <div className="flex flex-col gap-2">
                        <Button size="lg" color="primary" iconLeading={Bell01} className="w-full" isDisabled={!contact.phone.trim()} onClick={() => setWaitlisted(true)}>
                            Join the waitlist
                        </Button>
                        <Button size="lg" color="secondary" className="w-full" onClick={() => go("time")}>
                            Back to times
                        </Button>
                    </div>
                ),
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

                {/* Account — required to book, but never at the cost of the booking */}
                <SignInGate
                    what="lesson"
                    email={contact.email}
                    onEmail={(v) => setContact((c) => ({ ...c, email: v }))}
                    first={contact.first}
                    last={contact.last}
                    onName={(patch) => setContact((c) => ({ ...c, ...patch }))}
                />

                {/* Contact info */}
                <section className={cx("flex flex-col gap-4", !signedIn && "opacity-60")}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-primary">Contact info</h2>
                        {!signedIn && <span className="text-xs font-medium text-tertiary">Fills in once you sign in</span>}
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

                {/* Extras — Square put these on their own step; MCG wanted them here */}
                <section className="flex flex-col gap-3 border-t border-secondary pt-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-primary">Add to your lesson</h2>
                        <p className="text-sm text-tertiary">Optional. Added to this booking and charged with it.</p>
                    </div>
                    <NativeSelect
                        label="Extras"
                        value=""
                        onChange={(e) => {
                            const id = e.target.value;
                            if (id && !extraIds.includes(id)) setExtraIds((ids) => [...ids, id]);
                        }}
                        options={[
                            { label: "Choose an extra…", value: "" },
                            ...LESSON_EXTRAS.filter((e) => !extraIds.includes(e.id)).map((e) => ({ label: `${e.name} — ${money(e.price)}`, value: e.id })),
                        ]}
                        hint="Sample extras for this prototype — MCG doesn't publish lesson add-ons."
                    />
                    {extras.length > 0 && (
                        <ul className="flex flex-col gap-2">
                            {extras.map((e) => (
                                <li key={e.id} className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-4 py-2.5">
                                    <span className="flex min-w-0 flex-col">
                                        <span className="text-sm font-semibold text-primary">{e.name}</span>
                                        <span className="text-xs text-tertiary">
                                            {money(e.price)}
                                            {e.minutes ? ` · +${e.minutes} min` : ""}
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setExtraIds((ids) => ids.filter((x) => x !== e.id))}
                                        className="text-xs font-semibold text-tertiary underline transition duration-100 ease-linear hover:text-error-primary"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
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
                    <Button size="lg" color="primary" className="w-full" isDisabled={!signedIn || blocked || incomplete} onClick={() => go("confirmation")}>
                        Book lesson
                    </Button>
                    {(!signedIn || blocked || incomplete) && (
                        <p className="text-center text-xs text-tertiary">
                            {!signedIn
                                ? "Sign in above to book — everything you've chosen is held."
                                : blocked
                                  ? "Someone on this booking can't take this lesson."
                                  : "Fill in the required details to book."}
                        </p>
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

            {/* Packs are bought on their own — so the offer comes after the booking, not inside it. */}
            {!coach.isAny && <PackPrompt coach={coach} />}
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
