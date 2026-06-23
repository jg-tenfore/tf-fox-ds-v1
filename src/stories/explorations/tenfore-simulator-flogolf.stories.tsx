import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AlertTriangle, Check, Flag01, InfoCircle, Lock01, Monitor01, Star01, Users01 } from "@untitledui/icons";
import { Alert } from "@/components/application/alerts/alert";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { clubBrandStyle, DropdownCell, FLOGOLF_BAYS, FLOGOLF_CLUB, MenuRow, SiteFooter, TopNav } from "./tenfore-chrome";
import { CalendarPanel, DEFAULT_DATE, fmtNice } from "./tee-search-popovers";

/**
 * "Tenfore Fox / Simulator (FloGolf)" — FloGolf Lounge is an indoor simulator
 * venue. Its ten bays run down a fixed left rail; each bay's whole day (10 AM →
 * close, 30-min slots) is a horizontal strip, all sharing one scroll container
 * so they stay in sync. You build a session by tapping a start time then an end
 * time — slots in between fill in, with a preview that flags windows crossing a
 * booked slot and a toast + auto-trim if you commit one anyway. Groups of 7+
 * must book two bays for the same window.
 */
const meta: Meta = {
    title: "Tenfore Fox/Tee Times/FloGolf Indoor",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ */
/* Time + pricing helpers                                              */
/* ------------------------------------------------------------------ */

const pad = (n: number) => n.toString().padStart(2, "0");

const fmtTime = (minutes: number): string => {
    const h24 = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h24 < 12 ? "AM" : "PM";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${pad(m)} ${period}`;
};

// 10:00 AM → 10:00 PM in 30-minute steps.
const OPEN = 10 * 60;
const CLOSE = 22 * 60;
const SLOTS = Array.from({ length: (CLOSE - OPEN) / 30 + 1 }, (_, i) => OPEN + i * 30);
const slotIndexOf = (minutes: number) => (minutes - OPEN) / 30;

// Per-30-min rate tiers: $20 (10 AM–1 PM), $27.50 (1–5 PM), $40 (5 PM onward).
const halfHourRate = (minutes: number) => (minutes >= 17 * 60 ? 40 : minutes >= 13 * 60 ? 27.5 : 20);

// Deterministic booked blocks per bay — varied lengths (1 hr, 1.5 hr, 2 hr) plus a full-day bay,
// so the sheet shows realistic bigger windows that are already taken. Each entry is [startSlot, lengthSlots].
const BOOKED_BLOCKS: (number[][] | "all")[] = [
    [[3, 2]], // 1 hr
    [[8, 3]], // 1.5 hr
    [[0, 2], [15, 3]], // 1 hr + 1.5 hr
    [[11, 2]], // 1 hr
    "all", // full day
    [[6, 4]], // 2 hr
    [[18, 3]], // 1.5 hr (evening)
    [[2, 2], [12, 2]], // two 1 hr
    [[20, 4]], // 2 hr (evening)
    [[9, 3]], // 1.5 hr
];

const isBooked = (bayIndex: number, minutes: number) => {
    const blocks = BOOKED_BLOCKS[bayIndex];
    if (blocks === "all") return true;
    if (!blocks) return false;
    const si = slotIndexOf(minutes);
    return blocks.some((b) => si >= b[0] && si < b[0] + b[1]);
};

// The dropdown caps at a "7+" option; 7 or more players need two bays.
const MAX_PLAYERS = 7;
const baysNeeded = (players: number) => (players >= MAX_PLAYERS ? 2 : 1);
const playersValue = (p: number) => (p >= MAX_PLAYERS ? "7+ Players" : `${p} ${p === 1 ? "Player" : "Players"}`);
const playersOption = (p: number) => (p >= MAX_PLAYERS ? "7+ players" : `${p} ${p === 1 ? "player" : "players"}`);

const conflictsIn = (bayIndex: number, lo: number, hi: number) => SLOTS.filter((m) => m >= lo && m <= hi && isBooked(bayIndex, m));
const listTimes = (mins: number[]) => `${mins.map(fmtTime).join(" and ")} ${mins.length > 1 ? "are" : "is"}`;

/* ------------------------------------------------------------------ */
/* Bay info (identical for every bay)                                  */
/* ------------------------------------------------------------------ */

// Tech is shared across bays; seating, party fit, upscale extras and the server vary.
const SIM_PERKS = [
    { icon: Monitor01, text: "TrackMan 4 launch monitor · live shot tracer" },
    { icon: Flag01, text: "200+ world courses, driving range & on-screen games" },
];

interface BayProfile {
    /** Seating headline shown as the bay subheadline. */
    seating: string;
    /** Capacity phrasing. */
    seats: string;
    /** Max party size a single bay can seat. */
    capacity: number;
    /** Who the bay suits best. */
    idealFor: string;
    /** A couple of sophisticated lounge / bar touches unique to the bay. */
    extras: string[];
    /** Tonight's server. */
    server: string;
}

const BAYS: BayProfile[] = [
    { seating: "4-person leather couch", seats: "Seats 4", capacity: 4, idealFor: "groups of four", extras: ["Shared cocktail table", "Craft beer & cocktail menu"], server: "Olivia Rhye" },
    { seating: "Two swivel lounge chairs", seats: "Seats 2", capacity: 2, idealFor: "date night", extras: ["Marble side tables", "Curated wine list"], server: "Marcus Lee" },
    { seating: "6-seat sectional", seats: "Seats 6", capacity: 6, idealFor: "bigger groups", extras: ["Oversized coffee table", "Shareable small plates"], server: "Priya Patel" },
    { seating: "High-top bar table for 4", seats: "4 bar stools", capacity: 4, idealFor: "a casual foursome", extras: ["Bar-rail seating", "Local draft rotation"], server: "Jordan Diaz" },
    { seating: "Standing bar — no seats", seats: "Standing, up to 8", capacity: 8, idealFor: "mingling & parties", extras: ["Lean rail with drink ledges", "Bottle service available"], server: "Sofia Romano" },
    { seating: "VIP curved banquette", seats: "Seats 5", capacity: 5, idealFor: "special occasions", extras: ["Dedicated bottle service", "Private booth lighting"], server: "Liam Walsh" },
    { seating: "Two club chairs + ottoman", seats: "Seats 2–3", capacity: 3, idealFor: "a relaxed pair", extras: ["Leather club seating", "Top-shelf spirits"], server: "Amara Okafor" },
    { seating: "Communal high-top", seats: "Seats 6", capacity: 6, idealFor: "social groups", extras: ["Family-style sharing board", "Rotating cocktail specials"], server: "Diego Santos" },
    { seating: "Chesterfield sofa", seats: "Seats 4", capacity: 4, idealFor: "a refined lounge", extras: ["Cigar-style lounge access", "Reserve whiskey selection"], server: "Hannah Kim" },
    { seating: "Private suite — sofa + 2 chairs", seats: "Seats 6", capacity: 6, idealFor: "private events", extras: ["Private room with a door", "Dedicated bartender & server"], server: "Noah Bennett" },
];

const initialsOf = (name: string) =>
    name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

// Each bay seats a limited party; for 7+ (two bays) the party splits across them.
const requiredPerBay = (players: number) => (players >= MAX_PLAYERS ? Math.ceil(players / 2) : players);
const bayDisabledFor = (bayIndex: number, players: number) => BAYS[bayIndex].capacity < requiredPerBay(players);

const BayInfo = ({ bay, profile, open, onToggle, onClose }: { bay: string; profile: BayProfile; open: boolean; onToggle: () => void; onClose: () => void }) => (
    <div className="relative">
        <button
            type="button"
            onClick={onToggle}
            aria-label={`${bay} details`}
            className="flex size-5 items-center justify-center rounded-full text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary"
        >
            <InfoCircle className="size-4" aria-hidden="true" />
        </button>
        {open && (
            <>
                {/* Click-away backdrop */}
                <button type="button" aria-hidden tabIndex={-1} onClick={onClose} className="fixed inset-0 z-40 cursor-default" />
                {/* Black tooltip, led by the bay it describes */}
                <div role="tooltip" className="absolute top-full left-0 z-50 mt-2 w-72 rounded-xl bg-primary-solid p-4 text-left shadow-lg ring-1 ring-white/10">
                    <div className="absolute -top-1 left-4 size-2 rotate-45 bg-primary-solid" />
                    <p className="text-sm font-semibold text-white">{bay}</p>
                    <p className="mt-0.5 text-xs text-white/60">{profile.seating}</p>
                    <ul className="mt-3 flex flex-col gap-2.5">
                        {SIM_PERKS.map((perk) => (
                            <li key={perk.text} className="flex items-start gap-2.5">
                                <perk.icon className="mt-0.5 size-4 shrink-0 text-white/50" aria-hidden="true" />
                                <span className="text-xs text-white/80">{perk.text}</span>
                            </li>
                        ))}
                        <li className="flex items-start gap-2.5">
                            <Users01 className="mt-0.5 size-4 shrink-0 text-white/50" aria-hidden="true" />
                            <span className="text-xs text-white/80">
                                {profile.seats} · ideal for {profile.idealFor}
                            </span>
                        </li>
                        {profile.extras.map((extra) => (
                            <li key={extra} className="flex items-start gap-2.5">
                                <Star01 className="mt-0.5 size-4 shrink-0 text-white/50" aria-hidden="true" />
                                <span className="text-xs text-white/80">{extra}</span>
                            </li>
                        ))}
                    </ul>
                    {/* Tonight's server */}
                    <div className="mt-3 flex items-center gap-2.5 border-t border-white/10 pt-3">
                        <Avatar size="xs" initials={initialsOf(profile.server)} />
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-white">{profile.server}</span>
                            <span className="text-xs text-white/55">Your server tonight</span>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-white/70">
                        From <span className="font-semibold text-white">$20.00</span> / 30 min
                    </p>
                </div>
            </>
        )}
    </div>
);

/* ------------------------------------------------------------------ */
/* Slot card                                                           */
/* ------------------------------------------------------------------ */

type SlotState = "open" | "selected" | "booked" | "preview" | "preview-invalid";

const CARD = "flex h-14 w-28 shrink-0 flex-col justify-center gap-1 rounded-lg px-3 text-left transition duration-100 ease-linear";

const SlotCard = ({ minutes, state, navColor, onClick, onHover }: { minutes: number; state: SlotState; navColor: string; onClick: () => void; onHover: () => void }) => {
    const time = fmtTime(minutes);
    const price = `$${halfHourRate(minutes).toFixed(2)}`;

    if (state === "booked") {
        return (
            <div onMouseEnter={onHover} className={cx(CARD, "cursor-not-allowed bg-quaternary ring-1 ring-secondary ring-inset")}>
                <span className="text-sm font-medium text-tertiary tabular-nums line-through">{time}</span>
                <span className="flex items-center gap-1 text-xs font-medium text-tertiary">
                    <Lock01 className="size-3" aria-hidden="true" /> Booked
                </span>
            </div>
        );
    }
    if (state === "selected") {
        return (
            <button type="button" onClick={onClick} onMouseEnter={onHover} style={{ backgroundColor: navColor }} className={cx(CARD, "text-white")}>
                <span className="text-sm font-semibold tabular-nums">{time}</span>
                <span className="flex items-center gap-1 text-xs">
                    <Check className="size-3.5" aria-hidden="true" /> Selected
                </span>
            </button>
        );
    }
    if (state === "preview") {
        return (
            <button type="button" onClick={onClick} onMouseEnter={onHover} style={{ boxShadow: `inset 0 0 0 2px ${navColor}` }} className={cx(CARD, "bg-primary")}>
                <span className="text-sm font-semibold text-primary tabular-nums">{time}</span>
                <span className="text-xs font-semibold text-secondary tabular-nums">{price}</span>
            </button>
        );
    }
    if (state === "preview-invalid") {
        return (
            <button type="button" onClick={onClick} onMouseEnter={onHover} className={cx(CARD, "bg-error-primary ring-1 ring-error ring-inset")}>
                <span className="text-sm font-semibold text-error-primary tabular-nums">{time}</span>
                <span className="text-xs text-error-primary">Unavailable</span>
            </button>
        );
    }
    return (
        <button
            type="button"
            onClick={onClick}
            onMouseEnter={onHover}
            style={{ ["--nav"]: navColor } as CSSProperties}
            className={cx(CARD, "bg-primary ring-1 ring-secondary ring-inset hover:ring-[var(--nav)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring")}
        >
            <span className="text-sm font-semibold text-primary tabular-nums">{time}</span>
            <span className="text-xs font-semibold text-secondary tabular-nums">{price}</span>
        </button>
    );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

const navColor = FLOGOLF_CLUB.navColor ?? "#143620";

const SimulatorScreen = () => {
    const [openCell, setOpenCell] = useState<null | "date" | "time" | "players">(null);
    const [openInfo, setOpenInfo] = useState<number | null>(null);
    const [selected, setSelected] = useState<Date>(DEFAULT_DATE);
    const [rateType, setRateType] = useState<"weekday" | "weekend">("weekday");
    const [players, setPlayers] = useState(1);
    const [startTime, setStartTime] = useState(OPEN);
    const close = () => setOpenCell(null);
    const toggle = (k: "date" | "time" | "players") => setOpenCell((p) => (p === k ? null : k));

    // Bring the FloGolf mark into the sticky booking widget once scrolled to the top.
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [stuck, setStuck] = useState(false);
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Error toast (top-center), auto-dismissing.
    const [toast, setToast] = useState<string | null>(null);
    const [toastKey, setToastKey] = useState(0);
    const showToast = (message: string) => {
        setToast(message);
        setToastKey((k) => k + 1);
    };
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(t);
    }, [toast, toastKey]);

    // Session selection: a contiguous time range across the required number of bays.
    const [range, setRange] = useState<{ start: number; end: number } | null>(null);
    const [anchor, setAnchor] = useState<number | null>(null);
    const [bays, setBays] = useState<number[]>([]);
    const [hover, setHover] = useState<{ bay: number; minutes: number } | null>(null);
    const reset = () => {
        setRange(null);
        setAnchor(null);
        setBays([]);
    };

    // Each bay strip scrolls on its own; mirror scrollLeft across all so they stay in sync.
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

    const requiredBays = baysNeeded(players);

    const clickCell = (bayIndex: number, minutes: number) => {
        // Building the range (first then second tap).
        if (range === null) {
            if (anchor === null || bayIndex !== bays[0]) {
                setAnchor(minutes);
                setBays([bayIndex]);
                return;
            }
            const lo = Math.min(anchor, minutes);
            const hi = Math.max(anchor, minutes);
            const conflicts = conflictsIn(bayIndex, lo, hi);
            if (conflicts.length === 0) {
                setRange({ start: lo, end: hi });
                setAnchor(null);
                return;
            }
            // Auto-trim: keep the free block from the anchor toward the tap.
            const dir = minutes >= anchor ? 30 : -30;
            let end = anchor;
            for (let m = anchor + dir; m >= lo && m <= hi; m += dir) {
                if (isBooked(bayIndex, m)) break;
                end = m;
            }
            const ts = Math.min(anchor, end);
            const te = Math.max(anchor, end);
            setRange({ start: ts, end: te });
            setAnchor(null);
            showToast(`${listTimes(conflicts)} already booked. We trimmed your session to ${fmtTime(ts)}–${fmtTime(te)}.`);
            return;
        }
        // Range set — add another bay (7+) if its window is free; otherwise toast.
        if (!bays.includes(bayIndex) && bays.length < requiredBays) {
            const conflicts = conflictsIn(bayIndex, range.start, range.end);
            if (conflicts.length > 0) {
                showToast(`${listTimes(conflicts)} already booked in ${FLOGOLF_BAYS[bayIndex]}. Pick another bay.`);
                return;
            }
            setBays([...bays, bayIndex]);
            return;
        }
        // Complete or re-tapping — start a fresh selection.
        setRange(null);
        setAnchor(minutes);
        setBays([bayIndex]);
    };

    const cellState = (bayIndex: number, minutes: number): SlotState => {
        if (isBooked(bayIndex, minutes)) return "booked";
        // Committed selection.
        if (bays.includes(bayIndex)) {
            if (range) {
                if (minutes >= range.start && minutes <= range.end) return "selected";
            } else if (anchor !== null && minutes === anchor) {
                return "selected";
            }
        }
        // Live preview while choosing the end in the anchor bay.
        if (range === null && anchor !== null && bayIndex === bays[0] && hover?.bay === bayIndex) {
            const lo = Math.min(anchor, hover.minutes);
            const hi = Math.max(anchor, hover.minutes);
            if (minutes >= lo && minutes <= hi) return conflictsIn(bayIndex, lo, hi).length ? "preview-invalid" : "preview";
        }
        // Preview the fixed window when hovering a candidate second bay (7+).
        if (range && bays.length < requiredBays && !bays.includes(bayIndex) && hover?.bay === bayIndex) {
            if (minutes >= range.start && minutes <= range.end) return conflictsIn(bayIndex, range.start, range.end).length ? "preview-invalid" : "preview";
        }
        return "open";
    };

    // Visible window + pricing for the current selection.
    const visibleSlots = SLOTS.filter((m) => m >= startTime);
    const rangeSlots = range ? SLOTS.filter((m) => m >= range.start && m <= range.end) : [];
    const total = rangeSlots.reduce((sum, m) => sum + halfHourRate(m), 0) * bays.length;
    const complete = range !== null && bays.length >= requiredBays;

    return (
        <div className="flex min-h-dvh flex-col bg-secondary" style={clubBrandStyle(navColor)}>
            <TopNav active="Tee Times" club={FLOGOLF_CLUB} />

            {/* Error toast — top center */}
            {toast && (
                <div role="alert" aria-live="assertive" className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
                    <div key={toastKey} className="pointer-events-auto w-full max-w-md">
                        <Alert color="error" icon={AlertTriangle} title="Slot unavailable" description={toast} onClose={() => setToast(null)} />
                    </div>
                </div>
            )}

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 pt-10 pb-20">
                <div className="mb-6">
                    <h1 className="text-display-xs font-semibold text-primary">Book a simulator bay</h1>
                    <p className="mt-1.5 text-md text-tertiary">Indoor simulators · 200+ courses · full bar &amp; food · open 10 AM–10 PM</p>
                </div>

                {/* Sentinel — when it scrolls out of view, the sticky widget gains the FloGolf mark */}
                <div ref={sentinelRef} className="h-px" />

                {/* Date / Time / Players selector bar */}
                <div className="sticky top-0 z-30 mb-6 -mx-6 bg-secondary/95 px-6 pt-2 pb-2 backdrop-blur-sm">
                    {stuck && (
                        <div className="mb-2.5 flex items-center justify-center gap-2.5">
                            <FLOGOLF_CLUB.Logo className="h-7 w-auto" />
                            <span className="text-sm font-semibold text-primary">{FLOGOLF_CLUB.name}</span>
                        </div>
                    )}
                    <div className="flex flex-col divide-y divide-secondary rounded-xl bg-primary shadow-lg ring-1 ring-secondary sm:flex-row sm:divide-x sm:divide-y-0">
                        <DropdownCell label="Date" value={fmtNice(selected)} open={openCell === "date"} onToggle={() => toggle("date")} onClose={close} align="left" edge="left">
                            <CalendarPanel selected={selected} onSelect={setSelected} rateType={rateType} onRateType={setRateType} onDone={close} showPrices={false} />
                        </DropdownCell>
                        <DropdownCell label="Time" value={fmtTime(startTime)} open={openCell === "time"} onToggle={() => toggle("time")} onClose={close} align="center">
                            <div className="w-56">
                                <p className="mb-3 text-sm font-semibold text-primary">Start time</p>
                                <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto pr-1">
                                    {SLOTS.map((m) => (
                                        <MenuRow
                                            key={m}
                                            selected={startTime === m}
                                            onClick={() => setStartTime(m)}
                                            label={fmtTime(m)}
                                            right={<span className="font-normal text-tertiary tabular-nums">${halfHourRate(m).toFixed(2)}</span>}
                                        />
                                    ))}
                                </div>
                            </div>
                        </DropdownCell>
                        <DropdownCell label="Players" value={playersValue(players)} open={openCell === "players"} onToggle={() => toggle("players")} onClose={close} align="right" edge="right">
                            <div className="w-56">
                                <p className="mb-3 text-sm font-semibold text-primary">Players</p>
                                <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto pr-1">
                                    {Array.from({ length: MAX_PLAYERS }, (_, i) => i + 1).map((n) => (
                                        <MenuRow
                                            key={n}
                                            selected={players === n}
                                            onClick={() => {
                                                setPlayers(n);
                                                setBays((b) => b.filter((i) => !bayDisabledFor(i, n)).slice(0, baysNeeded(n)));
                                            }}
                                            label={playersOption(n)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </DropdownCell>
                    </div>
                </div>

                {/* Selection status */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3 ring-1 ring-secondary ring-inset">
                    <div className="text-sm">
                        {complete ? (
                            <span className="flex items-center gap-2 text-secondary">
                                <Check className="size-4 text-fg-success-primary" aria-hidden="true" />
                                {fmtTime(range!.start)}–{fmtTime(range!.end)} · {bays.map((b) => FLOGOLF_BAYS[b]).join(" + ")} ·{" "}
                                <span className="font-semibold text-primary tabular-nums">${total.toFixed(2)}</span>
                            </span>
                        ) : range ? (
                            <span className="font-medium text-warning-primary">
                                7+ players require {requiredBays} bays — tap any slot in a second bay to add it.
                            </span>
                        ) : anchor !== null ? (
                            <span className="text-secondary">Start {fmtTime(anchor)} — now tap an end time to set your session.</span>
                        ) : (
                            <span className="text-tertiary">
                                Tap a start time, then an end time to select your session
                                {requiredBays === 2 ? " — across two bays (7+ players)." : "."}
                            </span>
                        )}
                    </div>
                    {(range || anchor !== null) && (
                        <Button size="sm" color="link-gray" onClick={reset}>
                            Clear
                        </Button>
                    )}
                </div>

                {/* Each bay: title + subheadline stacked over its time strip. The strips
                    scroll independently but mirror each other so they stay in sync. */}
                <div className="flex flex-col gap-7" onMouseLeave={() => setHover(null)}>
                    {FLOGOLF_BAYS.map((bay, bayIndex) => {
                        const profile = BAYS[bayIndex];
                        const bayOff = bayDisabledFor(bayIndex, players);
                        return (
                            <section key={bay}>
                                <div className="flex items-center gap-1.5">
                                    <h2 className="text-sm font-semibold text-primary">{bay}</h2>
                                    <BayInfo
                                        bay={bay}
                                        profile={profile}
                                        open={openInfo === bayIndex}
                                        onToggle={() => setOpenInfo((o) => (o === bayIndex ? null : bayIndex))}
                                        onClose={() => setOpenInfo(null)}
                                    />
                                </div>
                                <p className="mt-0.5 mb-2.5 text-xs text-tertiary">
                                    {profile.seating}
                                    {bayOff && <span className="ml-1.5 font-medium text-warning-primary">· too small for {players} players</span>}
                                </p>
                                <div
                                    ref={(el) => {
                                        rowRefs.current[bayIndex] = el;
                                    }}
                                    onScroll={() => onRowScroll(bayIndex)}
                                    className={cx("overflow-x-auto pb-2", bayOff && "pointer-events-none opacity-40")}
                                >
                                    <div className="flex w-max gap-3">
                                        {visibleSlots.map((minutes) => (
                                            <SlotCard
                                                key={minutes}
                                                minutes={minutes}
                                                navColor={navColor}
                                                state={cellState(bayIndex, minutes)}
                                                onClick={() => clickCell(bayIndex, minutes)}
                                                onHover={() => setHover({ bay: bayIndex, minutes })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>

            <SiteFooter club={FLOGOLF_CLUB} />
        </div>
    );
};

export const Default: Story = {
    name: "FloGolf Indoor",
    render: () => <SimulatorScreen />,
};
