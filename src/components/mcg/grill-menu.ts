/**
 * MCG food & drink — the fixture data behind the Grill category.
 *
 * Municipal golf does not run a dining room. What it runs is a counter with a flat-top,
 * a window at the turn, and a cart that goes out when there's someone to drive it. The
 * data model here is built around that difference rather than hiding it:
 *
 *  - A **venue** is one course's food operation, and its `kind` — `grill`, `window`,
 *    `cart` — is the single fact that decides what it can sell and whether you can
 *    order ahead. A snack window has no flat-top, so no burger appears on its menu; a
 *    beverage cart has no menu screen at all, only a schedule.
 *  - An **item** declares which kinds of operation can produce it (`service`), so one
 *    menu is authored once and each venue's board falls out of it. Course-specific
 *    items carry `only` — that's how The Crossvines gets a wine list without a second
 *    catalog, exactly as a group clinic and a private lesson share one service catalog
 *    over in Instruction.
 *
 * Prices are real muni prices: nothing on the food menu clears $16, and the beer is
 * canned. Maryland charges 6% on food and 9% on alcohol, which is why the order rail
 * splits the two rather than applying one rate.
 */
import { mcgCourses } from "@/components/foundations/mcg/mcg-assets";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/**
 * What kind of food operation a course runs.
 *
 *  - `grill`  — a staffed kitchen with a flat-top and a fryer. Full menu, order ahead.
 *  - `window` — a counter at the turn: hot dogs, pre-made wraps, snacks, cans. Order
 *               ahead for pickup at the turn only.
 *  - `cart`   — a beverage cart on the course. Nothing to pre-order; flag it down.
 */
export type VenueKind = "grill" | "window" | "cart";

export const VENUE_KIND_LABEL: Record<VenueKind, string> = {
    grill: "Full grill",
    window: "Snack window",
    cart: "Beverage cart only",
};

/** Badge color per kind, so the nine courses sort themselves at a glance. */
export const VENUE_KIND_COLOR: Record<VenueKind, "brand" | "blue" | "gray"> = {
    grill: "brand",
    window: "blue",
    cart: "gray",
};

export interface GrillVenue {
    /** Course slug — matches `mcgCourses`, so logos and names come for free. */
    slug: string;
    /** What the food operation is called, which is rarely the course's name. */
    name: string;
    kind: VenueKind;
    /** One line a golfer can act on: what this place is actually good at. */
    blurb: string;
    hours: { days: string; time: string }[];
    phone: string;
    /** Where the counter is, for someone standing on the property. */
    where: string;
    /** Pickup points this venue can honour, in display order. */
    pickup: PickupOption[];
    /** A grill's one thing worth driving for. */
    signature?: string;
}

export type PickupId = "turn" | "clubhouse" | "after";

export interface PickupOption {
    id: PickupId;
    label: string;
    detail: string;
}

/** Pickup points, defined once and referenced by each venue. */
export const PICKUP: Record<PickupId, PickupOption> = {
    turn: {
        id: "turn",
        label: "At the turn",
        detail: "Ready in the window between 9 and 10. Text us your hole and we'll time it.",
    },
    clubhouse: {
        id: "clubhouse",
        label: "Now, at the counter",
        detail: "Ready in 10–15 minutes. Grab it before you tee off.",
    },
    after: {
        id: "after",
        label: "After the round",
        detail: "We'll fire it when you reach 17. Eat on the patio.",
    },
};

export type SectionId = "breakfast" | "grill" | "handhelds" | "sides" | "beer" | "cocktails" | "wine" | "na";

export interface MenuSection {
    id: SectionId;
    label: string;
    /** Sub-line under the tab, once the section is open. */
    blurb: string;
    /** Alcohol is taxed at 9% in Maryland, food at 6%. */
    alcohol?: boolean;
}

export const MENU_SECTIONS: MenuSection[] = [
    { id: "breakfast", label: "Breakfast", blurb: "Served until 11 AM, or until the first wave clears the 9th." },
    { id: "grill", label: "From the grill", blurb: "Cooked to order. Ten minutes, give or take a foursome." },
    { id: "handhelds", label: "Wraps & salads", blurb: "Made up front, cold and ready — the fastest thing on the board." },
    { id: "sides", label: "Snacks & sides", blurb: "Cart food. Grab it and go." },
    { id: "beer", label: "Beer & seltzer", blurb: "Cans only — no glass past the pro shop door.", alcohol: true },
    { id: "cocktails", label: "Canned cocktails", blurb: "Pre-mixed, cold, and legal in a cart holder.", alcohol: true },
    { id: "wine", label: "Wine", blurb: "Poured from the tasting room next door.", alcohol: true },
    { id: "na", label: "Drinks", blurb: "Coffee, fountain and everything that isn't beer." },
];

export const sectionById = (id: SectionId): MenuSection => MENU_SECTIONS.find((s) => s.id === id)!;

export interface MenuItem {
    id: string;
    name: string;
    desc: string;
    price: number;
    section: SectionId;
    /** Which kinds of operation can produce this. A burger needs a flat-top. */
    service: VenueKind[];
    /** Restrict to specific course slugs — how one venue gets its own items. */
    only?: string[];
    /** Short callouts: "Local", "Vegetarian", "Spicy". */
    tags?: string[];
    /** Ordered more than anything else on the board. */
    popular?: boolean;
}

/* ------------------------------------------------------------------ */
/* Venues                                                              */
/* ------------------------------------------------------------------ */

/**
 * Four grills, three windows and two carts across the nine courses — which is roughly
 * how a county portfolio actually distributes food service: the busy 18s carry a
 * kitchen, the quieter and shorter courses carry a window, and the smallest ones carry
 * a cart on weekends or nothing but a cooler.
 */
export const VENUES: GrillVenue[] = [
    {
        slug: "falls-road",
        name: "The Grill at Falls Road",
        kind: "grill",
        blurb: "The busiest kitchen in the portfolio. Breakfast from 6:30, burgers off the flat-top all day, and a patio that looks down the 18th.",
        hours: [
            { days: "Mon – Fri", time: "6:30 AM – 6:00 PM" },
            { days: "Sat – Sun", time: "6:00 AM – 7:00 PM" },
        ],
        phone: "(301) 299-5156",
        where: "Clubhouse, left of the pro shop counter",
        pickup: [PICKUP.clubhouse, PICKUP.turn, PICKUP.after],
        signature: "The Falls Road crab cake sandwich — broiled, not fried, and worth the ten minutes.",
    },
    {
        slug: "northwest",
        name: "The Turn at Northwest",
        kind: "grill",
        blurb: "A full kitchen built for a championship course: breakfast sandwiches before the shotgun, chili all winter, cans on ice by the 10th tee.",
        hours: [
            { days: "Mon – Fri", time: "7:00 AM – 5:30 PM" },
            { days: "Sat – Sun", time: "6:30 AM – 6:30 PM" },
        ],
        phone: "(301) 598-6100",
        where: "Lower level of the clubhouse, on the cart path side",
        pickup: [PICKUP.clubhouse, PICKUP.turn, PICKUP.after],
        signature: "A bowl of the beef chili with onions and cheddar, which they have never once changed.",
    },
    {
        slug: "needwood",
        name: "Needwood Grille",
        kind: "grill",
        blurb: "Full grill serving both the regulation course and the Pines executive nine. Big breakfast crowd, league night cheesesteaks.",
        hours: [
            { days: "Mon – Thu", time: "7:00 AM – 5:00 PM" },
            { days: "Fri – Sun", time: "6:30 AM – 6:30 PM" },
        ],
        phone: "(301) 948-1075",
        where: "Clubhouse, between the pro shop and the banquet room",
        pickup: [PICKUP.clubhouse, PICKUP.turn, PICKUP.after],
        signature: "Cheesesteak with grilled onions, wrapped in foil so it survives to the 14th.",
    },
    {
        slug: "crossvines",
        name: "The Crossvines Kitchen & Tasting Room",
        kind: "grill",
        blurb: "The one MCG property with a winery attached. Wood-fired flatbreads, smoked brisket, and Montgomery County wine by the glass — on the course or on the terrace.",
        hours: [
            { days: "Mon – Tue", time: "Closed" },
            { days: "Wed – Fri", time: "8:00 AM – 8:00 PM" },
            { days: "Sat – Sun", time: "7:30 AM – 9:00 PM" },
        ],
        phone: "(301) 349-5000",
        where: "Tasting room terrace, up the steps from the 18th green",
        pickup: [PICKUP.clubhouse, PICKUP.turn, PICKUP.after],
        signature: "Margherita flatbread out of the wood oven with a glass of the estate Cabernet Franc.",
    },
    {
        slug: "hampshire-greens",
        name: "The Snack Shop at Hampshire Greens",
        kind: "window",
        blurb: "A window at the turn, not a kitchen. Dogs off the roller, wraps made up front each morning, and a cooler of cans.",
        hours: [
            { days: "Mon – Fri", time: "7:30 AM – 4:00 PM" },
            { days: "Sat – Sun", time: "7:00 AM – 5:00 PM" },
        ],
        phone: "(301) 476-7999",
        where: "Window on the clubhouse deck, facing the 10th tee",
        pickup: [PICKUP.turn, PICKUP.clubhouse],
    },
    {
        slug: "little-bennett",
        name: "Little Bennett Snack Bar",
        kind: "window",
        blurb: "Counter service inside the pro shop. Hot dogs, pretzels, chili in the cold months, and the coldest cooler in Clarksburg.",
        hours: [
            { days: "Mon – Fri", time: "7:30 AM – 4:30 PM" },
            { days: "Sat – Sun", time: "7:00 AM – 5:30 PM" },
        ],
        phone: "(301) 253-1515",
        where: "Inside the pro shop, right of the register",
        pickup: [PICKUP.turn, PICKUP.clubhouse],
    },
    {
        slug: "sligo-creek",
        name: "The Sligo Creek Window",
        kind: "window",
        blurb: "One window off the back of the little clubhouse. Hot dogs, chips, ice cream in summer and a coffee urn that runs from first light — sized for a ninety-minute round, not a lunch.",
        hours: [
            { days: "Mon – Fri", time: "7:00 AM – 3:00 PM" },
            { days: "Sat – Sun", time: "6:30 AM – 4:00 PM" },
        ],
        phone: "(301) 585-6006",
        where: "Window beside the starter's hut, facing the 1st tee",
        pickup: [PICKUP.clubhouse, PICKUP.turn],
    },
    {
        slug: "rattlewood",
        name: "Rattlewood Beverage Cart",
        kind: "cart",
        blurb: "A long way from anywhere, so the cart is the whole operation. It runs the weekend and Friday rounds, and the pro shop keeps a cooler, a hot-dog roller and a candy rack the rest of the week.",
        hours: [
            { days: "Fri", time: "Cart out 10:30 AM – 5:00 PM" },
            { days: "Sat – Sun", time: "Cart out 8:00 AM – 5:30 PM" },
            { days: "Mon – Thu", time: "Pro shop cooler only" },
        ],
        phone: "(301) 831-5900",
        where: "Usually parked by the 5th tee between loops",
        pickup: [],
    },
    {
        slug: "laytonsville",
        name: "Laytonsville Beverage Cart",
        kind: "cart",
        blurb: "No kitchen and no window — the cart is the food service. It runs weekends and Friday afternoons, weather permitting, and the pro shop keeps a cooler and a candy rack the rest of the week.",
        hours: [
            { days: "Fri", time: "Cart out 11:00 AM – 5:00 PM" },
            { days: "Sat – Sun", time: "Cart out 8:00 AM – 5:00 PM" },
            { days: "Mon – Thu", time: "Pro shop cooler only" },
        ],
        phone: "(301) 948-5288",
        where: "Somewhere between 4 and 14 — flag it down",
        pickup: [],
    },
];

export const venueBySlug = (slug: string): GrillVenue | undefined => VENUES.find((v) => v.slug === slug);

/** Venues you can place an order-ahead with. The cart takes cash on the fairway. */
export const orderableVenues = (): GrillVenue[] => VENUES.filter((v) => v.kind !== "cart");

/** Course slug → venue, so any screen holding only a slug can name the food. */
export const VENUE_BY_COURSE: Record<string, GrillVenue> = Object.fromEntries(VENUES.map((v) => [v.slug, v]));

/** Every MCG course, in portfolio order, paired with its food operation. */
export const COURSE_VENUES = mcgCourses.map((course) => ({ course, venue: VENUE_BY_COURSE[course.slug] }));

/* ------------------------------------------------------------------ */
/* The menu                                                            */
/* ------------------------------------------------------------------ */

const GRILL_ONLY: VenueKind[] = ["grill"];
const COUNTER: VenueKind[] = ["grill", "window"];
const EVERYWHERE: VenueKind[] = ["grill", "window", "cart"];

export const MENU: MenuItem[] = [
    /* ---- breakfast ---- */
    {
        id: "egg-cheese",
        name: "Egg & cheese biscuit",
        desc: "Two eggs, American, on a buttermilk biscuit.",
        price: 5,
        section: "breakfast",
        service: GRILL_ONLY,
    },
    {
        id: "sausage-egg",
        name: "Sausage, egg & cheese",
        desc: "On a kaiser roll, wrapped in foil for the cart.",
        price: 6.5,
        section: "breakfast",
        service: GRILL_ONLY,
        popular: true,
    },
    { id: "bacon-egg", name: "Bacon, egg & cheese", desc: "Three strips, over hard, sharp cheddar.", price: 7, section: "breakfast", service: GRILL_ONLY },
    {
        id: "breakfast-burrito",
        name: "Breakfast burrito",
        desc: "Scrambled eggs, potato, chorizo, pepper jack, salsa verde.",
        price: 8.5,
        section: "breakfast",
        service: GRILL_ONLY,
    },
    { id: "bagel", name: "Bagel & butter", desc: "Toasted. Add cream cheese for a dollar.", price: 4, section: "breakfast", service: COUNTER },
    {
        id: "oatmeal",
        name: "Steel-cut oatmeal",
        desc: "Brown sugar and raisins on the side.",
        price: 5,
        section: "breakfast",
        service: GRILL_ONLY,
        tags: ["Vegetarian"],
    },

    {
        id: "scrapple-egg",
        name: "Scrapple, egg & cheese",
        desc: "Griddled thin so the edges go crisp, on a kaiser. A Maryland argument on a roll.",
        price: 6.5,
        section: "breakfast",
        service: GRILL_ONLY,
        tags: ["Local"],
    },
    {
        id: "pork-roll",
        name: "Pork roll, egg & cheese",
        desc: "Taylor ham, four nicks in the slice so it lies flat.",
        price: 7,
        section: "breakfast",
        service: GRILL_ONLY,
    },
    {
        id: "sausage-gravy",
        name: "Biscuits & sausage gravy",
        desc: "Two split biscuits under peppered white gravy.",
        price: 7.5,
        section: "breakfast",
        service: GRILL_ONLY,
    },
    {
        id: "home-fries",
        name: "Old Bay home fries",
        desc: "Diced potato and onion off the flat-top, dusted heavy.",
        price: 4,
        section: "breakfast",
        service: GRILL_ONLY,
        tags: ["Local", "Vegetarian"],
    },
    {
        id: "short-stack",
        name: "Short stack",
        desc: "Three buttermilk pancakes, warm syrup. Two eggs alongside for $2.",
        price: 7,
        section: "breakfast",
        service: GRILL_ONLY,
        tags: ["Vegetarian"],
    },
    { id: "muffin", name: "Corn muffin", desc: "Baked up the road in Damascus. Warm if you catch it early.", price: 3, section: "breakfast", service: COUNTER },
    {
        id: "yogurt-parfait",
        name: "Yogurt parfait",
        desc: "Vanilla yogurt, granola and berries, in a cup that fits a cart holder.",
        price: 5.5,
        section: "breakfast",
        service: COUNTER,
        tags: ["Vegetarian"],
    },
    {
        id: "banana",
        name: "Banana",
        desc: "Two for $2. The only thing on the board that's good for you.",
        price: 1.5,
        section: "breakfast",
        service: EVERYWHERE,
        tags: ["Vegetarian"],
    },
    {
        id: "cv-quiche",
        name: "Crab & asparagus quiche",
        desc: "Out of the tasting-room kitchen, warm, with dressed greens.",
        price: 13,
        section: "breakfast",
        service: GRILL_ONLY,
        only: ["crossvines"],
        tags: ["Local"],
    },

    /* ---- from the grill ---- */
    {
        id: "mcg-burger",
        name: "MCG classic burger",
        desc: "Third-pound patty, American, lettuce, tomato, raw onion, on a potato roll.",
        price: 11,
        section: "grill",
        service: GRILL_ONLY,
        popular: true,
    },
    {
        id: "bacon-cheeseburger",
        name: "Bacon cheeseburger",
        desc: "The classic with three strips and sharp cheddar.",
        price: 13,
        section: "grill",
        service: GRILL_ONLY,
    },
    {
        id: "turn-dog",
        name: "The Turn dog",
        desc: "Quarter-pound all-beef, split and grilled, on a steamed bun.",
        price: 6,
        section: "grill",
        service: COUNTER,
        popular: true,
    },
    { id: "chili-dog", name: "Chili cheese dog", desc: "The Turn dog under beef chili, cheddar and onion.", price: 8, section: "grill", service: COUNTER },
    {
        id: "grilled-chicken",
        name: "Grilled chicken sandwich",
        desc: "Marinated breast, lettuce, tomato, honey mustard.",
        price: 12,
        section: "grill",
        service: GRILL_ONLY,
    },
    {
        id: "crab-cake",
        name: "Maryland crab cake sandwich",
        desc: "Broiled jumbo lump, almost no filler, Old Bay mayo, on a kaiser.",
        price: 16,
        section: "grill",
        service: GRILL_ONLY,
        only: ["falls-road", "crossvines", "needwood"],
        tags: ["Local"],
    },
    { id: "cheesesteak", name: "Cheesesteak", desc: "Shaved ribeye, grilled onion, provolone or whiz.", price: 13, section: "grill", service: GRILL_ONLY },
    {
        id: "tenders",
        name: "Chicken tenders & fries",
        desc: "Four hand-breaded tenders, honey mustard or buffalo.",
        price: 12,
        section: "grill",
        service: GRILL_ONLY,
    },
    { id: "blt", name: "BLT", desc: "Six strips, on toasted white. Nothing clever.", price: 9, section: "grill", service: GRILL_ONLY },
    {
        id: "brisket",
        name: "Smoked brisket sandwich",
        desc: "Twelve hours over oak, pickled onion, vinegar slaw, on a brioche bun.",
        price: 15,
        section: "grill",
        service: GRILL_ONLY,
        only: ["crossvines"],
        popular: true,
    },
    {
        id: "flatbread",
        name: "Wood-fired margherita flatbread",
        desc: "Out of the tasting-room oven — crushed tomato, fresh mozzarella, basil.",
        price: 14,
        section: "grill",
        service: GRILL_ONLY,
        only: ["crossvines"],
        tags: ["Vegetarian"],
    },

    {
        id: "half-smoke",
        name: "Half-smoke, chili & onion",
        desc: "Coarse-ground beef and pork, split on the flat-top, the way the District does it.",
        price: 8.5,
        section: "grill",
        service: COUNTER,
        tags: ["Local"],
        popular: true,
    },
    {
        id: "double-burger",
        name: "The double",
        desc: "Two patties, two slices of American, griddled onion. Bring a napkin.",
        price: 14,
        section: "grill",
        service: GRILL_ONLY,
    },
    {
        id: "veggie-burger",
        name: "Black bean burger",
        desc: "Made here, chipotle mayo, lettuce and tomato.",
        price: 11,
        section: "grill",
        service: GRILL_ONLY,
        tags: ["Vegetarian"],
    },
    { id: "patty-melt", name: "Patty melt", desc: "Swiss and caramelised onion on grilled rye.", price: 12.5, section: "grill", service: GRILL_ONLY },
    {
        id: "grilled-cheese",
        name: "Grilled cheese",
        desc: "American on white, cut corner to corner. Bacon on it for $2.",
        price: 6.5,
        section: "grill",
        service: GRILL_ONLY,
        tags: ["Vegetarian"],
    },
    {
        id: "old-bay-wings",
        name: "Old Bay wings",
        desc: "Eight, fried hard and tossed in Old Bay butter. Ranch or blue cheese.",
        price: 13,
        section: "grill",
        service: GRILL_ONLY,
        tags: ["Local"],
        popular: true,
    },
    {
        id: "fish-sandwich",
        name: "Fried rockfish sandwich",
        desc: "Beer-battered, tartar, shredded lettuce, on a kaiser.",
        price: 14,
        section: "grill",
        service: GRILL_ONLY,
        only: ["falls-road", "northwest", "crossvines"],
        tags: ["Local"],
    },
    {
        id: "sausage-peppers",
        name: "Italian sausage & peppers",
        desc: "Sweet sausage, onion and pepper on a hoagie roll.",
        price: 11,
        section: "grill",
        service: GRILL_ONLY,
    },
    {
        id: "kids-nuggets",
        name: "Kids nuggets & fries",
        desc: "Four nuggets, small fries, juice box. Twelve and under.",
        price: 7,
        section: "grill",
        service: GRILL_ONLY,
    },
    {
        id: "cv-pepperoni",
        name: "Wood-fired pepperoni flatbread",
        desc: "Cup-and-char pepperoni, hot honey straight out of the oven.",
        price: 16,
        section: "grill",
        service: GRILL_ONLY,
        only: ["crossvines"],
    },

    /* ---- wraps & salads ---- */
    {
        id: "caesar-wrap",
        name: "Chicken Caesar wrap",
        desc: "Grilled chicken, romaine, parmesan, in a flour tortilla.",
        price: 11,
        section: "handhelds",
        service: COUNTER,
    },
    {
        id: "buffalo-wrap",
        name: "Buffalo chicken wrap",
        desc: "Crispy chicken, hot sauce, blue cheese, celery.",
        price: 11.5,
        section: "handhelds",
        service: COUNTER,
        tags: ["Spicy"],
    },
    { id: "turkey-wrap", name: "Turkey club wrap", desc: "Turkey, bacon, lettuce, tomato, mayo.", price: 10.5, section: "handhelds", service: COUNTER },
    {
        id: "garden-salad",
        name: "Garden salad",
        desc: "Greens, cucumber, tomato, carrot, choice of dressing.",
        price: 8,
        section: "handhelds",
        service: COUNTER,
        tags: ["Vegetarian"],
    },
    { id: "chicken-caesar", name: "Chicken Caesar salad", desc: "The wrap, in a bowl, with croutons.", price: 12, section: "handhelds", service: COUNTER },
    {
        id: "vineyard-salad",
        name: "Vineyard salad",
        desc: "Greens, goat cheese, candied pecans, dried cherries, house vinaigrette.",
        price: 12,
        section: "handhelds",
        service: GRILL_ONLY,
        only: ["crossvines"],
        tags: ["Vegetarian"],
    },

    {
        id: "shrimp-salad",
        name: "Shrimp salad sandwich",
        desc: "Chopped shrimp, celery and Old Bay on a butter-toasted roll.",
        price: 14,
        section: "handhelds",
        service: COUNTER,
        only: ["falls-road", "crossvines", "needwood", "hampshire-greens"],
        tags: ["Local"],
    },
    {
        id: "club",
        name: "Turkey club",
        desc: "Three slices of toast, turkey, bacon, lettuce, tomato. Cut in quarters.",
        price: 12,
        section: "handhelds",
        service: COUNTER,
    },
    {
        id: "chicken-salad",
        name: "Chicken salad croissant",
        desc: "Grapes and pecans in it, which people argue about.",
        price: 10.5,
        section: "handhelds",
        service: COUNTER,
    },
    {
        id: "tuna-sandwich",
        name: "Tuna salad sandwich",
        desc: "On wheat with lettuce. Made this morning, not last week.",
        price: 9.5,
        section: "handhelds",
        service: COUNTER,
    },
    {
        id: "veggie-wrap",
        name: "Hummus & veggie wrap",
        desc: "Hummus, cucumber, pepper, spinach and feta in a spinach tortilla.",
        price: 9.5,
        section: "handhelds",
        service: COUNTER,
        tags: ["Vegetarian"],
    },
    { id: "cobb", name: "Cobb salad", desc: "Chicken, bacon, egg, avocado, blue cheese, tomato.", price: 13, section: "handhelds", service: COUNTER },

    /* ---- snacks & sides ---- */
    { id: "chili-cup", name: "Beef chili, cup", desc: "Onion and cheddar on top. Bowl for $8.", price: 6, section: "sides", service: COUNTER },
    {
        id: "crab-soup",
        name: "Cream of crab soup",
        desc: "Sherry on request. October through March.",
        price: 9,
        section: "sides",
        service: GRILL_ONLY,
        only: ["falls-road", "crossvines"],
        tags: ["Local"],
    },
    {
        id: "fries",
        name: "Basket of fries",
        desc: "Salted. Old Bay on request, and you should.",
        price: 5,
        section: "sides",
        service: GRILL_ONLY,
        popular: true,
    },
    { id: "pretzel", name: "Soft pretzel", desc: "Warm, with a cup of nacho cheese.", price: 6, section: "sides", service: COUNTER },
    { id: "nachos", name: "Nachos", desc: "Tortilla chips, nacho cheese, jalapeños. Add chili for $2.", price: 7, section: "sides", service: COUNTER },
    { id: "chips", name: "Kettle chips", desc: "Plain, BBQ or salt & vinegar.", price: 4, section: "sides", service: EVERYWHERE },
    { id: "candy", name: "Candy bar", desc: "Whatever's on the rack. It's a golf course.", price: 4, section: "sides", service: EVERYWHERE },
    { id: "protein-bar", name: "Protein bar", desc: "For the round you didn't plan to play.", price: 4, section: "sides", service: EVERYWHERE },

    {
        id: "crab-dip",
        name: "Hot crab dip & pretzel bites",
        desc: "Backfin, cream cheese and Old Bay, broiled brown on top.",
        price: 14,
        section: "sides",
        service: GRILL_ONLY,
        only: ["falls-road", "crossvines", "needwood"],
        tags: ["Local"],
        popular: true,
    },
    {
        id: "old-bay-fries",
        name: "Old Bay cheese fries",
        desc: "The basket, under cheese sauce and a heavy dust.",
        price: 8,
        section: "sides",
        service: GRILL_ONLY,
        tags: ["Local"],
    },
    { id: "onion-rings", name: "Onion rings", desc: "Beer-battered, six to a basket.", price: 6, section: "sides", service: GRILL_ONLY, tags: ["Vegetarian"] },
    {
        id: "mozz-sticks",
        name: "Mozzarella sticks",
        desc: "Six, with a cup of marinara.",
        price: 7,
        section: "sides",
        service: GRILL_ONLY,
        tags: ["Vegetarian"],
    },
    { id: "tots", name: "Tater tots", desc: "Salted. Old Bay on request, and yes.", price: 5, section: "sides", service: GRILL_ONLY, tags: ["Vegetarian"] },
    {
        id: "coleslaw",
        name: "Cup of coleslaw",
        desc: "Vinegar-based, not creamy. Don't write in.",
        price: 3,
        section: "sides",
        service: COUNTER,
        tags: ["Vegetarian"],
    },
    {
        id: "crab-chips",
        name: "Utz Crab Chips",
        desc: "Old Bay on a Hanover kettle chip. The county's real state snack.",
        price: 4,
        section: "sides",
        service: EVERYWHERE,
        tags: ["Local"],
        popular: true,
    },
    {
        id: "berger",
        name: "Berger cookies, 2-pack",
        desc: "Baltimore fudge on a shortbread base — less a cookie than a delivery system.",
        price: 4.5,
        section: "sides",
        service: EVERYWHERE,
        tags: ["Local"],
    },
    {
        id: "cookie",
        name: "Chocolate chip cookie",
        desc: "Baked here on the mornings someone remembers.",
        price: 3,
        section: "sides",
        service: COUNTER,
        tags: ["Vegetarian"],
    },
    {
        id: "ice-cream",
        name: "Ice cream bar",
        desc: "Klondike, Drumstick, or a Choco Taco if we found a case.",
        price: 4,
        section: "sides",
        service: EVERYWHERE,
    },
    { id: "jerky", name: "Beef jerky stick", desc: "Original or teriyaki. Lives by the register.", price: 3, section: "sides", service: EVERYWHERE },
    {
        id: "trail-mix",
        name: "Trail mix",
        desc: "Peanuts, raisins and M&Ms, eaten mostly for the M&Ms.",
        price: 4,
        section: "sides",
        service: EVERYWHERE,
        tags: ["Vegetarian"],
    },
    {
        id: "peanuts",
        name: "Salted peanuts",
        desc: "In the shell. Shells go in the cart, not on the fairway.",
        price: 3,
        section: "sides",
        service: EVERYWHERE,
    },

    /* ---- beer & seltzer ---- */
    {
        id: "boh",
        name: "National Bohemian, 16 oz",
        desc: "Natty Boh. The county's default.",
        price: 6,
        section: "beer",
        service: EVERYWHERE,
        tags: ["Local"],
        popular: true,
    },
    { id: "light-lager", name: "Miller Lite / Coors Light, 16 oz", desc: "Cold, cheap, unremarkable.", price: 6, section: "beer", service: EVERYWHERE },
    {
        id: "denizens",
        name: "Denizens Born Bohemian lager",
        desc: "Silver Spring. Crisp enough for a July afternoon.",
        price: 8,
        section: "beer",
        service: EVERYWHERE,
        tags: ["Local"],
    },
    {
        id: "flying-dog",
        name: "Flying Dog Old Scratch amber",
        desc: "Frederick, MD. A little malt for a cold morning.",
        price: 8,
        section: "beer",
        service: COUNTER,
        tags: ["Local"],
    },
    {
        id: "7-locks",
        name: "7 Locks Surrender Dorothy IPA",
        desc: "Rockville. Hoppy, and it will find you by 14.",
        price: 8.5,
        section: "beer",
        service: COUNTER,
        tags: ["Local"],
    },
    { id: "seltzer", name: "Hard seltzer", desc: "White Claw or Truly — black cherry, lime, mango.", price: 7, section: "beer", service: EVERYWHERE },

    {
        id: "union-duckpin",
        name: "Union Craft Duckpin pale ale",
        desc: "Baltimore. Citrusy, easy, the can everybody recognises.",
        price: 8,
        section: "beer",
        service: EVERYWHERE,
        tags: ["Local"],
    },
    {
        id: "dc-brau",
        name: "DC Brau The Public pale ale",
        desc: "Northeast DC. A little bite for the back nine.",
        price: 8,
        section: "beer",
        service: COUNTER,
        tags: ["Local"],
    },
    {
        id: "heavy-seas",
        name: "Heavy Seas Loose Cannon IPA",
        desc: "Halethorpe, MD. Seven-plus percent — pace yourself.",
        price: 8.5,
        section: "beer",
        service: COUNTER,
        tags: ["Local"],
    },
    {
        id: "flying-dog-ipa",
        name: "Flying Dog Easy IPA",
        desc: "Frederick. Sessionable, which is rather the point at 11 AM.",
        price: 8,
        section: "beer",
        service: EVERYWHERE,
        tags: ["Local"],
    },
    {
        id: "yuengling",
        name: "Yuengling Lager, 16 oz",
        desc: "Pottsville. Oldest brewery in America, cheapest amber on the cart.",
        price: 6.5,
        section: "beer",
        service: EVERYWHERE,
    },
    {
        id: "mich-ultra",
        name: "Michelob Ultra, 16 oz",
        desc: "Ninety-five calories, and every fourth cart holder has one.",
        price: 6.5,
        section: "beer",
        service: EVERYWHERE,
    },
    { id: "modelo", name: "Modelo Especial, 16 oz", desc: "With a lime, if the kitchen has one cut.", price: 7, section: "beer", service: COUNTER },

    /* ---- canned cocktails ---- */
    {
        id: "high-noon",
        name: "High Noon vodka soda",
        desc: "Pineapple, grapefruit, black cherry, lime.",
        price: 9,
        section: "cocktails",
        service: EVERYWHERE,
        popular: true,
    },
    {
        id: "transfusion",
        name: "Canned transfusion",
        desc: "Vodka, Concord grape, ginger ale. The golf drink.",
        price: 10,
        section: "cocktails",
        service: EVERYWHERE,
    },
    { id: "cutwater-marg", name: "Cutwater tequila margarita", desc: "Twelve ounces, and it is not weak.", price: 10, section: "cocktails", service: COUNTER },
    { id: "ranch-water", name: "Ranch water", desc: "Tequila, lime, sparkling water. Nothing else.", price: 9, section: "cocktails", service: COUNTER },

    {
        id: "orange-crush",
        name: "Canned orange crush",
        desc: "Orange vodka, triple sec, soda — the Eastern Shore's contribution to civilisation.",
        price: 10,
        section: "cocktails",
        service: EVERYWHERE,
        tags: ["Local"],
        popular: true,
    },
    {
        id: "old-bay-bloody",
        name: "Old Bay bloody mary",
        desc: "Canned, rimmed in Old Bay at the counter. Mornings only, sensibly.",
        price: 11,
        section: "cocktails",
        service: GRILL_ONLY,
        tags: ["Local"],
    },
    { id: "cutwater-mule", name: "Cutwater vodka mule", desc: "Ginger, lime, and a copper-coloured can.", price: 10, section: "cocktails", service: COUNTER },
    {
        id: "nutrl",
        name: "NUTRL vodka seltzer",
        desc: "Four ingredients, none of them interesting, and that's the appeal.",
        price: 9,
        section: "cocktails",
        service: EVERYWHERE,
    },

    /* ---- wine, Crossvines only ---- */
    {
        id: "cv-chardonnay",
        name: "Crossvines estate Chardonnay, glass",
        desc: "Stainless, unoaked, Montgomery County fruit.",
        price: 12,
        section: "wine",
        service: GRILL_ONLY,
        only: ["crossvines"],
        tags: ["Local"],
        popular: true,
    },
    {
        id: "cv-cab-franc",
        name: "Estate Cabernet Franc, glass",
        desc: "The grape Maryland grows best. Peppery, medium-bodied.",
        price: 13,
        section: "wine",
        service: GRILL_ONLY,
        only: ["crossvines"],
        tags: ["Local"],
    },
    {
        id: "cv-rose",
        name: "Dry rosé, glass",
        desc: "Chambourcin, pressed off the skins in an afternoon.",
        price: 11,
        section: "wine",
        service: GRILL_ONLY,
        only: ["crossvines"],
    },
    {
        id: "cv-old-line",
        name: "Old Line red blend, glass",
        desc: "Cab Franc and Merlot from the co-op growers.",
        price: 12,
        section: "wine",
        service: GRILL_ONLY,
        only: ["crossvines"],
    },
    {
        id: "cv-bottle",
        name: "Bottle to the terrace",
        desc: "Any estate pour by the bottle, opened at your table. Not permitted on the course.",
        price: 16,
        section: "wine",
        service: GRILL_ONLY,
        only: ["crossvines"],
    },

    {
        id: "cv-albarino",
        name: "Estate Albarino, glass",
        desc: "Saline and bright — the one to drink with the crab cake.",
        price: 13,
        section: "wine",
        service: GRILL_ONLY,
        only: ["crossvines"],
        tags: ["Local"],
    },
    {
        id: "cv-vidal",
        name: "Vidal Blanc, glass",
        desc: "Off-dry, peachy, and the bottle the tasting room sells most of.",
        price: 11,
        section: "wine",
        service: GRILL_ONLY,
        only: ["crossvines"],
        tags: ["Local"],
    },
    {
        id: "cv-flight",
        name: "Tasting flight, four pours",
        desc: "Two ounces each of whatever's open. Terrace only.",
        price: 18,
        section: "wine",
        service: GRILL_ONLY,
        only: ["crossvines"],
    },

    /* ---- non-alcoholic ---- */
    { id: "coffee", name: "Coffee", desc: "Twelve or sixteen ounces, black or with cream.", price: 3.5, section: "na", service: COUNTER },
    { id: "fountain", name: "Fountain soda", desc: "Free refills at the counter, not at the window.", price: 3.5, section: "na", service: COUNTER },
    { id: "water", name: "Bottled water", desc: "Cold. Take two, it's August.", price: 3.5, section: "na", service: EVERYWHERE },
    { id: "gatorade", name: "Gatorade", desc: "Lemon-lime, fruit punch, glacier freeze.", price: 4, section: "na", service: EVERYWHERE },
    {
        id: "arnold-palmer",
        name: "Arnold Palmer",
        desc: "Half tea, half lemonade, as intended.",
        price: 4.5,
        section: "na",
        service: EVERYWHERE,
        popular: true,
    },
    { id: "cold-brew", name: "Cold brew", desc: "Sixteen ounces over ice, and stronger than it tastes.", price: 4.5, section: "na", service: COUNTER },
    {
        id: "hot-chocolate",
        name: "Hot chocolate",
        desc: "November through March, and worth the wait in February.",
        price: 3.5,
        section: "na",
        service: COUNTER,
    },
    { id: "lemonade", name: "Fresh lemonade", desc: "Squeezed here. Strawberry on summer weekends.", price: 4, section: "na", service: COUNTER },
    { id: "bottled-soda", name: "Bottled soda", desc: "Coke, Diet Coke, Sprite, ginger ale.", price: 3.5, section: "na", service: EVERYWHERE },
    {
        id: "body-armor",
        name: "BodyArmor",
        desc: "Coconut water in it, allegedly. Cold, which is the part that matters.",
        price: 4.5,
        section: "na",
        service: EVERYWHERE,
    },
    { id: "red-bull", name: "Red Bull", desc: "Regular or sugar-free, for the second eighteen.", price: 5, section: "na", service: EVERYWHERE },
    {
        id: "athletic-na",
        name: "Athletic Brewing NA golden",
        desc: "Tastes like beer, drives home fine, no ID needed.",
        price: 6,
        section: "na",
        service: EVERYWHERE,
    },
    { id: "sparkling-water", name: "Sparkling water", desc: "Lime or plain, in a can that fits the holder.", price: 3.5, section: "na", service: EVERYWHERE },
    { id: "iced-tea", name: "Iced tea", desc: "Brewed here. Sweet or unsweet.", price: 3.5, section: "na", service: COUNTER },
];

/** Everything a given venue can sell. */
export const menuFor = (slug: string): MenuItem[] => {
    const venue = venueBySlug(slug);
    if (!venue) return [];
    return MENU.filter((item) => item.service.includes(venue.kind) && (!item.only || item.only.includes(slug)));
};

/** A venue's menu grouped into its sections, empty sections dropped. */
export const sectionsFor = (slug: string): { section: MenuSection; items: MenuItem[] }[] => {
    const items = menuFor(slug);
    return MENU_SECTIONS.map((section) => ({ section, items: items.filter((i) => i.section === section.id) })).filter((g) => g.items.length > 0);
};

export const itemById = (id: string): MenuItem | undefined => MENU.find((i) => i.id === id);

const ALCOHOL_SECTIONS = new Set<SectionId>(MENU_SECTIONS.filter((s) => s.alcohol).map((s) => s.id));

export const isAlcohol = (item: MenuItem): boolean => ALCOHOL_SECTIONS.has(item.section);

/** Money is added up in cents and handed back in dollars, so a combo never lands on $16.999999. */
const round2 = (n: number) => Math.round(n * 100) / 100;

/* ------------------------------------------------------------------ */
/* The clock                                                           */
/* ------------------------------------------------------------------ */

/**
 * The prototype's wall clock, in minutes past midnight.
 *
 * Deals are the first thing on these screens that is *only true sometimes*, so the
 * prototype needs a clock the way it already needs a date. 9:20 AM on the prototype's
 * Friday is the hour the rest of the grill data assumes: order now, collect at the
 * counter at 9:35, make the turn a little after 11. A story can move it with the
 * screen's `nowMinutes` prop rather than by mocking `Date`.
 */
export const NOW_MINUTES = 9 * 60 + 20;

/** 570 -> "9:30 AM". */
export const clockLabel = (minutes: number): string => {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    const suffix = h < 12 ? "AM" : "PM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
};

/* ------------------------------------------------------------------ */
/* Deals                                                               */
/* ------------------------------------------------------------------ */

/**
 * Offers — the combos, turn specials and bundles posted above the board.
 *
 * A golf grill's deals are not marketing copy, they're operational: the combo exists
 * because ringing three items takes longer than ringing one, the turn special exists
 * to move the 10:45 rush off the window, the early-bird exists because the 6:30 wave
 * would otherwise eat in the car. So they are modelled as data, next to the menu they
 * discount, rather than hardcoded into the screen:
 *
 *  - An offer lists **what's included** by menu item id, so its à-la-carte total is
 *    computed from the board and can never drift out of step with a price change.
 *  - Its **venue gating is derived**, not declared twice. An offer can only be honoured
 *    by a kind of operation that can produce every item in it — put a burger in a combo
 *    and the combo is grill-only by construction, because the burger is. Same for
 *    `only`: a crab-cake combo inherits the crab cake's three courses.
 *  - A **time window** is minutes past midnight, compared against the prototype clock.
 *    Out-of-window offers are shown rather than hidden — a golfer who missed the
 *    early-bird by ten minutes should be able to see that's what happened.
 *  - The **alcohol split survives the discount**. A dog-and-a-beer combo is part food
 *    at 6% and part beer at 9%, so the discount is applied pro rata and the beer's
 *    share rides on the order line. This is why `OrderLine` carries `alcoholPrice`.
 */
export type OfferKind = "combo" | "turn" | "time" | "bundle";

export const OFFER_KIND_LABEL: Record<OfferKind, string> = {
    combo: "Combo",
    turn: "At the turn",
    time: "Limited hours",
    bundle: "Golf bundle",
};

export const OFFER_KIND_COLOR: Record<OfferKind, "brand" | "blue" | "orange" | "purple"> = {
    combo: "brand",
    turn: "blue",
    time: "orange",
    bundle: "purple",
};

/** A window in the day, in minutes past midnight. `to` is exclusive. */
export interface TimeWindow {
    from: number;
    to: number;
    /** How the shelf says it in one phrase: "Before 8 AM". */
    label: string;
}

export const OFFER_WINDOWS = {
    earlyBird: { from: 5 * 60 + 30, to: 8 * 60, label: "Before 8 AM" },
    twilight: { from: 17 * 60, to: 20 * 60, label: "After 5 PM" },
} satisfies Record<string, TimeWindow>;

/** One line of an offer, as authored. Either a menu item, or an extra with its own price. */
export interface OfferInclusionSpec {
    /** A menu item id — the usual case, and the one that keeps pricing honest. */
    itemId?: string;
    /** Something that isn't food: a bucket of range balls, say. */
    label?: string;
    /** À-la-carte price of that extra. Ignored when `itemId` is set. */
    price?: number;
    qty: number;
}

/** One line of an offer, resolved: a name, a count, and what it costs on its own. */
export interface OfferPart {
    itemId?: string;
    label: string;
    qty: number;
    /** À-la-carte unit price. */
    unit: number;
    alcohol: boolean;
}

export interface Offer {
    id: string;
    name: string;
    kind: OfferKind;
    /** One line on why this exists, in the voice of the counter. */
    blurb: string;
    includes: OfferPart[];
    /** What the parts cost bought separately. Computed from the board. */
    alaCarte: number;
    /** What the offer costs. */
    price: number;
    /** `alaCarte - price`, computed. */
    saving: number;
    /** Kinds of operation that can honour it — intersected with every item's `service`. */
    service: VenueKind[];
    /** Course slugs it exists at, when any included item is course-specific. */
    only?: string[];
    /** Hours it can be ordered in. Absent means all day. */
    window?: TimeWindow;
    /** A pickup point the offer is built around — selecting it moves the rail. */
    pickup?: PickupId;
    /** The alcohol share of `price`, after the discount is applied pro rata. */
    alcoholPrice: number;
    tags?: string[];
}

interface OfferSpec extends Omit<Offer, "includes" | "alaCarte" | "saving" | "service" | "alcoholPrice"> {
    includes: OfferInclusionSpec[];
    /** Upper bound on where it can run. Narrowed by what the included items need. */
    service?: VenueKind[];
}

/**
 * Resolve one authored offer against the board: price the parts, derive the venue
 * gating from them, and split the discounted price between food and alcohol.
 */
const buildOffer = (spec: OfferSpec): Offer => {
    const resolved = spec.includes.map((inc) => {
        const item = inc.itemId ? itemById(inc.itemId) : undefined;
        if (inc.itemId && !item) throw new Error(`Offer ${spec.id} references a menu item that doesn't exist: ${inc.itemId}`);
        const unit = item ? item.price : (inc.price ?? 0);
        const part: OfferPart = { itemId: item?.id, label: item?.name ?? inc.label ?? "", qty: inc.qty, unit, alcohol: item ? isAlcohol(item) : false };
        return { part, item };
    });

    const parts = resolved.map((r) => r.part);
    const items = resolved.map((r) => r.item).filter((i): i is MenuItem => Boolean(i));

    const alaCarte = round2(parts.reduce((n, p) => n + p.unit * p.qty, 0));
    const boozeAlaCarte = parts.reduce((n, p) => n + (p.alcohol ? p.unit * p.qty : 0), 0);

    // Gating falls out of the contents: only an operation that can make every item can
    // honour the offer, and a course-specific item makes the whole offer course-specific.
    const service = (spec.service ?? EVERYWHERE).filter((kind) => items.every((i) => i.service.includes(kind)));
    const onlyLists = [spec.only, ...items.map((i) => i.only)].filter((l): l is string[] => Boolean(l));
    const only = onlyLists.length ? onlyLists.reduce((acc, list) => acc.filter((slug) => list.includes(slug))) : undefined;

    // The discount comes off food and alcohol in proportion, so Maryland's two rates
    // still apply to the right money.
    const alcoholPrice = alaCarte > 0 ? round2(spec.price * (boozeAlaCarte / alaCarte)) : 0;

    return { ...spec, includes: parts, alaCarte, saving: round2(alaCarte - spec.price), service, only, alcoholPrice };
};

const OFFER_SPECS: OfferSpec[] = [
    /* ---- combos: one ring instead of three ---- */
    {
        id: "combo-burger",
        name: "The Turn Combo",
        kind: "combo",
        blurb: "The burger everyone orders, with the fries and the drink they order after it.",
        includes: [
            { itemId: "mcg-burger", qty: 1 },
            { itemId: "fries", qty: 1 },
            { itemId: "fountain", qty: 1 },
        ],
        price: 17,
    },
    {
        id: "combo-dog-can",
        name: "Dog & a Can",
        kind: "combo",
        blurb: "The whole muni lunch: a dog off the grill, crab chips, and something cold.",
        includes: [
            { itemId: "turn-dog", qty: 1 },
            { itemId: "crab-chips", qty: 1 },
            { itemId: "boh", qty: 1 },
        ],
        price: 14,
    },
    {
        id: "combo-breakfast",
        name: "First Tee Breakfast",
        kind: "combo",
        blurb: "Sandwich and a coffee, in a bag, in the time it takes to check in.",
        includes: [
            { itemId: "sausage-egg", qty: 1 },
            { itemId: "coffee", qty: 1 },
        ],
        price: 8.5,
    },
    {
        id: "combo-wrap",
        name: "Wrap & Go",
        kind: "combo",
        blurb: "Nothing to cook, so it's over the counter before you've put your card away.",
        includes: [
            { itemId: "caesar-wrap", qty: 1 },
            { itemId: "chips", qty: 1 },
            { itemId: "water", qty: 1 },
        ],
        price: 16,
    },
    {
        id: "combo-tenders",
        name: "Tenders Basket Combo",
        kind: "combo",
        blurb: "Four tenders, fries and a fountain drink — the league-night order.",
        includes: [
            { itemId: "tenders", qty: 1 },
            { itemId: "fountain", qty: 1 },
        ],
        price: 13.5,
    },
    {
        id: "combo-crab-cake",
        name: "Crab Cake Plate",
        kind: "combo",
        blurb: "The broiled jumbo lump with fries and an iced tea. The reason to eat here.",
        includes: [
            { itemId: "crab-cake", qty: 1 },
            { itemId: "fries", qty: 1 },
            { itemId: "iced-tea", qty: 1 },
        ],
        price: 21.5,
        tags: ["Local"],
    },
    {
        id: "combo-junior",
        name: "Junior Turn Meal",
        kind: "combo",
        blurb: "Dog, chips and a Gatorade for whoever's carrying seven clubs. Twelve and under.",
        includes: [
            { itemId: "turn-dog", qty: 1 },
            { itemId: "crab-chips", qty: 1 },
            { itemId: "gatorade", qty: 1 },
        ],
        price: 11,
    },

    /* ---- turn specials: order before you tee off, collect at the turn ---- */
    {
        id: "turn-two",
        name: "Two at the Turn",
        kind: "turn",
        blurb: "Placed before you tee off, bagged for 10 o'clock. Cheaper than standing in the line at the window.",
        includes: [
            { itemId: "turn-dog", qty: 2 },
            { itemId: "fountain", qty: 2 },
        ],
        price: 16,
        pickup: "turn",
    },
    {
        id: "turn-chili",
        name: "Chili at the Turn",
        kind: "turn",
        blurb: "A cup, a pretzel and a coffee waiting at the window — the October order.",
        includes: [
            { itemId: "chili-cup", qty: 1 },
            { itemId: "pretzel", qty: 1 },
            { itemId: "coffee", qty: 1 },
        ],
        price: 13,
        pickup: "turn",
    },
    {
        id: "turn-crab-dip",
        name: "Crab Dip at the Turn",
        kind: "turn",
        blurb: "Ordered on the 6th, broiled while you play 8 and 9, two cans on the side.",
        includes: [
            { itemId: "crab-dip", qty: 1 },
            { itemId: "boh", qty: 2 },
        ],
        price: 22,
        pickup: "turn",
        tags: ["Local"],
    },

    /* ---- time-based ---- */
    {
        id: "early-bird",
        name: "Early Bird Breakfast",
        kind: "time",
        blurb: "For the 6:30 wave. Bacon, egg and cheese, home fries and a coffee before the sun clears the trees.",
        includes: [
            { itemId: "bacon-egg", qty: 1 },
            { itemId: "home-fries", qty: 1 },
            { itemId: "coffee", qty: 1 },
        ],
        price: 11,
        window: OFFER_WINDOWS.earlyBird,
    },
    {
        id: "dawn-patrol",
        name: "Dawn Patrol",
        kind: "time",
        blurb: "A bagel and a coffee, because the window opens before the kitchen does.",
        includes: [
            { itemId: "bagel", qty: 1 },
            { itemId: "coffee", qty: 1 },
        ],
        price: 6,
        window: OFFER_WINDOWS.earlyBird,
    },
    {
        id: "twilight-dog",
        name: "Twilight Dog & Beer",
        kind: "time",
        blurb: "Twilight rate on the tee, twilight rate at the counter. Nine holes and something to carry round them.",
        includes: [
            { itemId: "turn-dog", qty: 1 },
            { itemId: "boh", qty: 1 },
        ],
        price: 10,
        window: OFFER_WINDOWS.twilight,
    },
    {
        id: "sunset-terrace",
        name: "Sunset on the Terrace",
        kind: "time",
        blurb: "A flatbread out of the wood oven and two glasses of the estate rosé, after the last group is through.",
        includes: [
            { itemId: "flatbread", qty: 1 },
            { itemId: "cv-rose", qty: 2 },
        ],
        price: 30,
        window: OFFER_WINDOWS.twilight,
        tags: ["Local"],
    },

    /* ---- bundles tied to the golf ---- */
    {
        id: "bundle-range",
        name: "Balls & Breakfast",
        kind: "bundle",
        blurb: "Sandwich, coffee and a large bucket, so the warm-up and the breakfast are one transaction.",
        includes: [
            { itemId: "sausage-egg", qty: 1 },
            { itemId: "coffee", qty: 1 },
            { label: "Large bucket of range balls", price: 7, qty: 1 },
        ],
        price: 14,
        only: ["needwood", "northwest"],
    },
    {
        id: "bundle-foursome",
        name: "Foursome Pack",
        kind: "bundle",
        blurb: "Four dogs and four cans, rung once, so nobody has to work out who owes what.",
        includes: [
            { itemId: "turn-dog", qty: 4 },
            { itemId: "boh", qty: 4 },
        ],
        price: 40,
    },
    {
        id: "bundle-cooler",
        name: "Cart Cooler Six",
        kind: "bundle",
        blurb: "Six cans and a bag of crab chips, iced and handed over in one go. The cart will carry it out.",
        includes: [
            { itemId: "boh", qty: 6 },
            { itemId: "crab-chips", qty: 1 },
        ],
        price: 34,
    },
    {
        id: "bundle-hydration",
        name: "Hydration Pack",
        kind: "bundle",
        blurb: "Two waters and two Gatorades. In August this is not optional.",
        includes: [
            { itemId: "water", qty: 2 },
            { itemId: "gatorade", qty: 2 },
        ],
        price: 12,
    },
];

export const OFFERS: Offer[] = OFFER_SPECS.map(buildOffer);

export const offerById = (id: string): Offer | undefined => OFFERS.find((o) => o.id === id);

/** Whether the clock allows this offer right now. An offer with no window is always on. */
export const offerIsOpen = (offer: Offer, nowMinutes: number = NOW_MINUTES): boolean =>
    !offer.window || (nowMinutes >= offer.window.from && nowMinutes < offer.window.to);

/** Why a closed offer is closed, in the words the shelf uses. */
export const offerWindowNote = (offer: Offer, nowMinutes: number = NOW_MINUTES): string | undefined => {
    if (!offer.window) return undefined;
    if (nowMinutes < offer.window.from) return `Opens ${clockLabel(offer.window.from)}`;
    if (nowMinutes >= offer.window.to) return `Ended ${clockLabel(offer.window.to)} — back tomorrow`;
    return `${offer.window.label} · until ${clockLabel(offer.window.to)}`;
};

const OFFER_KIND_ORDER: OfferKind[] = ["combo", "turn", "time", "bundle"];

/**
 * The deals a venue can honour, live ones first.
 *
 * A beverage cart gets a short list rather than an empty one — a six-pack and a cooler
 * of water are exactly what a cart *can* do — but it still can't honour a combo with a
 * burger in it, because it has no flat-top, and it never had to be told so.
 */
export const offersFor = (slug: string, nowMinutes: number = NOW_MINUTES): { offer: Offer; open: boolean }[] => {
    const venue = venueBySlug(slug);
    if (!venue) return [];
    return OFFERS.filter((o) => o.service.includes(venue.kind) && (!o.only || o.only.includes(slug)))
        .map((offer) => ({ offer, open: offerIsOpen(offer, nowMinutes) }))
        .sort(
            (a, b) =>
                Number(b.open) - Number(a.open) ||
                OFFER_KIND_ORDER.indexOf(a.offer.kind) - OFFER_KIND_ORDER.indexOf(b.offer.kind) ||
                b.offer.saving - a.offer.saving,
        );
};

/** A one-line summary of an offer's contents, for an order line and a receipt. */
export const offerSummary = (offer: Offer): string => offer.includes.map((p) => (p.qty > 1 ? `${p.qty}× ${p.label}` : p.label)).join(" · ");

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

export interface OrderLine {
    /** Menu item id, or offer id when this line is a deal. Also the React key. */
    itemId: string;
    name: string;
    /** What this line is charged at — already discounted, when it's an offer. */
    price: number;
    qty: number;
    alcohol: boolean;
    /** Set when the line is an offer rather than a single item. */
    offerId?: string;
    /** What the line contains, for the rail and the receipt. */
    detail?: string;
    /** Menu price of one, when that differs from `price`. The saving is the gap. */
    alaCarte?: number;
    /**
     * The alcohol share of `price`, when a line mixes the two — a dog-and-a-beer combo
     * is 6% on the dog and 9% on the beer. Absent means `alcohol` decides the whole line.
     */
    alcoholPrice?: number;
}

/** Turn an offer into a line the rail and the receipt can carry. */
export const offerLine = (offer: Offer, qty = 1): OrderLine => ({
    itemId: offer.id,
    offerId: offer.id,
    name: offer.name,
    detail: offerSummary(offer),
    price: offer.price,
    alaCarte: offer.alaCarte,
    alcoholPrice: offer.alcoholPrice > 0 ? offer.alcoholPrice : undefined,
    alcohol: offer.alcoholPrice > 0,
    qty,
});

export interface GrillOrder {
    /** What the golfer reads out at the window, e.g. "MCG-4821". */
    number: string;
    venueSlug: string;
    lines: OrderLine[];
    pickup: PickupId;
    /** Human window, e.g. "Ready 11:05 – 11:20 AM". */
    readyLabel: string;
    placedLabel: string;
    isoDate: string;
    subtotal: number;
    /** What the deals on this order took off the à-la-carte total. */
    savings: number;
    /** Maryland: 6% on food. */
    foodTax: number;
    /** Maryland: 9% on alcohol. */
    alcoholTax: number;
    total: number;
    /** Anything the golfer typed — cart number, allergy, "no onions". */
    note?: string;
}

export const MD_FOOD_TAX = 0.06;
export const MD_ALCOHOL_TAX = 0.09;

/**
 * Split the bill the way Maryland does, then add it back up.
 *
 * A plain item is wholly food or wholly alcohol. An offer can be both — the discount
 * is already apportioned on the line, so the two rates land on the right money — and
 * it carries the à-la-carte price it was struck from, which is where `savings` comes
 * from. A line with no deal on it contributes nothing to the saving.
 */
export const priceOrder = (lines: OrderLine[]) => {
    let food = 0;
    let booze = 0;
    let savings = 0;

    for (const line of lines) {
        const alcoholPart = line.alcoholPrice ?? (line.alcohol ? line.price : 0);
        booze += alcoholPart * line.qty;
        food += (line.price - alcoholPart) * line.qty;
        savings += ((line.alaCarte ?? line.price) - line.price) * line.qty;
    }

    const foodTax = food * MD_FOOD_TAX;
    const alcoholTax = booze * MD_ALCOHOL_TAX;
    return {
        subtotal: round2(food + booze),
        savings: round2(savings),
        foodTax: round2(foodTax),
        alcoholTax: round2(alcoholTax),
        total: round2(food + booze + foodTax + alcoholTax),
    };
};

export const lineCount = (lines: OrderLine[]): number => lines.reduce((n, l) => n + l.qty, 0);

/** Six-hundred-odd orders into the season, which is about right for a Friday. */
export const nextOrderNumber = (): string => `MCG-${Math.floor(4000 + Math.random() * 1800)}`;

/**
 * Pickup windows, anchored to the prototype's "today" — the same date the tee sheet
 * opens on, so a lesson, a tee time and a burger all agree about what day it is.
 */
export const TODAY_LABEL = "Friday, June 19, 2026";
export const TODAY_ISO = "2026-06-19";

export const READY_WINDOW: Record<PickupId, string> = {
    turn: "Ready 11:05 – 11:20 AM, at the window",
    clubhouse: "Ready 9:35 – 9:50 AM, at the counter",
    after: "Ready 1:40 – 1:55 PM, on the patio",
};

/**
 * A stand-in order, so the confirmation screen renders the same way in Storybook as it
 * does after a real checkout. The prototype overwrites it with the golfer's own order.
 *
 * It carries a deal as well as plain items, because that's the case with the most to
 * show: a discounted line, a saving on the receipt, and a combo whose beer is still
 * taxed at 9% while its burger is taxed at 6%.
 */
const SAMPLE_LINES: OrderLine[] = [
    offerLine(offerById("combo-burger")!, 2),
    { itemId: "old-bay-fries", name: "Old Bay cheese fries", price: 8, qty: 1, alcohol: false },
    { itemId: "boh", name: "National Bohemian, 16 oz", price: 6, qty: 4, alcohol: true },
];

export const SAMPLE_ORDER: GrillOrder = {
    number: "MCG-4821",
    venueSlug: "falls-road",
    lines: SAMPLE_LINES,
    pickup: "turn",
    readyLabel: READY_WINDOW.turn,
    placedLabel: TODAY_LABEL,
    isoDate: TODAY_ISO,
    ...priceOrder(SAMPLE_LINES),
    note: "Cart 22 — we'll be on 9 around 11:10.",
};

/* ------------------------------------------------------------------ */
/* Order handoff                                                       */
/* ------------------------------------------------------------------ */

/**
 * The order-ahead handoff between `/grill` and `/grill/order`.
 *
 * A grill order deliberately does *not* go through the shared cart: it's paid at the
 * window, it can't be combined with a pro-shop shipment, and sweeping it into
 * `checkout()` would take an unrelated Pro Shop cart with it. The order is recorded in
 * the session as a `dining` activity — that's the durable record — and parked here for
 * the length of one hop so the confirmation can show the line items.
 */
const HANDOFF_KEY = "mcg-grill-order-v1";

export const stashOrder = (order: GrillOrder) => {
    try {
        window.sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(order));
    } catch {
        /* private window — the confirmation falls back to the sample */
    }
};

export const readStashedOrder = (): GrillOrder | null => {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.sessionStorage.getItem(HANDOFF_KEY);
        return raw ? (JSON.parse(raw) as GrillOrder) : null;
    } catch {
        return null;
    }
};

export const money = (n: number) => `$${n.toFixed(2)}`;
