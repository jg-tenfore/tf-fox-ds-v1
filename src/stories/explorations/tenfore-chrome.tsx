import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Check, ChevronDown, Flag01, Mail01, MarkerPin01, Phone, ShoppingCart01, User01, Users01 } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { KettleHillsLogo } from "@/components/foundations/kettle-hills/kettle-hills-logo";
import { FlogolfLogo } from "@/components/foundations/flogolf/flogolf-logo";
import { course, formatPrice, generateTeeTimes, type TeeTime } from "@/components/booking/sagamore-data";
import { cx } from "@/utils/cx";
import { CalendarPanel, CellDropdown, COURSES, DEFAULT_DATE, dayType, fmtNice } from "./tee-search-popovers";

/* ------------------------------------------------------------------ */
/* Shared chrome for the Tenfore Fox screens                           */
/*                                                                     */
/* The Tee Times, Checkout, and Confirmation screens each live in      */
/* their own story file (so they show as separate components in the    */
/* "Tenfore Fox" category). The pieces they all share — the top nav,   */
/* footer, dropdown cell, player avatar — live here.                   */
/* ------------------------------------------------------------------ */

/** A club identity used to skin the nav + footer for a given course. */
export interface Club {
    name: string;
    city: string;
    phone: string;
    addressLine: string;
    email: string;
    /** The club's logo mark, rendered in the nav + sticky bar. */
    Logo: React.ComponentType<{ className?: string }>;
    /** Brand nav background. Omit to use the default black (bg-primary-solid). */
    navColor?: string;
}

export const SAGAMORE_CLUB: Club = {
    name: course.name,
    city: course.city,
    phone: course.phone,
    addressLine: `1287 Main Street ${course.city} 01940`,
    email: "tdoucette@sagamoregolf.com",
    Logo: SagamoreLogo,
    // Black nav → black brand accents (radios, card hover, buttons). Uses the token so it stays dark-mode aware.
    navColor: "var(--color-bg-primary-solid)",
};

export const KETTLE_HILLS_CLUB: Club = {
    name: "Kettle Hills Golf Course",
    city: "Richfield, WI",
    phone: "(262) 628-4200",
    addressLine: "W236 N9430 WI-164, Richfield, WI 53076",
    email: "info@kettlehills.com",
    Logo: KettleHillsLogo,
    navColor: "#0E319E",
};

/**
 * A nine-hole option on a tee sheet. `option` is the dropdown label golfers pick;
 * `banner` is the short tag shown on each tee card.
 */
export interface Nine {
    option: string;
    banner: string;
    /** Earliest tee time (minutes since midnight) this nine can be booked. Omit = all day. */
    availableFrom?: number;
}

/** Sagamore plays a single 18, bookable as either nine. The front 9 only opens
 *  for standalone play after 5 PM (mornings would jam 18-hole groups at the turn). */
export const SAGAMORE_NINES: Nine[] = [
    { option: "9 Holes (Back)", banner: "Back 9" },
    { option: "9 Holes (Front)", banner: "Front 9", availableFrom: 17 * 60 },
];

/** Kettle Hills' three nine-hole courses. */
export const KETTLE_HILLS_NINES: Nine[] = [
    { option: "9 Holes (Ponds)", banner: "Ponds" },
    { option: "9 Holes (Front Valley)", banner: "Front Valley" },
    { option: "9 Holes (Rolling)", banner: "Rolling" },
];

export const FLOGOLF_CLUB: Club = {
    name: "FloGolf Lounge",
    city: "Saugus, MA",
    phone: "(781) 477-0444",
    addressLine: "Saugus, MA 01906",
    email: "hello@flogolflounge.com",
    Logo: FlogolfLogo,
    navColor: "#143620",
};

/** FloGolf is an indoor simulator lounge — you book one of its ten simulator bays. */
export const FLOGOLF_BAYS = Array.from({ length: 10 }, (_, i) => `Bay ${i + 1}`);

const NAV_ITEMS = ["Tee Times", "Shop", "Events", "Calendar", "Clinics", "Restaurant"] as const;

export const TopNav = ({ active = "Tee Times", club = SAGAMORE_CLUB }: { active?: (typeof NAV_ITEMS)[number]; club?: Club }) => (
    <header
        className={cx("w-full border-b border-white/10 text-white", !club.navColor && "bg-primary-solid")}
        style={club.navColor ? { backgroundColor: club.navColor } : undefined}
    >
        {/* Utility bar */}
        <div className="flex items-center justify-between gap-4 px-6 pt-4 pb-3 text-xs text-white/70">
            <div className="flex items-center gap-3">
                <span>{club.name}</span>
                <span className="text-white/40">·</span>
                <span className="flex items-center gap-1">
                    <MarkerPin01 className="size-3.5 text-white/50" aria-hidden="true" />
                    {club.city}
                    <ChevronDown className="size-3.5 text-white/50" aria-hidden="true" />
                </span>
            </div>
            <div className="flex items-center gap-4">
                <button type="button" className="flex items-center gap-1.5 text-white/70 transition duration-100 ease-linear hover:text-white">
                    <User01 className="size-3.5" aria-hidden="true" />
                    Sign in
                </button>
                <span className="flex items-center gap-1.5 text-white">
                    <ShoppingCart01 className="size-3.5 text-white/50" aria-hidden="true" />
                    $0.00
                </span>
            </div>
        </div>

        {/* Brand + primary nav */}
        <div className="flex items-center justify-between gap-6 px-6 pt-5 pb-6">
            <div className="flex items-center gap-3">
                <club.Logo className="h-11 w-auto" />
                <span className="text-lg font-semibold text-white">{club.name}</span>
            </div>
            <nav className="flex items-center gap-7 text-sm font-medium">
                {NAV_ITEMS.map((item) => (
                    <a
                        key={item}
                        href="#"
                        className={
                            item === active
                                ? "border-b-2 border-white pb-1 text-white"
                                : "pb-1 text-white/60 transition duration-100 ease-linear hover:text-white"
                        }
                    >
                        {item}
                    </a>
                ))}
            </nav>
        </div>
    </header>
);

export const SiteFooter = ({ club = SAGAMORE_CLUB }: { club?: Club }) => (
    <footer className="bg-primary-solid px-8 py-10 text-sm text-white/80">
        <p className="text-md font-semibold text-white">{club.name}</p>
        <p className="mt-2">{club.addressLine}</p>
        <p className="mt-1 flex items-center gap-1.5">
            <Phone className="size-3.5 text-white/50" aria-hidden="true" />
            {club.phone}
        </p>
        <p className="mt-1 flex items-center gap-1.5">
            <Mail01 className="size-3.5 text-white/50" aria-hidden="true" />
            <span className="underline">{club.email}</span>
        </p>
    </footer>
);

/**
 * A clickable cell in the COURSE / DATE / PLAYERS bar. Keeps the original
 * info-cell styling (uppercase label + value) but opens a June-19-style
 * dropdown popover when tapped.
 */
export const DropdownCell = ({
    label,
    value,
    open,
    onToggle,
    onClose,
    align = "left",
    edge,
    children,
}: {
    label: string;
    value: string;
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    align?: "left" | "center" | "right";
    edge?: "left" | "right";
    children: React.ReactNode;
}) => (
    <div className="relative flex-1">
        <button
            type="button"
            onClick={onToggle}
            className={cx(
                "flex h-full w-full items-center justify-between gap-2 px-5 py-4 text-left transition duration-100 ease-linear",
                // Round the outer corners so the hover/open fill matches the bar's rounded edges.
                edge === "left" && "rounded-t-xl sm:rounded-t-none sm:rounded-l-xl",
                edge === "right" && "rounded-b-xl sm:rounded-b-none sm:rounded-r-xl",
                open ? "bg-secondary_hover" : "hover:bg-secondary_hover",
            )}
        >
            <span className="flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">{label}</span>
                <span className="text-sm text-secondary">{value}</span>
            </span>
            <ChevronDown className={cx("size-4 shrink-0 text-fg-quaternary transition duration-100 ease-linear", open && "rotate-180")} />
        </button>
        <CellDropdown open={open} onClose={onClose} align={align}>
            {children}
        </CellDropdown>
    </div>
);

/** The player avatar — initials (or a placeholder) on a tile with the player-number badge. */
export const PlayerAvatar = ({ number, initials }: { number: number; initials?: string }) => (
    <div className="relative shrink-0">
        {initials ? <Avatar size="md" initials={initials} /> : <Avatar size="md" placeholderIcon={User01} />}
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary-solid text-[10px] font-semibold text-white ring-2 ring-secondary">
            {number}
        </span>
    </div>
);

/**
 * A single tee-sheet cell, matching the reference: large time, a holes/players
 * meta row, the per-player price + day type, and an optional footer banner that
 * names which nine the round plays (e.g. "Back 9" / "Ponds"). The banner takes
 * the club's nav color so each course's tee sheet stays on-brand.
 */
export const TeeCell = ({
    slot,
    dayLabel = "Weekday",
    holesOverride,
    nineLabel,
    nineColor,
    holesWord,
}: {
    slot: TeeTime;
    dayLabel?: string;
    holesOverride?: number;
    /** When set, the cell shows this nine's name in a brand-colored footer banner. */
    nineLabel?: string;
    /** Banner background (the club nav color). Omit for the default black. */
    nineColor?: string;
    /** Render the holes meta as "N holes" rather than the bare number. */
    holesWord?: boolean;
}) => {
    const holes = holesOverride ?? (slot.timeOfDay === "twilight" ? 9 : 18);
    // Reference shows a player range — full slots play 1, otherwise up to 4.
    const playerRange = slot.spotsAvailable <= 1 ? "1" : "1-4";

    return (
        <button
            type="button"
            className="group flex flex-col overflow-hidden rounded-lg bg-primary text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
            <div className="flex flex-col gap-2 px-3.5 py-3">
                <span className="text-lg font-semibold text-primary">{slot.label}</span>
                <div className="flex items-center gap-3 text-xs text-tertiary tabular-nums">
                    <span className="flex items-center gap-1">
                        <Flag01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                        {holesWord ? `${holes} holes` : holes}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                        {playerRange}
                    </span>
                </div>
                <p className="text-xs text-tertiary">
                    <span className="font-semibold text-secondary tabular-nums">{formatPrice(slot.price)}.00</span> {dayLabel}
                </p>
            </div>
            {nineLabel && (
                <div
                    className={cx("px-3.5 py-1 text-xs font-semibold tracking-wide text-white uppercase", !nineColor && "bg-primary-solid")}
                    style={nineColor ? { backgroundColor: nineColor } : undefined}
                >
                    {nineLabel}
                </div>
            )}
        </button>
    );
};

/**
 * The Sagamore tee-sheet — a faithful recreation of Tenfore's tee-times screen.
 * Parameterized so it can be re-skinned for a second club (e.g. Kettle Hills) and
 * a fixed hole count.
 */
/** Shows the full mixed board — 18-hole rounds plus every nine. First/default option. */
const ALL_OPTION = "All Courses";
/** The "play all 18" filter — 18-hole rounds only. */
const EIGHTEEN_OPTION = "18 Holes";

/**
 * Per-club brand override — re-skins every brand-derived token to the club's nav color
 * (radios, card hover ring, calendar rates, dropdown checks, buttons). We override the
 * namespace vars the utilities read DIRECTLY (--text-color-*, --color-fg-*, --ring-color-*,
 * etc.) because chained theme vars compute at :root and don't cascade from the base ramp.
 */
export const clubBrandStyle = (navColor?: string): CSSProperties | undefined =>
    navColor
        ? ({
              "--color-brand-500": navColor,
              "--color-brand-600": navColor,
              "--color-brand-700": navColor,
              "--color-border-brand": navColor,
              "--color-bg-brand-solid": navColor,
              "--background-color-brand-solid": navColor,
              "--ring-color-brand": navColor,
              "--ring-color-brand-solid": navColor,
              "--border-color-brand": navColor,
              "--color-fg-brand-primary": navColor,
              "--color-fg-brand-secondary": navColor,
              "--text-color-brand-primary": navColor,
              "--text-color-brand-secondary": navColor,
          } as CSSProperties)
        : undefined;

/** A single-select menu row with a check when active (shared dropdown style). */
export const MenuRow = ({ selected, onClick, label, right }: { selected: boolean; onClick: () => void; label: ReactNode; right?: ReactNode }) => (
    <button
        type="button"
        onClick={onClick}
        className={cx(
            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition duration-100 ease-linear",
            selected ? "bg-active font-semibold text-primary ring-1 ring-secondary ring-inset" : "text-secondary hover:bg-primary_hover",
        )}
    >
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <span className="flex shrink-0 items-center gap-2">
            {right}
            {selected && <Check className="size-4 text-fg-brand-primary" aria-hidden="true" />}
        </span>
    </button>
);

export const TeeTimesScreen = ({
    club = SAGAMORE_CLUB,
    courses = COURSES,
    courseLabel = "Course",
    holesOverride,
    nines,
    parallelTwilightNines,
}: {
    club?: Club;
    /** Dropdown options when NOT using nines (e.g. FloGolf simulator bays). */
    courses?: string[];
    /** Label for the first selector cell — e.g. "Course" or "Simulator Bay". */
    courseLabel?: string;
    holesOverride?: number;
    /** The course's nines. When set, the tee sheet mixes 18-hole and single-nine
     *  rounds, the picker offers "All Courses" + "18 Holes" + each nine, and the
     *  selection filters the sheet (All Courses → the full mix; 18 Holes → 18-hole
     *  cards only; a nine → only that nine's cards). */
    nines?: Nine[];
    /** Kettle Hills: its three nines are independent loops, so during twilight every
     *  nine runs in parallel — the same tee time is offered on each (same clock time,
     *  different starting nine) to pack more 9-hole players in at end of day. */
    parallelTwilightNines?: boolean;
}) => {
    // With nines, the picker is "All Courses" + "18 Holes" + each nine's option; otherwise the raw course list.
    const options = nines ? [ALL_OPTION, EIGHTEEN_OPTION, ...nines.map((n) => n.option)] : courses;

    const [openCell, setOpenCell] = useState<null | "course" | "date" | "players">(null);
    const [selectedCourse, setSelectedCourse] = useState(options[0]);
    const [selected, setSelected] = useState<Date>(DEFAULT_DATE);
    const [rateType, setRateType] = useState<"weekday" | "weekend">("weekday");
    const [players, setPlayers] = useState(1);
    const close = () => setOpenCell(null);
    const toggle = (k: "course" | "date" | "players") => setOpenCell((p) => (p === k ? null : k));

    // Bring the club mark into the sticky bar once it's scrolled to the top (June 19 behavior).
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [stuck, setStuck] = useState(false);
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const weekend = dayType(selected) === "weekend";
    // Show the entire day's tee sheet so the sticky selector bar is visible while scrolling.
    const slots = generateTeeTimes(weekend ? "weekend" : "weekday");

    // In nines mode, tag every slot as either an 18-hole round or a single nine
    // (every other slot is a nine, cycling through them) so the board is a genuine
    // mix. The selected option then filters it: "18 Holes" shows the full mix,
    // while a specific nine narrows to just that nine's cards.
    const cells = slots.flatMap((slot, index) => {
        if (!nines) return [{ key: slot.id, slot, banner: undefined as string | undefined, holes: holesOverride, option: undefined as string | undefined }];

        // Kettle Hills' nines are independent loops, so twilight runs them all in
        // parallel: the same tee time is offered on each nine (different start).
        if (parallelTwilightNines && slot.timeOfDay === "twilight") {
            return nines
                .filter((n) => n.availableFrom === undefined || slot.minutes >= n.availableFrom)
                .map((n) => ({ key: `${slot.id}-${n.option}`, slot, banner: n.banner as string | undefined, holes: 9, option: n.option }));
        }

        const candidate = index % 2 === 1 ? nines[Math.floor(index / 2) % nines.length] : null;
        // A nine only applies if it's available at this tee time; otherwise the slot is an 18-hole round.
        const nine = candidate && (candidate.availableFrom === undefined || slot.minutes >= candidate.availableFrom) ? candidate : null;
        // 18-hole rounds carry no banner — only single-nine rounds get the brand tag.
        return [
            nine
                ? { key: slot.id, slot, banner: nine.banner as string | undefined, holes: 9, option: nine.option }
                : { key: slot.id, slot, banner: undefined as string | undefined, holes: 18, option: EIGHTEEN_OPTION },
        ];
    });
    const visibleCells = nines && selectedCourse !== ALL_OPTION ? cells.filter((c) => c.option === selectedCourse) : cells;

    // Re-skin brand-derived accents to the club's nav color (e.g. blue under Kettle Hills).
    const brandStyle = clubBrandStyle(club.navColor);

    return (
        <div className="flex min-h-dvh flex-col bg-secondary" style={brandStyle}>
            <TopNav active="Tee Times" club={club} />

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 pt-10 pb-20">
                {/* Sentinel — when it scrolls out of view, the sticky bar gains the club mark */}
                <div ref={sentinelRef} className="h-px" />
                {/* Course / Date / Players selector bar — dropdowns reuse the June 19 GUI; sticks to the top on scroll */}
                <div className="sticky top-0 z-30 mb-6 -mx-6 bg-secondary/95 px-6 pt-2 pb-2 backdrop-blur-sm">
                    {stuck && (
                        <div className="mb-2.5 flex items-center justify-center gap-2.5">
                            <club.Logo className="h-7 w-auto" />
                            <span className="text-sm font-semibold text-primary">{club.name}</span>
                        </div>
                    )}
                    <div className="flex flex-col divide-y divide-secondary rounded-xl bg-primary shadow-lg ring-1 ring-secondary sm:flex-row sm:divide-x sm:divide-y-0">
                    <DropdownCell label={courseLabel} value={selectedCourse} open={openCell === "course"} onToggle={() => toggle("course")} onClose={close} align="left" edge="left">
                        <div className="w-64">
                            <p className="mb-3 text-sm font-semibold text-primary">{courseLabel}</p>
                            <div className="flex flex-col gap-0.5">
                                {nines ? (
                                    <>
                                        {/* All Courses · divider · 18 Holes · divider · the nines */}
                                        <MenuRow selected={selectedCourse === ALL_OPTION} onClick={() => setSelectedCourse(ALL_OPTION)} label={ALL_OPTION} />
                                        <div role="separator" className="-mx-4 my-1 border-t border-secondary" />
                                        <MenuRow selected={selectedCourse === EIGHTEEN_OPTION} onClick={() => setSelectedCourse(EIGHTEEN_OPTION)} label={EIGHTEEN_OPTION} />
                                        <div role="separator" className="-mx-4 mt-1 border-t border-secondary" />
                                        <p className="px-3 pt-3 pb-1 text-xs font-semibold tracking-wide text-quaternary uppercase">9 Holes</p>
                                        {nines.map((n) => (
                                            <MenuRow key={n.option} selected={selectedCourse === n.option} onClick={() => setSelectedCourse(n.option)} label={n.option} />
                                        ))}
                                    </>
                                ) : (
                                    options.map((c) => <MenuRow key={c} selected={selectedCourse === c} onClick={() => setSelectedCourse(c)} label={c} />)
                                )}
                            </div>
                        </div>
                    </DropdownCell>
                    <DropdownCell label="Date" value={fmtNice(selected)} open={openCell === "date"} onToggle={() => toggle("date")} onClose={close} align="center">
                        <CalendarPanel selected={selected} onSelect={setSelected} rateType={rateType} onRateType={setRateType} onDone={close} />
                    </DropdownCell>
                    <DropdownCell label="Players" value={`${players} ${players === 1 ? "Player" : "Players"}`} open={openCell === "players"} onToggle={() => toggle("players")} onClose={close} align="right" edge="right">
                        <div className="w-56">
                            <p className="mb-3 text-sm font-semibold text-primary">Players</p>
                            <div className="flex flex-col gap-0.5">
                                {[1, 2, 3, 4].map((n) => (
                                    <MenuRow key={n} selected={players === n} onClick={() => setPlayers(n)} label={`${n} ${n === 1 ? "player" : "players"}`} />
                                ))}
                            </div>
                        </div>
                    </DropdownCell>
                    </div>
                </div>

                {/* Tee-sheet grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {visibleCells.map(({ key, slot, banner, holes }) => (
                        <TeeCell
                            key={key}
                            slot={slot}
                            dayLabel={weekend ? "Weekend" : "Weekday"}
                            holesOverride={holes}
                            nineLabel={banner}
                            nineColor={nines ? club.navColor : undefined}
                            holesWord={Boolean(nines)}
                        />
                    ))}
                </div>
            </main>

            <SiteFooter club={club} />
        </div>
    );
};
