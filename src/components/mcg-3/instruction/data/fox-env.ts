/**
 * What the Crane port of this data layer took from Crane's app, supplied by Fox instead:
 * the sample "today", the sample golfer and the nine MCG courses.
 *
 * - **Today is Fri Oct 9, 2026**, Crane's sample today, so Instruction's dates match the Crane
 *   MCG prototype one for one (deep links with `date=2026-10-09` work in both). The rest of
 *   Prototype 3 (tee times, grill) keeps its own June sample day.
 * - **The golfer is invented** (the repo is public): never a real name or address.
 * - **Courses** reuse Fox's MCG course list (`mcgCourses`: name, logo, town) plus the long
 *   names and 555 pro-shop numbers Crane prints.
 */
import { mcgCourses } from "@/components/foundations/mcg/mcg-assets";

/** Instruction's sample today (Fri Oct 9, 2026), as in the Crane MCG prototype. */
export const TODAY = new Date(2026, 9, 9);

/** The sample signed-in golfer. Invented — keep it that way. */
export const USER = {
    firstName: "Morgan",
    lastName: "Hale",
    email: "morgan.hale@example.com",
    phone: "(240) 555-0117",
};

export interface McgCourseInfo {
    id: string;
    name: string;
    shortName: string;
    city: string;
    state: string;
    phone: string;
    logo?: string;
}

const LONG: Record<string, { name: string; shortName: string; phone: string }> = {
    "falls-road": { name: "Falls Road Golf Course", shortName: "Falls Road", phone: "(301) 555-0119" },
    "hampshire-greens": { name: "Hampshire Greens Golf Course", shortName: "Hampshire Greens", phone: "(301) 555-0161" },
    laytonsville: { name: "Laytonsville Golf Course", shortName: "Laytonsville", phone: "(301) 555-0182" },
    "little-bennett": { name: "Little Bennett Golf Course", shortName: "Little Bennett", phone: "(301) 555-0173" },
    northwest: { name: "Northwest Golf Course", shortName: "Northwest", phone: "(301) 555-0147" },
    needwood: { name: "Needwood Golf Course", shortName: "Needwood", phone: "(301) 555-0156" },
    crossvines: { name: "Golf at The Crossvines", shortName: "The Crossvines", phone: "(301) 555-0138" },
    rattlewood: { name: "Rattlewood Golf Course", shortName: "Rattlewood", phone: "(301) 555-0127" },
    "sligo-creek": { name: "Sligo Creek Golf Course", shortName: "Sligo Creek", phone: "(301) 555-0194" },
};

/** The nine MCG courses, in the Academy's order. */
export const MCG_COURSE_INFO: McgCourseInfo[] = Object.entries(LONG).map(([id, l]) => {
    const fox = mcgCourses.find((c) => c.slug === id);
    const [city = "", state = "MD"] = (fox?.location ?? "").split(", ");
    return { id, ...l, city, state, logo: fox?.logo };
});

const UNKNOWN = (id: string): McgCourseInfo => ({ id: "", name: id, shortName: id, city: "", state: "", phone: "" });

/** A course by id. Unknown ids come back with an empty `id` (callers compare `c.id === slug`). */
export const courseById = (id: string): McgCourseInfo => MCG_COURSE_INFO.find((c) => c.id === id) ?? UNKNOWN(id);

/** The Academy / Montgomery County Golf front desk — sample contact only. */
export const MCG_ORG = {
    name: "Montgomery County Golf",
    phone: "(301) 555-0100",
    email: "info@mcg.example.com",
    anyCourseLabel: "Any MCG course",
};
