import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Flag01,
    MarkerPin02,
    Minus,
    Plus,
    ShieldTick,
    Star01,
    Sun,
    Tag01,
    Truck01,
    Users01,
} from "@untitledui/icons";
import {
    course,
    formatPrice,
    generateTeeTimes,
    rates,
    timeOfDayLabels,
    twilightRate,
    type DayType,
    type HoleCount,
    type Ride,
    type TeeTime,
    type TimeOfDay,
} from "@/components/booking/sagamore-data";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";
import { cx } from "@/utils/cx";

/**
 * Explorations/SevenRooms + GolfNow — a synthesis of two references.
 *
 * The CHASSIS is SevenRooms: a centered, editorial, card-based reservation
 * experience — wordmark header, large hero, venue heading, and a pill-shaped
 * search bar (Players / Date / Round). The PAYLOAD is GolfNow: every tee-time
 * result is an elegant card carrying real golf detail — per-player price, a
 * "Hot Deal" last-minute discount, spots-left scarcity, 9 vs 18 holes,
 * walking vs cart (cart included), twilight pricing, and a star rating. The
 * result feels like SevenRooms but is purpose-built for golf, with every golf
 * edge case surfaced on the card itself.
 */

// SevenRooms' editorial restraint pairs a solid dark surface for selection with
// the brand color reserved for the primary booking action. The Hot Deal badge
// and star rating use the design system's brand and warning tokens.

const FEE = 2.49;

const photos = sagamoreImagesByCategory("photography");
const heroSrc = photos[0]?.src ?? "";
const gallery = photos.slice(1, 6);

const courseRating = 4.3;
const reviewCount = 187;

const meta = {
    title: "Explorations/SevenRooms + GolfNow",
    tags: ["!dev"],
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Golf decoration — fold GolfNow edge cases onto the tee sheet        */
/* ------------------------------------------------------------------ */

interface GolfSlot extends TeeTime {
    holes: HoleCount;
    cartIncluded: boolean;
    isHotDeal: boolean;
    /** Pre-discount per-player price when this slot is a Hot Deal. */
    wasPrice?: number;
}

/** Decorate raw slots with deterministic golf metadata (no randomness → SSR-safe). */
const decorate = (slots: TeeTime[]): GolfSlot[] =>
    slots.map((slot, i) => {
        const isTwilight = slot.timeOfDay === "twilight";
        const isHotDeal = i % 6 === 2 || (isTwilight && i % 3 === 0);
        const holes: HoleCount = isTwilight && i % 2 === 0 ? 9 : 18;
        const cartIncluded = isTwilight || i % 4 !== 1;
        const wasPrice = isHotDeal ? slot.price + (isTwilight ? 8 : 14) : undefined;
        return { ...slot, holes, cartIncluded, isHotDeal, wasPrice };
    });

/** The decorated tee sheet, grouped into the three booking windows. */
const useTeeSheet = (players: number) =>
    useMemo(() => {
        const decorated = decorate(generateTeeTimes("weekday").filter((s) => s.spotsAvailable >= players));
        const byWindow: Record<TimeOfDay, GolfSlot[]> = { morning: [], midday: [], twilight: [] };
        for (const slot of decorated) byWindow[slot.timeOfDay].push(slot);
        return byWindow;
    }, [players]);

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

const Wordmark = () => (
    <header className="flex items-center justify-center border-b border-secondary py-5">
        <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs tracking-widest text-tertiary uppercase">Sagamore Spring</span>
            <span className="text-lg font-semibold tracking-wider text-primary uppercase">Golf Club</span>
        </div>
    </header>
);

const Stars = ({ value }: { value: number }) => (
    <span className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => {
            const filled = i + 1 <= Math.round(value);
            return <Star01 key={i} className={cx("size-3.5", filled ? "fill-current text-warning-primary" : "text-quaternary")} aria-hidden="true" />;
        })}
    </span>
);

const Hero = () => (
    <div className="overflow-hidden rounded-2xl">
        <img src={heroSrc} alt="Sagamore Spring Golf Club fairway" className="h-64 w-full object-cover sm:h-80" />
    </div>
);

const VenueHeading = () => (
    <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-primary">{course.name}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-tertiary">
            <span className="flex items-center gap-1.5">
                <MarkerPin02 className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                {course.address}
            </span>
            <span className="flex items-center gap-1.5">
                <Stars value={courseRating} />
                <span className="font-medium text-secondary tabular-nums">{courseRating.toFixed(1)}</span>
                <span className="text-tertiary">· {reviewCount} reviews</span>
            </span>
        </div>
    </div>
);

/* ------------------------------------------------------------------ */
/* Search bar — the pill-shaped Players / Date / Round segments        */
/* ------------------------------------------------------------------ */

const SEARCH_DATE = "Jun 18";

type Panel = "players" | "date" | "round" | null;

const SegmentField = ({
    label,
    value,
    isActive,
    onClick,
    className,
}: {
    label: string;
    value: string;
    isActive: boolean;
    onClick: () => void;
    className?: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={cx(
            "flex flex-1 cursor-pointer flex-col gap-0.5 px-5 py-3 text-left outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:-outline-offset-1",
            isActive ? "bg-primary shadow-sm ring-1 ring-secondary" : "hover:bg-primary",
            className,
        )}
    >
        <span className="text-xs tracking-wide text-tertiary uppercase">{label}</span>
        <span className="text-sm font-medium text-primary">{value}</span>
    </button>
);

const PopoverCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cx("absolute top-[calc(100%+8px)] z-20 rounded-2xl border border-secondary_alt bg-primary p-2 shadow-xl", className)}>
        {children}
    </div>
);

const RowChoice = ({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: { id: string; label: string }[];
    value: string;
    onChange: (id: string) => void;
}) => (
    <div className="flex flex-col gap-1.5">
        <span className="px-1 text-xs tracking-wide text-tertiary uppercase">{label}</span>
        <div className="flex gap-1.5">
            {options.map((opt) => {
                const selected = opt.id === value;
                return (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChange(opt.id)}
                        className={cx(
                            "flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition duration-100 ease-linear",
                            selected ? "bg-primary-solid text-white" : "text-secondary ring-1 ring-secondary ring-inset hover:bg-secondary_hover",
                        )}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    </div>
);

/** A static two-month-style calendar matching the SevenRooms date popover. */
const CalendarPanel = () => {
    const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
    const lead = 1; // June 2026 starts on a Monday; the 18th is selected.
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const cells: (number | null)[] = [...Array.from({ length: lead }, () => null), ...days];

    return (
        <div className="flex flex-col gap-3 p-2">
            <div className="flex items-center justify-between px-1">
                <button type="button" className="rounded-full p-1.5 text-fg-quaternary hover:bg-secondary_hover" aria-label="Previous month">
                    <ChevronLeft className="size-4" />
                </button>
                <span className="text-sm font-semibold text-primary">June 2026</span>
                <button type="button" className="rounded-full p-1.5 text-fg-quaternary hover:bg-secondary_hover" aria-label="Next month">
                    <ChevronRight className="size-4" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center">
                {weekdays.map((d, i) => (
                    <span key={i} className="text-xs font-medium text-quaternary">
                        {d}
                    </span>
                ))}
                {cells.map((d, i) => {
                    if (d === null) return <span key={`e${i}`} />;
                    const isSelected = d === 18;
                    const isPast = d < 18;
                    return (
                        <span key={d} className="flex items-center justify-center py-0.5">
                            <span
                                className={cx(
                                    "flex size-8 items-center justify-center rounded-full text-sm",
                                    isSelected && "bg-primary-solid font-semibold text-white",
                                    !isSelected && isPast && "text-quaternary",
                                    !isSelected && !isPast && "cursor-pointer text-primary hover:bg-secondary_hover",
                                )}
                            >
                                {d}
                            </span>
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

const SearchBar = ({
    players,
    onPlayers,
    holes,
    onHoles,
    ride,
    onRide,
}: {
    players: number;
    onPlayers: (n: number) => void;
    holes: HoleCount;
    onHoles: (h: HoleCount) => void;
    ride: Ride;
    onRide: (r: Ride) => void;
}) => {
    const [panel, setPanel] = useState<Panel>(null);
    const toggle = (p: Panel) => setPanel((cur) => (cur === p ? null : p));

    return (
        <div className="relative">
            <div className="flex divide-x divide-secondary overflow-visible rounded-full bg-secondary ring-1 ring-secondary">
                <SegmentField
                    label="Players"
                    value={`${players} ${players === 1 ? "Player" : "Players"}`}
                    isActive={panel === "players"}
                    onClick={() => toggle("players")}
                    className="rounded-l-full"
                />
                <SegmentField label="Date" value={SEARCH_DATE} isActive={panel === "date"} onClick={() => toggle("date")} />
                <SegmentField
                    label="Round"
                    value={`${holes} holes · ${ride === "cart" ? "Cart" : "Walking"}`}
                    isActive={panel === "round"}
                    onClick={() => toggle("round")}
                    className="rounded-r-full"
                />
            </div>

            {panel === "players" && (
                <PopoverCard className="left-0 w-64">
                    <ul className="flex flex-col">
                        {[1, 2, 3, 4].map((n) => {
                            const selected = n === players;
                            return (
                                <li key={n}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onPlayers(n);
                                            setPanel(null);
                                        }}
                                        className={cx(
                                            "w-full cursor-pointer rounded-xl px-4 py-2.5 text-center text-sm font-medium transition duration-100 ease-linear",
                                            selected ? "bg-primary-solid text-white" : "text-primary hover:bg-secondary_hover",
                                        )}
                                    >
                                        {n} {n === 1 ? "Player" : "Players"}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </PopoverCard>
            )}

            {panel === "date" && (
                <PopoverCard className="left-1/2 w-72 -translate-x-1/2">
                    <CalendarPanel />
                </PopoverCard>
            )}

            {panel === "round" && (
                <PopoverCard className="right-0 w-72">
                    <div className="flex flex-col gap-3 p-2">
                        <RowChoice
                            label="Holes"
                            options={[
                                { id: "9", label: "9 holes" },
                                { id: "18", label: "18 holes" },
                            ]}
                            value={String(holes)}
                            onChange={(id) => onHoles(Number(id) as HoleCount)}
                        />
                        <RowChoice
                            label="Getting around"
                            options={[
                                { id: "walking", label: "Walking" },
                                { id: "cart", label: "Cart" },
                            ]}
                            value={ride}
                            onChange={(id) => onRide(id as Ride)}
                        />
                    </div>
                </PopoverCard>
            )}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Tee-time card — SevenRooms elegance carrying GolfNow golf detail    */
/* ------------------------------------------------------------------ */

const spotsNote = (spots: number) => (spots === 1 ? "1 left" : `${spots} left`);

const TeeCard = ({ slot, selected, onClick }: { slot: GolfSlot; selected: boolean; onClick: () => void }) => {
    const [time, period] = slot.label.split(" ");
    const scarce = slot.spotsAvailable <= 2;
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={cx(
                "group relative flex flex-col gap-3 rounded-2xl border bg-primary p-4 text-left outline-focus-ring transition duration-100 ease-linear",
                "focus-visible:outline-2 focus-visible:outline-offset-2",
                selected ? "border-transparent shadow-md ring-2 ring-primary" : "border-secondary hover:border-primary hover:shadow-sm",
            )}
        >
            {slot.isHotDeal && (
                <span className="absolute -top-2 right-3 shadow-sm">
                    <BadgeWithIcon size="sm" type="pill-color" color="brand" iconLeading={Tag01}>
                        Hot Deal
                    </BadgeWithIcon>
                </span>
            )}

            {/* Time + price */}
            <div className="flex items-baseline justify-between gap-2">
                <span className="flex items-baseline gap-1">
                    <span className="text-xl font-semibold tabular-nums text-primary">{time}</span>
                    <span className="text-xs font-medium text-tertiary">{period}</span>
                </span>
                <span className="flex items-baseline gap-1.5">
                    {slot.wasPrice && <span className="text-xs text-quaternary line-through tabular-nums">{formatPrice(slot.wasPrice)}</span>}
                    <span
                        className={cx("text-lg font-semibold tabular-nums", slot.wasPrice ? "text-brand-secondary" : "text-primary")}
                    >
                        {formatPrice(slot.price)}
                    </span>
                </span>
            </div>

            {/* Golf detail row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-tertiary">
                <span className="flex items-center gap-1">
                    <Flag01 className="size-3.5 text-fg-quaternary" aria-hidden="true" /> {slot.holes} holes
                </span>
                <span className="flex items-center gap-1">
                    <Truck01 className="size-3.5 text-fg-quaternary" aria-hidden="true" /> {slot.cartIncluded ? "Cart incl." : "Walking"}
                </span>
                <span className="flex items-center gap-1">
                    <Users01 className="size-3.5 text-fg-quaternary" aria-hidden="true" /> 1–{slot.spotsAvailable}
                </span>
            </div>

            {/* Footer — twilight tag + scarcity + per-player note */}
            <div className="flex items-center justify-between border-t border-secondary pt-2.5">
                <span className="text-xs text-quaternary">per player · +{formatPrice(FEE)} fee</span>
                <span className="flex items-center gap-2">
                    {slot.timeOfDay === "twilight" && (
                        <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary">
                            <Sun className="size-3 text-fg-quaternary" aria-hidden="true" /> Twilight
                        </span>
                    )}
                    <span className={cx("text-xs font-semibold tabular-nums", scarce ? "text-warning-primary" : "text-tertiary")}>
                        {spotsNote(slot.spotsAvailable)}
                    </span>
                </span>
            </div>
        </button>
    );
};

/* ------------------------------------------------------------------ */
/* STORY: Booking                                                      */
/* ------------------------------------------------------------------ */

const BookingView = () => {
    const [players, setPlayers] = useState(2);
    const [holes, setHoles] = useState<HoleCount>(18);
    const [ride, setRide] = useState<Ride>("cart");
    const [selectedId, setSelectedId] = useState<string | undefined>();

    const dayType: DayType = "weekday";
    const perPlayer = rates[holes][dayType][ride];
    const sheet = useTeeSheet(players);
    const dealCount = (Object.values(sheet).flat() as GolfSlot[]).filter((s) => s.isHotDeal).length;

    return (
        <div className="min-h-screen bg-primary">
            <Wordmark />

            <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
                <Hero />
                <VenueHeading />

                {/* Search + at-a-glance facts */}
                <section className="flex flex-col gap-6">
                    <SearchBar
                        players={players}
                        onPlayers={setPlayers}
                        holes={holes}
                        onHoles={setHoles}
                        ride={ride}
                        onRide={setRide}
                    />

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-tertiary">
                        <span className="flex items-center gap-1.5">
                            <Flag01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                            {course.par} par · {course.yards.toLocaleString()} yds
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Sun className="size-4 text-fg-quaternary" aria-hidden="true" />
                            Twilight after 3 PM — {formatPrice(twilightRate[holes])}/player
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-brand-secondary">
                            <Tag01 className="size-4" aria-hidden="true" />
                            {dealCount} Hot Deals today
                        </span>
                        <span className="font-medium text-primary">{formatPrice(perPlayer)} per player</span>
                    </div>
                </section>

                <hr className="border-secondary" />

                {/* Results — elegant cards grouped by booking window */}
                <section className="flex flex-col gap-8 rounded-2xl bg-secondary/40 p-6">
                    <h2 className="text-xl font-semibold text-primary">Available tee times</h2>

                    {(Object.keys(sheet) as TimeOfDay[]).map((window) => {
                        const slots = sheet[window];
                        if (slots.length === 0) return null;
                        const windowPrice = window === "twilight" ? twilightRate[holes] : perPlayer;
                        return (
                            <div key={window} className="flex flex-col gap-3">
                                <div className="flex items-baseline gap-3 border-b border-secondary pb-2">
                                    <h3 className="text-sm font-semibold text-primary">{timeOfDayLabels[window]}</h3>
                                    <span className="text-xs text-tertiary">
                                        from {formatPrice(windowPrice)}/player · {slots.length} times
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {slots.map((slot) => (
                                        <TeeCard
                                            key={slot.id}
                                            slot={slot}
                                            selected={selectedId === slot.id}
                                            onClick={() => setSelectedId(slot.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* About + policies + conditions */}
                <section className="grid gap-8 border-t border-secondary pt-8 sm:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold text-primary">About {course.shortName}</h2>
                        <p className="text-sm leading-relaxed text-tertiary">
                            A classic New England layout established in {course.established}, Sagamore Spring plays {course.yards.toLocaleString()} yards
                            to a par of {course.par}. Rolling fairways, mature trees, and quick greens reward a thoughtful round — walkers and riders both
                            welcome.
                        </p>
                        <div className="mt-1 grid grid-cols-3 gap-2">
                            {gallery.slice(0, 3).map((img) => (
                                <img key={img.name} src={img.src} alt="" className="h-20 w-full rounded-lg object-cover" />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                            <ShieldTick className="mt-0.5 size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            <div className="flex flex-col gap-0.5">
                                <h3 className="text-sm font-semibold text-primary">Cancellation policy</h3>
                                <p className="text-sm text-tertiary">
                                    Free cancellation up to 24 hours before your tee time. No-shows are charged the green fee; weather rain checks honored.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Sun className="mt-0.5 size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            <div className="flex flex-col gap-0.5">
                                <h3 className="text-sm font-semibold text-primary">Course conditions</h3>
                                <p className="text-sm text-tertiary">Cart paths only on holes 4–6 after recent rain. Greens running at standard speed.</p>
                            </div>
                        </div>
                        <p className="flex items-center gap-1.5 text-sm text-tertiary">
                            <MarkerPin02 className="size-4 text-fg-quaternary" aria-hidden="true" />
                            {course.phone}
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export const Booking: Story = {
    render: () => <BookingView />,
};

/* ------------------------------------------------------------------ */
/* STORY: Checkout                                                     */
/* ------------------------------------------------------------------ */

const Detail = ({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) => (
    <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <div className="flex flex-col">
            <span className="text-xs tracking-wide text-tertiary uppercase">{label}</span>
            <span className="text-sm font-medium text-primary">{value}</span>
        </div>
    </div>
);

const PlayersDetail = ({ players, max, onChange }: { players: number; max: number; onChange: (n: number) => void }) => (
    <div className="flex items-start gap-2.5">
        <Users01 className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <div className="flex flex-col gap-1">
            <span className="text-xs tracking-wide text-tertiary uppercase">Players</span>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    aria-label="Remove a player"
                    disabled={players <= 1}
                    onClick={() => onChange(Math.max(1, players - 1))}
                    className="flex size-6 cursor-pointer items-center justify-center rounded-full ring-1 ring-secondary disabled:opacity-40"
                >
                    <Minus className="size-3.5 text-fg-secondary" />
                </button>
                <span className="min-w-4 text-center text-sm font-semibold tabular-nums text-primary">{players}</span>
                <button
                    type="button"
                    aria-label="Add a player"
                    disabled={players >= max}
                    onClick={() => onChange(Math.min(max, players + 1))}
                    className="flex size-6 cursor-pointer items-center justify-center rounded-full ring-1 ring-secondary disabled:opacity-40"
                >
                    <Plus className="size-3.5 text-fg-secondary" />
                </button>
            </div>
        </div>
    </div>
);

const Field = ({ label, placeholder }: { label: string; placeholder: string }) => (
    <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-secondary">{label}</span>
        <input
            type="text"
            placeholder={placeholder}
            className="rounded-lg border border-secondary bg-primary px-3.5 py-2.5 text-sm text-primary shadow-xs outline-focus-ring placeholder:text-placeholder focus-visible:outline-2 focus-visible:-outline-offset-1"
        />
    </label>
);

const CheckoutView = () => {
    // The selected slot: a Hot Deal midday round, carrying its golf detail.
    const selected = useMemo<GolfSlot>(() => {
        const all = decorate(generateTeeTimes("weekday").filter((s) => s.spotsAvailable >= 2));
        return all.find((s) => s.isHotDeal && s.timeOfDay === "midday" && s.holes === 18) ?? all[0];
    }, []);

    const [players, setPlayers] = useState(2);
    const dateLabel = "Thursday, June 18, 2026";

    const perPlayer = selected.price;
    const greenFee = perPlayer * players;
    const fee = FEE * players;
    const tax = Math.round(greenFee * 0.0625);
    const discount = selected.wasPrice ? (selected.wasPrice - selected.price) * players : 0;
    const total = greenFee + fee + tax;

    const Line = ({ label, value, muted, accent }: { label: string; value: string; muted?: boolean; accent?: boolean }) => (
        <div className="flex items-center justify-between text-sm">
            <span className={muted ? "text-tertiary" : "text-secondary"}>{label}</span>
            <span className={cx("tabular-nums", accent ? "font-medium text-brand-secondary" : muted ? "text-tertiary" : "font-medium text-primary")}>
                {value}
            </span>
        </div>
    );

    return (
        <div className="min-h-screen bg-primary">
            <Wordmark />

            <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
                <button type="button" className="flex w-max items-center gap-1.5 text-sm font-medium text-tertiary hover:text-secondary">
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Back to tee times
                </button>

                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-semibold text-primary">Confirm your round</h1>
                    <p className="text-sm text-tertiary">You're almost set — review the details and reserve your tee time.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-[1fr_320px]">
                    {/* Left — reservation detail + lead golfer */}
                    <div className="flex flex-col gap-6">
                        <section className="overflow-hidden rounded-2xl border border-secondary">
                            <div className="relative">
                                <img src={heroSrc} alt="" className="h-40 w-full object-cover" />
                                {selected.isHotDeal && (
                                    <span className="absolute top-3 left-3 shadow-sm">
                                        <BadgeWithIcon size="md" type="pill-color" color="brand" iconLeading={Tag01}>
                                            Hot Deal
                                        </BadgeWithIcon>
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-4 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex flex-col gap-0.5">
                                        <h2 className="text-lg font-semibold text-primary">{course.name}</h2>
                                        <p className="text-sm text-tertiary">{course.address}</p>
                                    </div>
                                    <span className="flex shrink-0 items-center gap-1">
                                        <Stars value={courseRating} />
                                        <span className="text-xs font-medium text-secondary tabular-nums">{courseRating.toFixed(1)}</span>
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Detail icon={Calendar} label="Date" value={dateLabel} />
                                    <Detail icon={Clock} label="Tee time" value={selected.label} />
                                    <Detail
                                        icon={Flag01}
                                        label="Round"
                                        value={`${selected.holes} holes · ${selected.cartIncluded ? "Riding cart" : "Walking"}`}
                                    />
                                    <PlayersDetail players={players} max={selected.spotsAvailable} onChange={setPlayers} />
                                </div>
                                <p className="flex items-center gap-1.5 text-xs font-semibold text-warning-primary">
                                    <Users01 className="size-3.5" aria-hidden="true" />
                                    {selected.spotsAvailable === 1 ? "Only 1 spot left" : `Only ${selected.spotsAvailable} spots left`} on this slot
                                </p>
                            </div>
                        </section>

                        <section className="flex flex-col gap-4 rounded-2xl border border-secondary p-5">
                            <h3 className="text-sm font-semibold text-primary">Lead golfer</h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Field label="First name" placeholder="Olivia" />
                                <Field label="Last name" placeholder="Rhye" />
                                <Field label="Email" placeholder="olivia@sagamorespring.com" />
                                <Field label="Mobile" placeholder="(781) 555-0142" />
                            </div>
                        </section>
                    </div>

                    {/* Right — order summary */}
                    <aside className="flex h-max flex-col gap-4 rounded-2xl border border-secondary bg-secondary/30 p-5">
                        <h3 className="text-md font-semibold text-primary">Order summary</h3>
                        <div className="flex flex-col gap-2.5">
                            <Line label={`Green fee × ${players}`} value={formatPrice(greenFee)} />
                            <Line label={selected.cartIncluded ? "Riding cart" : "Walking"} value={selected.cartIncluded ? "Included" : "—"} muted />
                            {discount > 0 && <Line label="Hot Deal discount" value={`-${formatPrice(discount)}`} accent />}
                            <Line label="Convenience fee" value={formatPrice(fee)} muted />
                            <Line label="Estimated tax" value={formatPrice(tax)} muted />
                        </div>
                        <hr className="border-secondary" />
                        <div className="flex items-center justify-between">
                            <span className="text-md font-semibold text-primary">Total</span>
                            <span className="text-md font-semibold tabular-nums text-primary">{formatPrice(total)}</span>
                        </div>
                        <button
                            type="button"
                            className="w-full cursor-pointer rounded-full bg-brand-solid px-5 py-3 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-brand-solid_hover"
                        >
                            Reserve tee time
                        </button>
                        <p className="text-center text-xs leading-relaxed text-tertiary">
                            Free cancellation up to 24 hours before. By reserving you agree to Sagamore Spring's booking terms.
                        </p>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export const Checkout: Story = {
    render: () => <CheckoutView />,
};
