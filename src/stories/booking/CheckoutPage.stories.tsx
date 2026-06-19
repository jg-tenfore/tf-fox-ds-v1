import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, Lock01, Mail01, User01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { PaymentInput } from "@/components/base/input/input-payment";
import { BookingSummary, type BookingSummaryLineItem } from "@/components/booking/booking-summary";
import { PlayerStepper } from "@/components/booking/player-stepper";
import {
    addOns,
    course,
    formatPrice,
    rates,
    twilightRate,
    type AddOn,
    type HoleCount,
    type Ride,
} from "@/components/booking/sagamore-data";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";

interface CheckoutPageProps {
    dateLabel: string;
    timeLabel: string;
    holes: HoleCount;
    ride: Ride;
    /** Day type drives weekday vs. weekend green-fee pricing. */
    dayType: "weekday" | "weekend";
    /** When true, charge the flat per-player twilight rate (cart included). */
    twilight: boolean;
    /** Initial party size. */
    players: number;
    /** Add-on ids selected by default. */
    defaultAddOns: string[];
}

/** Per-unit quantity for an add-on given the party size. */
const addOnQuantity = (addOn: AddOn, players: number): number => {
    // A shared riding cart seats two, so one cart per pair of riders.
    if (addOn.per === "rider") return Math.ceil(players / 2);
    return players;
};

const Section = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
    <section className="flex flex-col gap-4 border-b border-secondary pb-8">
        <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-primary">{title}</h2>
            {description && <p className="text-sm text-tertiary">{description}</p>}
        </div>
        {children}
    </section>
);

const CheckoutPage = ({ dateLabel, timeLabel, holes, ride, dayType, twilight, players: initialPlayers, defaultAddOns }: CheckoutPageProps) => {
    const [players, setPlayers] = useState(initialPlayers);
    const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set(defaultAddOns));

    const perPlayerGreenFee = twilight ? twilightRate[holes] : rates[holes][dayType][ride];
    const greenFeeLabel = `${twilight ? "Twilight green fees" : "Green fees"} · ${players} × ${formatPrice(perPlayerGreenFee)}`;

    const lineItems: BookingSummaryLineItem[] = [{ label: greenFeeLabel, amount: perPlayerGreenFee * players }];

    for (const addOn of addOns) {
        if (!selectedAddOns.has(addOn.id)) continue;
        const quantity = addOnQuantity(addOn, players);
        lineItems.push({
            label: `${addOn.label} · ${quantity} × ${formatPrice(addOn.price)}`,
            amount: addOn.price * quantity,
        });
    }

    const toggleAddOn = (id: string, isSelected: boolean) => {
        setSelectedAddOns((prev) => {
            const next = new Set(prev);
            if (isSelected) next.add(id);
            else next.delete(id);
            return next;
        });
    };

    return (
        <main className="min-h-screen bg-secondary_subtle">
            <header className="border-b border-secondary bg-primary">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
                    <SagamoreLogo className="h-10 w-auto" />
                    <span className="hidden text-sm text-tertiary sm:inline">{course.type}</span>
                </div>
            </header>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:px-8 lg:grid-cols-[1fr_24rem] lg:gap-12 lg:py-12">
                {/* Left: review & confirm */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <Button href="#" color="link-gray" size="sm" iconLeading={ArrowLeft} className="self-start">
                            Back to tee times
                        </Button>
                        <h1 className="text-display-xs font-semibold text-primary">Review &amp; confirm</h1>
                        <p className="text-md text-tertiary">
                            You&apos;re booking {course.name} on {dateLabel} at {timeLabel}. Review your party and finish checkout below.
                        </p>
                    </div>

                    <Section title="Players" description="Tell us who's leading the group and how many are playing.">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Input label="Lead golfer" placeholder="Olivia Rhye" icon={User01} isRequired />
                            <Input label="Email" type="email" placeholder="olivia@untitledui.com" icon={Mail01} isRequired />
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-primary px-4 py-3 ring-1 ring-secondary ring-inset">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-secondary">Party size</span>
                                <span className="text-sm text-tertiary">Up to 4 players per tee time</span>
                            </div>
                            <PlayerStepper value={players} min={1} max={4} onChange={setPlayers} label="Players" size="sm" />
                        </div>
                    </Section>

                    <Section title="Add-ons" description="Round out your day at Sagamore Spring.">
                        <ul className="flex flex-col gap-4">
                            {addOns.map((addOn) => (
                                <li key={addOn.id} className="flex items-start justify-between gap-4">
                                    <Checkbox
                                        size="md"
                                        label={addOn.label}
                                        hint={addOn.description}
                                        isSelected={selectedAddOns.has(addOn.id)}
                                        onChange={(isSelected) => toggleAddOn(addOn.id, isSelected)}
                                    />
                                    <span className="shrink-0 pt-0.5 text-sm font-medium text-secondary tabular-nums">
                                        {formatPrice(addOn.price)}
                                        <span className="text-tertiary"> / {addOn.per}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="Payment" description="Charged today to secure your reservation.">
                        <PaymentInput label="Card number" placeholder="1234 1234 1234 1234" isRequired />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Expiry" placeholder="MM / YY" isRequired />
                            <Input label="CVC" placeholder="123" icon={Lock01} isRequired />
                        </div>
                        <Input label="Name on card" placeholder="Olivia Rhye" isRequired />
                    </Section>

                    <div className="flex flex-col gap-3">
                        <Button color="primary" size="lg" iconLeading={Lock01} className="w-full sm:w-auto sm:self-start">
                            Confirm booking
                        </Button>
                        <p className="text-xs text-tertiary">
                            By confirming, you agree to Sagamore Spring&apos;s cancellation policy. Free cancellation up to 24 hours before tee time.
                        </p>
                    </div>
                </div>

                {/* Right: sticky summary */}
                <aside className="lg:sticky lg:top-12 lg:self-start">
                    <BookingSummary
                        dateLabel={dateLabel}
                        timeLabel={timeLabel}
                        holes={holes}
                        players={players}
                        ride={ride}
                        lineItems={lineItems}
                        className="max-w-none"
                    />
                </aside>
            </div>
        </main>
    );
};

/**
 * The Resy-style confirm screen for a Sagamore Spring tee time. A two-column
 * checkout: lead-golfer details, party stepper, add-ons, and card fields on the
 * left; a sticky booking summary that recomputes from the real green-fee rates
 * and chosen add-ons on the right.
 */
const meta = {
    title: "Booking/Pages/Checkout",
    tags: ["!dev"],
    component: CheckoutPage,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CheckoutPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A full foursome riding 18 on a weekend morning, cart added. */
export const Default: Story = {
    args: {
        dateLabel: "Sat, Jun 21",
        timeLabel: "8:30 AM",
        holes: 18,
        ride: "cart",
        dayType: "weekend",
        twilight: false,
        players: 4,
        defaultAddOns: ["cart"],
    },
};

/** Two walking 18 after 3 PM at the flat twilight rate — the value play of the day. */
export const TwilightWalk: Story = {
    args: {
        dateLabel: "Wed, Jun 18",
        timeLabel: "4:40 PM",
        holes: 18,
        ride: "walking",
        dayType: "weekday",
        twilight: true,
        players: 2,
        defaultAddOns: ["push-cart"],
    },
};
