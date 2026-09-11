"use client";

/**
 * `/tee-times` — the county tee sheet.
 *
 * Every other golf site makes you pick a course first and *then* shows you times. A
 * nine-course county system can do better: merge all nine sheets into one board sorted
 * by the clock, so 7:00 AM at Falls Road sits next to 7:00 AM at Needwood and the golfer
 * shops the hour they actually want to play. The course toggles narrow that board rather
 * than gating it, and a course with nothing left today is disabled in place — "Full" —
 * instead of quietly vanishing.
 *
 * The other MCG-specific move is the resident switch. A Montgomery County resident card
 * takes money off every round at every course, so it belongs on the board next to the
 * prices, not buried on a rates page.
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Flag01, MarkerPin01, Moon01, Users01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Toggle } from "@/components/base/toggle/toggle";
import { MicroLabel, SectionTitle } from "@/components/instruction/instruction-ui";
import { McgHero, McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import { useSession } from "@/components/mcg/session";
import {
    MCG_COURSES,
    MCG_SOLD_OUT,
    greenFee,
    isWeekend,
    mcgBoard,
    money0,
    selectionFromSlot,
    writeSelection,
    type Holes,
    type McgCourseInfo,
    type McgSlot,
} from "@/components/mcg/tee-times-data";
import { CalendarPanel, DEFAULT_DATE, fmtNice } from "@/stories/explorations/tee-search-popovers";
import { DropdownCell, MenuRow } from "@/stories/explorations/tenfore-chrome";
import { cx } from "@/utils/cx";

/** The board's default: every course that has something left today. */
const ALL_COURSES = "all";

const HOLES_OPTIONS: { id: "any" | Holes; label: string }[] = [
    { id: "any", label: "Any" },
    { id: 18, label: "18 holes" },
    { id: 9, label: "9 holes" },
];

export interface TeeSheetScreenProps {
    /** Slugs with nothing left today. The "No Availability" story passes all nine. */
    soldOut?: string[];
    /** Open with the resident rates already showing. */
    resident?: boolean;
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

/** A course toggle: logo + name, on/off, or disabled when the course is full today. */
const CoursePill = ({
    course,
    on,
    disabled,
    isHome,
    onToggle,
}: {
    course: McgCourseInfo;
    on: boolean;
    disabled: boolean;
    isHome: boolean;
    onToggle: () => void;
}) => (
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
        {isHome && !disabled && <span className="rounded-full bg-tertiary px-1.5 py-0.5 text-[10px] font-semibold text-secondary">Yours</span>}
        {disabled ? (
            <span className="rounded-full bg-tertiary px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-secondary uppercase">Full</span>
        ) : on ? (
            <Check className="size-4 text-fg-brand-primary" aria-hidden="true" />
        ) : null}
    </button>
);

/** One tee time on the board, badged with its course so the merged sheet stays legible. */
const SlotCard = ({ slot, course, resident, onBook }: { slot: McgSlot; course: McgCourseInfo; resident: boolean; onBook: () => void }) => {
    const price = resident ? slot.residentPrice : slot.price;

    return (
        <button
            type="button"
            onClick={onBook}
            className="group flex flex-col overflow-hidden rounded-lg bg-primary text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
            <div className="flex items-center gap-1.5 border-b border-secondary px-3.5 py-2">
                <img src={course.logo} alt="" aria-hidden="true" className="h-4 w-auto max-w-10 object-contain" />
                <span className="truncate text-xs font-medium text-secondary">{course.name}</span>
            </div>

            <div className="flex flex-col gap-2 px-3.5 py-3">
                <span className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-primary">{slot.label}</span>
                    {slot.twilight && <Moon01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />}
                </span>

                <div className="flex items-center gap-3 text-xs text-tertiary tabular-nums">
                    <span className="flex items-center gap-1">
                        <Flag01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                        {slot.holes} holes
                    </span>
                    <span className="flex items-center gap-1">
                        <Users01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                        {slot.spots === 1 ? "1 spot" : `1–${slot.spots}`}
                    </span>
                </div>

                <p className="flex flex-wrap items-baseline gap-1.5 text-xs text-tertiary">
                    <span className="text-sm font-semibold text-primary tabular-nums">{money0(price)}</span>
                    {resident ? (
                        <>
                            <span className="text-quaternary line-through tabular-nums">{money0(slot.price)}</span>
                            <span className="font-medium text-brand-secondary">resident</span>
                        </>
                    ) : (
                        <span className="tabular-nums">per golfer</span>
                    )}
                </p>

                <span className="text-[11px] font-medium tracking-wide text-quaternary uppercase">
                    {slot.twilight ? "Twilight rate" : resident ? "County resident" : `${money0(slot.residentPrice)} for residents`}
                </span>
            </div>
        </button>
    );
};

/** The county rate card, priced for the day the golfer is looking at. */
const RateTable = ({ weekend }: { weekend: boolean }) => (
    <section className="flex flex-col gap-4">
        <SectionTitle sub={`${weekend ? "Weekend and holiday" : "Weekday"} green fees, walking. Cart is $22 per golfer for 18 and $14 for a nine or twilight.`}>
            Green fees across the county
        </SectionTitle>

        <div className="overflow-x-auto rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
            <table className="w-full min-w-[720px] text-sm">
                <thead>
                    <tr className="border-b border-secondary text-left">
                        <th scope="col" className="px-5 py-3 font-semibold text-secondary">
                            Course
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-secondary">
                            18
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-secondary">
                            9
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-secondary">
                            Twilight
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-brand-secondary">
                            Resident 18
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-secondary">
                            Senior 18
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-secondary">
                            Junior 18
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-secondary">
                    {MCG_COURSES.map((course) => (
                        <tr key={course.slug}>
                            <th scope="row" className="px-5 py-3 text-left font-normal">
                                <span className="flex items-center gap-2.5">
                                    <img src={course.logo} alt="" aria-hidden="true" className="h-5 w-auto max-w-12 object-contain" />
                                    <span className="flex flex-col">
                                        <span className="font-semibold text-primary">{course.name}</span>
                                        <span className="text-xs text-tertiary">
                                            {course.location} · par {course.par} · {course.yards.toLocaleString("en-US")} yds
                                        </span>
                                    </span>
                                </span>
                            </th>
                            <td className="px-4 py-3 text-right text-secondary tabular-nums">{money0(greenFee({ slug: course.slug, holes: 18, weekend, twilight: false }))}</td>
                            <td className="px-4 py-3 text-right text-secondary tabular-nums">{money0(greenFee({ slug: course.slug, holes: 9, weekend, twilight: false }))}</td>
                            <td className="px-4 py-3 text-right text-secondary tabular-nums">{money0(greenFee({ slug: course.slug, holes: 9, weekend, twilight: true }))}</td>
                            <td className="px-4 py-3 text-right font-semibold text-brand-secondary tabular-nums">
                                {money0(greenFee({ slug: course.slug, holes: 18, weekend, twilight: false, resident: true }))}
                            </td>
                            <td className="px-4 py-3 text-right text-secondary tabular-nums">
                                {weekend ? "—" : money0(greenFee({ slug: course.slug, holes: 18, weekend, twilight: false, rateClass: "senior" }))}
                            </td>
                            <td className="px-4 py-3 text-right text-secondary tabular-nums">
                                {money0(greenFee({ slug: course.slug, holes: 18, weekend, twilight: false, rateClass: "junior" }))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <p className="text-xs text-tertiary">
            Senior rates (62 and over) run Monday to Friday. Junior rates (17 and under) run any day — the county would rather have kids on the course. Rates
            stack with the resident card. Sligo Creek is a nine-hole course: its 18 rate buys two trips round the same nine.
        </p>
    </section>
);

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const TeeSheetScreen = ({ soldOut = MCG_SOLD_OUT, resident: initialResident = false }: TeeSheetScreenProps) => {
    const router = useRouter();
    const { courseSlug, setCourse, isResident, setResident: persistResident, ready } = useSession();

    const [date, setDate] = useState<Date>(DEFAULT_DATE);
    const [rateType, setRateType] = useState<"weekday" | "weekend">("weekday");
    const [players, setPlayers] = useState(2);
    const [holes, setHoles] = useState<"any" | Holes>("any");
    // Residency is a session fact, not a screen fact — set it here and the account
    // page and checkout already agree. The prop remains so a story can force either.
    const [resident, setLocalResident] = useState(initialResident);
    useEffect(() => {
        if (ready) setLocalResident(isResident || initialResident);
    }, [ready, isResident, initialResident]);
    const setResident = (value: boolean) => {
        setLocalResident(value);
        persistResident(value);
    };
    const [openCell, setOpenCell] = useState<null | "course" | "date" | "players" | "holes">(null);

    const close = () => setOpenCell(null);
    const toggleCell = (key: "course" | "date" | "players" | "holes") => setOpenCell((prev) => (prev === key ? null : key));

    // The golfer's course from the session leads the pill row and is badged "Yours";
    // picking a single course writes it back, so the rest of the prototype follows along.
    const ordered = useMemo(() => [...MCG_COURSES].sort((a, b) => Number(b.slug === courseSlug) - Number(a.slug === courseSlug)), [courseSlug]);

    const bookable = MCG_COURSES.filter((c) => !soldOut.includes(c.slug)).map((c) => c.slug);
    const [enabled, setEnabled] = useState<string[]>(() => MCG_COURSES.map((c) => c.slug));

    const active = enabled.filter((slug) => bookable.includes(slug));
    const toggleCourse = (slug: string) => setEnabled((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

    /** Single-select from the Course cell — "all" reopens the whole county board. */
    const chooseCourse = (slug: string) => {
        if (slug === ALL_COURSES) {
            setEnabled(MCG_COURSES.map((c) => c.slug));
            return;
        }
        setEnabled([slug]);
        setCourse(slug);
    };

    const weekend = isWeekend(date);
    const board = mcgBoard({ date, players, holes, courses: enabled, soldOut });

    const courseCellValue =
        active.length === 0 ? "No courses on" : active.length === 1 ? MCG_COURSES.find((c) => c.slug === active[0])!.name : `All MCG courses (${active.length})`;
    const holesCellValue = HOLES_OPTIONS.find((o) => o.id === holes)!.label;

    const book = (slot: McgSlot) => {
        writeSelection(selectionFromSlot(slot, date, players));
        setCourse(slot.courseSlug);
        router.push("/tee-times/checkout");
    };

    return (
        <McgShell>
            <McgHero
                title="Nine courses. One tee sheet."
                blurb="Every Montgomery County course on one board, sorted by the clock — so you shop the hour you want to play, not the course you have to settle for. County residents see their rate on every card."
                right={
                    <div className="flex gap-3">
                        <div className="rounded-xl bg-secondary_subtle px-4 py-3 ring-1 ring-secondary ring-inset">
                            <MicroLabel>Courses open</MicroLabel>
                            <p className="text-display-xs font-semibold text-primary tabular-nums">
                                {bookable.length}
                                <span className="text-md text-tertiary">/{MCG_COURSES.length}</span>
                            </p>
                        </div>
                        <div className="rounded-xl bg-secondary_subtle px-4 py-3 ring-1 ring-secondary ring-inset">
                            <MicroLabel>Times on the board</MicroLabel>
                            <p className="text-display-xs font-semibold text-primary tabular-nums">{board.length}</p>
                        </div>
                    </div>
                }
            />

            <McgPage>
                {/* Course toggles — narrow the county board without leaving it */}
                <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold tracking-wide text-quaternary uppercase">Courses</p>
                    <div className="flex flex-wrap gap-2">
                        {ordered.map((course) => (
                            <CoursePill
                                key={course.slug}
                                course={course}
                                on={enabled.includes(course.slug)}
                                disabled={soldOut.includes(course.slug)}
                                isHome={course.slug === courseSlug}
                                onToggle={() => toggleCourse(course.slug)}
                            />
                        ))}
                    </div>
                </div>

                {/* COURSE / DATE / PLAYERS / HOLES */}
                <div className="mb-5 flex flex-col divide-y divide-secondary rounded-xl bg-primary shadow-lg ring-1 ring-secondary sm:flex-row sm:divide-x sm:divide-y-0">
                    <DropdownCell label="Course" value={courseCellValue} open={openCell === "course"} onToggle={() => toggleCell("course")} onClose={close} align="left" edge="left">
                        <div className="w-72">
                            <p className="mb-3 text-sm font-semibold text-primary">Course</p>
                            <div className="flex flex-col gap-0.5">
                                <MenuRow selected={active.length > 1} onClick={() => chooseCourse(ALL_COURSES)} label="All MCG courses" />
                                <div role="separator" className="-mx-4 my-1 border-t border-secondary" />
                                {ordered.map((course) => {
                                    const full = soldOut.includes(course.slug);
                                    return (
                                        <MenuRow
                                            key={course.slug}
                                            selected={active.length === 1 && active[0] === course.slug}
                                            onClick={() => !full && chooseCourse(course.slug)}
                                            label={
                                                <span className={cx("flex items-center gap-2", full && "text-quaternary")}>
                                                    <img src={course.logo} alt="" aria-hidden="true" className={cx("h-4 w-auto max-w-10 object-contain", full && "opacity-50 grayscale")} />
                                                    <span className={cx("truncate", full && "line-through")}>{course.name}</span>
                                                </span>
                                            }
                                            right={
                                                full ? (
                                                    <span className="text-[10px] font-semibold tracking-wide text-quaternary uppercase">Full</span>
                                                ) : (
                                                    <span className="text-xs text-tertiary tabular-nums">
                                                        {money0(greenFee({ slug: course.slug, holes: 18, weekend, twilight: false, resident }))}
                                                    </span>
                                                )
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </DropdownCell>

                    <DropdownCell label="Date" value={fmtNice(date)} open={openCell === "date"} onToggle={() => toggleCell("date")} onClose={close} align="center">
                        {/* Prices are hidden in the calendar: on a nine-course board there is no single
                            day rate to quote, and the per-course rate card below does that job properly. */}
                        <CalendarPanel selected={date} onSelect={setDate} rateType={rateType} onRateType={setRateType} onDone={close} showPrices={false} />
                    </DropdownCell>

                    <DropdownCell
                        label="Players"
                        value={`${players} ${players === 1 ? "Player" : "Players"}`}
                        open={openCell === "players"}
                        onToggle={() => toggleCell("players")}
                        onClose={close}
                        align="center"
                    >
                        <div className="w-56">
                            <p className="mb-3 text-sm font-semibold text-primary">Players</p>
                            <div className="flex flex-col gap-0.5">
                                {[1, 2, 3, 4].map((n) => (
                                    <MenuRow key={n} selected={players === n} onClick={() => setPlayers(n)} label={`${n} ${n === 1 ? "player" : "players"}`} />
                                ))}
                            </div>
                            <p className="mt-3 border-t border-secondary pt-3 text-xs text-tertiary">
                                Tee times are foursomes. Smaller groups may be paired with other golfers.
                            </p>
                        </div>
                    </DropdownCell>

                    <DropdownCell label="Holes" value={holesCellValue} open={openCell === "holes"} onToggle={() => toggleCell("holes")} onClose={close} align="right" edge="right">
                        <div className="w-64">
                            <p className="mb-3 text-sm font-semibold text-primary">Holes</p>
                            <div className="flex flex-col gap-0.5">
                                {HOLES_OPTIONS.map((option) => (
                                    <MenuRow key={String(option.id)} selected={holes === option.id} onClick={() => setHoles(option.id)} label={option.label} />
                                ))}
                            </div>
                            <p className="mt-3 border-t border-secondary pt-3 text-xs text-tertiary">
                                Weekends and holidays are 18-hole play only until 1:00 PM. Twilight opens at 4:00 PM at a flat rate.
                            </p>
                        </div>
                    </DropdownCell>
                </div>

                {/* Resident rates — the county's headline discount, switched on over the whole board */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-primary px-5 py-4 ring-1 ring-secondary ring-inset">
                    <div className="flex min-w-0 items-start gap-3">
                        <MarkerPin01 className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                        <div className="flex min-w-0 flex-col">
                            <span className="text-sm font-semibold text-primary">Montgomery County resident rates</span>
                            <span className="text-sm text-tertiary">
                                Show a county ID once and every round at all nine courses drops to the resident rate — up to $10 off an eighteen.
                            </span>
                        </div>
                    </div>
                    <Toggle
                        size="md"
                        label="Show resident rates"
                        isSelected={resident}
                        onChange={setResident}
                        aria-label="Show Montgomery County resident rates"
                    />
                </div>

                {/* Summary line */}
                <p className="mb-5 text-sm text-tertiary">
                    <span className="font-semibold text-secondary tabular-nums">{active.length}</span> {active.length === 1 ? "course" : "courses"} ·{" "}
                    <span className="font-semibold text-secondary tabular-nums">{board.length}</span> tee {board.length === 1 ? "time" : "times"} · 6:00 AM – 7:00 PM ·{" "}
                    {fmtNice(date)}
                    {weekend && (
                        <>
                            {" "}
                            <Badge color="warning" size="sm" type="pill-color">
                                Weekend rates
                            </Badge>
                        </>
                    )}
                </p>

                {/* The intertwined board */}
                {board.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-2xl bg-primary px-6 py-16 text-center ring-1 ring-secondary ring-inset">
                        <Clock className="size-6 text-fg-quaternary" aria-hidden="true" />
                        <p className="text-md font-semibold text-primary">Nothing left on the board</p>
                        <p className="max-w-md text-sm text-tertiary">
                            {soldOut.length >= MCG_COURSES.length
                                ? "Every county course is booked out for this date. Tee times open eight days ahead at 7:00 AM — or call the course for a walk-on."
                                : "Turn on another course above, drop to a smaller group, or try a different date."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {board.map((slot) => (
                            <SlotCard
                                key={slot.id}
                                slot={slot}
                                course={MCG_COURSES.find((c) => c.slug === slot.courseSlug)!}
                                resident={resident}
                                onBook={() => book(slot)}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-12">
                    <RateTable weekend={weekend} />
                </div>
            </McgPage>
        </McgShell>
    );
};
