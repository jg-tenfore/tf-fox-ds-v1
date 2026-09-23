"use client";

/**
 * `/instruction` (Prototype 3) — one search step that gathers everything.
 *
 * Prototype 2 filtered by course, then format, then skill set, and asked for dates three
 * screens later. MCG's note was blunt about the cost of that: "if there is no
 * availability for all your other filters, you'd have to start over." So this page asks
 * for all of it up front — courses, formats, dates, days of the week, skill sets — and
 * every list is multi-select, because a family looking for a junior program at two
 * courses on Tuesdays or Thursdays is the normal case, not an edge one.
 *
 * What it keeps from Prototype 2: the result tiles below, prices and all. What moves:
 * the Services / Instructors switch, which sat on the right where it was easy to miss,
 * now sits above the search panel where the first decision belongs.
 *
 * Every choice lives in the query string, so a filtered search can be shared, and the
 * booking steps downstream read the same values instead of asking again.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, GraduationHat01, MarkerPin01, SearchLg, Ticket02, Users01, XClose } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { COURSE_LOGO } from "@/components/instruction-3/instruction-catalog";
import { ACADEMY_COURSE_LOGOS, academyInstructor, academyLogo, instructorPhoto } from "@/components/mcg-3/academy-roster";
import { MCG, McgHero, McgPage, McgShell } from "@/components/mcg-3/mcg-chrome";
import { cx } from "@/utils/cx";
import { instructorHref } from "../academy/academy-ui";
import { CreditsExplainer } from "./credits-explainer";
import {
    ALL_OFFERINGS,
    DEFAULT_FILTER,
    FORMAT_LABEL,
    FORMAT_ORDER,
    INSTRUCTION_TYPE_LABEL,
    type InstructorWithOfferings,
    type Offering,
    type OfferingFilter,
    type OfferingFormat,
    SKILL_LABEL,
    SKILL_ORDER,
    type SkillTag,
    filterOfferings,
    instructorsFor,
    isFiltered,
    typesAt,
} from "./offerings";

export type HubView = "services" | "instructors";

const money0 = (n: number) => (n === 0 ? "Free" : `$${Math.round(n)}`);

/** Prototype "today", matching the date every other MCG screen treats as now. */
const TODAY_ISO = "2026-06-19";

const DAYS = [
    { value: 0, label: "Sun" },
    { value: 1, label: "Mon" },
    { value: 2, label: "Tue" },
    { value: 3, label: "Wed" },
    { value: 4, label: "Thu" },
    { value: 5, label: "Fri" },
    { value: 6, label: "Sat" },
];

/* ------------------------------------------------------------------ */
/* Filter controls                                                     */
/* ------------------------------------------------------------------ */

const FilterRow = ({ label, children, action }: { label: string; children: React.ReactNode; action?: React.ReactNode }) => (
    <div className="flex flex-col gap-2 border-t border-secondary py-4 first:border-t-0 first:pt-0 sm:flex-row sm:gap-5">
        <div className="flex w-40 shrink-0 items-center justify-between gap-2 pt-1.5">
            <span className="text-sm font-semibold text-primary">{label}</span>
            {action}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">{children}</div>
    </div>
);

/** A multi-select chip. Selected chips carry a clear affordance, not just a fill. */
const Chip = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={cx(
            "flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-3.5 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
            selected ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover hover:ring-brand",
        )}
    >
        {children}
    </button>
);

/* ------------------------------------------------------------------ */
/* Offering card (unchanged from Prototype 2 — MCG likes these tiles)  */
/* ------------------------------------------------------------------ */

const InstructorStack = ({ offering }: { offering: Offering }) => {
    const shown = offering.instructors.slice(0, 4);
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
                {shown.map((i) => {
                    const roster = i.id ? academyInstructor(i.id) : undefined;
                    return roster ? (
                        <img key={i.id} src={instructorPhoto(roster)} alt="" className="size-7 rounded-full bg-secondary object-cover object-top ring-2 ring-bg-primary" />
                    ) : (
                        <span key={i.name} className="flex size-7 items-center justify-center rounded-full bg-brand-solid text-[10px] font-semibold text-white ring-2 ring-bg-primary">
                            {i.initials}
                        </span>
                    );
                })}
            </div>
            <span className="text-xs text-tertiary">
                {offering.instructors.length === 1 ? `with ${offering.instructors[0].name}` : `${offering.instructors.length} instructors`}
            </span>
        </div>
    );
};

export const OfferingCard = ({ offering, search }: { offering: Offering; search?: string }) => {
    const full = offering.spotsLeft === 0;
    // The search travels with the link, so the booking steps open on the dates and
    // course the golfer already chose instead of asking again.
    const href = search ? `${offering.href}${offering.href.includes("?") ? "&" : "?"}${search}` : offering.href;
    return (
        <Link
            href={href}
            className="group flex flex-col overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
            {offering.image ? (
                <div className="relative aspect-[16/9] w-full bg-secondary">
                    <img src={offering.image} alt="" className="size-full object-cover" loading="lazy" />
                </div>
            ) : (
                <div className="flex items-center gap-3 border-b border-secondary px-5 py-3">
                    <img src={academyLogo} alt="" className="h-9 w-auto" />
                    <span className="text-xs font-semibold tracking-wide text-tertiary uppercase">MCG Golf Academy</span>
                </div>
            )}

            <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center gap-1.5">
                    <Badge color={offering.format === "private" ? "brand" : "blue"} size="sm" type="pill-color">
                        {FORMAT_LABEL[offering.format]}
                    </Badge>
                    {offering.sample && (
                        <Badge color="gray" size="sm" type="pill-color">
                            Sample program
                        </Badge>
                    )}
                    {full && (
                        <Badge color="error" size="sm" type="pill-color">
                            Waitlist
                        </Badge>
                    )}
                    {offering.spotsLeft !== undefined && offering.spotsLeft > 0 && offering.spotsLeft <= 3 && (
                        <Badge color="warning" size="sm" type="pill-color">
                            {offering.spotsLeft} left
                        </Badge>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <h3 className="text-md font-semibold text-primary">{offering.name}</h3>
                    <p className="text-sm text-tertiary">{offering.meta}</p>
                </div>

                <p className="line-clamp-2 text-sm text-tertiary">{offering.blurb}</p>

                {offering.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {offering.skills.map((s) => (
                            <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary">
                                {SKILL_LABEL[s]}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-secondary pt-3">
                    <InstructorStack offering={offering} />
                    <div className="flex shrink-0 flex-col items-end">
                        <span className="text-md font-semibold text-primary tabular-nums">
                            {offering.format === "private" ? `From ${money0(offering.priceFrom)}` : money0(offering.priceFrom)}
                        </span>
                        <span className="text-xs text-tertiary">{offering.priceUnit}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

/* ------------------------------------------------------------------ */
/* Instructor card                                                     */
/* ------------------------------------------------------------------ */

const offerSummary = (offerings: Offering[]) => {
    const privates = offerings.filter((o) => o.format === "private").length;
    const groups = offerings.length - privates;
    return [privates && `${privates} private ${privates === 1 ? "lesson" : "lessons"}`, groups && `${groups} group ${groups === 1 ? "program" : "programs"}`]
        .filter(Boolean)
        .join(" · ");
};

const InstructorOfferCard = ({ entry }: { entry: InstructorWithOfferings }) => {
    const { instructor, offerings } = entry;
    const roster = instructor.id ? academyInstructor(instructor.id) : undefined;
    const groups = offerings.filter((o) => o.format !== "private");

    return (
        <article className="flex flex-col overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand">
            <div className="flex items-center gap-4 p-5">
                {roster ? (
                    <Link href={instructorHref(roster.id)} aria-label={`View ${instructor.name}'s profile`} className="shrink-0">
                        <img src={instructorPhoto(roster)} alt="" className="size-16 rounded-full bg-secondary object-cover object-top" loading="lazy" />
                    </Link>
                ) : (
                    <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-solid text-lg font-semibold text-white">{instructor.initials}</span>
                )}
                <div className="flex min-w-0 flex-col gap-0.5">
                    <h3 className="text-md font-semibold text-primary">{instructor.name}</h3>
                    {instructor.title && <p className="text-sm text-tertiary">{instructor.title}</p>}
                    <p className="text-xs font-medium text-brand-secondary">{offerSummary(offerings)}</p>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 border-t border-secondary px-5 py-4">
                {roster ? (
                    <p className="text-sm text-tertiary">Everything {instructor.name.split(" ")[0]} teaches that matches your search, priced for them.</p>
                ) : (
                    <ul className="flex flex-col gap-1.5">
                        {groups.map((o) => (
                            <li key={o.key}>
                                <Link
                                    href={o.href}
                                    className="flex items-center justify-between gap-3 text-sm font-medium text-secondary transition duration-100 ease-linear hover:text-brand-secondary"
                                >
                                    <span className="truncate">{o.name}</span>
                                    <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {roster && (
                <div className="px-5 pb-5">
                    <Button size="sm" color="primary" href={instructorHref(roster.id)} iconTrailing={ArrowRight} className="w-full">
                        See what {instructor.name.split(" ")[0]} offers
                    </Button>
                </div>
            )}
        </article>
    );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export interface InstructionHubProps {
    initialView?: HubView;
    initialFilter?: Partial<OfferingFilter>;
}

/** Read and write the search in the URL, so it can be shared and carried forward. */
const readFilter = (params: URLSearchParams): Partial<OfferingFilter> => {
    const list = (key: string) => (params.get(key) ?? "").split(",").filter(Boolean);
    const out: Partial<OfferingFilter> = {};
    const courses = list("courses");
    if (courses.length) out.courses = courses;
    const formats = list("formats").filter((f): f is OfferingFormat => (FORMAT_ORDER as string[]).includes(f));
    if (formats.length) out.formats = formats;
    const skills = list("skills").filter((s): s is SkillTag => (SKILL_ORDER as string[]).includes(s));
    if (skills.length) out.skills = skills;
    const days = list("days").map(Number).filter((d) => d >= 0 && d <= 6);
    if (days.length) out.days = days;
    const from = params.get("from");
    const to = params.get("to");
    if (from) out.from = from;
    if (to) out.to = to;
    return out;
};

export const searchQuery = (filter: OfferingFilter, view?: HubView) => {
    const params = new URLSearchParams();
    if (view && view !== "services") params.set("view", view);
    if (filter.courses.length) params.set("courses", filter.courses.join(","));
    if (filter.formats.length) params.set("formats", filter.formats.join(","));
    if (filter.skills.length) params.set("skills", filter.skills.join(","));
    if (filter.days.length) params.set("days", filter.days.join(","));
    if (filter.from) params.set("from", filter.from);
    if (filter.to) params.set("to", filter.to);
    return params.toString();
};

export const InstructionHubScreen = ({ initialView = "services", initialFilter }: InstructionHubProps = {}) => {
    const [view, setView] = useState<HubView>(initialView);
    const [filter, setFilter] = useState<OfferingFilter>({ ...DEFAULT_FILTER, ...initialFilter });
    const [synced, setSynced] = useState(false);
    const [explainer, setExplainer] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const v = params.get("view");
        if (v === "services" || v === "instructors") setView(v);
        setFilter((f) => ({ ...f, ...readFilter(params) }));
        setSynced(true);
    }, []);

    useEffect(() => {
        if (!synced) return;
        const qs = searchQuery(filter, view);
        window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    }, [view, filter, synced]);

    const set = (patch: Partial<OfferingFilter>) => setFilter((f) => ({ ...f, ...patch }));
    const toggle = <T,>(list: T[], value: T): T[] => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

    const offerings = useMemo(() => filterOfferings(filter), [filter]);
    const instructors = useMemo(() => {
        const list = instructorsFor(offerings);
        return [...list.filter((e) => e.instructor.id), ...list.filter((e) => !e.instructor.id)];
    }, [offerings]);
    const types = typesAt(filter.courses);

    const grouped = FORMAT_ORDER.map((format) => ({ format, items: offerings.filter((o) => o.format === format) })).filter((g) => g.items.length > 0);
    // Only the parts a booking screen can use: the dates and the chosen course.
    const bookingSearch = new URLSearchParams({
        ...(filter.from ? { from: filter.from } : {}),
        ...(filter.to ? { to: filter.to } : {}),
        ...(filter.courses.length === 1 ? { course: filter.courses[0] } : {}),
    }).toString();
    const where =
        filter.courses.length === 0 ? "all nine courses" : filter.courses.length === 1 ? (ACADEMY_COURSE_LOGOS.find((c) => c.slug === filter.courses[0])?.name ?? "") : `${filter.courses.length} courses`;

    return (
        <McgShell>
            <McgHero
                eyebrow={false}
                title="Instruction"
                blurb="Private lessons, clinics, camps and junior programs across all nine county courses. Tell us what you're after — courses, dates, days and skills — and we'll show only what fits."
                leading={<img src={academyLogo} alt="MCG Golf Academy" className="h-28 w-auto object-contain sm:h-36" />}
            />

            <McgPage>
                <div className="flex flex-col gap-6">
                    {/* ---- Buy-ahead packages: prominent, and bought before a booking ---- */}
                    <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-primary p-5 ring-1 ring-brand ring-inset">
                        <div className="flex items-start gap-3">
                            <Ticket02 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                            <div className="flex flex-col gap-0.5">
                                <p className="text-md font-semibold text-primary">Buy lesson credits ahead and save</p>
                                <p className="text-sm text-tertiary">
                                    Packs of 5 or 10 lessons with one instructor, bought up front. Credits land in your wallet and pay for a booking at checkout.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            <Button size="md" color="primary" href="/instruction/packages" iconTrailing={ArrowRight}>
                                Browse packages
                            </Button>
                            <Button size="md" color="secondary" href="/instruction/credits">
                                My credits
                            </Button>
                            <Button size="md" color="link-gray" onClick={() => setExplainer((v) => !v)}>
                                {explainer ? "Hide how it works" : "How credits work"}
                            </Button>
                        </div>
                        {explainer && (
                            <div className="w-full">
                                <CreditsExplainer />
                            </div>
                        )}
                    </section>

                    {/* ---- Browse by: the first decision, out where it can be seen ---- */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-primary">Browse by</span>
                        <div role="tablist" aria-label="Browse by" className="flex rounded-xl bg-secondary p-1 ring-1 ring-secondary ring-inset">
                            {[
                                { id: "services" as const, label: "Services", icon: GraduationHat01 },
                                { id: "instructors" as const, label: "Instructors", icon: Users01 },
                            ].map((o) => {
                                const active = view === o.id;
                                return (
                                    <button
                                        key={o.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setView(o.id)}
                                        className={cx(
                                            "flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition duration-100 ease-linear",
                                            active ? "bg-primary text-primary shadow-xs ring-1 ring-secondary" : "text-tertiary hover:text-secondary",
                                        )}
                                    >
                                        <o.icon className="size-4" aria-hidden="true" />
                                        {o.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ---- The search ---- */}
                    <section className="flex flex-col rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset sm:p-6">
                        <FilterRow label="Courses" action={filter.courses.length > 0 ? <ClearLink onClick={() => set({ courses: [] })} /> : undefined}>
                            <div className="flex flex-wrap gap-2">
                                {ACADEMY_COURSE_LOGOS.map((course) => (
                                    <Chip key={course.slug} selected={filter.courses.includes(course.slug)} onClick={() => set({ courses: toggle(filter.courses, course.slug) })}>
                                        <img src={COURSE_LOGO[course.slug]} alt="" className="size-5 rounded-full bg-primary object-contain" />
                                        {course.name.replace(/ Golf Course$/, "")}
                                    </Chip>
                                ))}
                            </div>
                            <p className="text-xs text-tertiary">{filter.courses.length === 0 ? "All nine courses" : "Pick as many as you like"}</p>
                        </FilterRow>

                        <FilterRow label="Format" action={filter.formats.length > 0 ? <ClearLink onClick={() => set({ formats: [] })} /> : undefined}>
                            <div className="flex flex-wrap gap-2">
                                {FORMAT_ORDER.map((format) => (
                                    <Chip key={format} selected={filter.formats.includes(format)} onClick={() => set({ formats: toggle(filter.formats, format) })}>
                                        {FORMAT_LABEL[format]}
                                    </Chip>
                                ))}
                            </div>
                        </FilterRow>

                        <FilterRow label="Dates" action={filter.from || filter.to ? <ClearLink onClick={() => set({ from: undefined, to: undefined })} /> : undefined}>
                            <div className="flex flex-wrap items-end gap-3">
                                <Input label="From" type="date" value={filter.from ?? ""} onChange={(v) => set({ from: v || undefined })} className="w-44" />
                                <Input label="To" type="date" value={filter.to ?? ""} onChange={(v) => set({ to: v || undefined })} className="w-44" />
                                <div className="flex flex-wrap gap-2 pb-1.5">
                                    {[
                                        { label: "Next 2 weeks", days: 14 },
                                        { label: "Next month", days: 30 },
                                        { label: "This summer", days: 90 },
                                    ].map((preset) => {
                                        const from = TODAY_ISO;
                                        const end = new Date(2026, 5, 19);
                                        end.setDate(end.getDate() + preset.days);
                                        const to = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;
                                        return (
                                            <Chip key={preset.label} selected={filter.from === from && filter.to === to} onClick={() => set({ from, to })}>
                                                {preset.label}
                                            </Chip>
                                        );
                                    })}
                                </div>
                            </div>
                            <p className="text-xs text-tertiary">Programs that finish before your dates drop out. Private lessons are bookable any day.</p>
                        </FilterRow>

                        <FilterRow label="Days of the week" action={filter.days.length > 0 ? <ClearLink onClick={() => set({ days: [] })} /> : undefined}>
                            <div className="flex flex-wrap gap-2">
                                {DAYS.map((d) => (
                                    <Chip key={d.value} selected={filter.days.includes(d.value)} onClick={() => set({ days: toggle(filter.days, d.value) })}>
                                        {d.label}
                                    </Chip>
                                ))}
                            </div>
                        </FilterRow>

                        <FilterRow label="Skill set" action={filter.skills.length > 0 ? <ClearLink onClick={() => set({ skills: [] })} /> : undefined}>
                            <div className="flex flex-wrap gap-2">
                                {SKILL_ORDER.map((s) => (
                                    <Chip key={s} selected={filter.skills.includes(s)} onClick={() => set({ skills: toggle(filter.skills, s) })}>
                                        {SKILL_LABEL[s]}
                                    </Chip>
                                ))}
                            </div>
                        </FilterRow>

                        {types.length > 1 && (
                            <FilterRow label="Type">
                                <div className="flex flex-wrap gap-2">
                                    {types.map((t) => (
                                        <Chip key={t} selected={filter.type === t} onClick={() => set({ type: filter.type === t ? ALL_OFFERINGS : t })}>
                                            {INSTRUCTION_TYPE_LABEL[t]}
                                        </Chip>
                                    ))}
                                </div>
                            </FilterRow>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary pt-4">
                            <span className="flex items-center gap-2 text-sm text-tertiary">
                                <MarkerPin01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                {where}
                                {filter.from || filter.to ? (
                                    <>
                                        <Calendar className="ml-2 size-4 text-fg-quaternary" aria-hidden="true" />
                                        {filter.from ?? "any"} → {filter.to ?? "any"}
                                    </>
                                ) : null}
                            </span>
                            {isFiltered(filter) && (
                                <Button size="sm" color="link-gray" iconLeading={XClose} onClick={() => setFilter({ ...DEFAULT_FILTER })}>
                                    Clear search
                                </Button>
                            )}
                        </div>
                    </section>

                    {/* ---- Results ---- */}
                    <div className="flex items-baseline justify-between gap-3">
                        <h2 className="text-lg font-semibold text-primary">
                            {view === "services"
                                ? `${offerings.length} ${offerings.length === 1 ? "result" : "results"}`
                                : `${instructors.length} ${instructors.length === 1 ? "instructor" : "instructors"}`}
                        </h2>
                        <span className="text-sm text-tertiary">{where}</span>
                    </div>

                    {offerings.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-secondary bg-primary px-6 py-14 text-center">
                            <SearchLg className="size-6 text-fg-quaternary" aria-hidden="true" />
                            <p className="text-md font-semibold text-primary">Nothing matches that search</p>
                            <p className="max-w-md text-sm text-tertiary">
                                Widen the dates or days, or drop a format. The shop at {MCG.phone} can also point you to the nearest program.
                            </p>
                            <Button size="md" color="secondary" onClick={() => setFilter({ ...DEFAULT_FILTER })}>
                                Clear search
                            </Button>
                        </div>
                    ) : view === "services" ? (
                        <div className="flex flex-col gap-10">
                            {grouped.map((group) => (
                                <section key={group.format} className="flex flex-col gap-4">
                                    <h3 className="text-lg font-semibold text-primary">
                                        {FORMAT_LABEL[group.format]} <span className="text-tertiary tabular-nums">· {group.items.length}</span>
                                    </h3>
                                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {group.items.map((o) => (
                                            <OfferingCard key={o.key} offering={o} search={bookingSearch} />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {instructors.map((entry) => (
                                <InstructorOfferCard key={entry.instructor.id ?? entry.instructor.name} entry={entry} />
                            ))}
                        </div>
                    )}
                </div>
            </McgPage>
        </McgShell>
    );
};

const ClearLink = ({ onClick }: { onClick: () => void }) => (
    <button type="button" onClick={onClick} className="text-xs font-semibold text-tertiary underline transition duration-100 ease-linear hover:text-secondary">
        Clear
    </button>
);
