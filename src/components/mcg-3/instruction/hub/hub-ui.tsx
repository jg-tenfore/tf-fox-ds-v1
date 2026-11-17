"use client";

/**
 * The hub's own pieces: filter chips, the toolbar course select, result cards (private lesson,
 * group program, instructor) and the offering art helper. Ported from the Crane MCG prototype's
 * `hub/hub-ui.tsx` and restyled with Fox tokens / Untitled UI components (light mode only).
 *
 * Shared bits every Instruction screen uses (`focusRing`, `cardBase`, `LinkButton`, avatars…)
 * live in `../kit`; these stay here because only the hub and the service pages use them.
 */
import type { FC, ReactNode } from "react";
import { ArrowRight, Calendar, ChevronDown, Clock, MarkerPin01, Star01 } from "@untitledui/icons";
import { ToggleButton as AriaToggleButton } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";
import {
    academyDisplayName,
    academyLessonPhoto,
    coachById,
    courseShortName,
    FORMAT_LABEL,
    fromPrice,
    instructorReviews,
    money0,
    nextOpening,
    offeringById,
    programArt,
    proHref,
    SKILL_LABEL,
    type InstructorWithOfferings,
    type McgCourseInfo,
    type Offering,
    type OfferingFormat,
    type OfferingInstructor,
} from "../data";
import { cardBase, cardLink, CoachAvatar, CourseLogo, focusRing } from "../kit";
import { InstructionLink } from "../nav";

/* ------------------------------------------------------------------ */
/* Offering art                                                        */
/* ------------------------------------------------------------------ */

/** Art for each format tile (program art; the private tile uses a real MCG lesson photo). */
export const FORMAT_ART: Record<OfferingFormat, string> = {
    private: academyLessonPhoto,
    clinic: programArt("clinic-adult-l2").image,
    "junior-camp": programArt("camp-junior-summer").image,
    "junior-league": programArt("junior-league-northwest").image,
    op36: programArt("op36-little-bennett").image,
};

/**
 * Which photo a category tile, program card or program banner shows: the program's own art,
 * else its format's tile art. (Crane also offers per-org default photo sets behind `?photos=`;
 * Prototype 3 has MCG's own photos only, so that switch is left out.)
 */
export const offeringArt = (format: OfferingFormat, own?: string | null) => own || FORMAT_ART[format];
/** Same, for a program known only by id. */
export const offeringArtFor = (programId: string, own?: string | null) => offeringArt(offeringById(programId)?.format ?? "clinic", own);

/* ------------------------------------------------------------------ */
/* Chips                                                               */
/* ------------------------------------------------------------------ */

/** Multi-select filter chip. Selected = solid brand; never colour alone (aria-pressed). */
export const FilterToggle = ({ isSelected, onChange, children, leading }: { isSelected: boolean; onChange: (v: boolean) => void; children: ReactNode; leading?: ReactNode }) => (
    <AriaToggleButton
        isSelected={isSelected}
        onChange={onChange}
        className={cx(
            "flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full text-sm font-semibold whitespace-nowrap ring-1 ring-inset transition duration-100 ease-linear",
            leading ? "pr-3.5 pl-1.5" : "px-3.5",
            isSelected ? "bg-brand-solid text-white ring-transparent hover:bg-brand-solid_hover" : "bg-primary text-secondary ring-primary hover:bg-primary_hover",
            focusRing,
        )}
    >
        {leading}
        {children}
    </AriaToggleButton>
);

/** A course chip with its logo. */
export const CourseToggle = ({ course, isSelected, onChange }: { course: McgCourseInfo; isSelected: boolean; onChange: (v: boolean) => void }) => (
    <FilterToggle isSelected={isSelected} onChange={onChange} leading={<CourseLogo slug={course.id} size={24} />}>
        {course.shortName}
    </FilterToggle>
);

/* ------------------------------------------------------------------ */
/* Course select (toolbar)                                             */
/* ------------------------------------------------------------------ */

export const CourseSelect = ({
    courses,
    value,
    anyLabel,
    multiLabel,
    onChange,
    className,
    label = "Course",
}: {
    courses: McgCourseInfo[];
    /** A course id, "all", or "multi" (several picked in the filter panel). */
    value: string;
    anyLabel: string;
    multiLabel?: string;
    onChange: (id: string) => void;
    className?: string;
    label?: string;
}) => (
    <label className={cx("relative flex", className)}>
        <span className="sr-only">{label}</span>
        <MarkerPin01 className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-fg-quaternary" aria-hidden="true" />
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-full cursor-pointer appearance-none truncate rounded-lg bg-primary pr-9 pl-10 text-md text-primary shadow-xs ring-1 ring-primary transition duration-100 ease-linear ring-inset outline-none focus:ring-2 focus:ring-brand"
        >
            <option value="all">{anyLabel}</option>
            {value === "multi" && (
                <option value="multi" disabled>
                    {multiLabel}
                </option>
            )}
            {courses.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.name}
                </option>
            ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fg-quaternary" aria-hidden="true" />
    </label>
);

/* ------------------------------------------------------------------ */
/* Avatars                                                             */
/* ------------------------------------------------------------------ */

/** Headshot (top-cropped) or initials on the brand tint — Crane's sizes on the kit's avatar. */
export const InstructorAvatar = ({ photo, initials, size = "sm", className }: { photo?: string | null; initials: string; size?: "xs" | "sm" | "md" | "lg"; className?: string }) => (
    <CoachAvatar photo={photo} initials={initials} size={size === "md" ? "md" : size === "lg" ? "lg" : size} className={className} />
);

/** Up to four overlapping headshots + "22 instructors" / "with Mike Kenny". */
export const InstructorStack = ({ instructors }: { instructors: OfferingInstructor[] }) => (
    <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex shrink-0 -space-x-2">
            {instructors.slice(0, 4).map((i) => (
                <InstructorAvatar key={i.id ?? i.name} photo={i.photo} initials={i.initials} size="xs" className="ring-2 ring-bg-primary" />
            ))}
        </div>
        <span className="truncate text-xs text-tertiary">{instructors.length === 1 ? `with ${instructors[0].name}` : `${instructors.length} instructors`}</span>
    </div>
);

/* ------------------------------------------------------------------ */
/* Badges                                                              */
/* ------------------------------------------------------------------ */

export const OfferingBadges = ({ offering, className }: { offering: Offering; className?: string }) => {
    const full = offering.spotsLeft === 0;
    return (
        <div className={cx("flex flex-wrap items-center gap-1.5", className)}>
            <Badge type="color" size="sm" color={offering.format === "private" ? "brand" : "gray"}>
                {FORMAT_LABEL[offering.format]}
            </Badge>
            {offering.sample && (
                <Badge type="color" size="sm" color="gray">
                    Sample program
                </Badge>
            )}
            {full && (
                <Badge type="color" size="sm" color="error">
                    Waitlist
                </Badge>
            )}
            {offering.spotsLeft !== undefined && offering.spotsLeft > 0 && offering.spotsLeft <= 3 && (
                <Badge type="color" size="sm" color="warning">
                    {offering.spotsLeft} {offering.spotsLeft === 1 ? "spot" : "spots"} left
                </Badge>
            )}
        </div>
    );
};

export const SkillPill = ({ children }: { children: ReactNode }) => (
    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary ring-1 ring-secondary ring-inset">{children}</span>
);

export const SkillPills = ({ offering, max = 3 }: { offering: Offering; max?: number }) =>
    offering.skills.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
            {offering.skills.slice(0, max).map((s) => (
                <SkillPill key={s}>{SKILL_LABEL[s]}</SkillPill>
            ))}
        </div>
    ) : null;

const Fact = ({ icon: Icon, children }: { icon: FC<{ className?: string }>; children: ReactNode }) => (
    <span className="flex min-w-0 items-center gap-1.5">
        <Icon className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <span className="truncate">{children}</span>
    </span>
);

const PriceBlock = ({ offering }: { offering: Offering }) => (
    <div className="flex shrink-0 flex-col items-end">
        <span className="text-md font-semibold text-primary tabular-nums">{offering.format === "private" ? `From ${money0(offering.priceFrom)}` : money0(offering.priceFrom)}</span>
        <span className="text-xs text-quaternary">{offering.priceUnit}</span>
    </div>
);

/* ------------------------------------------------------------------ */
/* Result cards                                                        */
/* ------------------------------------------------------------------ */

/**
 * A private lesson: no photo (every private would share one) — format, duration · golfers, two
 * lines of copy, skill sets, who teaches it and the lowest price.
 */
export const PrivateLessonCard = ({ offering, href }: { offering: Offering; href: string }) => (
    <InstructionLink href={href} className={cardLink} aria-label={`${offering.name} — choose an instructor`}>
        <div className="flex flex-1 flex-col gap-2.5 p-5 lg:p-4.5">
            <OfferingBadges offering={offering} />
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-primary group-hover:underline">{offering.name}</h3>
                <p className="flex items-center gap-1.5 text-sm text-tertiary">
                    <Clock className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    {offering.meta}
                </p>
            </div>
            <p className="line-clamp-2 text-sm text-tertiary">{offering.blurb}</p>
            <SkillPills offering={offering} />
            <div className="mt-auto flex items-end justify-between gap-3 border-t border-secondary pt-3">
                <InstructorStack instructors={offering.instructors} />
                <PriceBlock offering={offering} />
            </div>
        </div>
    </InstructionLink>
);

/** A group program (Academy program or county clinic): photo, badges, schedule, course, instructor, price. */
export const ProgramCard = ({ offering, href }: { offering: Offering; href: string }) => (
    <InstructionLink href={href} className={cardLink}>
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
            <img src={offeringArt(offering.format, offering.image)} alt="" loading="lazy" className="size-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]" />
        </div>
        <div className="flex flex-1 flex-col gap-2.5 p-5">
            <OfferingBadges offering={offering} />
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-primary group-hover:underline">{offering.name}</h3>
                <div className="flex flex-col gap-1 text-sm text-tertiary">
                    <Fact icon={Calendar}>{offering.meta}</Fact>
                    <Fact icon={MarkerPin01}>{offering.courseSlugs.map(courseShortName).join(", ")}</Fact>
                </div>
            </div>
            <p className="line-clamp-2 text-sm text-tertiary">{offering.blurb}</p>
            <SkillPills offering={offering} />
            <div className="mt-auto flex items-end justify-between gap-3 border-t border-secondary pt-3">
                <InstructorStack instructors={offering.instructors} />
                <PriceBlock offering={offering} />
            </div>
        </div>
    </InstructionLink>
);

/* ------------------------------------------------------------------ */
/* Instructor cards                                                    */
/* ------------------------------------------------------------------ */

const ReviewLine = ({ id }: { id: string }) => {
    const r = instructorReviews(id);
    if (r.status === "off") return null;
    if (r.status === "collecting") return <span className="text-xs text-quaternary">New · collecting reviews</span>;
    return (
        <span className="flex items-center gap-1 text-xs text-tertiary">
            <Star01 className="size-3.5 fill-current text-fg-warning-secondary" aria-hidden="true" />
            <span className="font-semibold text-primary tabular-nums">{r.average.toFixed(1)}</span>
            <span className="tabular-nums">({r.count})</span>
        </span>
    );
};

const offerSummary = (offerings: Offering[]) => {
    const privates = offerings.filter((o) => o.format === "private").length;
    const groups = offerings.length - privates;
    return [privates && `${privates} private ${privates === 1 ? "lesson" : "lessons"}`, groups && `${groups} group ${groups === 1 ? "program" : "programs"}`].filter(Boolean).join(" · ");
};

/**
 * An Academy instructor: headshot, "Name, Credential", title, home courses, what they teach that
 * matches the search, lessons from $, next opening today and the (sample) rating. Links to the profile.
 */
export const InstructorCard = ({ entry }: { entry: InstructorWithOfferings }) => {
    const { instructor, offerings } = entry;
    const coach = instructor.id ? coachById(instructor.id) : undefined;
    if (!coach) return <CountyStaffCard entry={entry} />;
    const opening = nextOpening(coach.id);
    return (
        <InstructionLink href={proHref(coach.id)} className={cardLink} aria-label={`${academyDisplayName(coach)} — profile`}>
            <div className="flex items-start gap-4 p-5">
                <InstructorAvatar photo={coach.photo} initials={coach.initials} size="lg" />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <h3 className="truncate text-lg font-semibold text-primary group-hover:underline">{academyDisplayName(coach)}</h3>
                    <p className="truncate text-sm text-tertiary">{coach.title}</p>
                    <ReviewLine id={coach.id} />
                </div>
            </div>
            <div className="flex flex-wrap gap-1.5 px-5">
                {coach.courseSlugs.map((slug) => (
                    <span key={slug} className="inline-flex h-6 items-center gap-1 rounded-md bg-secondary px-2 text-xs font-semibold text-secondary ring-1 ring-secondary ring-inset">
                        <MarkerPin01 className="size-3 text-fg-quaternary" aria-hidden="true" />
                        {courseShortName(slug)}
                    </span>
                ))}
            </div>
            <div className="mt-4 flex flex-1 flex-col gap-1 border-t border-secondary px-5 py-3 text-sm">
                <span className="text-xs font-semibold text-brand-secondary">{offerSummary(offerings)}</span>
                <span className="flex items-center gap-1.5 text-tertiary">
                    <Clock className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    {opening === "No openings today" ? "No openings today" : `Next: today ${opening}`}
                </span>
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-secondary px-5 py-3">
                <span className="flex flex-col">
                    <span className="text-xs text-quaternary">Lessons from</span>
                    <span className="text-md font-semibold text-primary tabular-nums">{money0(fromPrice(coach.id))}</span>
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-brand-secondary">
                    View profile <ArrowRight className="size-4" aria-hidden="true" />
                </span>
            </div>
        </InstructionLink>
    );
};

/** County clinic staff aren't on the Academy roster (no profile): their programs as links instead. */
const CountyStaffCard = ({ entry }: { entry: InstructorWithOfferings }) => {
    const { instructor, offerings } = entry;
    return (
        <article className={cx("flex flex-col overflow-hidden", cardBase)}>
            <div className="flex items-start gap-4 p-5">
                <InstructorAvatar initials={instructor.initials} size="lg" />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <h3 className="truncate text-lg font-semibold text-primary">{instructor.name}</h3>
                    {instructor.title && <p className="line-clamp-2 text-sm text-tertiary">{instructor.title}</p>}
                    <span className="text-xs text-quaternary">County clinic staff</span>
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-1 border-t border-secondary px-5 py-3">
                <span className="text-xs font-semibold text-brand-secondary">{offerSummary(offerings)}</span>
                <ul className="flex flex-col">
                    {offerings.slice(0, 5).map((o) => (
                        <li key={o.key}>
                            <InstructionLink
                                href={o.detailHref}
                                className={cx("flex items-center justify-between gap-3 rounded-md py-1.5 text-sm font-medium text-secondary transition duration-100 ease-linear hover:text-brand-secondary", focusRing)}
                            >
                                <span className="truncate">{o.name}</span>
                                <ArrowRight className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            </InstructionLink>
                        </li>
                    ))}
                </ul>
            </div>
        </article>
    );
};
