/**
 * Prototype 3 — one instruction catalog, searched in one step.
 *
 * Prototype 1 splits teaching across two tabs: Instruction (the Academy's private
 * lessons and programs) and Clinics (the county's group clinics). In the check-in with
 * Weston the argument was that a golfer doesn't think in those terms — "I just want to
 * get better, what does Falls Road offer?" — and that the data model agrees: a private
 * lesson is a clinic with one participant and an instructor tied to it.
 *
 * So everything here is an `Offering`: a type (golf today, pickleball one day), a format
 * (private or group), who teaches it, where, the skill set it suits, and a price. The
 * three sources keep their own detail pages and booking logic — this module only puts
 * them on one shelf so the Instruction page can filter them together.
 */

import {
    BOOKABLE_COACHES,
    COURSE_NAME,
    GROUP_SERVICES,
    PRIVATE_SERVICES,
    type LessonService,
    anyInstructorDay,
    applyGuardrails,
    coachById,
    serviceById,
    servicePrice,
    spotsLeft as serviceSpotsLeft,
} from "@/components/instruction-3/instruction-catalog";
import { bookHref } from "@/components/mcg-3/academy/book-screen";
import { serviceHref } from "./service-href";
import { ACADEMY_START, MCG_CLINICS, type McgClinic, spotsLeft as clinicSpotsLeft } from "@/components/mcg-3/events-catalog";

/* ------------------------------------------------------------------ */
/* Vocabulary                                                          */
/* ------------------------------------------------------------------ */

/**
 * The instruction type — Fox's "clinic type". Golf is the only one MCG runs, but it is
 * a real field rather than an assumption, so a pickleball lesson is one more entry and
 * not a second system. The type filter only renders when a course offers more than one.
 */
export type InstructionType = "golf";

export const INSTRUCTION_TYPE_LABEL: Record<InstructionType, string> = {
    golf: "Golf lessons",
};

/**
 * What kind of thing it is. Prototype 2 had two (private / group); MCG asked for the
 * real list, because "Junior League" and "Op 36" are how golfers and staff talk about
 * them — and more will be added as the Academy adds programs.
 */
export type OfferingFormat = "private" | "clinic" | "junior-camp" | "junior-league" | "op36";

export const FORMAT_LABEL: Record<OfferingFormat, string> = {
    private: "Private lessons",
    clinic: "Group clinics",
    "junior-camp": "Junior camps",
    "junior-league": "Junior league",
    op36: "Op 36",
};

export const FORMAT_ORDER: OfferingFormat[] = ["private", "clinic", "junior-camp", "junior-league", "op36"];

/** Group formats run to a schedule; a private is booked against an instructor's day. */
export const isGroupFormat = (format: OfferingFormat) => format !== "private";

export type SkillTag = "beginner" | "kids" | "advanced" | "short-game" | "putting" | "on-course";

export const SKILL_LABEL: Record<SkillTag, string> = {
    beginner: "Beginner-friendly",
    kids: "Kid-friendly",
    advanced: "Advanced",
    "short-game": "Short game & chipping",
    putting: "Putting",
    "on-course": "On-course",
};

export const SKILL_ORDER: SkillTag[] = ["beginner", "kids", "advanced", "short-game", "putting", "on-course"];

/* ------------------------------------------------------------------ */
/* Shape                                                               */
/* ------------------------------------------------------------------ */

export interface OfferingInstructor {
    /** Academy roster id. County clinic staff aren't on the roster and have none. */
    id?: string;
    name: string;
    initials: string;
    title?: string;
}

export interface Offering {
    /** Unique across sources, e.g. `academy-private-45`, `county-ggr-northwest`. */
    key: string;
    type: InstructionType;
    format: OfferingFormat;
    source: "academy" | "county";
    name: string;
    blurb: string;
    /** Short facts line: duration and party size, or the schedule. */
    meta: string;
    image?: string;
    courseSlugs: string[];
    instructors: OfferingInstructor[];
    skills: SkillTag[];
    /** The lowest price a golfer could pay at the chosen course. */
    priceFrom: number;
    /** What `priceFrom` buys, e.g. "1 golfer", "for the series", "per session". */
    priceUnit: string;
    /** Seats left, for group offerings with a roster. */
    spotsLeft?: number;
    /**
     * Days of the week it runs (0 = Sunday). A private lesson is bookable whenever its
     * instructor is, so it carries every day and matches any day filter.
     */
    days: number[];
    /** First and last session, ISO. Absent on a private, which has no fixed run. */
    startIso?: string;
    endIso?: string;
    /** Added for Prototype 3 to show a format MCG doesn't run yet. */
    sample?: boolean;
    /** The lesson behind a private offering, for checking real availability. */
    serviceId?: string;
    /** Where choosing this offering goes. */
    href: string;
}

/* ------------------------------------------------------------------ */
/* Skill sets                                                          */
/* ------------------------------------------------------------------ */

/**
 * Which skill sets each Academy service suits. Set by hand: the service descriptions
 * are specific enough that deriving tags from them would be guesswork.
 */
const ACADEMY_SKILLS: Record<string, SkillTag[]> = {
    "private-45": ["beginner", "advanced"],
    "private-60": ["advanced", "short-game"],
    "playing-9": ["on-course", "advanced"],
    "private-30": ["short-game", "putting"],
    "junior-30": ["kids", "beginner"],
    "senior-45": ["beginner"],
    "clinic-adult-l2": ["on-course"],
    "clinic-scoring": ["short-game"],
    "clinic-launch-lab": ["advanced"],
    "clinic-get-golf-ready": ["beginner", "on-course"],
    "clinic-junior-first": ["kids", "beginner"],
    "camp-junior-summer": ["kids"],
    "clinic-wedge": ["short-game", "advanced"],
};

/** Academy programs that aren't plain clinics. */
const ACADEMY_FORMAT: Record<string, OfferingFormat> = {
    "camp-junior-summer": "junior-camp",
};

/** County clinics carry a level and an audience, which map onto skill sets directly. */
const countySkills = (clinic: McgClinic): SkillTag[] => {
    const tags = new Set<SkillTag>();
    if (clinic.level === "New to golf" || clinic.level === "Beginner") tags.add("beginner");
    if (clinic.level === "Advanced") tags.add("advanced");
    if (clinic.audience === "Juniors" || clinic.audience === "All ages") tags.add("kids");
    if (/short-game/.test(clinic.id)) tags.add("short-game");
    if (/play-nine|women-on-course|league-ready|tour-prep/.test(clinic.id)) tags.add("on-course");
    return SKILL_ORDER.filter((t) => tags.has(t));
};

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */

const initialsOf = (name: string) =>
    name
        .replace(/,.*$/, "")
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

const ALL = "all";

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

/** Prototype "today" — the fixed date the rest of the MCG screens treat as now. */
const TODAY_ISO = "2026-06-19";

const isoOfDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dateOfIso = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
};

/**
 * Which weekdays a scheduled program meets, and when it starts and ends.
 *
 * The schedule is prose ("Thursdays 6:00 PM, from Jun 25", "Mon–Thu, Aug 10–13"), so a
 * daily run is read off the dash form and everything else is weekly from its start date.
 */
const runOf = (isoDate: string, schedule: string, sessions: number): { days: number[]; startIso: string; endIso: string } => {
    const start = dateOfIso(isoDate);
    const daily = /mon\s*[–-]\s*(thu|fri)/i.test(schedule);
    const end = new Date(start);
    end.setDate(start.getDate() + (sessions - 1) * (daily ? 1 : 7));
    const days = daily ? Array.from({ length: sessions }, (_, i) => (start.getDay() + i) % 7) : [start.getDay()];
    return { days: [...new Set(days)].sort(), startIso: isoDate, endIso: isoOfDate(end) };
};

export { serviceHref };

const privateOffering = (service: LessonService, courseSlug: string): Offering | null => {
    const coaches = BOOKABLE_COACHES.filter((c) => courseSlug === ALL || c.courseSlugs.includes(courseSlug));
    if (coaches.length === 0) return null;
    return {
        key: `academy-${service.id}`,
        type: "golf",
        format: "private",
        source: "academy",
        name: service.name,
        blurb: service.desc,
        meta: service.meta,
        courseSlugs: [...new Set(coaches.flatMap((c) => c.courseSlugs))],
        instructors: coaches.map((c) => ({ id: c.id, name: c.name, initials: c.initials, title: c.title })),
        skills: ACADEMY_SKILLS[service.id] ?? [],
        priceFrom: Math.min(...coaches.map((c) => servicePrice(service, c, 1))),
        priceUnit: "1 golfer",
        days: EVERY_DAY,
        serviceId: service.id,
        href: serviceHref(service.id, courseSlug),
    };
};

const programOffering = (service: LessonService): Offering => {
    const coachId = service.coachIds?.[0] ?? "";
    const coach = coachById(coachId);
    const left = serviceSpotsLeft(service);
    const start = ACADEMY_START[service.id];
    const run = start ? runOf(start.isoDate, service.schedule ?? "", service.sessions ?? 1) : undefined;
    return {
        key: `academy-${service.id}`,
        type: "golf",
        format: ACADEMY_FORMAT[service.id] ?? "clinic",
        source: "academy",
        name: service.name,
        blurb: service.desc,
        meta: service.meta,
        image: service.image,
        courseSlugs: service.courseSlug ? [service.courseSlug] : [],
        instructors: coach ? [{ id: coach.id, name: coach.name, initials: coach.initials, title: coach.title }] : [],
        skills: ACADEMY_SKILLS[service.id] ?? [],
        priceFrom: service.basePrice,
        priceUnit: service.sessions && service.sessions > 1 ? "for the program" : "per player",
        spotsLeft: left ?? undefined,
        days: run?.days ?? EVERY_DAY,
        startIso: run?.startIso,
        endIso: run?.endIso,
        href: bookHref({ coachId, serviceId: service.id, courseSlug: service.courseSlug }),
    };
};

const countyOffering = (clinic: McgClinic): Offering => {
    const run = runOf(clinic.isoDate, clinic.schedule, clinic.sessions);
    return {
    key: `county-${clinic.id}`,
    type: "golf",
    format: clinic.programFormat ?? "clinic",
    source: "county",
    name: clinic.title,
    blurb: clinic.description,
    meta: `${clinic.schedule} · ${clinic.time}`,
    image: clinic.image,
    courseSlugs: [clinic.courseSlug],
    instructors: [{ name: clinic.instructor.name, initials: clinic.instructor.initials || initialsOf(clinic.instructor.name), title: clinic.instructor.title }],
    skills: countySkills(clinic),
    priceFrom: clinic.perSession?.price ?? clinic.price,
    priceUnit: clinic.priceUnit,
    spotsLeft: clinic.perSession ? undefined : clinicSpotsLeft(clinic),
    days: run.days,
    startIso: run.startIso,
    endIso: run.endIso,
    sample: clinic.sample,
    href: `/clinics/${clinic.id}`,
    };
};

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

/**
 * What the golfer asked for on the search step. Every list is multi-select and empty
 * means "no preference" — MCG's feedback was that the first step should gather as much
 * as possible, so nobody filters their way to an empty calendar three screens later.
 */
export interface OfferingFilter {
    /** Course slugs. Empty = every course. */
    courses: string[];
    formats: OfferingFormat[];
    skills: SkillTag[];
    /** Weekdays, 0 = Sunday. Empty = any day. */
    days: number[];
    /** ISO dates. A program must overlap the range; a private always can. */
    from?: string;
    to?: string;
    type: InstructionType | typeof ALL;
}

export const DEFAULT_FILTER: OfferingFilter = { courses: [], formats: [], skills: [], days: [], type: ALL };

/** True when the golfer has narrowed anything at all. */
export const isFiltered = (f: OfferingFilter) =>
    f.courses.length > 0 || f.formats.length > 0 || f.skills.length > 0 || f.days.length > 0 || Boolean(f.from) || Boolean(f.to);

/**
 * Everything offered at a course (or everywhere), before the rest of the filters.
 * Private lessons are priced and staffed for that course: at a course with no Academy
 * instructor they drop out, rather than listing a lesson nobody there can teach.
 */
export const offeringsAt = (courseSlug: string): Offering[] => {
    const privates = PRIVATE_SERVICES.map((s) => privateOffering(s, courseSlug)).filter((o): o is Offering => o !== null);
    const atCourse = (o: Offering) => courseSlug === ALL || o.courseSlugs.includes(courseSlug);
    const programs = GROUP_SERVICES.map(programOffering).filter(atCourse);
    const county = MCG_CLINICS.map(countyOffering).filter(atCourse);
    return [...privates, ...programs, ...county];
};

/** Offerings across a set of courses, deduped — the multi-select course filter. */
export const offeringsForCourses = (courses: string[]): Offering[] => {
    if (courses.length === 0) return offeringsAt(ALL);
    const seen = new Map<string, Offering>();
    for (const slug of courses) for (const o of offeringsAt(slug)) if (!seen.has(o.key)) seen.set(o.key, o);
    return [...seen.values()];
};

/**
 * Does this private lesson actually have an opening that fits?
 *
 * A private has no schedule of its own, so without this it would match every date and
 * every day — and the golfer would find that out three screens later, on an empty
 * calendar. That is the exact complaint the one-step search was built to fix, so the
 * search checks the instructors' real days before it shows the lesson.
 *
 * Deterministic and cheap: the availability model is a hash, and the scan stops at the
 * first opening (or after eight weeks).
 */
const privateHasOpening = (offering: Offering, courses: string[], days: number[], from?: string, to?: string): boolean => {
    const service = offering.serviceId ? serviceById(offering.serviceId) : undefined;
    if (!service) return true;
    const where = courses.length ? courses : offering.courseSlugs;
    const start = from ? dateOfIso(from) : dateOfIso(TODAY_ISO);
    const end = to ? dateOfIso(to) : new Date(start.getFullYear(), start.getMonth(), start.getDate() + 56);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (days.length && !days.includes(d.getDay())) continue;
        for (const slug of where) {
            const open = applyGuardrails(anyInstructorDay(slug, new Date(d)), service, new Date(d)).some((slot) => slot.status === "open");
            if (open) return true;
        }
    }
    return false;
};

/** A scheduled program must still be running inside the range the golfer asked for. */
const inDateRange = (o: Offering, from?: string, to?: string) => {
    if (!from && !to) return true;
    // A private lesson has no fixed run — its instructor's calendar covers any range.
    if (!o.startIso || !o.endIso) return true;
    if (from && o.endIso < from) return false;
    if (to && o.startIso > to) return false;
    return true;
};

export const filterOfferings = (filter: OfferingFilter): Offering[] =>
    offeringsForCourses(filter.courses).filter(
        (o) =>
            (filter.formats.length === 0 || filter.formats.includes(o.format)) &&
            (filter.skills.length === 0 || filter.skills.some((s) => o.skills.includes(s))) &&
            (filter.days.length === 0 || o.days.some((d) => filter.days.includes(d))) &&
            inDateRange(o, filter.from, filter.to) &&
            (o.format !== "private" ||
                (filter.days.length === 0 && !filter.from && !filter.to) ||
                privateHasOpening(o, filter.courses, filter.days, filter.from, filter.to)) &&
            (filter.type === ALL || o.type === filter.type),
    );

/** Instruction types on offer — the type filter hides itself below two. */
export const typesAt = (courses: string[]): InstructionType[] => [...new Set(offeringsForCourses(courses).map((o) => o.type))];

export interface InstructorWithOfferings {
    instructor: OfferingInstructor;
    offerings: Offering[];
}

/**
 * The instructors behind a set of offerings, each with what they teach from that set.
 * Academy staff are keyed by roster id; county staff, who have none, by name.
 */
export const instructorsFor = (offerings: Offering[]): InstructorWithOfferings[] => {
    const map = new Map<string, InstructorWithOfferings>();
    for (const offering of offerings) {
        for (const instructor of offering.instructors) {
            const key = instructor.id ?? `name:${instructor.name}`;
            const entry = map.get(key) ?? { instructor, offerings: [] };
            entry.offerings.push(offering);
            map.set(key, entry);
        }
    }
    return [...map.values()];
};

export const courseLabel = (slug: string) => (slug === ALL ? "all nine courses" : (COURSE_NAME[slug] ?? slug));

export { ALL as ALL_OFFERINGS };
