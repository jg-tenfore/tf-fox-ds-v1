"use client";

/**
 * `/calendar` — one month grid for the whole county.
 *
 * The argument this screen makes: a golfer does not care which internal system owns
 * a Tuesday evening. Events, county clinics and the Golf Academy's group programs
 * are three separate catalogs internally (`MCG_EVENTS`, `MCG_CLINICS`, and
 * `GROUP_SERVICES` by way of `ACADEMY_CLINICS`) and one calendar externally, colour-
 * coded by source so the distinction is still legible where it matters.
 *
 * Two views, because both are genuinely used: the grid answers "what's on the
 * weekend of the 18th", the list answers "what's next". Both route into the same
 * detail pages — and Academy entries leave the Events section entirely for
 * `/instruction`, which owns booking them.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, MarkerPin01 } from "@untitledui/icons";
import { McgHero, McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import {
    CALENDAR_ENTRIES,
    CALENDAR_MONTHS,
    type CalendarEntry,
    COURSE_NAME,
    COURSE_SLUGS,
    ENTRY_UI,
    type EntryType,
    fmtDate,
    monthKey,
    monthLabel,
    MONTHS_FULL,
    money0,
    startTime,
    TODAY,
} from "@/components/mcg/events-catalog";
import { cx } from "@/utils/cx";
import { FilterChips, SelectMenu } from "./events-ui";

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TYPES: EntryType[] = ["event", "clinic", "academy"];

const pad = (n: number) => String(n).padStart(2, "0");
const isoFor = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

interface Cell {
    day: number;
    iso: string;
    inMonth: boolean;
}

/** A full six-or-five-week grid for a month, padded with the neighbouring months' days. */
const monthCells = (year: number, month: number): Cell[] => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const cells: Cell[] = [];

    for (let i = firstWeekday - 1; i >= 0; i--) {
        const d = prevDays - i;
        cells.push({ day: d, iso: isoFor(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, d), inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, iso: isoFor(year, month, d), inMonth: true });
    while (cells.length % 7 !== 0) {
        const d = cells.length - (firstWeekday + daysInMonth) + 1;
        cells.push({ day: d, iso: isoFor(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, d), inMonth: false });
    }
    return cells;
};

/* ------------------------------------------------------------------ */
/* Grid                                                               */
/* ------------------------------------------------------------------ */

const Chip = ({ entry }: { entry: CalendarEntry }) => {
    const ui = ENTRY_UI[entry.type];
    return (
        <Link
            href={entry.href}
            className={cx("block rounded-md border-l-4 px-1.5 py-1 transition duration-100 ease-linear hover:brightness-95", ui.bg, ui.border)}
            title={`${entry.title} · ${COURSE_NAME[entry.courseSlug]}`}
        >
            <p className="truncate text-[11px] leading-tight font-semibold text-primary">{startTime(entry.time)}</p>
            <p className="truncate text-[11px] leading-tight text-secondary">{entry.title}</p>
        </Link>
    );
};

const GridView = ({ entries, monthIndex, onStep }: { entries: CalendarEntry[]; monthIndex: number; onStep: (dir: number) => void }) => {
    const key = CALENDAR_MONTHS[monthIndex];
    const [year, month] = key.split("-").map(Number);
    const cells = monthCells(year, month - 1);

    const byDay = useMemo(() => {
        const map: Record<string, CalendarEntry[]> = {};
        for (const e of entries) (map[e.isoDate] ??= []).push(e);
        return map;
    }, [entries]);

    return (
        <>
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    aria-label="Previous month"
                    disabled={monthIndex === 0}
                    onClick={() => onStep(-1)}
                    className="flex size-10 items-center justify-center rounded-lg ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft className="size-5 text-fg-secondary" aria-hidden="true" />
                </button>
                <h2 className="text-display-xs font-semibold text-primary">
                    {MONTHS_FULL[month - 1]} {year}
                </h2>
                <button
                    type="button"
                    aria-label="Next month"
                    disabled={monthIndex === CALENDAR_MONTHS.length - 1}
                    onClick={() => onStep(1)}
                    className="flex size-10 items-center justify-center rounded-lg ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight className="size-5 text-fg-secondary" aria-hidden="true" />
                </button>
            </div>

            <div className="mt-6 overflow-x-auto">
                <div className="min-w-[46rem] overflow-hidden rounded-xl border border-secondary bg-primary">
                    <div className="grid grid-cols-7 border-b border-secondary bg-secondary">
                        {WEEKDAY_HEADERS.map((w) => (
                            <div key={w} className="px-3 py-2.5 text-center text-xs font-semibold tracking-wide text-secondary uppercase">
                                {w}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {cells.map((cell, i) => {
                            const dayEntries = cell.inMonth ? (byDay[cell.iso] ?? []) : [];
                            const isToday = cell.iso === TODAY;
                            return (
                                <div
                                    key={`${cell.iso}-${i}`}
                                    className={cx(
                                        "min-h-28 border-r border-b border-secondary p-2 last:border-r-0",
                                        !cell.inMonth && "bg-secondary_subtle",
                                        isToday && "bg-brand-primary",
                                    )}
                                >
                                    <div className="flex justify-end">
                                        <span
                                            className={cx(
                                                "text-sm tabular-nums",
                                                !cell.inMonth ? "text-quaternary" : isToday ? "font-bold text-brand-secondary" : "font-medium text-secondary",
                                            )}
                                        >
                                            {cell.day}
                                        </span>
                                    </div>
                                    {dayEntries.length > 0 && (
                                        <div className="mt-1 flex flex-col gap-1">
                                            {dayEntries.map((e) => (
                                                <Chip key={e.key} entry={e} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

/* ------------------------------------------------------------------ */
/* List                                                                */
/* ------------------------------------------------------------------ */

const ListView = ({ entries }: { entries: CalendarEntry[] }) => {
    const days = useMemo(() => {
        const map: Record<string, CalendarEntry[]> = {};
        for (const e of entries) (map[e.isoDate] ??= []).push(e);
        return Object.keys(map)
            .sort()
            .map((iso) => ({ iso, items: map[iso] }));
    }, [entries]);

    if (days.length === 0) {
        return <p className="py-16 text-center text-sm text-tertiary">Nothing scheduled at that course this month.</p>;
    }

    return (
        <div className="flex flex-col gap-8">
            {days.map(({ iso, items }) => (
                <div key={iso}>
                    <h3 className="mb-3 text-sm font-semibold tracking-wide text-tertiary uppercase">{fmtDate(iso)}</h3>
                    <div className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                        <div className="divide-y divide-secondary">
                            {items.map((e) => {
                                const ui = ENTRY_UI[e.type];
                                return (
                                    <Link
                                        key={e.key}
                                        href={e.href}
                                        className={cx("flex w-full items-center gap-4 border-l-4 px-4 py-3.5 text-left transition duration-100 ease-linear hover:bg-primary_hover", ui.border)}
                                    >
                                        <div className="w-24 shrink-0">
                                            <p className="text-sm font-semibold text-primary">{startTime(e.time)}</p>
                                            <p className={cx("text-xs font-medium", ui.fg)}>{ui.label}</p>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-primary">{e.title}</p>
                                            <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-tertiary">
                                                <MarkerPin01 className="size-3.5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                                {COURSE_NAME[e.courseSlug]} · {e.detail}
                                            </p>
                                        </div>
                                        {e.type === "academy" && (
                                            <span className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-brand-secondary sm:flex">
                                                Golf Academy
                                                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                                            </span>
                                        )}
                                        <span className="hidden w-20 shrink-0 text-right text-sm font-semibold text-primary tabular-nums sm:block">{money0(e.price)}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const CountyCalendarScreen = ({ initialView = "calendar" }: { initialView?: "calendar" | "list" }) => {
    const [view, setView] = useState<"calendar" | "list">(initialView);
    const [course, setCourse] = useState<string>("all");
    const [type, setType] = useState<EntryType | "all">("all");
    const [monthIndex, setMonthIndex] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    const monthOf = CALENDAR_MONTHS[monthIndex];

    const filtered = useMemo(
        () => CALENDAR_ENTRIES.filter((e) => (course === "all" || e.courseSlug === course) && (type === "all" || e.type === type)),
        [course, type],
    );

    // The grid pages a month at a time; the list shows the whole season, which is how
    // people actually plan a summer around nine courses.
    const gridEntries = filtered.filter((e) => monthKey(e.isoDate) === monthOf);

    return (
        <McgShell>
            <McgHero
                title="The county golf calendar"
                blurb="Every event, clinic and Golf Academy program across all nine MCG courses, in one place. Colour-coded by what it is — click anything to see the details."
            />

            <McgPage width="6xl">
                {/* View toggle */}
                <div className="mb-6 flex items-center gap-6 border-b border-secondary">
                    {(["calendar", "list"] as const).map((v) => (
                        <button
                            key={v}
                            type="button"
                            onClick={() => setView(v)}
                            className={cx(
                                "-mb-px border-b-2 pb-3 text-sm transition duration-100 ease-linear",
                                view === v ? "border-brand font-semibold text-brand-secondary" : "border-transparent font-medium text-tertiary hover:text-secondary",
                            )}
                        >
                            {v === "calendar" ? "Month view" : "List view"}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="mb-7 flex flex-wrap items-center gap-3">
                    <SelectMenu
                        label="Course"
                        value={course}
                        options={[{ id: "all", label: `All ${COURSE_SLUGS.length} courses` }, ...COURSE_SLUGS.map((slug) => ({ id: slug as string, label: COURSE_NAME[slug] }))]}
                        open={menuOpen}
                        onOpen={() => setMenuOpen((o) => !o)}
                        onChange={(id) => {
                            setCourse(id);
                            setMenuOpen(false);
                        }}
                    />
                    <FilterChips
                        options={[{ id: "all" as const, label: "Everything" }, ...TYPES.map((t) => ({ id: t, label: ENTRY_UI[t].label }))]}
                        value={type}
                        onChange={setType}
                    />
                </div>

                {view === "calendar" ? (
                    <GridView entries={gridEntries} monthIndex={monthIndex} onStep={(dir) => setMonthIndex((i) => Math.min(CALENDAR_MONTHS.length - 1, Math.max(0, i + dir)))} />
                ) : (
                    <ListView entries={filtered} />
                )}

                {/* Key */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-secondary pt-5">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        {TYPES.map((t) => (
                            <span key={t} className="flex items-center gap-2 text-xs font-medium text-tertiary">
                                <span className={cx("h-3 w-5 rounded-sm border-l-4", ENTRY_UI[t].bg, ENTRY_UI[t].border)} />
                                {ENTRY_UI[t].label}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs text-tertiary">
                        {view === "calendar" ? `${gridEntries.length} scheduled in ${monthLabel(monthOf)}` : `${filtered.length} scheduled this summer`}
                    </p>
                </div>
            </McgPage>
        </McgShell>
    );
};
