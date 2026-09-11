/**
 * MCG Pro Shop — the hard goods, apparel rail and counter accessories.
 *
 * Backed by a shoot of 56 real product photographs (white background, one product each),
 * processed to `images/mcg-shop/goods/item-01.jpg … item-56.jpg` and served from the
 * `mcg-shop-images` staticDir at `mcg-shop-images/goods/<file>`. The map back to the
 * original screenshots is `images/mcg-shop/goods-sources.json`.
 *
 * Every product below was identified by eye from its photograph, and the names describe
 * only what is legible in the frame: where a brand mark reads (Titleist, FootJoy, Nike,
 * Callaway, Peter Millar, RAM, Pride, Ghost Golf, Stick It, MiLESEEY, World of Golf) it is
 * used, and where nothing is legible the item is described plainly and carries `Pro Shop`
 * as its brand rather than a guess. Photographs that could not be identified, that were
 * not shop merchandise, or that duplicate something already catalogued were deliberately
 * left out — 21 of the 56 frames are used here, as 19 products. The excluded frames are,
 * in short: the snack-bar food and drink shots (item-29 … item-49), a golf-cart vehicle
 * and an electric caddy, two licensed-novelty markers, a point-of-sale price-list
 * screenshot, and the boxed balls and range buckets that `./balls-catalog` already carries
 * with better multi-angle photography.
 *
 * That price-list screenshot (item-08) is the one frame that earned its keep without
 * becoming a product: it is the shop's own POS grid, and the ball prices in the sibling
 * catalog line up with it.
 *
 * Prices, ratings, stock and copy are ours, set for a county muni: one full boxed set at
 * $329, a junior set at $159, accessories from $6 to $38, and an apparel rail that tops
 * out at $99 — with the two Peter Millar polos carried as marked-down rail stock rather
 * than at resort prices. Slugs are unique against `../shop-catalog` and `./balls-catalog`.
 */
import type { ShopCategoryId, ShopColor, ShopProduct } from "@/components/mcg/shop-catalog";
import { asset } from "@/utils/asset";

/* ------------------------------------------------------------------ */
/* Imagery helpers                                                     */
/* ------------------------------------------------------------------ */

/** Processed hard-goods photography, served from `images/mcg-shop/goods`. */
const GOODS = (file: string) => asset(`mcg-shop-images/goods/${file}`);
const LOGO = (file: string) => asset(`store-images/logos/${file}`);

/** Only the marks that are actually legible on these photographs. */
const BRAND = {
    titleist: { name: "Titleist", logo: LOGO("logo-Titleist-5191ae6257.webp") },
    callaway: { name: "Callaway", logo: LOGO("logo-Callaway-1361699423.webp") },
    nike: { name: "Nike", logo: LOGO("logo-Nike-ca117a106f.webp") },
    footjoy: { name: "FootJoy", logo: LOGO("24_FJ_Jewel_K_3-063a2db0f2.webp") },
    peterMillar: { name: "Peter Millar" },
    ram: { name: "RAM" },
    pride: { name: "Pride" },
    ghost: { name: "Ghost Golf" },
    stickIt: { name: "Stick It" },
    mileseey: { name: "MiLESEEY" },
    worldOfGolf: { name: "World of Golf" },
    /** The honest label for stock whose maker's mark is not legible in the frame. */
    shop: { name: "Pro Shop" },
} satisfies Record<string, { name: string; logo?: string }>;

/** Colourways. Swatches are literal hex because they depict the garment, not the UI. */
const C = {
    black: { name: "Black", swatch: "#17181A" },
    white: { name: "White", swatch: "#F7F7F5" },
    plumPrint: { name: "Plum print", swatch: "#5A2340" },
    stormBlue: { name: "Storm blue", swatch: "#4A6FA5" },
    hotPink: { name: "Hot pink", swatch: "#F2569A" },
    pine: { name: "Pine", swatch: "#336B5E" },
    khakiMulti: { name: "Khaki multi", swatch: "#C7B79A" },
    teal: { name: "Teal", swatch: "#5FD3C4" },
    blackSilver: { name: "Black / silver", swatch: "#2A2C2F" },
} satisfies Record<string, ShopColor>;

/* ------------------------------------------------------------------ */
/* Shelves                                                             */
/* ------------------------------------------------------------------ */

/**
 * `ShopCategoryId` has no clubs, carts or belts shelf, so two items are approximated:
 * both boxed club sets sit under `bags` (the "Bags & clubs" shelf), and the Nike belt
 * sits under `accessories` rather than apparel.
 */
const BAGS: ShopCategoryId = "bags";
const ACCESSORIES: ShopCategoryId = "accessories";
const GLOVES: ShopCategoryId = "gloves";
const HEADWEAR: ShopCategoryId = "headwear";
const APPAREL: ShopCategoryId = "apparel";
const SHOES: ShopCategoryId = "shoes";

const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];
const WOMENS_SIZES = ["XS", "S", "M", "L", "XL"];
const GLOVE_SIZES = ["S", "M", "M/L", "L", "XL"];
const SHOE_SIZES = ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"];
const WAIST_SIZES = ["30", "32", "34", "36", "38", "40"];

/* ------------------------------------------------------------------ */
/* The goods                                                           */
/* ------------------------------------------------------------------ */

export const GOODS_PRODUCTS: ShopProduct[] = [
    /* --------------------------- Bags & clubs -------------------------- */
    {
        slug: "complete-golf-set-stand-bag",
        name: "Complete Golf Set with Stand Bag",
        category: BAGS,
        brand: BRAND.shop.name,
        image: GOODS("item-01.jpg"),
        price: 329,
        compareAt: 379,
        rating: 4.3,
        reviews: 46,
        inStock: false,
        blurb: "Woods, irons, putter and a black-and-silver stand bag in one box — the set we sell to golfers coming off the range for the first time.",
        details: [
            "Driver, fairway and hybrid, each under a matching headcover",
            "Matched iron set through the wedges",
            "Black and silver stand bag with a double carry strap and full-length dividers",
            "Right hand only",
            "No maker's mark legible on the bag — this is plain shop stock",
        ],
        colors: [C.blackSilver],
    },
    {
        slug: "ram-g-force-junior-set",
        name: "RAM G-Force Junior Set",
        category: BAGS,
        brand: BRAND.ram.name,
        image: GOODS("item-50.jpg"),
        price: 159,
        rating: 4.7,
        reviews: 52,
        inStock: true,
        blurb: "Four clubs and a teal stand bag, light enough that a nine-year-old can actually carry it round Sligo Creek.",
        details: [
            "Four clubs — driver, two irons and a putter",
            "Junior-length graphite shafts with junior grips",
            "Teal and white stand bag with a dual strap and its own legs",
            "G-Force branding on the bag panel",
            "Sized in-shop against the golfer's height",
        ],
        colors: [C.teal],
    },

    /* ------------------------------ Gloves ----------------------------- */
    {
        slug: "titleist-players-cabretta-glove",
        name: "Titleist Players Glove",
        category: GLOVES,
        brand: BRAND.titleist.name,
        brandLogo: BRAND.titleist.logo,
        image: GOODS("item-18.jpg"),
        gallery: [GOODS("item-18.jpg"), GOODS("item-19.jpg")],
        price: 28,
        rating: 4.7,
        reviews: 186,
        inStock: true,
        blurb: "Thin cabretta leather with the Titleist ball mark on the tab — the glove most of our regulars replace three times a season.",
        details: [
            "Cabretta leather palm and back",
            "Perforated fingers and knuckle panel",
            "Ball-mark closure tab",
            "Black-tab and white-tab versions both on the rack",
            "Left hand and right hand",
        ],
        sizes: GLOVE_SIZES,
        colors: [C.white],
    },

    /* ---------------------------- Accessories -------------------------- */
    {
        slug: "mileseey-handheld-golf-gps",
        name: "MiLESEEY Handheld Golf GPS",
        category: ACCESSORIES,
        brand: BRAND.mileseey.name,
        image: GOODS("item-04.jpg"),
        price: 149,
        rating: 4.2,
        reviews: 58,
        inStock: false,
        blurb: "Pocket GPS with the hole drawn on a colour screen and front, middle and back stacked down the left of it.",
        details: [
            "Colour touchscreen with a hole-by-hole course map",
            "Front, middle and back yardages on one screen",
            "Hazard and layup distances marked on the map",
            "Textured rubber body, one-button wake",
            "Rechargeable — clip it to the bag strap",
        ],
        colors: [C.black],
    },
    {
        slug: "titleist-pro-v1-golf-umbrella",
        name: "Titleist Pro V1 Golf Umbrella",
        category: ACCESSORIES,
        brand: BRAND.titleist.name,
        brandLogo: BRAND.titleist.logo,
        image: GOODS("item-06.jpg"),
        price: 38,
        rating: 4.5,
        reviews: 91,
        inStock: true,
        blurb: "Single-canopy black umbrella, white Titleist script across the top and Pro V1 on the panel. Lives in the bag sleeve from April on.",
        details: [
            "Single canopy with a white trim edge",
            "White Titleist script, Pro V1 on the side panel",
            "Straight rubber grip handle",
            "Fits a standard bag umbrella sleeve",
        ],
        colors: [C.black],
    },
    {
        slug: "stickit-slang-driver-headcover",
        name: "Stick It Slang Driver Headcover",
        category: ACCESSORIES,
        brand: BRAND.stickIt.name,
        image: GOODS("item-24.jpg"),
        price: 34,
        rating: 4.5,
        reviews: 43,
        inStock: true,
        blurb: "Green-and-yellow all-over print of everything your group already shouts: TAP IN, SANDIE, PRESS, BREAKFAST BALL.",
        details: [
            "Driver cover, long neck, padded shell",
            "All-over golf-slang print in yellow on green",
            "Stick It medallion badge on the crown",
            "Fits heads up to 460cc",
        ],
    },
    {
        slug: "ghost-golf-greenside-towel",
        name: "Ghost Golf Greenside Towel",
        category: ACCESSORIES,
        brand: BRAND.ghost.name,
        image: GOODS("item-23.jpg"),
        price: 30,
        rating: 4.6,
        reviews: 71,
        inStock: true,
        blurb: "Black waffle-weave towel with a grey border and the Ghost crest in the corner. Clips on and stays on.",
        details: [
            "Waffle-weave microfibre, grey bound edge",
            "Carabiner clip on the hanging tab",
            "Ghost Golf crest printed at the corner",
            "Machine washable, no fabric softener",
        ],
        colors: [C.black],
    },
    {
        slug: "nike-woven-stretch-belt",
        name: "Nike Woven Stretch Belt",
        category: ACCESSORIES,
        brand: BRAND.nike.name,
        brandLogo: BRAND.nike.logo,
        image: GOODS("item-17.jpg"),
        price: 32,
        rating: 4.4,
        reviews: 77,
        inStock: true,
        blurb: "Braided stretch webbing in khaki, grey and black, with a matte black swoosh buckle and a leather tip.",
        details: [
            "Braided elastic webbing — gives when you turn through the ball",
            "Matte black buckle with an embossed swoosh",
            "Leather keeper and tip",
            "Khaki, grey and black weave",
        ],
        sizes: ["30", "32", "34", "36", "38"],
        colors: [C.khakiMulti],
    },
    {
        slug: "callaway-scorecard-holder",
        name: "Callaway Scorecard Holder",
        category: ACCESSORIES,
        brand: BRAND.callaway.name,
        brandLogo: BRAND.callaway.logo,
        image: GOODS("item-25.jpg"),
        price: 18,
        rating: 4.3,
        reviews: 54,
        inStock: true,
        blurb: "Soft black folder with the Callaway script debossed on the front. Keeps the card flat and dry for eighteen holes.",
        details: [
            "Holds a standard scorecard and a pencil",
            "Debossed Callaway script and chevron",
            "Black synthetic leather, stitched edge",
            "Slips into a bag pocket",
        ],
        colors: [C.black],
    },
    {
        slug: "pride-prolength-tees-bag",
        name: 'Pride Professional Tee System — 2 ¾" Tees',
        category: ACCESSORIES,
        brand: BRAND.pride.name,
        image: GOODS("item-20.jpg"),
        price: 6,
        rating: 4.6,
        reviews: 231,
        inStock: true,
        blurb: "The yellow-striped counter bag. Two and three-quarter inch hardwood tees, and the stripe tells you how deep you pushed it.",
        details: [
            'ProLength, 2 ¾" (69 mm)',
            "Hardwood, painted white with a yellow stripe",
            "Marked on the pack for drivers under 360cc",
            "Sold from the counter rack",
        ],
    },
    {
        slug: "deluxe-vinyl-rain-poncho",
        name: "Deluxe Rain Poncho",
        category: ACCESSORIES,
        brand: BRAND.worldOfGolf.name,
        image: GOODS("item-05.jpg"),
        price: 12,
        rating: 4.1,
        reviews: 66,
        inStock: true,
        blurb: "Clear vinyl poncho in a hanging pouch — the $12 answer to a front coming over the ridge at Little Bennett.",
        details: [
            'One size fits most, 50" wide × 42" long',
            "100% waterproof vinyl",
            "Side-snap closure",
            "Attached hood with a draw cord",
            "Folds back into its own pouch",
        ],
        sizes: ["One size"],
    },

    /* ----------------------------- Headwear ---------------------------- */
    {
        slug: "titleist-script-cap-black",
        name: "Titleist Script Cap — Black",
        category: HEADWEAR,
        brand: BRAND.titleist.name,
        brandLogo: BRAND.titleist.logo,
        image: GOODS("item-13.jpg"),
        price: 30,
        rating: 4.5,
        reviews: 118,
        inStock: true,
        blurb: "Flat-brim black cap with the Titleist script picked out in tonal grey. Black on black, which is how most of them leave the shop.",
        details: ["Five-panel crown, flat brim", "Raised tonal grey Titleist script", "Adjustable rear closure", "One size"],
        sizes: ["One size"],
        colors: [C.black],
    },
    {
        slug: "titleist-pro-v1-visor-black",
        name: "Titleist Pro V1 Visor — Black",
        category: HEADWEAR,
        brand: BRAND.titleist.name,
        brandLogo: BRAND.titleist.logo,
        image: GOODS("item-14.jpg"),
        price: 26,
        rating: 4.4,
        reviews: 82,
        inStock: true,
        blurb: "Black performance visor, white Titleist script on the front and Pro V1 down the side band.",
        details: ["Unstructured performance fabric", "Raised white Titleist script", "Pro V1 printed on the side band", "Adjustable rear closure"],
        sizes: ["One size"],
        colors: [C.black],
    },

    /* ----------------------------- Apparel ----------------------------- */
    {
        slug: "footjoy-half-zip-wind-shirt",
        name: "FootJoy Half-Zip Wind Shirt",
        category: APPAREL,
        brand: BRAND.footjoy.name,
        brandLogo: BRAND.footjoy.logo,
        image: GOODS("item-15.jpg"),
        gallery: [GOODS("item-15.jpg"), GOODS("item-16.jpg")],
        price: 99,
        rating: 4.6,
        reviews: 103,
        inStock: true,
        blurb: "Plain black wind shirt that does the one job: cuts the breeze on the exposed holes without getting in the swing.",
        details: [
            "Wind-resistant woven shell",
            "Half zip with a stand collar and chin guard",
            "Two zipped hand pockets",
            "Elasticated cuffs, dropped tail",
            "FJ mark at the back neck",
        ],
        sizes: APPAREL_SIZES,
        colors: [C.black],
    },
    {
        slug: "peter-millar-print-jersey-polo",
        name: "Peter Millar Jersey Polo — Plum Print",
        category: APPAREL,
        brand: BRAND.peterMillar.name,
        image: GOODS("item-09.jpg"),
        price: 89,
        compareAt: 115,
        rating: 4.8,
        reviews: 64,
        inStock: true,
        blurb: "Marked down off the spring rail — performance jersey in a plum micro-print that reads solid from ten feet away.",
        details: [
            "Performance jersey with an all-over micro geometric print",
            "Self-fabric collar, three-button placket",
            "Crown mark on the left chest",
            "Machine wash cold, hang dry",
            "Marked down from $115",
        ],
        sizes: APPAREL_SIZES,
        colors: [C.plumPrint],
    },
    {
        slug: "peter-millar-stripe-jersey-polo",
        name: "Peter Millar Jersey Polo — Storm Stripe",
        category: APPAREL,
        brand: BRAND.peterMillar.name,
        image: GOODS("item-10.jpg"),
        price: 85,
        compareAt: 105,
        rating: 4.6,
        reviews: 57,
        inStock: false,
        blurb: "Fine white pencil stripe on storm blue. We had six, and the Tuesday league bought all six.",
        details: [
            "Performance jersey, fine white pencil stripe",
            "Knit spread collar, three-button placket",
            "Crown mark on the left chest",
            "Back in when the next rail order lands",
        ],
        sizes: APPAREL_SIZES,
        colors: [C.stormBlue],
    },
    {
        slug: "womens-polo-dress-pink",
        name: "Women's Golf Polo Dress",
        category: APPAREL,
        brand: BRAND.shop.name,
        image: GOODS("item-11.jpg"),
        price: 68,
        rating: 4.5,
        reviews: 44,
        inStock: true,
        blurb: "Hot pink piqué dress with a crisp white collar and cuffs — the women's league's warm-weather answer to a polo and a skort.",
        details: ["Stretch piqué with contrast white collar, placket and cuffs", "Three-button placket", "A-line skirt, above the knee", "XS–XL"],
        sizes: WOMENS_SIZES,
        colors: [C.hotPink],
    },
    {
        slug: "mens-flat-front-golf-shorts",
        name: "Men's Flat-Front Golf Shorts",
        category: APPAREL,
        brand: BRAND.shop.name,
        image: GOODS("item-12.jpg"),
        price: 52,
        rating: 4.2,
        reviews: 88,
        inStock: true,
        blurb: "Knee-length flat-front short in a muted pine green. Belt loops, real pockets, and nothing written on them.",
        details: ["Flat front with belt loops", "Knee-length cut", "Slash hand pockets and two rear pockets", "Woven stretch fabric", "Waist 30–40"],
        sizes: WAIST_SIZES,
        colors: [C.pine],
    },

    /* ------------------------------ Shoes ------------------------------ */
    {
        slug: "spikeless-golf-shoe-white",
        name: "Spikeless Golf Shoe — White",
        category: SHOES,
        brand: BRAND.shop.name,
        image: GOODS("item-07.jpg"),
        price: 109,
        rating: 4.3,
        reviews: 69,
        inStock: true,
        blurb: "White leather spikeless shoe with a red heel pull, on a lugged black outsole you can wear in from the car park.",
        details: [
            "Spikeless outsole with moulded traction lugs",
            "White leather upper, black trim and a red heel pull",
            "Perforated side panel",
            "Crest badge on the quarter — no legible maker's mark",
            "Men's 8–13",
        ],
        sizes: SHOE_SIZES,
        colors: [C.white],
    },
];

/* ------------------------------------------------------------------ */
/* Derived lookups                                                     */
/* ------------------------------------------------------------------ */

/** Every slug in this file, for merge checks against the other catalogs. */
export const GOODS_SLUGS = GOODS_PRODUCTS.map((p) => p.slug);

export const goodsBySlug = (slug: string): ShopProduct | undefined => GOODS_PRODUCTS.find((p) => p.slug === slug);
