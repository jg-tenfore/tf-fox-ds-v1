import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MarkerPin01 } from "@untitledui/icons";
import { GOLF_EVENTS, type GolfEvent } from "@/components/events/events-catalog";
import { cx } from "@/utils/cx";
import { CONCEPT_UI } from "./events-ui";
import { SAGAMORE_CLUB, SiteFooter, TopNav } from "./tenfore-chrome";

/**
 * "Tenfore Fox / Calendar" — the club schedule in two toggleable views: an agenda
 * List View and a monthly Calendar View, paged across July–August 2026. Today is
 * highlighted, out-of-month days muted, concept-colored chips fill day cells (cells
 * grow). Modeled on a classic list/calendar layout, re-skinned with tokens.
 */
const meta: Meta = {
    title: "Global Nav/Calendar",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY = "2026-07-06";
const FIRST = { year: 2026, month: 6 };
const LAST = { year: 2026, month: 7 };

const pad = (n: number) => String(n).padStart(2, "0");
const isoFor = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;
const shortTime = (time: string) => time.split(" – ")[0].replace(" shotgun", "");

const eventsByDay = GOLF_EVENTS.reduce<Record<string, GolfEvent[]>>((acc, e) => {
    (acc[e.isoDate] ??= []).push(e);
    return acc;
}, {});
const sortedDays = Object.keys(eventsByDay).sort();

interface Cell {
    day: number;
    iso: string;
    inMonth: boolean;
}

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

const Chip = ({ event }: { event: GolfEvent }) => {
    const cs = CONCEPT_UI[event.concept];
    return (
        <div className={cx("rounded-md border-l-4 px-1.5 py-1", cs.bg, cs.border)}>
            <p className="truncate text-[11px] leading-tight font-semibold text-primary">
                {shortTime(event.time)} · {cs.label}
            </p>
            <p className="truncate text-[11px] leading-tight text-secondary">{event.title}</p>
        </div>
    );
};

/* ---------------- List view ---------------- */

const ListView = () => (
    <div className="flex flex-col gap-8">
        {sortedDays.map((iso) => {
            const events = eventsByDay[iso];
            return (
                <div key={iso}>
                    <h3 className="mb-3 text-sm font-semibold tracking-wide text-tertiary uppercase">{events[0].date}</h3>
                    <div className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                        <div className="divide-y divide-secondary">
                            {events.map((e) => {
                                const cs = CONCEPT_UI[e.concept];
                                return (
                                    <button key={e.id} type="button" className={cx("flex w-full items-center gap-4 border-l-4 px-4 py-3.5 text-left transition duration-100 ease-linear hover:bg-primary_hover", cs.border)}>
                                        <div className="w-24 shrink-0">
                                            <p className="text-sm font-semibold text-primary">{shortTime(e.time)}</p>
                                            <p className={cx("text-xs font-medium", cs.fg)}>{cs.label}</p>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-primary">{e.title}</p>
                                            <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-tertiary">
                                                <MarkerPin01 className="size-3.5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                                {e.location} · {e.presenter}
                                            </p>
                                        </div>
                                        <span className="hidden shrink-0 text-sm font-semibold text-primary tabular-nums sm:block">
                                            ${e.price}
                                            <span className="font-normal text-tertiary"> {e.priceUnit.replace("per ", "/ ")}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
);

/* ---------------- Calendar view ---------------- */

const CalendarView = () => {
    const [{ year, month }, setView] = useState(FIRST);
    const cells = monthCells(year, month);
    const atFirst = year === FIRST.year && month === FIRST.month;
    const atLast = year === LAST.year && month === LAST.month;
    const step = (dir: number) => setView((v) => ({ year: v.year, month: v.month + dir }));

    return (
        <>
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    aria-label="Previous month"
                    disabled={atFirst}
                    onClick={() => step(-1)}
                    className="flex size-10 items-center justify-center rounded-lg ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:opacity-40"
                >
                    <ChevronLeft className="size-5 text-fg-secondary" aria-hidden="true" />
                </button>
                <h2 className="text-display-xs font-semibold text-primary">
                    {MONTHS_FULL[month]} {year}
                </h2>
                <button
                    type="button"
                    aria-label="Next month"
                    disabled={atLast}
                    onClick={() => step(1)}
                    className="flex size-10 items-center justify-center rounded-lg ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:opacity-40"
                >
                    <ChevronRight className="size-5 text-fg-secondary" aria-hidden="true" />
                </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-secondary bg-primary">
                <div className="grid grid-cols-7 border-b border-secondary bg-secondary">
                    {WEEKDAYS.map((w) => (
                        <div key={w} className="px-3 py-2.5 text-center text-xs font-semibold tracking-wide text-secondary uppercase">
                            {w}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {cells.map((cell, i) => {
                        const dayEvents = cell.inMonth ? (eventsByDay[cell.iso] ?? []) : [];
                        const isToday = cell.iso === TODAY;
                        return (
                            <div
                                key={cell.iso + i}
                                className={cx("min-h-28 border-r border-b border-secondary p-2 last:border-r-0", !cell.inMonth && "bg-secondary_subtle", isToday && "bg-brand-primary")}
                            >
                                <div className="flex justify-end">
                                    <span className={cx("text-sm tabular-nums", !cell.inMonth ? "text-quaternary" : isToday ? "font-bold text-brand-secondary" : "font-medium text-secondary")}>
                                        {cell.day}
                                    </span>
                                </div>
                                {dayEvents.length > 0 && (
                                    <div className="mt-1 flex flex-col gap-1">
                                        {dayEvents.map((e) => (
                                            <Chip key={e.id} event={e} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                {Object.values(CONCEPT_UI).map((cs) => (
                    <span key={cs.label} className="flex items-center gap-2 text-xs font-medium text-tertiary">
                        <span className={cx("h-3 w-5 rounded-sm border-l-4", cs.bg, cs.border)} />
                        {cs.label}
                    </span>
                ))}
            </div>
        </>
    );
};

/* ---------------- Screen with tabs ---------------- */

const Schedule = ({ initialView }: { initialView: "list" | "calendar" }) => {
    const [view, setView] = useState<"list" | "calendar">(initialView);
    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Calendar" club={SAGAMORE_CLUB} accountLabel="Justin G." />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
                {/* View tabs */}
                <div className="mb-7 flex items-center gap-6 border-b border-secondary">
                    {(["list", "calendar"] as const).map((v) => (
                        <button
                            key={v}
                            type="button"
                            onClick={() => setView(v)}
                            className={cx(
                                "-mb-px border-b-2 pb-3 text-sm transition duration-100 ease-linear",
                                view === v ? "border-brand font-semibold text-brand-secondary" : "border-transparent font-medium text-tertiary hover:text-secondary",
                            )}
                        >
                            {v === "list" ? "List View" : "Calendar View"}
                        </button>
                    ))}
                </div>

                {view === "list" ? <ListView /> : <CalendarView />}
            </main>
            <SiteFooter club={SAGAMORE_CLUB} />
        </div>
    );
};

export const ListStory: Story = {
    name: "List View",
    render: () => <Schedule initialView="list" />,
};

export const CalendarStory: Story = {
    name: "Calendar View",
    render: () => <Schedule initialView="calendar" />,
};
