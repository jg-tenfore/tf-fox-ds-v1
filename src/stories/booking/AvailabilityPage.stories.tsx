import { useMemo, useState } from "react";
import { ArrowRight, CalendarHeart01, MarkerPin02, X as CloseX } from "@untitledui/icons";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/base/buttons/button";
import { HolesFilter, RideFilter } from "@/components/booking/booking-filters";
import { DateSelector } from "@/components/booking/date-selector";
import { PlayerStepper } from "@/components/booking/player-stepper";
import {
    course,
    groupTeeTimes,
    timeOfDayLabels,
    type DayType,
    type HoleCount,
    type Ride as RideType,
    type TeeTime,
    type TimeOfDay,
} from "@/components/booking/sagamore-data";
import { TeeTimeSlot } from "@/components/booking/tee-time-slot";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";

const heroImage = sagamoreImagesByCategory("photography")[0]?.src;

/** Order the booking windows top-to-bottom on the tee sheet. */
const windowOrder: TimeOfDay[] = ["morning", "midday", "twilight"];

interface AvailabilityPageProps {
    dayType: DayType;
    /** Friendly date label for the chosen day, shown in the summary bar. */
    initialDateOffset?: number;
}

/**
 * The full search-results screen for the Sagamore Spring tee-time experience:
 * a slim brand bar, an OpenTable-style reservation header, and the day's tee
 * sheet grouped into morning / midday / twilight windows. Selecting a slot
 * raises a sticky checkout bar. Green is reserved for selection and the primary
 * CTA; everything else stays monochrome.
 */
const AvailabilityPage = ({ dayType }: AvailabilityPageProps) => {
    const [players, setPlayers] = useState(2);
    const [holes, setHoles] = useState<HoleCount>(18);
    const [ride, setRide] = useState<RideType>("cart");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const groups = useMemo(() => groupTeeTimes(dayType), [dayType]);

    const selected: TeeTime | null = useMemo(() => {
        if (!selectedId) return null;
        for (const window of windowOrder) {
            const match = groups[window].find((slot) => slot.id === selectedId);
            if (match) return match;
        }
        return null;
    }, [groups, selectedId]);

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            {/* Slim top bar */}
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-secondary bg-primary px-4 py-3 md:px-8">
                <SagamoreLogo className="h-9 w-auto" />
                <Button size="sm" color="secondary" iconLeading={CalendarHeart01}>
                    My rounds
                </Button>
            </header>

            {/* Reservation header */}
            <section className="border-b border-secondary bg-primary">
                {heroImage && (
                    <div className="relative h-40 w-full overflow-hidden md:h-56">
                        <img src={heroImage} alt={`${course.name} course`} className="size-full object-cover" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
                        <div className="absolute right-0 bottom-0 left-0 px-4 pb-4 md:px-8 md:pb-6">
                            <h1 className="text-display-xs font-semibold text-white md:text-display-sm">{course.name}</h1>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
                                <MarkerPin02 aria-hidden="true" className="size-4 shrink-0" />
                                {course.city} · {course.type}
                            </p>
                        </div>
                    </div>
                )}

                {/* Controls row */}
                <div className="mx-auto w-full max-w-5xl px-4 py-5 md:px-8">
                    <div className="mb-4">
                        <DateSelector days={7} defaultValue={new Date()} />
                    </div>
                    <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-secondary uppercase">Players</span>
                            <PlayerStepper label="Players" value={players} onChange={setPlayers} size="sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-secondary uppercase">Holes</span>
                            <HolesFilter value={holes} onChange={setHoles} size="sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-secondary uppercase">Ride</span>
                            <RideFilter value={ride} onChange={setRide} size="sm" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Results */}
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-28 md:px-8">
                <div className="flex flex-col gap-8">
                    {windowOrder.map((window) => {
                        const slots = groups[window];
                        if (slots.length === 0) return null;

                        return (
                            <section key={window} aria-labelledby={`window-${window}`}>
                                <div className="mb-3 flex items-baseline justify-between">
                                    <h2 id={`window-${window}`} className="text-lg font-semibold text-primary">
                                        {timeOfDayLabels[window]}
                                    </h2>
                                    <span className="text-sm text-tertiary tabular-nums">
                                        {slots.length} {slots.length === 1 ? "time" : "times"}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {slots.map((slot) => (
                                        <TeeTimeSlot
                                            key={slot.id}
                                            teeTime={slot}
                                            isSelected={selectedId === slot.id}
                                            onPress={() => setSelectedId((current) => (current === slot.id ? null : slot.id))}
                                        />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>

            {/* Sticky checkout summary */}
            {selected && (
                <div className="sticky bottom-0 z-30 border-t border-secondary bg-primary px-4 py-3 shadow-lg md:px-8">
                    <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Button
                                size="sm"
                                color="tertiary"
                                iconLeading={CloseX}
                                aria-label="Clear selection"
                                onClick={() => setSelectedId(null)}
                            />
                            <div className="min-w-0">
                                <p className="truncate text-md font-semibold text-primary tabular-nums">
                                    {selected.label} · {players} {players === 1 ? "player" : "players"} · {holes} holes
                                </p>
                                <p className="text-sm text-tertiary">
                                    {ride === "cart" ? "Riding" : "Walking"} · {course.shortName}
                                </p>
                            </div>
                        </div>
                        <Button size="md" color="primary" iconTrailing={ArrowRight}>
                            Continue to checkout
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

const meta = {
    title: "Booking/Pages/Availability",
    component: AvailabilityPage,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AvailabilityPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Weekday tee sheet — standard green fees across the morning, midday, and twilight windows. */
export const Default: Story = {
    args: { dayType: "weekday" },
};

/** Weekend tee sheet — higher weekend rates, same flow. */
export const Weekend: Story = {
    args: { dayType: "weekend" },
};
