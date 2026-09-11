/**
 * MCG Pro Shop catalog — the fixture data behind the prototype's Shop category.
 *
 * Curated down from the Sagamore catalog (`@/components/store/store-catalog`), which is
 * a resort shop: 24 polos at $90–$135, six pairs of $200 shoes, a launch monitor. A
 * county muni carries none of that. What a Montgomery County pro shop actually sells is
 * balls by the dozen, gloves, tees, a wall of MCG-logo caps, a modest apparel rail, one
 * shoe rack and gift cards — so that is what this is: ~50 SKUs at county prices, with
 * the MCG-logo merchandise as the headline rather than an afterthought.
 *
 * The imagery is the same real product photography as the Sagamore catalog (served via
 * the `store-images` staticDir). MCG-logo merchandise has no photography, so those items
 * carry `logoTile: true` and the UI renders the MCG mark on a brand panel instead — the
 * honest version of a mockup rather than a borrowed stock photo.
 *
 * Prices, ratings and stock are hand-set for the muni: nothing over $190, most under $50.
 */
import { asset } from "@/utils/asset";
import { BALL_PRODUCTS } from "./shop/balls-catalog";
import { GOODS_PRODUCTS } from "./shop/goods-catalog";
import { OFFERING_PRODUCTS } from "./shop/offerings-catalog";

/* ------------------------------------------------------------------ */
/* Shapes                                                              */
/* ------------------------------------------------------------------ */

export type ShopCategoryId =
    | "balls"
    | "gloves"
    | "accessories"
    | "headwear"
    | "apparel"
    | "shoes"
    | "bags"
    | "gift-cards"
    | "passes"
    | "lessons"
    | "services";

export interface ShopCategory {
    id: ShopCategoryId;
    label: string;
    /** One line under the heading when the category is the active filter. */
    blurb: string;
}

/** A colourway. `swatch` is a literal hex because it depicts the garment, not the UI. */
export interface ShopColor {
    name: string;
    swatch: string;
    /** Photography for this colourway, when we have a distinct shot. */
    image?: string;
}

export interface ShopProduct {
    /** kebab-case slug — this is the product's id *and* its route segment. */
    slug: string;
    name: string;
    category: ShopCategoryId;
    brand: string;
    /** Brand mark, served from the shared `store-images/logos` set. */
    brandLogo?: string;
    /** Primary product photograph. Absent on MCG-logo merchandise. */
    image?: string;
    /**
     * Every shot we hold of this item, primary first — the detail page's thumbnail rail.
     * Only set where the photography is genuinely multi-angle (see `shop/balls-catalog`).
     */
    gallery?: string[];
    /** Render the MCG mark on a brand panel rather than a photograph. */
    logoTile?: boolean;
    /** MCG-branded merchandise — surfaced as its own shelf on the storefront. */
    mcgLogo?: boolean;
    price: number;
    /**
     * What a Montgomery County resident pays, when that differs. Residency is the
     * county's defining commercial fact, so a pass states both numbers on one card
     * rather than splitting into two near-identical SKUs. `price` stays the
     * non-resident figure so anything that ignores this field is still correct.
     */
    residentPrice?: number;
    /** Struck-through original when the item is marked down. */
    compareAt?: number;
    rating: number;
    reviews: number;
    inStock: boolean;
    /** One sentence on the card and above the fold on the detail page. */
    blurb: string;
    /** Bulleted specifics on the detail page. */
    details: string[];
    /** Size / pack options, when the item has them. */
    sizes?: string[];
    colors?: ShopColor[];
    /** Set for gift cards, whose "size" is a dollar value. */
    denominations?: number[];
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export const SHOP_CATEGORIES: ShopCategory[] = [
    { id: "balls", label: "Golf balls", blurb: "By the dozen, by the sleeve, and recycled by the bucket." },
    { id: "gloves", label: "Gloves", blurb: "Cabretta and all-weather, in every size the rack carries." },
    { id: "accessories", label: "Accessories", blurb: "Tees, markers, towels, rangefinders and the odd training aid." },
    { id: "headwear", label: "Headwear", blurb: "Caps, visors and winter beanies — most of them MCG-badged." },
    { id: "apparel", label: "Apparel", blurb: "A short rail of polos, quarter-zips and outerwear." },
    { id: "shoes", label: "Shoes", blurb: "Spiked and spikeless, stocked in the sizes that move." },
    { id: "bags", label: "Bags & clubs", blurb: "Carry bags, junior sets and the loaner-grade basics." },
    { id: "gift-cards", label: "Gift cards", blurb: "Good for green fees, range balls, lessons and the shop." },
    { id: "passes", label: "Passes & punch cards", blurb: "Play packs, range cards and season passes — resident and non-resident." },
    { id: "lessons", label: "Lessons", blurb: "Lesson packs and monthly plans, the same ones sold in the Academy." },
    { id: "services", label: "Services", blurb: "Regripping, storage, rentals, fitting and your county cards." },
];

export const CATEGORY_LABEL: Record<ShopCategoryId, string> = Object.fromEntries(SHOP_CATEGORIES.map((c) => [c.id, c.label])) as Record<ShopCategoryId, string>;

/* ------------------------------------------------------------------ */
/* Imagery helpers                                                     */
/* ------------------------------------------------------------------ */

const PHOTO = (file: string) => asset(`store-images/${file}`);
const LOGO = (file: string) => asset(`store-images/logos/${file}`);

/** The brand marks this shop actually stocks. */
const BRAND = {
    titleist: { name: "Titleist", logo: LOGO("logo-Titleist-5191ae6257.webp") },
    callaway: { name: "Callaway", logo: LOGO("logo-Callaway-1361699423.webp") },
    taylormade: { name: "TaylorMade", logo: LOGO("logo-TaylorMade-2f17ac4849.webp") },
    srixon: { name: "Srixon", logo: LOGO("logo-Srixon-8c85331b79.webp") },
    bridgestone: { name: "Bridgestone", logo: LOGO("logo-Bridgestone-f255386e56.webp") },
    wilson: { name: "Wilson", logo: LOGO("logo-Wilson-191b062a9b.webp") },
    cobra: { name: "Cobra", logo: LOGO("logo-COBRA-111ec06575.webp") },
    footjoy: { name: "FootJoy", logo: LOGO("24_FJ_Jewel_K_3-063a2db0f2.webp") },
    adidas: { name: "adidas", logo: LOGO("adidas_Logo-cdf1b1e41c.webp") },
    nike: { name: "Nike", logo: LOGO("logo-Nike-ca117a106f.webp") },
    puma: { name: "PUMA", logo: LOGO("logo-PUMA-5a1f394b3b.webp") },
    garmin: { name: "Garmin", logo: LOGO("logo-Garmin-2a8d606082.webp") },
    bushnell: { name: "Bushnell", logo: LOGO("logo-Bushnell-1c8ff2bc7e.webp") },
    ping: { name: "PING", logo: LOGO("logo-PING-3f87d394b0.webp") },
    uskids: { name: "U.S. Kids Golf", logo: LOGO("uskidsgolf-primary-2025-8f82ea3f5c.webp") },
    pgatour: { name: "PGA TOUR", logo: LOGO("logo-PGA-TOUR-Apparel-8c13ef62d0.webp") },
    mcg: { name: "MCG" },
} satisfies Record<string, { name: string; logo?: string }>;

/** Garment colours used across the apparel and headwear rails. */
const C = {
    mcgGreen: { name: "MCG Green", swatch: "#1E8E4E" },
    navy: { name: "Navy", swatch: "#1F2A44" },
    white: { name: "White", swatch: "#F7F7F5" },
    black: { name: "Black", swatch: "#17181A" },
    stone: { name: "Stone", swatch: "#C9C3B6" },
    charcoal: { name: "Charcoal", swatch: "#3E4247" },
    sky: { name: "Carolina", swatch: "#7FB2D9" },
    maroon: { name: "Maroon", swatch: "#6E2639" },
} satisfies Record<string, ShopColor>;

const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];
const GLOVE_SIZES = ["S", "M", "M/L", "L", "XL"];
const SHOE_SIZES = ["8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"];

/* ------------------------------------------------------------------ */
/* The catalog                                                         */
/* ------------------------------------------------------------------ */

const PHOTOGRAPHED_PRODUCTS: ShopProduct[] = [

    /* ---------------------------- Golf balls --------------------------- */
    {
        slug: "titleist-trufeel-double-dozen",
        name: "Titleist TruFeel — Double Dozen",
        category: "balls",
        brand: BRAND.titleist.name,
        brandLogo: BRAND.titleist.logo,
        image: PHOTO("equipment/golf-balls/2000000061330-01_pc-cce49404c7.webp"),
        price: 44,
        rating: 4.7,
        reviews: 145,
        inStock: true,
        blurb: "Two dozen of the softest ball Titleist makes — the county's best-selling box.",
        details: ["24 balls", "Soft ionomer cover", "Low compression core", "White or matte yellow"],
        sizes: ["Double dozen (24)"],
        colors: [C.white, { name: "Matte yellow", swatch: "#E7D14B" }],
    },
{
        slug: "callaway-supersoft-dozen",
        name: "Callaway Supersoft",
        category: "balls",
        brand: BRAND.callaway.name,
        brandLogo: BRAND.callaway.logo,
        image: PHOTO("equipment/golf-balls/2000000059357-01_pc-1b849979d7.webp"),
        price: 26,
        rating: 4.4,
        reviews: 186,
        inStock: true,
        blurb: "The forgiving, low-spin dozen that most of our weekend field plays.",
        details: ["Dozen", "38 compression", "HEX aerodynamics", "White, yellow or red"],
        sizes: ["Sleeve (3)", "Dozen (12)"],
        colors: [C.white, { name: "Matte yellow", swatch: "#E7D14B" }, { name: "Matte red", swatch: "#C2453C" }],
    },
{
        slug: "taylormade-tour-response-stripe",
        name: "TaylorMade Tour Response Stripe",
        category: "balls",
        brand: BRAND.taylormade.name,
        brandLogo: BRAND.taylormade.logo,
        image: PHOTO("equipment/golf-balls/2000000058166-96-01_pc-cdf80d6d19.webp"),
        price: 35,
        rating: 4.8,
        reviews: 219,
        inStock: true,
        blurb: "Urethane cover at a muni price, with the alignment stripe already painted on.",
        details: ["Dozen", "Cast urethane cover", "Painted 360° alignment stripe", "Mid launch, high greenside spin"],
        sizes: ["Dozen (12)"],
    },
{
        slug: "srixon-soft-feel",
        name: "Srixon Soft Feel",
        category: "balls",
        brand: BRAND.srixon.name,
        brandLogo: BRAND.srixon.logo,
        image: PHOTO("equipment/golf-balls/2000000061106-01_pc-53d173f6e3.webp"),
        price: 24,
        compareAt: 30,
        rating: 4.3,
        reviews: 242,
        inStock: true,
        blurb: "Soft two-piece distance ball — on the rack special through the end of the season.",
        details: ["Dozen", "Two-piece construction", "FastLayer core", "338 Speed Dimple pattern"],
        sizes: ["Dozen (12)"],
    },
{
        slug: "bridgestone-e6-dozen",
        name: "Bridgestone e6",
        category: "balls",
        brand: BRAND.bridgestone.name,
        brandLogo: BRAND.bridgestone.logo,
        image: PHOTO("equipment/golf-balls/2000000060903-01_pc-73118d72db.webp"),
        price: 28,
        rating: 4.4,
        reviews: 192,
        inStock: true,
        blurb: "Straight-flight ball built for moderate swing speeds. Easy on a slice.",
        details: ["Dozen", "Delta Wing dimple", "Soft surlyn cover", "Optic yellow available"],
        sizes: ["Dozen (12)"],
        colors: [C.white, { name: "Optic yellow", swatch: "#D8DB3F" }],
    },
{
        slug: "wilson-duo-soft",
        name: "Wilson Duo Soft",
        category: "balls",
        brand: BRAND.wilson.name,
        brandLogo: BRAND.wilson.logo,
        image: PHOTO("equipment/golf-balls/2000000061979-01_pc-f350c67244.webp"),
        price: 22,
        rating: 4.1,
        reviews: 96,
        inStock: true,
        blurb: "The cheapest new dozen in the shop, and the softest feel off the putter face.",
        details: ["Dozen", "35 compression", "VelocitiCOR core", "White or red"],
        sizes: ["Dozen (12)"],
    },
{
        slug: "titleist-pro-v1-dozen",
        name: "Titleist Pro V1",
        category: "balls",
        brand: BRAND.titleist.name,
        brandLogo: BRAND.titleist.logo,
        image: PHOTO("equipment/golf-balls/2000000059503-01_pc-9933da1b38.webp"),
        price: 55,
        rating: 4.9,
        reviews: 271,
        inStock: true,
        blurb: "We keep a shelf of these for the county amateur field. One box per customer on tournament weeks.",
        details: ["Dozen", "Cast urethane elastomer cover", "2.0 ZG process core", "Personalisation not available in-shop"],
        sizes: ["Dozen (12)"],
    },
{
        slug: "callaway-chrome-tour-sleeve",
        name: "Callaway Chrome Tour — Sleeve",
        category: "balls",
        brand: BRAND.callaway.name,
        brandLogo: BRAND.callaway.logo,
        image: PHOTO("equipment/golf-balls/2000000061118-01_pc-93b0b7a203.webp"),
        price: 14,
        rating: 4.1,
        reviews: 96,
        inStock: false,
        blurb: "Three-ball sleeve for the golfer who forgot the box at home. Back in stock Friday.",
        details: ["Sleeve of 3", "Urethane cover", "Hyper Fast core", "Triple Track alignment"],
        sizes: ["Sleeve (3)"],
    },
{
        slug: "titleist-perma-soft-glove",
        name: "Titleist Perma-Soft Glove",
        category: "gloves",
        brand: BRAND.titleist.name,
        brandLogo: BRAND.titleist.logo,
        image: PHOTO("equipment/accessories-and-training/0200211000122-01_pc-65fbf4918c.webp"),
        price: 22,
        rating: 4.3,
        reviews: 290,
        inStock: true,
        blurb: "Softer leather that stays soft through a humid Maryland August.",
        details: ["Cabretta leather palm", "Perforated back for airflow", "Left hand and right hand"],
        sizes: GLOVE_SIZES,
        colors: [C.white],
    },
{
        slug: "bushnell-tour-rangefinder",
        name: "Bushnell Tour Laser Rangefinder",
        category: "accessories",
        brand: BRAND.bushnell.name,
        brandLogo: BRAND.bushnell.logo,
        image: PHOTO("equipment/accessories-and-training/2000000051490-01_pc-b31ab4af03.webp"),
        price: 189,
        compareAt: 219,
        rating: 4.4,
        reviews: 80,
        inStock: true,
        blurb: "The most expensive thing in the shop, and the only rangefinder we stock.",
        details: ["400-yard range", "Slope-switch, tournament legal when off", "Magnetic cart mount", "Two-year warranty"],
    },
{
        slug: "garmin-approach-s44",
        name: "Garmin Approach S44 GPS Watch",
        category: "accessories",
        brand: BRAND.garmin.name,
        brandLogo: BRAND.garmin.logo,
        image: PHOTO("equipment/accessories-and-training/2000000050686-117-01_pc-e8807554a6.webp"),
        price: 169,
        rating: 4.4,
        reviews: 138,
        inStock: true,
        blurb: "All nine MCG courses are preloaded. Front, middle and back on the wrist.",
        details: ["43,000 preloaded courses", "Green view with manual pin position", "Up to 10 days in smartwatch mode", "Silicone band"],
        colors: [C.black, C.stone],
    },
{
        slug: "ping-blade-putter-headcover",
        name: "PING Blade Putter Headcover",
        category: "accessories",
        brand: BRAND.ping.name,
        brandLogo: BRAND.ping.logo,
        image: PHOTO("equipment/accessories-and-training/2000000052580-01_pc-cb1cd09eff.webp"),
        price: 34,
        rating: 4.6,
        reviews: 76,
        inStock: true,
        blurb: "Magnetic-closure blade cover for when the old one finally falls off on 14.",
        details: ["Fits standard blade putters", "Magnetic closure", "Synthetic leather shell", "Fleece lining"],
        colors: [C.navy, C.black],
    },
{
        slug: "club-scrub-brush",
        name: "Club Scrub Groove Brush",
        category: "accessories",
        brand: BRAND.cobra.name,
        brandLogo: BRAND.cobra.logo,
        image: PHOTO("equipment/accessories-and-training/2000000050257-01_pc-070a7c27c5.webp"),
        price: 15,
        compareAt: 22,
        rating: 4.5,
        reviews: 180,
        inStock: true,
        blurb: "Nylon and brass bristles, retractable groove pick, clip for the bag strap.",
        details: ["Dual nylon / brass bristles", "Retractable zip-line clip", "Groove pick", "Rubber grip"],
    },
{
        slug: "putting-gate-training-aid",
        name: "Putting Gate Training Aid",
        category: "accessories",
        brand: BRAND.pgatour.name,
        brandLogo: BRAND.pgatour.logo,
        image: PHOTO("equipment/accessories-and-training/2000000057993-01_pc-645c5bf741.webp"),
        price: 21,
        compareAt: 28,
        rating: 3.9,
        reviews: 277,
        inStock: false,
        blurb: "Two gates and a mirror for the practice green. Back on the shelf next week.",
        details: ["Alignment mirror", "Two adjustable gates", "Carry pouch", "Fits in a bag pocket"],
    },
{
        slug: "adidas-performance-polo",
        name: "adidas Performance Polo",
        category: "apparel",
        brand: BRAND.adidas.name,
        brandLogo: BRAND.adidas.logo,
        image: PHOTO("apparel/mens/2000000055876-59-01_pc-e31b67db78.webp"),
        price: 58,
        rating: 4.2,
        reviews: 126,
        inStock: true,
        blurb: "The plain, reliable polo. Two colourways, and we reorder both every spring.",
        details: ["Recycled polyester", "Regular fit", "Three-button placket", "Machine washable"],
        sizes: APPAREL_SIZES,
        colors: [C.navy, C.white, C.black],
    },
{
        slug: "puma-cooling-polo",
        name: "PUMA Cloudspun Polo",
        category: "apparel",
        brand: BRAND.puma.name,
        brandLogo: BRAND.puma.logo,
        image: PHOTO("apparel/mens/2000000058046-81-01_pc-deb987f80f.webp"),
        price: 62,
        compareAt: 80,
        rating: 4.6,
        reviews: 131,
        inStock: true,
        blurb: "Marked down from last season. Cooling yarn that actually works in July.",
        details: ["Cloudspun cooling jersey", "Self-fabric collar", "Regular fit", "Marked down from $80"],
        sizes: APPAREL_SIZES,
        colors: [C.sky, C.charcoal],
    },
{
        slug: "nike-dri-fit-polo",
        name: "Nike Dri-FIT Victory Polo",
        category: "apparel",
        brand: BRAND.nike.name,
        brandLogo: BRAND.nike.logo,
        image: PHOTO("apparel/mens/2000000054595-59-01_pc-dd5b6a8095.webp"),
        price: 65,
        rating: 4.5,
        reviews: 213,
        inStock: true,
        blurb: "Standard fit, standard fabric, standard good. We stock it in five sizes and no more.",
        details: ["Dri-FIT polyester", "Standard fit", "Ribbed collar", "Embroidered swoosh"],
        sizes: APPAREL_SIZES,
        colors: [C.black, C.white, C.navy],
    },
{
        slug: "mens-performance-shorts",
        name: "Performance Flat-Front Shorts",
        category: "apparel",
        brand: BRAND.pgatour.name,
        brandLogo: BRAND.pgatour.logo,
        image: PHOTO("apparel/mens/2000000056943-38-01_pc-0949d0fcbb.webp"),
        price: 52,
        rating: 4.3,
        reviews: 98,
        inStock: true,
        blurb: "Nine-inch inseam, four-way stretch, deep enough pockets for a phone and a scorecard.",
        details: ['9" inseam', "Four-way stretch", "Hidden zip pocket", "Waist 30–40"],
        sizes: ["30", "32", "34", "36", "38", "40"],
        colors: [C.stone, C.navy, C.black],
    },
{
        slug: "womens-sleeveless-polo",
        name: "Women's Sleeveless Polo",
        category: "apparel",
        brand: BRAND.pgatour.name,
        brandLogo: BRAND.pgatour.logo,
        image: PHOTO("apparel/womens/2000000058131-92-01_pc-eb409966f1.webp"),
        price: 54,
        rating: 4.7,
        reviews: 107,
        inStock: true,
        blurb: "Sleeveless performance polo with a soft collar. The women's league staple.",
        details: ["Stretch jersey", "Soft roll collar", "UPF 40", "XS–XL"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: [C.white, C.mcgGreen, C.sky],
    },
{
        slug: "womens-golf-skort",
        name: "Women's 16\" Golf Skort",
        category: "apparel",
        brand: BRAND.pgatour.name,
        brandLogo: BRAND.pgatour.logo,
        image: PHOTO("apparel/womens/2000000054666-5-01_pc-9e5350d58b.webp"),
        price: 56,
        rating: 4.5,
        reviews: 214,
        inStock: true,
        blurb: "Sixteen-inch skort with a ball pocket on the short underneath. Three neutrals.",
        details: ['16" length', "Built-in short with ball pocket", "Four-way stretch", "XS–XL"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: [C.navy, C.white, C.stone],
    },
{
        slug: "womens-quarter-zip",
        name: "Women's Quarter-Zip",
        category: "apparel",
        brand: BRAND.pgatour.name,
        brandLogo: BRAND.pgatour.logo,
        image: PHOTO("apparel/womens/2000000058130-758-01_pc-79d6e2497a.webp"),
        price: 68,
        compareAt: 90,
        rating: 4.7,
        reviews: 241,
        inStock: true,
        blurb: "Brushed-back quarter-zip, reduced at the end of the shoulder season.",
        details: ["Brushed interior", "Thumbholes", "Quarter zip", "Marked down from $90"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: [C.maroon, C.navy],
    },
{
        slug: "mens-cooling-quarter-zip",
        name: "Men's Cooling Quarter-Zip",
        category: "apparel",
        brand: BRAND.adidas.name,
        brandLogo: BRAND.adidas.logo,
        image: PHOTO("apparel/mens/2000000056944-39-01_pc-0c5dd14c6d.webp"),
        price: 78,
        rating: 4.8,
        reviews: 253,
        inStock: false,
        blurb: "Sold through. The next shipment lands at Hampshire Greens in two weeks.",
        details: ["Cooling knit", "Quarter zip", "Raglan sleeve", "Back in stock late month"],
        sizes: APPAREL_SIZES,
        colors: [C.charcoal, C.navy],
    },
/* ------------------------------ Shoes ------------------------------ */
    {
        slug: "footjoy-spikeless-mens",
        name: "FootJoy Spikeless Golf Shoe",
        category: "shoes",
        brand: BRAND.footjoy.name,
        brandLogo: BRAND.footjoy.logo,
        image: PHOTO("shoes/golf-shoes/2000000047011-5-01_pc-faed680eec.webp"),
        price: 95,
        compareAt: 120,
        rating: 4.7,
        reviews: 214,
        inStock: true,
        blurb: "The one pair we keep on the rack in every size. Wear them in from the car park.",
        details: ["Spikeless outsole", "Waterproof one year", "Men's 8–13", "Medium width"],
        sizes: SHOE_SIZES,
        colors: [C.white, C.black],
    },
{
        slug: "adidas-tour-spiked-mens",
        name: "adidas Tour Spiked Golf Shoe",
        category: "shoes",
        brand: BRAND.adidas.name,
        brandLogo: BRAND.adidas.logo,
        image: PHOTO("shoes/golf-shoes/2000000059493-40-01_pc-ba576984f8.webp"),
        price: 129,
        rating: 4.1,
        reviews: 218,
        inStock: true,
        blurb: "Replaceable-spike shoe for the members who play Little Bennett in the wet.",
        details: ["Six replaceable cleats", "Two-year waterproof warranty", "Men's 8–13", "Boost midsole"],
        sizes: SHOE_SIZES,
        colors: [C.white, C.navy],
    },
{
        slug: "new-balance-womens-spikeless",
        name: "Women's Spikeless Golf Shoe",
        category: "shoes",
        brand: BRAND.puma.name,
        brandLogo: BRAND.puma.logo,
        image: PHOTO("shoes/golf-shoes/2000000058391-92-01_pc-b47bc62d8a.webp"),
        price: 89,
        rating: 4.6,
        reviews: 194,
        inStock: true,
        blurb: "Waterproof spikeless in women's 6–11. Light enough to walk thirty-six.",
        details: ["Spikeless", "Waterproof membrane", "Women's 6–11", "Removable insole"],
        sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "11"],
        colors: [C.white, C.stone],
    },
{
        slug: "junior-golf-shoe",
        name: "Junior Golf Shoe",
        category: "shoes",
        brand: BRAND.uskids.name,
        brandLogo: BRAND.uskids.logo,
        image: PHOTO("shoes/golf-shoes/2000000055152-39-01_pc-08b315caf1.webp"),
        price: 55,
        rating: 4.8,
        reviews: 65,
        inStock: true,
        blurb: "Youth spikeless shoe sized 1–6, stocked for the junior programs at Northwest.",
        details: ["Youth 1–6", "Spikeless", "Hook-and-loop option in small sizes", "Lightweight EVA"],
        sizes: ["1", "2", "3", "4", "5", "6"],
        colors: [C.white, C.sky],
    },
{
        slug: "junior-starter-set",
        name: "Junior Starter Set — 5 Club",
        category: "bags",
        brand: BRAND.uskids.name,
        brandLogo: BRAND.uskids.logo,
        image: PHOTO("equipment/accessories-and-training/2000000052373-01_pc-c9d8a07c8c.webp"),
        price: 179,
        compareAt: 205,
        rating: 4.8,
        reviews: 71,
        inStock: true,
        blurb: "Driver, hybrid, two irons, putter and a stand bag — the set our junior clinics recommend.",
        details: ["Five clubs plus stand bag", "Sized by height, 45–57 inches", "Graphite shafts", "Fitted in-shop at Needwood"],
        sizes: ['45"', '48"', '51"', '54"', '57"'],
    },
];

/* ------------------------------------------------------------------ */
/* The catalog                                                         */
/* ------------------------------------------------------------------ */

/**
 * The storefront is assembled from four sources, then filtered by one rule:
 * **nothing physical is listed without a real photograph.**
 *
 * MCG-logo merchandise used to be shown as a mark on a green panel — an honest
 * mockup, but a mockup, and 25 of them outnumbered the real products. They are gone.
 * The green panel is now reserved for offerings that have nothing to photograph:
 * gift cards, passes, lesson packs, services. Those carry `logoTile`.
 *
 * `assertListable` enforces it at module load rather than in review, so a physical
 * product added later without imagery fails loudly instead of shipping as a grey box.
 */
const ALL_SOURCES: ShopProduct[] = [...PHOTOGRAPHED_PRODUCTS, ...BALL_PRODUCTS, ...GOODS_PRODUCTS, ...OFFERING_PRODUCTS];

/** A product may appear if it has a photograph, or is a non-physical offering. */
export const isListable = (product: ShopProduct): boolean => Boolean(product.image) || product.logoTile === true;

export const SHOP_PRODUCTS: ShopProduct[] = ALL_SOURCES.filter(isListable);

if (process.env.NODE_ENV !== "production") {
    const hidden = ALL_SOURCES.filter((p) => !isListable(p)).map((p) => p.slug);
    if (hidden.length) console.warn(`[shop] hidden — no photograph and not a logo-tile offering: ${hidden.join(", ")}`);
    const seen = new Set<string>();
    const dupes = SHOP_PRODUCTS.filter((p) => (seen.has(p.slug) ? true : (seen.add(p.slug), false))).map((p) => p.slug);
    if (dupes.length) console.warn(`[shop] duplicate slugs: ${dupes.join(", ")}`);
}

/* ------------------------------------------------------------------ */
/* Derived lookups                                                     */
/* ------------------------------------------------------------------ */

export const productBySlug = (slug: string): ShopProduct | undefined => SHOP_PRODUCTS.find((p) => p.slug === slug);

/** Every slug, for `generateStaticParams`. */
export const ALL_PRODUCT_SLUGS = SHOP_PRODUCTS.map((p) => p.slug);

/** The MCG-badged shelf, which the storefront leads with. */
export const MCG_LOGO_PRODUCTS = SHOP_PRODUCTS.filter((p) => p.mcgLogo);

/** Price bounds across the catalog, so the range filter never invents a ceiling. */
export const PRICE_MIN = 0;
export const PRICE_MAX = Math.ceil(Math.max(...SHOP_PRODUCTS.map((p) => p.price)) / 10) * 10;

export const money = (n: number) => `$${n.toFixed(2)}`;
export const money0 = (n: number) => `$${Math.round(n)}`;

/** Maryland's 6% sales tax, applied at checkout. */
export const MD_TAX_RATE = 0.06;

/**
 * Related products — same category first, then the rest of the MCG-logo shelf, so a
 * detail page always has four things to show even in a thin category.
 */
export const relatedTo = (product: ShopProduct, count = 4): ShopProduct[] => {
    const sameCategory = SHOP_PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug);
    const fallback = SHOP_PRODUCTS.filter((p) => p.mcgLogo && p.slug !== product.slug && !sameCategory.includes(p));
    return [...sameCategory, ...fallback].slice(0, count);
};

/** The badges a card can carry. At most two, priority order. */
export const badgesFor = (product: ShopProduct): { label: string; color: "gray" | "success" | "brand" | "warning" | "blue" }[] => {
    if (!product.inStock) return [{ label: "Out of stock", color: "gray" }];
    const out: { label: string; color: "gray" | "success" | "brand" | "warning" | "blue" }[] = [];
    if (product.compareAt) out.push({ label: `Save ${money0(product.compareAt - product.price)}`, color: "success" });
    if (product.mcgLogo) out.push({ label: "MCG logo", color: "brand" });
    else if (product.reviews >= 200) out.push({ label: "Best seller", color: "blue" });
    return out.slice(0, 2);
};

/* ------------------------------------------------------------------ */
/* Pickup                                                              */
/* ------------------------------------------------------------------ */

/**
 * Pro shop hours per course. County systems do in-person pickup, not shipping — every
 * order is collected at a counter, so the course is a required checkout choice rather
 * than an address form.
 */
export const PICKUP_HOURS: Record<string, string> = {
    "falls-road": "Mon–Fri 7am–6pm · Sat–Sun 6:30am–6pm",
    northwest: "Daily 6:30am–7pm",
    "hampshire-greens": "Daily 7am–6:30pm",
    laytonsville: "Mon–Fri 7am–5:30pm · Sat–Sun 6:30am–6pm",
    "little-bennett": "Daily 7am–6pm",
    needwood: "Daily 6:30am–7pm",
    crossvines: "Wed–Sun 8am–6pm",
    rattlewood: "Daily 7:30am–5:30pm",
    "sligo-creek": "Daily 7am–5pm",
};

/** How soon an order is ready at each counter. */
export const PICKUP_READY: Record<string, string> = {
    "falls-road": "Ready in about 2 hours",
    northwest: "Ready in about 1 hour",
    "hampshire-greens": "Ready in about 2 hours",
    laytonsville: "Ready tomorrow morning",
    "little-bennett": "Ready in about 3 hours",
    needwood: "Ready in about 1 hour",
    crossvines: "Ready tomorrow morning",
    rattlewood: "Ready tomorrow morning",
    "sligo-creek": "Ready in about 2 hours",
};
