import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TeeTimeSlot } from "@/components/booking/tee-time-slot";
import { generateTeeTimes, groupTeeTimes, timeOfDayLabels, type TimeOfDay } from "@/components/booking/sagamore-data";

/**
 * The tee-time slot is the tappable heart of the Sagamore Spring availability
 * screen — the Resy-style time chip a golfer taps to grab a spot. It shows the
 * tee time, the per-player green fee, and how many spots are left. Selected
 * slots fill in Sagamore green; everything else stays calm and monochrome.
 */
const meta = {
    title: "Booking/Molecules/Tee Time Slot",
    component: TeeTimeSlot,
    parameters: { layout: "centered" },
    argTypes: {
        time: { control: "text" },
        price: { control: "number" },
        spotsAvailable: { control: { type: "range", min: 0, max: 4, step: 1 } },
        isSelected: { control: "boolean" },
        isDisabled: { control: "boolean" },
        size: { control: "inline-radio", options: ["sm", "md"] },
    },
    args: {
        time: "7:10 AM",
        price: 62,
        spotsAvailable: 4,
        isSelected: false,
        isDisabled: false,
        size: "md",
    },
} satisfies Meta<typeof TeeTimeSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tee up your own slot — twist the knobs to see every state. */
export const Playground: Story = {};

/** Every shape a slot can take on the tee sheet, from wide open to fully booked. */
export const States: Story = {
    render: () => (
        <div className="flex flex-wrap items-start gap-3">
            <div className="flex flex-col items-center gap-2">
                <TeeTimeSlot time="7:10 AM" price={62} spotsAvailable={4} />
                <span className="text-xs text-tertiary">Default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <TeeTimeSlot time="7:20 AM" price={62} spotsAvailable={4} isSelected />
                <span className="text-xs text-tertiary">Selected</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <TeeTimeSlot time="7:30 AM" price={62} spotsAvailable={1} />
                <span className="text-xs text-tertiary">Last spot</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <TeeTimeSlot time="7:40 AM" price={62} spotsAvailable={0} />
                <span className="text-xs text-tertiary">Full · disabled</span>
            </div>
        </div>
    ),
};

/** Two sizes: compact `sm` for dense tee sheets, roomy `md` for the booking screen. */
export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <TeeTimeSlot size="sm" time="9:00 AM" price={62} spotsAvailable={4} />
            <TeeTimeSlot size="md" time="9:00 AM" price={62} spotsAvailable={4} />
        </div>
    ),
};

/** A live morning row from the Sagamore tee sheet — tap a slot to lock it in. */
export const Grid: Story = {
    render: () => {
        const [selectedId, setSelectedId] = useState<string | null>(null);
        const groups = groupTeeTimes("weekend");

        return (
            <div className="flex max-w-2xl flex-col gap-5">
                {(Object.keys(groups) as TimeOfDay[]).map((window) => (
                    <div key={window} className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-secondary">{timeOfDayLabels[window]}</h3>
                        <div className="flex flex-wrap gap-2">
                            {groups[window].slice(0, 6).map((slot) => (
                                <TeeTimeSlot
                                    key={slot.id}
                                    teeTime={slot}
                                    size="sm"
                                    isSelected={selectedId === slot.id}
                                    onPress={() => setSelectedId(slot.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    },
};

/** Full tee sheet including sold-out slots, so you can see the muted disabled state inline. */
export const FullSheetWithSoldOut: Story = {
    render: () => {
        const slots = generateTeeTimes("weekday").slice(0, 8);
        return (
            <div className="flex max-w-xl flex-wrap gap-2">
                {slots.map((slot) => (
                    <TeeTimeSlot key={slot.id} teeTime={slot} size="sm" />
                ))}
            </div>
        );
    },
};
