import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DateSelector } from "@/components/booking/date-selector";

/**
 * The Date Selector is the top of the Sagamore Spring booking flow — a
 * scrollable row of date chips, just like OpenTable's. Pick the day you tee
 * off and the tee sheet below updates to match. The selected chip turns
 * Sagamore green; today wears a small marker so you never lose your place.
 */
const meta = {
    title: "Booking/Molecules/Date Selector",
    component: DateSelector,
    parameters: { layout: "centered" },
    argTypes: {
        days: { control: { type: "number", min: 1, max: 30 } },
        value: { control: false },
        defaultValue: { control: false },
        startDate: { control: false },
        onChange: { action: "date-selected" },
    },
    args: {
        days: 7,
    },
    decorators: [
        (Story) => (
            <div className="w-[480px] max-w-full">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof DateSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tweak the day count and watch the strip in the controls panel. */
export const Playground: Story = {};

/** Two weeks of tee-off dates — the standard Sagamore Spring booking window. */
export const Default: Story = {
    args: {
        days: 7,
    },
};

/** A tighter seven-day view for booking your round earlier in the week. */
export const Week: Story = {
    args: {
        days: 7,
    },
};

/** Arriving with a day already locked in — here we tee off three days out. */
export const Preselected: Story = {
    args: {
        days: 7,
        defaultValue: (() => {
            const date = new Date();
            date.setDate(date.getDate() + 3);
            return date;
        })(),
    },
};
