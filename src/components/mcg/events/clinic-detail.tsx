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

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Backpack, Calendar, CheckCircle, Clock, MarkerPin01, Package, ShoppingCart01, Users01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { McgPage, McgShell } from "@/components/mcg/mcg-chrome";
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
    spotsLeft,
} from "@/components/mcg/events-catalog";
import { useSession } from "@/components/mcg/session";
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
/* Enrolment card                                                      */
/* ------------------------------------------------------------------ */

const EnrolCard = ({ clinic }: { clinic: McgClinic }) => {
    const { addToCart, cart } = useSession();
    const full = isFull(clinic);
    const left = spotsLeft(clinic);
    const [qty, setQty] = useState(1);
    const [waitlisted, setWaitlisted] = useState(false);

    const lineId = `clinic-${clinic.id}`;
    const inCart = cart.find((l) => l.id === lineId);
    const max = Math.min(left || 1, 4);

    if (waitlisted) {
        return (
            <div className="sticky top-6 rounded-2xl bg-primary p-5 shadow-lg ring-1 ring-secondary">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-secondary px-3 py-1 text-xs font-semibold text-warning-primary">On the waitlist</span>
                <p className="mt-3 text-md font-semibold text-primary">You're on the list</p>
                <p className="mt-1 text-sm text-tertiary">
                    County clinics run several sessions a summer. We'll call you when a spot opens here, and email you when the next {clinic.title} session at another course opens
                    registration.
                </p>
                <Button size="lg" color="secondary" href="/clinics" className="mt-4 w-full">
                    Back to all clinics
                </Button>
            </div>
        );
    }

    return (
        <div className="sticky top-6 rounded-2xl bg-primary p-5 shadow-lg ring-1 ring-secondary">
            <div className="flex items-baseline gap-1.5">
                <span className="text-display-xs font-semibold text-primary tabular-nums">{money0(clinic.price)}</span>
                <span className="text-sm text-tertiary">{clinic.priceUnit}</span>
            </div>
            {clinic.sessions > 1 && clinic.price > 0 && (
                <p className="mt-1 text-xs text-tertiary tabular-nums">{money0(clinic.price / clinic.sessions)} a session across {clinic.sessions} weeks</p>
            )}

            <div className="mt-4 flex flex-col gap-2">
                <MetaLine icon={Calendar}>{clinic.schedule}</MetaLine>
                <MetaLine icon={Clock}>{clinic.time}</MetaLine>
                <MetaLine icon={MarkerPin01}>{clinic.location}</MetaLine>
            </div>

            <div className="mt-4 border-t border-secondary pt-4">
                <Capacity capacity={clinic.capacity} registered={clinic.registered} />
            </div>

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
                    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-secondary p-3">
                        <div>
                            <p className="text-sm font-semibold text-primary">Places</p>
                            <p className="text-xs text-tertiary">Enrol a whole family at once</p>
                        </div>
                        <Stepper value={qty} max={max} onChange={setQty} label="places" />
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-secondary pt-4 text-sm">
                        <span className="text-tertiary tabular-nums">
                            {money(clinic.price)} × {qty}
                        </span>
                        <span className="font-semibold text-primary tabular-nums">{money(clinic.price * qty)}</span>
                    </div>

                    <Button
                        size="lg"
                        color="primary"
                        className="mt-4 w-full"
                        onClick={() =>
                            addToCart({
                                id: lineId,
                                kind: "clinic",
                                name: clinic.title,
                                detail: `${clinic.schedule} · ${COURSE_NAME[clinic.courseSlug]}`,
                                image: clinic.image,
                                unitPrice: clinic.price,
                                qty,
                                href: `/clinics/${clinic.id}`,
                            })
                        }
                    >
                        {inCart ? "Add another place" : clinic.price === 0 ? "Reserve a free place" : "Enrol"}
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
                    <p className="mt-2.5 text-center text-xs text-tertiary">Scholarship places available — ask at any pro shop</p>
                </>
            )}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const ClinicDetailScreen = ({ clinicId }: { clinicId: string }) => {
    const clinic = clinicById(clinicId);

    if (!clinic) {
        return (
            <McgShell>
                <McgPage width="3xl">
                    <h1 className="text-display-xs font-semibold text-primary">That clinic isn't running</h1>
                    <p className="mt-2 text-md text-tertiary">The session may have finished, or the link may be out of date.</p>
                    <Button size="lg" href="/clinics" className="mt-6" iconLeading={ArrowLeft}>
                        All county clinics
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
                <Link href="/clinics" className="mb-5 flex w-fit items-center gap-1.5 text-sm font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary">
                    <ArrowLeft className="size-4" aria-hidden="true" /> All county clinics
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
                        <EnrolCard clinic={clinic} />
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
        </McgShell>
    );
};
