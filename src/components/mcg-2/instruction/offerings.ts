/**
 * Prototype 2 — one instruction catalog.
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
    coachById,
    servicePrice,
    spotsLeft as serviceSpotsLeft,
} from "@/components/instruction-2/instruction-catalog";
import { bookHref } from "@/components/mcg-2/academy/book-screen";
import { serviceHref } from "./service-href";
import { MCG_CLINICS, type McgClinic, spotsLeft as clinicSpotsLeft } from "@/components/mcg-2/events-catalog";

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

/** One participant (a private lesson) or many (a clinic or program). */
export type OfferingFormat = "private" | "group";

export const FORMAT_LABEL: Record<OfferingFormat, string> = {
    private: "Private lesson",
    group: "Group clinic",
};

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
        href: serviceHref(service.id, courseSlug),
    };
};

const programOffering = (service: LessonService): Offering => {
    const coachId = service.coachIds?.[0] ?? "";
    const coach = coachById(coachId);
    const left = serviceSpotsLeft(service);
    return {
        key: `academy-${service.id}`,
        type: "golf",
        format: "group",
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
        href: bookHref({ coachId, serviceId: service.id, courseSlug: service.courseSlug }),
    };
};

const countyOffering = (clinic: McgClinic): Offering => ({
    key: `county-${clinic.id}`,
    type: "golf",
    format: "group",
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
    href: `/clinics/${clinic.id}`,
});

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

export interface OfferingFilter {
    course: string;
    format: OfferingFormat | typeof ALL;
    skill: SkillTag | typeof ALL;
    type: InstructionType | typeof ALL;
}

export const DEFAULT_FILTER: OfferingFilter = { course: ALL, format: ALL, skill: ALL, type: ALL };

/**
 * Everything offered at a course (or everywhere), before format and skill filters.
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

export const filterOfferings = (filter: OfferingFilter): Offering[] =>
    offeringsAt(filter.course).filter(
        (o) => (filter.format === ALL || o.format === filter.format) && (filter.skill === ALL || o.skills.includes(filter.skill)) && (filter.type === ALL || o.type === filter.type),
    );

/** Instruction types present at a course — the type filter hides itself below two. */
export const typesAt = (courseSlug: string): InstructionType[] => [...new Set(offeringsAt(courseSlug).map((o) => o.type))];

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
