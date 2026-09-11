/**
 * MCG tee-sheet data — the county's nine courses, what they charge, and the single
 * intertwined board the Tee Times screen renders.
 *
 * Montgomery County Golf is a *portfolio*, not a club: nine public courses run as one
 * system, on one card, with one set of rate rules. That shapes the data here in three
 * ways the single-course Sagamore model never had to handle:
 *
 *  - **One board, nine sheets.** Every course posts its own times, and the screen
 *    merges them and sorts by the clock — so 7:00 AM at Falls Road sits beside 7:00 AM
 *    at Needwood. Each course carries an `offset` (minutes past the hour its sheet
 *    starts on) so the merged board genuinely interleaves instead of stacking; the nine
 *    courses spread evenly across :00, :10 and :20.
 *  - **Per-course pricing, one rate structure.** Hampshire Greens and The Crossvines
 *    are the premium tickets; Sligo Creek and Laytonsville are the value rounds. The
 *    *shape* of the rate card — 18, 9, twilight, resident, senior, junior — is identical
 *    everywhere, because it's set for the whole system, even at Sligo Creek, where the
 *    18 is simply two trips round the nine.
 *  - **The resident rate is the headline.** A Montgomery County resident card takes
 *    money off every round at every course. It is the most distinctive thing about
 *    booking a county muni, so it is first-class here rather than fine print.
 *
 * The screens are pure renderers of this module; nothing in `tee-times/` invents a price.
 */

import { mcgCourses, type McgCourse } from "@/components/foundations/mcg/mcg-assets";

/* ------------------------------------------------------------------ */
/* The day                                                             */
/* ------------------------------------------------------------------ */

/** First tee, 6:00 AM. */
export const DAY_START = 6 * 60;
/** Last tee, 7:00 PM. */
export const DAY_END = 19 * 60;
/** Twilight opens at 4:00 PM — a flat rate for whatever you can finish before dark. */
export const TWILIGHT_START = 16 * 60;
/** Weekends and holidays are 18-hole play only until 1:00 PM, system-wide. */
const EIGHTEEN_ONLY_UNTIL = 13 * 60;

/** "7:00 AM" from minutes-since-midnight. */
export const fmtTime = (minutes: number): string => {
    const h24 = Math.floor(minutes / 60);
    const min = minutes % 60;
    const h = ((h24 + 11) % 12) + 1;
    return `${h}:${String(min).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
};

export const isWeekend = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

/** "Friday, June 19" — the long form every confirmation and summary uses. */
export const fmtDay = (date: Date): string => date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

export const money = (n: number): string => `$${n.toFixed(2)}`;
export const money0 = (n: number): string => `$${Math.round(n)}`;

/* ------------------------------------------------------------------ */
/* Rates                                                               */
/* ------------------------------------------------------------------ */

/**
 * One course's green fees, walking. Every MCG course uses this same shape — the county
 * sets the structure and each course sets the numbers.
 */
export interface McgRates {
    eighteen: { weekday: number; weekend: number };
    nine: { weekday: number; weekend: number };
    /** Flat rate from 4:00 PM to close. */
    twilight: { weekday: number; weekend: number };
    /** Dollars off an 18 with a Montgomery County resident card. 9s and twilight take half. */
    resident: number;
    /** Further dollars off for golfers 62 and over — weekdays only. */
    senior: number;
    /** Further dollars off for golfers 17 and under. */
    junior: number;
}

/** A course on the county board: its brand assets, its character, and its rate card. */
export interface McgCourseInfo extends McgCourse {
    par: number;
    yards: number;
    /** One line on what the round is actually like — what a starter would tell you. */
    blurb: string;
    /** Minutes past the hour this course's sheet starts on, which is what interleaves the board. */
    offset: number;
    /**
     * True for a nine-hole property (Sligo Creek). Its sheet only ever posts nines, and
     * its "18" rate is two trips round the same nine rather than a second course.
     */
    nineOnly?: boolean;
    rates: McgRates;
}

/** Riding cart, per player. Set county-wide, not per course. */
export const CART_18 = 22;
export const CART_9 = 14;
/** Pull cart rental, per player, any number of holes. */
export const PULL_CART = 6;
/** The county's online booking fee, charged once per reservation. */
export const BOOKING_FEE = 2.5;

/** Minutes between a course's own tee times. */
const INTERVAL = 30;

export const MCG_COURSES: McgCourseInfo[] = mcgCourses.map((course) => {
    const extra: Record<string, Omit<McgCourseInfo, keyof McgCourse>> = {
        "falls-road": {
            par: 71,
            yards: 6257,
            blurb: "Tight, tree-lined and rolling above the Potomac. The friendliest walk in the county and a favourite of golfers who like to be in by nine.",
            offset: 0,
            rates: {
                eighteen: { weekday: 34, weekend: 42 },
                nine: { weekday: 22, weekend: 27 },
                twilight: { weekday: 24, weekend: 29 },
                resident: 7,
                senior: 6,
                junior: 8,
            },
        },
        northwest: {
            par: 72,
            yards: 7024,
            blurb: "The county's championship length — wide fairways, long par 4s, and a back nine that plays every yard of the card.",
            offset: 10,
            rates: {
                eighteen: { weekday: 38, weekend: 47 },
                nine: { weekday: 24, weekend: 29 },
                twilight: { weekday: 26, weekend: 32 },
                resident: 8,
                senior: 7,
                junior: 9,
            },
        },
        "hampshire-greens": {
            par: 71,
            yards: 6815,
            blurb: "Bent-grass greens, wetlands and the best conditioning in the system. The premium ticket on the north side of the county.",
            offset: 20,
            rates: {
                eighteen: { weekday: 52, weekend: 62 },
                nine: { weekday: 32, weekend: 38 },
                twilight: { weekday: 34, weekend: 40 },
                resident: 10,
                senior: 8,
                junior: 12,
            },
        },
        laytonsville: {
            par: 71,
            yards: 6048,
            blurb: "Open, rolling farmland on the edge of the Agricultural Reserve. The value round of the county, and a quick one.",
            offset: 10,
            rates: {
                eighteen: { weekday: 28, weekend: 35 },
                nine: { weekday: 19, weekend: 23 },
                twilight: { weekday: 20, weekend: 25 },
                resident: 6,
                senior: 5,
                junior: 7,
            },
        },
        "little-bennett": {
            par: 71,
            yards: 6244,
            blurb: "Cut through Little Bennett Regional Park: elevation, blind shots, and a deer or two on the fairway. Take the cart.",
            offset: 20,
            rates: {
                eighteen: { weekday: 36, weekend: 44 },
                nine: { weekday: 23, weekend: 28 },
                twilight: { weekday: 25, weekend: 30 },
                resident: 7,
                senior: 6,
                junior: 8,
            },
        },
        needwood: {
            par: 70,
            yards: 6254,
            blurb: "Rock Creek's home course in Derwood, with the nine-hole Needwood Express alongside it for a loop after work.",
            offset: 0,
            rates: {
                eighteen: { weekday: 37, weekend: 45 },
                nine: { weekday: 24, weekend: 29 },
                twilight: { weekday: 26, weekend: 31 },
                resident: 7,
                senior: 6,
                junior: 8,
            },
        },
        crossvines: {
            par: 71,
            yards: 6470,
            blurb: "Poolesville's course reborn beside the county's winery — the newest look and the premium round in the MCG portfolio.",
            offset: 0,
            rates: {
                eighteen: { weekday: 49, weekend: 59 },
                nine: { weekday: 30, weekend: 36 },
                twilight: { weekday: 32, weekend: 38 },
                resident: 9,
                senior: 8,
                junior: 11,
            },
        },
        rattlewood: {
            par: 72,
            yards: 6676,
            blurb: "Up on the county's northern ridge above Mount Airy: wide fairways, long par 5s and the easiest first tee to get on in the system.",
            offset: 20,
            rates: {
                eighteen: { weekday: 35, weekend: 43 },
                nine: { weekday: 23, weekend: 28 },
                twilight: { weekday: 24, weekend: 29 },
                resident: 7,
                senior: 6,
                junior: 8,
            },
        },
        "sligo-creek": {
            par: 34,
            yards: 2732,
            blurb: "Nine short holes along the creek inside the Beltway. Par 34, walk it in ninety minutes, and the cheapest round the county sells.",
            offset: 10,
            nineOnly: true,
            rates: {
                // The "18" is two trips round the same nine — the county sells it as a rate,
                // not as a second course, and the sheet only ever posts nines.
                eighteen: { weekday: 28, weekend: 34 },
                nine: { weekday: 17, weekend: 21 },
                twilight: { weekday: 14, weekend: 17 },
                resident: 5,
                senior: 4,
                junior: 6,
            },
        },
    };

    return { ...course, ...extra[course.slug] };
});

export const courseInfo = (slug: string): McgCourseInfo => MCG_COURSES.find((c) => c.slug === slug) ?? MCG_COURSES[0];
export const courseName = (slug: string): string => courseInfo(slug).name;

/** Display order, used to break ties when two courses post the same tee time. */
const courseIndex = (slug: string): number => MCG_COURSES.findIndex((c) => c.slug === slug);

/**
 * Courses with nothing left on the sheet for the selected day. Their pill is disabled
 * ("Full") and they drop off the board — a real county Saturday, where the two closest
 * courses to the Beltway go first.
 */
export const MCG_SOLD_OUT = ["little-bennett"];

/* ------------------------------------------------------------------ */
/* Rate maths                                                          */
/* ------------------------------------------------------------------ */

/** Who's playing — the county prices each golfer in the group separately. */
export type RateClass = "adult" | "senior" | "junior";

export const RATE_CLASS_LABEL: Record<RateClass, string> = {
    adult: "Adult",
    senior: "Senior (62+)",
    junior: "Junior (17 & under)",
};

export type Holes = 9 | 18;

/** What a single round costs before carts and fees. */
export const greenFee = ({
    slug,
    holes,
    weekend,
    twilight,
    resident = false,
    rateClass = "adult",
}: {
    slug: string;
    holes: Holes;
    weekend: boolean;
    twilight: boolean;
    resident?: boolean;
    rateClass?: RateClass;
}): number => {
    const { rates } = courseInfo(slug);
    const day = weekend ? "weekend" : "weekday";
    const base = twilight ? rates.twilight[day] : holes === 9 ? rates.nine[day] : rates.eighteen[day];

    // The resident card is worth its full value on an 18; a 9 or a twilight takes half.
    const residentOff = resident ? (twilight || holes === 9 ? Math.round(rates.resident / 2) : rates.resident) : 0;
    // Senior rates are a weekday courtesy. Junior rates run any day — the county wants kids on the course.
    const ageOff = rateClass === "senior" ? (weekend ? 0 : rates.senior) : rateClass === "junior" ? rates.junior : 0;

    return Math.max(12, base - residentOff - ageOff);
};

/* ------------------------------------------------------------------ */
/* The board                                                           */
/* ------------------------------------------------------------------ */

/** A single bookable time on the county board. */
export interface McgSlot {
    id: string;
    courseSlug: string;
    minutes: number;
    label: string;
    /** Open spots in the foursome, 1–4. */
    spots: number;
    holes: Holes;
    twilight: boolean;
    /** Walking green fee, standard rate. */
    price: number;
    /** The same round on a Montgomery County resident card. */
    residentPrice: number;
}

/** Stable 32-bit hash, so a given course + day + time always has the same availability. */
const hash = (input: string): number => {
    let h = 2166136261;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

/**
 * What the sheet posts at a given time.
 *
 * Weekends and holidays are 18-hole play only until 1:00 PM — the standard muni rule that
 * keeps foursomes from jamming at the turn. Weekday mornings still post the occasional 9
 * for the before-work crowd, mid-day mixes both, and everything from 4:00 PM is twilight.
 */
const holesAt = (minutes: number, weekend: boolean, seed: number): { holes: Holes; twilight: boolean } => {
    if (minutes >= TWILIGHT_START) return { holes: 9, twilight: true };
    if (minutes >= EIGHTEEN_ONLY_UNTIL) return { holes: seed % 2 === 0 ? 9 : 18, twilight: false };
    if (weekend) return { holes: 18, twilight: false };
    return { holes: seed % 3 === 0 ? 9 : 18, twilight: false };
};

/** One course's sheet for a day: every time it posts, minus whatever has already gone. */
export const courseSheet = (slug: string, date: Date): McgSlot[] => {
    const info = courseInfo(slug);
    const weekend = isWeekend(date);
    const key = `${slug}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const slots: McgSlot[] = [];

    for (let m = DAY_START + info.offset; m <= DAY_END; m += INTERVAL) {
        const seed = hash(`${key}-${m}`);
        // 0 means the slot is gone; prime time (7–10 AM) goes first, as it does every Saturday.
        const prime = m >= 7 * 60 && m < 10 * 60;
        const spots = prime && seed % 3 === 0 ? 0 : seed % 6 > 4 ? 0 : (seed % 4) + 1;
        if (spots === 0) continue;

        // A nine-hole property posts nines all day; the weekend 18-only rule has nothing
        // to apply to. Everywhere else the county's hole rules decide.
        const { holes, twilight } = info.nineOnly ? { holes: 9 as Holes, twilight: m >= TWILIGHT_START } : holesAt(m, weekend, seed);
        slots.push({
            id: `${slug}-${m}`,
            courseSlug: slug,
            minutes: m,
            label: fmtTime(m),
            spots,
            holes,
            twilight,
            price: greenFee({ slug, holes, weekend, twilight }),
            residentPrice: greenFee({ slug, holes, weekend, twilight, resident: true }),
        });
    }

    return slots;
};

export interface BoardQuery {
    date: Date;
    /** Group size — a slot with fewer spots left than this drops off the board. */
    players: number;
    holes: "any" | Holes;
    /** Slugs the golfer has switched on. */
    courses: string[];
    /** Slugs with nothing left today. Defaults to `MCG_SOLD_OUT`. */
    soldOut?: string[];
}

/**
 * The county board: every enabled course's sheet merged into one list, sorted by the
 * clock. Ties break on display order so the same time always groups the same way.
 */
export const mcgBoard = ({ date, players, holes, courses, soldOut = MCG_SOLD_OUT }: BoardQuery): McgSlot[] =>
    courses
        .filter((slug) => !soldOut.includes(slug))
        .flatMap((slug) => courseSheet(slug, date))
        .filter((slot) => slot.spots >= players && (holes === "any" || slot.holes === holes))
        .sort((a, b) => a.minutes - b.minutes || courseIndex(a.courseSlug) - courseIndex(b.courseSlug));

/* ------------------------------------------------------------------ */
/* Transportation                                                      */
/* ------------------------------------------------------------------ */

export type Transport = "walking" | "riding" | "pull-cart" | "electric-caddy";

/**
 * The electric caddy sits between a pull cart and a riding cart: you still walk the
 * course, but the bag rides itself. Every MCG course keeps a few, so it is offered
 * county-wide rather than at the larger courses only.
 */
export const CADDY_18 = 15;
export const CADDY_9 = 10;

/** In the order they are offered — cheapest to most, walking first. */
export const TRANSPORT_ORDER: Transport[] = ["walking", "pull-cart", "electric-caddy", "riding"];

export const TRANSPORT_LABEL: Record<Transport, string> = {
    walking: "Walking",
    riding: "Riding cart",
    "pull-cart": "Pull cart",
    "electric-caddy": "Electric caddy",
};

export const TRANSPORT_HINT: Record<Transport, string> = {
    walking: "Every MCG course is walkable. No charge.",
    riding: "Shared cart, one per two golfers. Priced per player.",
    "pull-cart": "Rented at the counter and waiting at the first tee.",
    "electric-caddy": "A remote-control trolley that carries your bag while you walk. Available at all nine courses.",
};

/** Per-player transportation charge for a round of this length. */
export const transportFee = (transport: Transport, holes: Holes, twilight: boolean): number => {
    if (transport === "walking") return 0;
    if (transport === "pull-cart") return PULL_CART;
    const short = holes === 9 || twilight;
    if (transport === "electric-caddy") return short ? CADDY_9 : CADDY_18;
    return short ? CART_9 : CART_18;
};

/* ------------------------------------------------------------------ */
/* Handing a booking between screens                                   */
/* ------------------------------------------------------------------ */

/**
 * The prototype is a static export with no server, so the tee sheet hands checkout its
 * slot through `localStorage` rather than a query string — which also means a refresh
 * mid-checkout keeps the hold. Both screens accept the same object as a prop, so a story
 * can render any state without touching storage at all.
 */
export interface TeeSelection {
    courseSlug: string;
    isoDate: string;
    dateLabel: string;
    minutes: number;
    timeLabel: string;
    holes: Holes;
    players: number;
    twilight: boolean;
    weekend: boolean;
}

export interface ReceiptLine {
    label: string;
    detail?: string;
    amount: number;
}

export interface TeeReceipt extends TeeSelection {
    /** "MCG-4821" — what the starter asks for. */
    confirmation: string;
    transport: Transport;
    resident: boolean;
    lines: ReceiptLine[];
    total: number;
    cardLast4: string;
    email: string;
}

const SELECTION_KEY = "mcg-tee-selection-v1";
const RECEIPT_KEY = "mcg-tee-receipt-v1";

/** A sensible slot to fall back on — a story, or a cold open on /tee-times/checkout. */
export const DEFAULT_SELECTION: TeeSelection = {
    courseSlug: "falls-road",
    isoDate: "2026-06-19",
    dateLabel: "Friday, June 19",
    minutes: 8 * 60 + 30,
    timeLabel: "8:30 AM",
    holes: 18,
    players: 2,
    twilight: false,
    weekend: false,
};

export const selectionFromSlot = (slot: McgSlot, date: Date, players: number): TeeSelection => ({
    courseSlug: slot.courseSlug,
    isoDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
    dateLabel: fmtDay(date),
    minutes: slot.minutes,
    timeLabel: slot.label,
    holes: slot.holes,
    players: Math.min(players, slot.spots),
    twilight: slot.twilight,
    weekend: isWeekend(date),
});

const readJson = <T,>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        // Private windows and blocked site data both land here.
        return null;
    }
};

const writeJson = (key: string, value: unknown) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* storage unavailable — the walkthrough just won't survive a refresh */
    }
};

export const readSelection = (): TeeSelection | null => readJson<TeeSelection>(SELECTION_KEY);
export const writeSelection = (selection: TeeSelection) => writeJson(SELECTION_KEY, selection);
export const readReceipt = (): TeeReceipt | null => readJson<TeeReceipt>(RECEIPT_KEY);
export const writeReceipt = (receipt: TeeReceipt) => writeJson(RECEIPT_KEY, receipt);

/** "MCG-4821". Deterministic in a story, random in the app. */
export const newConfirmation = (): string => `MCG-${Math.floor(1000 + Math.random() * 9000)}`;

/* ------------------------------------------------------------------ */
/* Add to calendar                                                     */
/* ------------------------------------------------------------------ */

const stamp = (isoDate: string, minutes: number): string => {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${isoDate.replace(/-/g, "")}T${h}${m}00`;
};

/**
 * A Google Calendar template link for the round. Floating local times — a tee time is
 * whatever the clock at the first tee says, not a UTC instant.
 */
export const calendarUrl = (receipt: TeeSelection & { confirmation?: string }): string => {
    const course = courseInfo(receipt.courseSlug);
    const duration = receipt.holes === 9 ? 135 : 255; // 2h15 for a nine, 4h15 for an eighteen
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: `Golf — ${course.name} (Montgomery County Golf)`,
        dates: `${stamp(receipt.isoDate, receipt.minutes)}/${stamp(receipt.isoDate, receipt.minutes + duration)}`,
        location: `${course.name} Golf Course, ${course.location}`,
        details: [
            `${receipt.holes} holes · ${receipt.players} ${receipt.players === 1 ? "golfer" : "golfers"}`,
            receipt.confirmation ? `Confirmation ${receipt.confirmation}` : "",
            "Check in at the pro shop 20 minutes before your tee time.",
        ]
            .filter(Boolean)
            .join("\n"),
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
