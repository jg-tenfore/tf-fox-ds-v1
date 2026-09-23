"use client";

/**
 * `/instruction/service/[id]` (Prototype 3) — the service-first path, Square-style.
 *
 * Square's service page (references/091526): a breadcrumb back to all services, the
 * service's name, price · duration and description, then a **Staff** radio list with
 * "Any staff" selected by default and one photo row per person. Choosing is a radio,
 * not a link — the golfer confirms with a single button.
 *
 * Here "Any available instructor" merges every instructor's openings at the course, so
 * nobody lands on one pro's empty calendar. Continue hands off to `/instruction/book`,
 * which carries on with Extras, Date & time and Checkout under the same step rail.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Users01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import {
    ANY_INSTRUCTOR,
    BOOKABLE_COACHES,
    type Coach,
    anyInstructorDay,
    applyGuardrails,
    guardrailSummary,
    money0,
    nextOpening,
    serviceById,
    servicePrice,
} from "@/components/instruction-3/instruction-catalog";
import { CoachAvatar, GroupSizePriceTable, StepRail } from "@/components/instruction-3/instruction-ui";
import { McgPage, McgShell } from "@/components/mcg-3/mcg-chrome";
import { DEFAULT_DATE } from "@/stories/explorations/tee-search-popovers";
import { cx } from "@/utils/cx";
import { ACADEMY_COURSE_NAME, ALL_COURSES, AcademyCourseStrip } from "../academy/academy-ui";
import { bookHref } from "../academy/book-screen";
import { SQUARE_RAIL } from "./booking-rail";
import { SKILL_LABEL, offeringsAt } from "./offerings";

const RadioRow = ({
    coach,
    selected,
    onSelect,
    price,
    sub,
    disabled,
}: {
    coach: Coach;
    selected: boolean;
    onSelect: () => void;
    price?: string;
    sub: string;
    disabled?: boolean;
}) => (
    <button
        type="button"
        role="radio"
        aria-checked={selected}
        disabled={disabled}
        onClick={onSelect}
        className={cx(
            "flex w-full items-center gap-4 py-4 text-left transition duration-100 ease-linear disabled:cursor-not-allowed disabled:opacity-50",
            !disabled && "hover:bg-primary_hover",
        )}
    >
        <CoachAvatar coach={coach} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-md font-semibold text-primary">
                {coach.isAny ? "Any available instructor" : coach.name}
                {coach.credential ? `, ${coach.credential}` : ""}
            </span>
            <span className="truncate text-sm text-tertiary">{sub}</span>
        </div>
        {price && <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">{price}</span>}
        <span
            className={cx(
                "flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition duration-100 ease-linear",
                selected ? "bg-brand-solid ring-transparent" : "bg-primary ring-primary",
            )}
            aria-hidden="true"
        >
            {selected && <span className="size-2 rounded-full bg-white" />}
        </span>
    </button>
);

export const ServiceScreen = ({ serviceId, initialCourse = ALL_COURSES }: { serviceId: string; initialCourse?: string }) => {
    const service = serviceById(serviceId);
    const [course, setCourse] = useState(initialCourse);
    const [choice, setChoice] = useState<string | null>(initialCourse !== ALL_COURSES ? "any" : null);
    /** Dates from the search step, carried through to the time board. */
    const [dates, setDates] = useState<{ from?: string; to?: string }>({});

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const c = params.get("course");
        if (c) {
            setCourse(c);
            setChoice("any");
        }
        setDates({ from: params.get("from") ?? undefined, to: params.get("to") ?? undefined });
    }, []);

    if (!service) {
        return (
            <McgShell>
                <McgPage width="3xl">
                    <h1 className="text-display-xs font-semibold text-primary">That lesson isn&rsquo;t offered</h1>
                    <Link href="/instruction" className="mt-4 inline-flex text-sm font-semibold text-brand-secondary hover:underline">
                        All instruction
                    </Link>
                </McgPage>
            </McgShell>
        );
    }

    const allCourses = course === ALL_COURSES;
    const coaches = BOOKABLE_COACHES.filter((c) => allCourses || c.courseSlugs.includes(course));
    const offering = offeringsAt(course).find((o) => o.key === `academy-${service.id}`);
    const rails = guardrailSummary(service);
    const anyOpen = allCourses ? 0 : applyGuardrails(anyInstructorDay(course, DEFAULT_DATE), service, DEFAULT_DATE).filter((s) => s.status === "open").length;

    const changeCourse = (slug: string) => {
        setCourse(slug);
        // "Any" needs a course; a specific instructor only survives if they teach there.
        setChoice((current) => {
            if (slug === ALL_COURSES) return current === "any" ? null : current;
            if (current && current !== "any" && !BOOKABLE_COACHES.find((c) => c.id === current)?.courseSlugs.includes(slug)) return "any";
            return current ?? "any";
        });
    };

    const chosenCoach = choice && choice !== "any" ? BOOKABLE_COACHES.find((c) => c.id === choice) : undefined;
    const continueHref = choice
        ? bookHref({ coachId: choice, serviceId: service.id, courseSlug: allCourses ? (chosenCoach?.courseSlugs[0] ?? undefined) : course, ...dates })
        : undefined;

    return (
        <McgShell bg="primary">
            <AcademyCourseStrip value={course} onChange={changeCourse} />
            <McgPage width="6xl">
                <StepRail steps={SQUARE_RAIL} current={1} />

                <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
                    <div className="flex min-w-0 flex-col gap-6">
                        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
                            <Link href={`/instruction/${allCourses ? "" : `?course=${course}`}`} className="text-tertiary transition duration-100 ease-linear hover:text-secondary">
                                All instruction
                            </Link>
                            <span className="text-quaternary">/</span>
                            <span className="font-semibold text-primary">{service.name}</span>
                        </nav>

                        <div className="flex flex-col gap-2">
                            <h1 className="text-display-xs font-semibold text-primary">{service.name}</h1>
                            <p className="text-sm text-secondary tabular-nums">
                                From {money0(offering?.priceFrom ?? service.basePrice)} · {service.durationMin} min
                            </p>
                            <p className="text-sm text-tertiary">{service.desc}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-tertiary">
                                <span className="flex items-center gap-1.5">
                                    <Users01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                    {service.minPlayers}–{service.maxPlayers} golfers
                                </span>
                                {rails && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="size-4 text-fg-quaternary" aria-hidden="true" />
                                        {rails}
                                    </span>
                                )}
                                {offering?.skills.map((s) => (
                                    <Badge key={s} color="gray" size="sm" type="pill-color">
                                        {SKILL_LABEL[s]}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <section className="flex flex-col">
                            <h2 className="text-lg font-semibold text-primary">Instructor</h2>
                            <p className="text-sm text-tertiary">
                                {allCourses
                                    ? "Choose a course above to book whoever is free first, or pick an instructor below."
                                    : `${coaches.length} ${coaches.length === 1 ? "instructor teaches" : "instructors teach"} this at ${ACADEMY_COURSE_NAME[course]}.`}
                            </p>

                            <div role="radiogroup" aria-label="Instructor" className="mt-2 flex flex-col divide-y divide-secondary">
                                <RadioRow
                                    coach={ANY_INSTRUCTOR}
                                    selected={choice === "any"}
                                    disabled={allCourses}
                                    onSelect={() => setChoice("any")}
                                    sub={allCourses ? "Pick a course first" : `${anyOpen} open ${anyOpen === 1 ? "time" : "times"} today · you'll see who before you pay`}
                                    price={offering ? `from ${money0(offering.priceFrom)}` : undefined}
                                />
                                {coaches.map((coach) => (
                                    <RadioRow
                                        key={coach.id}
                                        coach={coach}
                                        selected={choice === coach.id}
                                        onSelect={() => setChoice(coach.id)}
                                        price={money0(servicePrice(service, coach, 1))}
                                        sub={`${coach.title} · Next: ${nextOpening(coach.id, DEFAULT_DATE)}`}
                                    />
                                ))}
                            </div>

                            {coaches.length === 0 && (
                                <p className="mt-3 rounded-xl bg-secondary p-4 text-sm text-tertiary">
                                    No Academy instructor teaches at {ACADEMY_COURSE_NAME[course]}. Pick another course above.
                                </p>
                            )}
                        </section>
                    </div>

                    {/* ---- Lesson summary + the one action, the way Square keeps them together ---- */}
                    <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-24">
                        <h2 className="text-lg font-semibold text-primary">Lesson summary</h2>
                        <div className="flex flex-col divide-y divide-secondary rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
                            <div className="flex items-start gap-3 p-4">
                                <CoachAvatar coach={chosenCoach ?? ANY_INSTRUCTOR} size="sm" />
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <span className="text-sm font-semibold text-primary">{service.name}</span>
                                    <span className="text-sm text-tertiary">
                                        {chosenCoach ? `with ${chosenCoach.name}` : choice === "any" ? "with any instructor" : "Choose an instructor"}
                                    </span>
                                </div>
                                <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">
                                    {chosenCoach ? money0(servicePrice(service, chosenCoach, 1)) : `from ${money0(offering?.priceFrom ?? service.basePrice)}`}
                                </span>
                            </div>
                            <div className="p-4">
                                <GroupSizePriceTable service={service} coach={chosenCoach} narrow />
                            </div>
                        </div>
                        <Button size="lg" color="primary" iconTrailing={ArrowRight} className="w-full" href={continueHref} isDisabled={!continueHref}>
                            {choice ? "Next" : "Choose an instructor"}
                        </Button>
                    </aside>
                </div>
            </McgPage>
        </McgShell>
    );
};
