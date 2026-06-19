import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BookingSummary } from "@/components/booking/booking-summary";

/**
 * The booking summary is the scorecard for the checkout — the Resy-style
 * reservation recap a golfer reviews before locking in a tee time at Sagamore
 * Spring. It restates the round (date, time, holes, players, ride), itemizes
 * every charge, and tallies the total. Pure and composable: feed it props, it
 * adds up the rest.
 */
const meta = {
    title: "Booking/Molecules/Booking Summary",
    tags: ["!dev"],
    component: BookingSummary,
    parameters: { layout: "centered" },
    argTypes: {
        dateLabel: { control: "text" },
        timeLabel: { control: "text" },
        holes: { control: "inline-radio", options: [9, 18] },
        players: { control: { type: "range", min: 1, max: 4, step: 1 } },
        ride: { control: "inline-radio", options: ["walking", "cart"] },
        total: { control: "number" },
    },
    args: {
        dateLabel: "Sat, Jun 21",
        timeLabel: "7:10 AM",
        holes: 18,
        players: 4,
        ride: "cart",
        lineItems: [
            { label: "Green fees · 4 × $70", amount: 280 },
            { label: "Riding cart · 2 × $18", amount: 36 },
        ],
    },
} satisfies Meta<typeof BookingSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tweak the round and watch the card recompute the total from the line items. */
export const Playground: Story = {};

/** A full foursome riding 18 on a Saturday — green fees plus a pair of shared carts. */
export const FoursomeRiding: Story = {
    args: {
        dateLabel: "Sat, Jun 21",
        timeLabel: "8:30 AM",
        holes: 18,
        players: 4,
        ride: "cart",
        lineItems: [
            { label: "Green fees · 4 × $70", amount: 280 },
            { label: "Riding cart · 2 × $18", amount: 36 },
        ],
    },
};

/** Two walking 18 after 3 PM at the flat twilight rate — the value play of the day. */
export const TwilightWalk: Story = {
    args: {
        dateLabel: "Wed, Jun 18",
        timeLabel: "4:40 PM",
        holes: 18,
        players: 2,
        ride: "walking",
        lineItems: [{ label: "Twilight green fees · 2 × $32", amount: 64 }],
    },
};

/** The works: green fees, a cart, rental sticks, and a bucket to warm up on the range. */
export const WithAddOns: Story = {
    args: {
        dateLabel: "Sun, Jun 22",
        timeLabel: "9:50 AM",
        holes: 18,
        players: 4,
        ride: "cart",
        lineItems: [
            { label: "Green fees · 4 × $70", amount: 280 },
            { label: "Riding cart · 2 × $18", amount: 36 },
            { label: "Club rental · 2 × $35", amount: 70 },
            { label: "Range balls · 4 × $8", amount: 32 },
        ],
    },
};
