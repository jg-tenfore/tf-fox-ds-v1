import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar, ChevronLeft, ChevronRight, Clock, Flag01, MarkerPin02, Minus, Plus, ShieldTick, Sun } from "@untitledui/icons";
import {
    course,
    formatPrice,
    generateTeeTimes,
    groupTeeTimes,
    rates,
    timeOfDayLabels,
    twilightRate,
    type DayType,
    type HoleCount,
    type Ride,
    type TeeTime,
    type TimeOfDay,
} from "@/components/booking/sagamore-data";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";
import { cx } from "@/utils/cx";

/**
 * Explorations/SevenRooms — a faithful recreation of SevenRooms' editorial
 * restaurant-reservation flow (The Zebra Room), re-skinned for Sagamore Spring
 * Golf Club. Restaurant concepts map to golf: party size → players (1–4),
 * tables → tee times, seating areas → 9/18 holes & walking/cart, dining
 * experiences → morning/twilight rounds. Refined neutral palette, large hero
 * imagery, generous whitespace, and solid time-slot pill buttons.
 */

const photos = sagamoreImagesByCategory("photography");
const heroSrc = photos[0]?.src ?? "";
const gallery = photos.slice(1, 6);

const meta = {
    title: "Explorations/SevenRooms",
    tags: ["!dev"],
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

const Wordmark = () => (
    <header className="flex items-center justify-center border-b border-secondary py-5">
        <div className="flex flex-col items-center gap-0.5">
            <span className="text-[11px] font-semibold tracking-[0.45em] text-tertiary uppercase">Sagamore Spring</span>
            <span className="text-lg font-semibold tracking-[0.25em] text-primary uppercase">Golf Club</span>
        </div>
    </header>
);

const Hero = () => (
    <div className="overflow-hidden rounded-2xl">
        <img src={heroSrc} alt="Sagamore Spring Golf Club fairway" className="h-64 w-full object-cover sm:h-80" />
    </div>
);

const VenueHeading = () => (
    <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-primary">{course.name}</h1>
        <p className="flex items-center gap-1.5 text-sm text-tertiary">
            <MarkerPin02 className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
            {course.address}
        </p>
    </div>
);

/* ------------------------------------------------------------------ */
/* Search bar — the pill-shaped Players / Date / Time segments         */
/* ------------------------------------------------------------------ */

const SEARCH_DATE = "Jun 18";

interface SearchBarProps {
    players: number;
    onPlayers: (n: number) => void;
    holes: HoleCount;
    onHoles: (h: HoleCount) => void;
    ride: Ride;
    onRide: (r: Ride) => void;
}

type Panel = "players" | "date" | "time" | null;

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
        <span className="text-[11px] tracking-wide text-tertiary uppercase">{label}</span>
        <span className="text-sm font-medium text-primary">{value}</span>
    </button>
);

const PopoverCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div
        className={cx(
            "absolute top-[calc(100%+8px)] z-20 rounded-2xl border border-secondary_alt bg-primary p-2 shadow-xl",
            className,
        )}
    >
        {children}
    </div>
);

const SearchBar = ({ players, onPlayers, holes, onHoles, ride, onRide }: SearchBarProps) => {
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
                    isActive={panel === "time"}
                    onClick={() => toggle("time")}
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

            {panel === "time" && (
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
        <span className="px-1 text-[11px] tracking-wide text-tertiary uppercase">{label}</span>
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

/** A static two-month calendar matching the SevenRooms date popover. */
const CalendarPanel = () => {
    const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
    // June 2026 starts on a Monday; the 18th is the selected day.
    const lead = 1;
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
                    <span key={i} className="text-[11px] font-medium text-quaternary">
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

/* ------------------------------------------------------------------ */
/* Time-slot pill — the solid SevenRooms result button                 */
/* ------------------------------------------------------------------ */

const spotsNote = (spots: number) => (spots === 1 ? "1 spot left" : `${spots} spots`);

const SlotPill = ({
    teeTime,
    holesLabel,
    selected,
    onClick,
}: {
    teeTime: TeeTime;
    holesLabel: string;
    selected?: boolean;
    onClick?: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={cx(
            "flex min-w-28 cursor-pointer flex-col items-center gap-0.5 rounded-md bg-primary-solid px-4 py-2.5 text-center text-white outline-focus-ring transition duration-100 ease-linear",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            selected ? "ring-2 ring-white ring-offset-2 ring-offset-primary" : "hover:opacity-90",
        )}
    >
        <span className="text-sm font-semibold tabular-nums">{teeTime.label}</span>
        <span className="text-[11px] text-white/75">{holesLabel}</span>
    </button>
);

/* ------------------------------------------------------------------ */
/* Reservation story                                                   */
/* ------------------------------------------------------------------ */

const ReservationView = () => {
    const [players, setPlayers] = useState(2);
    const [holes, setHoles] = useState<HoleCount>(18);
    const [ride, setRide] = useState<Ride>("cart");
    const [selectedId, setSelectedId] = useState<string | undefined>();

    const dayType: DayType = "weekday";
    const perPlayer = rates[holes][dayType][ride];

    // The four featured pills under the search bar (the SevenRooms "quick picks").
    const featured = useMemo(() => {
        const all = generateTeeTimes(dayType).filter((t) => t.spotsAvailable >= players);
        const morning = all.filter((t) => t.timeOfDay === "morning");
        return [morning[2], morning[6], morning[10], morning[14]].filter(Boolean) as TeeTime[];
    }, [players]);

    const grouped = useMemo(() => groupTeeTimes(dayType), []);
    const holesLabel = `${holes} holes`;

    return (
        <div className="min-h-screen bg-primary">
            <Wordmark />

            <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
                <Hero />
                <VenueHeading />

                {/* Search + featured pills */}
                <section className="flex flex-col gap-6">
                    <SearchBar
                        players={players}
                        onPlayers={setPlayers}
                        holes={holes}
                        onHoles={setHoles}
                        ride={ride}
                        onRide={setRide}
                    />

                    <div className="flex flex-wrap gap-3">
                        {featured.map((t) => (
                            <SlotPill
                                key={t.id}
                                teeTime={t}
                                holesLabel={holesLabel}
                                selected={selectedId === t.id}
                                onClick={() => setSelectedId(t.id)}
                            />
                        ))}
                        <button
                            type="button"
                            className="rounded-md px-4 py-2.5 text-sm font-medium text-secondary ring-1 ring-secondary ring-inset transition duration-100 ease-linear hover:bg-secondary_hover"
                        >
                            Join the waitlist
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-tertiary">
                        <span className="flex items-center gap-1.5">
                            <Flag01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                            {course.par} par · {course.yards.toLocaleString()} yds
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Sun className="size-4 text-fg-quaternary" aria-hidden="true" />
                            Twilight after 3 PM — {formatPrice(twilightRate[holes])}/player
                        </span>
                        <span className="font-medium text-primary">{formatPrice(perPlayer)} per player</span>
                    </div>
                </section>

                <hr className="border-secondary" />

                {/* Full results grouped by booking window */}
                <section className="flex flex-col gap-8 rounded-2xl bg-secondary p-6">
                    <h2 className="text-xl font-semibold text-primary">Available tee times</h2>

                    {(Object.keys(grouped) as TimeOfDay[]).map((window) => {
                        const slots = grouped[window].filter((t) => t.spotsAvailable >= players);
                        if (slots.length === 0) return null;
                        return (
                            <div key={window} className="flex flex-col gap-3">
                                <div className="flex items-baseline gap-3 border-b border-secondary pb-2">
                                    <h3 className="text-sm font-semibold text-primary">{timeOfDayLabels[window]}</h3>
                                    <span className="text-xs text-tertiary">
                                        {window === "twilight" ? `${formatPrice(twilightRate[holes])}/player` : `${formatPrice(perPlayer)}/player`}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {slots.map((t) => {
                                        const isSelected = selectedId === t.id;
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                aria-pressed={isSelected}
                                                onClick={() => setSelectedId(t.id)}
                                                className={cx(
                                                    "flex min-w-24 cursor-pointer flex-col items-center gap-0.5 rounded-lg border px-3 py-2 text-center outline-focus-ring transition duration-100 ease-linear",
                                                    "focus-visible:outline-2 focus-visible:outline-offset-2",
                                                    isSelected ? "border-transparent bg-primary-solid text-white" : "border-secondary bg-primary text-primary hover:border-primary",
                                                )}
                                            >
                                                <span className="text-sm font-semibold tabular-nums">{t.label}</span>
                                                <span className={cx("text-[11px]", isSelected ? "text-white/75" : "text-tertiary")}>{spotsNote(t.spotsAvailable)}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* About + policies */}
                <section className="grid gap-8 border-t border-secondary pt-8 sm:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold text-primary">About {course.shortName}</h2>
                        <p className="text-sm leading-relaxed text-tertiary">
                            A classic New England layout established in {course.established}, Sagamore Spring plays {course.yards.toLocaleString()} yards
                            to a par of {course.par}. Rolling fairways, mature trees, and quick greens reward a thoughtful round — walkers and riders
                            both welcome.
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
                                <p className="text-sm text-tertiary">Free cancellation up to 24 hours before your tee time. No-shows are charged the green fee.</p>
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

export const Reservation: Story = {
    render: () => <ReservationView />,
};

/* ------------------------------------------------------------------ */
/* Confirm story — the checkout step                                   */
/* ------------------------------------------------------------------ */

const ConfirmView = () => {
    const [players, setPlayers] = useState(2);
    const dayType: DayType = "weekday";
    const holes: HoleCount = 18;
    const ride: Ride = "cart";
    const time = "7:30 AM";
    const dateLabel = "Thursday, June 18, 2026";

    const perPlayer = rates[holes][dayType][ride];
    const subtotal = perPlayer * players;
    const cartFee = ride === "cart" ? 0 : 0; // cart already included in cart rate
    const tax = Math.round(subtotal * 0.0625);
    const total = subtotal + cartFee + tax;

    const Line = ({ label, value, muted }: { label: string; value: string; muted?: boolean }) => (
        <div className="flex items-center justify-between text-sm">
            <span className={muted ? "text-tertiary" : "text-secondary"}>{label}</span>
            <span className={cx("tabular-nums", muted ? "text-tertiary" : "text-primary")}>{value}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-primary">
            <Wordmark />

            <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
                <button
                    type="button"
                    className="flex w-max items-center gap-1.5 text-sm font-medium text-tertiary hover:text-secondary"
                >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Back to tee times
                </button>

                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-semibold text-primary">Confirm your round</h1>
                    <p className="text-sm text-tertiary">You're almost set — review the details and reserve your tee time.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-[1fr_320px]">
                    {/* Left — reservation detail + golfer info */}
                    <div className="flex flex-col gap-6">
                        <section className="overflow-hidden rounded-2xl border border-secondary">
                            <img src={heroSrc} alt="" className="h-40 w-full object-cover" />
                            <div className="flex flex-col gap-4 p-5">
                                <div className="flex flex-col gap-0.5">
                                    <h2 className="text-lg font-semibold text-primary">{course.name}</h2>
                                    <p className="text-sm text-tertiary">{course.address}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Detail icon={Calendar} label="Date" value={dateLabel} />
                                    <Detail icon={Clock} label="Tee time" value={time} />
                                    <Detail icon={Flag01} label="Round" value={`${holes} holes · Riding cart`} />
                                    <PlayersDetail players={players} onChange={setPlayers} />
                                </div>
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

                    {/* Right — price summary */}
                    <aside className="flex h-max flex-col gap-4 rounded-2xl border border-secondary bg-secondary p-5">
                        <h3 className="text-md font-semibold text-primary">Order summary</h3>
                        <div className="flex flex-col gap-2.5">
                            <Line label={`Green fee × ${players}`} value={formatPrice(subtotal)} />
                            <Line label="Riding cart" value="Included" muted />
                            <Line label="Estimated tax" value={formatPrice(tax)} muted />
                        </div>
                        <hr className="border-secondary" />
                        <div className="flex items-center justify-between">
                            <span className="text-md font-semibold text-primary">Total</span>
                            <span className="text-md font-semibold tabular-nums text-primary">{formatPrice(total)}</span>
                        </div>
                        <button
                            type="button"
                            className="w-full cursor-pointer rounded-full bg-primary-solid px-5 py-3 text-sm font-semibold text-white transition duration-100 ease-linear hover:opacity-90"
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

const Detail = ({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Calendar;
    label: string;
    value: string;
}) => (
    <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <div className="flex flex-col">
            <span className="text-[11px] tracking-wide text-tertiary uppercase">{label}</span>
            <span className="text-sm font-medium text-primary">{value}</span>
        </div>
    </div>
);

const PlayersDetail = ({ players, onChange }: { players: number; onChange: (n: number) => void }) => (
    <div className="flex items-start gap-2.5">
        <Flag01 className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <div className="flex flex-col gap-1">
            <span className="text-[11px] tracking-wide text-tertiary uppercase">Players</span>
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
                    disabled={players >= 4}
                    onClick={() => onChange(Math.min(4, players + 1))}
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

export const Confirm: Story = {
    render: () => <ConfirmView />,
};
