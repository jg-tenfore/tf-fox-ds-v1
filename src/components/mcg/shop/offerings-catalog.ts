/**
 * MCG Pro Shop — the non-physical shelf.
 *
 * The Shop is being tightened to a single rule: nothing appears without a real product
 * photograph. Physical goods we can't photograph are dropped rather than dressed in a
 * borrowed stock shot. That rule has one honest exception — the things a county golf
 * system sells that were never objects in the first place. A gift card, a lesson pack, a
 * range punch card, a season pass, a regrip, a locker: there is no photograph to take.
 * Those carry `logoTile: true` and `mcgLogo: true`, so the storefront renders the MCG
 * mark on the green brand panel instead of an image, and they sit on the MCG-logo shelf
 * alongside the badged merchandise.
 *
 * Everything here is priced off data that already exists rather than invented alongside
 * it, so the Shop, the Academy and the tee sheet can never quote three different numbers
 * for the same thing:
 *
 *  - **Lesson packs and plans** read straight out of `instruction/instruction-catalog`
 *    (`PACKAGES`, `SUBSCRIPTIONS`). These are the *same* packs sold at
 *    `/instruction/packages` — the Shop is a second front door to one product, not a
 *    second product. Change a coach's rate and both surfaces move together.
 *  - **Play passes** are derived from `greenFee()` in `mcg/tee-times-data`, averaged
 *    across the seven standard courses, so a ten-round pack always visibly beats ten
 *    walk-ups and the resident card always beats the non-resident price.
 *  - **Range** is anchored to the $7 large basket implied by the existing
 *    `mcg-range-bucket-token-10` SKU in `shop-catalog` ($70 of tokens sold for $60).
 *
 * Category note: `ShopCategoryId` has no home for passes, lessons or services yet, so
 * everything prepaid-and-redeemable is mapped to `gift-cards` (which already holds the
 * range and junior-lesson cards) and everything the shop *does to your clubs or for your
 * membership* is mapped to `accessories`. See the handover note — `passes`, `lessons` and
 * `services` want adding to the union centrally.
 */
import { PACKAGES, SUBSCRIPTIONS, serviceById, serviceFromPrice } from "@/components/instruction/instruction-catalog";
import type { ShopProduct } from "@/components/mcg/shop-catalog";
import type { RateClass } from "@/components/mcg/tee-times-data";
import { CART_18, MCG_COURSES, greenFee } from "@/components/mcg/tee-times-data";

/* ------------------------------------------------------------------ */
/* Derivation helpers                                                  */
/* ------------------------------------------------------------------ */

/** County pricing lands on a five. Same rounding the Academy's packs use. */
const to5 = (n: number) => Math.round(n / 5) * 5;
const avg = (ns: number[]) => ns.reduce((a, b) => a + b, 0) / ns.length;
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/**
 * The two premium tickets. A pass covers the other seven and takes a surcharge here —
 * exactly how the county keeps Hampshire Greens and The Crossvines out of a $270 pack.
 */
const PREMIUM_SLUGS = ["hampshire-greens", "crossvines"];
const STANDARD_SLUGS = MCG_COURSES.filter((c) => !PREMIUM_SLUGS.includes(c.slug)).map((c) => c.slug);
const STANDARD_COURSE_NAMES = MCG_COURSES.filter((c) => !PREMIUM_SLUGS.includes(c.slug)).map((c) => c.name);
/** "A, B, C and D" — the seven courses a pass covers, written the way copy wants them. */
const STANDARD_NAMES = `${STANDARD_COURSE_NAMES.slice(0, -1).join(", ")} and ${STANDARD_COURSE_NAMES.at(-1)}`;

const weekday18 = (slug: string, opts: { resident?: boolean; rateClass?: RateClass } = {}) =>
    greenFee({ slug, holes: 18, weekend: false, twilight: false, ...opts });

/** Mean walking weekday 18 across the seven standard courses, by rate class. */
const STD_ADULT = avg(STANDARD_SLUGS.map((s) => weekday18(s)));
const STD_RESIDENT = avg(STANDARD_SLUGS.map((s) => weekday18(s, { resident: true })));
const STD_SENIOR = avg(STANDARD_SLUGS.map((s) => weekday18(s, { resident: true, rateClass: "senior" })));
const STD_JUNIOR = avg(STANDARD_SLUGS.map((s) => weekday18(s, { resident: true, rateClass: "junior" })));
const PREMIUM_SURCHARGE = to5(avg(PREMIUM_SLUGS.map((s) => weekday18(s))) - STD_ADULT);

/** What a resident card is worth on one weekday 18, and how fast it pays for itself. */
const RESIDENT_SAVING = STD_ADULT - STD_RESIDENT;
const RESIDENT_CARD_PRICE = 35;
const RESIDENT_CARD_BREAKEVEN = Math.ceil(RESIDENT_CARD_PRICE / RESIDENT_SAVING);

/* ---- multi-round packs: ten rounds, one fifth off the walk-up ---- */

const PACK_ROUNDS = 10;
const PACK_DISCOUNT = 0.2;
const packList = (unit: number) => to5(unit * PACK_ROUNDS);
const packPrice = (unit: number) => to5(unit * PACK_ROUNDS * (1 - PACK_DISCOUNT));

const PACK_RESIDENT = packPrice(STD_RESIDENT);
const PACK_RESIDENT_LIST = packList(STD_RESIDENT);
const PACK_ADULT = packPrice(STD_ADULT);
const PACK_ADULT_LIST = packList(STD_ADULT);
const PACK_SENIOR = packPrice(STD_SENIOR);
const PACK_SENIOR_LIST = packList(STD_SENIOR);

/* ---- season passes: priced at the round count they break even on ---- */

const SEASON_BREAKEVEN = 50;
const SEASON_RESIDENT = to5(STD_RESIDENT * SEASON_BREAKEVEN);
const SEASON_ADULT = to5(STD_ADULT * SEASON_BREAKEVEN);
const JUNIOR_SEASON_BREAKEVEN = 14;
const JUNIOR_SEASON = to5(STD_JUNIOR * JUNIOR_SEASON_BREAKEVEN);

/* ---- range: the $7 large basket the token 10-pack already implies ---- */

const LARGE_BUCKET = 7;
const RANGE_10_LIST = LARGE_BUCKET * 10;
const RANGE_10 = 60;
const RANGE_25_LIST = LARGE_BUCKET * 25;
const RANGE_25 = to5(RANGE_25_LIST * 0.8);
const RANGE_SEASON_BUCKETS = 60;
const RANGE_SEASON = to5(LARGE_BUCKET * RANGE_SEASON_BUCKETS);

/* ---- lesson packs and plans, read out of the Academy catalog ---- */

const onlinePacks = PACKAGES.filter((p) => p.availability === "online");
const packsOf = (credits: number) => onlinePacks.filter((p) => p.credits === credits);

const FIVE_PACKS = packsOf(5);
const TEN_PACKS = packsOf(10);
const FIVE_FROM = Math.min(...FIVE_PACKS.map((p) => p.price));
const FIVE_TO = Math.max(...FIVE_PACKS.map((p) => p.price));
const FIVE_SAVE = Math.min(...FIVE_PACKS.map((p) => p.savings));
const FIVE_PER = Math.min(...FIVE_PACKS.map((p) => p.perLessonPrice));
const TEN_FROM = Math.min(...TEN_PACKS.map((p) => p.price));
const TEN_TO = Math.max(...TEN_PACKS.map((p) => p.price));
const TEN_SAVE = Math.min(...TEN_PACKS.map((p) => p.savings));
const TEN_PER = Math.min(...TEN_PACKS.map((p) => p.perLessonPrice));
const PACK_EXPIRY = FIVE_PACKS[0].expiration;

const SUB_FROM = Math.min(...SUBSCRIPTIONS.map((s) => s.monthlyPrice));
const SUB_SAVE = Math.max(...SUBSCRIPTIONS.map((s) => s.listMonthly - s.monthlyPrice));
const SUB_NOTICE = SUBSCRIPTIONS[0].renewalNoticeDays;

/* ---- services priced off the lesson tee and the tee sheet ---- */

/** A fitting bay hour is sold at the same rate as the cheapest 60-minute private. */
const FITTING_PRICE = serviceFromPrice(serviceById("private-60")!);

const JUNIOR_PROGRAM = serviceById("clinic-junior-first")!;
/** `sessions` is optional on a `LessonService` — every group program sets it, privates do not. */
const JUNIOR_SESSIONS = JUNIOR_PROGRAM.sessions ?? 8;
/** The service name carries its own em-dash subtitle; the shop card only wants the front half. */
const JUNIOR_PROGRAM_NAME = JUNIOR_PROGRAM.name.split(" — ")[0];

/** A foursome with carts on the county's premium weekend ticket, given a gift discount. */
const HAMPSHIRE_WEEKEND_4 = greenFee({ slug: "hampshire-greens", holes: 18, weekend: true, twilight: false }) * 4;
const FOURSOME_LIST = HAMPSHIRE_WEEKEND_4 + CART_18 * 4;
const FOURSOME_PRICE = to5(FOURSOME_LIST * 0.95);

const REGRIP_PER_CLUB = 14;
const REGRIP_SET = to5(REGRIP_PER_CLUB * 13 * 0.85);

/* ------------------------------------------------------------------ */
/* The offerings                                                       */
/* ------------------------------------------------------------------ */

export const OFFERING_PRODUCTS: ShopProduct[] = [
/* ---------------------------- Gift cards --------------------------- */
    {
        slug: "mcg-egift-card",
        name: "MCG e-Gift Card",
        category: "gift-cards",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: 50,
        rating: 4.8,
        reviews: 96,
        inStock: true,
        blurb: "Emailed in about a minute, with a note you write yourself. Spends like cash on anything the county sells.",
        details: [
            "Delivered by email — choose the date it lands",
            "Green fees, carts, range balls, instruction, food at the grill and the shop",
            "Redeemable at all nine MCG courses, online or at the counter",
            "Never expires, and the unspent balance stays on the card",
            "$25, $50, $100 or $250",
        ],
        denominations: [25, 50, 100, 250],
    },
    {
        slug: "mcg-gift-card-custom",
        name: "MCG Gift Card — Custom Amount",
        category: "gift-cards",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: 75,
        rating: 4.7,
        reviews: 34,
        inStock: true,
        blurb: `For when the gift has a number attached — a ${usd(to5(STD_ADULT))} weekday 18, a ${usd(FIVE_FROM)} lesson pack, or whatever you've agreed to split.`,
        details: [
            "Any amount from $10 to $500, entered at checkout",
            "Printed at the counter or emailed — your choice at the last step",
            "Same redemption as a fixed card: fees, carts, range, lessons, grill and shop",
            "Never expires; balance checkable at any pro shop",
            "One card per order — buy again for a second recipient",
        ],
    },
    {
        slug: "mcg-foursome-certificate",
        name: "Foursome & Carts Certificate — Hampshire Greens",
        category: "gift-cards",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: FOURSOME_PRICE,
        compareAt: FOURSOME_LIST,
        rating: 4.9,
        reviews: 41,
        inStock: true,
        blurb: `Four weekend green fees and two carts at the best-conditioned course in the system — ${usd(FOURSOME_LIST - FOURSOME_PRICE)} under booking the same four seats.`,
        details: [
            "Four 18-hole weekend green fees at Hampshire Greens",
            "Two riding carts, shared one per two golfers",
            "Certificate number redeems against a single tee time, booked online or by phone",
            "Valid any Saturday or Sunday through December 31, 2026",
            "The county's usual charity-auction and retirement-gift item",
        ],
    },

    /* -------------------------- Lesson packages ------------------------- */
    /*
     * The same credit books sold at `/instruction/packages` — one product, two front
     * doors. Prices, savings and the expiry date are read from `PACKAGES`, never typed
     * in here, so an instructor's rate change moves the Shop without anyone editing it.
     */
    {
        slug: "mcg-lesson-pack-5",
        name: "Five-Lesson Private Package",
        category: "lessons",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: FIVE_FROM,
        rating: 4.8,
        reviews: 72,
        inStock: true,
        blurb: `Five 45-minute privates as a credit book — from ${usd(FIVE_FROM)}, roughly a lesson cheaper than booking them one at a time.`,
        details: [
            `Five credits, each good for one 45-minute private lesson`,
            `${usd(FIVE_FROM)} to ${usd(FIVE_TO)} depending on the instructor's rate — ${FIVE_PACKS.length} pros sell one`,
            `Saves at least ${usd(FIVE_SAVE)} against five single bookings (from ${usd(FIVE_PER)} a lesson)`,
            "Credits post to your MCG account at purchase and show at every checkout",
            "Range balls for the lesson included; written notes and drills after each",
            `Valid with the instructor you buy from. Unused credits expire ${PACK_EXPIRY}`,
            "Cancel or reschedule 24 hours ahead or the credit is spent",
        ],
    },
    {
        slug: "mcg-lesson-pack-10",
        name: "Ten-Lesson Private Package",
        category: "lessons",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: TEN_FROM,
        rating: 4.9,
        reviews: 38,
        inStock: true,
        blurb: `The Academy's best-value credit book: ten 45-minute privates from ${usd(TEN_FROM)}, plus a nine-hole playing lesson on the house.`,
        details: [
            "Ten credits, each good for one 45-minute private lesson",
            `${usd(TEN_FROM)} to ${usd(TEN_TO)} depending on the instructor — sold by the Director of Instruction and by Doug Hamilton`,
            `Saves at least ${usd(TEN_SAVE)} against ten single bookings (from ${usd(TEN_PER)} a lesson)`,
            "One complimentary 9-hole playing lesson included at this size",
            `Valid with the instructor you buy from. Unused credits expire ${PACK_EXPIRY}`,
            "Non-transferable between golfers",
        ],
    },
    {
        slug: "mcg-lesson-plan-monthly",
        name: "Monthly Lesson Plan",
        category: "lessons",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: SUB_FROM,
        rating: 4.7,
        reviews: 19,
        inStock: true,
        blurb: `A standing lesson slot instead of a prepaid book — from ${usd(SUB_FROM)} a month, cancel from your account whenever.`,
        details: [
            "Two or four 45-minute privates a month, depending on the plan",
            `Saves up to ${usd(SUB_SAVE)} a month against booking the same lessons singly`,
            "A standing weekly slot held for you if you want one",
            "Range balls included, plus 10% off in the Pro Shop while the plan runs",
            "Unused lessons roll over one month, then expire",
            `Billed on the same date each month; ${SUB_NOTICE} days' notice before every renewal`,
        ],
    },

    /* ---------------------- Range passes & punch cards ------------------ */
    /*
     * Anchored to the $7 large basket implied by `mcg-range-bucket-token-10` in
     * `shop-catalog`. That SKU is the physical brass-token twin of the 10-bucket card
     * below; this one loads to the MCG account and works at the ball machine.
     */
    {
        slug: "mcg-range-punch-10",
        name: "MCG Range Punch Card — 10 Buckets",
        category: "passes",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: RANGE_10,
        compareAt: RANGE_10_LIST,
        rating: 4.7,
        reviews: 128,
        inStock: true,
        blurb: `Ten large baskets for ${usd(RANGE_10)} instead of ${usd(RANGE_10_LIST)} — ${usd(LARGE_BUCKET - RANGE_10 / 10)} off every bucket you hit.`,
        details: [
            `Ten large baskets, ${usd(RANGE_10 / 10)} each against the ${usd(LARGE_BUCKET)} counter price`,
            "Loads to your MCG account — tap in at the ball machine, no token to lose",
            "Valid at the Needwood, Northwest and Laytonsville ranges",
            "Falls Road has no range; Sligo Creek's is practice nets only",
            "No expiry, and the balance carries across seasons",
        ],
    },
    {
        slug: "mcg-range-punch-25",
        name: "MCG Range Punch Card — 25 Buckets",
        category: "passes",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: RANGE_25,
        compareAt: RANGE_25_LIST,
        rating: 4.8,
        reviews: 64,
        inStock: true,
        blurb: `Twenty-five large baskets at ${usd(RANGE_25 / 25)} apiece. The card the winter-lesson crowd buys in February.`,
        details: [
            `Twenty-five large baskets for ${usd(RANGE_25)} — ${usd(RANGE_25_LIST - RANGE_25)} off the counter price`,
            "Same account balance as the 10-bucket card; top up rather than re-buy",
            "Valid at the Needwood, Northwest and Laytonsville ranges",
            "Shareable with one household member on the same MCG account",
            "No expiry",
        ],
    },
    {
        slug: "mcg-range-season-pass",
        name: "MCG Season Range Pass",
        category: "passes",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: RANGE_SEASON,
        rating: 4.6,
        reviews: 47,
        inStock: true,
        blurb: `Unlimited large baskets, March through November. Pays for itself at ${RANGE_SEASON_BUCKETS} buckets — about five a month.`,
        details: [
            "One large basket per visit, unlimited visits, March 1 to November 30",
            `Break-even at ${RANGE_SEASON_BUCKETS} baskets against the ${usd(LARGE_BUCKET)} walk-up price`,
            "Needwood, Northwest and Laytonsville",
            "One price whether or not you hold a county resident card",
            "Named to one golfer; photo taken at the counter when you collect it",
        ],
    },
    {
        slug: "mcg-ten-round-pack-non-resident",
        name: "MCG 10-Round Weekday Pack",
        category: "passes",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: PACK_ADULT,
        residentPrice: PACK_RESIDENT,
        compareAt: PACK_ADULT_LIST,
        rating: 4.5,
        reviews: 29,
        inStock: true,
        blurb: `The same ten weekday rounds without a county card: ${usd(PACK_ADULT)} against ${usd(PACK_ADULT_LIST)} at the counter. Bought mostly by people who work in the county rather than live in it.`,
        details: [
            "Ten 18-hole rounds, Monday to Friday, walking",
            `Valid at ${STANDARD_NAMES}`,
            `Add ${usd(PREMIUM_SURCHARGE)} a round for Hampshire Greens or The Crossvines`,
            `A resident card costs ${usd(RESIDENT_CARD_PRICE)} and drops this pack to ${usd(PACK_RESIDENT)} — buy the card first if you qualify`,
            "Rounds apply automatically at booking; carts and the booking fee are extra",
            "Expires December 31, 2026",
        ],
    },
    {
        slug: "mcg-season-play-pass-non-resident",
        name: "MCG Season Play Pass",
        category: "passes",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: SEASON_ADULT,
        residentPrice: SEASON_RESIDENT,
        rating: 4.6,
        reviews: 17,
        inStock: true,
        blurb: `The same unlimited weekday season at the non-resident rate — ${usd(SEASON_ADULT)}, or ${usd(SEASON_ADULT - SEASON_RESIDENT)} more than a county card holder pays.`,
        details: [
            "Unlimited 18-hole weekday rounds, plus weekends after noon",
            `Valid at ${STANDARD_NAMES}`,
            `${usd(PREMIUM_SURCHARGE)} a round at Hampshire Greens and The Crossvines`,
            `Break-even at ${SEASON_BREAKEVEN} rounds against the ${usd(to5(STD_ADULT))} average weekday fee`,
            "No advance-booking privilege — that one is resident-only",
            "Named to one golfer, non-transferable. March 1 to December 31",
        ],
    },
    {
        slug: "mcg-senior-weekday-pack",
        name: "MCG Senior 10-Round Weekday Pack",
        category: "passes",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: PACK_SENIOR,
        compareAt: PACK_SENIOR_LIST,
        rating: 4.9,
        reviews: 112,
        inStock: true,
        blurb: `Ten weekday rounds at the 62-and-over resident rate — ${usd(PACK_SENIOR)}, which is ${usd(PACK_SENIOR / 10)} a round. The county's best-selling pass.`,
        details: [
            "Ten 18-hole weekday rounds for golfers 62 and over",
            "Senior pricing is a weekday courtesy — the pack is not valid Saturday or Sunday",
            `Valid at ${STANDARD_NAMES}`,
            "Montgomery County resident card required; ID checked once at the counter",
            `Saves ${usd(PACK_SENIOR_LIST - PACK_SENIOR)} against ten senior walk-ups`,
            "Expires December 31, 2026",
        ],
    },

    /* ------------------------------ Junior ----------------------------- */
    {
        slug: "mcg-junior-season-pass",
        name: "MCG Junior Season Pass",
        category: "passes",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: JUNIOR_SEASON,
        rating: 5,
        reviews: 63,
        inStock: true,
        blurb: `Unlimited golf for a resident junior, all season, for ${usd(JUNIOR_SEASON)} — roughly ${JUNIOR_SEASON_BREAKEVEN} rounds' worth of green fees.`,
        details: [
            "Unlimited rounds for golfers 17 and under, any day, at all nine courses",
            "Weekdays any time; weekends and holidays after 11:00 AM",
            `Break-even at ${JUNIOR_SEASON_BREAKEVEN} rounds against the ${usd(to5(STD_JUNIOR))} average junior resident weekday fee`,
            "Sold to Montgomery County resident juniors only — proof of residency at pickup",
            "Must be accompanied by an adult before 9:00 AM on weekends",
            "Runs March 1 to December 31. Walking; carts are extra and age rules apply",
        ],
    },
    {
        slug: "mcg-junior-program-enrolment",
        name: `Junior Program Enrolment — ${JUNIOR_PROGRAM_NAME}`,
        category: "lessons",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: JUNIOR_PROGRAM.basePrice,
        rating: 4.9,
        reviews: 44,
        inStock: true,
        blurb: `${JUNIOR_SESSIONS} Saturday mornings at The Crossvines — the front door to the MCG junior pathway, ${JUNIOR_PROGRAM.ageGroup?.toLowerCase() ?? "ages 7–10"}.`,
        details: [
            `${JUNIOR_SESSIONS} sessions of ${JUNIOR_PROGRAM.durationMin} minutes — ${JUNIOR_PROGRAM.schedule ?? "Saturdays 10:00 AM"}`,
            `${JUNIOR_PROGRAM.ageGroup ?? "Ages 7–10"}, taught at The Crossvines`,
            "Clubs provided if they don't have their own — no equipment needed to start",
            `${usd(Math.round(JUNIOR_PROGRAM.basePrice / JUNIOR_SESSIONS))} a session, against ${usd(serviceFromPrice(serviceById("junior-30")!))} for a single junior private`,
            "Buying here reserves the place; the roster and the waiver live on the Instruction page",
            "Places are capped and the summer intake fills by May",
        ],
    },

    /* ----------------- Memberships & services (no product) -------------- */
    {
        slug: "mcg-resident-card",
        name: "Montgomery County Resident Card",
        category: "services",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: RESIDENT_CARD_PRICE,
        rating: 4.8,
        reviews: 147,
        inStock: true,
        blurb: `${usd(RESIDENT_CARD_PRICE)} a year for the resident rate at all nine courses and a day's head start on the tee sheet. Pays for itself in ${RESIDENT_CARD_BREAKEVEN} weekday rounds.`,
        details: [
            `Takes about ${usd(Math.round(RESIDENT_SAVING))} off an 18 and half that off a nine or a twilight`,
            "Book 8 days ahead rather than 7",
            "Unlocks resident pricing on the 10-round packs and the season pass",
            "Proof of Montgomery County residency required — a licence or a utility bill",
            "Valid twelve months from the day it is issued; collected at any pro shop",
        ],
    },
    {
        slug: "mcg-ghin-handicap-membership",
        name: "GHIN Handicap Membership",
        category: "services",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: 45,
        rating: 4.6,
        reviews: 88,
        inStock: true,
        blurb: "An official USGA Handicap Index through the Maryland State Golf Association, held under the MCG club. Renews every February.",
        details: [
            "USGA Handicap Index, revised daily, posted through the GHIN app",
            "Membership of the MCG club — no home course requirement",
            "Post scores from any rated course, not just the nine",
            "Required to enter the county amateur and most MCG member events",
            "Runs the calendar year and renews each February; no proration after September",
        ],
    },
    {
        slug: "mcg-club-regripping",
        name: "Club Regripping — Per Club",
        category: "services",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: REGRIP_PER_CLUB,
        rating: 4.7,
        reviews: 71,
        inStock: true,
        blurb: `${usd(REGRIP_PER_CLUB)} a club, grip included, fitted in the Needwood workshop. Drop the bag off in the morning, play it that evening.`,
        details: [
            "Price covers the grip and the labour — standard rubber or corded",
            `A full 13-club bag is ${usd(REGRIP_SET)}, which is ${usd(REGRIP_PER_CLUB * 13 - REGRIP_SET)} off the per-club rate`,
            "Midsize and jumbo builds at no extra charge; extra wraps of tape included",
            "Same-day on anything dropped before 11:00 AM at Needwood, 48 hours elsewhere",
            "Bring the clubs to the counter — nothing ships",
        ],
    },
    {
        slug: "mcg-club-storage-locker",
        name: "Club Storage — Season Locker",
        category: "services",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: 165,
        rating: 4.5,
        reviews: 26,
        inStock: true,
        blurb: "Leave the bag at the course. A full-height locker in the clubhouse for the season, with the bag brought out to the first tee on request.",
        details: [
            "One full-height locker, March 1 to December 31",
            "Choose your course at checkout — lockers at Needwood, Northwest and Hampshire Greens",
            "Bag pulled and waiting at the cart staging area if you call an hour ahead",
            "Free club cleaning after every round",
            "Bags not collected by January 15 are moved to storage and a fee applies",
        ],
    },
    {
        slug: "mcg-club-rental-round",
        name: "Club Rental — Per Round",
        category: "services",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: 30,
        rating: 4.2,
        reviews: 58,
        inStock: true,
        blurb: "A full set for eighteen holes, reserved with your tee time so it is on the cart when you get there.",
        details: [
            "Ten clubs plus a carry or cart bag — $30 for 18 holes, $20 for nine",
            "Right hand and left hand, men's and women's flex",
            "Junior sets free with a junior program enrolment",
            "Available at all nine courses; reserve when you book so a set is held",
            "A sleeve of balls is not included — the shop sells one at the counter",
        ],
        sizes: ["Right hand", "Left hand"],
    },
    {
        slug: "mcg-club-fitting-session",
        name: "Club Fitting Session",
        category: "services",
        brand: "MCG",
        logoTile: true,
        mcgLogo: true,
        price: FITTING_PRICE,
        rating: 4.8,
        reviews: 33,
        inStock: true,
        blurb: `An hour on the launch monitor at Northwest with an MCG instructor, priced at the same ${usd(FITTING_PRICE)} as a 60-minute private — and credited back if you buy through the shop.`,
        details: [
            "60 minutes in the fitting bay with launch monitor data you keep",
            "Driver, irons or wedges — one category per session, done properly",
            "Head, shaft, length, lie and grip size recommendations in writing",
            `The full ${usd(FITTING_PRICE)} comes off any club order placed through an MCG pro shop within 30 days`,
            "Bring your current set; we measure it against the recommendation",
            "Booked through the Academy at Northwest, weekdays and Saturday mornings",
        ],
    },
];
