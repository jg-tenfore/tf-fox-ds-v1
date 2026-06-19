import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Flag01,
    FilterLines,
    MarkerPin01,
    ShieldTick,
    Star01,
    Sun,
    Users01,
} from "@untitledui/icons";
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
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";
import { cx } from "@/utils/cx";

/**
 * Explorations/Google + SevenRooms — fuses Google Flights' top-bar
 * search/filter pattern (inline text dropdowns, large rounded fields, filter
 * pills, and Best/Cheapest segmented tabs) with the centered, editorial
 * SevenRooms results experience, for Sagamore Spring tee-time booking. The top
 * bar drives the same useState that powers the centered card results below.
 */

const photos = sagamoreImagesByCategory("photography");
const heroSrc = photos[0]?.src ?? "";
const gallery = photos.slice(1, 4);

const meta = {
    title: "Explorations/Google + SevenRooms",
    tags: ["!dev"],
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const DAY_TYPE: DayType = "weekday";
const DATE_LABEL = "Sat, Jun 21";

/* ------------------------------------------------------------------ */
/* Header chrome                                                       */
/* ------------------------------------------------------------------ */

const TopChrome = () => (
    <header className="flex items-center justify-between border-b border-secondary px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
            <SagamoreLogo className="h-8 w-auto" alt={course.name} />
            <div className="hidden flex-col leading-tight sm:flex">
                <span className="text-sm font-semibold text-primary">{course.shortName}</span>
                <span className="text-xs text-tertiary">Tee-time booking</span>
            </div>
        </div>
        <span className="flex items-center gap-1.5 text-sm text-tertiary">
            <MarkerPin01 className="size-4 text-fg-quaternary" aria-hidden="true" />
            {course.city}
        </span>
    </header>
);

/* ------------------------------------------------------------------ */
/* Row 1 — inline text dropdowns (Google Flights style)                */
/* ------------------------------------------------------------------ */

const PopoverCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div
        className={cx(
            "absolute top-[calc(100%+8px)] z-30 rounded-2xl border border-secondary_alt bg-primary p-2 shadow-xl",
            className,
        )}
    >
        {children}
    </div>
);

const ChoiceList = ({
    options,
    value,
    onChange,
    onClose,
}: {
    options: { id: string; label: string }[];
    value: string;
    onChange: (id: string) => void;
    onClose: () => void;
}) => (
    <ul className="flex w-44 flex-col">
        {options.map((opt) => {
            const selected = opt.id === value;
            return (
                <li key={opt.id}>
                    <button
                        type="button"
                        onClick={() => {
                            onChange(opt.id);
                            onClose();
                        }}
                        className={cx(
                            "w-full cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm font-medium transition duration-100 ease-linear",
                            selected ? "bg-brand-solid text-white" : "text-primary hover:bg-secondary_hover",
                        )}
                    >
                        {opt.label}
                    </button>
                </li>
            );
        })}
    </ul>
);

type InlinePanel = "holes" | "players" | "ride" | null;

const InlineDropdown = ({
    icon: Icon,
    label,
    isOpen,
    onToggle,
    children,
}: {
    icon: typeof Flag01;
    label: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) => (
    <div className="relative">
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className={cx(
                "flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2",
                isOpen ? "bg-secondary_hover text-primary" : "text-secondary hover:bg-secondary_hover",
            )}
        >
            <Icon className="size-4 text-fg-quaternary" aria-hidden="true" />
            {label}
            <ChevronDown className={cx("size-4 text-fg-quaternary transition duration-100 ease-linear", isOpen && "rotate-180")} aria-hidden="true" />
        </button>
        {isOpen && <PopoverCard className="left-0">{children}</PopoverCard>}
    </div>
);

const InlineControls = ({
    holes,
    onHoles,
    players,
    onPlayers,
    ride,
    onRide,
}: {
    holes: HoleCount;
    onHoles: (h: HoleCount) => void;
    players: number;
    onPlayers: (n: number) => void;
    ride: Ride;
    onRide: (r: Ride) => void;
}) => {
    const [panel, setPanel] = useState<InlinePanel>(null);
    const toggle = (p: InlinePanel) => setPanel((cur) => (cur === p ? null : p));
    const close = () => setPanel(null);

    return (
        <div className="flex flex-wrap items-center gap-1">
            <InlineDropdown icon={Flag01} label={`${holes} holes`} isOpen={panel === "holes"} onToggle={() => toggle("holes")}>
                <ChoiceList
                    options={[
                        { id: "18", label: "18 holes" },
                        { id: "9", label: "9 holes" },
                    ]}
                    value={String(holes)}
                    onChange={(id) => onHoles(Number(id) as HoleCount)}
                    onClose={close}
                />
            </InlineDropdown>

            <span className="text-quaternary" aria-hidden="true">
                ·
            </span>

            <InlineDropdown
                icon={Users01}
                label={`${players} ${players === 1 ? "player" : "players"}`}
                isOpen={panel === "players"}
                onToggle={() => toggle("players")}
            >
                <ChoiceList
                    options={[1, 2, 3, 4].map((n) => ({ id: String(n), label: `${n} ${n === 1 ? "player" : "players"}` }))}
                    value={String(players)}
                    onChange={(id) => onPlayers(Number(id))}
                    onClose={close}
                />
            </InlineDropdown>

            <span className="text-quaternary" aria-hidden="true">
                ·
            </span>

            <InlineDropdown
                icon={Sun}
                label={ride === "cart" ? "Cart" : "Walking"}
                isOpen={panel === "ride"}
                onToggle={() => toggle("ride")}
            >
                <ChoiceList
                    options={[
                        { id: "cart", label: "Riding cart" },
                        { id: "walking", label: "Walking" },
                    ]}
                    value={ride}
                    onChange={(id) => onRide(id as Ride)}
                    onClose={close}
                />
            </InlineDropdown>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Row 2 — large rounded outlined fields (course + date)               */
/* ------------------------------------------------------------------ */

const BigField = ({
    icon: Icon,
    label,
    value,
    trailing,
}: {
    icon: typeof MarkerPin01;
    label: string;
    value: string;
    trailing?: React.ReactNode;
}) => (
    <div className="flex flex-1 items-center gap-3 rounded-xl bg-primary px-4 py-3 ring-1 ring-secondary">
        <Icon className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[11px] tracking-wide text-tertiary uppercase">{label}</span>
            <span className="truncate text-sm font-medium text-primary">{value}</span>
        </div>
        {trailing}
    </div>
);

const SearchFields = () => (
    <div className="flex flex-col gap-3 sm:flex-row">
        <BigField icon={MarkerPin01} label="Course" value={course.shortName} />
        <BigField
            icon={Calendar}
            label="Date"
            value={DATE_LABEL}
            trailing={
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="Previous day"
                        className="flex size-8 cursor-pointer items-center justify-center rounded-full text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-secondary_hover focus-visible:outline-2"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <button
                        type="button"
                        aria-label="Next day"
                        className="flex size-8 cursor-pointer items-center justify-center rounded-full text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-secondary_hover focus-visible:outline-2"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            }
        />
    </div>
);

/* ------------------------------------------------------------------ */
/* Row 3 — filter pills                                                 */
/* ------------------------------------------------------------------ */

const FilterPill = ({
    label,
    active,
    onClick,
}: {
    label: string;
    active?: boolean;
    onClick?: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cx(
            "flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-sm font-medium outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2",
            active
                ? "bg-brand-primary text-brand-secondary ring-1 ring-brand"
                : "bg-primary text-secondary ring-1 ring-secondary hover:bg-secondary_hover",
        )}
    >
        {label}
        <ChevronDown className={cx("size-4", active ? "text-brand-secondary" : "text-fg-quaternary")} aria-hidden="true" />
    </button>
);

type FilterKey = "timeOfDay" | "price" | "holes" | "ride" | "rating" | "availability";

const FilterPills = ({ active, onToggle }: { active: FilterKey | null; onToggle: (k: FilterKey) => void }) => (
    <div className="flex flex-wrap items-center gap-2">
        <button
            type="button"
            className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-1 text-sm font-medium text-brand-secondary outline-focus-ring transition duration-100 ease-linear hover:text-brand-secondary_hover focus-visible:outline-2"
        >
            <FilterLines className="size-4" aria-hidden="true" />
            All filters
        </button>
        <FilterPill label="Time of day" active={active === "timeOfDay"} onClick={() => onToggle("timeOfDay")} />
        <FilterPill label="Price" active={active === "price"} onClick={() => onToggle("price")} />
        <FilterPill label="Holes" active={active === "holes"} onClick={() => onToggle("holes")} />
        <FilterPill label="Cart" active={active === "ride"} onClick={() => onToggle("ride")} />
        <FilterPill label="Rating" active={active === "rating"} onClick={() => onToggle("rating")} />
        <FilterPill label="Availability" active={active === "availability"} onClick={() => onToggle("availability")} />
    </div>
);

/* ------------------------------------------------------------------ */
/* Row 4 — segmented Best / Earliest / Cheapest tabs                   */
/* ------------------------------------------------------------------ */

type SortKey = "best" | "earliest" | "cheapest";

const SortTabs = ({ value, onChange, cheapest }: { value: SortKey; onChange: (s: SortKey) => void; cheapest: number }) => {
    const tabs: { id: SortKey; label: string }[] = [
        { id: "best", label: "Best" },
        { id: "earliest", label: "Earliest" },
        { id: "cheapest", label: `Cheapest from ${formatPrice(cheapest)}` },
    ];
    return (
        <div className="flex gap-6 border-b border-secondary">
            {tabs.map((tab) => {
                const isActive = tab.id === value;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id)}
                        className={cx(
                            "-mb-px cursor-pointer border-b-2 px-1 py-3 text-sm font-semibold outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2",
                            isActive ? "border-brand text-brand-secondary" : "border-transparent text-tertiary hover:text-secondary",
                        )}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Top bar wrapper                                                     */
/* ------------------------------------------------------------------ */

const TopBar = (props: {
    holes: HoleCount;
    onHoles: (h: HoleCount) => void;
    players: number;
    onPlayers: (n: number) => void;
    ride: Ride;
    onRide: (r: Ride) => void;
    filter: FilterKey | null;
    onFilter: (k: FilterKey) => void;
    sort: SortKey;
    onSort: (s: SortKey) => void;
    cheapest: number;
}) => (
    <div className="sticky top-0 z-20 border-b border-secondary bg-primary">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-4 sm:px-6">
            <InlineControls
                holes={props.holes}
                onHoles={props.onHoles}
                players={props.players}
                onPlayers={props.onPlayers}
                ride={props.ride}
                onRide={props.onRide}
            />
            <SearchFields />
            <FilterPills active={props.filter} onToggle={props.onFilter} />
            <SortTabs value={props.sort} onChange={props.onSort} cheapest={props.cheapest} />
        </div>
    </div>
);

/* ------------------------------------------------------------------ */
/* Result card — centered SevenRooms experience                        */
/* ------------------------------------------------------------------ */

const StarRating = ({ value }: { value: number }) => (
    <span className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
            <Star01
                key={i}
                className={cx("size-3.5 fill-current", i < Math.round(value) ? "text-warning-primary" : "text-quaternary")}
                aria-hidden="true"
            />
        ))}
    </span>
);

const spotsNote = (spots: number) => (spots === 1 ? "1 spot left" : `${spots} spots left`);

interface SlotMeta {
    holes: HoleCount;
    ride: Ride;
    rating: number;
    price: number;
}

const slotMeta = (teeTime: TeeTime, baseHoles: HoleCount, baseRide: Ride, basePrice: number, i: number): SlotMeta => {
    const isTwilight = teeTime.timeOfDay === "twilight";
    const holes: HoleCount = i % 5 === 2 ? 9 : baseHoles;
    const ride: Ride = isTwilight || i % 3 === 0 ? "cart" : baseRide;
    const rating = 4 + ((i % 3) + (isTwilight ? 1 : 0)) * 0.3;
    const price = isTwilight ? twilightRate[holes] : holes === 9 ? Math.round(basePrice * 0.6) : basePrice;
    return { holes, ride, rating: Math.min(5, rating), price };
};

const ResultCard = ({
    teeTime,
    meta: slot,
    players,
    selected,
    onSelect,
}: {
    teeTime: TeeTime;
    meta: SlotMeta;
    players: number;
    selected: boolean;
    onSelect: () => void;
}) => {
    const isTwilight = teeTime.timeOfDay === "twilight";
    const scarce = teeTime.spotsAvailable <= 2;

    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={cx(
                "flex w-full cursor-pointer items-center gap-4 rounded-2xl bg-primary p-4 text-left outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2",
                selected ? "ring-2 ring-brand" : "ring-1 ring-secondary hover:ring-primary",
            )}
        >
            {/* Time */}
            <div className="flex w-20 shrink-0 flex-col">
                <span className="text-lg font-semibold tabular-nums text-primary">{teeTime.label}</span>
                <span className={cx("text-xs", scarce ? "font-medium text-error-primary" : "text-tertiary")}>
                    {spotsNote(teeTime.spotsAvailable)}
                </span>
            </div>

            {/* Detail */}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary">
                        <Flag01 className="size-3 text-fg-quaternary" aria-hidden="true" /> {slot.holes} holes
                    </span>
                    <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary">
                        {slot.ride === "cart" ? "Cart" : "Walking"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary">
                        <Users01 className="size-3 text-fg-quaternary" aria-hidden="true" /> Up to {teeTime.spotsAvailable}
                    </span>
                    {isTwilight && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-warning-secondary px-1.5 py-0.5 text-xs font-medium text-warning-primary">
                            <Sun className="size-3" aria-hidden="true" /> Twilight
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <StarRating value={slot.rating} />
                    <span className="text-xs text-tertiary tabular-nums">{slot.rating.toFixed(1)}</span>
                </div>
            </div>

            {/* Price */}
            <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-lg font-semibold tabular-nums text-primary">{formatPrice(slot.price)}</span>
                <span className="text-xs text-tertiary">/player</span>
                {players > 1 && (
                    <span className="text-xs text-quaternary tabular-nums">{formatPrice(slot.price * players)} total</span>
                )}
            </div>
        </button>
    );
};

/* ------------------------------------------------------------------ */
/* Booking story                                                       */
/* ------------------------------------------------------------------ */

const BookingView = () => {
    const [holes, setHoles] = useState<HoleCount>(18);
    const [players, setPlayers] = useState(4);
    const [ride, setRide] = useState<Ride>("cart");
    const [filter, setFilter] = useState<FilterKey | null>(null);
    const [sort, setSort] = useState<SortKey>("best");
    const [selectedId, setSelectedId] = useState<string | undefined>();

    const basePrice = rates[holes][DAY_TYPE][ride];

    // Build meta-enriched slots, filtered to the party size.
    const enriched = useMemo(() => {
        const all = generateTeeTimes(DAY_TYPE).filter((t) => t.spotsAvailable >= players);
        return all.map((t, i) => ({ teeTime: t, meta: slotMeta(t, holes, ride, basePrice, i) }));
    }, [players, holes, ride, basePrice]);

    const cheapest = useMemo(() => enriched.reduce((min, e) => Math.min(min, e.meta.price), Number.POSITIVE_INFINITY), [enriched]);

    // Sort drives ordering across the whole set; then re-group into windows.
    const sorted = useMemo(() => {
        const copy = [...enriched];
        if (sort === "cheapest") copy.sort((a, b) => a.meta.price - b.meta.price || a.teeTime.minutes - b.teeTime.minutes);
        else if (sort === "earliest") copy.sort((a, b) => a.teeTime.minutes - b.teeTime.minutes);
        else copy.sort((a, b) => b.meta.rating - a.meta.rating || a.teeTime.minutes - b.teeTime.minutes);
        return copy;
    }, [enriched, sort]);

    const grouped = useMemo(() => {
        const groups: Record<TimeOfDay, typeof sorted> = { morning: [], midday: [], twilight: [] };
        for (const e of sorted) groups[e.teeTime.timeOfDay].push(e);
        return groups;
    }, [sorted]);

    const windowOrder: TimeOfDay[] = ["morning", "midday", "twilight"];

    return (
        <div className="min-h-screen bg-secondary/40">
            <TopChrome />
            <TopBar
                holes={holes}
                onHoles={setHoles}
                players={players}
                onPlayers={setPlayers}
                ride={ride}
                onRide={setRide}
                filter={filter}
                onFilter={(k) => setFilter((cur) => (cur === k ? null : k))}
                sort={sort}
                onSort={setSort}
                cheapest={Number.isFinite(cheapest) ? cheapest : basePrice}
            />

            <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
                {/* Hero */}
                <div className="overflow-hidden rounded-2xl ring-1 ring-secondary">
                    <img src={heroSrc} alt={`${course.name} fairway`} className="h-56 w-full object-cover sm:h-64" />
                </div>

                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-semibold text-primary">{course.name}</h1>
                    <p className="flex items-center gap-1.5 text-sm text-tertiary">
                        <MarkerPin01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                        {course.address}
                    </p>
                    <p className="text-sm text-tertiary">
                        {DATE_LABEL} · {players} {players === 1 ? "player" : "players"} · {formatPrice(basePrice)}/player
                    </p>
                </div>

                {/* Results, grouped by window */}
                {windowOrder.map((window) => {
                    const slots = grouped[window];
                    if (slots.length === 0) return null;
                    const windowPrice = window === "twilight" ? twilightRate[holes] : basePrice;
                    return (
                        <section key={window} className="flex flex-col gap-3">
                            <div className="flex items-baseline justify-between border-b border-secondary pb-2">
                                <h2 className="text-sm font-semibold text-primary">{timeOfDayLabels[window]}</h2>
                                <span className="flex items-center gap-1.5 text-xs text-tertiary">
                                    {window === "twilight" && <Sun className="size-3.5 text-fg-quaternary" aria-hidden="true" />}
                                    from {formatPrice(windowPrice)}/player
                                </span>
                            </div>
                            <div className="flex flex-col gap-2.5">
                                {slots.map((e) => (
                                    <ResultCard
                                        key={e.teeTime.id}
                                        teeTime={e.teeTime}
                                        meta={e.meta}
                                        players={players}
                                        selected={selectedId === e.teeTime.id}
                                        onSelect={() => setSelectedId(e.teeTime.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}

                {/* About + policies */}
                <section className="grid gap-8 border-t border-secondary pt-8 sm:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold text-primary">About {course.shortName}</h2>
                        <p className="text-sm leading-relaxed text-tertiary">
                            A classic New England layout established in {course.established}, Sagamore Spring plays{" "}
                            {course.yards.toLocaleString()} yards to a par of {course.par}. Rolling fairways, mature trees, and quick
                            greens reward a thoughtful round — walkers and riders both welcome.
                        </p>
                        <div className="mt-1 grid grid-cols-3 gap-2">
                            {gallery.map((img) => (
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
                                    Free cancellation up to 24 hours before your tee time. No-shows are charged the green fee.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="mt-0.5 size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            <div className="flex flex-col gap-0.5">
                                <h3 className="text-sm font-semibold text-primary">Hours</h3>
                                <p className="text-sm text-tertiary">First tee 6:40 AM, last tee 6:00 PM. Twilight rates after 3 PM.</p>
                            </div>
                        </div>
                        <p className="flex items-center gap-1.5 text-sm text-tertiary">
                            <MarkerPin01 className="size-4 text-fg-quaternary" aria-hidden="true" />
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
/* Checkout story — centered order summary                             */
/* ------------------------------------------------------------------ */

const Line = ({ label, value, muted }: { label: string; value: string; muted?: boolean }) => (
    <div className="flex items-center justify-between text-sm">
        <span className={muted ? "text-tertiary" : "text-secondary"}>{label}</span>
        <span className={cx("tabular-nums", muted ? "text-tertiary" : "text-primary")}>{value}</span>
    </div>
);

const Detail = ({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) => (
    <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <div className="flex flex-col">
            <span className="text-[11px] tracking-wide text-tertiary uppercase">{label}</span>
            <span className="text-sm font-medium text-primary">{value}</span>
        </div>
    </div>
);

const CheckoutView = () => {
    const players = 4;
    const holes: HoleCount = 18;
    const ride: Ride = "cart";
    const time = "7:10 AM";

    const perPlayer = rates[holes][DAY_TYPE][ride];
    const subtotal = perPlayer * players;
    const tax = Math.round(subtotal * 0.0625);
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-secondary/40">
            <TopChrome />

            <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10 sm:px-6">
                <button
                    type="button"
                    className="flex w-max cursor-pointer items-center gap-1.5 text-sm font-medium text-tertiary transition duration-100 ease-linear hover:text-secondary"
                >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Back to tee times
                </button>

                <div className="flex flex-col gap-1 text-center">
                    <h1 className="text-2xl font-semibold text-primary">Confirm your round</h1>
                    <p className="text-sm text-tertiary">Review the details and reserve your tee time.</p>
                </div>

                <section className="overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary">
                    <img src={heroSrc} alt="" className="h-36 w-full object-cover" />
                    <div className="flex flex-col gap-4 p-5">
                        <div className="flex flex-col gap-0.5">
                            <h2 className="text-base font-semibold text-primary">{course.name}</h2>
                            <p className="text-sm text-tertiary">{course.address}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Detail icon={Calendar} label="Date" value={DATE_LABEL} />
                            <Detail icon={Clock} label="Tee time" value={time} />
                            <Detail icon={Flag01} label="Round" value={`${holes} holes · Cart`} />
                            <Detail icon={Users01} label="Players" value={String(players)} />
                        </div>
                    </div>
                </section>

                <aside className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary">
                    <h3 className="text-sm font-semibold text-primary">Order summary</h3>
                    <div className="flex flex-col gap-2.5">
                        <Line label={`Green fee × ${players}`} value={formatPrice(subtotal)} />
                        <Line label="Riding cart" value="Included" muted />
                        <Line label="Estimated tax" value={formatPrice(tax)} muted />
                    </div>
                    <hr className="border-secondary" />
                    <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-primary">Total</span>
                        <span className="text-base font-semibold tabular-nums text-primary">{formatPrice(total)}</span>
                    </div>
                    <button
                        type="button"
                        className="w-full cursor-pointer rounded-full bg-brand-solid px-5 py-3 text-sm font-semibold text-white outline-focus-ring transition duration-100 ease-linear hover:bg-brand-solid_hover focus-visible:outline-2"
                    >
                        Reserve tee time
                    </button>
                    <p className="text-center text-xs leading-relaxed text-tertiary">
                        Free cancellation up to 24 hours before. By reserving you agree to Sagamore Spring's booking terms.
                    </p>
                </aside>
            </main>
        </div>
    );
};

export const Checkout: Story = {
    render: () => <CheckoutView />,
};
