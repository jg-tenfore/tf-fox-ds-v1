/**
 * MCG Golf Academy roster — the real instructors, transcribed from mcggolf.com.
 *
 * Captured from the live Academy pages on **11 September 2026** (the per-course tabs
 * behind the course-logo strip at the top of every Academy page). This file is the
 * **source of truth for instructor identity** across the Fox prototype: names,
 * credentials, titles, which course or courses they teach at, and how you reach them.
 * Anywhere a screen needs a real MCG name on a lesson card, a coach picker, or a
 * booking confirmation, it should come from here rather than being invented locally.
 *
 * Three things about the real site shape this data, and are worth knowing before you
 * render it:
 *
 *  - **The Academy is organised by course, not by person.** Each course logo in the
 *    strip is a tab, and each tab lists its own instructors. An instructor who teaches
 *    at several courses is printed once per tab — Doug Hamilton appears on three tabs,
 *    Marty Johnson on two. Here they are a *single* entry whose `courseSlugs` carries
 *    every course their card names, so the roster is 23 people rather than 26 cards.
 *  - **Phone numbers belong to the course, not the instructor.** Every card at Falls
 *    Road prints (301) 299-5156; every card at Little Bennett prints (301) 253-1515.
 *    A few instructors publish a direct line instead (Shellie Ferguson, Dustin Stearns,
 *    Martin Zadravec). For the multi-course instructors the number recorded here is the
 *    one on the tab where they first appear; the alternates are noted on their entry.
 *  - **The site's own copy is preserved, typos and all.** The title "MCG Certifed
 *    Instructor" is misspelled on every card that uses it. `roleRaw` keeps exactly what
 *    is printed; `role` carries the corrected spelling, and is what screens should show.
 *
 * Nothing here is invented. Where the site prints no bio, `bio` is `null`; where a card
 * shows the grey placeholder avatar and the words "Coming Soon" instead of a headshot,
 * `comingSoon` is `true` and `photo` is `null`.
 *
 * Note on coverage: the Hampshire Greens tab was not captured in this pass, so no
 * Hampshire Greens instructors appear below even though the course is in the logo strip.
 */

/* ------------------------------------------------------------------ */
/* Courses                                                             */
/* ------------------------------------------------------------------ */

/**
 * The course-logo strip that sits at the top of every Academy page, in the order the
 * site renders it. Two of these — Rattlewood and Sligo Creek — are not yet part of
 * `mcgCourses` in `foundations/mcg/mcg-assets.ts`; their display names are recorded
 * here so they can be added there later without a second trip to the website.
 *
 * `logo` is the bare filename as downloaded from the site (cache-busting hash and all).
 * A later step wires these to real URLs, exactly as with `photo` below.
 */
import { asset } from "@/utils/asset";

export const ACADEMY_COURSE_LOGOS: { slug: string; name: string; logo: string }[] = [
    { slug: "falls-road", name: "Falls Road Golf Course", logo: "logo_falls_small-bd3eb7fc99031cdf424f76012855e939.png" },
    { slug: "hampshire-greens", name: "Hampshire Greens Golf Course", logo: "logo_hamp_small-8865be3370791e53fd56f2fdad05f247.png" },
    { slug: "laytonsville", name: "Laytonsville Golf Course", logo: "logo_layton_small-e925f6a715c6cb0b19817423370b865f.png" },
    { slug: "little-bennett", name: "Little Bennett Golf Course", logo: "logo_little_small-048ff103886fc7174c568cf09c4d3d0c.png" },
    { slug: "northwest", name: "Northwest Golf Course", logo: "logo_northwest_small-60fc5397cb3312d8ef06719db27791df.png" },
    { slug: "needwood", name: "Needwood Golf Course", logo: "logo_need_small-f3aa05d873f16451d9e4fd15180e4df5.png" },
    { slug: "crossvines", name: "Golf at The Crossvines", logo: "Crossvines_Golf_Logo-1e2df4655449578e2dc3c7228d699064.png" },
    { slug: "rattlewood", name: "Rattlewood Golf Course", logo: "logo_rattle_small-ebd2be4f19deb1d68a0c7b1d14c51dc3.png" },
    { slug: "sligo-creek", name: "Sligo Creek Golf Course", logo: "logo_squirell_small-761d67e3c4e33baa0d483696dd4f1f49.png" },
];

/** Course slugs in the site's logo-strip order — the order any course tab bar should use. */
export const ACADEMY_COURSE_ORDER: string[] = ACADEMY_COURSE_LOGOS.map((course) => course.slug);

/* ------------------------------------------------------------------ */
/* Instructors                                                         */
/* ------------------------------------------------------------------ */

/** One instructor card from the MCG Golf Academy pages. */
export interface AcademyInstructor {
    /** kebab-case slug of the name, e.g. "mike-kenny". Unique across the roster. */
    id: string;
    /** Printed name with the credential suffix stripped, e.g. "Mike Kenny". */
    name: string;
    /** The suffix after the name, exactly as printed, or `null` when the card shows none. */
    credential: "PGA" | "Master PGA" | "LPGA" | "GM" | null;
    /** The instructor's title, spelling corrected. This is the one to render. */
    role: string;
    /** The title exactly as the site prints it — including "MCG Certifed Instructor". */
    roleRaw: string;
    /** Every course the card lists, in the order it lists them. */
    courseSlugs: string[];
    email: string | null;
    /** As printed. Usually the course's number, occasionally a direct line. */
    phone: string | null;
    /** The card's body copy, when it has any. Most cards have none. */
    bio: string | null;
    /** True when the card shows the grey placeholder avatar and the words "Coming Soon". */
    comingSoon: boolean;
    /** Bare headshot filename from the Academy asset set; `null` when `comingSoon`. */
    photo: string | null;
}

/**
 * Every instructor on the Academy pages, in the site's own order: course tab by course
 * tab (see `ACADEMY_COURSE_ORDER`), and within a tab, card by card. Instructors who
 * appear on more than one tab are listed once, at their first appearance.
 */
export const ACADEMY_ROSTER: AcademyInstructor[] = [
    /* --- Falls Road Golf Course — nine cards, the largest staff in the county --- */
    {
        id: "mike-kenny",
        name: "Mike Kenny",
        credential: "PGA",
        role: "Director Of Instruction",
        roleRaw: "Director Of Instruction",
        courseSlugs: ["falls-road"],
        email: "mkenny@mcggolf.com",
        phone: "(301) 299-5156",
        bio: null,
        comingSoon: false,
        photo: "M.Kenny-BioPic.jpg",
    },
    {
        id: "brent-wilkerson",
        name: "Brent Wilkerson",
        credential: null,
        role: "MCG Lead Instructor",
        roleRaw: "MCG Lead Instructor",
        courseSlugs: ["falls-road"],
        email: "bwilkerson@mcggolf.com",
        phone: "(301) 299-5156",
        bio: null,
        comingSoon: false,
        photo: "Brent-Wilkerson-2022-Headshot.jpg",
    },
    {
        id: "jamie-vermilye",
        name: "Jamie Vermilye",
        credential: null,
        role: "MCG Certified Instructor",
        roleRaw: "MCG Certified Instructor",
        courseSlugs: ["falls-road"],
        email: "jvermilye@mcggolf.com",
        phone: "(301) 299-5156",
        bio: null,
        comingSoon: false,
        photo: "JamieV_FR.jpg",
    },
    {
        id: "john-ross",
        name: "John Ross",
        credential: null,
        role: "MCG Certified Instructor",
        roleRaw: "MCG Certified Instructor",
        courseSlugs: ["falls-road"],
        email: "jross@mcggolf.com",
        phone: "(301) 299-5156",
        bio: null,
        comingSoon: false,
        photo: "JohnRoss.png",
    },
    {
        id: "paul-mohun",
        name: "Paul Mohun",
        credential: null,
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        courseSlugs: ["falls-road"],
        email: "pmohun@mcggolf.com",
        phone: "(301) 299-5156",
        bio: null,
        comingSoon: false,
        photo: "PMohun.jpg",
    },
    {
        id: "nick-fisher",
        name: "Nick Fisher",
        credential: null,
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        courseSlugs: ["falls-road"],
        email: "nfisher@mcggolf.com",
        phone: "(301) 299-5156",
        bio: null,
        comingSoon: false,
        photo: "MCG-Golf-Academy_March-2025-Nick-Fisher-Headshot.jpg",
    },
    {
        id: "doug-hamilton",
        name: "Doug Hamilton",
        credential: "Master PGA",
        role: "MCG Certified Instructor",
        // Misspelled on all three of his cards.
        roleRaw: "MCG Certifed Instructor",
        // The county's one genuinely cross-course instructor: three tabs, three calendars.
        // His card orders the courses Laytonsville / Little Bennett / Falls Road, and that
        // order is kept here even though Falls Road is where he first appears.
        courseSlugs: ["laytonsville", "little-bennett", "falls-road"],
        email: "dhamilton@mcggolf.com",
        // Falls Road's number. His Laytonsville card prints (301) 948-5288 and his
        // Little Bennett card prints (301) 253-1515 — same instructor, the course's line.
        phone: "(301) 299-5156",
        bio: null,
        comingSoon: false,
        photo: "MicrosoftTeams-image_13.png",
    },
    {
        id: "ej-dillon",
        name: "EJ Dillon",
        credential: null,
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        courseSlugs: ["falls-road"],
        email: "edillon@mcggolf.com",
        phone: "(301) 299-5156",
        bio: null,
        comingSoon: false,
        photo: "MCG_EJ_Dillon_Headshot-.jpg",
    },
    {
        id: "kate-schanuel",
        name: "Kate Schanuel",
        credential: "LPGA",
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        courseSlugs: ["falls-road"],
        email: "kschanuel@mcggolf.com",
        phone: "(301) 299-5156",
        bio: null,
        comingSoon: false,
        photo: "kateschanuel.jpg",
    },

    /* --- Laytonsville Golf Course (Doug Hamilton leads this tab; see above) --- */
    {
        id: "brad-cameron",
        name: "Brad Cameron",
        credential: null,
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        courseSlugs: ["laytonsville"],
        email: "bcameron@mcggolf.com",
        phone: "(301) 948-5288",
        bio: null,
        comingSoon: false,
        photo: "B.Cameron.jpg",
    },
    {
        id: "shellie-ferguson",
        name: "Shellie Ferguson",
        credential: "PGA",
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        courseSlugs: ["laytonsville"],
        email: "sferguson@mcggolf.com",
        // A direct line, not Laytonsville's main number.
        phone: "(240) 793-6428",
        bio: null,
        comingSoon: false,
        photo: "Shellie_head_shot_Academy.jpeg",
    },

    /* --- Little Bennett Golf Course --- */
    {
        id: "mike-dickson",
        name: "Mike Dickson",
        credential: "Master PGA",
        role: "MCG Master Instructor",
        roleRaw: "MCG Master Instructor",
        courseSlugs: ["little-bennett"],
        email: "mdickson@mcggolf.com",
        phone: "(301) 253-1515",
        // The only card on the Academy pages that carries body copy.
        bio: "MCG Golf Academy would like to congratulate Master Instructor Mike Dickson for being named one of GOLF Magazine's TOP 100 Instructors in the country. To learn more about Mike or book a lesson check out the link below.",
        comingSoon: false,
        photo: "MIKE_DICKSON_headshot_HR_Yeatman_Photography__.jpeg",
    },
    {
        id: "jim-smithburger",
        name: "Jim Smithburger",
        credential: null,
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        courseSlugs: ["little-bennett"],
        // The placeholder card prints no contact details at all.
        email: null,
        phone: null,
        bio: null,
        comingSoon: true,
        photo: null,
    },
    {
        id: "matt-jarvis",
        name: "Matt Jarvis",
        credential: "GM",
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        // As printed: his card sits on the Little Bennett tab (and carries Little Bennett's
        // phone number) but names Laytonsville as the course he teaches at.
        courseSlugs: ["laytonsville"],
        email: "mjarvis@mcggolf.com",
        phone: "(301) 253-1515",
        bio: null,
        comingSoon: false,
        photo: "MCG_Jarvis_Low_Res_2012_1_of_1.jpg",
    },

    /* --- Northwest Golf Course (the tab heading reads "Northwest Golf Courses") --- */
    {
        id: "martin-zadravec",
        name: "Martin Zadravec",
        credential: null,
        role: "MCG Lead Instructor",
        roleRaw: "MCG Lead Instructor",
        courseSlugs: ["northwest"],
        email: "mzadravec@mcggolf.com",
        // A direct line, not Northwest's main number.
        phone: "(202) 297-2303",
        bio: null,
        comingSoon: false,
        photo: "Martin-Zadravec.jpg",
    },
    {
        id: "billy-cullum",
        name: "Billy Cullum",
        credential: "PGA",
        role: "MCG Certified Instructor",
        roleRaw: "MCG Certified Instructor",
        courseSlugs: ["northwest"],
        email: "bcullum@mcggolf.com",
        phone: "(301) 598-6100",
        bio: null,
        comingSoon: false,
        photo: "Billy_Cullum.jpg",
    },

    /* --- Needwood Golf Course --- */
    {
        id: "dustin-stearns",
        name: "Dustin Stearns",
        credential: "PGA",
        role: "MCG Master Instructor",
        roleRaw: "MCG Master Instructor",
        courseSlugs: ["needwood"],
        email: "dstearns@mcggolf.com",
        // A direct line, and the only out-of-area code on the roster.
        phone: "(407) 341-4070",
        bio: null,
        comingSoon: false,
        photo: "D.Stearns.jpg",
    },
    {
        id: "marty-johnson",
        name: "Marty Johnson",
        credential: "PGA",
        role: "MCG Master Instructor",
        roleRaw: "MCG Master Instructor",
        // Printed on his card as "Needwood/Golf at The Crossvines"; he is the whole of the
        // Crossvines tab.
        courseSlugs: ["needwood", "crossvines"],
        email: "mjohnson@mcggolf.com",
        phone: "(301) 793-0479",
        bio: null,
        comingSoon: false,
        photo: "Marty-Johnson.jpg",
    },
    {
        id: "blessing-jasi",
        name: "Blessing Jasi",
        credential: null,
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        courseSlugs: ["needwood"],
        email: "bjasi@mcggolf.com",
        phone: "(301) 948-1075",
        bio: null,
        comingSoon: false,
        photo: "Blessing_Headshot_Low_Res_1_of_1.jpg",
    },

    /* --- Golf at The Crossvines (Marty Johnson only; see above) --- */

    /* --- Rattlewood Golf Course --- */
    {
        id: "terry-charlton",
        name: "Terry Charlton",
        credential: null,
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        courseSlugs: ["rattlewood"],
        email: "tcharlton@mcggolf.com",
        phone: "(301) 607-9000",
        bio: null,
        comingSoon: false,
        // Note the filename's spelling; the site spells his name "Charlton".
        photo: "Terry_Charleton.jpg",
    },
    {
        id: "bob-coope",
        name: "Bob Coope",
        credential: null,
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        courseSlugs: ["rattlewood"],
        email: "bcoope@mcggolf.com",
        phone: "(301) 607-9000",
        bio: null,
        comingSoon: false,
        photo: "Bob_Coop.jpg",
    },
    {
        id: "brandon-jarvis",
        name: "Brandon Jarvis",
        credential: null,
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        courseSlugs: ["rattlewood"],
        email: "bjarvis@mcggolf.com",
        // Printed without parentheses on the site, unlike every other card.
        phone: "301-607-9000",
        bio: null,
        comingSoon: false,
        photo: "Brandon_Jarvis.jpg",
    },

    /* --- Sligo Creek Golf Course --- */
    {
        id: "dave-degirolamo",
        name: "Dave Degirolamo",
        credential: "GM",
        role: "MCG Academy Instructor",
        roleRaw: "MCG Academy Instructor",
        courseSlugs: ["sligo-creek"],
        email: "ddegirolamo@mcggolf.com",
        phone: "(301) 585-6006",
        bio: null,
        comingSoon: false,
        photo: "Dave-D.jpg",
    },
];

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

/** Every instructor who teaches at a course, in roster order. */
export const academyInstructorsAt = (courseSlug: string): AcademyInstructor[] =>
    ACADEMY_ROSTER.filter((instructor) => instructor.courseSlugs.includes(courseSlug));

/** One instructor by id. */
export const academyInstructor = (id: string): AcademyInstructor | undefined => ACADEMY_ROSTER.find((instructor) => instructor.id === id);

/** "Mike Kenny, PGA" — the name as the site's card heading prints it. */
export const academyDisplayName = (instructor: AcademyInstructor): string =>
    instructor.credential ? `${instructor.name}, ${instructor.credential}` : instructor.name;

/* ------------------------------------------------------------------ */
/* Imagery                                                             */
/* ------------------------------------------------------------------ */

/**
 * Headshots were copied out of the reference export, normalised to `<id>.jpg` and
 * compressed to 640px — a page of twenty-odd of them was 4.7 MB at source size. The
 * originals keep their odd names in `references/`; everything downstream addresses an
 * instructor by id and never needs to know them.
 */
export const instructorPhoto = (instructor: AcademyInstructor): string =>
    asset(`mcg-academy-images/${instructor.comingSoon ? "coming-soon" : instructor.id}.jpg`);

/** The MCG Golf Academy lockup, distinct from the MCG group mark. */
export const academyLogo = asset("mcg-academy-images/mcg-academy-logo.png");

/** The Academy page banner. */
export const academyBanner = asset("mcg-academy-images/academy-banner.jpg");
