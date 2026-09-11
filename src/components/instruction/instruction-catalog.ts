/**
 * MCG Instruction catalog — the fixture data behind the Instruction category.
 *
 * Restructured against the Sagamore booking prototype (`references/091026`), which
 * settled three things the MCG academy call left open:
 *
 *  1. **Privates and group clinics are the same object.** One service catalog holds
 *     30/45/60-minute privates, playing lessons, multi-week clinics and junior camps,
 *     separated by `kind` and filtered by tag — not two parallel systems. This is the
 *     "build lessons into the existing clinics structure" route.
 *  2. **Price is a base service rate plus a per-instructor adjustment** (`priceAdj`),
 *     not a private catalog per instructor. A club publishes one lesson menu and marks
 *     its producers up; MCG's rate bands fall out of the adjustment rather than
 *     requiring nine duplicate menus.
 *  3. **Course is a dimension of a service, not a copy of it.** A coach teaching at
 *     three courses has one menu and three calendars.
 *
 * A menu item still carries its own guardrails ("I only do these 30-minute lessons on
 * Saturdays"), which narrow the calendar rather than the calendar narrowing them.
 */

import { mcgCourses } from "@/components/foundations/mcg/mcg-assets";
import { ACADEMY_ROSTER, type AcademyInstructor } from "@/components/mcg/academy-roster";
import { asset } from "@/utils/asset";

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

/** MCG's brand green, taken from the group logo. Drives every brand-derived accent. */
export const MCG_GREEN = "#1E8E4E";

/** Course slug → display name, for labels that only carry the slug. */
export const COURSE_NAME: Record<string, string> = Object.fromEntries(mcgCourses.map((c) => [c.slug, c.name]));

/** Course slug → brand logo URL. */
export const COURSE_LOGO: Record<string, string> = Object.fromEntries(mcgCourses.map((c) => [c.slug, c.logo]));

/** Course slug → town. */
export const COURSE_LOCATION: Record<string, string> = Object.fromEntries(mcgCourses.map((c) => [c.slug, c.location]));

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Audience = "adult" | "junior" | "senior";

export const AUDIENCE_LABEL: Record<Audience, string> = {
    adult: "Adult",
    junior: "Junior",
    senior: "Senior",
};

/** Badge color per audience, so the three read apart at a glance. */
export const AUDIENCE_COLOR: Record<Audience, "brand" | "blue" | "orange"> = {
    adult: "brand",
    junior: "blue",
    senior: "orange",
};

export type FocusArea = "Full swing" | "Short game" | "Putting" | "Playing" | "Junior development";

/** A one-to-one lesson, or a seat in a scheduled group program. */
export type ServiceKind = "private" | "group";

/**
 * Restrictions attached to a service when the Academy builds it. These narrow which
 * slots on an instructor's calendar can be booked *for this lesson type*.
 */
export interface Guardrails {
    /** 0 = Sunday … 6 = Saturday. Omit for any day. */
    daysOfWeek?: number[];
    /** Minutes since midnight. Omit for the instructor's full working day. */
    timeWindow?: { start: number; end: number };
    /** Display-only seasonal note, e.g. "April – October". */
    season?: string;
}

export interface LessonService {
    id: string;
    name: string;
    kind: ServiceKind;
    audience: Audience;
    /** Short line under the name on a catalog card, e.g. "45 min · 1-on-1". */
    meta: string;
    desc: string;
    durationMin: number;
    minPlayers: number;
    /** Party size is an option on one service, not five separate services. */
    maxPlayers: number;
    /** Price at one golfer, before any instructor adjustment. */
    basePrice: number;
    /** Total price by party size — per-golfer cost falls as the group grows. */
    priceByPlayers: Record<number, number>;
    guardrails?: Guardrails;
    /** Filter-chip tags. */
    tags: string[];
    /** Catalog section heading. */
    section: string;
    featured?: boolean;
    /** e.g. "Save 20%" — a discount baked into the product, with no credit book. */
    save?: string;

    /* ---- group programs only ---- */
    /** Which instructors teach this. Omit on a private = every golf instructor. */
    coachIds?: string[];
    /** A scheduled program runs at one course. */
    courseSlug?: string;
    /** e.g. "Thursdays 6:00 PM, from Jun 25". */
    schedule?: string;
    sessions?: number;
    capacity?: number;
    registered?: number;
    ageGroup?: string;
    image?: string;
}

export interface Coach {
    id: string;
    /** Printed name, without the credential suffix. */
    name: string;
    /** "PGA", "Master PGA", "LPGA", "GM" — as the Academy prints it. */
    credential: string | null;
    /** The Academy title, e.g. "Director Of Instruction". */
    title: string;
    initials: string;
    /** Every course this instructor teaches at. */
    courseSlugs: string[];
    /**
     * Added to the base service price. This is what replaces a per-instructor
     * catalog: one academy menu, marked up for producers and down for newer staff.
     *
     * Derived from the Academy title, NOT from real MCG rates — we don't have those.
     */
    priceAdj: number;
    email: string | null;
    phone: string | null;
    /** Only where the Academy publishes one. Never invented for a real person. */
    bio: string | null;
    /** The card shows a placeholder because the Academy hasn't published a photo yet. */
    comingSoon?: boolean;
    /**
     * Focus areas, years teaching and ratings are deliberately absent for the real
     * roster: attributing invented specialisms or review scores to named MCG staff is
     * the kind of detail that survives a demo and becomes a problem. They stay optional
     * so the placeholder below can still carry them.
     */
    focus?: FocusArea[];
    yearsTeaching?: number;
    rating?: number;
    reviews?: number;
    credentials?: string[];
    /** The "any available instructor" placeholder rather than a real person. */
    isAny?: boolean;
}

export interface LessonPackage {
    id: string;
    coachId: string;
    /** The service each credit can be spent on. */
    appliesToServiceId: string;
    label: string;
    credits: number;
    price: number;
    /** Sum of the individual lesson prices, so the saving can be shown. */
    listPrice: number;
    perLessonPrice: number;
    savings: number;
    /**
     * "online" packs appear in the catalog with a Buy button. "assigned" packs are
     * issued by the Academy — imported Thrive balances, comps — and are visible only
     * to the golfer holding them.
     */
    availability: "online" | "assigned";
    /** Display string: a date, or "No expiration". */
    expiration: string;
    transferable: boolean;
    badge?: string;
    /** The three copy blocks that make the pack's policy legible before purchase. */
    howItWorks: string[];
    included: string[];
    restrictions: string[];
}

export interface CreditRelief {
    date: string;
    label: string;
    valueRelieved: number;
}

export interface CreditBalance {
    id: string;
    packageId: string;
    coachId: string;
    creditsTotal: number;
    creditsRemaining: number;
    /** Outstanding liability for this balance — what MCG still owes in lessons. */
    valueRemaining: number;
    purchasedOn: string;
    expiresOn?: string;
    history: CreditRelief[];
}

/** Model B — no credit book, a discount earned by volume. */
export interface VolumeProgress {
    coachId: string;
    serviceId: string;
    lessonsTaken: number;
    lessonsRequired: number;
    /** Fraction off the lesson that follows, e.g. 0.5 = half price. */
    discount: number;
}

/**
 * Model C — a recurring lesson subscription, lifted from the prototype's resource
 * package step (start date + auto-renew + renewal notice). Nothing is prepaid beyond
 * the current cycle, so it carries no liability, but unlike Model B it still produces
 * predictable revenue and a standing commitment.
 */
export interface LessonSubscription {
    id: string;
    coachId: string;
    appliesToServiceId: string;
    label: string;
    lessonsPerMonth: number;
    monthlyPrice: number;
    /** What the same lessons would cost booked one at a time. */
    listMonthly: number;
    renewalNoticeDays: number;
    perks: string[];
    obligations: string[];
}

/* ------------------------------------------------------------------ */
/* Instructors                                                         */
/* ------------------------------------------------------------------ */

/**
 * "Any available instructor" — a first-class choice, not a fallback. The MCG call's
 * loudest complaint was a golfer landing on one pro's empty calendar and having to
 * start over; offering this at the top of the instructor step means they never have
 * to pick a person before they pick a time.
 */
export const ANY_INSTRUCTOR: Coach = {
    id: "any",
    name: "Any available instructor",
    credential: null,
    title: "We'll match you with an MCG pro",
    initials: "??",
    courseSlugs: mcgCourses.map((c) => c.slug),
    priceAdj: 0,
    email: null,
    phone: null,
    bio: "Pick this if you're flexible on who teaches you. We'll assign an MCG Academy instructor based on your course, your time, and what you want to work on — and you'll see who it is before you pay.",
    focus: ["Full swing", "Short game"],
    credentials: ["Every MCG Academy instructor is certified by the Academy"],
    isAny: true,
};

/**
 * Rate tiers, derived from the Academy title. MCG's real per-instructor rates aren't
 * public, so this is a model of the structure the call described — producers priced
 * above the academy rate, newer staff below — not a claim about what anyone charges.
 */
const TITLE_ADJ: { match: RegExp; adj: number }[] = [
    { match: /Director/i, adj: 25 },
    { match: /Master Instructor/i, adj: 25 },
    { match: /Lead Instructor/i, adj: 15 },
    { match: /Certified Instructor/i, adj: 5 },
    { match: /Academy Instructor/i, adj: 0 },
];

const adjFor = (instructor: AcademyInstructor): number => {
    const byTitle = TITLE_ADJ.find((t) => t.match.test(instructor.role))?.adj;
    if (byTitle !== undefined) return byTitle;
    // A Master PGA with no matching title still sits above the academy rate.
    return instructor.credential === "Master PGA" ? 20 : 0;
};

const initialsOfName = (name: string) =>
    name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

/**
 * The instructor roster, projected from the real MCG Golf Academy pages.
 *
 * `academy-roster.ts` is the source of truth for identity — name, credential, title,
 * courses, contact. Everything commercial (rate adjustment, availability, packages) is
 * modelled on top of it here.
 */
export const COACHES: Coach[] = ACADEMY_ROSTER.map((instructor) => ({
    id: instructor.id,
    name: instructor.name,
    credential: instructor.credential,
    title: instructor.role,
    initials: initialsOfName(instructor.name),
    courseSlugs: instructor.courseSlugs,
    priceAdj: adjFor(instructor),
    email: instructor.email,
    phone: instructor.phone,
    bio: instructor.bio,
    comingSoon: instructor.comingSoon,
    credentials: [instructor.credential, instructor.role].filter((v): v is string => Boolean(v)),
}));

/** Instructors who can actually be booked — the Coming Soon cards can't. */
export const BOOKABLE_COACHES: Coach[] = COACHES.filter((c) => !c.comingSoon);

export const coachById = (id: string): Coach | undefined => (id === "any" ? ANY_INSTRUCTOR : COACHES.find((c) => c.id === id));

/** Instructors who teach at a given course. */
export const coachesAtCourse = (slug: string): Coach[] => COACHES.filter((c) => c.courseSlugs.includes(slug));

/** How an instructor's adjustment reads on a card. */
export const adjLabel = (adj: number): string => (adj > 0 ? `+$${adj} premier rate` : adj < 0 ? `−$${Math.abs(adj)} off academy rate` : "Academy rate");

/* ------------------------------------------------------------------ */
/* Service catalog                                                     */
/* ------------------------------------------------------------------ */

const to5 = (n: number) => Math.round(n / 5) * 5;

/**
 * Total price by party size. The instructor invests the same hour either way, so the
 * total climbs slowly and the per-golfer cost drops sharply — the "you get that third
 * person for free" effect MCG already prices for.
 */
const partyPricing = (base: number, maxPlayers: number): Record<number, number> => {
    const step = [1, 1.36, 1.55, 1.7];
    const out: Record<number, number> = {};
    for (let n = 1; n <= maxPlayers; n++) out[n] = to5(base * step[n - 1]);
    return out;
};

const priv = (
    id: string,
    name: string,
    audience: Audience,
    meta: string,
    durationMin: number,
    maxPlayers: number,
    basePrice: number,
    desc: string,
    tags: string[],
    extra: Partial<LessonService> = {},
): LessonService => ({
    id,
    name,
    kind: "private",
    audience,
    meta,
    desc,
    durationMin,
    minPlayers: 1,
    maxPlayers,
    basePrice,
    priceByPlayers: partyPricing(basePrice, maxPlayers),
    tags,
    section: "Private lessons",
    ...extra,
});

const group = (
    id: string,
    name: string,
    audience: Audience,
    coachId: string,
    courseSlug: string,
    schedule: string,
    sessions: number,
    durationMin: number,
    price: number,
    capacity: number,
    registered: number,
    ageGroup: string,
    desc: string,
    tags: string[],
    image: string,
    save?: string,
): LessonService => ({
    id,
    name,
    kind: "group",
    audience,
    meta: `${schedule} · ${sessions} ${sessions === 1 ? "session" : "sessions"}`,
    desc,
    durationMin,
    minPlayers: 1,
    maxPlayers: 1,
    basePrice: price,
    priceByPlayers: { 1: price },
    tags,
    section: "Group clinics & programs",
    coachIds: [coachId],
    courseSlug,
    schedule,
    sessions,
    capacity,
    registered,
    ageGroup,
    image,
    save,
});

/**
 * One catalog. Privates and scheduled programs sit side by side, separated by `kind`
 * and filtered by tag — the structural change the Sagamore prototype argues for.
 */
export const LESSON_SERVICES: LessonService[] = [
    /* ---- privates: taught by every golf instructor ---- */
    priv("private-45", "45-Minute Private", "adult", "45 min · 1–4 golfers", 45, 4, 90, "The standard lesson. Full swing, short game, or whatever you bring to the tee that day.", ["private", "adult"], {
        featured: true,
        section: "Featured",
    }),
    priv("private-60", "60-Minute Private", "adult", "60 min · 1–4 golfers", 60, 4, 115, "An extra fifteen minutes — enough to work on two things instead of one.", ["private", "adult"], {
        featured: true,
        section: "Featured",
    }),
    priv("playing-9", "9-Hole Playing Lesson", "adult", "~2 hr · on-course", 120, 3, 170, "Nine holes with your instructor — course management, and lies you never get on the range.", ["private", "playing", "adult"], {
        featured: true,
        section: "Featured",
        guardrails: { timeWindow: { start: 14 * 60, end: 17 * 60 }, season: "April – October" },
    }),
    priv("private-30", "30-Minute Tune-Up", "adult", "30 min · 1–2 golfers", 30, 2, 60, "A focused half hour on one thing — putting, chipping, bunker play, or driver tempo.", ["private", "adult"]),
    priv("junior-30", "Junior Private", "junior", "30 min · ages 7–17", 30, 2, 55, "Thirty minutes is the right attention span for most juniors. Clubs available if they need them.", ["private", "junior"], {
        guardrails: { daysOfWeek: [0, 6] },
    }),
    priv("senior-45", "Senior Private", "senior", "45 min · ages 62+", 45, 2, 75, "Built around what still works, not what used to. Weekday mornings, at a gentler pace.", ["private", "senior"], {
        guardrails: { daysOfWeek: [1, 2, 3, 4], timeWindow: { start: 9 * 60, end: 12 * 60 } },
    }),

    /* ---- scheduled group programs: fixed instructor, course and roster ---- */
    group(
        "clinic-adult-l2",
        "Adult Level 2 — Building a Repeatable Swing",
        "adult",
        "mike-kenny",
        "falls-road",
        "Thursdays 6:00 PM, from Jun 25",
        6,
        60,
        189,
        12,
        9,
        "Adults with some experience",
        "A six-week clinic covering the full swing, short game, and on-course fundamentals. The natural next step after a handful of privates.",
        ["group", "adult"],
        asset("events-images/event-2.png"),
        "Save 20%",
    ),
    group(
        "clinic-scoring",
        "Scoring Clinic — 60 Yards and In",
        "adult",
        "brent-wilkerson",
        "needwood",
        "Sat Jun 27, 9:00 AM",
        1,
        120,
        65,
        16,
        8,
        "All levels",
        "Two hours inside 60 yards, where the strokes actually are. Wedge matrix, lies, and a short-game test to finish.",
        ["group", "adult"],
        asset("events-images/event-4.png"),
    ),
    group(
        "clinic-launch-lab",
        "Launch Monitor Lab",
        "adult",
        "mike-dickson",
        "northwest",
        "Wednesdays 5:30 PM, from Jun 24",
        4,
        90,
        149,
        10,
        5,
        "Adults",
        "Four weeks on the launch monitor. Numbers first: club path, face angle, spin, and what to actually do about them.",
        ["group", "adult"],
        asset("events-images/event-6.png"),
    ),
    group(
        "clinic-get-golf-ready",
        "Get Golf Ready — Beginner Group",
        "adult",
        "doug-hamilton",
        "laytonsville",
        "Tuesdays 6:00 PM, from Jun 23",
        5,
        60,
        139,
        12,
        8,
        "New golfers",
        "Five weeks from never having held a club to playing nine holes. Clubs provided; the last session is on the course.",
        ["group", "adult"],
        asset("events-images/event-7.png"),
        "Save 15%",
    ),
    group(
        "clinic-junior-first",
        "First Swings — Junior Starter",
        "junior",
        "kate-schanuel",
        "crossvines",
        "Saturdays 10:00 AM, from Jun 20",
        8,
        60,
        129,
        14,
        8,
        "Ages 7–10",
        "Eight Saturday mornings of first swings, games, and etiquette. The front door to the MCG junior pathway.",
        ["group", "junior"],
        asset("events-images/event-3.png"),
        "Save 25%",
    ),
    group(
        "camp-junior-summer",
        "Junior Summer Camp — 1 Week",
        "junior",
        "kate-schanuel",
        "crossvines",
        "Mon–Fri mornings, Jul 13",
        5,
        180,
        425,
        16,
        14,
        "Ages 6–12",
        "A week-long day camp — instruction, games, short on-course play, and lunch. Weekly sessions run June through August.",
        ["group", "junior"],
        asset("events-images/event-5.png"),
    ),
    group(
        "clinic-wedge",
        "Wedge Matrix Workshop",
        "adult",
        "brent-wilkerson",
        "needwood",
        "Sun Jun 28, 1:00 PM",
        1,
        120,
        75,
        12,
        12,
        "Intermediate and up",
        "Build your own distance chart across three wedges and three swing lengths. You leave with numbers you can trust.",
        ["group", "adult"],
        asset("events-images/event-1.png"),
    ),
];

/** Catalog filter chips, in the order they appear above the catalog. */
export const CATALOG_FILTERS: { id: string; label: string; match: string | null }[] = [
    { id: "all", label: "All", match: null },
    { id: "private", label: "Private lessons", match: "private" },
    { id: "group", label: "Group clinics", match: "group" },
    { id: "junior", label: "Junior", match: "junior" },
    { id: "senior", label: "Senior", match: "senior" },
    { id: "playing", label: "Playing lessons", match: "playing" },
];

export const serviceById = (id: string): LessonService | undefined => LESSON_SERVICES.find((s) => s.id === id);

export const PRIVATE_SERVICES = LESSON_SERVICES.filter((s) => s.kind === "private");
export const GROUP_SERVICES = LESSON_SERVICES.filter((s) => s.kind === "group");

/** Spots left in a scheduled program, or null for a private. */
export const spotsLeft = (service: LessonService): number | null =>
    service.capacity === undefined ? null : service.capacity - (service.registered ?? 0);

/** Services a given instructor can teach — every private, plus their own programs. */
export const servicesForCoach = (coachId: string): LessonService[] =>
    LESSON_SERVICES.filter((s) => (s.kind === "private" ? true : s.coachIds?.includes(coachId)));

/** Scheduled programs an instructor runs — shown on their profile. */
export const clinicsForCoach = (coachId: string): LessonService[] => GROUP_SERVICES.filter((s) => s.coachIds?.includes(coachId));

/** Instructors who can teach a service at a given course. */
export const coachesForService = (service: LessonService, courseSlug?: string): Coach[] => {
    if (service.kind === "group") return (service.coachIds ?? []).map((id) => coachById(id)!).filter(Boolean);
    return COACHES.filter((c) => (courseSlug ? c.courseSlugs.includes(courseSlug) : true));
};

/* ---- pricing: base service rate + instructor adjustment ---- */

/** What this service costs with this instructor, at this party size. */
export const servicePrice = (service: LessonService, coach?: Coach, players = 1): number => {
    const base = service.priceByPlayers[Math.min(players, service.maxPlayers)] ?? service.basePrice;
    // A scheduled program is priced by the Academy, not by who happens to teach it.
    if (service.kind === "group") return base;
    return base + (coach?.priceAdj ?? 0);
};

/** Per-golfer cost at a given party size. */
export const perPlayer = (service: LessonService, coach: Coach | undefined, players: number): number => servicePrice(service, coach, players) / players;

/** The cheapest way to take a lesson with this instructor — the "from" price on a card. */
export const fromPrice = (coachId: string): number => {
    const coach = coachById(coachId);
    return Math.min(...PRIVATE_SERVICES.map((s) => servicePrice(s, coach, 1)));
};

/** The cheapest instructor for a service — the "from" price on a catalog card. */
export const serviceFromPrice = (service: LessonService): number => {
    if (service.kind === "group") return service.basePrice;
    return Math.min(...COACHES.map((c) => servicePrice(service, c, 1)));
};

/* ------------------------------------------------------------------ */
/* Availability                                                        */
/* ------------------------------------------------------------------ */

export interface Slot {
    /** Minutes since midnight. */
    minutes: number;
    label: string;
    status: "open" | "booked" | "blocked";
    /** Why the instructor blocked it, when they chose to show it. */
    blockedReason?: string;
    /** Which instructor this slot belongs to — set when resolving "any instructor". */
    coachId?: string;
}

const fmtTime = (minutes: number) => {
    const h24 = Math.floor(minutes / 60);
    const m = minutes % 60;
    const h = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h}:${String(m).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
};

export const slotLabel = fmtTime;

/** Stable pseudo-random from a string, so a story renders the same board every time. */
const hash = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967295;
};

export const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * An instructor's working day at one course, on 30-minute centres from 8 AM to 6 PM.
 * Deterministic per (coach, course, date) so every story is stable.
 *
 * A producer at a premier rate stays full; a newer instructor has openings.
 */
export const coachDay = (coachId: string, courseSlug: string, date: Date, opts?: { fullyBooked?: boolean }): Slot[] => {
    const coach = coachById(coachId);
    const adj = coach?.priceAdj ?? 0;
    const density = opts?.fullyBooked ? 1 : adj > 0 ? 0.62 : adj === 0 ? 0.45 : 0.26;
    const key = `${coachId}|${courseSlug}|${isoOf(date)}`;

    const slots: Slot[] = [];
    for (let minutes = 8 * 60; minutes <= 18 * 60; minutes += 30) {
        const r = hash(`${key}|${minutes}`);
        // A midday hour the instructor holds for lunch — shown as blocked, not hidden.
        if (minutes === 12 * 60 || minutes === 12 * 60 + 30) {
            slots.push({ minutes, label: fmtTime(minutes), status: "blocked", blockedReason: "Unavailable", coachId });
            continue;
        }
        slots.push({ minutes, label: fmtTime(minutes), status: r < density ? "booked" : "open", coachId });
    }
    return slots;
};

/**
 * The combined day for "any available instructor" — every pro at the course merged
 * onto one board, each slot tagged with whoever is free. This is what makes picking a
 * time before picking a person work.
 */
export const anyInstructorDay = (courseSlug: string, date: Date): Slot[] => {
    const pros = coachesAtCourse(courseSlug);
    const byMinute = new Map<number, Slot>();
    for (const pro of pros) {
        for (const slot of coachDay(pro.id, courseSlug, date)) {
            const existing = byMinute.get(slot.minutes);
            if (!existing || (existing.status !== "open" && slot.status === "open")) byMinute.set(slot.minutes, slot);
        }
    }
    return [...byMinute.values()].sort((a, b) => a.minutes - b.minutes);
};

/** Apply a service's guardrails to a day — anything outside them stops being bookable. */
export const applyGuardrails = (slots: Slot[], service: LessonService, date: Date): Slot[] => {
    const g = service.guardrails;
    if (!g) return slots;
    const dayOk = !g.daysOfWeek || g.daysOfWeek.includes(date.getDay());
    return slots.map((s) => {
        const timeOk = !g.timeWindow || (s.minutes >= g.timeWindow.start && s.minutes < g.timeWindow.end);
        if (!dayOk || !timeOk) return { ...s, status: "blocked" as const, blockedReason: "Not offered" };
        return s;
    });
};

/** Plain-English summary of a service's guardrails, for the catalog and the calendar. */
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const guardrailSummary = (service: LessonService): string | null => {
    const g = service.guardrails;
    if (!g) return null;
    const parts: string[] = [];
    if (g.daysOfWeek) {
        const days = g.daysOfWeek.map((d) => DAY_NAMES[d]);
        parts.push(days.length === 2 && g.daysOfWeek.every((d) => d === 0 || d === 6) ? "Weekends only" : `${days.join(", ")} only`);
    }
    if (g.timeWindow) parts.push(`${fmtTime(g.timeWindow.start)} – ${fmtTime(g.timeWindow.end)}`);
    if (g.season) parts.push(g.season);
    return parts.length ? parts.join(" · ") : null;
};

/** Next open slot for a coach on a given date, as a display string. */
export const nextOpening = (coachId: string, date: Date): string => {
    const coach = coachById(coachId);
    if (!coach) return "—";
    for (const slug of coach.courseSlugs) {
        const open = coachDay(coachId, slug, date).find((s) => s.status === "open");
        if (open) return `${open.label} · ${COURSE_NAME[slug]}`;
    }
    return "No openings today";
};

/* ---- dayparts: a 20-slot day reads better in three blocks ---- */

export interface Daypart {
    id: string;
    label: string;
    start: number;
    end: number;
}

export const DAYPARTS: Daypart[] = [
    { id: "morning", label: "Morning", start: 0, end: 12 * 60 },
    { id: "afternoon", label: "Afternoon", start: 12 * 60, end: 17 * 60 },
    { id: "evening", label: "Evening", start: 17 * 60, end: 24 * 60 },
];

/** Split a day's slots into Morning / Afternoon / Evening, dropping empty blocks. */
export const byDaypart = (slots: Slot[]): { daypart: Daypart; slots: Slot[] }[] =>
    DAYPARTS.map((daypart) => ({ daypart, slots: slots.filter((s) => s.minutes >= daypart.start && s.minutes < daypart.end) })).filter((g) => g.slots.length > 0);

/** Waitlist preference windows, offered when nothing on the board works. */
export const WAITLIST_WINDOWS: Daypart[] = [{ id: "any", label: "Any time", start: 0, end: 24 * 60 }, ...DAYPARTS];

/* ------------------------------------------------------------------ */
/* Packages — Model A, the credit book                                 */
/* ------------------------------------------------------------------ */

/** A pack on a coach's 45-minute private, priced roughly a lesson short. */
const packFor = (coachId: string, credits: number, discount: number, badge?: string): LessonPackage => {
    const coach = coachById(coachId)!;
    const service = serviceById("private-45")!;
    const unit = servicePrice(service, coach, 1);
    const listPrice = unit * credits;
    const price = to5(listPrice * (1 - discount));
    return {
        id: `${coachId}--pack-${credits}`,
        coachId,
        appliesToServiceId: service.id,
        label: `${credits} × 45-Minute Private`,
        credits,
        price,
        listPrice,
        perLessonPrice: Math.round(price / credits),
        savings: listPrice - price,
        availability: "online",
        expiration: "December 31, 2026",
        transferable: false,
        badge,
        howItWorks: [
            `Redeem one credit when you book a 45-minute private with ${coach.name}`,
            "Book online, or have your instructor apply a credit at the lesson tee",
            "Credits post to your MCG account immediately after purchase",
            "Your remaining balance shows in your wallet and at checkout",
        ],
        included: [
            `${credits} × 45-minute private lessons with ${coach.name}`,
            "Range balls for the lesson",
            "Written notes and drills after each session",
            ...(credits >= 10 ? ["One complimentary 9-hole playing lesson"] : []),
        ],
        restrictions: [
            "Valid with this instructor only — rates are set per instructor",
            "Unused credits expire December 31, 2026",
            "Non-transferable between golfers",
            "Cancel or reschedule at least 24 hours ahead or the credit is spent",
        ],
    };
};

export const PACKAGES: LessonPackage[] = [
    packFor("mike-kenny", 5, 0.1),
    packFor("mike-kenny", 10, 0.14, "Best value"),
    packFor("mike-dickson", 5, 0.1),
    packFor("doug-hamilton", 5, 0.09),
    packFor("doug-hamilton", 10, 0.12, "Best value"),
    packFor("brent-wilkerson", 5, 0.09),
    packFor("kate-schanuel", 5, 0.09),
    packFor("dustin-stearns", 5, 0.08),
    packFor("brad-cameron", 5, 0.08),
    // Imported from the old Thrive system — held by specific golfers, never purchasable.
    {
        id: "doug-hamilton--thrive-import",
        coachId: "doug-hamilton",
        appliesToServiceId: "private-45",
        label: "Transferred Lesson Credits",
        credits: 4,
        price: 0,
        listPrice: 360,
        perLessonPrice: 90,
        savings: 0,
        availability: "assigned",
        expiration: "No expiration",
        transferable: true,
        howItWorks: [
            "Balance carried over from MCG's previous booking system",
            "Assigned by the Academy — it never appears in the package catalog",
            "Redeem exactly like a purchased credit, online or at the lesson tee",
        ],
        included: ["Remaining 45-minute private lessons with Doug Hamilton", "Range balls for the lesson"],
        restrictions: [
            "Cannot be purchased — issued by the Academy only",
            "Keeps the terms it was originally bought under",
            "Transfers between family members on request",
        ],
    },
];

export const packageById = (id: string): LessonPackage | undefined => PACKAGES.find((p) => p.id === id);

export const onlinePackages = (): LessonPackage[] => PACKAGES.filter((p) => p.availability === "online");

export const packagesForCoach = (coachId: string): LessonPackage[] => PACKAGES.filter((p) => p.coachId === coachId && p.availability === "online");

/** Package filter chips. */
export const PACKAGE_FILTERS: { id: string; label: string }[] = [
    { id: "all", label: "All packages" },
    { id: "5", label: "5 lessons" },
    { id: "10", label: "10 lessons" },
];

/* ------------------------------------------------------------------ */
/* Model C — the lesson subscription                                   */
/* ------------------------------------------------------------------ */

export const SUBSCRIPTIONS: LessonSubscription[] = [
    {
        id: "mike-kenny--sub-2",
        coachId: "mike-kenny",
        appliesToServiceId: "private-45",
        label: "2 lessons a month",
        lessonsPerMonth: 2,
        monthlyPrice: 199,
        listMonthly: 220,
        renewalNoticeDays: 3,
        perks: [
            "Two 45-minute privates every month, booked whenever suits you",
            "A standing slot held for you, if you want one",
            "Range balls included, plus 10% off in the Pro Shop",
        ],
        obligations: [
            "Billed monthly on the same date, starting the day you choose",
            "Unused lessons roll over one month, then expire",
            "Cancel anytime from your account — you're notified 3 days before each renewal",
        ],
    },
    {
        id: "doug-hamilton--sub-4",
        coachId: "doug-hamilton",
        appliesToServiceId: "private-45",
        label: "4 lessons a month",
        lessonsPerMonth: 4,
        monthlyPrice: 319,
        listMonthly: 360,
        renewalNoticeDays: 3,
        perks: [
            "Four 45-minute privates every month across any of Doug's three courses",
            "Priority booking 48 hours before general release",
            "Range balls included, plus 10% off in the Pro Shop",
        ],
        obligations: [
            "Billed monthly on the same date, starting the day you choose",
            "Unused lessons roll over one month, then expire",
            "Cancel anytime from your account — you're notified 3 days before each renewal",
        ],
    },
];

export const subscriptionById = (id: string): LessonSubscription | undefined => SUBSCRIPTIONS.find((s) => s.id === id);

/* ------------------------------------------------------------------ */
/* The demo golfer                                                     */
/* ------------------------------------------------------------------ */

export const GOLFER = {
    first: "Justin",
    last: "Girard",
    initials: "JG",
    email: "hello@girardjustin.com",
    phone: "(617) 470-7879",
    memberOf: "Montgomery County Golf",
};

/** Credit balances Justin holds — one purchased pack, one assigned Thrive import. */
export const CREDIT_BALANCES: CreditBalance[] = [
    {
        id: "bal-martin-5",
        packageId: "mike-kenny--pack-5",
        coachId: "mike-kenny",
        creditsTotal: 5,
        creditsRemaining: 5,
        valueRemaining: 495,
        purchasedOn: "May 2, 2026",
        expiresOn: "December 31, 2026",
        history: [],
    },
    {
        id: "bal-doug-thrive",
        packageId: "doug-hamilton--thrive-import",
        coachId: "doug-hamilton",
        creditsTotal: 4,
        creditsRemaining: 2,
        valueRemaining: 180,
        purchasedOn: "Feb 14, 2026",
        history: [
            { date: "Mar 21, 2026", label: "45-Minute Private · Laytonsville", valueRelieved: 90 },
            { date: "Apr 18, 2026", label: "45-Minute Private · Little Bennett", valueRelieved: 90 },
        ],
    },
];

/** The same Martin balance one lesson later — used by the "after redemption" story. */
export const BALANCE_AFTER_REDEMPTION: CreditBalance = {
    ...CREDIT_BALANCES[0],
    creditsRemaining: 4,
    valueRemaining: 396,
    history: [{ date: "June 19, 2026", label: "45-Minute Private · Falls Road", valueRelieved: 99 }],
};

/** A spent balance and an expired one — the states the Academy fields calls about. */
export const EDGE_BALANCES: CreditBalance[] = [
    {
        id: "bal-brendan-spent",
        packageId: "brent-wilkerson--pack-5",
        coachId: "brent-wilkerson",
        creditsTotal: 5,
        creditsRemaining: 0,
        valueRemaining: 0,
        purchasedOn: "January 8, 2026",
        expiresOn: "December 31, 2026",
        history: [
            { date: "Jan 24, 2026", label: "45-Minute Private · Needwood", valueRelieved: 82 },
            { date: "Feb 7, 2026", label: "45-Minute Private · Needwood", valueRelieved: 82 },
            { date: "Feb 28, 2026", label: "45-Minute Private · Needwood", valueRelieved: 82 },
            { date: "Mar 14, 2026", label: "45-Minute Private · Needwood", valueRelieved: 82 },
            { date: "Apr 4, 2026", label: "45-Minute Private · Needwood", valueRelieved: 82 },
        ],
    },
    {
        id: "bal-brad-expired",
        packageId: "brad-cameron--pack-5",
        coachId: "brad-cameron",
        creditsTotal: 5,
        creditsRemaining: 2,
        valueRemaining: 140,
        purchasedOn: "March 3, 2025",
        expiresOn: "December 31, 2025",
        history: [
            { date: "Mar 29, 2025", label: "45-Minute Private · Laytonsville", valueRelieved: 70 },
            { date: "Apr 12, 2025", label: "45-Minute Private · Laytonsville", valueRelieved: 70 },
            { date: "May 3, 2025", label: "45-Minute Private · Laytonsville", valueRelieved: 70 },
        ],
    },
];

/** Model B — the volume discount Justin is three lessons into with Doug. */
export const VOLUME_PROGRESS: VolumeProgress = {
    coachId: "doug-hamilton",
    serviceId: "private-45",
    lessonsTaken: 3,
    lessonsRequired: 4,
    discount: 0.5,
};

/* ------------------------------------------------------------------ */
/* Booking-flow helpers                                                */
/* ------------------------------------------------------------------ */

export interface Participant {
    first: string;
    last: string;
    email: string;
    phone: string;
    /** Junior lessons collect an age; adult and senior don't. */
    age?: string;
}

export const EMPTY_PARTICIPANT: Participant = { first: "", last: "", email: "", phone: "" };

export const HOST_PARTICIPANT: Participant = {
    first: GOLFER.first,
    last: GOLFER.last,
    email: GOLFER.email,
    phone: GOLFER.phone,
};

/** Sample guests so multi-person stories open with completed cards. */
export const SAMPLE_GUESTS: Participant[] = [
    { first: "Casey", last: "Girard", email: "casey.g@example.com", phone: "(240) 555-0142", age: "11" },
    { first: "Rowan", last: "Ellis", email: "rowan.ellis@example.com", phone: "(240) 555-0188", age: "12" },
    { first: "Sam", last: "Okafor", email: "sam.okafor@example.com", phone: "(240) 555-0119", age: "10" },
];

export const initialsOf = (p: Participant): string | undefined => (p.first ? `${p.first[0]}${p.last[0] ?? ""}`.toUpperCase() : undefined);

export const money = (n: number) => `$${n.toFixed(2)}`;

/** Whole-dollar money, for prices that never carry cents on a card. */
export const money0 = (n: number) => `$${Math.round(n)}`;

/** Promo codes accepted at checkout. */
export const PROMOS: Record<string, { type: "percent" | "fixed"; value: number; label: string }> = {
    MCGJUNIOR: { type: "percent", value: 15, label: "Junior Academy — 15% off" },
    WELCOME10: { type: "percent", value: 10, label: "New golfer — 10% off" },
    MCGVET: { type: "fixed", value: 20, label: "Military & first responder — $20 off" },
};
