import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Clock, Flag06, Heart, MarkerPin02, Phone, Share07, Star01, Users01 } from "@untitledui/icons";
import { Tabs } from "@/components/application/tabs/tabs";
import { Button } from "@/components/base/buttons/button";
import { DateSelector } from "@/components/booking/date-selector";
import { course, formatPrice, generateTeeTimes, type TeeTime } from "@/components/booking/sagamore-data";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";
import { cx } from "@/utils/cx";

/**
 * Explorations/Google — a recreation of the "Book a tee time" module Google
 * surfaces in its course knowledge panel (Reserve with Google). Clean Material
 * layout: white cards, light dividers, rounded chips, a photo strip, tabbed
 * sections, and tee-time option rows with per-player price, provider line, and
 * a Book action. Populated with realistic Sagamore Spring data.
 */
const meta = {
    title: "Explorations/Google",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const photos = sagamoreImagesByCategory("photography");

/* -------------------------------------------------------------------------- */
/* Booking-source providers — Google aggregates from multiple booking partners */
/* -------------------------------------------------------------------------- */

interface Provider {
    name: string;
    dotClass: string;
}

const providers: Provider[] = [
    { name: "GolfNow", dotClass: "bg-success-primary" },
    { name: "Sagamore Spring", dotClass: "bg-brand-solid" },
    { name: "TeeOff", dotClass: "bg-tertiary" },
    { name: "Chronogolf", dotClass: "bg-quaternary" },
];

/** Deterministically attach booking metadata to a tee-time slot. */
interface TeeOption extends TeeTime {
    provider: Provider;
    holes: 9 | 18;
    ride: "Cart" | "Walking";
    players: number;
}

const buildOptions = (slots: TeeTime[]): TeeOption[] =>
    slots.map((slot, i) => {
        const isTwilight = slot.timeOfDay === "twilight";
        return {
            ...slot,
            provider: providers[i % providers.length],
            holes: i % 5 === 2 ? 9 : 18,
            ride: isTwilight || i % 3 === 0 ? "Cart" : "Walking",
            players: slot.spotsAvailable,
        };
    });

/* -------------------------------------------------------------------------- */
/* Small Material-style atoms                                                  */
/* -------------------------------------------------------------------------- */

const Chip = ({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className={cx(
            "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition duration-100 ease-linear",
            active ? "border-brand bg-brand-primary text-brand-secondary" : "border-primary bg-primary text-secondary hover:bg-primary_hover",
        )}
    >
        {children}
    </button>
);

const StarRating = ({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) => {
    const dim = size === "md" ? "size-4" : "size-3.5";
    return (
        <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < Math.round(value);
                return (
                    <Star01
                        key={i}
                        className={cx(dim, filled ? "fill-current text-warning-primary" : "fill-current text-quaternary")}
                    />
                );
            })}
        </span>
    );
};

const GoogleButton = ({ children, variant = "filled" }: { children: React.ReactNode; variant?: "filled" | "outline" }) => (
    <button
        type="button"
        className={cx(
            "h-9 rounded-full px-4 text-sm font-medium transition duration-100 ease-linear",
            variant === "filled"
                ? "bg-brand-solid text-white hover:bg-brand-solid_hover"
                : "border border-primary bg-primary text-brand-secondary hover:bg-primary_hover",
        )}
    >
        {children}
    </button>
);

/* -------------------------------------------------------------------------- */
/* Photo strip                                                                 */
/* -------------------------------------------------------------------------- */

const PhotoStrip = () => (
    <div className="grid h-44 grid-cols-4 gap-1 overflow-hidden sm:h-56">
        <div className="col-span-2 row-span-1 overflow-hidden bg-secondary">
            <img src={photos[0]?.src} alt={course.name} className="size-full object-cover" />
        </div>
        <div className="overflow-hidden bg-secondary">
            <img src={photos[1]?.src} alt="" className="size-full object-cover" />
        </div>
        <div className="overflow-hidden bg-secondary">
            <img src={photos[2]?.src} alt="" className="size-full object-cover" />
        </div>
        <div className="overflow-hidden bg-secondary">
            <img src={photos[3]?.src} alt="" className="size-full object-cover" />
        </div>
        <div className="relative overflow-hidden bg-secondary">
            <img src={photos[4]?.src ?? photos[0]?.src} alt="" className="size-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-overlay text-sm font-medium text-white">+18</div>
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/* Header / course info                                                        */
/* -------------------------------------------------------------------------- */

const CourseHeader = () => (
    <div className="px-4 pt-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl leading-tight font-normal text-primary">{course.name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-tertiary">
                    <span className="font-medium text-primary">4.6</span>
                    <StarRating value={4.6} />
                    <a href="#reviews" className="text-brand-secondary hover:underline">
                        412 Google reviews
                    </a>
                    <span aria-hidden>·</span>
                    <span>$$</span>
                </div>
                <p className="mt-1 text-sm text-tertiary">
                    Public golf course · {course.holes} holes · Par {course.par} · Est. {course.established}
                </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
                <button
                    type="button"
                    aria-label="Save"
                    className="flex size-9 items-center justify-center rounded-full border border-primary text-brand-secondary hover:bg-primary_hover"
                >
                    <Heart className="size-4.5" />
                </button>
                <button
                    type="button"
                    aria-label="Share"
                    className="flex size-9 items-center justify-center rounded-full border border-primary text-brand-secondary hover:bg-primary_hover"
                >
                    <Share07 className="size-4.5" />
                </button>
            </div>
        </div>

        <div className="mt-3 space-y-1.5 text-sm text-secondary">
            <div className="flex items-start gap-2.5">
                <MarkerPin02 className="mt-0.5 size-4 shrink-0 text-fg-quaternary" />
                <a href="#map" className="text-brand-secondary hover:underline">
                    {course.address}
                </a>
            </div>
            <div className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-fg-quaternary" />
                <a href={`tel:${course.phone}`} className="text-brand-secondary hover:underline">
                    {course.phone}
                </a>
            </div>
            <div className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-fg-quaternary" />
                <span>
                    <span className="font-medium text-success-primary">Open</span> · First tee 6:40 AM, last tee 6:00 PM
                </span>
            </div>
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/* Tee-time option row                                                         */
/* -------------------------------------------------------------------------- */

const spotsLabel = (n: number) => (n === 1 ? "1 spot left" : `${n} spots left`);

const TeeOptionRow = ({ option }: { option: TeeOption }) => {
    const isTwilight = option.timeOfDay === "twilight";
    const scarce = option.players <= 2;

    return (
        <div className="flex items-center gap-3 px-4 py-3 transition duration-100 ease-linear hover:bg-secondary_hover sm:px-6">
            {/* Time */}
            <div className="w-24 shrink-0">
                <div className="text-base font-medium text-primary tabular-nums">{option.label}</div>
                <div className="mt-0.5 flex items-center gap-1">
                    <span className={cx("inline-block size-2 rounded-full", option.provider.dotClass)} />
                    <span className="truncate text-xs text-tertiary">{option.provider.name}</span>
                </div>
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary">
                        <Flag06 className="size-3" /> {option.holes} holes
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary">
                        {option.ride}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary">
                        <Users01 className="size-3" /> Up to {option.players}
                    </span>
                    {isTwilight && (
                        <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-warning-primary">
                            Twilight
                        </span>
                    )}
                </div>
                <div className={cx("mt-1 text-xs", scarce ? "font-medium text-error-primary" : "text-tertiary")}>
                    {spotsLabel(option.players)}
                </div>
            </div>

            {/* Price + action */}
            <div className="flex shrink-0 flex-col items-end gap-1.5">
                <div className="text-right">
                    <span className="text-base font-medium text-primary tabular-nums">{formatPrice(option.price)}</span>
                    <span className="text-xs text-tertiary"> /player</span>
                </div>
                <GoogleButton>Book</GoogleButton>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/* Tee-times tab content                                                       */
/* -------------------------------------------------------------------------- */

const TeeTimesPanel = ({ compact }: { compact?: boolean }) => {
    const [dayType, setDayType] = useState<"weekday" | "weekend">("weekday");
    const [players, setPlayers] = useState<number | null>(null);

    const start = new Date(2026, 5, 20); // Sat, Jun 20 2026
    let options = buildOptions(generateTeeTimes(dayType).filter((s) => s.spotsAvailable > 0));
    if (players) options = options.filter((o) => o.players >= players);
    const visible = compact ? options.slice(0, 8) : options.slice(0, 14);

    return (
        <div className="pt-1">
            {/* Reserve-with-Google banner */}
            <div className="mx-4 mt-3 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs text-tertiary sm:mx-6">
                <span className="flex items-center gap-1 font-medium text-brand-secondary">Google</span>
                <span>Reserve with Google · Prices are per player and may include cart. Taxes &amp; fees calculated at checkout.</span>
            </div>

            {/* Date row */}
            <div className="px-4 pt-3 sm:px-6">
                <DateSelector days={compact ? 5 : 7} startDate={start} defaultValue={start} />
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
                <Chip active={dayType === "weekday"} onClick={() => setDayType("weekday")}>
                    Weekday
                </Chip>
                <Chip active={dayType === "weekend"} onClick={() => setDayType("weekend")}>
                    Weekend
                </Chip>
                <span className="my-1 w-px shrink-0 bg-tertiary" />
                {[1, 2, 3, 4].map((p) => (
                    <Chip key={p} active={players === p} onClick={() => setPlayers(players === p ? null : p)}>
                        <Users01 className="size-3.5" /> {p}
                        {p === 4 ? "+" : ""}
                    </Chip>
                ))}
            </div>

            {/* Option list */}
            <div className="divide-y divide-secondary border-t border-secondary">
                {visible.map((o) => (
                    <TeeOptionRow key={o.id} option={o} />
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                <p className="text-xs text-tertiary">
                    Showing {visible.length} of {options.length} available times
                </p>
                <GoogleButton variant="outline">More times</GoogleButton>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/* Other tab panels (Overview / Reviews / About)                               */
/* -------------------------------------------------------------------------- */

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between border-b border-secondary py-2.5 text-sm last:border-0">
        <span className="text-tertiary">{label}</span>
        <span className="font-medium text-primary">{value}</span>
    </div>
);

const OverviewPanel = () => (
    <div className="space-y-5 px-4 py-4 sm:px-6">
        <p className="text-sm leading-relaxed text-secondary">
            A classic New England layout open since {course.established}, {course.shortName} plays {course.yards.toLocaleString()} yards
            to a par of {course.par}. Walkable, well-conditioned, and friendly for every handicap — book 9 or 18, walking or riding,
            with twilight rates after 3 PM.
        </p>
        <div>
            <InfoRow label="Course type" value={course.type} />
            <InfoRow label="Holes" value={`${course.holes} (par ${course.par})`} />
            <InfoRow label="Length" value={`${course.yards.toLocaleString()} yds`} />
            <InfoRow label="Established" value={String(course.established)} />
            <InfoRow label="Weekday 18 (cart)" value={formatPrice(62)} />
            <InfoRow label="Twilight 18" value={`${formatPrice(32)} (cart incl.)`} />
        </div>
        <p className="text-xs text-tertiary">
            Prices shown are per player and may include a shared cart. Walking rates available on most times. Rates and availability
            are provided by booking partners and may change.
        </p>
    </div>
);

const reviews = [
    { name: "Marcus T.", initial: "M", avatarClass: "bg-brand-solid", rating: 5, when: "2 weeks ago", text: "Greens were rolling true and pace of play was great. Booked a twilight 18 with cart for $32 — unbeatable." },
    { name: "Priya N.", initial: "P", avatarClass: "bg-warning-solid", rating: 4, when: "a month ago", text: "Fun, walkable layout. Easy to grab a 9-hole time after work. Pro shop staff super friendly." },
    { name: "Dan R.", initial: "D", avatarClass: "bg-success-solid", rating: 5, when: "a month ago", text: "Brought a foursome on a Saturday morning. Reserve with Google made booking all 4 spots painless." },
];

const ReviewsPanel = () => (
    <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4 border-b border-secondary pb-4">
            <div className="text-center">
                <div className="text-4xl font-normal text-primary">4.6</div>
                <StarRating value={4.6} size="md" />
                <div className="mt-1 text-xs text-tertiary">412 reviews</div>
            </div>
            <div className="flex-1 space-y-1">
                {[
                    [5, 78],
                    [4, 15],
                    [3, 4],
                    [2, 2],
                    [1, 1],
                ].map(([star, pct]) => (
                    <div key={star} className="flex items-center gap-2 text-xs text-tertiary">
                        <span className="w-2 tabular-nums">{star}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                            <div className="h-full rounded-full bg-warning-solid" style={{ width: `${pct}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="divide-y divide-secondary">
            {reviews.map((r) => (
                <div key={r.name} className="py-4">
                    <div className="flex items-center gap-2.5">
                        <span
                            className={cx("flex size-8 items-center justify-center rounded-full text-sm font-medium text-white", r.avatarClass)}
                        >
                            {r.initial}
                        </span>
                        <div>
                            <div className="text-sm font-medium text-primary">{r.name}</div>
                            <div className="flex items-center gap-1.5">
                                <StarRating value={r.rating} />
                                <span className="text-xs text-tertiary">{r.when}</span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-secondary">{r.text}</p>
                </div>
            ))}
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/* The full module                                                             */
/* -------------------------------------------------------------------------- */

const Module = ({ compact }: { compact?: boolean }) => (
    <div
        className={cx(
            "overflow-hidden rounded-xl bg-primary text-primary shadow-xs ring-1 ring-secondary",
            compact ? "w-full" : "w-full max-w-[640px]",
        )}
    >
        <PhotoStrip />
        <CourseHeader />

        <Tabs defaultSelectedKey="tee-times" className="mt-4">
            <div className="border-b border-secondary px-4 sm:px-6">
                <Tabs.List type="underline" size="sm" aria-label="Course sections">
                    <Tabs.Item id="overview">Overview</Tabs.Item>
                    <Tabs.Item id="tee-times">Tee times</Tabs.Item>
                    <Tabs.Item id="reviews">Reviews</Tabs.Item>
                </Tabs.List>
            </div>

            <Tabs.Panel id="overview">
                <OverviewPanel />
            </Tabs.Panel>
            <Tabs.Panel id="tee-times">
                <TeeTimesPanel compact={compact} />
            </Tabs.Panel>
            <Tabs.Panel id="reviews">
                <ReviewsPanel />
            </Tabs.Panel>
        </Tabs>
    </div>
);

/* -------------------------------------------------------------------------- */
/* Search-result shell (so the module reads like Google's right-hand panel)    */
/* -------------------------------------------------------------------------- */

const SearchChrome = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-secondary py-6">
        {/* Faux search bar */}
        <div className="mx-auto mb-5 flex max-w-[680px] items-center gap-3 px-4">
            <span className="text-2xl font-medium tracking-tight text-brand-secondary">Google</span>
            <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-primary px-4 text-sm text-tertiary shadow-sm ring-1 ring-secondary">
                <span>sagamore spring golf tee times</span>
            </div>
        </div>
        <div className="mx-auto flex max-w-[680px] justify-center px-4">{children}</div>
    </div>
);

export const TeeTimeModule: Story = {
    render: () => (
        <SearchChrome>
            <Module />
        </SearchChrome>
    ),
};

export const Mobile: Story = {
    parameters: { viewport: { defaultViewport: "mobile1" } },
    render: () => (
        <div className="min-h-screen bg-secondary p-2">
            <div className="mx-auto max-w-[420px]">
                <Module compact />
            </div>
        </div>
    ),
};
