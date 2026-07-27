import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Check, Flag01, Users01 } from "@untitledui/icons";
import { formatPrice } from "@/components/booking/sagamore-data";
import { mcgCourses, type McgCourse } from "@/components/foundations/mcg/mcg-assets";
import { McgLogo } from "@/components/foundations/mcg/mcg-logo";
import { cx } from "@/utils/cx";
import { CalendarPanel, DEFAULT_DATE, dayType, fmtNice } from "./tee-search-popovers";
import { clubBrandStyle, DropdownCell, MenuRow, SiteFooter, TopNav, type Club } from "./tenfore-chrome";

/**
 * "Global Nav / Tee Times / MCG Courses" — a portfolio tee sheet for Montgomery
 * County Golf. Every MCG course's tee times are intertwined into a single board
 * sorted by time (so 7:00 AM at Falls Road sits next to 7:00 AM at Needwood),
 * each card badged with its course logo. A row of course toggle pills above the
 * Date / Players bar turns each course on/off; courses with no availability today
 * show as disabled ("Full"). Times run 6:00 AM – 7:00 PM.
 */
const meta = {
    title: "Global Nav/Tee Times/MCG Courses",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** MCG's brand green (from the group logo) — tints the card hover ring + pill accents. */
const MCG_GREEN = "#1E8E4E";

const MCG_CLUB: Club = {
    name: "Montgomery County Golf",
    city: "Montgomery County, MD",
    phone: "(301) 762-1600",
    addressLine: "Montgomery County, MD",
    email: "info@mcggolf.com",
    Logo: McgLogo,
    // No navColor → black nav, so the green MCG mark reads against it.
};

/** Per-course weekday green fee (weekend adds a small surcharge). */
const COURSE_FEE: Record<string, number> = {
    "falls-road": 38,
    northwest: 42,
    "hampshire-greens": 62,
    laytonsville: 34,
    "little-bennett": 40,
    needwood: 44,
    crossvines: 55,
};

/** Courses with no availability today — their pill is disabled and they drop off the board. */
const FULLY_BOOKED = new Set<string>(["little-bennett"]);

/** A tee-sheet slot (minimal shape for this showcase). */
interface Slot {
    id: string;
    label: string;
    minutes: number;
    price: number;
    spotsAvailable: number;
}

const DAY_START = 6 * 60; // 6:00 AM
const DAY_END = 19 * 60; // 7:00 PM
const STEP = 30; // minutes between grid slots

/** "7:00 AM" style label from minutes-since-midnight. */
const fmtLabel = (m: number): string => {
    const h24 = Math.floor(m / 60);
    const min = m % 60;
    const h = ((h24 + 11) % 12) + 1;
    return `${h}:${String(min).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
};

/**
 * A course's tee sheet across 6 AM–7 PM. Courses are staggered by index (every
 * other 30-min grid slot) so adjacent courses interleave and courses two apart
 * share exact times — giving a genuinely intertwined board once merged + sorted.
 */
const courseSlots = (slug: string, weekend: boolean, index: number): Slot[] => {
    if (FULLY_BOOKED.has(slug)) return [];
    const fee = (COURSE_FEE[slug] ?? 40) + (weekend ? 8 : 0);
    const slots: Slot[] = [];
    let gridIndex = 0;
    for (let m = DAY_START; m <= DAY_END; m += STEP, gridIndex++) {
        if ((gridIndex + index) % 2 !== 0) continue; // stagger courses across the grid
        slots.push({
            id: `${slug}-${m}`,
            label: fmtLabel(m),
            minutes: m,
            price: fee,
            spotsAvailable: ((gridIndex + index * 2) % 4) + 1, // 1–4, deterministic
        });
    }
    return slots;
};

/** A course toggle pill: logo + name, on/off, or disabled when the course is full today. */
const CoursePill = ({ course, on, disabled, onToggle }: { course: McgCourse; on: boolean; disabled: boolean; onToggle: () => void }) => (
    <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        aria-pressed={on}
        className={cx(
            "flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-2.5 text-sm font-medium ring-inset transition duration-100 ease-linear",
            disabled
                ? "cursor-not-allowed bg-secondary text-quaternary ring-1 ring-secondary"
                : on
                  ? "bg-primary text-primary ring-2 ring-brand"
                  : "bg-primary text-tertiary ring-1 ring-secondary hover:bg-primary_hover",
        )}
    >
        <img src={course.logo} alt="" aria-hidden="true" className={cx("h-5 w-auto max-w-14 object-contain", (disabled || !on) && "opacity-50 grayscale")} />
        <span className={cx(disabled && "line-through")}>{course.name}</span>
        {disabled ? (
            <span className="rounded-full bg-tertiary px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-secondary uppercase">Full</span>
        ) : on ? (
            <Check className="size-4 text-fg-brand-primary" aria-hidden="true" />
        ) : null}
    </button>
);

/** A single tee-time card, badged with its course logo (so the intertwined board stays legible). */
const McgSlotCard = ({ course, slot, dayLabel }: { course: McgCourse; slot: Slot; dayLabel: string }) => {
    const playerRange = slot.spotsAvailable <= 1 ? "1" : "1-4";
    return (
        <button
            type="button"
            className="group flex flex-col overflow-hidden rounded-lg bg-primary text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
            {/* Course chip */}
            <div className="flex items-center gap-1.5 border-b border-secondary px-3.5 py-2">
                <img src={course.logo} alt="" aria-hidden="true" className="h-4 w-auto max-w-10 object-contain" />
                <span className="truncate text-xs font-medium text-secondary">{course.name}</span>
            </div>
            {/* Slot body */}
            <div className="flex flex-col gap-2 px-3.5 py-3">
                <span className="text-lg font-semibold text-primary">{slot.label}</span>
                <div className="flex items-center gap-3 text-xs text-tertiary tabular-nums">
                    <span className="flex items-center gap-1">
                        <Flag01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                        18 holes
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
        </button>
    );
};

const McgTeeTimesScreen = () => {
    const [selected, setSelected] = useState<Date>(DEFAULT_DATE);
    const [rateType, setRateType] = useState<"weekday" | "weekend">("weekday");
    const [players, setPlayers] = useState(1);
    const [openCell, setOpenCell] = useState<null | "date" | "players">(null);
    const close = () => setOpenCell(null);
    const toggleCell = (k: "date" | "players") => setOpenCell((p) => (p === k ? null : k));

    // Course toggles — every available course starts on.
    const availableSlugs = mcgCourses.filter((c) => !FULLY_BOOKED.has(c.slug)).map((c) => c.slug);
    const [enabled, setEnabled] = useState<Set<string>>(() => new Set(availableSlugs));
    const toggleCourse = (slug: string) =>
        setEnabled((prev) => {
            const next = new Set(prev);
            next.has(slug) ? next.delete(slug) : next.add(slug);
            return next;
        });

    const weekend = dayType(selected) === "weekend";
    const dayLabel = weekend ? "Weekend" : "Weekday";

    // Intertwine every enabled course's slots into one board, sorted by time
    // (ties broken by course order so the same time groups consistently).
    const allSlots = mcgCourses
        .flatMap((course, index) => (enabled.has(course.slug) ? courseSlots(course.slug, weekend, index).map((slot) => ({ course, slot, index })) : []))
        .filter(({ slot }) => slot.spotsAvailable >= players)
        .sort((a, b) => a.slot.minutes - b.slot.minutes || a.index - b.index);

    const activeCourses = mcgCourses.filter((c) => enabled.has(c.slug) && !FULLY_BOOKED.has(c.slug)).length;

    return (
        <div className="flex min-h-dvh flex-col bg-secondary" style={clubBrandStyle(MCG_GREEN)}>
            <TopNav active="Tee Times" club={MCG_CLUB} />

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 pt-10 pb-20">
                {/* Course toggle pills — turn each course's tee times on / off */}
                <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold tracking-wide text-quaternary uppercase">Courses</p>
                    <div className="flex flex-wrap gap-2">
                        {mcgCourses.map((course) => (
                            <CoursePill
                                key={course.slug}
                                course={course}
                                on={enabled.has(course.slug)}
                                disabled={FULLY_BOOKED.has(course.slug)}
                                onToggle={() => toggleCourse(course.slug)}
                            />
                        ))}
                    </div>
                </div>

                {/* Date / Players bar */}
                <div className="mb-6 flex flex-col divide-y divide-secondary rounded-xl bg-primary shadow-lg ring-1 ring-secondary sm:flex-row sm:divide-x sm:divide-y-0">
                    <DropdownCell label="Date" value={fmtNice(selected)} open={openCell === "date"} onToggle={() => toggleCell("date")} onClose={close} align="left" edge="left">
                        <CalendarPanel selected={selected} onSelect={setSelected} rateType={rateType} onRateType={setRateType} onDone={close} />
                    </DropdownCell>
                    <DropdownCell
                        label="Players"
                        value={`${players} ${players === 1 ? "Player" : "Players"}`}
                        open={openCell === "players"}
                        onToggle={() => toggleCell("players")}
                        onClose={close}
                        align="right"
                        edge="right"
                    >
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

                {/* Summary line */}
                <p className="mb-5 text-sm text-tertiary">
                    <span className="font-semibold text-secondary tabular-nums">{activeCourses}</span> {activeCourses === 1 ? "course" : "courses"} ·{" "}
                    <span className="font-semibold text-secondary tabular-nums">{allSlots.length}</span> tee {allSlots.length === 1 ? "time" : "times"} · 6:00 AM – 7:00 PM ·{" "}
                    {fmtNice(selected)}
                </p>

                {/* Intertwined board — all courses' tee times mixed together, sorted by time */}
                {allSlots.length === 0 ? (
                    <div className="mt-16 flex flex-col items-center gap-2 text-center">
                        <p className="text-md font-semibold text-primary">No tee times</p>
                        <p className="text-sm text-tertiary">Turn on a course above, or try fewer players / another date.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {allSlots.map(({ course, slot }) => (
                            <McgSlotCard key={`${course.slug}-${slot.id}`} course={course} slot={slot} dayLabel={dayLabel} />
                        ))}
                    </div>
                )}
            </main>

            <SiteFooter club={MCG_CLUB} />
        </div>
    );
};

export const Default: Story = {
    name: "MCG Courses",
    render: () => <McgTeeTimesScreen />,
};
