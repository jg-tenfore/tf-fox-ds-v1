import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { serviceById } from "@/components/instruction-3/instruction-catalog";
import { InstructionHubScreen } from "@/components/mcg-3/instruction/instruction-hub";
import { ServiceScreen } from "@/components/mcg-3/instruction/service-screen";
import { SquareBookingFlow } from "@/components/mcg-3/instruction/square-booking";

/**
 * "MCG Prototype 3 / Instruction" — the hybrid, at `/tf-fox-ds-v1/prototype-3/`.
 *
 * Prototype 2's search and result tiles, Prototype 1's time board and waitlist, and
 * MCG's own asks on top: multi-select everything, dates and days on the first step, no
 * Extras step, and an account required at checkout.
 */
const meta: Meta = {
    title: "MCG Prototype 3/Instruction",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const PRIVATE_45 = serviceById("private-45")!;

/* ---- Step 1: one search that gathers everything --------------------- */

export const Search: Story = {
    name: "1. Search — everything on one step",
    render: () => <InstructionHubScreen />,
};

export const SearchMultiCourse: Story = {
    name: "1b. Search — two courses, two formats, Tuesdays",
    render: () => <InstructionHubScreen initialFilter={{ courses: ["falls-road", "needwood"], formats: ["clinic", "junior-league"], days: [2] }} />,
};

export const SearchDateRange: Story = {
    name: "1c. Search — a date range, juniors only",
    render: () => <InstructionHubScreen initialFilter={{ formats: ["junior-camp", "junior-league", "op36"], from: "2026-06-19", to: "2026-07-31" }} />,
};

export const SearchByInstructor: Story = {
    name: "1d. Search — browsing by instructor",
    render: () => <InstructionHubScreen initialView="instructors" initialFilter={{ courses: ["falls-road"] }} />,
};

export const SearchEmpty: Story = {
    name: "1e. Search — nothing matches",
    render: () => <InstructionHubScreen initialFilter={{ courses: ["hampshire-greens"], formats: ["op36"], days: [1] }} />,
};

/* ---- Step 2: choose an instructor ----------------------------------- */

export const ChooseInstructor: Story = {
    name: "2. Choose an instructor (or any)",
    render: () => <ServiceScreen serviceId="private-45" initialCourse="falls-road" />,
};

/* ---- Step 3: Prototype 1's time board ------------------------------- */

export const ChooseTime: Story = {
    name: "3. Choose a time — Prototype 1's board",
    render: () => <SquareBookingFlow service={PRIVATE_45} coachId="brent-wilkerson" courseSlug="falls-road" searchFrom="2026-06-19" searchTo="2026-07-03" />,
};

export const ChooseTimeAnyInstructor: Story = {
    name: "3b. Choose a time — any available instructor",
    render: () => <SquareBookingFlow service={PRIVATE_45} coachId="any" courseSlug="falls-road" />,
};

export const Waitlist: Story = {
    name: "3c. Waitlist — dates, times of day, days of the week",
    render: () => <SquareBookingFlow service={PRIVATE_45} coachId="brent-wilkerson" courseSlug="falls-road" initialStep="waitlist" searchFrom="2026-06-19" />,
};

/* ---- Step 4: checkout ----------------------------------------------- */

export const Checkout: Story = {
    name: "4. Checkout — sign-in required, nothing lost",
    render: () => <SquareBookingFlow service={PRIVATE_45} coachId="brent-wilkerson" courseSlug="falls-road" initialStep="checkout" />,
};

export const CheckoutWithExtras: Story = {
    name: "4b. Checkout — extras added from the dropdown",
    render: () => <SquareBookingFlow service={PRIVATE_45} coachId="brent-wilkerson" courseSlug="falls-road" initialStep="checkout" initialExtras={["video-review", "range-bucket"]} />,
};
