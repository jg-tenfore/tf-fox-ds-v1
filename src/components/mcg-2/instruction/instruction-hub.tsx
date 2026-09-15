"use client";

/**
 * `/instruction` (Prototype 2) — every way to get better, in one place.
 *
 * Replaces Prototype 1's separate Instruction and Clinics tabs. The page narrows step by
 * step, the way a golfer actually decides:
 *
 *  1. **Where** — the course strip. "All courses" by default; pick Falls Road and the
 *     whole page becomes "what Falls Road offers".
 *  2. **Browse by** — Services (what's offered) or Instructors (who teaches it).
 *  3. **Narrow** — private lessons or group clinics, and a skill set.
 *
 * From there the two paths Weston described split cleanly: a service goes to "choose an
 * instructor, or any" (private) or straight to its sessions (group); an instructor goes
 * to their profile, where everything they offer is already filled in.
 *
 * Filters live in the query string so a filtered view can be linked — `/clinics` lands
 * here with `format=group`.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationHat01, MarkerPin01, Ticket02, Users01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { FilterChips } from "@/components/instruction-2/instruction-ui";
import { academyInstructor, academyLogo, instructorPhoto } from "@/components/mcg-2/academy-roster";
import { MCG, McgHero, McgPage, McgShell } from "@/components/mcg-2/mcg-chrome";
import { cx } from "@/utils/cx";
import { ALL_COURSES, AcademyCourseStrip, instructorHref } from "../academy/academy-ui";
import {
    ALL_OFFERINGS,
    DEFAULT_FILTER,
    FORMAT_LABEL,
    INSTRUCTION_TYPE_LABEL,
    type InstructionType,
    type InstructorWithOfferings,
    type Offering,
    type OfferingFilter,
    type OfferingFormat,
    SKILL_LABEL,
    SKILL_ORDER,
    type SkillTag,
    courseLabel,
    filterOfferings,
    instructorsFor,
    typesAt,
} from "./offerings";

export type HubView = "services" | "instructors";

const money0 = (n: number) => (n === 0 ? "Free" : `$${Math.round(n)}`);

/* ------------------------------------------------------------------ */
/* Offering card                                                       */
/* ------------------------------------------------------------------ */

/** Up to four faces, then a count — who teaches this, at a glance. */
const InstructorStack = ({ offering }: { offering: Offering }) => {
    const shown = offering.instructors.slice(0, 4);
    const more = offering.instructors.length - shown.length;
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
                {offering.instructors.length === 1 ? `with ${offering.instructors[0].name}` : `${offering.instructors.length} instructors${more > 0 ? "" : ""}`}
            </span>
        </div>
    );
};

export const OfferingCard = ({ offering }: { offering: Offering }) => {
    const full = offering.spotsLeft === 0;
    return (
        <Link
            href={offering.href}
            className="group flex flex-col overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
            {offering.image ? (
                <div className="relative aspect-[16/9] w-full bg-secondary">
                    <img src={offering.image} alt="" className="size-full object-cover" loading="lazy" />
                </div>
            ) : (
                // A private lesson has no photography of its own — a slim Academy band, not a hero.
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

/** What an instructor teaches here, summed up: "3 private lessons · 1 group clinic". */
const offerSummary = (offerings: Offering[]) => {
    const privates = offerings.filter((o) => o.format === "private").length;
    const groups = offerings.length - privates;
    return [privates && `${privates} private ${privates === 1 ? "lesson" : "lessons"}`, groups && `${groups} group ${groups === 1 ? "clinic" : "clinics"}`].filter(Boolean).join(" · ");
};

const InstructorOfferCard = ({ entry, course }: { entry: InstructorWithOfferings; course: string }) => {
    const { instructor, offerings } = entry;
    const roster = instructor.id ? academyInstructor(instructor.id) : undefined;
    const groups = offerings.filter((o) => o.format === "group");

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
                    <p className="text-sm text-tertiary">
                        {`Private lessons${groups.length ? " and programs" : ""} at ${courseLabel(course === ALL_COURSES ? ALL_OFFERINGS : course)}, priced for ${instructor.name.split(" ")[0]}.`}
                    </p>
                ) : (
                    <ul className="flex flex-col gap-1.5">
                        {groups.map((o) => (
                            <li key={o.key}>
                                <Link href={o.href} className="flex items-center justify-between gap-3 text-sm font-medium text-secondary transition duration-100 ease-linear hover:text-brand-secondary">
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

const VIEW_OPTIONS: { id: HubView; label: string; icon: typeof GraduationHat01 }[] = [
    { id: "services", label: "Services", icon: GraduationHat01 },
    { id: "instructors", label: "Instructors", icon: Users01 },
];

const FORMAT_OPTIONS: { id: OfferingFormat | typeof ALL_OFFERINGS; label: string }[] = [
    { id: ALL_OFFERINGS, label: "All formats" },
    { id: "private", label: "Private lessons" },
    { id: "group", label: "Group clinics" },
];

const SKILL_OPTIONS: { id: SkillTag | typeof ALL_OFFERINGS; label: string }[] = [
    { id: ALL_OFFERINGS, label: "Any skill set" },
    ...SKILL_ORDER.map((s) => ({ id: s, label: SKILL_LABEL[s] })),
];

export interface InstructionHubProps {
    initialView?: HubView;
    initialFilter?: Partial<OfferingFilter>;
}

export const InstructionHubScreen = ({ initialView = "services", initialFilter }: InstructionHubProps = {}) => {
    const [view, setView] = useState<HubView>(initialView);
    const [filter, setFilter] = useState<OfferingFilter>({ ...DEFAULT_FILTER, ...initialFilter });
    const [synced, setSynced] = useState(false);

    // Read filters from the URL once on the client, then mirror changes back into it.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const next = { ...filter };
        const course = params.get("course");
        const format = params.get("format");
        const skill = params.get("skill");
        if (course) next.course = course;
        if (format === "private" || format === "group") next.format = format;
        if (skill && (SKILL_ORDER as string[]).includes(skill)) next.skill = skill as SkillTag;
        const v = params.get("view");
        if (v === "services" || v === "instructors") setView(v);
        setFilter(next);
        setSynced(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!synced) return;
        const params = new URLSearchParams();
        if (view !== "services") params.set("view", view);
        if (filter.course !== ALL_OFFERINGS) params.set("course", filter.course);
        if (filter.format !== ALL_OFFERINGS) params.set("format", filter.format);
        if (filter.skill !== ALL_OFFERINGS) params.set("skill", filter.skill);
        const qs = params.toString();
        window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    }, [view, filter, synced]);

    const set = (patch: Partial<OfferingFilter>) => setFilter((f) => ({ ...f, ...patch }));

    const offerings = useMemo(() => filterOfferings(filter), [filter]);
    const instructors = useMemo(() => {
        const list = instructorsFor(offerings);
        // Academy staff first (they have profiles to open), then county clinic staff.
        return [...list.filter((e) => e.instructor.id), ...list.filter((e) => !e.instructor.id)];
    }, [offerings]);
    const types = typesAt(filter.course);
    const privates = offerings.filter((o) => o.format === "private");
    const groups = offerings.filter((o) => o.format === "group");
    const where = courseLabel(filter.course);

    const clear = () => setFilter((f) => ({ ...DEFAULT_FILTER, course: f.course }));
    const filtered = filter.format !== ALL_OFFERINGS || filter.skill !== ALL_OFFERINGS;

    return (
        <McgShell>
            <McgHero
                eyebrow={false}
                title="Instruction"
                blurb="Private lessons, group clinics and programs across all nine county courses. Start with a course, then browse what's offered or who teaches it."
                leading={<img src={academyLogo} alt="MCG Golf Academy" className="h-28 w-auto object-contain sm:h-36" />}
                right={
                    <Button size="md" color="secondary" href="/instruction/packages" iconLeading={Ticket02}>
                        Lesson packages
                    </Button>
                }
            />

            <AcademyCourseStrip value={filter.course} onChange={(course) => set({ course })} />

            <McgPage>
                <div className="flex flex-col gap-6">
                    {/* ---- Browse by + filters ---- */}
                    <div className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-quaternary uppercase">
                                    <MarkerPin01 className="size-3.5" aria-hidden="true" />
                                    {filter.course === ALL_COURSES ? "Every course" : where}
                                </span>
                                <h2 className="text-lg font-semibold text-primary">
                                    {view === "services"
                                        ? `${offerings.length} ${offerings.length === 1 ? "way" : "ways"} to learn`
                                        : `${instructors.length} ${instructors.length === 1 ? "instructor" : "instructors"}`}
                                </h2>
                            </div>

                            <div role="tablist" aria-label="Browse by" className="flex rounded-xl bg-secondary p-1 ring-1 ring-secondary ring-inset">
                                {VIEW_OPTIONS.map((o) => {
                                    const active = view === o.id;
                                    return (
                                        <button
                                            key={o.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={active}
                                            onClick={() => setView(o.id)}
                                            className={cx(
                                                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition duration-100 ease-linear",
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

                        <div className="flex flex-col gap-3 border-t border-secondary pt-4">
                            {types.length > 1 && (
                                <FilterChips
                                    options={[{ id: ALL_OFFERINGS as InstructionType | typeof ALL_OFFERINGS, label: "All types" }, ...types.map((t) => ({ id: t, label: INSTRUCTION_TYPE_LABEL[t] }))]}
                                    value={filter.type}
                                    onChange={(type) => set({ type })}
                                />
                            )}
                            <FilterChips options={FORMAT_OPTIONS} value={filter.format} onChange={(format) => set({ format })} />
                            <FilterChips options={SKILL_OPTIONS} value={filter.skill} onChange={(skill) => set({ skill })} />
                        </div>
                    </div>

                    {/* ---- Results ---- */}
                    {offerings.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-secondary bg-primary px-6 py-14 text-center">
                            <GraduationHat01 className="size-6 text-fg-quaternary" aria-hidden="true" />
                            <p className="text-md font-semibold text-primary">Nothing matches at {where}</p>
                            <p className="max-w-md text-sm text-tertiary">
                                Try another skill set or format, or look across every course. The shop at {MCG.phone} can also point you to the nearest program.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2.5">
                                {filtered && (
                                    <Button size="md" color="secondary" onClick={clear}>
                                        Clear filters
                                    </Button>
                                )}
                                {filter.course !== ALL_COURSES && (
                                    <Button size="md" color="primary" onClick={() => set({ course: ALL_COURSES })}>
                                        Show all courses
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : view === "services" ? (
                        <div className="flex flex-col gap-10">
                            {[
                                { title: "Private lessons", sub: "One-to-one (or bring up to three friends). Choose an instructor, or take the first one free.", items: privates },
                                { title: "Group clinics & programs", sub: "Scheduled sessions with a roster — Academy programs and county clinics together.", items: groups },
                            ]
                                .filter((section) => section.items.length > 0)
                                .map((section) => (
                                    <section key={section.title} className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-lg font-semibold text-primary">
                                                {section.title} <span className="text-tertiary tabular-nums">· {section.items.length}</span>
                                            </h2>
                                            <p className="text-sm text-tertiary">{section.sub}</p>
                                        </div>
                                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                            {section.items.map((o) => (
                                                <OfferingCard key={o.key} offering={o} />
                                            ))}
                                        </div>
                                    </section>
                                ))}
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {instructors.map((entry) => (
                                <InstructorOfferCard key={entry.instructor.id ?? entry.instructor.name} entry={entry} course={filter.course} />
                            ))}
                        </div>
                    )}
                </div>
            </McgPage>
        </McgShell>
    );
};
