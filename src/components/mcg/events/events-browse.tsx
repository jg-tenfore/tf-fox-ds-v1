"use client";

/**
 * `/events` — browse everything the county is running this summer.
 *
 * A muni system's events page has a different job from a private club's: nine
 * courses, six kinds of programming, and a golfer who mostly wants to know "what is
 * near me, and can I still get in". So the filter bar leads with category and course,
 * capacity is on every card, and a full event advertises its waitlist instead of
 * greying itself out.
 *
 * The featured event sits above the grid and only appears when it survives the
 * current filters — a hero that ignores the filter bar is a hero nobody trusts.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MarkerPin01, Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { McgHero, McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import {
    CATEGORIES,
    CATEGORY_UI,
    COURSE_NAME,
    COURSE_SLUGS,
    type EventCategory,
    EVENT_MONTHS,
    fmtDate,
    isFull,
    MCG_EVENTS,
    monthKey,
    monthLabel,
    money0,
    spotsLeft,
} from "@/components/mcg/events-catalog";
import { Capacity, CategoryPill, CourseChip, EventCard, FilterChips, MetaLine, NoResults, SelectMenu } from "./events-ui";

type CategoryFilter = "all" | EventCategory;
type CourseFilter = "all" | string;
type MonthFilter = "all" | string;

const CATEGORY_OPTIONS: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: "All programming" },
    ...CATEGORIES.map((c) => ({ id: c as CategoryFilter, label: CATEGORY_UI[c].label })),
];

const COURSE_OPTIONS: { id: CourseFilter; label: string }[] = [
    { id: "all", label: `All ${COURSE_SLUGS.length} courses` },
    ...COURSE_SLUGS.map((slug) => ({ id: slug as CourseFilter, label: COURSE_NAME[slug] })),
];

const MONTH_OPTIONS: { id: MonthFilter; label: string }[] = [{ id: "all", label: "All summer" }, ...EVENT_MONTHS.map((m) => ({ id: m as MonthFilter, label: monthLabel(m) }))];

/* ------------------------------------------------------------------ */
/* Featured banner                                                     */
/* ------------------------------------------------------------------ */

const Featured = ({ id }: { id: string }) => {
    const event = MCG_EVENTS.find((e) => e.id === id)!;
    const left = spotsLeft(event);

    return (
        <div className="mb-8 overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary_subtle lg:aspect-auto lg:min-h-72">
                    <img src={event.image} alt="" className="size-full object-cover" />
                </div>
                <div className="flex flex-col items-start gap-4 p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-brand-solid px-2.5 py-1 text-xs font-semibold text-white">Featured</span>
                        <CategoryPill category={event.category} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-display-xs font-semibold text-primary">{event.title}</h2>
                        <p className="text-sm text-tertiary">{event.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                        <MetaLine icon={Calendar}>{fmtDate(event.isoDate)}</MetaLine>
                        <MetaLine icon={MarkerPin01}>{COURSE_NAME[event.courseSlug]}</MetaLine>
                        <MetaLine icon={Users01}>{event.format}</MetaLine>
                    </div>
                    <div className="w-full max-w-sm">
                        <Capacity capacity={event.capacity} registered={event.registered} />
                    </div>
                    <div className="mt-auto flex flex-wrap items-center gap-4">
                        <Button size="lg" href={`/events/${event.id}`} iconTrailing={ArrowRight}>
                            {isFull(event) ? "Join the waitlist" : `Register — ${money0(event.price)}`}
                        </Button>
                        <span className="text-sm text-tertiary tabular-nums">{left > 0 ? `${left} of ${event.capacity} spots open` : "Field is full"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const EventsBrowseScreen = () => {
    const [category, setCategory] = useState<CategoryFilter>("all");
    const [course, setCourse] = useState<CourseFilter>("all");
    const [month, setMonth] = useState<MonthFilter>("all");
    const [openOnly, setOpenOnly] = useState(false);
    const [menu, setMenu] = useState<null | "course" | "month">(null);

    const clear = () => {
        setCategory("all");
        setCourse("all");
        setMonth("all");
        setOpenOnly(false);
    };

    const list = useMemo(
        () =>
            MCG_EVENTS.filter(
                (e) =>
                    (category === "all" || e.category === category) &&
                    (course === "all" || e.courseSlug === course) &&
                    (month === "all" || monthKey(e.isoDate) === month) &&
                    (!openOnly || !isFull(e)),
            ).sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
        [category, course, month, openOnly],
    );

    const featured = list.find((e) => e.featured);
    const rest = featured ? list.filter((e) => e.id !== featured.id) : list;
    const waitlisted = list.filter(isFull).length;

    return (
        <McgShell>
            <McgHero
                title="Events across Montgomery County"
                blurb="Leagues, the County Amateur, junior tour qualifiers, senior scrambles, couples nights and charity outings — run at all nine county courses, open to everyone."
                right={
                    <div className="flex flex-col gap-2 text-sm text-tertiary">
                        <span className="tabular-nums">
                            <span className="font-semibold text-primary">{MCG_EVENTS.length}</span> events this summer
                        </span>
                        <Button size="md" color="secondary" href="/calendar" iconLeading={Calendar}>
                            View the county calendar
                        </Button>
                    </div>
                }
            />

            <McgPage>
                {/* Filters */}
                <div className="flex flex-col gap-3">
                    <FilterChips options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
                    <div className="flex flex-wrap items-center gap-2.5">
                        <SelectMenu
                            label="Course"
                            value={course}
                            options={COURSE_OPTIONS}
                            open={menu === "course"}
                            onOpen={() => setMenu((m) => (m === "course" ? null : "course"))}
                            onChange={(id) => {
                                setCourse(id);
                                setMenu(null);
                            }}
                        />
                        <SelectMenu
                            label="When"
                            value={month}
                            options={MONTH_OPTIONS}
                            open={menu === "month"}
                            onOpen={() => setMenu((m) => (m === "month" ? null : "month"))}
                            onChange={(id) => {
                                setMonth(id);
                                setMenu(null);
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setOpenOnly((v) => !v)}
                            className={cxPill(openOnly)}
                        >
                            Spots available
                        </button>
                    </div>
                </div>

                <p className="mt-5 mb-6 text-sm text-tertiary">
                    <span className="font-semibold text-secondary tabular-nums">{list.length}</span> {list.length === 1 ? "event" : "events"}
                    {course !== "all" && <span> at {COURSE_NAME[course]}</span>}
                    {waitlisted > 0 && <span> · {waitlisted} with a waitlist</span>}
                </p>

                {list.length === 0 ? (
                    <NoResults noun="events" onClear={clear} />
                ) : (
                    <>
                        {featured && <Featured id={featured.id} />}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {rest.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </>
                )}

                {/* Courses footer — a county golfer often filters by "which one is near me" */}
                <section className="mt-14 border-t border-secondary pt-8">
                    <h2 className="text-lg font-semibold text-primary">Programming runs at every MCG course</h2>
                    <p className="mt-1 text-sm text-tertiary">Pick a course to see only what it hosts.</p>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                        {COURSE_SLUGS.map((slug) => (
                            <button key={slug} type="button" onClick={() => setCourse(slug)} className="transition duration-100 ease-linear hover:opacity-80">
                                <CourseChip slug={slug} size="md" />
                            </button>
                        ))}
                    </div>
                    <p className="mt-6 text-sm text-tertiary">
                        Looking for coaching rather than competition?{" "}
                        <Link href="/clinics" className="font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline">
                            Browse the county clinic program
                        </Link>
                        .
                    </p>
                </section>
            </McgPage>
        </McgShell>
    );
};

/** The toggle pill shares its shape with `FilterChips` but carries its own on/off state. */
const cxPill = (active: boolean) =>
    [
        "rounded-full px-4 py-2 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
        active ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
    ].join(" ");
