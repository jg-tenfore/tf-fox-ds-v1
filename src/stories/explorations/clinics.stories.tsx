import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { type Clinic, CLINICS, FOCUS_UI, LEVEL_COLOR } from "@/components/events/clinics-catalog";
import { cx } from "@/utils/cx";
import { SAGAMORE_CLUB, SiteFooter, TopNav } from "./tenfore-chrome";

/**
 * "Tenfore Fox / Clinics" — the club's instructor-led clinics in the same two views
 * as the Calendar: an agenda List View and a monthly Calendar View (Jul–Aug 2026).
 * Clinics are colored by focus area; list rows surface the instructor, skill level,
 * and spots. Re-skinned with design-system tokens.
 */
const meta: Meta = { title: "Global Nav/Clinics", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY = "2026-07-06";
const FIRST = { year: 2026, month: 6 };
const LAST = { year: 2026, month: 7 };

const pad = (n: number) => String(n).padStart(2, "0");
const isoFor = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const shortTime = (t: string) => t.split(" – ")[0].replace(" shotgun", "");

const clinicsByDay = CLINICS.reduce<Record<string, Clinic[]>>((acc, c) => {
    (acc[c.isoDate] ??= []).push(c);
    return acc;
}, {});
const sortedDays = Object.keys(clinicsByDay).sort();

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
    for (let i = firstWeekday - 1; i >= 0; i--) cells.push({ day: prevDays - i, iso: isoFor(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, prevDays - i), inMonth: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, iso: isoFor(year, month, d), inMonth: true });
    while (cells.length % 7 !== 0) {
        const d = cells.length - (firstWeekday + daysInMonth) + 1;
        cells.push({ day: d, iso: isoFor(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, d), inMonth: false });
    }
    return cells;
};

const Ava = ({ initials }: { initials: string }) => (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-brand-secondary ring-1 ring-secondary ring-inset">{initials}</span>
);

const spotsLabel = (c: Clinic) => (c.spotsLeft === 0 ? "Sold out" : `${c.spotsLeft} of ${c.capacity} left`);

/* ---------------- List view ---------------- */

const ListView = () => (
    <div className="flex flex-col gap-8">
        {sortedDays.map((iso) => {
            const clinics = clinicsByDay[iso];
            return (
                <div key={iso}>
                    <h3 className="mb-3 text-sm font-semibold tracking-wide text-tertiary uppercase">{clinics[0].date}</h3>
                    <div className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                        <div className="divide-y divide-secondary">
                            {clinics.map((c) => {
                                const f = FOCUS_UI[c.focus];
                                return (
                                    <button key={c.id} type="button" className={cx("flex w-full items-center gap-4 border-l-4 px-4 py-3.5 text-left transition duration-100 ease-linear hover:bg-primary_hover", f.border)}>
                                        <div className="w-20 shrink-0">
                                            <p className="text-sm font-semibold text-primary">{shortTime(c.time)}</p>
                                            <p className={cx("text-xs font-medium", f.fg)}>{c.focus}</p>
                                        </div>
                                        <Ava initials={c.instructorInitials} />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-primary">{c.title}</p>
                                            <p className="truncate text-sm text-tertiary">
                                                with {c.host} · {c.location}
                                            </p>
                                        </div>
                                        <Badge color={LEVEL_COLOR[c.level]} size="sm" type="pill-color">
                                            {c.level}
                                        </Badge>
                                        <span className="hidden w-24 shrink-0 text-right text-xs text-tertiary tabular-nums sm:block">{spotsLabel(c)}</span>
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

const Chip = ({ clinic }: { clinic: Clinic }) => {
    const f = FOCUS_UI[clinic.focus];
    return (
        <div className={cx("rounded-md border-l-4 px-1.5 py-1", f.bg, f.border)}>
            <p className="truncate text-[11px] leading-tight font-semibold text-primary">
                {shortTime(clinic.time)} · {clinic.focus}
            </p>
            <p className="truncate text-[11px] leading-tight text-secondary">{clinic.title}</p>
        </div>
    );
};

const CalendarView = () => {
    const [{ year, month }, setView] = useState(FIRST);
    const cells = monthCells(year, month);
    const atFirst = year === FIRST.year && month === FIRST.month;
    const atLast = year === LAST.year && month === LAST.month;
    const step = (dir: number) => setView((v) => ({ year: v.year, month: v.month + dir }));

    return (
        <>
            <div className="flex items-center justify-between">
                <button type="button" aria-label="Previous month" disabled={atFirst} onClick={() => step(-1)} className="flex size-10 items-center justify-center rounded-lg ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:opacity-40">
                    <ChevronLeft className="size-5 text-fg-secondary" aria-hidden="true" />
                </button>
                <h2 className="text-display-xs font-semibold text-primary">
                    {MONTHS_FULL[month]} {year}
                </h2>
                <button type="button" aria-label="Next month" disabled={atLast} onClick={() => step(1)} className="flex size-10 items-center justify-center rounded-lg ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:opacity-40">
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
                        const dayClinics = cell.inMonth ? (clinicsByDay[cell.iso] ?? []) : [];
                        const isToday = cell.iso === TODAY;
                        return (
                            <div key={cell.iso + i} className={cx("min-h-28 border-r border-b border-secondary p-2 last:border-r-0", !cell.inMonth && "bg-secondary_subtle", isToday && "bg-brand-primary")}>
                                <div className="flex justify-end">
                                    <span className={cx("text-sm tabular-nums", !cell.inMonth ? "text-quaternary" : isToday ? "font-bold text-brand-secondary" : "font-medium text-secondary")}>{cell.day}</span>
                                </div>
                                {dayClinics.length > 0 && (
                                    <div className="mt-1 flex flex-col gap-1">
                                        {dayClinics.map((c) => (
                                            <Chip key={c.id} clinic={c} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                {Object.entries(FOCUS_UI).map(([focus, f]) => (
                    <span key={focus} className="flex items-center gap-2 text-xs font-medium text-tertiary">
                        <span className={cx("h-3 w-5 rounded-sm border-l-4", f.bg, f.border)} />
                        {focus}
                    </span>
                ))}
            </div>
        </>
    );
};

/* ---------------- Screen ---------------- */

const ClinicsScreen = ({ initialView }: { initialView: "list" | "calendar" }) => {
    const [view, setView] = useState<"list" | "calendar">(initialView);
    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Clinics" club={SAGAMORE_CLUB} accountLabel="Justin G." />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
                <div className="mb-6">
                    <h1 className="text-display-xs font-semibold text-primary">Clinics with our PGA pros</h1>
                    <p className="mt-1.5 text-md text-tertiary">Instructor-led sessions across every part of your game — from first swings to on-course strategy.</p>
                </div>
                <div className="mb-7 flex items-center gap-6 border-b border-secondary">
                    {(["list", "calendar"] as const).map((v) => (
                        <button key={v} type="button" onClick={() => setView(v)} className={cx("-mb-px border-b-2 pb-3 text-sm transition duration-100 ease-linear", view === v ? "border-brand font-semibold text-brand-secondary" : "border-transparent font-medium text-tertiary hover:text-secondary")}>
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

export const ListStory: Story = { name: "List View", render: () => <ClinicsScreen initialView="list" /> };
export const CalendarStory: Story = { name: "Calendar View", render: () => <ClinicsScreen initialView="calendar" /> };
