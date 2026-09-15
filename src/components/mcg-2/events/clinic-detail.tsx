"use client";

/**
 * `/clinics/[id]` — one county clinic.
 *
 * Enrolment goes through the cart (`addToCart`, kind `"clinic"`), the same route the
 * Events section uses, so a parent can enrol two juniors and themselves and pay once.
 *
 * The sections here are the ones a beginner actually needs before committing to five
 * weeks: what you'll learn, honestly who it is and isn't for, what to bring, what the
 * county provides, and who is teaching. A multi-week series gets its week-by-week
 * schedule spelled out — "Mondays from Jun 15" is not enough information to arrange
 * childcare around.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Backpack, Calendar, CheckCircle, Clock, MarkerPin01, Package, ShoppingCart01, Users01, XClose } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { McgPage, McgShell } from "@/components/mcg-2/mcg-chrome";
import {
    clinicById,
    COURSE_NAME,
    fmtDate,
    fmtDateShort,
    isFull,
    LEVEL_COLOR,
    MCG_CLINICS,
    type McgClinic,
    money0,
    sessionRegistered,
    spotsLeft,
} from "@/components/mcg-2/events-catalog";
import { BookingQuestions, EligibilityFields, MultiBuyBanner, RequirementsPanel } from "@/components/mcg-2/registration/registration-ui";
import {
    type EligibilityAnswers,
    ageRangeLabel,
    checkEligibility,
    collectsEligibility,
    genderLimitLabel,
    missingBookingAnswers,
    multiBuyLabel,
    quoteMultiBuy,
} from "@/components/mcg-2/registration-rules";
import { useSession } from "@/components/mcg-2/session";
import { cx } from "@/utils/cx";
import { Capacity, CourseChip, MetaLine, SectionTitle, Stepper } from "./events-ui";

const money = (n: number) => (n === 0 ? "Free" : `$${n.toFixed(2)}`);

/**
 * Week-by-week dates for a series. A weekly program's sessions are simply the start
 * date plus seven days, which is enough to answer "which Saturdays am I committing
 * to" without the catalog carrying twelve date strings per clinic.
 */
const sessionDates = (clinic: McgClinic): string[] => {
    const [y, m, d] = clinic.isoDate.split("-").map(Number);
    const daily = clinic.schedule.includes("–") && clinic.schedule.startsWith("Mon");
    return Array.from({ length: clinic.sessions }, (_, i) => {
        const dt = new Date(Date.UTC(y, m - 1, d + i * (daily ? 1 : 7)));
        return dt.toISOString().slice(0, 10);
    });
};

/* ------------------------------------------------------------------ */
/* Registration                                                        */
/* ------------------------------------------------------------------ */

/** One person being signed up: who they are, plus whatever the clinic's rules ask. */
export interface Registrant extends EligibilityAnswers {
    first: string;
    last: string;
}

const EMPTY_REGISTRANT: Registrant = { first: "", last: "", birthDate: "", gender: "", answers: {} };

/** Seats left on one date of a per-session clinic. */
const seatsOn = (clinic: McgClinic, index: number) => Math.max(0, clinic.capacity - sessionRegistered(clinic, index));

/**
 * Fox's session table: every date, its time, the seats left and the price, each row
 * selectable on its own. Only rendered for a clinic sold per session.
 */
const SessionTable = ({ clinic, dates, selected, onToggle }: { clinic: McgClinic; dates: string[]; selected: number[]; onToggle: (i: number) => void }) => (
    <div className="overflow-x-auto rounded-xl ring-1 ring-secondary ring-inset">
        <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-secondary">
                <tr>
                    <th className="w-12 px-4 py-2.5">
                        <span className="sr-only">Select</span>
                    </th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-tertiary">Date</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-tertiary">Time</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-tertiary">Spots left</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-tertiary">Price</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-secondary bg-primary">
                {dates.map((iso, i) => {
                    const left = seatsOn(clinic, i);
                    const full = left === 0;
                    const on = selected.includes(i);
                    return (
                        <tr
                            key={iso}
                            onClick={() => !full && onToggle(i)}
                            className={cx("transition duration-100 ease-linear", full ? "opacity-50" : "cursor-pointer hover:bg-primary_hover", on && "bg-brand-primary")}
                        >
                            <td className="px-4 py-3">
                                <Checkbox isSelected={on} isDisabled={full} onChange={() => onToggle(i)} aria-label={`Select ${fmtDate(iso)}`} />
                            </td>
                            <td className="px-4 py-3 font-medium text-primary">{fmtDate(iso)}</td>
                            <td className="px-4 py-3 text-tertiary">{clinic.time}</td>
                            <td className="px-4 py-3 tabular-nums">
                                {full ? <span className="font-semibold text-error-primary">Full</span> : <span className="text-secondary">{left}</span>}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-primary tabular-nums">{money(clinic.perSession?.price ?? clinic.price)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);

/**
 * The sign-up sheet. Opens from the enrol card with the places and sessions already
 * chosen, and collects one block per person — name, then only what this clinic's
 * rules ask: date of birth, gender, per-golfer questions — plus any booking-level
 * questions once at the bottom.
 *
 * Nothing reaches the cart until every person is eligible and every required answer
 * is in. A golfer outside the age range or gender limit gets the reason inline, next
 * to their name, rather than a refund call a week later.
 */
const RegistrationSheet = ({
    clinic,
    places,
    sessionIndexes,
    dates,
    initialPeople,
    onClose,
    onDone,
}: {
    clinic: McgClinic;
    places: number;
    sessionIndexes: number[];
    dates: string[];
    initialPeople?: Registrant[];
    onClose: () => void;
    onDone: () => void;
}) => {
    const { addToCart } = useSession();
    const rules = clinic.rules;
    const [people, setPeople] = useState<Registrant[]>(() => Array.from({ length: places }, (_, i) => initialPeople?.[i] ?? EMPTY_REGISTRANT));
    const [bookingAnswers, setBookingAnswers] = useState<Record<string, string>>({});

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const perSession = Boolean(clinic.perSession);
    // Eligibility is judged on the first session the golfer is actually attending.
    const firstIso = perSession && sessionIndexes.length ? dates[Math.min(...sessionIndexes)] : clinic.isoDate;
    const results = people.map((p) => checkEligibility(rules, p, firstIso, p.first || "This golfer"));
    const namesMissing = people.some((p) => !p.first.trim() || !p.last.trim());
    const blocked = results.some((r) => r.problems.length > 0);
    const incomplete = namesMissing || results.some((r) => r.incomplete) || missingBookingAnswers(rules, bookingAnswers).length > 0;

    const unit = clinic.perSession?.price ?? clinic.price;
    const sessionCount = perSession ? sessionIndexes.length : 1;
    const quote = quoteMultiBuy(unit * places, sessionCount, perSession ? rules?.multiBuy : undefined);

    const update = (i: number, patch: Partial<Registrant>) => setPeople((list) => list.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

    const submit = () => {
        const who = people.map((p) => `${p.first} ${p.last}`).join(", ");
        if (perSession) {
            for (const i of sessionIndexes) {
                addToCart({
                    id: `clinic-${clinic.id}-${dates[i]}`,
                    kind: "clinic",
                    name: `${clinic.title} — ${fmtDateShort(dates[i])}`,
                    detail: `${COURSE_NAME[clinic.courseSlug]} · ${who}`,
                    image: clinic.image,
                    unitPrice: unit,
                    qty: places,
                    href: `/clinics/${clinic.id}`,
                    multiBuy: rules?.multiBuy ? { ...rules.multiBuy, groupId: clinic.id, groupName: clinic.title } : undefined,
                });
            }
        } else {
            addToCart({
                id: `clinic-${clinic.id}`,
                kind: "clinic",
                name: clinic.title,
                detail: `${clinic.schedule} · ${COURSE_NAME[clinic.courseSlug]} · ${who}`,
                image: clinic.image,
                unitPrice: clinic.price,
                qty: places,
                href: `/clinics/${clinic.id}`,
            });
        }
        onDone();
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <button type="button" aria-label="Close registration" onClick={onClose} className="absolute inset-0 bg-overlay/70" />
            <div role="dialog" aria-label={`Register for ${clinic.title}`} className="relative flex h-full w-full max-w-xl flex-col bg-primary shadow-xl duration-300 animate-in slide-in-from-right">
                <div className="flex items-start justify-between gap-4 border-b border-secondary p-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-primary">Register</h2>
                        <p className="text-sm text-tertiary">
                            {clinic.title}
                            {perSession ? ` · ${sessionCount} ${sessionCount === 1 ? "session" : "sessions"}` : ""} · {places} {places === 1 ? "place" : "places"}
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="flex size-10 shrink-0 items-center justify-center rounded-full text-fg-secondary ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary_hover"
                    >
                        <XClose className="size-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
                    {collectsEligibility(rules) && (
                        <p className="text-sm text-tertiary">
                            {[ageRangeLabel(rules?.age), genderLimitLabel(rules ?? {})].filter(Boolean).join(" · ")}. Enter details for the person attending, not the person paying.
                        </p>
                    )}

                    {people.map((p, i) => (
                        <section key={i} className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-secondary ring-inset">
                            <p className="text-sm font-semibold text-primary">{places > 1 ? `Golfer ${i + 1}` : "Golfer"}</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Input label="First name" value={p.first} onChange={(v) => update(i, { first: v })} isRequired />
                                <Input label="Last name" value={p.last} onChange={(v) => update(i, { last: v })} isRequired />
                            </div>
                            <EligibilityFields rules={rules} value={p} onChange={(patch) => update(i, patch)} result={results[i]} />
                        </section>
                    ))}

                    {(rules?.questions ?? []).some((q) => q.per === "booking") && (
                        <section className="flex flex-col gap-3">
                            <p className="text-sm font-semibold text-primary">About this registration</p>
                            <BookingQuestions rules={rules} answers={bookingAnswers} onChange={(id, v) => setBookingAnswers((a) => ({ ...a, [id]: v }))} />
                        </section>
                    )}
                </div>

                <div className="flex flex-col gap-3 border-t border-secondary p-6">
                    {quote.discount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-tertiary">{rules?.multiBuy && multiBuyLabel(rules.multiBuy)}</span>
                            <span className="font-semibold text-success-primary tabular-nums">−{money(quote.discount)}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-tertiary">Total</span>
                        <span className="text-lg font-semibold text-primary tabular-nums">{money(quote.total)}</span>
                    </div>
                    <Button size="lg" color="primary" isDisabled={blocked || incomplete} onClick={submit}>
                        Add to cart
                    </Button>
                    <p className="text-center text-xs text-tertiary">
                        {blocked ? "Someone above can't be registered for this clinic." : incomplete ? "Fill in the required details to continue." : "You'll pay at checkout."}
                    </p>
                </div>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Enrolment card                                                      */
/* ------------------------------------------------------------------ */

const EnrolCard = ({
    clinic,
    dates,
    selectedSessions,
    onRegister,
    added,
}: {
    clinic: McgClinic;
    dates: string[];
    selectedSessions: number[];
    onRegister: (places: number) => void;
    added: boolean;
}) => {
    const { cart } = useSession();
    const perSession = Boolean(clinic.perSession);
    const full = perSession ? dates.every((_, i) => seatsOn(clinic, i) === 0) : isFull(clinic);
    const left = spotsLeft(clinic);
    const [qty, setQty] = useState(1);
    const [waitlisted, setWaitlisted] = useState(false);

    const inCart = cart.filter((l) => l.id === `clinic-${clinic.id}` || l.id.startsWith(`clinic-${clinic.id}-`));
    const seatCap = perSession && selectedSessions.length ? Math.min(...selectedSessions.map((i) => seatsOn(clinic, i))) : left;
    const max = Math.max(1, Math.min(seatCap || 1, 4));
    const unit = clinic.perSession?.price ?? clinic.price;
    const quote = quoteMultiBuy(unit * qty, perSession ? selectedSessions.length : 1, perSession ? clinic.rules?.multiBuy : undefined);

    if (waitlisted) {
        return (
            <div className="sticky top-6 rounded-2xl bg-primary p-5 shadow-lg ring-1 ring-secondary">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-secondary px-3 py-1 text-xs font-semibold text-warning-primary">On the waitlist</span>
                <p className="mt-3 text-md font-semibold text-primary">You're on the list</p>
                <p className="mt-1 text-sm text-tertiary">
                    County clinics run several sessions a summer. We'll call you when a spot opens here, and email you when the next {clinic.title} session at another course opens
                    registration.
                </p>
                <Button size="lg" color="secondary" href="/instruction/?format=group" className="mt-4 w-full">
                    Back to all clinics
                </Button>
            </div>
        );
    }

    return (
        <div className="sticky top-6 rounded-2xl bg-primary p-5 shadow-lg ring-1 ring-secondary">
            <div className="flex items-baseline gap-1.5">
                <span className="text-display-xs font-semibold text-primary tabular-nums">{money0(unit)}</span>
                <span className="text-sm text-tertiary">{clinic.priceUnit}</span>
            </div>
            {!perSession && clinic.sessions > 1 && clinic.price > 0 && (
                <p className="mt-1 text-xs text-tertiary tabular-nums">{money0(clinic.price / clinic.sessions)} a session across {clinic.sessions} weeks</p>
            )}

            <div className="mt-4 flex flex-col gap-2">
                <MetaLine icon={Calendar}>{clinic.schedule}</MetaLine>
                <MetaLine icon={Clock}>{clinic.time}</MetaLine>
                <MetaLine icon={MarkerPin01}>{clinic.location}</MetaLine>
            </div>

            {!perSession && (
                <div className="mt-4 border-t border-secondary pt-4">
                    <Capacity capacity={clinic.capacity} registered={clinic.registered} />
                </div>
            )}

            {full ? (
                <>
                    <p className="mt-4 text-sm text-tertiary">This session is full. Join the waitlist and we'll call in order — county clinics typically release one or two places.</p>
                    <Button size="lg" color="primary" className="mt-4 w-full" onClick={() => setWaitlisted(true)}>
                        Join the waitlist
                    </Button>
                    <p className="mt-2.5 text-center text-xs text-tertiary">Free to join · nothing charged until you accept</p>
                </>
            ) : (
                <>
                    {perSession && clinic.rules?.multiBuy && <MultiBuyBanner rule={clinic.rules.multiBuy} quote={quote} className="mt-4" />}

                    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-secondary p-3">
                        <div>
                            <p className="text-sm font-semibold text-primary">Places</p>
                            <p className="text-xs text-tertiary">{perSession ? "Per session" : "Enrol a whole family at once"}</p>
                        </div>
                        <Stepper value={Math.min(qty, max)} max={max} onChange={setQty} label="places" />
                    </div>

                    <div className="mt-4 flex flex-col gap-1.5 border-t border-secondary pt-4 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-tertiary tabular-nums">
                                {perSession ? `${selectedSessions.length} ${selectedSessions.length === 1 ? "session" : "sessions"} × ${qty}` : `${money(clinic.price)} × ${qty}`}
                            </span>
                            <span className="text-primary tabular-nums">{money(quote.subtotal)}</span>
                        </div>
                        {quote.discount > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-tertiary">Multi-session discount</span>
                                <span className="font-semibold text-success-primary tabular-nums">−{money(quote.discount)}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-primary">Total</span>
                            <span className="font-semibold text-primary tabular-nums">{money(quote.total)}</span>
                        </div>
                    </div>

                    <Button size="lg" color="primary" className="mt-4 w-full" isDisabled={perSession && selectedSessions.length === 0} onClick={() => onRegister(Math.min(qty, max))}>
                        {perSession && selectedSessions.length === 0 ? "Choose sessions above" : clinic.price === 0 ? "Reserve a free place" : "Register"}
                    </Button>

                    {(added || inCart.length > 0) && (
                        <Link
                            href="/cart"
                            className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline"
                        >
                            <ShoppingCart01 className="size-4" aria-hidden="true" />
                            {added ? "Added to your cart" : "In your cart"} — check out
                        </Link>
                    )}
                    <p className="mt-2.5 text-center text-xs text-tertiary">Scholarship places available — ask at any pro shop</p>
                </>
            )}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export interface ClinicDetailScreenProps {
    clinicId: string;
    /** Stories: pre-select session rows (by index) on a per-session clinic. */
    initialSessions?: number[];
    /** Stories: open straight on the registration sheet with this many places. */
    initialRegistration?: { places: number; people?: Registrant[] };
}

export const ClinicDetailScreen = ({ clinicId, initialSessions = [], initialRegistration }: ClinicDetailScreenProps) => {
    const clinic = clinicById(clinicId);
    const [selectedSessions, setSelectedSessions] = useState<number[]>(initialSessions);
    const [sheet, setSheet] = useState<{ places: number; people?: Registrant[] } | null>(initialRegistration ?? null);
    const [added, setAdded] = useState(false);

    if (!clinic) {
        return (
            <McgShell>
                <McgPage width="3xl">
                    <h1 className="text-display-xs font-semibold text-primary">That clinic isn't running</h1>
                    <p className="mt-2 text-md text-tertiary">The session may have finished, or the link may be out of date.</p>
                    <Button size="lg" href="/instruction/?format=group" className="mt-6" iconLeading={ArrowLeft}>
                        All instruction
                    </Button>
                </McgPage>
            </McgShell>
        );
    }

    const dates = sessionDates(clinic);
    const related = MCG_CLINICS.filter((c) => c.id !== clinic.id && (c.audience === clinic.audience || c.level === clinic.level)).slice(0, 3);

    return (
        <McgShell>
            <McgPage width="6xl">
                <Link href="/instruction/?format=group" className="mb-5 flex w-fit items-center gap-1.5 text-sm font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary">
                    <ArrowLeft className="size-4" aria-hidden="true" /> All instruction
                </Link>

                <div className="relative aspect-[5/2] w-full overflow-hidden rounded-3xl bg-secondary_subtle ring-1 ring-secondary ring-inset">
                    <img src={clinic.image} alt="" className="size-full object-cover" />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                    <Badge color={LEVEL_COLOR[clinic.level]} size="md" type="pill-color">
                        {clinic.level}
                    </Badge>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary">{clinic.audience}</span>
                    <CourseChip slug={clinic.courseSlug} />
                    {clinic.sessions > 1 && <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary">{clinic.sessions}-session series</span>}
                    {isFull(clinic) && <span className="rounded-full bg-error-secondary px-2.5 py-1 text-xs font-semibold text-error-primary">Waitlist only</span>}
                </div>

                <h1 className="mt-3 max-w-3xl text-display-sm font-semibold text-primary">{clinic.title}</h1>
                <p className="mt-2 text-md font-semibold text-brand-secondary">with {clinic.instructor.name}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                    <MetaLine icon={Calendar}>{clinic.schedule}</MetaLine>
                    <MetaLine icon={Clock}>{clinic.time}</MetaLine>
                    <MetaLine icon={MarkerPin01}>{clinic.location}</MetaLine>
                    <MetaLine icon={Users01}>{clinic.audience}</MetaLine>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-3">
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        <section>
                            <SectionTitle>About this clinic</SectionTitle>
                            <p className="mt-3 text-md text-secondary">{clinic.description}</p>
                        </section>

                        <section>
                            <SectionTitle>What you'll learn</SectionTitle>
                            <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {clinic.learn.map((item) => (
                                    <li key={item} className="flex items-start gap-2.5">
                                        <CheckCircle className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                        <span className="text-sm text-secondary">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>Skill level and who it's for</SectionTitle>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <Badge color={LEVEL_COLOR[clinic.level]} size="md" type="pill-color">
                                    {clinic.level}
                                </Badge>
                                <span className="text-sm font-medium text-secondary">{clinic.audience}</span>
                            </div>
                            <p className="mt-2.5 text-sm text-tertiary">{clinic.prerequisites}</p>
                        </section>

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>What to bring</SectionTitle>
                            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
                                        <Backpack className="size-4 text-fg-quaternary" aria-hidden="true" /> Bring
                                    </p>
                                    <ul className="flex flex-col gap-1.5">
                                        {clinic.bring.map((b) => (
                                            <li key={b} className="text-sm text-tertiary">
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
                                        <Package className="size-4 text-fg-quaternary" aria-hidden="true" /> The county provides
                                    </p>
                                    <ul className="flex flex-col gap-1.5">
                                        {clinic.provided.map((p) => (
                                            <li key={p} className="text-sm text-tertiary">
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>Registration details</SectionTitle>
                            <div className="mt-4">
                                <RequirementsPanel rules={clinic.rules} title="Who can register" />
                                {!clinic.rules && <p className="text-sm text-tertiary">Open to everyone — no age, gender or sign-up questions.</p>}
                            </div>
                        </section>

                        {clinic.perSession ? (
                            <section id="sessions" className="border-t border-secondary pt-8">
                                <SectionTitle sub="Each date is booked on its own. Choose the ones that work for you.">Sessions</SectionTitle>
                                <div className="mt-4 flex flex-col gap-3">
                                    <SessionTable
                                        clinic={clinic}
                                        dates={dates}
                                        selected={selectedSessions}
                                        onToggle={(i) => setSelectedSessions((list) => (list.includes(i) ? list.filter((x) => x !== i) : [...list, i].sort((a, b) => a - b)))}
                                    />
                                    {clinic.rules?.multiBuy && (
                                        <MultiBuyBanner rule={clinic.rules.multiBuy} quote={quoteMultiBuy(clinic.perSession.price, selectedSessions.length, clinic.rules.multiBuy)} />
                                    )}
                                </div>
                            </section>
                        ) : (
                        <section className="border-t border-secondary pt-8">
                            <SectionTitle sub={clinic.sessions > 1 ? "Every session, so you can check the whole run before you commit." : undefined}>Schedule</SectionTitle>
                            <ol className="mt-4 flex flex-col gap-2">
                                {dates.map((iso, i) => (
                                    <li key={iso} className="flex items-center gap-3 rounded-lg bg-primary px-3.5 py-2.5 ring-1 ring-secondary ring-inset">
                                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary tabular-nums">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm font-medium text-primary">{fmtDate(iso)}</span>
                                        <span className="ml-auto text-sm text-tertiary">{clinic.time}</span>
                                    </li>
                                ))}
                            </ol>
                        </section>
                        )}

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>Your instructor</SectionTitle>
                            <div className="mt-4 flex items-start gap-4">
                                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-primary text-lg font-semibold text-brand-secondary ring-1 ring-secondary ring-inset">
                                    {clinic.instructor.initials}
                                </span>
                                <div>
                                    <p className="text-md font-semibold text-primary">{clinic.instructor.name}</p>
                                    <p className="text-sm text-brand-secondary">{clinic.instructor.title}</p>
                                    <p className="mt-1.5 text-sm text-tertiary">{clinic.instructor.bio}</p>
                                    <Button size="sm" color="link-color" href="/instruction" className="mt-2">
                                        Book a private lesson at the Golf Academy
                                    </Button>
                                </div>
                            </div>
                        </section>

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>Where</SectionTitle>
                            <div className="mt-3 flex flex-col gap-2">
                                <CourseChip slug={clinic.courseSlug} size="md" />
                                <p className="text-sm text-tertiary">
                                    Meet at the {clinic.location.toLowerCase()}. Parking is free and there is no charge for range balls during a clinic session.
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <EnrolCard clinic={clinic} dates={dates} selectedSessions={selectedSessions} added={added} onRegister={(places) => setSheet({ places })} />
                    </div>
                </div>

                {related.length > 0 && (
                    <section className="mt-14 border-t border-secondary pt-8">
                        <SectionTitle sub="Other county programs at a similar level, or for the same group.">Next steps</SectionTitle>
                        <div className="mt-5 flex flex-col gap-3">
                            {related.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/clinics/${c.id}`}
                                    className={cx(
                                        "flex items-center gap-4 rounded-xl bg-primary px-4 py-3.5 text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand",
                                    )}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-primary">{c.title}</p>
                                        <p className="truncate text-sm text-tertiary">
                                            {fmtDateShort(c.isoDate)} · {COURSE_NAME[c.courseSlug]} · with {c.instructor.name}
                                        </p>
                                    </div>
                                    <Badge color={LEVEL_COLOR[c.level]} size="sm" type="pill-color">
                                        {c.level}
                                    </Badge>
                                    <span className="hidden shrink-0 text-sm font-semibold text-primary tabular-nums sm:block">{money0(c.price)}</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </McgPage>

            {sheet && (
                <RegistrationSheet
                    clinic={clinic}
                    places={sheet.places}
                    sessionIndexes={selectedSessions}
                    dates={dates}
                    initialPeople={sheet.people}
                    onClose={() => setSheet(null)}
                    onDone={() => {
                        setSheet(null);
                        setAdded(true);
                    }}
                />
            )}
        </McgShell>
    );
};
