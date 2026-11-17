"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, FilterLines, Heart, SearchLg, SearchMd, Ticket02 } from "@untitledui/icons";
import { Button as AriaButton } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { McgShell } from "@/components/mcg-3/mcg-chrome";
import { cx } from "@/utils/cx";
import {
    academyLogo,
    activeFilterCount,
    coursesLabel,
    filterOfferings,
    FORMAT_LABEL,
    FORMAT_ORDER,
    instructionHref,
    instructorsFor,
    isFiltered,
    MCG_COURSE_INFO,
    MCG_ORG,
    money0,
    packagesHref,
    queryToFilter,
    SAMPLE_REVIEW_NOTICE,
    serviceHref,
    type HubView,
    type InstructionQuery,
    type Offering,
    type OfferingFormat,
} from "../data";
import { useInstructionStore } from "../instruction-store";
import { cardBase, focusRing, LinkButton, useIsNarrow } from "../kit";
import { InstructionLink, useInstructionQuery } from "../nav";
import { BottomSheet } from "./detail-ui";
import { ActiveFilterChips, clearedFilters, coursesSummary, FilterFields, isGroupOnly, querySummary } from "./hub-filters";
import { CourseSelect, FilterToggle, FORMAT_ART, InstructorCard, offeringArt, PrivateLessonCard, ProgramCard } from "./hub-ui";

const FORMAT_BLURB: Record<OfferingFormat, string> = {
    private: "One-to-one with an Academy pro",
    clinic: "Multi-week groups, all levels",
    "junior-camp": "Week-long camps for kids",
    "junior-league": "Team play for juniors",
    op36: "The Operation 36 pathway",
};

/** How many cards a section shows on the unfiltered landing before "See all". */
const LANDING_LIMIT = 6;

/** The hub query a result link carries forward (so the service page's Back returns to the same search). */
const carried = (q: InstructionQuery): Partial<InstructionQuery> => ({ courses: q.courses, formats: q.formats, skills: q.skills, days: q.days, from: q.from, to: q.to, q: q.q });

/**
 * Where a result goes: always its detail page first (decided Nov 17 — Prototype 3 sent Academy
 * programs straight to booking). Privates choose an instructor there; programs and county clinics
 * show sessions and Register. The search travels with the link so Back returns to it.
 */
const resultHref = (o: Offering, q: InstructionQuery) =>
    serviceHref(o.id, o.format !== "private" && o.source === "academy" && q.courses.length !== 1 ? o.courseSlugs[0] : undefined, carried(q));

const ResultGrid = ({ items, query }: { items: Offering[]; query: InstructionQuery }) => (
    <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {items.map((o) => (o.format === "private" ? <PrivateLessonCard key={o.key} offering={o} href={resultHref(o, query)} /> : <ProgramCard key={o.key} offering={o} href={resultHref(o, query)} />))}
    </div>
);

/** One photo tile per format: label, count and "from $". Pressing it filters to that format. */
const FormatTiles = ({ offerings, hrefFor }: { offerings: Offering[]; hrefFor: (f: OfferingFormat) => string }) => {
    const tiles = FORMAT_ORDER.map((format) => {
        const items = offerings.filter((o) => o.format === format);
        const paid = items.map((o) => o.priceFrom).filter((n) => n > 0);
        return { format, count: items.length, from: paid.length ? Math.min(...paid) : 0 };
    }).filter((t) => t.count > 0);
    if (tiles.length < 2) return null;
    return (
        <nav aria-label="Browse by format" className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {tiles.map((t) => (
                <InstructionLink
                    key={t.format}
                    href={hrefFor(t.format)}
                    className={cx("group flex flex-col overflow-hidden transition duration-100 ease-linear hover:ring-brand", cardBase, focusRing)}
                >
                    <div className="relative aspect-[16/9] overflow-hidden bg-secondary lg:aspect-[5/2]">
                        <img
                            src={offeringArt(t.format, FORMAT_ART[t.format])}
                            alt=""
                            loading="lazy"
                            className={cx("size-full object-cover transition duration-300 ease-out group-hover:scale-[1.04]", t.format === "private" && "object-[50%_30%]")}
                        />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5 px-3.5 py-3">
                        <span className="flex items-center justify-between gap-2">
                            <span className="text-md font-semibold text-primary group-hover:underline">{FORMAT_LABEL[t.format]}</span>
                            <ArrowRight
                                className="hidden size-4 shrink-0 text-fg-quaternary transition duration-100 ease-linear group-hover:translate-x-0.5 group-hover:text-fg-brand-primary md:block"
                                aria-hidden="true"
                            />
                        </span>
                        <span className="hidden truncate text-xs text-tertiary md:block">{FORMAT_BLURB[t.format]}</span>
                        <span className="mt-0.5 text-sm text-tertiary tabular-nums">
                            {t.count} {t.count === 1 ? "option" : "options"} · from <span className="font-semibold text-primary">{money0(t.from)}</span>
                        </span>
                    </div>
                </InstructionLink>
            ))}
        </nav>
    );
};

/** Free-text search, written to `?q=` (replace). Local state so typing isn't trimmed mid-word. */
const SearchField = ({ value, onCommit }: { value?: string; onCommit: (v: string | undefined) => void }) => {
    const [text, setText] = useState(value ?? "");
    useEffect(() => {
        if ((value ?? "") !== text.trim()) setText(value ?? "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    return (
        <label className="relative flex min-w-0 flex-1">
            <span className="sr-only">Search lessons, programs and instructors</span>
            <SearchMd className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-fg-quaternary" aria-hidden="true" />
            <input
                type="search"
                value={text}
                placeholder="Search lessons, programs, instructors"
                onChange={(e) => {
                    setText(e.target.value);
                    onCommit(e.target.value.trim() || undefined);
                }}
                className="h-10 w-full rounded-lg bg-primary pr-3 pl-10 text-md text-primary shadow-xs ring-1 ring-primary transition duration-100 ease-linear ring-inset outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand"
            />
        </label>
    );
};

/** Services | Instructors — real links, so each tab is a deep link and keeps the search. */
const HubTabs = ({ view, hrefFor }: { view: HubView; hrefFor: (v: HubView) => string }) => (
    <nav aria-label="Browse by" className="flex gap-6 border-b border-secondary">
        {(
            [
                { id: "services", label: "Services" },
                { id: "instructors", label: "Instructors" },
            ] as const
        ).map((t) => (
            <InstructionLink
                key={t.id}
                href={hrefFor(t.id)}
                aria-current={view === t.id ? "page" : undefined}
                className={cx(
                    "-mb-px border-b-2 px-0.5 pb-2 text-md font-semibold transition duration-100 ease-linear",
                    view === t.id ? "border-fg-brand-primary_alt text-brand-secondary" : "border-transparent text-quaternary hover:border-secondary hover:text-secondary",
                    focusRing,
                )}
            >
                {t.label}
            </InstructionLink>
        ))}
    </nav>
);

export interface InstructionHubPageProps {
    /** `/instruction/instructors` implies the Instructors tab regardless of `?view=`. */
    view?: HubView;
}

/**
 * `/instruction` — the MCG Golf Academy hub (made lighter after the Nov 17 call; ported back from
 * the Crane MCG prototype).
 *
 * Lands calm: a compact header, Services | Instructors, one bar (search · course · **Filters**),
 * photo tiles per format and short result sections — no lesson-credit banner, no filter wall. The
 * full Prototype 3 filter set (courses, format, dates, days, skill set) opens behind Filters
 * (`?expanded=1`): an inline panel on desktop, a bottom sheet on mobile. Every change is written to
 * the URL (replace), so any state is a deep link; a link that arrives filtered lands collapsed with
 * a one-line summary + removable chips.
 *
 * Crane also keeps the hub's course in step with its header course switcher; Prototype 3's nav has
 * no course switcher, so that sync is left out.
 */
export const InstructionHubPage = ({ view: forcedView }: InstructionHubPageProps = {}) => {
    const { query, setQuery } = useInstructionQuery();
    const rootRef = useRef<HTMLDivElement>(null);
    const narrow = useIsNarrow(rootRef);
    const courses = MCG_COURSE_INFO;

    const view: HubView = forcedView ?? query.view;
    const patch = (p: Partial<InstructionQuery>) => setQuery(p, { replace: true });
    const clearAll = () => patch(clearedFilters(query));

    const offerings = useMemo(() => filterOfferings(queryToFilter(query)), [query]);
    const groupOnly = isGroupOnly(query);
    const tileOfferings = useMemo(() => (query.formats.length === 0 || groupOnly ? offerings : []), [offerings, query.formats.length, groupOnly]);
    const { savedInstructors } = useInstructionStore();
    // `?saved=1` on the Instructors tab: only the pros the golfer saved (the heart on a profile).
    const savedOnly = query.extra.saved === "1";
    const instructors = useMemo(() => {
        const all = instructorsFor(offerings);
        return savedOnly ? all.filter((e) => !!e.instructor.id && savedInstructors.includes(e.instructor.id)) : all;
    }, [offerings, savedOnly, savedInstructors]);
    const withoutSaved = () => Object.fromEntries(Object.entries(query.extra).filter(([k]) => k !== "saved"));
    const setSavedOnly = (on: boolean) => patch({ extra: on ? { ...withoutSaved(), saved: "1" } : withoutSaved() });
    const filtered = isFiltered(query);
    const count = activeFilterCount(query);
    // MCG's "Clinics" link: group formats and nothing else — the title says so, no summary box needed.
    const onlyGroup = groupOnly && count === 1 && !query.q;
    const landingLimit = narrow ? 3 : LANDING_LIMIT;

    const grouped = FORMAT_ORDER.map((format) => ({ format, items: offerings.filter((o) => o.format === format) })).filter((g) => g.items.length > 0);
    const resultsLabel =
        view === "services" ? `${offerings.length} ${offerings.length === 1 ? "result" : "results"}` : `${instructors.length} ${instructors.length === 1 ? "instructor" : "instructors"}`;
    const summary = querySummary(query);

    // Tabs keep the search; the Instructors path implies the tab, so Services goes back to /instruction.
    const tabHref = (v: HubView) => instructionHref({ ...query, view: v, expanded: false });
    const title = groupOnly && view === "services" ? "Clinics & programs" : "Instruction";
    const subtitle =
        groupOnly && view === "services"
            ? "Group clinics, junior camps, junior league and Op 36 across all nine county courses."
            : view === "instructors"
              ? "Every MCG Academy pro, with where they teach, what they charge and when they're next free."
              : "Private lessons, clinics, camps and junior programs with MCG Academy pros at all nine county courses.";

    const courseValue = query.courses.length === 0 ? "all" : query.courses.length === 1 ? query.courses[0] : "multi";
    const panelOpen = query.expanded;

    return (
        <McgShell>
            <div ref={rootRef} className="mx-auto w-full max-w-7xl px-4 pt-5 pb-12 sm:px-8 lg:pb-16">
                {/* ---------- Header (compact) ---------- */}
                <div className="flex items-center gap-4">
                    <span className="hidden h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-secondary ring-inset md:inline-flex">
                        {/* The lockup PNG carries generous whitespace; scale it up inside the tile so it reads at this size. */}
                        <img src={academyLogo} alt="MCG Golf Academy" className="h-[118%] w-auto max-w-none object-contain" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-xs font-semibold tracking-wide text-brand-secondary uppercase">MCG Golf Academy</span>
                        <h1 className="text-display-xs font-semibold text-primary">{title}</h1>
                        <p className="text-sm text-tertiary md:text-md">{subtitle}</p>
                    </div>
                    <LinkButton href={packagesHref()} size="sm" iconLeading={Ticket02} className="hidden shrink-0 md:inline-flex">
                        Lesson packages
                    </LinkButton>
                </div>
                <LinkButton href={packagesHref()} size="sm" iconLeading={Ticket02} className="mt-3 md:hidden">
                    Lesson packages
                </LinkButton>

                {/* ---------- Tabs ---------- */}
                <div className="mt-4">
                    <HubTabs view={view} hrefFor={tabHref} />
                </div>

                {/* ---------- Search bar: search · course · Filters ---------- */}
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
                    <SearchField value={query.q} onCommit={(q) => patch({ q })} />
                    <div className="flex gap-3">
                        <CourseSelect
                            className="min-w-0 flex-1 md:w-64 md:flex-none"
                            courses={courses}
                            value={courseValue}
                            anyLabel={MCG_ORG.anyCourseLabel}
                            multiLabel={coursesSummary(query.courses)}
                            onChange={(id) => patch({ courses: id === "all" ? [] : [id] })}
                        />
                        <AriaButton
                            aria-expanded={panelOpen}
                            onPress={() => patch({ expanded: !panelOpen })}
                            className={cx(
                                "inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-xs ring-1 ring-inset transition duration-100 ease-linear",
                                panelOpen ? "bg-brand-primary_alt text-brand-secondary ring-brand" : "bg-primary text-secondary ring-primary hover:bg-primary_hover",
                                focusRing,
                            )}
                        >
                            <FilterLines className="size-5" aria-hidden="true" />
                            Filters
                            {count > 0 && (
                                <span
                                    className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-solid px-1.5 text-xs font-semibold text-white tabular-nums"
                                    aria-label={`${count} active`}
                                >
                                    {count}
                                </span>
                            )}
                        </AriaButton>
                    </div>
                </div>

                {/* ---------- Filters: inline panel (desktop) ---------- */}
                {panelOpen && !narrow && (
                    <section aria-label="Filters" className={cx("mt-4 p-5 lg:p-6", cardBase)}>
                        <FilterFields query={query} courses={courses} onPatch={patch} />
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary pt-4">
                            <span className="text-sm text-tertiary">
                                <span className="font-semibold text-primary tabular-nums">{resultsLabel}</span> · {coursesLabel(query.courses)}
                            </span>
                            <div className="flex items-center gap-2">
                                {filtered && (
                                    <Button size="sm" color="tertiary" onClick={clearAll}>
                                        Clear all
                                    </Button>
                                )}
                                <Button size="sm" color="primary" onClick={() => patch({ expanded: false })}>
                                    Done
                                </Button>
                            </div>
                        </div>
                    </section>
                )}

                {/* ---------- Filters: bottom sheet (mobile) ---------- */}
                {narrow && (
                    <BottomSheet
                        isOpen={panelOpen}
                        onOpenChange={(open) => patch({ expanded: open })}
                        title="Filters"
                        description={`${resultsLabel} · ${coursesLabel(query.courses)}`}
                        footerStart={
                            filtered ? (
                                <Button size="md" color="tertiary" onClick={clearAll}>
                                    Clear all
                                </Button>
                            ) : undefined
                        }
                        footer={
                            <Button size="md" color="primary" onClick={() => patch({ expanded: false })}>
                                Show {resultsLabel}
                            </Button>
                        }
                    >
                        <FilterFields query={query} courses={courses} onPatch={patch} />
                    </BottomSheet>
                )}

                {/* ---------- Deep-link summary + removable chips (collapsed) ---------- */}
                {filtered && !onlyGroup && (!panelOpen || narrow) && (
                    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-primary px-4 py-3 ring-1 ring-secondary ring-inset md:px-5">
                        <p className="text-sm text-secondary">
                            <span className="font-semibold text-primary">{summary.join(" · ")}</span>
                            <span className="text-tertiary"> — {resultsLabel}</span>
                            <span className="text-quaternary"> · </span>
                            <button
                                type="button"
                                onClick={() => patch({ expanded: true })}
                                className={cx("cursor-pointer rounded-sm font-semibold text-brand-secondary hover:underline", focusRing)}
                            >
                                Edit filters
                            </button>
                        </p>
                        <ActiveFilterChips query={query} onPatch={patch} onClear={clearAll} />
                    </div>
                )}

                {onlyGroup && (!panelOpen || narrow) && view === "services" && (
                    <p className="mt-4 text-sm text-tertiary">
                        Showing group programs only.{" "}
                        <InstructionLink href={instructionHref({ ...query, formats: [] })} className={cx("rounded-sm font-semibold text-brand-secondary hover:underline", focusRing)}>
                            Include private lessons
                        </InstructionLink>
                    </p>
                )}

                {/* ---------- Results ---------- */}
                <div className="mt-5 flex flex-col gap-7">
                    {view === "services" && tileOfferings.length > 0 && (
                        <FormatTiles offerings={tileOfferings} hrefFor={(f) => instructionHref({ ...query, formats: [f], expanded: false })} />
                    )}

                    {offerings.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-primary bg-primary px-6 py-14 text-center">
                            <SearchLg className="size-6 text-fg-quaternary" aria-hidden="true" />
                            <p className="text-lg font-semibold text-primary">Nothing matches that search</p>
                            <p className="max-w-md text-sm text-tertiary">
                                Widen the dates or days, try another course, or drop a format. The Academy desk at {MCG_ORG.phone} can point you to the nearest program.
                            </p>
                            <div className="mt-2 flex flex-wrap justify-center gap-2.5">
                                <Button size="md" color="primary" onClick={clearAll}>
                                    Clear filters
                                </Button>
                                <Button size="md" color="secondary" onClick={() => patch({ expanded: true })}>
                                    Edit filters
                                </Button>
                            </div>
                        </div>
                    ) : view === "services" ? (
                        grouped.map((g) => {
                            const limited = !filtered && g.items.length > landingLimit;
                            const items = limited ? g.items.slice(0, landingLimit) : g.items;
                            return (
                                <section key={g.format} className="flex flex-col gap-3" aria-labelledby={`hub-${g.format}`}>
                                    <div className="flex items-end justify-between gap-3">
                                        <h2 id={`hub-${g.format}`} className="text-xl font-semibold text-primary">
                                            {FORMAT_LABEL[g.format]} <span className="text-quaternary tabular-nums">· {g.items.length}</span>
                                        </h2>
                                        {limited && (
                                            <InstructionLink
                                                href={instructionHref({ ...query, formats: [g.format] })}
                                                className={cx("flex shrink-0 items-center gap-1 rounded-md text-sm font-semibold text-brand-secondary hover:underline", focusRing)}
                                            >
                                                See all {g.items.length} <ArrowRight className="size-4" aria-hidden="true" />
                                            </InstructionLink>
                                        )}
                                    </div>
                                    <ResultGrid items={items} query={query} />
                                </section>
                            );
                        })
                    ) : (
                        <section className="flex flex-col gap-4" aria-label="Instructors">
                            <div className="flex items-end justify-between gap-3">
                                <h2 className="text-xl font-semibold text-primary">
                                    {resultsLabel} <span className="text-md font-normal text-tertiary">· {coursesLabel(query.courses)}</span>
                                </h2>
                                <FilterToggle isSelected={savedOnly} onChange={setSavedOnly} leading={<Heart className={cx("ml-1.5 size-4", savedOnly && "fill-current")} aria-hidden="true" />}>
                                    Saved <span className="tabular-nums">{savedInstructors.length}</span>
                                </FilterToggle>
                            </div>
                            {savedOnly && instructors.length === 0 && (
                                <div className={cx(cardBase, "flex flex-col items-start gap-2 p-6")}>
                                    <p className="text-md font-semibold text-primary">No saved instructors{query.courses.length ? " here" : ""} yet</p>
                                    <p className="text-sm text-tertiary">Tap Save on an instructor&rsquo;s profile and they&rsquo;ll show up here, on any device you&rsquo;re signed in on.</p>
                                    <LinkButton href={instructionHref({ ...query, extra: withoutSaved() })}>Show all instructors</LinkButton>
                                </div>
                            )}
                            <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
                                {instructors.map((e) => (
                                    <InstructorCard key={e.instructor.id ?? e.instructor.name} entry={e} />
                                ))}
                            </div>
                            <p className="text-xs text-quaternary">Ratings: {SAMPLE_REVIEW_NOTICE}</p>
                        </section>
                    )}
                </div>
            </div>
        </McgShell>
    );
};
