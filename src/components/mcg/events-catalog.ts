/**
 * MCG county events & programs catalog — the fixture data behind the Events,
 * Calendar and Clinics tabs of the prototype.
 *
 * Three lists live here, and the split is deliberate:
 *
 *  1. **`MCG_EVENTS`** — dated county programming across all nine courses. Leagues,
 *     the county amateur, junior tour qualifiers, senior scrambles, couples nights,
 *     glow ball, charity scrambles, high-school blocks. A public muni system runs on
 *     a season calendar, not a one-off event feed, so every entry carries a course,
 *     a format, a capacity and a registration count — spots-left is derived, never
 *     stored, and a full event becomes a waitlist rather than a dead card.
 *  2. **`MCG_CLINICS`** — the county *clinic* program: Get Golf Ready, First Tee,
 *     Women on Course, Senior Swing & Stretch, the junior pathway. These are
 *     Parks-department programs, priced per series and aimed at people who are not
 *     yet golfers.
 *  3. **`ACADEMY_CLINICS`** — a thin *reference* to the group programs already
 *     modeled in `instruction-catalog`'s `GROUP_SERVICES`. Nothing is duplicated:
 *     these entries carry the real `LessonService` plus the one thing a calendar
 *     needs and a service doesn't — a start date — and every CTA routes to
 *     `/instruction`, which owns booking them.
 *
 * The Calendar tab unions all three (`CALENDAR_ENTRIES`), colour-coded by source.
 *
 * Imagery is the shared golf photo set at `events-images/event-1…7.png`.
 */

import type { FC } from "react";
import { Flag01, Gift01, Heart, Moon01, Trophy01, Users01 } from "@untitledui/icons";
import { COURSE_NAME, GROUP_SERVICES, type LessonService } from "@/components/instruction/instruction-catalog";
import { asset } from "@/utils/asset";

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Parse `YYYY-MM-DD` in UTC so a display date never shifts with the viewer's zone. */
const parts = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return { y, m: m - 1, d, weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
};

/** "Sat, Jul 18, 2026" — the long form used in headers and detail pages. */
export const fmtDate = (iso: string) => {
    const { y, m, d, weekday } = parts(iso);
    return `${WEEKDAYS[weekday]}, ${MONTHS_SHORT[m]} ${d}, ${y}`;
};

/** "Sat, Jul 18" — the short form used on cards and list rows. */
export const fmtDateShort = (iso: string) => {
    const { m, d, weekday } = parts(iso);
    return `${WEEKDAYS[weekday]}, ${MONTHS_SHORT[m]} ${d}`;
};

/** "2026-07" — the grouping key for the month filter. */
export const monthKey = (iso: string) => iso.slice(0, 7);

/** "July 2026" — the month filter's label. */
export const monthLabel = (key: string) => {
    const [y, m] = key.split("-").map(Number);
    return `${MONTHS_FULL[m - 1]} ${y}`;
};

/** The day the prototype pretends it is — start of the 2026 season. */
export const TODAY = "2026-06-12";

/* ------------------------------------------------------------------ */
/* Courses                                                             */
/* ------------------------------------------------------------------ */

/** Every MCG course, in the order the county lists them. Re-exported so the Events
 *  screens never reach past this module for a course name. */
export { COURSE_NAME };

export const COURSE_SLUGS = [
    "falls-road",
    "northwest",
    "hampshire-greens",
    "laytonsville",
    "little-bennett",
    "needwood",
    "crossvines",
    "rattlewood",
    "sligo-creek",
] as const;

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

export type EventCategory = "league" | "tournament" | "senior" | "junior" | "social" | "charity";

export interface McgEvent {
    id: string;
    title: string;
    category: EventCategory;
    /** ISO date of the event, or of the first night of a league. */
    isoDate: string;
    /** Display time, e.g. "5:30 PM shotgun" or "8:00 AM – 2:00 PM". */
    time: string;
    /** Which MCG course hosts it. */
    courseSlug: string;
    /** Where to check in on the property, e.g. "Pro shop". */
    location: string;
    /** Play format, e.g. "Two-person team match play, 9 holes". */
    format: string;
    /** Who runs it — the county, a course men's club, a charity partner. */
    organizer: string;
    /** Recurring-series note, e.g. "12-week league · Thursdays". */
    series?: string;
    /** Eligibility, e.g. "Age 55+" or "Ages 8–18". */
    eligibility?: string;
    price: number;
    /** Unit the price is charged in, e.g. "per player" or "per couple". */
    priceUnit: string;
    capacity: number;
    registered: number;
    description: string;
    /** "What's included" bullets. */
    included: string[];
    image: string;
    featured?: boolean;
}

const img = (n: number) => asset(`events-images/event-${n}.png`);

/** Chip label, icon and accent classes per category. Static class strings so Tailwind emits them. */
export const CATEGORY_UI: Record<EventCategory, { label: string; Icon: FC<{ className?: string }>; bg: string; fg: string; border: string; dot: string }> = {
    league: { label: "Leagues", Icon: Users01, bg: "bg-utility-blue-50", fg: "text-utility-blue-700", border: "border-utility-blue-500", dot: "bg-utility-blue-500" },
    tournament: { label: "Tournaments", Icon: Trophy01, bg: "bg-utility-purple-50", fg: "text-utility-purple-700", border: "border-utility-purple-500", dot: "bg-utility-purple-500" },
    senior: { label: "Senior golf", Icon: Flag01, bg: "bg-utility-amber-50", fg: "text-utility-amber-700", border: "border-utility-amber-500", dot: "bg-utility-amber-500" },
    junior: { label: "Junior golf", Icon: Gift01, bg: "bg-utility-pink-50", fg: "text-utility-pink-700", border: "border-utility-pink-500", dot: "bg-utility-pink-500" },
    social: { label: "Social nights", Icon: Moon01, bg: "bg-utility-indigo-50", fg: "text-utility-indigo-700", border: "border-utility-indigo-500", dot: "bg-utility-indigo-500" },
    charity: { label: "Charity", Icon: Heart, bg: "bg-utility-emerald-50", fg: "text-utility-emerald-700", border: "border-utility-emerald-500", dot: "bg-utility-emerald-500" },
};

export const CATEGORIES: EventCategory[] = ["league", "tournament", "senior", "junior", "social", "charity"];

export const MCG_EVENTS: McgEvent[] = [
    /* ---- June ------------------------------------------------------- */
    {
        id: "mens-league-falls-road",
        title: "Falls Road Men's Twilight League",
        category: "league",
        isoDate: "2026-06-04",
        time: "5:30 PM shotgun",
        courseSlug: "falls-road",
        location: "Pro shop — check in by 5:00 PM",
        format: "Two-man team, 9 holes, net better ball",
        organizer: "Falls Road Men's Club",
        series: "12-week league · Thursdays through Aug 20",
        eligibility: "Age 18+, any handicap",
        price: 180,
        priceUnit: "per player",
        capacity: 64,
        registered: 58,
        description:
            "The county's largest weekly men's league, played over twelve Thursday evenings on the back nine at Falls Road. Teams are flighted by handicap after week two, so a 22 index is playing other 22s. Weekly skins, a season-long points race, and a closing night cookout on the practice green.",
        included: ["12 weekly 9-hole rounds with cart", "USGA handicap posting each week", "Weekly skins and closest-to-pin", "Season points race and closing cookout"],
        image: img(6),
    },
    {
        id: "womens-league-needwood",
        title: "Needwood Women's 18-Hole League",
        category: "league",
        isoDate: "2026-06-09",
        time: "8:30 AM shotgun",
        courseSlug: "needwood",
        location: "Needwood starter's hut",
        format: "18 holes, individual net stroke play",
        organizer: "MCG Women's Golf Association",
        series: "14-week league · Tuesdays through Sep 8",
        eligibility: "Age 18+, established handicap helpful",
        price: 165,
        priceUnit: "per player",
        capacity: 48,
        registered: 31,
        description:
            "A Tuesday-morning league for women who want a full eighteen and a real card. Pairings rotate weekly so you play with someone new, scores post to your GHIN, and the season ends with a two-day member-member at Needwood.",
        included: ["14 weekly 18-hole rounds with cart", "Weekly pairings and scorecards", "GHIN posting and season standings", "End-of-season member-member entry"],
        image: img(2),
    },
    {
        id: "womens-9-league-hampshire",
        title: "Hampshire Greens Women's 9-Hole League",
        category: "league",
        isoDate: "2026-06-10",
        time: "5:45 PM shotgun",
        courseSlug: "hampshire-greens",
        location: "Hampshire Greens clubhouse",
        format: "9 holes, rotating team formats",
        organizer: "MCG Women's Golf Association",
        series: "10-week league · Wednesdays through Aug 12",
        eligibility: "Age 18+, beginners welcome",
        price: 130,
        priceUnit: "per player",
        capacity: 36,
        registered: 36,
        description:
            "A friendly Wednesday-evening nine built for players who are newer to league golf. Formats rotate week to week — scramble, best ball, alternate shot — so nobody carries a bad round alone, and a PGA professional walks the course each week to answer questions.",
        included: ["10 weekly 9-hole rounds with cart", "Rotating team formats", "On-course help from an MCG professional", "Weekly prizes and a closing dinner"],
        image: img(3),
    },
    {
        id: "demo-day-needwood",
        title: "MCG Demo Day & Club Fitting Fair",
        category: "social",
        isoDate: "2026-06-13",
        time: "9:00 AM – 3:00 PM",
        courseSlug: "needwood",
        location: "Needwood driving range",
        format: "Drop-in range event",
        organizer: "Montgomery County Golf",
        eligibility: "All ages, no registration required to attend",
        price: 0,
        priceUnit: "free",
        capacity: 200,
        registered: 118,
        description:
            "Hit next season's gear before you buy it. A dozen manufacturers set up on the Needwood range with full fitting carts, MCG professionals run launch-monitor sessions all day, and every county golfer gets a bucket of range balls on the house.",
        included: ["Free range balls all day", "Launch-monitor fitting sessions", "Trade-in valuations at the pro shop", "Junior try-a-club station"],
        image: img(5),
    },
    {
        id: "senior-scramble-laytonsville",
        title: "Laytonsville Senior Scramble",
        category: "senior",
        isoDate: "2026-06-15",
        time: "9:00 AM shotgun",
        courseSlug: "laytonsville",
        location: "Laytonsville pro shop",
        format: "Four-person scramble, 18 holes",
        organizer: "MCG Senior Golf Series",
        eligibility: "Age 55+",
        price: 42,
        priceUnit: "per player",
        capacity: 72,
        registered: 54,
        description:
            "Round one of the four-stop Senior Golf Series. Sign up alone and we will build your foursome, or bring your own. Forward tees, generous pace, and a hot lunch in the Laytonsville grill room afterward while the scores are read out.",
        included: ["18 holes with cart", "Foursome pairing if you enter solo", "Lunch in the grill room", "Series points toward the Senior Cup"],
        image: img(4),
    },
    {
        id: "after-work-nine-sligo",
        title: "Sligo Creek After-Work Nine",
        category: "league",
        isoDate: "2026-06-17",
        time: "6:00 PM tee times",
        courseSlug: "sligo-creek",
        location: "Starter's hut — check in by 5:45 PM",
        format: "Individual net stroke play, 9 holes",
        organizer: "Montgomery County Golf",
        series: "14-week league · Wednesdays through Sep 16",
        eligibility: "Age 18+, any handicap, no partner needed",
        price: 95,
        priceUnit: "per player",
        capacity: 40,
        registered: 34,
        description:
            "The county's inside-the-Beltway league, and the one you can get to from a desk in Silver Spring. Par 34 and walkable, so a full nine finishes inside two hours and nobody needs a cart. Sign up alone — the starter pairs you, and pairings rotate every week.",
        included: ["14 weekly 9-hole rounds, walking", "GHIN posting each week", "Weekly closest-to-pin on the 4th", "Closing night cookout at the window"],
        image: img(5),
    },
    {
        id: "couples-night-hampshire",
        title: "Couples Twilight Night",
        category: "social",
        isoDate: "2026-06-19",
        time: "5:00 PM shotgun",
        courseSlug: "hampshire-greens",
        location: "Hampshire Greens first tee",
        format: "Nine-hole couples scramble",
        organizer: "Montgomery County Golf",
        eligibility: "Two players per team, any pairing",
        price: 70,
        priceUnit: "per couple",
        capacity: 40,
        registered: 26,
        description:
            "An easy nine on a June evening with someone you like. Play a relaxed scramble from the combined tees, stop at the halfway house for a drink, and finish on the patio for dinner as the light goes. Teams do not have to be couples — partners, friends and parent-and-child pairs all play.",
        included: ["9 holes with cart", "Halfway-house drink", "Patio dinner for two", "Prizes for closest to the pin"],
        image: img(6),
    },
    {
        id: "junior-tour-q1-falls-road",
        title: "MCG Junior Tour — Qualifier I",
        category: "junior",
        isoDate: "2026-06-22",
        time: "8:00 AM – 1:00 PM",
        courseSlug: "falls-road",
        location: "Falls Road first tee",
        format: "18 holes, gross stroke play, three age divisions",
        organizer: "MCG Junior Golf",
        eligibility: "Ages 12–18, Montgomery County residents",
        price: 35,
        priceUnit: "per junior",
        capacity: 60,
        registered: 48,
        description:
            "The first of three qualifiers for the MCG Junior Tour Championship. Juniors play their own ball from division-appropriate tees with a rules official on course, and the low twelve in each division advance. Caddies are welcome; parents follow outside the ropes.",
        included: ["18 holes, walking or cart", "Rules officials on course", "Range balls before play", "Boxed lunch and scoreboard"],
        image: img(1),
    },
    {
        id: "charity-parks-falls-road",
        title: "Swing for the Parks Charity Scramble",
        category: "charity",
        isoDate: "2026-06-26",
        time: "1:00 PM shotgun",
        courseSlug: "falls-road",
        location: "Falls Road clubhouse",
        format: "Four-person scramble, 18 holes",
        organizer: "Montgomery Parks Foundation",
        price: 125,
        priceUnit: "per player",
        capacity: 100,
        registered: 84,
        description:
            "The Parks Foundation's flagship outing, and the single largest fundraiser for youth recreation programs in the county. Proceeds fund scholarships that put county kids through First Tee and junior camps at no cost to their families.",
        included: ["18 holes with cart", "Range balls and a tee gift", "On-course food and beverage stations", "Awards reception, raffle and silent auction"],
        image: img(2),
    },
    {
        id: "county-am-qualifier-needwood",
        title: "County Amateur Qualifier",
        category: "tournament",
        isoDate: "2026-06-27",
        time: "7:30 AM – 2:00 PM",
        courseSlug: "needwood",
        location: "Needwood first tee",
        format: "18 holes, gross stroke play",
        organizer: "Montgomery County Golf",
        eligibility: "Age 18+, handicap index 12.0 or better",
        price: 60,
        priceUnit: "per player",
        capacity: 80,
        registered: 71,
        description:
            "One round at Needwood decides the last forty spots in the County Amateur field. Exempt players — last year's top sixteen and the reigning junior champion — skip this one. Everyone else plays from the tips, ties for the last place settle on the card.",
        included: ["18 holes, walking or cart", "Range balls and practice green", "USGA rules officials", "Live scoring and exemption list"],
        image: img(4),
    },

    /* ---- July ------------------------------------------------------- */
    {
        id: "charity-veterans-northwest",
        title: "Salute Our Veterans Scramble",
        category: "charity",
        isoDate: "2026-07-04",
        time: "8:00 AM shotgun",
        courseSlug: "northwest",
        location: "Northwest clubhouse",
        format: "Four-person scramble, 18 holes",
        organizer: "Montgomery County Veterans Services",
        price: 85,
        priceUnit: "per player",
        capacity: 72,
        registered: 66,
        description:
            "An Independence Day morning scramble supporting county veterans' housing and employment services. Veterans and active-duty service members play at half entry; every foursome is paired with a veteran from the county's outreach program.",
        included: ["18 holes with cart", "Breakfast before the shotgun", "Half-price entry for veterans and active duty", "Awards and a flag ceremony on 18"],
        image: img(5),
    },
    {
        id: "senior-series-little-bennett",
        title: "Senior Golf Series — Round 2",
        category: "senior",
        isoDate: "2026-07-08",
        time: "9:00 AM shotgun",
        courseSlug: "little-bennett",
        location: "Little Bennett pro shop",
        format: "Two-person best ball, 18 holes",
        organizer: "MCG Senior Golf Series",
        eligibility: "Age 55+",
        price: 48,
        priceUnit: "per player",
        capacity: 60,
        registered: 47,
        description:
            "Round two moves to Little Bennett and switches to two-person best ball, which rewards the pair who can each keep one ball in play. Series points carry forward from Laytonsville; you do not have to have played round one to enter.",
        included: ["18 holes with cart", "Partner pairing if you enter solo", "Lunch after play", "Series points toward the Senior Cup"],
        image: img(3),
    },
    {
        id: "mens-club-medal-crossvines",
        title: "Crossvines Men's Club Monthly Medal",
        category: "league",
        isoDate: "2026-07-11",
        time: "7:00 AM – 1:00 PM",
        courseSlug: "crossvines",
        location: "The Crossvines pro shop",
        format: "18 holes, net and gross medal play",
        organizer: "Crossvines Men's Club",
        series: "Monthly · second Saturday, May through October",
        eligibility: "Men's club members, age 18+",
        price: 55,
        priceUnit: "per player",
        capacity: 72,
        registered: 44,
        description:
            "The Crossvines men's club plays a medal round on the second Saturday of every month, gross and net flights side by side. Non-members can enter as a guest once per season to see whether the club is for them.",
        included: ["18 holes with cart", "Gross and net flight prizes", "Club championship qualifying points", "Post-round lunch on the terrace"],
        image: img(7),
    },
    {
        id: "first-tee-family-needwood",
        title: "First Tee Family Golf Day",
        category: "junior",
        isoDate: "2026-07-11",
        time: "10:00 AM – 2:00 PM",
        courseSlug: "needwood",
        location: "Needwood practice facility",
        format: "Drop-in stations plus a family three-hole loop",
        organizer: "First Tee — Montgomery County",
        eligibility: "All ages — a child must be accompanied by an adult",
        price: 25,
        priceUnit: "per family",
        capacity: 50,
        registered: 18,
        description:
            "A morning designed to get a whole family onto a golf course for the first time. Rotate through putting, chipping and full-swing stations with First Tee coaches, then play a three-hole loop together with clubs we lend you.",
        included: ["Coached skill stations", "Loaner clubs for every family member", "Three-hole family loop", "Lunch and a First Tee starter kit"],
        image: img(1),
    },
    {
        id: "junior-tour-q2-little-bennett",
        title: "MCG Junior Tour — Qualifier II",
        category: "junior",
        isoDate: "2026-07-13",
        time: "8:00 AM – 1:00 PM",
        courseSlug: "little-bennett",
        location: "Little Bennett first tee",
        format: "18 holes, gross stroke play, three age divisions",
        organizer: "MCG Junior Golf",
        eligibility: "Ages 12–18, Montgomery County residents",
        price: 35,
        priceUnit: "per junior",
        capacity: 60,
        registered: 33,
        description:
            "The second qualifier, played over Little Bennett's rolling back nine. Juniors who advanced from Qualifier I may play again to improve their seed. The nine-hole division for ages 9–11 runs alongside the main field.",
        included: ["18 holes, walking or cart", "Nine-hole division for ages 9–11", "Rules officials on course", "Boxed lunch and scoreboard"],
        image: img(3),
    },
    {
        id: "senior-scramble-rattlewood",
        title: "North County Senior Scramble",
        category: "senior",
        isoDate: "2026-07-15",
        time: "8:30 AM shotgun",
        courseSlug: "rattlewood",
        location: "Rattlewood pro shop",
        format: "Four-person scramble, 18 holes",
        organizer: "Montgomery County Golf",
        eligibility: "Age 55+",
        price: 58,
        priceUnit: "per player",
        capacity: 72,
        registered: 44,
        description:
            "The senior series heads up to Mount Airy for the July stop. Rattlewood is wide and forgiving off the tee, which is exactly what a scramble wants, and the ridge keeps it a few degrees cooler than the rest of the county in mid-July. Enter as a four or as a single and we will build your team.",
        included: ["18 holes with cart", "Cart-side breakfast at check-in", "Flighted prizes and closest-to-pin", "Lunch on the pro shop deck"],
        image: img(1),
    },
    {
        id: "county-amateur-crossvines",
        title: "Montgomery County Amateur Championship",
        category: "tournament",
        isoDate: "2026-07-18",
        time: "7:00 AM – 5:00 PM, both days",
        courseSlug: "crossvines",
        location: "The Crossvines — tournament registration tent",
        format: "36 holes over two days, gross stroke play",
        organizer: "Montgomery County Golf",
        series: "Two-day championship · Jul 18–19",
        eligibility: "Age 18+, county residents, handicap index 12.0 or better",
        price: 135,
        priceUnit: "per player",
        capacity: 120,
        registered: 96,
        description:
            "The county's championship, and the one trophy every MCG golfer wants. Thirty-six holes over a Saturday and Sunday at The Crossvines, full USGA conditions, a cut to the low sixty after day one, and the winner's name added to a board that goes back to 1961.",
        included: ["36 holes of championship play with cart", "Practice round voucher for the week prior", "USGA rules officials and live scoring", "Tee gift, player dinner and awards ceremony"],
        image: img(2),
        featured: true,
    },
    {
        id: "glow-ball-laytonsville",
        title: "Glow Ball Night Golf",
        category: "social",
        isoDate: "2026-07-25",
        time: "9:00 PM shotgun",
        courseSlug: "laytonsville",
        location: "Laytonsville first tee",
        format: "Four-person glow scramble, 9 holes",
        organizer: "Montgomery County Golf",
        eligibility: "Age 16+ (under 18 with an adult in the group)",
        price: 45,
        priceUnit: "per player",
        capacity: 80,
        registered: 52,
        description:
            "Nine holes in the dark with glowing balls, lit flagsticks and a DJ on the tenth tee. The most oversubscribed night on the county calendar and, by a distance, the loudest. Bring a headlamp for reading putts.",
        included: ["9 holes under lights with cart", "Two glow balls and glow gear per player", "Late-night food truck", "Prizes for the best-lit foursome"],
        image: img(6),
        featured: true,
    },

    /* ---- August ----------------------------------------------------- */
    {
        id: "county-senior-am-hampshire",
        title: "County Senior Amateur",
        category: "senior",
        isoDate: "2026-08-03",
        time: "8:00 AM – 3:00 PM",
        courseSlug: "hampshire-greens",
        location: "Hampshire Greens tournament tent",
        format: "18 holes, gross stroke play, five-year age flights",
        organizer: "Montgomery County Golf",
        eligibility: "Age 55+, county residents",
        price: 95,
        priceUnit: "per player",
        capacity: 90,
        registered: 62,
        description:
            "One round at Hampshire Greens for the county senior title, flighted in five-year age bands so a 56-year-old is not chasing a 78-year-old. Super-senior and legends divisions play forward tees. Walking is permitted and encouraged.",
        included: ["18 holes with cart", "Age-flighted divisions", "Range balls and practice round rate", "Awards lunch in the clubhouse"],
        image: img(4),
    },
    {
        id: "junior-nine-series-sligo",
        title: "Junior Nine Series — Sligo Creek",
        category: "junior",
        isoDate: "2026-08-05",
        time: "8:00 AM – 11:00 AM",
        courseSlug: "sligo-creek",
        location: "Sligo Creek starter's hut",
        format: "9 holes, individual gross, age divisions",
        organizer: "MCG Junior Golf",
        eligibility: "Ages 8–14",
        price: 15,
        priceUnit: "per player",
        capacity: 48,
        registered: 29,
        description:
            "A first tournament that does not feel like one. Nine short holes, par 34, walked with a parent or a volunteer caddie, and a fifteen-dollar entry so the cost is never the reason a kid does not play. Two divisions by age; everyone finishes by lunch and everyone gets a card to keep.",
        included: ["9 holes, walking", "Volunteer caddie or parent walker", "Scorecard, pencil and a ball marker", "Popsicles at the window afterwards"],
        image: img(2),
    },
    {
        id: "couples-9-wine-crossvines",
        title: "Nine & Wine at The Crossvines",
        category: "social",
        isoDate: "2026-08-07",
        time: "5:30 PM shotgun",
        courseSlug: "crossvines",
        location: "The Crossvines winery terrace",
        format: "Nine-hole couples scramble",
        organizer: "The Crossvines",
        eligibility: "Age 21+, two players per team",
        price: 95,
        priceUnit: "per couple",
        capacity: 36,
        registered: 36,
        description:
            "The only MCG course with a working winery attached, used exactly as you would hope. Play a relaxed evening nine with tasting stations set up on three holes, then finish with a flight and dinner on the terrace overlooking the Ag Reserve.",
        included: ["9 holes with cart", "Three on-course tasting stations", "Wine flight and dinner on the terrace", "A bottle of the Crossvines estate red per team"],
        image: img(7),
    },
    {
        id: "senior-scramble-northwest",
        title: "Northwest Senior Scramble",
        category: "senior",
        isoDate: "2026-08-10",
        time: "9:00 AM shotgun",
        courseSlug: "northwest",
        location: "Northwest pro shop",
        format: "Four-person scramble, 18 holes",
        organizer: "MCG Senior Golf Series",
        eligibility: "Age 55+",
        price: 42,
        priceUnit: "per player",
        capacity: 72,
        registered: 22,
        description:
            "Round three of the Senior Golf Series, on Northwest's wide fairways — the friendliest walk in the county for anyone who would rather not take a cart. Scramble format again, and the series standings go up in the grill room afterward.",
        included: ["18 holes with cart, or walking rate", "Foursome pairing if you enter solo", "Lunch in the grill room", "Series points toward the Senior Cup"],
        image: img(5),
    },
    {
        id: "hs-preseason-hampshire",
        title: "MCPS Preseason Practice Block",
        category: "junior",
        isoDate: "2026-08-12",
        time: "3:30 PM – 6:30 PM",
        courseSlug: "hampshire-greens",
        location: "Hampshire Greens range and back nine",
        format: "Team practice — range block plus nine holes",
        organizer: "MCG Junior Golf with MCPS Athletics",
        series: "Weekly · Wednesdays, Aug 12 through Sep 16",
        eligibility: "MCPS high-school team members and hopefuls, grades 9–12",
        price: 12,
        priceUnit: "per player",
        capacity: 60,
        registered: 38,
        description:
            "County high-school teams get the Hampshire Greens back nine on Wednesday afternoons through the fall season. An hour on the range with an MCG professional, then nine holes at team pace. Open to any MCPS student trying out, not only rostered players.",
        included: ["Range block with an MCG professional", "Nine holes, walking", "Team scoring and stat tracking", "MCPS season eligibility check-in"],
        image: img(3),
    },
    {
        id: "county-fourball-rattlewood",
        title: "Montgomery County Four-Ball Championship",
        category: "tournament",
        isoDate: "2026-08-15",
        time: "7:30 AM – 4:00 PM",
        courseSlug: "rattlewood",
        location: "Rattlewood tournament tent, first tee",
        format: "Two-person team better ball, 18 holes gross and net",
        organizer: "Montgomery County Golf",
        eligibility: "Age 18+, established GHIN index required",
        price: 130,
        priceUnit: "per team",
        capacity: 60,
        registered: 47,
        description:
            "The county's team championship, and the one event on the calendar built for people who play their best golf with a partner. Gross and net flights run together off a two-tee start. Rattlewood's wide fairways and big greens reward an aggressive team — one of you can always take the tee on.",
        included: ["18 holes with cart", "Gross and net flights", "Rules officials on course", "Range balls and a boxed lunch at the turn"],
        image: img(6),
    },
    {
        id: "junior-tour-championship-crossvines",
        title: "MCG Junior Tour Championship",
        category: "junior",
        isoDate: "2026-08-17",
        time: "7:30 AM – 3:00 PM",
        courseSlug: "crossvines",
        location: "The Crossvines tournament tent",
        format: "18 holes, gross stroke play, three age divisions",
        organizer: "MCG Junior Golf",
        eligibility: "Qualified juniors from the 2026 tour, ages 12–18",
        price: 50,
        priceUnit: "per junior",
        capacity: 48,
        registered: 40,
        description:
            "The season finale for the junior tour, played on the county's toughest course. Division champions receive an exemption into the 2027 County Amateur and a spot on the Junior Cup team that plays Howard and Frederick counties in September.",
        included: ["18 holes of championship play", "Practice round the day before", "Player gift and tournament photo", "Awards banquet for players and families"],
        image: img(1),
    },
    {
        id: "glow-ball-little-bennett",
        title: "Glow Ball Night Golf",
        category: "social",
        isoDate: "2026-08-22",
        time: "8:45 PM shotgun",
        courseSlug: "little-bennett",
        location: "Little Bennett first tee",
        format: "Four-person glow scramble, 9 holes",
        organizer: "Montgomery County Golf",
        eligibility: "Age 16+ (under 18 with an adult in the group)",
        price: 45,
        priceUnit: "per player",
        capacity: 80,
        registered: 14,
        description:
            "The season's second glow night, moved north to Little Bennett where the tree line makes the whole thing considerably darker and considerably funnier. Same format, same food truck, fewer people who have done it before.",
        included: ["9 holes under lights with cart", "Two glow balls and glow gear per player", "Late-night food truck", "Prizes for the best-lit foursome"],
        image: img(6),
    },
    {
        id: "charity-manna-needwood",
        title: "Drive Out Hunger — Manna Food Center Scramble",
        category: "charity",
        isoDate: "2026-08-24",
        time: "12:30 PM shotgun",
        courseSlug: "needwood",
        location: "Needwood clubhouse",
        format: "Four-person scramble, 18 holes",
        organizer: "Manna Food Center",
        price: 110,
        priceUnit: "per player",
        capacity: 108,
        registered: 45,
        description:
            "Manna Food Center distributes food to roughly forty thousand county residents a year, and this outing funds a meaningful slice of it. Entry includes a case-of-food donation in your name; bring shelf-stable goods for the collection truck and your team starts one under.",
        included: ["18 holes with cart", "Lunch before the shotgun and dinner after", "A case-of-food donation in your name", "Raffle, auction and awards"],
        image: img(4),
    },
];

/* ------------------------------------------------------------------ */
/* County clinic program                                               */
/* ------------------------------------------------------------------ */

export type ClinicLevel = "New to golf" | "Beginner" | "Intermediate" | "Advanced" | "All levels";
export type ClinicAudience = "Juniors" | "Teens" | "Adults" | "Seniors" | "All ages";

export interface McgClinic {
    id: string;
    title: string;
    level: ClinicLevel;
    audience: ClinicAudience;
    /** ISO date of the first session. */
    isoDate: string;
    /** Display time of a session, e.g. "6:00 PM – 7:30 PM". */
    time: string;
    /** Human schedule, e.g. "Mondays from Jun 15". */
    schedule: string;
    sessions: number;
    courseSlug: string;
    /** Where the group meets, e.g. "Learning centre". */
    location: string;
    instructor: { name: string; title: string; initials: string; bio: string };
    price: number;
    priceUnit: string;
    capacity: number;
    registered: number;
    description: string;
    /** "What you'll learn" bullets. */
    learn: string[];
    /** Who it is and is not for. */
    prerequisites: string;
    bring: string[];
    provided: string[];
    image: string;
}

/** Badge colour per skill level, so the five read apart at a glance. */
export const LEVEL_COLOR: Record<ClinicLevel, "success" | "blue" | "indigo" | "purple" | "gray"> = {
    "New to golf": "success",
    Beginner: "blue",
    Intermediate: "indigo",
    Advanced: "purple",
    "All levels": "gray",
};

export const LEVELS: ClinicLevel[] = ["New to golf", "Beginner", "Intermediate", "Advanced", "All levels"];
export const AUDIENCES: ClinicAudience[] = ["Juniors", "Teens", "Adults", "Seniors", "All ages"];

const KAYLA = { name: "Kayla Ruiz", title: "MCG Program Coordinator, PGA", initials: "KR", bio: "Runs the county's beginner pathway across all nine courses. Eleven years coaching, PGA certified in Player Development, and the person who built Get Golf Ready in Montgomery County." };
const TERRENCE = { name: "Terrence Hobbs", title: "First Tee — Montgomery County, Head Coach", initials: "TH", bio: "Leads First Tee programming countywide and coaches the MCPS all-county team. Former college player; nine years running youth golf in the county." };
const DIANE = { name: "Diane Whitlock, PGA", title: "MCG Teaching Professional", initials: "DW", bio: "Teaches at Laytonsville and Needwood, with a practice built almost entirely around senior and returning golfers. Certified in golf fitness and adaptive instruction." };
const ANDRE = { name: "Andre Sills, PGA", title: "MCG Teaching Professional", initials: "AS", bio: "Hampshire Greens-based instructor working mostly with competitive juniors and tournament players. Coaches three MCPS teams in the fall." };

export const MCG_CLINICS: McgClinic[] = [
    {
        id: "ggr-northwest",
        title: "Get Golf Ready — Five-Week Starter",
        level: "New to golf",
        audience: "Adults",
        isoDate: "2026-06-15",
        time: "6:00 PM – 7:00 PM",
        schedule: "Mondays from Jun 15",
        sessions: 5,
        courseSlug: "northwest",
        location: "Northwest learning centre",
        instructor: KAYLA,
        price: 139,
        priceUnit: "for the series",
        capacity: 12,
        registered: 9,
        description:
            "The county's front door to golf, and the program we point every absolute beginner at. Five weeks takes you from never having held a club to playing nine holes — the last session is on the course, with a professional walking alongside you.",
        learn: ["Grip, stance and posture that hold up", "Making contact with iron, wedge and putter", "Chipping and putting well enough to finish a hole", "Pace of play, etiquette and how a round actually works"],
        prerequisites: "For adults who have never played, or have not played in a decade. No equipment and no experience needed.",
        bring: ["Athletic shoes with a flat sole", "Water and a hat", "Nothing else"],
        provided: ["A full set of loaner clubs", "All range balls", "Nine holes on the final week, cart included"],
        image: img(7),
    },
    {
        id: "ggr-needwood",
        title: "Get Golf Ready — Five-Week Starter",
        level: "New to golf",
        audience: "Adults",
        isoDate: "2026-07-08",
        time: "6:00 PM – 7:00 PM",
        schedule: "Wednesdays from Jul 8",
        sessions: 5,
        courseSlug: "needwood",
        location: "Needwood learning centre",
        instructor: KAYLA,
        price: 139,
        priceUnit: "for the series",
        capacity: 12,
        registered: 12,
        description:
            "The same five-week beginner series, run at Needwood on Wednesday evenings. This session fills first every summer because Needwood is the easiest course in the county to get to on the Red Line — join the waitlist and we will call as soon as a spot opens.",
        learn: ["Grip, stance and posture that hold up", "Making contact with iron, wedge and putter", "Chipping and putting well enough to finish a hole", "Pace of play, etiquette and how a round actually works"],
        prerequisites: "For adults who have never played, or have not played in a decade. No equipment and no experience needed.",
        bring: ["Athletic shoes with a flat sole", "Water and a hat", "Nothing else"],
        provided: ["A full set of loaner clubs", "All range balls", "Nine holes on the final week, cart included"],
        image: img(5),
    },
    {
        id: "women-on-course-falls-road",
        title: "Women on Course — Play Your First Nine",
        level: "Beginner",
        audience: "Adults",
        isoDate: "2026-06-18",
        time: "6:00 PM – 7:30 PM",
        schedule: "Thursdays from Jun 18",
        sessions: 4,
        courseSlug: "falls-road",
        location: "Falls Road practice facility",
        instructor: KAYLA,
        price: 119,
        priceUnit: "for the series",
        capacity: 16,
        registered: 11,
        description:
            "Four Thursday evenings for women who can hit a ball on the range but have never felt ready to walk onto a first tee. The point of this clinic is the fourth week, when the group plays nine holes together and discovers it was never that hard.",
        learn: ["Choosing a club and committing to the shot", "Keeping a ball in play off the tee", "Picking up, dropping and moving on without panic", "Reading a scorecard and keeping pace in a group"],
        prerequisites: "You can make contact on the range. You have not played much, or any, on-course golf.",
        bring: ["Your clubs if you have them", "Golf or athletic shoes", "A friend, if it helps"],
        provided: ["Loaner clubs on request", "Range balls each week", "Nine holes on the final week, cart included"],
        image: img(2),
    },
    {
        id: "senior-swing-laytonsville",
        title: "Senior Swing & Stretch",
        level: "All levels",
        audience: "Seniors",
        isoDate: "2026-06-16",
        time: "10:00 AM – 11:00 AM",
        schedule: "Tuesdays from Jun 16",
        sessions: 6,
        courseSlug: "laytonsville",
        location: "Laytonsville range",
        instructor: DIANE,
        price: 99,
        priceUnit: "for the series",
        capacity: 20,
        registered: 14,
        description:
            "Six Tuesday mornings built around the swing you have now rather than the one you had at forty. Fifteen minutes of mobility work, forty-five minutes of instruction, and an honest conversation about which clubs are still worth carrying.",
        learn: ["A warm-up that protects your back and hips", "Getting speed back without more effort", "Making a shorter turn work for you", "Picking a set of clubs that matches your distances"],
        prerequisites: "Age 55 and up, any ability. Every drill has a seated or reduced-range version.",
        bring: ["Your own clubs", "Comfortable shoes", "Water"],
        provided: ["Range balls each week", "Mobility bands", "A printed distance chart at the end"],
        image: img(4),
    },
    {
        id: "first-tee-summer-northwest",
        title: "First Tee — Montgomery County Summer Session",
        level: "New to golf",
        audience: "Juniors",
        isoDate: "2026-06-23",
        time: "4:30 PM – 6:00 PM",
        schedule: "Tuesdays from Jun 23",
        sessions: 7,
        courseSlug: "northwest",
        location: "Northwest learning centre",
        instructor: TERRENCE,
        price: 95,
        priceUnit: "for the series",
        capacity: 40,
        registered: 34,
        description:
            "Seven weeks of the national First Tee curriculum, run by county coaches at Northwest. Golf is the vehicle; the curriculum is about judgement, perseverance and how you carry yourself. Scholarships cover the full fee for any family that asks — nobody is turned away.",
        learn: ["Full-swing, chipping and putting fundamentals", "The nine First Tee core values, on and off the course", "Playing three holes safely and at pace", "Setting a goal and tracking it across the session"],
        prerequisites: "Ages 7–14. No experience or equipment necessary. Scholarships available on request at registration.",
        bring: ["Sneakers", "A water bottle", "Sunscreen"],
        provided: ["Junior loaner clubs", "All balls and tees", "A First Tee shirt and certificate"],
        image: img(1),
    },
    {
        id: "junior-pathway-little-bennett",
        title: "Junior Pathway — Level 2",
        level: "Intermediate",
        audience: "Juniors",
        isoDate: "2026-06-20",
        time: "9:00 AM – 10:30 AM",
        schedule: "Saturdays from Jun 20",
        sessions: 8,
        courseSlug: "little-bennett",
        location: "Little Bennett short-game area",
        instructor: TERRENCE,
        price: 149,
        priceUnit: "for the series",
        capacity: 18,
        registered: 12,
        description:
            "The next step for juniors who have finished First Tee or a starter clinic and can already get around a few holes. Eight Saturday mornings that move from the range to the course, ending with the group playing nine holes and keeping a real score.",
        learn: ["Shaping a reliable full swing", "Short game from three lies", "Keeping a legitimate scorecard", "Preparing for a first junior tour event"],
        prerequisites: "Ages 9–14 who have completed a beginner program or can play three holes unassisted.",
        bring: ["Your own junior clubs", "Golf shoes", "Water and a snack"],
        provided: ["Range and short-game balls", "Nine holes on weeks six and eight", "Junior tour entry guidance"],
        image: img(3),
    },
    {
        id: "play-nine-sligo",
        title: "Play Nine — Your First Round",
        level: "New to golf",
        audience: "Adults",
        isoDate: "2026-06-24",
        time: "6:00 PM – 7:30 PM",
        schedule: "Wednesdays from Jun 24",
        sessions: 4,
        courseSlug: "sligo-creek",
        location: "Sligo Creek starter's hut",
        instructor: KAYLA,
        price: 89,
        priceUnit: "for the series",
        capacity: 12,
        registered: 7,
        description:
            "The cheapest way into golf the county runs, on the course that makes it possible. Sligo Creek is nine short holes inside the Beltway — par 34, no cart, ninety minutes — so every session is played on real holes rather than a mat. Four Wednesdays takes you from the first tee to finishing a card.",
        learn: ["Getting the ball airborne with a short iron", "Chipping and putting out, every hole", "Reading a scorecard and keeping your own score", "Pace, etiquette and where to stand"],
        prerequisites: "For adults who have never played a hole. Loaner clubs provided; nothing to buy first.",
        bring: ["Flat-soled shoes", "Water", "Nothing else"],
        provided: ["Loaner clubs each week", "Green fee for all four nines", "A scorecard from the last week to keep"],
        image: img(5),
    },
    {
        id: "teen-tour-prep-hampshire",
        title: "Teen Tour Prep — Tournament Ready",
        level: "Advanced",
        audience: "Teens",
        isoDate: "2026-06-28",
        time: "3:00 PM – 5:00 PM",
        schedule: "Sundays from Jun 28",
        sessions: 6,
        courseSlug: "hampshire-greens",
        location: "Hampshire Greens tournament tees",
        instructor: ANDRE,
        price: 189,
        priceUnit: "for the series",
        capacity: 12,
        registered: 10,
        description:
            "Six Sundays aimed squarely at the MCG Junior Tour and the MCPS fall season. Half of each session is on the course under tournament conditions — play it as it lies, hole everything out, keep an official card — because that is the part range practice never covers.",
        learn: ["Pre-round preparation and a warm-up that works", "Course management under a real card", "Rules situations juniors actually hit", "Recovering from a double without losing the round"],
        prerequisites: "Ages 13–18 shooting roughly 90 or better for 18 holes. Bring a recent scorecard to the first session.",
        bring: ["Your full set", "Golf shoes and rain gear", "A rangefinder if you own one"],
        provided: ["Range balls and practice green access", "Nine tournament holes each week", "A USGA rules pocket guide"],
        image: img(2),
    },
    {
        id: "family-saturday-rattlewood",
        title: "Saturday Family Golf — North County",
        level: "Beginner",
        audience: "All ages",
        isoDate: "2026-07-11",
        time: "9:00 AM – 10:30 AM",
        schedule: "Saturdays from Jul 11",
        sessions: 6,
        courseSlug: "rattlewood",
        location: "Rattlewood range and short-game area",
        instructor: TERRENCE,
        price: 120,
        priceUnit: "per family, any size",
        capacity: 10,
        registered: 6,
        description:
            "One price for a whole family, six Saturday mornings at Rattlewood. Adults and kids work the same station together rather than being split up, and the last two weeks move onto the course for three holes as a group. Built for the up-county families who are furthest from everything else the department runs.",
        learn: ["A grip and swing that works at any size", "Putting and chipping as a family game", "Three holes together, at your own pace", "How to practise at home for twenty minutes a week"],
        prerequisites: "Any family with at least one child aged 6 or older. No experience needed from anybody.",
        bring: ["Sunscreen and water", "Any clubs you already own"],
        provided: ["Junior and adult loaner clubs", "All range balls", "Three holes on the final two weeks"],
        image: img(1),
    },
    {
        id: "short-game-school-needwood",
        title: "Saturday Short Game School",
        level: "All levels",
        audience: "Adults",
        isoDate: "2026-07-11",
        time: "9:00 AM – 11:00 AM",
        schedule: "One Saturday morning",
        sessions: 1,
        courseSlug: "needwood",
        location: "Needwood short-game area",
        instructor: DIANE,
        price: 45,
        priceUnit: "per player",
        capacity: 16,
        registered: 6,
        description:
            "Two hours inside forty yards, which is where most county golfers give away the majority of their strokes. One session, no series commitment, and you leave with three shots you can actually repeat.",
        learn: ["A single chipping motion for most lies", "The pitch you can trust from thirty yards", "Getting out of a greenside bunker every time", "Speed control on Needwood's slower greens"],
        prerequisites: "Any ability. Genuinely useful whether you shoot 78 or 118.",
        bring: ["Your wedges and putter", "Golf shoes"],
        provided: ["Short-game and bunker balls", "Loaner wedges on request", "A one-page practice plan"],
        image: img(4),
    },
    {
        id: "rules-handicap-falls-road",
        title: "Rules & Handicap Workshop",
        level: "All levels",
        audience: "All ages",
        isoDate: "2026-07-22",
        time: "6:00 PM – 7:30 PM",
        schedule: "One Wednesday evening",
        sessions: 1,
        courseSlug: "falls-road",
        location: "Falls Road clubhouse meeting room",
        instructor: KAYLA,
        price: 20,
        priceUnit: "per person",
        capacity: 30,
        registered: 17,
        description:
            "Ninety minutes that will save you an argument. A county rules official walks through the situations that actually come up in league and tournament play, then shows you how to set up a GHIN handicap and post a score correctly.",
        learn: ["Relief procedures you will genuinely use", "Penalty areas, out of bounds and the provisional", "Setting up and maintaining a GHIN index", "How net scoring and flighting work in MCG events"],
        prerequisites: "Anyone playing in a county league, tournament or junior event. No golf played on the night.",
        bring: ["A notebook, if you are that sort"],
        provided: ["Printed rules reference", "GHIN sign-up help on the spot", "Coffee and dessert"],
        image: img(6),
    },
    {
        id: "adaptive-open-crossvines",
        title: "Adaptive Golf Open Clinic",
        level: "All levels",
        audience: "All ages",
        isoDate: "2026-08-08",
        time: "10:00 AM – 12:00 PM",
        schedule: "One Saturday morning",
        sessions: 1,
        courseSlug: "crossvines",
        location: "The Crossvines practice facility",
        instructor: DIANE,
        price: 0,
        priceUnit: "free",
        capacity: 24,
        registered: 9,
        description:
            "A free open clinic for golfers with a physical or cognitive disability, and for anyone curious whether golf is available to them. Adaptive carts, single-rider seats and modified clubs are on hand; coaches work one-to-one at whatever pace suits.",
        learn: ["Setups that work seated, standing or supported", "Swinging with one arm or limited rotation", "Using a single-rider adaptive cart on course", "What county adaptive league play looks like"],
        prerequisites: "Open to all abilities and all ages. Carers and family are welcome to take part or watch.",
        bring: ["Whatever equipment you already use", "Comfortable clothing"],
        provided: ["Adaptive carts and single-rider seats", "Modified and loaner clubs", "One-to-one coaching, free of charge"],
        image: img(7),
    },
    {
        id: "league-ready-crossvines",
        title: "League Ready — Play Nine with a Pro",
        level: "Intermediate",
        audience: "Adults",
        isoDate: "2026-07-17",
        time: "5:30 PM – 8:00 PM",
        schedule: "Fridays from Jul 17",
        sessions: 4,
        courseSlug: "crossvines",
        location: "The Crossvines first tee",
        instructor: ANDRE,
        price: 129,
        priceUnit: "for the series",
        capacity: 12,
        registered: 12,
        description:
            "Four Friday evenings playing nine holes with a professional in the group, aimed at golfers who want to join a county league next season and are not sure they are ready. All coaching happens on the course, in the moment, on the shot you just hit.",
        learn: ["Playing to a pace a league expects", "Managing the card when a hole goes wrong", "League formats — best ball, scramble, alternate shot", "Where your handicap actually comes from"],
        prerequisites: "You can play nine holes and finish most holes. Roughly a 100–120 scorer for 18.",
        bring: ["Your full set", "Golf shoes", "Enough balls for nine holes"],
        provided: ["Nine holes with cart each week", "On-course coaching", "A league placement recommendation at the end"],
        image: img(5),
    },
    {
        id: "hs-skills-camp-little-bennett",
        title: "High School Skills Camp",
        level: "Advanced",
        audience: "Teens",
        isoDate: "2026-08-10",
        time: "8:00 AM – 12:00 PM",
        schedule: "Mon–Thu, Aug 10–13",
        sessions: 4,
        courseSlug: "little-bennett",
        location: "Little Bennett range and course",
        instructor: ANDRE,
        price: 175,
        priceUnit: "for the camp",
        capacity: 20,
        registered: 13,
        description:
            "Four mornings the week before MCPS tryouts, run by the coach of three county high-school teams. Full swing and short game in the morning block, nine holes at match pace after, and a tryout-format qualifying round on the Thursday.",
        learn: ["Tryout-day nerves and how to warm up for them", "Playing nine holes at match pace", "Match play tactics against a stronger opponent", "Building a two-week practice plan for the season"],
        prerequisites: "Grades 9–12 trying out for an MCPS team. Roughly 45 or better for nine holes.",
        bring: ["Your full set", "Golf shoes and rain gear", "A packed lunch for Thursday"],
        provided: ["Range balls each morning", "Nine holes daily with cart", "A written evaluation to hand your coach"],
        image: img(3),
    },
];

/* ------------------------------------------------------------------ */
/* Academy-led clinics (referenced, never duplicated)                  */
/* ------------------------------------------------------------------ */

/**
 * Start date and session time for each `GROUP_SERVICES` program. A `LessonService`
 * carries a human schedule string ("Thursdays 6:00 PM, from Jun 25") because the
 * Instruction flow only ever shows it; a calendar needs a real date, so the mapping
 * lives here rather than being parsed out of prose at render time.
 */
const ACADEMY_START: Record<string, { isoDate: string; time: string }> = {
    "clinic-adult-l2": { isoDate: "2026-06-25", time: "6:00 PM – 7:00 PM" },
    "clinic-scoring": { isoDate: "2026-06-27", time: "9:00 AM – 11:00 AM" },
    "clinic-launch-lab": { isoDate: "2026-06-24", time: "5:30 PM – 7:00 PM" },
    "clinic-get-golf-ready": { isoDate: "2026-06-23", time: "6:00 PM – 7:00 PM" },
    "clinic-junior-first": { isoDate: "2026-06-20", time: "10:00 AM – 11:00 AM" },
    "camp-junior-summer": { isoDate: "2026-07-13", time: "9:00 AM – 12:00 PM" },
    "clinic-wedge": { isoDate: "2026-06-28", time: "1:00 PM – 3:00 PM" },
};

export interface AcademyClinic {
    /** The real service — booking, pricing and capacity all still belong to Instruction. */
    service: LessonService;
    isoDate: string;
    time: string;
}

/** Academy group programs, dated for the calendar. Every CTA routes to `/instruction`. */
export const ACADEMY_CLINICS: AcademyClinic[] = GROUP_SERVICES.filter((s) => ACADEMY_START[s.id]).map((service) => ({
    service,
    ...ACADEMY_START[service.id],
}));

/* ------------------------------------------------------------------ */
/* Derived helpers                                                     */
/* ------------------------------------------------------------------ */

export const eventById = (id: string): McgEvent | undefined => MCG_EVENTS.find((e) => e.id === id);
export const clinicById = (id: string): McgClinic | undefined => MCG_CLINICS.find((c) => c.id === id);

/** Spots left is always derived — a catalog that stores it drifts the moment anyone registers. */
export const spotsLeft = (item: { capacity: number; registered: number }) => Math.max(0, item.capacity - item.registered);
export const isFull = (item: { capacity: number; registered: number }) => spotsLeft(item) === 0;

/** Every month that has programming, oldest first — drives the month filter. */
export const EVENT_MONTHS: string[] = [...new Set(MCG_EVENTS.map((e) => monthKey(e.isoDate)))].sort();

export const money0 = (n: number) => (n === 0 ? "Free" : `$${Math.round(n)}`);

/* ---- the unified calendar feed ---- */

export type EntryType = "event" | "clinic" | "academy";

/** Colour and label per calendar source. Static classes so Tailwind emits them. */
export const ENTRY_UI: Record<EntryType, { label: string; bg: string; fg: string; border: string; dot: string }> = {
    event: { label: "Events", bg: "bg-utility-blue-50", fg: "text-utility-blue-700", border: "border-utility-blue-500", dot: "bg-utility-blue-500" },
    clinic: { label: "County clinics", bg: "bg-utility-emerald-50", fg: "text-utility-emerald-700", border: "border-utility-emerald-500", dot: "bg-utility-emerald-500" },
    academy: { label: "Golf Academy", bg: "bg-utility-purple-50", fg: "text-utility-purple-700", border: "border-utility-purple-500", dot: "bg-utility-purple-500" },
};

export interface CalendarEntry {
    key: string;
    type: EntryType;
    title: string;
    isoDate: string;
    time: string;
    courseSlug: string;
    /** Sub-line on a list row — format for an event, schedule for a clinic. */
    detail: string;
    price: number;
    /** Where clicking it goes. Academy entries leave the Events section for `/instruction`. */
    href: string;
}

/** First clock time in a display time string — "5:30 PM shotgun" → "5:30 PM". */
export const startTime = (time: string) => time.split(/\s+–\s+/)[0].replace(/\s*(shotgun|start)$/i, "");

/**
 * Everything happening across the nine courses, from all three sources, sorted by
 * date then time. This is the whole point of the Calendar tab: a golfer does not
 * care which internal system owns a Tuesday evening.
 */
export const CALENDAR_ENTRIES: CalendarEntry[] = [
    ...MCG_EVENTS.map<CalendarEntry>((e) => ({
        key: `event-${e.id}`,
        type: "event",
        title: e.title,
        isoDate: e.isoDate,
        time: e.time,
        courseSlug: e.courseSlug,
        detail: e.format,
        price: e.price,
        href: `/events/${e.id}`,
    })),
    ...MCG_CLINICS.map<CalendarEntry>((c) => ({
        key: `clinic-${c.id}`,
        type: "clinic",
        title: c.title,
        isoDate: c.isoDate,
        time: c.time,
        courseSlug: c.courseSlug,
        detail: `${c.schedule} · ${c.sessions} ${c.sessions === 1 ? "session" : "sessions"}`,
        price: c.price,
        href: `/clinics/${c.id}`,
    })),
    ...ACADEMY_CLINICS.map<CalendarEntry>(({ service, isoDate, time }) => ({
        key: `academy-${service.id}`,
        type: "academy",
        title: service.name,
        isoDate,
        time,
        courseSlug: service.courseSlug ?? "falls-road",
        detail: service.meta,
        price: service.basePrice,
        href: "/instruction",
    })),
].sort((a, b) => a.isoDate.localeCompare(b.isoDate) || a.time.localeCompare(b.time));

/** Months the calendar can page through, oldest first. */
export const CALENDAR_MONTHS: string[] = [...new Set(CALENDAR_ENTRIES.map((e) => monthKey(e.isoDate)))].sort();
