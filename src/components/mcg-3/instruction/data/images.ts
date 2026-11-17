/**
 * Instruction imagery, served from `images/mcg-academy/` (`mcg-academy-images/…` in Storybook,
 * the P3 app and the Pages build — always through `asset()`, never a root-absolute path).
 *
 * - Headshots: `mcg-academy-images/<instructor-id>.jpg`, the MCG Golf Academy's public profile
 *   photos; `coming-soon.jpg` is the Academy's placeholder.
 * - Academy lockup, banner and two real MCG photos (`academy-lesson.webp`, `academy-range.webp`).
 * - Program art (`mcg-academy-images/programs/<art>-card.webp` / `-banner.webp`): the event art
 *   the Crane MCG prototype uses for each program and category tile, copied into Fox.
 */
import { asset } from "@/utils/asset";

const HEADSHOT_IDS = new Set([
    "billy-cullum", "blessing-jasi", "bob-coope", "brad-cameron", "brandon-jarvis", "brent-wilkerson", "dave-degirolamo", "doug-hamilton",
    "dustin-stearns", "ej-dillon", "jamie-vermilye", "john-ross", "kate-schanuel", "martin-zadravec", "marty-johnson", "matt-jarvis",
    "mike-dickson", "mike-kenny", "nick-fisher", "paul-mohun", "shellie-ferguson", "terry-charlton",
]);

const ART_IDS = new Set([
    "driver-distance-clinic", "short-game-series", "club-fitting-demo-day", "golf-101", "junior-fall-academy", "junior-halloween-chip-putt", "putting-lab",
    "ladies-9-hole-league", "senior-mens-league", "playing-lesson", "club-championship-finals", "member-guest-invitational", "couples-twilight-league", "long-drive-ctp",
]);

/** The MCG Golf Academy lockup (graduation cap + golfers). */
export const academyLogo = asset("mcg-academy-images/mcg-academy-logo.png");
/** The Academy page banner (an aerial green). */
export const academyBanner = asset("mcg-academy-images/academy-banner.jpg");
/** A real MCG lesson on the range (portrait). */
export const academyLessonPhoto = asset("mcg-academy-images/academy-lesson.webp");
/** A real MCG driving range (landscape). */
export const academyRangePhoto = asset("mcg-academy-images/academy-range.webp");

/** The Academy's placeholder for an instructor whose photo isn't published yet. */
export const COMING_SOON_PHOTO = asset("mcg-academy-images/coming-soon.jpg");

/** A headshot by instructor id, or undefined when there isn't one. */
export const headshotFor = (id: string): string | undefined => (HEADSHOT_IDS.has(id) ? asset(`mcg-academy-images/${id}.jpg`) : undefined);

/** Card (3:2) and banner (21:9) art for an event-art id, e.g. "golf-101". */
export const eventArt = (artId: string): { image?: string; banner?: string } =>
    ART_IDS.has(artId) ? { image: asset(`mcg-academy-images/programs/${artId}-card.webp`), banner: asset(`mcg-academy-images/programs/${artId}-banner.webp`) } : {};

/**
 * Which piece of Crane event art stands in for each group program (Academy programs and
 * county clinics, by Fox id). Fox used a shared set of seven generic photos.
 */
const PROGRAM_ART: Record<string, string> = {
    // Academy programs
    "clinic-adult-l2": "driver-distance-clinic",
    "clinic-3wk-nov": "driver-distance-clinic",
    "clinic-scoring": "short-game-series",
    "clinic-launch-lab": "club-fitting-demo-day",
    "clinic-get-golf-ready": "golf-101",
    "clinic-junior-first": "junior-fall-academy",
    "camp-junior-summer": "junior-halloween-chip-putt",
    "clinic-wedge": "putting-lab",
    // County clinics
    "junior-league-northwest": "junior-fall-academy",
    "op36-little-bennett": "junior-halloween-chip-putt",
    "junior-camp-needwood": "junior-fall-academy",
    "girls-golf-needwood": "junior-halloween-chip-putt",
    "ggr-northwest": "golf-101",
    "ggr-needwood": "golf-101",
    "women-on-course-falls-road": "ladies-9-hole-league",
    "senior-swing-laytonsville": "senior-mens-league",
    "first-tee-summer-northwest": "junior-fall-academy",
    "junior-pathway-little-bennett": "junior-halloween-chip-putt",
    "play-nine-sligo": "playing-lesson",
    "teen-tour-prep-hampshire": "club-championship-finals",
    "family-saturday-rattlewood": "golf-101",
    "short-game-school-needwood": "short-game-series",
    "rules-handicap-falls-road": "member-guest-invitational",
    "adaptive-open-crossvines": "playing-lesson",
    "league-ready-crossvines": "couples-twilight-league",
    "hs-skills-camp-little-bennett": "long-drive-ctp",
};

/** Card + banner art for a program id (falls back to the range photo). */
export const programArt = (programId: string): { image: string; banner: string } => {
    const art = eventArt(PROGRAM_ART[programId] ?? "");
    return { image: art.image ?? academyRangePhoto, banner: art.banner ?? art.image ?? academyRangePhoto };
};
