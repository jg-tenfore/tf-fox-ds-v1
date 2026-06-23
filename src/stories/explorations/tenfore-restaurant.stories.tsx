import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useRef, useState } from "react";
import { Bell01, ChevronDown, Clock, Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { course } from "@/components/booking/sagamore-data";
import { cx } from "@/utils/cx";
import { clubBrandStyle, DropdownCell, MenuRow, SAGAMORE_CLUB, SiteFooter, TopNav } from "./tenfore-chrome";
import { StarRating } from "./store-ui";

/**
 * "Tenfore Fox / Restaurant" — a dinner-reservation experience for Sagamore's
 * dining room, using the June-19 hero header. Tonight's seatings (6:30–11 PM)
 * cycle Main Room / Bar like 18-holes/9-holes, and a gray "book another day"
 * panel offers the next 14 days as a synced day × time grid (days replace bays).
 */
const meta: Meta = {
    title: "Tenfore Fox/Restaurant",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ */
/* Time + date helpers                                                 */
/* ------------------------------------------------------------------ */

const fmtTime = (minutes: number): string => {
    const h24 = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h24 < 12 ? "AM" : "PM";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
};

// Dinner service: 6:30 PM → 11:00 PM in 30-min seatings.
const OPEN = 18 * 60 + 30;
const CLOSE = 23 * 60;
const SLOTS = Array.from({ length: (CLOSE - OPEN) / 30 + 1 }, (_, i) => OPEN + i * 30);

const TODAY = new Date(2026, 5, 23);
const addDays = (d: Date, n: number) => {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
};
const fmtDay = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const DAYS = Array.from({ length: 14 }, (_, i) => addDays(TODAY, i + 1));

type Seating = "Main Room" | "Bar";
const SEATING_OPTIONS = ["All Seating", "Main Room", "Bar"] as const;

// Tonight's seatings — a fixed mix of Main Room / Bar (a few already booked).
const TONIGHT: { seating: Seating; booked: boolean }[] = [
    { seating: "Main Room", booked: false },
    { seating: "Bar", booked: true },
    { seating: "Main Room", booked: false },
    { seating: "Main Room", booked: false },
    { seating: "Bar", booked: false },
    { seating: "Main Room", booked: true },
    { seating: "Bar", booked: false },
    { seating: "Main Room", booked: false },
    { seating: "Bar", booked: false },
    { seating: "Bar", booked: false },
];

// Deterministic availability for the day × time grid, driven by party size + seating:
// bigger parties exceed a slot's free capacity, and the Bar runs busier than the Main Room.
const dayBooked = (dayIndex: number, slotIndex: number, party: number, seating: string) => {
    const seatBias = seating === "Bar" ? 2 : seating === "Main Room" ? 0 : 1;
    const h = (dayIndex * 7 + slotIndex * 5 + seatBias * 11) % 12;
    const capacity = (h % 8) + 1; // 1–8 seats free at this slot
    return party > capacity || h < 4; // too big for the table, or an already-busy band
};

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

/** June-19 hero header, with the dining-room photo. */
const Hero = () => (
    <div className="flex flex-col items-center text-center">
        <div className="aspect-[16/6] w-full overflow-hidden rounded-2xl bg-secondary ring-1 ring-secondary ring-inset">
            <img src="sagamore-images/golf-club-dining-room.webp" alt={`${course.name} dining room`} className="size-full object-cover" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-primary">{course.name}</h1>
        <p className="mt-1 text-sm font-medium tracking-wide text-tertiary uppercase">The Dining Room</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-tertiary">
            <span className="font-medium text-primary tabular-nums">4.6</span>
            <StarRating rating={4.6} />
            <span>· 412 reviews</span>
        </div>
    </div>
);

/** A tonight seating card — time + party range + a seating banner. */
const TimeCard = ({ minutes, seating, booked }: { minutes: number; seating: Seating; booked: boolean }) => {
    if (booked) {
        return (
            <div className="flex flex-col overflow-hidden rounded-lg bg-secondary opacity-70 ring-1 ring-secondary ring-inset">
                <div className="flex flex-col gap-2 px-3.5 py-3">
                    <span className="text-lg font-semibold text-tertiary line-through">{fmtTime(minutes)}</span>
                    <span className="text-xs text-quaternary">Fully booked</span>
                </div>
                <div className="bg-tertiary px-3.5 py-1 text-xs font-semibold tracking-wide text-tertiary uppercase">{seating}</div>
            </div>
        );
    }
    return (
        <button
            type="button"
            className="group flex flex-col overflow-hidden rounded-lg bg-primary text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
            <div className="flex flex-col gap-2 px-3.5 py-3">
                <span className="text-lg font-semibold text-primary">{fmtTime(minutes)}</span>
                <div className="flex items-center gap-3 text-xs text-tertiary tabular-nums">
                    <span className="flex items-center gap-1">
                        <Users01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                        2–6
                    </span>
                    <span>Dinner</span>
                </div>
            </div>
            <div className="bg-primary-solid px-3.5 py-1 text-xs font-semibold tracking-wide text-white uppercase">{seating}</div>
        </button>
    );
};

/** Gray accordion panel — book another day. Days run down (next 14), times across, strips synced. */
const DayGrid = ({ party, seating, defaultOpen = true }: { party: number; seating: string; defaultOpen?: boolean }) => {
    const [open, setOpen] = useState(defaultOpen);
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
    const syncing = useRef(false);
    const onRowScroll = (i: number) => {
        if (syncing.current) return;
        syncing.current = true;
        const left = rowRefs.current[i]?.scrollLeft ?? 0;
        rowRefs.current.forEach((el, j) => {
            if (el && j !== i) el.scrollLeft = left;
        });
        requestAnimationFrame(() => {
            syncing.current = false;
        });
    };

    return (
        <div className="rounded-2xl bg-secondary p-6 ring-1 ring-secondary ring-inset sm:p-8">
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-start justify-between gap-4 text-left">
                <span className="flex flex-col">
                    <span className="text-lg font-semibold text-primary">Book another day</span>
                    <span className="mt-1 text-sm text-tertiary">
                        Next 14 days · {party} {party === 1 ? "guest" : "guests"} · {seating === "All Seating" ? "any seating" : seating}
                    </span>
                </span>
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-fg-quaternary ring-1 ring-secondary ring-inset">
                    <ChevronDown className={cx("size-5 transition-transform duration-200 ease-out", open && "rotate-180")} aria-hidden="true" />
                </span>
            </button>

            {/* Smooth expand/collapse via a 0fr→1fr grid row */}
            <div className={cx("grid transition-all duration-300 ease-out", open ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden">
                    <div className="flex flex-col gap-5">
                        {DAYS.map((day, dayIndex) => (
                            <section key={dayIndex}>
                                <h3 className="mb-2 text-sm font-semibold text-primary">{fmtDay(day)}</h3>
                                <div
                                    ref={(el) => {
                                        rowRefs.current[dayIndex] = el;
                                    }}
                                    onScroll={() => onRowScroll(dayIndex)}
                                    className="overflow-x-auto pb-2"
                                >
                                    <div className="flex w-max gap-2.5">
                                        {SLOTS.map((minutes, slotIndex) =>
                                            dayBooked(dayIndex, slotIndex, party, seating) ? (
                                                <div
                                                    key={minutes}
                                                    className="flex h-12 w-24 shrink-0 items-center justify-center rounded-lg bg-tertiary text-sm text-quaternary line-through ring-1 ring-secondary ring-inset"
                                                >
                                                    {fmtTime(minutes)}
                                                </div>
                                            ) : (
                                                <button
                                                    key={minutes}
                                                    type="button"
                                                    className="flex h-12 w-24 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-medium text-secondary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring"
                                                >
                                                    {fmtTime(minutes)}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

const RestaurantScreen = ({ variant }: { variant: "today" | "tomorrow" }) => {
    const [openCell, setOpenCell] = useState<null | "party" | "seating">(null);
    const [party, setParty] = useState(2);
    const [seating, setSeating] = useState<(typeof SEATING_OPTIONS)[number]>("All Seating");
    const close = () => setOpenCell(null);
    const toggle = (k: "party" | "seating") => setOpenCell((p) => (p === k ? null : k));

    // Bring the Sagamore mark into the sticky booking bar once the hero scrolls past.
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [stuck, setStuck] = useState(false);
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const tonight = SLOTS.map((minutes, i) => ({ minutes, ...TONIGHT[i] }));
    const visibleTonight = seating === "All Seating" ? tonight : tonight.filter((t) => t.seating === seating);

    return (
        <div className="flex min-h-dvh flex-col bg-primary" style={clubBrandStyle(SAGAMORE_CLUB.navColor)}>
            <TopNav active="Restaurant" club={SAGAMORE_CLUB} />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
                <Hero />

                {/* Sentinel — the sticky bar gains the Sagamore mark once scrolled past */}
                <div ref={sentinelRef} className="h-px" />

                {/* Party / Seating selector bar */}
                <div className="sticky top-0 z-30 mt-8 -mx-4 bg-primary/95 px-4 pt-2 pb-2 backdrop-blur-sm">
                    {stuck && (
                        <div className="mb-2.5 flex items-center justify-center gap-2.5">
                            <SagamoreLogo className="h-7 w-auto" />
                            <span className="text-sm font-semibold text-primary">{course.name}</span>
                        </div>
                    )}
                    <div className="flex flex-col divide-y divide-secondary rounded-xl bg-primary shadow-sm ring-1 ring-secondary sm:flex-row sm:divide-x sm:divide-y-0">
                        <DropdownCell label="Party size" value={`${party} ${party === 1 ? "guest" : "guests"}`} open={openCell === "party"} onToggle={() => toggle("party")} onClose={close} align="left" edge="left">
                            <div className="w-56">
                                <p className="mb-3 text-sm font-semibold text-primary">Party size</p>
                                <div className="flex flex-col gap-0.5">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                        <MenuRow key={n} selected={party === n} onClick={() => setParty(n)} label={`${n} ${n === 1 ? "guest" : "guests"}`} />
                                    ))}
                                </div>
                            </div>
                        </DropdownCell>
                        <DropdownCell label="Seating" value={seating} open={openCell === "seating"} onToggle={() => toggle("seating")} onClose={close} align="right" edge="right">
                            <div className="w-56">
                                <p className="mb-3 text-sm font-semibold text-primary">Seating</p>
                                <div className="flex flex-col gap-0.5">
                                    {SEATING_OPTIONS.map((s) => (
                                        <MenuRow key={s} selected={seating === s} onClick={() => setSeating(s)} label={s} />
                                    ))}
                                </div>
                            </div>
                        </DropdownCell>
                    </div>
                </div>

                {variant === "today" ? (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-primary">
                            Tonight · <span className="text-tertiary">{fmtDay(TODAY)}</span>
                        </h2>
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {visibleTonight.map((t) => (
                                <TimeCard key={`${t.minutes}-${t.seating}`} minutes={t.minutes} seating={t.seating} booked={t.booked} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col items-center rounded-2xl bg-secondary p-8 text-center ring-1 ring-secondary ring-inset">
                        <FeaturedIcon icon={Clock} size="lg" color="gray" theme="modern" />
                        <h2 className="mt-4 text-lg font-semibold text-primary">No reservations available today</h2>
                        <p className="mt-2 max-w-md text-sm text-tertiary">
                            There are no available times to book this restaurant until 6 AM tomorrow. Turn on notifications and we'll let you know the moment seatings open.
                        </p>
                        <Button color="primary" size="lg" iconLeading={Bell01} className="mt-5">
                            Get notifications
                        </Button>
                    </div>
                )}

                {/* Gray panel — book a later day */}
                <div className="pt-6">
                    <DayGrid party={party} seating={seating} defaultOpen={variant !== "today"} />
                </div>
            </main>
            <SiteFooter club={SAGAMORE_CLUB} />
        </div>
    );
};

export const Today: Story = {
    name: "Today",
    render: () => <RestaurantScreen variant="today" />,
};

export const Tomorrow: Story = {
    name: "Tomorrow",
    render: () => <RestaurantScreen variant="tomorrow" />,
};
