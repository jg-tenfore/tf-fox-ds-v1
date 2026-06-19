import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HolesFilter, RideFilter, TimeOfDayFilter } from "@/components/booking/booking-filters";
import { PlayerStepper } from "@/components/booking/player-stepper";
import type { HoleCount, Ride as RideType, TimeOfDay as TimeOfDayType } from "@/components/booking/sagamore-data";

/**
 * The compact controls that sit atop the Sagamore Spring tee sheet: how many in
 * your group, how long you're playing, whether you're walking or riding, and when
 * you want to tee off. Selected segments light up in the club green; everything
 * else stays monochrome.
 */
const meta = {
    title: "Booking/Molecules/Booking Controls",
    tags: ["!dev"],
    parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Party size — dial your group from a solo loop up to a full foursome. */
export const PartySize: Story = {
    render: () => {
        const [players, setPlayers] = useState(2);
        return (
            <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-secondary">Players in your group</span>
                <PlayerStepper label="Players" value={players} onChange={setPlayers} />
                <span className="text-sm text-tertiary">
                    Booking for {players} {players === 1 ? "golfer" : "golfers"}
                </span>
            </div>
        );
    },
};

/** Round length — a quick nine after work or the full eighteen. */
export const Holes: Story = {
    render: () => {
        const [holes, setHoles] = useState<HoleCount>(18);
        return (
            <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-secondary">How many holes?</span>
                <HolesFilter value={holes} onChange={setHoles} />
            </div>
        );
    },
};

/** Getting around — walk the fairways or grab a cart. */
export const Ride: Story = {
    render: () => {
        const [ride, setRide] = useState<RideType>("walking");
        return (
            <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-secondary">Walking or riding?</span>
                <RideFilter value={ride} onChange={setRide} />
            </div>
        );
    },
};

/** Booking window — beat the heat in the morning or chase the twilight rate. */
export const TimeOfDay: Story = {
    render: () => {
        const [time, setTime] = useState<TimeOfDayType>("morning");
        return (
            <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-secondary">When do you want to tee off?</span>
                <TimeOfDayFilter value={time} onChange={setTime} />
            </div>
        );
    },
};

/** Every control together, as they'd line up in the reservation widget. */
export const AllControls: Story = {
    render: () => {
        const [players, setPlayers] = useState(4);
        const [holes, setHoles] = useState<HoleCount>(18);
        const [ride, setRide] = useState<RideType>("cart");
        const [time, setTime] = useState<TimeOfDayType>("morning");

        return (
            <div className="flex max-w-3xl flex-col gap-6 rounded-2xl bg-primary p-6 ring-1 ring-secondary">
                <div>
                    <h3 className="text-lg font-semibold text-primary">Book a tee time</h3>
                    <p className="text-sm text-tertiary">Sagamore Spring Golf Club · Lynnfield, MA</p>
                </div>

                <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-secondary">Players</span>
                        <PlayerStepper label="Players" value={players} onChange={setPlayers} size="sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-secondary">Holes</span>
                        <HolesFilter value={holes} onChange={setHoles} size="sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-secondary">Ride</span>
                        <RideFilter value={ride} onChange={setRide} size="sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-secondary">Tee-off window</span>
                        <TimeOfDayFilter value={time} onChange={setTime} size="sm" />
                    </div>
                </div>

                <p className="text-sm text-tertiary">
                    {players} {players === 1 ? "player" : "players"} · {holes} holes · {ride === "cart" ? "riding" : "walking"} · {time}
                </p>
            </div>
        );
    },
};
