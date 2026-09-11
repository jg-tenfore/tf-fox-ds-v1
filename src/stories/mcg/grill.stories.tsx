import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    type GrillOrder,
    OFFER_WINDOWS,
    type OrderLine,
    PICKUP,
    READY_WINDOW,
    TODAY_ISO,
    TODAY_LABEL,
    offerById,
    offerLine,
    priceOrder,
} from "@/components/mcg/grill-menu";
import { GrillOrderScreen } from "@/components/mcg/grill/grill-order-screen";
import { GrillScreen } from "@/components/mcg/grill/grill-screen";

/**
 * "MCG Prototype / Grill" — food and drink across the nine MCG courses.
 *
 * These are the same components the prototype routes mount at `/grill` and
 * `/grill/order`, so what a reviewer clicks here is what a golfer gets.
 *
 * Municipal golf doesn't have a dining room, and the screens are built around that
 * rather than around it: four courses run a full grill, two run a snack window, and
 * Laytonsville runs a beverage cart and nothing else. A venue's `kind` decides what
 * appears on its board — a snack window has no flat-top, so no burger is offered — and
 * whether there's an order-ahead at all.
 *
 * Above every board sits a shelf of deals — combos, turn specials, time-gated
 * breakfast and twilight offers, and bundles tied to the golf. They're data in
 * `grill-menu`, not layout: an offer's à-la-carte total is summed from the board, and
 * which venues can honour it is derived from what's in it rather than declared twice.
 *
 * Numbered stories are the order-ahead in sequence. Named stories are the branches.
 */
const meta: Meta<typeof GrillScreen> = {
    title: "MCG Prototype/Grill",
    component: GrillScreen,
    // `GrillScreen` calls `useRouter` to hand off to the confirmation, which needs
    // Storybook's App Router mock switched on.
    parameters: { layout: "fullscreen", nextjs: { appDirectory: true } },
};

export default meta;
type Story = StoryObj<typeof GrillScreen>;

/* ---------------------------- the sequence ---------------------------- */

/**
 * All nine courses with their food operation stated up front, because "is there a
 * grill at Little Bennett?" is the question a golfer actually arrives with. The badge
 * carries the answer; the card carries the hours and whether order-ahead exists.
 */
export const Courses: Story = {
    name: "1. Find a Grill",
    args: { step: "courses" },
};

/**
 * The board at the busiest kitchen in the portfolio. Sections are tabs rather than one
 * long scroll — a golfer standing on the 8th tee is looking for one thing, not
 * browsing — and the order rail sits alongside so the price and the pickup time are
 * never off screen.
 */
export const FallsRoad: Story = {
    name: "2. The Grill at Falls Road",
    args: { step: "menu", venueSlug: "falls-road" },
};

/**
 * The order-ahead, filled in. The rail leads with *when* rather than *how you'll pay*,
 * because the pickup window is the entire reason to order in advance. Maryland taxes
 * food at 6% and alcohol at 9%, so the total splits the two rather than blending them
 * into one misleading line.
 */
export const OrderAhead: Story = {
    name: "3. Order Ahead for the Turn",
    args: { step: "menu", venueSlug: "falls-road", seeded: true, pickup: "turn" },
};

/**
 * Placed. The order number and the pickup window are the two things that matter, so
 * they're the two things at the top; everything under them is a receipt. Nothing is
 * charged — a muni grill takes payment at the counter, and an uncollected order
 * cancels itself at close.
 */
export const Confirmed: StoryObj<typeof GrillOrderScreen> = {
    name: "4. Order Confirmed",
    render: () => <GrillOrderScreen />,
};

/* ---------------------------- the branches ---------------------------- */

/**
 * The Crossvines is the one MCG property with a winery attached, and the menu says so:
 * a wood oven, smoked brisket, and Montgomery County wine by the glass. The wine
 * section exists only here — items carry an `only` list rather than the property
 * carrying a second catalog.
 */
export const Crossvines: Story = {
    name: "The Crossvines Kitchen",
    args: { step: "menu", venueSlug: "crossvines", section: "wine" },
};

/**
 * A snack window is not a small grill — it's a different operation. No flat-top means
 * no burger, no cheesesteak and no breakfast sandwich; what's left is dogs off the
 * roller, wraps made up front at 7 AM, and a cooler. The pickup options narrow too:
 * there's no kitchen to fire something at the 17th.
 */
export const SnackWindow: Story = {
    name: "Snack Window — Little Bennett",
    args: { step: "menu", venueSlug: "little-bennett" },
};

/**
 * Laytonsville has neither. Rather than show an order form nobody can honour, the page
 * becomes a stock list and a cart schedule, and points at the nearest grill.
 */
export const BeverageCart: Story = {
    name: "Beverage Cart — Laytonsville",
    args: { step: "menu", venueSlug: "laytonsville" },
};

/**
 * Breakfast is the muni grill's biggest service — the 6:30 wave eats before it plays —
 * and it closes at 11 or whenever the first group clears the 9th.
 */
export const Breakfast: Story = {
    name: "Breakfast at Northwest",
    args: { step: "menu", venueSlug: "northwest", section: "breakfast" },
};

/**
 * The other pickup point. "After the round" fires the order when the group reaches 17,
 * which is the only way a grill can serve hot food to someone who is still playing.
 */
export const AfterTheRound: Story = {
    name: "Pickup After the Round",
    args: { step: "menu", venueSlug: "needwood", seeded: true, pickup: "after" },
};

/* A dry snack-window order, so the confirmation is shown without the ID notice. */
const WINDOW_LINES: OrderLine[] = [
    { itemId: "turn-dog", name: "The Turn dog", price: 6, qty: 2, alcohol: false },
    { itemId: "pretzel", name: "Soft pretzel", price: 6, qty: 1, alcohol: false },
    { itemId: "gatorade", name: "Gatorade", price: 4, qty: 2, alcohol: false },
];

const WINDOW_ORDER: GrillOrder = {
    number: "MCG-5104",
    venueSlug: "little-bennett",
    lines: WINDOW_LINES,
    pickup: "turn",
    readyLabel: READY_WINDOW.turn,
    placedLabel: TODAY_LABEL,
    isoDate: TODAY_ISO,
    ...priceOrder(WINDOW_LINES),
    note: `Two of us, walking. ${PICKUP.turn.label}.`,
};

/**
 * The same confirmation for a window order with no alcohol on it: one tax line, no ID
 * notice. The screen drops what doesn't apply rather than greying it out.
 */
export const ConfirmedWindow: StoryObj<typeof GrillOrderScreen> = {
    name: "Order Confirmed — Snack Window",
    render: () => <GrillOrderScreen order={WINDOW_ORDER} />,
};

/* ------------------------------ the deals ------------------------------ */

/**
 * The deals shelf, opened out.
 *
 * Every offer shows its contents, what the parts cost separately, and the saving — all
 * three computed from the menu, so a price change on the board moves the deal with it.
 * The clock is 7:10 AM here, which is when a muni grill is actually busy: the early-bird
 * and the Dawn Patrol are live, and the twilight deal is not.
 */
export const Deals: Story = {
    name: "Deals — the Whole Shelf",
    args: { step: "menu", venueSlug: "falls-road", nowMinutes: 7 * 60 + 10, allDeals: true },
};

/**
 * A deal in the order, which is the point of modelling offers as order lines rather
 * than as a banner. The rail shows the à-la-carte total, the deal credit and the
 * discounted subtotal as three separate numbers, and the Maryland split still lands on
 * the right money: the Foursome Pack is half beer, so the discount comes off food and
 * alcohol in proportion and the 9% applies to the beer's share of the *discounted*
 * price, not its menu price.
 */
export const OfferInOrder: Story = {
    name: "Deal in the Order Rail",
    args: {
        step: "menu",
        venueSlug: "falls-road",
        seededOffers: { "combo-burger": 2, "bundle-foursome": 1 },
        pickup: "turn",
    },
};

/**
 * 1:15 PM: past breakfast, not yet twilight. The time-gated offers stay on the shelf,
 * greyed, with the hours they keep — a golfer who missed the early-bird by an hour
 * should be able to see that that is what happened, rather than wonder whether they
 * imagined it. They sort below the deals that are actually live.
 */
export const OfferOutsideWindow: Story = {
    name: "Deals Outside Their Window",
    args: { step: "menu", venueSlug: "falls-road", nowMinutes: 13 * 60 + 15, allDeals: true },
};

/**
 * The same shelf at a snack window, which is shorter, and honestly so. A combo is only
 * offered where every item in it can be made: no flat-top means no Turn Combo, no
 * Tenders Basket and no Early Bird, because the burger, the fryer and the home fries
 * are all grill-only. What survives is the dog, the wrap, the chili and the bundles —
 * and nobody had to write a second list of deals to get there.
 */
export const WindowDeals: Story = {
    name: "Deals a Snack Window Can Honour",
    args: { step: "menu", venueSlug: "little-bennett", nowMinutes: 7 * 60 + 10, allDeals: true },
};

/**
 * And a beverage cart, which can honour two: a cooler pack and a hydration pack, both
 * of which are things a cart genuinely carries. They're shown as prices, not as an
 * order form, because there is no counter to collect from.
 */
export const CartDeals: Story = {
    name: "Deals on the Cart — Rattlewood",
    args: { step: "menu", venueSlug: "rattlewood" },
};

/* A confirmation carrying a deal, so the receipt's saving line is visible. */
const DEAL_LINES: OrderLine[] = [
    offerLine(offerById("turn-crab-dip")!, 1),
    offerLine(offerById("combo-junior")!, 2),
    { itemId: "berger", name: "Berger cookies, 2-pack", price: 4.5, qty: 2, alcohol: false },
];

const DEAL_ORDER: GrillOrder = {
    number: "MCG-5277",
    venueSlug: "needwood",
    lines: DEAL_LINES,
    pickup: "turn",
    readyLabel: READY_WINDOW.turn,
    placedLabel: TODAY_LABEL,
    isoDate: TODAY_ISO,
    ...priceOrder(DEAL_LINES),
    note: `Four of us, two juniors. ${PICKUP.turn.label}, cart 14.`,
};

/**
 * The receipt for an order built on deals. Each discounted line names what's in it, the
 * saving is called out beside the order number, and the totals show the à-la-carte
 * price it was struck from — a grill that won't show you the arithmetic isn't giving
 * you a deal, it's giving you a price.
 */
export const ConfirmedWithDeals: StoryObj<typeof GrillOrderScreen> = {
    name: "Order Confirmed — With Deals",
    render: () => <GrillOrderScreen order={DEAL_ORDER} />,
};

/**
 * The early-bird window itself, stated in data: 5:30 to 8:00 AM, on the breakfast tab
 * at Northwest with the clock at 6:40. Windows are minutes past midnight on the offer
 * record, compared against a `nowMinutes` the screen takes as a prop — so a story can
 * move the clock without mocking `Date`, and the app can one day read the real one.
 */
export const EarlyBird: Story = {
    name: `Early Bird — ${OFFER_WINDOWS.earlyBird.label}`,
    args: { step: "menu", venueSlug: "northwest", section: "breakfast", nowMinutes: 6 * 60 + 40 },
};

/**
 * And the other end of the day: 5:40 PM at The Crossvines, where the twilight deals are
 * the live ones and the breakfast pair have gone. Sunset on the Terrace exists only
 * here, because the flatbread and the estate rosé in it do.
 */
export const Twilight: Story = {
    name: `Twilight — ${OFFER_WINDOWS.twilight.label}`,
    args: { step: "menu", venueSlug: "crossvines", nowMinutes: 17 * 60 + 40, allDeals: true },
};
