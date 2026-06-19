import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { type FC, useEffect, useRef, useState } from "react";
import { BellRinging01, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, CurrencyDollar, FilterLines, Flag06, InfoCircle, MarkerPin02, Minus, Plus, Star01, Users01, XClose, Zap } from "@untitledui/icons";
import { Button as AriaButton, type Selection } from "react-aria-components";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Slider } from "@/components/base/slider/slider";
import { Toggle } from "@/components/base/toggle/toggle";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { course, formatPrice, generateTeeTimes, type TeeTime, type TimeOfDay } from "@/components/booking/sagamore-data";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { cx } from "@/utils/cx";

/**
 * Explorations/Google — a full-width hero tee-time booking module. Google-Flights-
 * style date selection (collapsed pill → two-month calendar with closed Mondays, a
 * blocked holiday weekend, randomized sold-out days, and fluctuating deal-biased
 * rates), filter chips (golfers stepper, 9/18 holes, hot deals) plus an All-filters
 * panel (time-window range slider, price, radios — each clearable), and results as
 * minimal cards in a four-column grid: a "Hot deal times" section over "All tee
 * times" segmented by period with a waitlist card (Priority-Notify dialog) per
 * period. Deals are shown via a discounted price, not badges. Sagamore Spring data.
 */
const meta = {
    title: "Explorations/Justin Crazy",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const photos = sagamoreImagesByCategory("photography");
const hero = photos[0]?.src;

/* --------------------------- dates / availability ------------------------- */

const TODAY = new Date(2026, 5, 19); // Fri, Jun 19 2026 — "today"
const DEFAULT_DATE = new Date(2026, 5, 19); // Fri, Jun 19 (today, weekday → $62)
const HOLIDAY_BLOCK = [new Date(2026, 6, 3), new Date(2026, 6, 4), new Date(2026, 6, 5)]; // Jul 3–5 — fully booked

const DAY_MIN = 5 * 60;
const DAY_MAX = 20 * 60;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();
const isPast = (d: Date) => startOfDay(d).getTime() < startOfDay(TODAY).getTime();
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
const isMonday = (d: Date) => d.getDay() === 1; // course closed Mondays
const isBlocked = (d: Date) => HOLIDAY_BLOCK.some((b) => sameDay(b, d));
// Deterministic pseudo-random "sold out" days so availability varies day to day.
const isSoldOut = (d: Date) => !sameDay(d, DEFAULT_DATE) && (d.getDate() * 7 + d.getMonth() * 13) % 7 === 5;
const isUnavailable = (d: Date) => isPast(d) || isMonday(d) || isBlocked(d) || isSoldOut(d);
const dayType = (d: Date): "weekday" | "weekend" => (isWeekend(d) ? "weekend" : "weekday");
const addDays = (d: Date, n: number) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
};
const nextAvailable = (d: Date, dir: number) => {
    let x = addDays(d, dir);
    for (let guard = 0; isUnavailable(x) && guard < 400; guard++) x = addDays(x, dir);
    return x;
};
const fmtShort = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtLong = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
const fmtNice = (d: Date) => `${d.toLocaleDateString("en-US", { weekday: "short" })}., ${d.toLocaleDateString("en-US", { month: "short" })}. ${d.getDate()}`;
/** Closest bookable day in either direction (used for the "next availability" prompt). */
const nearestAvailable = (d: Date) => {
    for (let i = 1; i < 400; i++) {
        const fwd = addDays(d, i);
        if (!isUnavailable(fwd)) return fwd;
        const back = addDays(d, -i);
        if (!isUnavailable(back)) return back;
    }
    return d;
};

const pad = (n: number) => String(n).padStart(2, "0");
const formatMinutes = (m: number) => {
    const h = Math.floor(m / 60);
    const period = h < 12 ? "AM" : "PM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${pad(m % 60)} ${period}`;
};

const baseFee = (d: Date) => (isWeekend(d) ? 70 : 62);

/** Fluctuating per-day calendar "from" rate, biased toward best-rate (deal) days. */
const priceFor = (d: Date): { price: number; isDeal: boolean } => {
    const seed = (d.getDate() * 37 + d.getMonth() * 101 + d.getDay() * 13) % 100;
    const isDeal = seed % 5 < 2;
    const dealPrices = [32, 36, 39, 44];
    const price = isDeal ? dealPrices[seed % dealPrices.length] : baseFee(d) - (seed % 5) * 2;
    return { price, isDeal };
};

const monthCells = (year: number, month: number): (Date | null)[] => {
    const offset = new Date(year, month, 1).getDay();
    const count = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = Array.from({ length: offset }, () => null);
    for (let d = 1; d <= count; d++) cells.push(new Date(year, month, d));
    return cells;
};

/* --------------------------------- options -------------------------------- */

type Ride = "walking" | "cart" | "pull-cart";
const RIDE_LABEL: Record<Ride, string> = { walking: "Walking", cart: "Cart", "pull-cart": "Pull cart" };
const RIDE_FEE: Record<Ride, number> = { walking: 0, cart: 20, "pull-cart": 4 };
const RIDE_FEE_LABEL: Record<Ride, string> = { walking: "", cart: "Cart fee", "pull-cart": "Push cart fee" };

/** Per-player green fee — the tee-time price itself, no cart (9 holes ≈ 60% of 18). */
const greenFeeRate = (holes: 9 | 18, weekend: boolean): number => {
    const base = weekend ? 52 : 44;
    return holes === 9 ? Math.round(base * 0.6) : base;
};

interface TeeOption extends TeeTime {
    holes: 9 | 18;
    ride: string;
    rideFee: number;
    rideFeeLabel: string;
    players: number;
    isDeal: boolean;
    price: number;
    wasPrice?: number;
    lastSpot: boolean;
    backNine: boolean;
    holesLabel: string;
}

/**
 * Build options for the chosen holes + ride, with deal pricing (discounted price + struck original).
 * Hot deals by time of day: none in the morning, up to 2 in the afternoon (fill-the-foursome first),
 * and all twilight slots.
 */
const MAX_MIDDAY_DEALS = 2;
const buildOptions = (slots: TeeTime[], opts: { holes: 9 | 18; ride: Ride; weekend: boolean; nine?: "front" | "back" }): TeeOption[] => {
    let middayDeals = 0;
    return slots.map((slot, i) => {
        const standard = greenFeeRate(opts.holes, opts.weekend);
        const lastSpot = slot.spotsAvailable === 1; // one spot to complete a foursome → fill-up deal
        let isDeal = false;
        let price = standard;
        let wasPrice: number | undefined;

        if (slot.timeOfDay === "twilight") {
            isDeal = true;
            price = opts.holes === 9 ? 22 : 32;
            wasPrice = standard;
        } else if (slot.timeOfDay === "midday" && (lastSpot || i % 5 === 0) && middayDeals < MAX_MIDDAY_DEALS) {
            middayDeals++;
            isDeal = true;
            price = Math.round(standard * (lastSpot ? 0.75 : 0.8));
            wasPrice = standard;
        }
        // morning: never a hot deal

        // 9-hole mornings default to the back 9 (front 9 holds 18-hole groups) unless front/back is chosen.
        const backNine = opts.holes === 9 && slot.timeOfDay === "morning";
        const holesLabel = opts.holes === 18 ? "18 holes" : opts.nine === "front" ? "Front 9" : opts.nine === "back" ? "Back 9" : backNine ? "Back 9" : "9 holes";
        return { ...slot, holes: opts.holes, ride: RIDE_LABEL[opts.ride], rideFee: RIDE_FEE[opts.ride], rideFeeLabel: RIDE_FEE_LABEL[opts.ride], players: slot.spotsAvailable, isDeal, price, wasPrice, lastSpot, backNine, holesLabel };
    });
};

const priceBucket = (p: number): string => (p < 50 ? "lt50" : p <= 65 ? "50-65" : "gt65");

const PERIODS: { key: TimeOfDay; label: string; hint: string; window: [number, number] }[] = [
    { key: "morning", label: "Morning", hint: "Before 11 AM", window: [5 * 60, 11 * 60] },
    { key: "midday", label: "Afternoon", hint: "11 AM – 3 PM", window: [11 * 60, 15 * 60] },
    { key: "twilight", label: "Twilight", hint: "After 3 PM", window: [15 * 60, 20 * 60] },
];

const PRICE_OPTS = [
    { id: "lt50", label: "Under $50" },
    { id: "50-65", label: "$50 – $65" },
    { id: "gt65", label: "$65 and up" },
];
// Time options for the pill-search version: "All day" plus 30-minute intervals.
const TIME_OPTS = [
    { id: "all-day", label: "All day" },
    ...Array.from({ length: (DAY_MAX - DAY_MIN) / 30 + 1 }, (_, i) => {
        const m = DAY_MIN + i * 30;
        return { id: String(m), label: formatMinutes(m) };
    }),
];
// 30-minute intervals grouped into the booking periods, for the Time dropdown separators.
const TIME_GROUPS = [
    { label: "Morning", times: TIME_OPTS.slice(1).filter((o) => Number(o.id) < 11 * 60) },
    { label: "Afternoon", times: TIME_OPTS.slice(1).filter((o) => Number(o.id) >= 11 * 60 && Number(o.id) < 15 * 60) },
    { label: "Twilight", times: TIME_OPTS.slice(1).filter((o) => Number(o.id) >= 15 * 60) },
];

/* ----------------------------------- atoms -------------------------------- */

const StarRating = ({ value }: { value: number }) => (
    <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star01 key={i} className={cx("size-3.5 fill-current", i < Math.round(value) ? "text-warning-primary" : "text-quaternary")} />
        ))}
    </span>
);

const chipBase =
    "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium outline-brand transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2";
const chipIdle = "border-primary bg-primary text-secondary hover:bg-primary_hover";
const chipActive = "border-brand bg-brand-primary text-brand-secondary";
const countBadge = "flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-solid px-1 text-xs text-white";

const PriceDropdown = ({ selected, onChange }: { selected: Set<string>; onChange: (s: Set<string>) => void }) => (
    <Dropdown.Root>
        <AriaButton className={cx(chipBase, selected.size > 0 ? chipActive : chipIdle)}>
            <CurrencyDollar className="size-4" />
            Price
            {selected.size > 0 && <span className={countBadge}>{selected.size}</span>}
            <ChevronDown className="size-4 text-fg-quaternary" />
        </AriaButton>
        <Dropdown.Popover className="w-56">
            <Dropdown.Menu
                aria-label="Price"
                selectionMode="multiple"
                selectedKeys={selected}
                onSelectionChange={(keys: Selection) => onChange(keys === "all" ? new Set(PRICE_OPTS.map((o) => o.id)) : new Set(Array.from(keys, String)))}
            >
                {PRICE_OPTS.map((o) => (
                    <Dropdown.Item key={o.id} id={o.id} selectionIndicator="checkbox" label={o.label} />
                ))}
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown.Root>
);

const GolferStepper = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
    <div className={cx("flex h-9 items-center gap-1 rounded-full border pr-1 pl-3", value !== 4 ? "border-brand bg-brand-primary" : "border-primary bg-primary")}>
        <Users01 className={cx("size-4", value !== 4 ? "text-brand-secondary" : "text-fg-quaternary")} />
        <span className={cx("mr-0.5 text-sm font-medium", value !== 4 ? "text-brand-secondary" : "text-secondary")}>Golfers</span>
        <button type="button" aria-label="Fewer golfers" disabled={value <= 1} onClick={() => onChange(value - 1)} className="flex size-7 items-center justify-center rounded-full text-fg-secondary hover:bg-secondary_hover disabled:opacity-40">
            <Minus className="size-4" />
        </button>
        <span className="w-4 text-center text-sm font-semibold text-primary tabular-nums">{value}</span>
        <button type="button" aria-label="More golfers" disabled={value >= 4} onClick={() => onChange(value + 1)} className="flex size-7 items-center justify-center rounded-full text-fg-secondary hover:bg-secondary_hover disabled:opacity-40">
            <Plus className="size-4" />
        </button>
    </div>
);

const HolesToggle = ({ value, onChange }: { value: 9 | 18; onChange: (h: 9 | 18) => void }) => (
    <div className={cx("flex h-9 items-center gap-1 rounded-full border bg-primary px-1.5", value !== 18 ? "border-brand" : "border-primary")}>
        <Flag06 className="ml-1.5 size-4 text-fg-quaternary" />
        {([9, 18] as const).map((h) => (
            <button
                key={h}
                type="button"
                onClick={() => onChange(h)}
                className={cx("rounded-full px-2.5 py-1 text-sm font-medium transition duration-100 ease-linear", value === h ? "bg-brand-solid text-white" : "text-secondary hover:text-primary")}
            >
                {h}
            </button>
        ))}
        <span className="pr-1 text-sm text-tertiary">holes</span>
    </div>
);

/* ----------------------------------- hero --------------------------------- */

const Hero = () => (
    <div className="flex flex-col items-center text-center">
        <div className="aspect-[16/6] w-full overflow-hidden rounded-2xl bg-secondary ring-1 ring-secondary">
            <img src={hero} alt={course.name} className="size-full object-cover" />
        </div>
        <SagamoreLogo className="mt-6 h-14 w-auto" />
        <h1 className="mt-4 text-3xl font-semibold text-primary">{course.name}</h1>
        <div className="mt-2 flex items-center gap-2 text-sm text-tertiary">
            <span className="font-medium text-primary">4.6</span>
            <StarRating value={4.6} />
            <span>· 412 reviews</span>
        </div>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-tertiary">
            <MarkerPin02 className="size-4 text-fg-quaternary" />
            {course.address}
        </p>
    </div>
);

/* ------------------------------- date selector ---------------------------- */

const RateToggle = ({ value, onChange }: { value: "weekday" | "weekend"; onChange: (v: "weekday" | "weekend") => void }) => (
    <div className="inline-flex rounded-full bg-secondary p-0.5 text-sm">
        {(["weekday", "weekend"] as const).map((v) => (
            <button
                key={v}
                type="button"
                onClick={() => onChange(v)}
                className={cx("rounded-full px-3 py-1 font-medium capitalize transition duration-100 ease-linear", value === v ? "bg-primary text-primary shadow-xs" : "text-tertiary hover:text-secondary")}
            >
                {v} rates
            </button>
        ))}
    </div>
);

const MonthGrid = ({ year, month, selected, rateType, onSelect, allowClosed }: { year: number; month: number; selected: Date; rateType: "weekday" | "weekend"; onSelect: (d: Date) => void; allowClosed?: boolean }) => {
    const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long" });
    return (
        <div>
            <div className="mb-2 text-center text-md font-medium text-primary">{monthName}</div>
            <div className="grid grid-cols-7 text-center text-xs text-quaternary">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i} className="pb-1">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7">
                {monthCells(year, month).map((date, i) => {
                    if (!date) return <div key={`b${i}`} />;
                    const past = isPast(date);
                    const closed = !past && (isMonday(date) || isBlocked(date) || isSoldOut(date));
                    const unavailable = past || closed;
                    const isSel = sameDay(date, selected);
                    const isToday = sameDay(date, TODAY);
                    const matches = dayType(date) === rateType;
                    const { price, isDeal } = priceFor(date);
                    const showPrice = !unavailable && matches;
                    return (
                        <button
                            key={date.toISOString()}
                            type="button"
                            disabled={allowClosed ? past : unavailable}
                            aria-label={`${fmtLong(date)}${closed ? " — unavailable" : ""}`}
                            aria-pressed={isSel}
                            onClick={() => onSelect(date)}
                            className="flex flex-col items-center gap-0.5 py-1 outline-brand focus-visible:outline-2"
                        >
                            <span
                                className={cx(
                                    "flex size-9 items-center justify-center rounded-full text-sm tabular-nums transition duration-100 ease-linear",
                                    isSel
                                        ? "bg-brand-solid font-semibold text-white"
                                        : past
                                          ? "text-quaternary"
                                          : closed
                                            ? "text-quaternary line-through"
                                            : matches
                                              ? "text-primary hover:bg-secondary_hover"
                                              : "text-quaternary hover:bg-secondary_hover",
                                    isToday && !isSel && "text-brand-secondary ring-1 ring-inset ring-brand",
                                )}
                            >
                                {date.getDate()}
                            </span>
                            <span className="h-3.5 text-[11px] leading-none tabular-nums">
                                {isToday ? (
                                    <span className="font-semibold text-brand-secondary">Today</span>
                                ) : showPrice ? (
                                    <span className={cx(isSel ? "font-medium text-brand-secondary" : isDeal ? "font-medium text-success-primary" : "text-tertiary")}>{formatPrice(price)}</span>
                                ) : null}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const DateSelector = ({ selected, onSelect, rateType, onRateType }: { selected: Date; onSelect: (d: Date) => void; rateType: "weekday" | "weekend"; onRateType: (v: "weekday" | "weekend") => void }) => {
    const [open, setOpen] = useState(false);
    const prevDay = nextAvailable(selected, -1);
    const nextDay = nextAvailable(selected, 1);
    const canPrev = !isPast(prevDay) && startOfDay(prevDay).getTime() < startOfDay(selected).getTime();

    return (
        <div>
            <div className="mx-auto flex max-w-md items-center justify-between rounded-full border border-primary bg-primary px-2 py-1.5">
                <button type="button" aria-label="Previous available day" disabled={!canPrev} onClick={() => onSelect(prevDay)} className="flex size-9 items-center justify-center rounded-full text-fg-secondary hover:bg-secondary_hover disabled:opacity-40">
                    <ChevronLeft className="size-5" />
                </button>
                <button type="button" onClick={() => setOpen((v) => !v)} className="flex flex-1 items-center justify-center gap-2 text-sm font-semibold text-primary">
                    <Calendar className="size-4 text-fg-quaternary" />
                    {fmtShort(selected)}
                </button>
                <button type="button" aria-label="Next available day" onClick={() => onSelect(nextDay)} className="flex size-9 items-center justify-center rounded-full text-fg-secondary hover:bg-secondary_hover">
                    <ChevronRight className="size-5" />
                </button>
            </div>

            {open && (
                <div className="mx-auto mt-3 max-w-2xl rounded-2xl bg-primary p-4 shadow-lg ring-1 ring-secondary sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary pb-3">
                        <RateToggle value={rateType} onChange={onRateType} />
                        <button type="button" onClick={() => { onSelect(DEFAULT_DATE); onRateType("weekday"); }} className="text-sm font-medium text-brand-secondary hover:underline">
                            Reset
                        </button>
                        <div className="flex items-center gap-1 rounded-full border border-primary px-2 py-1 text-sm font-medium text-primary">
                            <Calendar className="size-4 text-fg-quaternary" />
                            <span className="px-1">{fmtShort(selected)}</span>
                            <button type="button" aria-label="Previous available day" disabled={!canPrev} onClick={() => onSelect(prevDay)} className="text-fg-secondary disabled:opacity-40">
                                <ChevronLeft className="size-4" />
                            </button>
                            <button type="button" aria-label="Next available day" onClick={() => onSelect(nextDay)} className="text-fg-secondary">
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-2 sm:gap-10">
                        <MonthGrid year={2026} month={5} selected={selected} rateType={rateType} onSelect={onSelect} />
                        <MonthGrid year={2026} month={6} selected={selected} rateType={rateType} onSelect={onSelect} />
                    </div>

                    <div className="flex items-center justify-between border-t border-secondary pt-3">
                        <p className="text-xs text-tertiary">
                            <span className="font-medium text-success-primary">Green</span> = best rate · <span className="line-through">struck</span> = closed
                        </p>
                        <Button size="sm" onClick={() => setOpen(false)}>Done</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

/* --------------------------------- waitlist ------------------------------- */

const ALERT_TIMES = Array.from({ length: (DAY_MAX - DAY_MIN) / 30 + 1 }, (_, i) => formatMinutes(DAY_MIN + i * 30));

const TimeSelect = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-primary bg-primary px-3 py-2 text-sm font-medium text-primary shadow-xs outline-brand focus-visible:outline-2">
        {ALERT_TIMES.map((t) => (
            <option key={t} value={t}>{t}</option>
        ))}
    </select>
);

const VenueBlock = ({ date, party, timeRange }: { date: Date; party: number; timeRange?: string }) => (
    <div className="flex flex-col gap-1.5">
        <p className="text-base font-semibold text-primary">{course.shortName}</p>
        <p className="flex items-center gap-2 text-sm text-secondary">
            <Calendar className="size-4 text-fg-quaternary" /> {fmtLong(date)}
            {timeRange ? ` · ${timeRange}` : ""}
        </p>
        <p className="flex items-center gap-2 text-sm text-secondary">
            <Users01 className="size-4 text-fg-quaternary" /> {party} {party === 1 ? "golfer" : "golfers"}
        </p>
    </div>
);

const WaitlistDialogContent = ({ close, date, party, startTime, endTime }: { close: () => void; date: Date; party: number; startTime: string; endTime: string }) => {
    const [confirmed, setConfirmed] = useState(false);
    const [start, setStart] = useState(startTime);
    const [end, setEnd] = useState(endTime);

    if (confirmed) {
        return (
            <div className="flex flex-col">
                <div className="flex items-start justify-between gap-4">
                    <FeaturedIcon icon={CheckCircle} color="success" theme="light" size="lg" />
                    <CloseButton onPress={close} label="Close" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-primary">Tee-time alert on</h2>
                <p className="mt-1 text-sm text-tertiary">We&apos;ll notify you the moment a spot opens. Manage alerts in your Account.</p>
                <div className="mt-5 rounded-xl bg-secondary p-4">
                    <VenueBlock date={date} party={party} timeRange={`${start} – ${end}`} />
                </div>
                <Button size="lg" className="mt-5 w-full" onClick={close}>Done</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
                <FeaturedIcon icon={BellRinging01} color="gray" theme="modern" size="lg" />
                <CloseButton onPress={close} label="Close" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-primary">Set a tee-time alert</h2>
            <p className="mt-1 text-sm text-tertiary">If a tee time opens up, you&apos;ll get an email or push notification (if enabled).</p>
            <div className="mt-5 border-t border-secondary pt-4">
                <VenueBlock date={date} party={party} />
            </div>
            <div className="mt-4 rounded-xl bg-secondary p-4">
                <p className="text-sm font-semibold text-primary">Preferred start and end time</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                    <TimeSelect label="Preferred start time" value={start} onChange={setStart} />
                    <span className="text-sm text-tertiary">to</span>
                    <TimeSelect label="Preferred end time" value={end} onChange={setEnd} />
                </div>
            </div>
            <Button size="lg" className="mt-5 w-full" onClick={() => setConfirmed(true)}>Confirm</Button>
        </div>
    );
};

const WaitlistButton = ({ date, party, startTime, endTime }: { date: Date; party: number; startTime: string; endTime: string }) => (
    <DialogTrigger>
        <Button size="sm" color="secondary" iconLeading={BellRinging01}>Waitlist</Button>
        <ModalOverlay>
            <Modal>
                <Dialog className="max-w-100 rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary_alt">
                    {({ close }) => <WaitlistDialogContent close={close} date={date} party={party} startTime={startTime} endTime={endTime} />}
                </Dialog>
            </Modal>
        </ModalOverlay>
    </DialogTrigger>
);

const WaitlistCard = ({ period, date, party, startTime, endTime }: { period: string; date: Date; party: number; startTime: string; endTime: string }) => (
    <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-secondary bg-secondary p-4 text-center">
        <span className="flex items-center gap-1.5 text-sm font-medium text-secondary">
            <BellRinging01 className="size-4 text-fg-quaternary" /> {period} filling up
        </span>
        <WaitlistButton date={date} party={party} startTime={startTime} endTime={endTime} />
    </div>
);

/* ------------------------------ result cards ------------------------------ */

const spotsLabel = (n: number) => (n === 1 ? "1 spot left" : `${n} spots left`);

const BOOKING_FEE = 2.49;

/** A USD amount with superscript cents, e.g. $62⁰⁰. */
const Money = ({ amount, className }: { amount: number; className?: string }) => {
    const dollars = Math.floor(amount);
    const cents = Math.round((amount - dollars) * 100)
        .toString()
        .padStart(2, "0");
    return (
        <span className={cx("tabular-nums", className)}>
            ${dollars}
            <span className="align-top text-[0.6em] leading-none">{cents}</span>
        </span>
    );
};

/** Per-player price breakdown shown in the price info tooltip, with the group total. */
const PriceBreakdown = ({ option, golfers }: { option: TeeOption; golfers: number }) => {
    const perPlayer = option.price + option.rideFee + BOOKING_FEE;
    const group = golfers > 1;
    return (
        <span className="flex w-52 flex-col gap-1.5">
            <span className="flex items-center justify-between gap-4">
                <span className="font-normal text-tooltip-supporting-text">Green fee</span>
                <span className="flex items-baseline gap-1.5">
                    {option.wasPrice ? <Money amount={option.wasPrice} className="font-normal text-tooltip-supporting-text line-through" /> : null}
                    <Money amount={option.price} className="text-white" />
                </span>
            </span>
            {option.rideFee > 0 ? (
                <span className="flex items-center justify-between gap-4">
                    <span className="font-normal text-tooltip-supporting-text">{option.rideFeeLabel}</span>
                    <Money amount={option.rideFee} className="text-white" />
                </span>
            ) : null}
            <span className="flex items-center justify-between gap-4">
                <span className="font-normal text-tooltip-supporting-text">Booking fee</span>
                <Money amount={BOOKING_FEE} className="text-white" />
            </span>
            <span className="mt-0.5 flex items-center justify-between gap-4 border-t border-white/15 pt-1.5">
                <span className={group ? "font-normal text-tooltip-supporting-text" : undefined}>Total / player</span>
                <Money amount={perPlayer} className={group ? "font-normal text-tooltip-supporting-text" : "text-white"} />
            </span>
            {group ? (
                <span className="flex items-center justify-between gap-4">
                    <span>Total · {golfers} golfers</span>
                    <Money amount={perPlayer * golfers} className="text-white" />
                </span>
            ) : null}
        </span>
    );
};

const PriceInfo = ({ option, golfers }: { option: TeeOption; golfers: number }) => (
    <span onClick={(e) => e.stopPropagation()} className="flex">
        <Tooltip title={<PriceBreakdown option={option} golfers={golfers} />}>
            <TooltipTrigger className="text-fg-quaternary transition duration-100 ease-linear hover:text-fg-tertiary" aria-label="Price details">
                <InfoCircle className="size-3.5" />
            </TooltipTrigger>
        </Tooltip>
    </span>
);

const TimeCard = ({ option, selected, onSelect, golfers }: { option: TeeOption; selected: boolean; onSelect: () => void; golfers: number }) => (
    <div
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        onClick={onSelect}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
            }
        }}
        className={cx(
            "flex cursor-pointer flex-col gap-1.5 rounded-xl border p-4 text-left outline-brand transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2",
            selected ? "border-brand bg-brand-primary ring-1 ring-brand" : "border-secondary bg-primary hover:border-primary hover:bg-secondary_hover",
        )}
    >
        <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-semibold text-primary tabular-nums">{option.label}</span>
            <Money amount={option.price} className={cx("text-sm font-semibold", option.wasPrice ? "text-success-primary" : "text-primary")} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-tertiary">
            <span>{option.holesLabel}</span>
            <span aria-hidden>·</span>
            <span>{option.ride}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
            <span className={cx("text-xs", option.players <= 2 ? "font-medium text-error-primary" : "text-tertiary")}>{spotsLabel(option.players)}</span>
            <span className="flex items-center gap-1.5">
                {option.isDeal && <Zap className="size-3.5 text-success-primary" />}
                <PriceInfo option={option} golfers={golfers} />
            </span>
        </div>
    </div>
);

/* ------------------------------ all-filters panel ------------------------- */

const PanelSection = ({ title, onClear, showClear, children }: { title: string; onClear?: () => void; showClear?: boolean; children: React.ReactNode }) => (
    <div className="border-t border-secondary pt-5 first:border-0 first:pt-0">
        <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary">{title}</h3>
            {showClear && (
                <button type="button" onClick={onClear} className="text-xs font-medium text-brand-secondary hover:underline">
                    Clear
                </button>
            )}
        </div>
        {children}
    </div>
);

interface FiltersState {
    hotDeal: boolean;
    setHotDeal: (v: boolean) => void;
    timeRange: [number, number];
    setTimeRange: (r: [number, number]) => void;
    price: Set<string>;
    setPrice: (s: Set<string>) => void;
    golfers: number;
    setGolfers: (n: number) => void;
    holes: 9 | 18;
    setHoles: (h: 9 | 18) => void;
}

const AllFiltersPanel = ({ open, onClose, count, onClear, state }: { open: boolean; onClose: () => void; count: number; onClear: () => void; state: FiltersState }) => {
    if (!open) return null;
    const timeActive = state.timeRange[0] > DAY_MIN || state.timeRange[1] < DAY_MAX;
    const togglePrice = (id: string, on: boolean) => {
        const next = new Set(state.price);
        if (on) next.add(id);
        else next.delete(id);
        state.setPrice(next);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-overlay/50 p-4 backdrop-blur-[2px]" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className="mt-12 flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-primary shadow-xl ring-1 ring-secondary">
                <header className="flex items-center justify-between border-b border-secondary px-5 py-4">
                    <h2 className="text-lg font-semibold text-primary">Filters</h2>
                    <button type="button" aria-label="Close" onClick={onClose} className="flex size-8 items-center justify-center rounded-md text-fg-quaternary hover:bg-secondary_hover">
                        <XClose className="size-5" />
                    </button>
                </header>
                <div className="flex-1 space-y-1 overflow-y-auto px-5 py-5">
                    <PanelSection title="Hot deals">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-secondary">Show the best last-minute rates only</p>
                            <Toggle isSelected={state.hotDeal} onChange={state.setHotDeal} />
                        </div>
                    </PanelSection>

                    <PanelSection title="Time window" showClear={timeActive} onClear={() => state.setTimeRange([DAY_MIN, DAY_MAX])}>
                        <p className="mb-3 text-sm font-medium text-secondary tabular-nums">
                            {formatMinutes(state.timeRange[0])} – {formatMinutes(state.timeRange[1])}
                        </p>
                        <Slider
                            aria-label="Time window"
                            minValue={DAY_MIN}
                            maxValue={DAY_MAX}
                            step={30}
                            value={state.timeRange}
                            onChange={(v) => {
                                const arr = Array.isArray(v) ? v : [v, v];
                                state.setTimeRange([arr[0], arr[1]]);
                            }}
                            labelFormatter={formatMinutes}
                        />
                    </PanelSection>

                    <PanelSection title="Price" showClear={state.price.size > 0} onClear={() => state.setPrice(new Set())}>
                        <div className="grid grid-cols-1 gap-2.5">
                            {PRICE_OPTS.map((o) => (
                                <Checkbox key={o.id} label={o.label} isSelected={state.price.has(o.id)} onChange={(v) => togglePrice(o.id, v)} />
                            ))}
                        </div>
                    </PanelSection>

                    <PanelSection title="Golfers" showClear={state.golfers !== 4} onClear={() => state.setGolfers(4)}>
                        <RadioGroup value={String(state.golfers)} onChange={(v) => state.setGolfers(Number(v))} className="flex flex-wrap gap-x-5 gap-y-2">
                            {[1, 2, 3, 4].map((n) => (
                                <RadioButton key={n} value={String(n)} label={`${n} ${n === 1 ? "golfer" : "golfers"}`} />
                            ))}
                        </RadioGroup>
                    </PanelSection>

                    <PanelSection title="Holes" showClear={state.holes !== 18} onClear={() => state.setHoles(18)}>
                        <RadioGroup value={String(state.holes)} onChange={(v) => state.setHoles(Number(v) as 9 | 18)} className="flex flex-wrap gap-x-5 gap-y-2">
                            <RadioButton value="9" label="9 holes" />
                            <RadioButton value="18" label="18 holes" />
                        </RadioGroup>
                    </PanelSection>
                </div>
                <footer className="flex items-center justify-between border-t border-secondary px-5 py-3">
                    <Button color="link-gray" onClick={onClear}>Clear all</Button>
                    <Button onClick={onClose}>Show {count} times</Button>
                </footer>
            </div>
        </div>
    );
};

/* ------------------------------ booking module ---------------------------- */

const CardGrid = ({ children }: { children: React.ReactNode }) => <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;

const BookingModule = () => {
    const [selected, setSelected] = useState(DEFAULT_DATE);
    const [rateType, setRateType] = useState<"weekday" | "weekend">("weekday");
    const [hotDeal, setHotDeal] = useState(false);
    const [timeRange, setTimeRange] = useState<[number, number]>([DAY_MIN, DAY_MAX]);
    const [price, setPrice] = useState<Set<string>>(new Set());
    const [golfers, setGolfers] = useState(4);
    const [holes, setHoles] = useState<9 | 18>(18);
    const [slot, setSlot] = useState<string | null>(null);
    const [filtersOpen, setFiltersOpen] = useState(false);

    let options = buildOptions(generateTeeTimes(dayType(selected)).filter((s) => s.spotsAvailable > 0), { holes, ride: "cart", weekend: isWeekend(selected) });
    options = options.filter((o) => o.players >= golfers);
    if (price.size) options = options.filter((o) => price.has(priceBucket(o.price)));
    if (hotDeal) options = options.filter((o) => o.isDeal);
    const timeActive = timeRange[0] > DAY_MIN || timeRange[1] < DAY_MAX;
    if (timeActive) options = options.filter((o) => o.minutes >= timeRange[0] && o.minutes <= timeRange[1]);

    const perPlayer = baseFee(selected);
    const deals = options.filter((o) => o.isDeal);
    const sections = PERIODS.map((p) => ({ ...p, items: options.filter((o) => o.timeOfDay === p.key) })).filter((s) => s.items.length > 0);
    const activeCount = (timeActive ? 1 : 0) + price.size + (hotDeal ? 1 : 0) + (golfers !== 4 ? 1 : 0) + (holes !== 18 ? 1 : 0);

    const clearAll = () => {
        setTimeRange([DAY_MIN, DAY_MAX]);
        setPrice(new Set());
        setGolfers(4);
        setHoles(18);
        setHotDeal(false);
    };

    const card = (o: TeeOption) => <TimeCard key={o.id} option={o} selected={slot === o.id} onSelect={() => setSlot(o.id)} golfers={golfers} />;

    return (
        <div className="mx-auto w-full max-w-5xl px-4">
            <Hero />

            <p className="mt-2 text-center text-sm text-tertiary">
                {fmtShort(selected)} · {golfers} players · {formatPrice(perPlayer)}/player
            </p>

            <div className="mt-6">
                <DateSelector selected={selected} onSelect={setSelected} rateType={rateType} onRateType={setRateType} />
            </div>

            {/* Filters */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button type="button" onClick={() => setFiltersOpen(true)} className={cx(chipBase, activeCount > 0 ? chipActive : "border-primary bg-primary text-brand-secondary hover:bg-primary_hover")}>
                    <FilterLines className="size-4" /> All filters
                    {activeCount > 0 && <span className={countBadge}>{activeCount}</span>}
                </button>
                <button type="button" onClick={() => setHotDeal((v) => !v)} className={cx(chipBase, hotDeal ? "border-transparent bg-success-solid text-white" : chipIdle)}>
                    <Zap className="size-4" /> Hot deals
                </button>
                <GolferStepper value={golfers} onChange={setGolfers} />
                <HolesToggle value={holes} onChange={setHoles} />
                <PriceDropdown selected={price} onChange={setPrice} />
            </div>

            {/* Results */}
            <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">{options.length} tee times</span>
                <span className="text-xs text-tertiary">{fmtShort(selected)}</span>
            </div>

            {options.length > 0 ? (
                <div className="mt-3 space-y-8">
                    {deals.length > 0 && (
                        <section>
                            <div className="mb-3 flex items-baseline gap-2">
                                <h2 className="flex items-center gap-1.5 text-base font-semibold text-primary">
                                    <Zap className="size-4 text-success-primary" /> Hot deal times
                                </h2>
                                <span className="text-xs text-tertiary">Today&apos;s best rates</span>
                                <span className="ml-auto text-xs text-tertiary">{deals.length} times</span>
                            </div>
                            <CardGrid>{deals.map(card)}</CardGrid>
                        </section>
                    )}

                    <div>
                        <h2 className="mb-4 text-base font-semibold text-primary">All tee times</h2>
                        <div className="space-y-8">
                            {sections.map((s) => (
                                <section key={s.key}>
                                    <div className="mb-3 flex items-baseline gap-2">
                                        <h3 className="text-sm font-semibold text-primary">{s.label}</h3>
                                        <span className="text-xs text-tertiary">{s.hint}</span>
                                        <span className="ml-auto text-xs text-tertiary">{s.items.length} times</span>
                                    </div>
                                    <CardGrid>
                                        {s.items.map(card)}
                                        <WaitlistCard period={s.label} date={selected} party={golfers} startTime={formatMinutes(s.window[0])} endTime={formatMinutes(s.window[1])} />
                                    </CardGrid>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="mt-3 rounded-xl border border-secondary py-12 text-center text-sm text-tertiary">No tee times match these filters — try clearing one.</p>
            )}

            <p className="mt-6 text-center text-xs text-tertiary">Prices are per player and may include a shared cart. Taxes &amp; fees calculated at checkout.</p>

            <AllFiltersPanel
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                count={options.length}
                onClear={clearAll}
                state={{ hotDeal, setHotDeal, timeRange, setTimeRange, price, setPrice, golfers, setGolfers, holes, setHoles }}
            />
        </div>
    );
};

/* ===================== pill-search version (SearchBar) ==================== */

const CalendarPanel = ({ selected, onSelect, rateType, onRateType, onDone }: { selected: Date; onSelect: (d: Date) => void; rateType: "weekday" | "weekend"; onRateType: (v: "weekday" | "weekend") => void; onDone: () => void }) => (
    <div className="w-[640px] max-w-[86vw]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary pb-3">
            <RateToggle value={rateType} onChange={onRateType} />
            <button type="button" onClick={() => { onSelect(DEFAULT_DATE); onRateType("weekday"); }} className="text-sm font-medium text-brand-secondary hover:underline">
                Reset
            </button>
        </div>
        <div className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-2 sm:gap-10">
            <MonthGrid year={2026} month={5} selected={selected} rateType={rateType} onSelect={onSelect} allowClosed />
            <MonthGrid year={2026} month={6} selected={selected} rateType={rateType} onSelect={onSelect} allowClosed />
        </div>
        <div className="flex items-center justify-between border-t border-secondary pt-3">
            <p className="text-xs text-tertiary">
                <span className="font-medium text-success-primary">Green</span> = best rate · <span className="line-through">struck</span> = sold out
            </p>
            <Button size="sm" onClick={onDone}>Done</Button>
        </div>
    </div>
);

const Segment = ({ label, value, open, onToggle, onClose, align = "left", wide, grow, children }: { label: string; value: string; open: boolean; onToggle: () => void; onClose: () => void; align?: "left" | "right" | "center"; wide?: boolean; grow?: boolean; children: React.ReactNode }) => (
    <div className={cx("relative", grow ? "flex-[1.6]" : "flex-1")}>
        <button type="button" onClick={onToggle} className={cx("flex w-full items-center justify-between gap-2 rounded-full px-4 py-2 text-left transition duration-100 ease-linear", open ? "bg-secondary" : "hover:bg-secondary")}>
            <span className="flex min-w-0 flex-col">
                <span className="text-xs text-tertiary">{label}</span>
                <span className="truncate text-base font-semibold whitespace-nowrap text-primary">{value}</span>
            </span>
            <ChevronDown className={cx("size-5 shrink-0 text-fg-quaternary transition duration-100 ease-linear", open && "rotate-180")} />
        </button>
        {open && (
            <>
                <div className="fixed inset-0 z-30" onClick={onClose} />
                <div className={cx("absolute top-full z-40 mt-2 rounded-2xl bg-primary p-4 shadow-lg ring-1 ring-secondary", wide ? "w-max" : "w-72", align === "right" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0")}>
                    {children}
                </div>
            </>
        )}
    </div>
);

/** Single-select start time: pick a time to look forward from (or All day), grouped by period. */
const TimePicker = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <RadioGroup value={value} onChange={onChange} aria-label="Starting time" className="flex max-h-80 flex-col gap-2.5 overflow-y-auto pr-1">
        <RadioButton value="all-day" label="All day" />
        {TIME_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 pt-1">
                    <span className="h-px flex-1 bg-border-secondary" />
                    <span className="text-[10px] font-semibold tracking-wide text-quaternary uppercase">{group.label}</span>
                    <span className="h-px flex-1 bg-border-secondary" />
                </div>
                {group.times.map((o) => (
                    <RadioButton key={o.id} value={o.id} label={o.label} />
                ))}
            </div>
        ))}
    </RadioGroup>
);

const DateStrip = ({ selected, onSelect, onMore }: { selected: Date; onSelect: (d: Date) => void; onMore: () => void }) => {
    const days = Array.from({ length: 11 }, (_, i) => addDays(TODAY, i));
    return (
        <div className="flex items-end justify-center gap-4 overflow-x-auto px-2 pb-1 sm:gap-5 scrollbar-hide">
            {days.map((d) => {
                const unavailable = isUnavailable(d);
                const isSel = sameDay(d, selected);
                const isToday = sameDay(d, TODAY);
                return (
                    <button key={d.toISOString()} type="button" onClick={() => onSelect(d)} className="flex shrink-0 flex-col items-center gap-1.5 outline-brand focus-visible:outline-2">
                        <span className={cx("text-sm", isToday ? "font-semibold text-brand-secondary" : "text-tertiary")}>{isToday ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                        <span
                            className={cx(
                                "flex size-11 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition duration-100 ease-linear",
                                isSel
                                    ? "border-transparent bg-brand-solid text-white"
                                    : unavailable
                                      ? "border-error text-error-primary"
                                      : isToday
                                        ? "border-brand text-brand-secondary"
                                        : "border-secondary text-brand-secondary hover:border-brand",
                            )}
                        >
                            {d.getDate()}
                        </span>
                    </button>
                );
            })}
            <button type="button" onClick={onMore} aria-label="More dates" className="flex shrink-0 flex-col items-center gap-1.5">
                <span className="text-sm text-transparent">·</span>
                <span className="flex size-11 items-center justify-center rounded-full border border-brand text-brand-secondary transition duration-100 ease-linear hover:bg-brand-primary">···</span>
            </button>
        </div>
    );
};

const HotTabs = ({ value, onChange, cheapest }: { value: "all" | "hot"; onChange: (v: "all" | "hot") => void; cheapest: number | null }) => (
    <div className="grid grid-cols-2 overflow-hidden rounded-xl ring-1 ring-secondary">
        <button
            type="button"
            onClick={() => onChange("all")}
            className={cx("border-b-2 py-3.5 text-center text-sm font-semibold transition duration-100 ease-linear", value === "all" ? "border-brand bg-brand-primary text-brand-secondary" : "border-transparent bg-primary text-secondary hover:bg-secondary")}
        >
            All tee times
        </button>
        <button
            type="button"
            onClick={() => onChange("hot")}
            className={cx("flex items-center justify-center gap-1.5 border-b-2 py-3.5 text-sm font-semibold transition duration-100 ease-linear", value === "hot" ? "border-brand bg-brand-primary text-brand-secondary" : "border-transparent bg-primary text-secondary hover:bg-secondary")}
        >
            <Zap className="size-4 text-success-primary" /> Hot deals
            {cheapest != null && (
                <>
                    <span className="text-xs font-normal text-tertiary">from</span>
                    <span className="font-semibold text-success-primary tabular-nums">{formatPrice(cheapest)}</span>
                </>
            )}
        </button>
    </div>
);

/** Shown when the selected day has no online availability — with a next-availability jump and waitlist. */
const NotifyEmptyState = ({ date, golfers, nearest, onJump }: { date: Date; golfers: number; nearest: Date; onJump: () => void }) => (
    <div className="mx-auto max-w-lg rounded-2xl border border-secondary bg-secondary p-8 text-center">
        <div className="flex justify-center">
            <FeaturedIcon icon={Calendar} color="gray" theme="modern" size="lg" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-primary">No online availability</h3>
        <p className="mt-2 text-sm text-tertiary">
            At the moment, there&apos;s no online availability for <span className="font-medium text-secondary">{fmtNice(date)}</span>. The next availability for {golfers} is{" "}
            <button type="button" onClick={onJump} className="font-semibold text-brand-secondary hover:underline">
                {fmtNice(nearest)}
            </button>
            .
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button color="secondary" onClick={onJump}>
                Go to {fmtNice(nearest)}
            </Button>
            <WaitlistButton date={date} party={golfers} startTime="5:00 AM" endTime="8:00 PM" />
        </div>
        <p className="mt-4 text-xs text-tertiary">Hop on the waitlist and we&apos;ll text you the moment a {fmtNice(date)} tee time opens.</p>
    </div>
);

const SearchBookingModule = ({ variant = "june19" }: { variant?: "june19" | "june20" }) => {
    const isV2 = variant === "june20";
    const [selected, setSelected] = useState<Date>(isV2 ? new Date(2026, 5, 20) : DEFAULT_DATE);
    const [rateType, setRateType] = useState<"weekday" | "weekend">(isV2 ? "weekend" : "weekday");
    const [golfers, setGolfers] = useState(2);
    const [holes, setHoles] = useState<9 | 18>(18);
    const [ride, setRide] = useState<Ride>("cart");
    const [time, setTime] = useState("all-day");
    const [hotTab, setHotTab] = useState<"all" | "hot">("all");
    const [slot, setSlot] = useState<string | null>(null);
    const [openSeg, setOpenSeg] = useState<null | "golfers" | "date" | "time" | "holes">(null);
    const close = () => setOpenSeg(null);
    const toggleSeg = (k: "golfers" | "date" | "time" | "holes") => setOpenSeg((p) => (p === k ? null : k));

    // Show the Sagamore info in the sticky search bar once it's scrolled to the top.
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [stuck, setStuck] = useState(false);
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const all = buildOptions(generateTeeTimes(dayType(selected)).filter((s) => s.spotsAvailable > 0), { holes, ride, weekend: isWeekend(selected) });
    const dealPrices = all.filter((o) => o.isDeal).map((o) => o.price);
    const cheapest = dealPrices.length ? Math.min(...dealPrices) : null;

    const timeSpecific = time !== "all-day";
    let options = all.filter((o) => o.players >= golfers);
    if (timeSpecific) options = options.filter((o) => o.minutes >= Number(time));
    if (hotTab === "hot") options = options.filter((o) => o.isDeal);

    const sections = PERIODS.map((p) => ({ ...p, items: options.filter((o) => o.timeOfDay === p.key) })).filter((s) => s.items.length > 0);
    const card = (o: TeeOption) => <TimeCard key={o.id} option={o} selected={slot === o.id} onSelect={() => setSlot(o.id)} golfers={golfers} />;
    const unavailableSelected = isUnavailable(selected);
    const nearest = nearestAvailable(selected);

    const dateLabel = sameDay(selected, TODAY) ? "Today" : sameDay(selected, addDays(TODAY, 1)) ? "Tomorrow" : fmtShort(selected);
    const timeLabel = !timeSpecific ? "All Day" : `From ${formatMinutes(Number(time))}`;

    return (
        <div className="mx-auto w-full max-w-5xl px-4">
            {isV2 ? (
                <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-medium text-brand-secondary">
                    <Zap className="size-4" /> Weekend twilight rates are live — book after 3 PM and save
                </div>
            ) : null}
            <Hero />

            {/* Sticky pill search bar — gains the Sagamore info once scrolled to the top */}
            <div ref={sentinelRef} className="mt-6 h-px" />
            <div className="sticky top-0 z-40 -mx-4 bg-primary/95 px-4 pt-2 pb-2.5 backdrop-blur-sm">
                {stuck && (
                    <div className="mb-2.5 flex items-center justify-center gap-2.5">
                        <SagamoreLogo className="h-7 w-auto" />
                        <span className="text-sm font-semibold text-primary">{course.name}</span>
                    </div>
                )}
                <div className="mx-auto flex max-w-5xl items-stretch rounded-full bg-primary p-1.5 shadow-sm ring-1 ring-secondary">
                <Segment label="Golfers" value={`${golfers} ${golfers === 1 ? "Golfer" : "Golfers"}`} open={openSeg === "golfers"} onToggle={() => toggleSeg("golfers")} onClose={close}>
                    <RadioGroup value={String(golfers)} onChange={(v) => setGolfers(Number(v))} className="flex flex-col gap-2.5">
                        <RadioButton value="1" label="1 golfer" />
                        <RadioButton value="2" label="2 golfers" />
                        <RadioButton value="3" label="3 golfers" />
                        <RadioButton value="4" label="4 golfers" />
                    </RadioGroup>
                </Segment>
                <span className="my-2 w-px shrink-0 bg-secondary" />
                <Segment label="Date" value={dateLabel} open={openSeg === "date"} onToggle={() => toggleSeg("date")} onClose={close} align="center" wide>
                    <CalendarPanel selected={selected} onSelect={setSelected} rateType={rateType} onRateType={setRateType} onDone={close} />
                </Segment>
                <span className="my-2 w-px shrink-0 bg-secondary" />
                <Segment label="Time" value={timeLabel} open={openSeg === "time"} onToggle={() => toggleSeg("time")} onClose={close} align="center">
                    <TimePicker value={time} onChange={setTime} />
                </Segment>
                <span className="my-2 w-px shrink-0 bg-secondary" />
                <Segment label="Holes" value={`${holes} holes · ${RIDE_LABEL[ride]}`} open={openSeg === "holes"} onToggle={() => toggleSeg("holes")} onClose={close} align="right">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="mb-2.5 text-xs font-semibold tracking-wide text-tertiary uppercase">Holes</p>
                            <RadioGroup value={String(holes)} onChange={(v) => setHoles(Number(v) as 9 | 18)} className="flex gap-x-6">
                                <RadioButton value="9" label="9 holes" />
                                <RadioButton value="18" label="18 holes" />
                            </RadioGroup>
                        </div>
                        <div className="border-t border-secondary pt-4">
                            <p className="mb-2.5 text-xs font-semibold tracking-wide text-tertiary uppercase">Getting around</p>
                            <RadioGroup value={ride} onChange={(v) => setRide(v as Ride)} className="flex flex-col gap-2.5">
                                <RadioButton value="walking" label="Walking" />
                                <RadioButton value="cart" label="Cart" />
                                <RadioButton value="pull-cart" label="Pull cart" />
                            </RadioGroup>
                        </div>
                    </div>
                </Segment>
                </div>
            </div>

            {/* Date strip */}
            <div className="mt-5">
                <DateStrip selected={selected} onSelect={setSelected} onMore={() => setOpenSeg("date")} />
            </div>

            {/* Best / Hot deals tabs */}
            <div className="mt-5">
                <HotTabs value={hotTab} onChange={setHotTab} cheapest={cheapest} />
            </div>

            {/* Results */}
            {unavailableSelected ? (
                <div className="mt-8">
                    <NotifyEmptyState date={selected} golfers={golfers} nearest={nearest} onJump={() => setSelected(nearest)} />
                </div>
            ) : (
                <>
                    <div className="mt-6 flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">{options.length} tee times</span>
                        <span className="text-xs text-tertiary">{fmtShort(selected)}</span>
                    </div>

                    {options.length > 0 ? (
                        <div className="mt-3 space-y-8">
                            {sections.map((s) => (
                                <section key={s.key}>
                                    <div className="mb-3 flex items-baseline gap-2">
                                        <h3 className="text-sm font-semibold text-primary">{s.label}</h3>
                                        <span className="text-xs text-tertiary">{s.hint}</span>
                                        <span className="ml-auto text-xs text-tertiary">{s.items.length} times</span>
                                    </div>
                                    <CardGrid>
                                        {s.items.map(card)}
                                        <WaitlistCard period={s.label} date={selected} party={golfers} startTime={formatMinutes(s.window[0])} endTime={formatMinutes(s.window[1])} />
                                    </CardGrid>
                                </section>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-3 rounded-xl border border-secondary py-12 text-center text-sm text-tertiary">No tee times match — try widening your search.</p>
                    )}
                </>
            )}

            <p className="mt-6 text-center text-xs text-tertiary">Prices are per player and may include a shared cart. Taxes &amp; fees calculated at checkout.</p>
        </div>
    );
};

/* =================== June 20 — Google-Flights chip bar version ============= */

/** A filters-panel row: a heading with a vertical list of radio buttons. */
const RadioRow = ({ label, options, value, onChange }: { label: string; options: { id: string; label: string }[]; value: string; onChange: (v: string) => void }) => (
    <div className="py-4">
        <h3 className="mb-3 text-sm font-semibold text-primary">{label}</h3>
        <RadioGroup value={value} onChange={onChange} aria-label={label} className="flex flex-col gap-3">
            {options.map((o) => (
                <RadioButton key={o.id} value={o.id} label={o.label} />
            ))}
        </RadioGroup>
    </div>
);

interface June20Filters {
    deals: boolean;
    setDeals: (v: boolean) => void;
    holes: 9 | 18;
    setHoles: (h: 9 | 18) => void;
    nine: "front" | "back";
    setNine: (n: "front" | "back") => void;
    ride: Ride;
    setRide: (r: Ride) => void;
}

const June20FiltersPanel = ({ open, onClose, state }: { open: boolean; onClose: () => void; state: June20Filters }) => {
    if (!open) return null;
    const clearAll = () => {
        state.setDeals(false);
        state.setHoles(18);
        state.setRide("cart");
    };
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-overlay/50 p-4 backdrop-blur-[2px]" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className="mt-12 flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-primary shadow-xl ring-1 ring-secondary">
                <header className="flex items-center justify-between border-b border-secondary px-5 py-4">
                    <h2 className="text-lg font-semibold text-primary">Filters</h2>
                    <button type="button" aria-label="Close" onClick={onClose} className="flex size-8 items-center justify-center rounded-md text-fg-quaternary hover:bg-secondary_hover">
                        <XClose className="size-5" />
                    </button>
                </header>
                <div className="flex-1 divide-y divide-secondary overflow-y-auto px-5">
                    {/* Hot deals — switch with icon */}
                    <div className="flex items-center justify-between gap-4 py-3.5">
                        <span className="flex items-center gap-3">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success-secondary text-fg-success-primary">
                                <Zap className="size-5" />
                            </span>
                            <span className="flex flex-col">
                                <span className="text-sm font-medium text-primary">Hot deals</span>
                                <span className="text-xs text-tertiary">Only show discounted tee times</span>
                            </span>
                        </span>
                        <Toggle isSelected={state.deals} onChange={state.setDeals} />
                    </div>
                    <RadioRow
                        label="Getting around"
                        options={[
                            { id: "walking", label: "Walking" },
                            { id: "cart", label: "Cart" },
                            { id: "pull-cart", label: "Pull cart" },
                        ]}
                        value={state.ride}
                        onChange={(v) => state.setRide(v as Ride)}
                    />
                    <RadioRow
                        label="Holes"
                        options={[
                            { id: "18", label: "18 holes" },
                            { id: "9", label: "9 holes" },
                        ]}
                        value={state.holes === 18 ? "18" : "9"}
                        onChange={(v) => state.setHoles(v === "18" ? 18 : 9)}
                    />
                    {/* Conditional — only when 9 holes is chosen */}
                    {state.holes === 9 ? (
                        <RadioRow
                            label="Which nine"
                            options={[
                                { id: "front", label: "Front 9" },
                                { id: "back", label: "Back 9" },
                            ]}
                            value={state.nine}
                            onChange={(v) => state.setNine(v as "front" | "back")}
                        />
                    ) : null}
                </div>
                <footer className="flex items-center justify-center border-t border-secondary px-5 py-3.5">
                    <button type="button" onClick={clearAll} className="flex items-center gap-1.5 text-sm font-medium text-secondary transition duration-100 ease-linear hover:text-primary">
                        <XClose className="size-4" /> Clear all filters
                    </button>
                </footer>
            </div>
        </div>
    );
};

const June20Module = () => {
    const [selected, setSelected] = useState<Date>(new Date(2026, 5, 20));
    const [rateType, setRateType] = useState<"weekday" | "weekend">("weekend");
    const [golfers, setGolfers] = useState(2);
    const [holes, setHoles] = useState<9 | 18>(18);
    const [nine, setNine] = useState<"front" | "back">("back");
    const [ride, setRide] = useState<Ride>("cart");
    const [time, setTime] = useState("all-day");
    const [deals, setDeals] = useState(false);
    const [slot, setSlot] = useState<string | null>(null);
    const [openChip, setOpenChip] = useState<null | "date" | "time" | "golfers">(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const toggleChip = (k: "date" | "time" | "golfers") => setOpenChip((p) => (p === k ? null : k));
    const close = () => setOpenChip(null);

    // Show the Sagamore info in the sticky search bar once it's scrolled to the top.
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [stuck, setStuck] = useState(false);
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const all = buildOptions(generateTeeTimes(dayType(selected)).filter((s) => s.spotsAvailable > 0), { holes, ride, weekend: isWeekend(selected), nine: holes === 9 ? nine : undefined });
    let options = all.filter((o) => o.players >= golfers);
    const timeSpecific = time !== "all-day";
    if (timeSpecific) options = options.filter((o) => o.minutes >= Number(time));
    if (deals) options = options.filter((o) => o.isDeal);
    const sections = PERIODS.map((p) => ({ ...p, items: options.filter((o) => o.timeOfDay === p.key) })).filter((s) => s.items.length > 0);
    const card = (o: TeeOption) => <TimeCard key={o.id} option={o} selected={slot === o.id} onSelect={() => setSlot(o.id)} golfers={golfers} />;
    const unavailableSelected = isUnavailable(selected);
    const nearest = nearestAvailable(selected);
    const activeCount = (deals ? 1 : 0) + (holes !== 18 ? 1 : 0) + (ride !== "cart" ? 1 : 0) + (timeSpecific ? 1 : 0);
    const dateLabel = sameDay(selected, TODAY) ? "Today" : sameDay(selected, addDays(TODAY, 1)) ? "Tomorrow" : fmtShort(selected);
    const timeLabel = timeSpecific ? `From ${formatMinutes(Number(time))}` : "All Day";

    // Dismissable chips for each active filter (golfers/date/time live in the bar above).
    const filterChips: { key: string; label: string; clear: () => void }[] = [];
    if (deals) filterChips.push({ key: "deals", label: "Hot deals", clear: () => setDeals(false) });
    if (holes !== 18) filterChips.push({ key: "holes", label: nine === "front" ? "Front 9" : "Back 9", clear: () => setHoles(18) });
    if (ride !== "cart") filterChips.push({ key: "ride", label: RIDE_LABEL[ride], clear: () => setRide("cart") });
    if (timeSpecific) filterChips.push({ key: "time", label: timeLabel, clear: () => setTime("all-day") });

    return (
        <div className="mx-auto w-full max-w-5xl px-4">
            <Hero />

            {/* Sticky pill search bar — gains the Sagamore info once scrolled to the top */}
            <div ref={sentinelRef} className="mt-6 h-px" />
            <div className="sticky top-0 z-40 -mx-4 bg-primary/95 px-4 pt-2 pb-2.5 backdrop-blur-sm">
                {stuck && (
                    <div className="mb-2.5 flex items-center justify-center gap-2.5">
                        <SagamoreLogo className="h-7 w-auto" />
                        <span className="text-sm font-semibold text-primary">{course.name}</span>
                    </div>
                )}
                <div className="mx-auto flex max-w-3xl items-stretch rounded-full bg-primary p-1.5 shadow-sm ring-1 ring-secondary">
                <Segment label="Golfers" value={`${golfers} ${golfers === 1 ? "Golfer" : "Golfers"}`} open={openChip === "golfers"} onToggle={() => toggleChip("golfers")} onClose={close}>
                    <RadioGroup value={String(golfers)} onChange={(v) => setGolfers(Number(v))} className="flex flex-col gap-2.5">
                        <RadioButton value="1" label="1 golfer" />
                        <RadioButton value="2" label="2 golfers" />
                        <RadioButton value="3" label="3 golfers" />
                        <RadioButton value="4" label="4 golfers" />
                    </RadioGroup>
                </Segment>
                <span className="my-2 w-px shrink-0 bg-secondary" />
                <Segment label="Date" value={dateLabel} open={openChip === "date"} onToggle={() => toggleChip("date")} onClose={close} align="center" wide>
                    <CalendarPanel selected={selected} onSelect={setSelected} rateType={rateType} onRateType={setRateType} onDone={close} />
                </Segment>
                <span className="my-2 w-px shrink-0 bg-secondary" />
                <Segment label="Time" value={timeLabel} open={openChip === "time"} onToggle={() => toggleChip("time")} onClose={close} align="center">
                    <TimePicker value={time} onChange={setTime} />
                </Segment>
                <span className="my-2 w-px shrink-0 bg-secondary" />
                <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="flex flex-1 items-center justify-between gap-2 rounded-full px-4 py-2 text-left outline-brand transition duration-100 ease-linear hover:bg-secondary focus-visible:outline-2 focus-visible:-outline-offset-2"
                >
                    <span className="flex min-w-0 flex-col">
                        <span className="text-xs text-tertiary">Filters</span>
                        <span className="truncate text-base font-semibold whitespace-nowrap text-primary">{activeCount > 0 ? "Active" : "All"}</span>
                    </span>
                    {activeCount > 0 ? (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-solid text-xs font-semibold text-white">{activeCount}</span>
                    ) : (
                        <FilterLines className="size-5 shrink-0 text-fg-quaternary" />
                    )}
                </button>
            </div>

            {/* Dismissable active-filter chips */}
            {filterChips.length > 0 ? (
                <div className="mx-auto mt-3 flex max-w-3xl flex-wrap items-center gap-2">
                    {filterChips.map((c) => (
                        <span key={c.key} className="inline-flex items-center gap-1 rounded-full border border-brand bg-brand-primary py-1 pr-1.5 pl-3 text-sm font-medium text-brand-secondary">
                            {c.label}
                            <button
                                type="button"
                                aria-label={`Remove ${c.label}`}
                                onClick={c.clear}
                                className="flex size-5 items-center justify-center rounded-full text-brand-secondary outline-brand transition duration-100 ease-linear hover:bg-brand-secondary focus-visible:outline-2"
                            >
                                <XClose className="size-3.5" />
                            </button>
                        </span>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            setDeals(false);
                            setHoles(18);
                            setRide("cart");
                            setTime("all-day");
                        }}
                        className="ml-1 text-sm font-medium text-tertiary outline-brand transition duration-100 ease-linear hover:text-secondary focus-visible:outline-2"
                    >
                        Clear all
                    </button>
                </div>
            ) : null}
            </div>

            {unavailableSelected ? (
                <div className="mt-8">
                    <NotifyEmptyState date={selected} golfers={golfers} nearest={nearest} onJump={() => setSelected(nearest)} />
                </div>
            ) : (
                <>
                    <div className="mt-6 flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">{options.length} tee times</span>
                        <span className="text-xs text-tertiary">{fmtShort(selected)}</span>
                    </div>
                    {options.length > 0 ? (
                        <div className="mt-3 space-y-8">
                            {sections.map((s) => (
                                <section key={s.key}>
                                    <div className="mb-3 flex items-baseline gap-2">
                                        <h3 className="text-sm font-semibold text-primary">{s.label}</h3>
                                        <span className="text-xs text-tertiary">{s.hint}</span>
                                        <span className="ml-auto text-xs text-tertiary">{s.items.length} times</span>
                                    </div>
                                    <CardGrid>
                                        {s.items.map(card)}
                                        <WaitlistCard period={s.label} date={selected} party={golfers} startTime={formatMinutes(s.window[0])} endTime={formatMinutes(s.window[1])} />
                                    </CardGrid>
                                </section>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-3 rounded-xl border border-secondary py-12 text-center text-sm text-tertiary">No tee times match — try clearing a filter.</p>
                    )}
                </>
            )}

            <p className="mt-6 text-center text-xs text-tertiary">Prices are per player and may include a shared cart. Taxes &amp; fees calculated at checkout.</p>

            <June20FiltersPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} state={{ deals, setDeals, holes, setHoles, nine, setNine, ride, setRide }} />
        </div>
    );
};

/* ---------------------------------- stories ------------------------------- */

/** The Sagamore tee-time search experience — June 18. */
export const June18: Story = {
    render: () => (
        <div className="min-h-screen bg-primary py-10">
            <SearchBookingModule variant="june19" />
        </div>
    ),
};

/** June 19 — a Google-Flights-style chip-bar version: search pill bar with a Filters menu, dismissable filter chips, no big date selector or Best/Hot-deals tabs. */
export const June19: Story = {
    render: () => (
        <div className="min-h-screen bg-primary py-10">
            <June20Module />
        </div>
    ),
};
