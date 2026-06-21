/**
 * Shared tee-search dropdown GUI, lifted from the "Justin Crazy — June 19"
 * concept so other explorations (e.g. Tenfore) can reuse the exact same
 * calendar / picker popovers. Keeps the same look and behavior; only the
 * trigger element styling is left to each consumer.
 */
import type { ReactNode } from "react";
import { cx } from "@/utils/cx";
import { Button } from "@/components/base/buttons/button";
import { course, formatPrice } from "@/components/booking/sagamore-data";

/* --------------------------------- dates ---------------------------------- */

export const TODAY = new Date(2026, 5, 19); // Fri, Jun 19 2026 — "today"
export const DEFAULT_DATE = new Date(2026, 5, 19);
const HOLIDAY_BLOCK = [new Date(2026, 6, 3), new Date(2026, 6, 4), new Date(2026, 6, 5)]; // Jul 3–5

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();
const isPast = (d: Date) => startOfDay(d).getTime() < startOfDay(TODAY).getTime();
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
const isMonday = (d: Date) => d.getDay() === 1; // course closed Mondays
const isBlocked = (d: Date) => HOLIDAY_BLOCK.some((b) => sameDay(b, d));
const isSoldOut = (d: Date) => !sameDay(d, DEFAULT_DATE) && (d.getDate() * 7 + d.getMonth() * 13) % 7 === 5;
export const dayType = (d: Date): "weekday" | "weekend" => (isWeekend(d) ? "weekend" : "weekday");

const fmtLong = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
export const fmtNice = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const monthCells = (year: number, month: number): (Date | null)[] => {
    const offset = new Date(year, month, 1).getDay();
    const count = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = Array.from({ length: offset }, () => null);
    for (let d = 1; d <= count; d++) cells.push(new Date(year, month, d));
    return cells;
};

const baseFee = (d: Date) => (isWeekend(d) ? 70 : 62);
const priceFor = (d: Date): { price: number; isDeal: boolean } => {
    const seed = (d.getDate() * 37 + d.getMonth() * 101 + d.getDay() * 13) % 100;
    const isDeal = seed % 5 < 2;
    const dealPrices = [32, 36, 39, 44];
    const price = isDeal ? dealPrices[seed % dealPrices.length] : baseFee(d) - (seed % 5) * 2;
    return { price, isDeal };
};

/* ------------------------------- popover shell ---------------------------- */

/** A click-dropdown anchored to a relatively-positioned trigger. */
export const CellDropdown = ({
    open,
    onClose,
    align = "left",
    children,
}: {
    open: boolean;
    onClose: () => void;
    align?: "left" | "center" | "right";
    children: ReactNode;
}) => {
    if (!open) return null;
    return (
        <>
            <div className="fixed inset-0 z-30" onClick={onClose} />
            <div
                className={cx(
                    "absolute top-full z-40 mt-2 w-max max-w-[86vw] rounded-2xl bg-primary p-4 shadow-lg ring-1 ring-secondary",
                    align === "right" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0",
                )}
            >
                {children}
            </div>
        </>
    );
};

/* -------------------------------- calendar -------------------------------- */

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

const MonthGrid = ({ year, month, selected, rateType, onSelect }: { year: number; month: number; selected: Date; rateType: "weekday" | "weekend"; onSelect: (d: Date) => void }) => {
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
                            disabled={past}
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

export const CalendarPanel = ({ selected, onSelect, rateType, onRateType, onDone }: { selected: Date; onSelect: (d: Date) => void; rateType: "weekday" | "weekend"; onRateType: (v: "weekday" | "weekend") => void; onDone: () => void }) => (
    <div className="w-[640px] max-w-[86vw]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary pb-3">
            <RateToggle value={rateType} onChange={onRateType} />
            <button
                type="button"
                onClick={() => {
                    onSelect(DEFAULT_DATE);
                    onRateType("weekday");
                }}
                className="text-sm font-medium text-brand-secondary hover:underline"
            >
                Reset
            </button>
        </div>
        <div className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-2 sm:gap-10">
            <MonthGrid year={2026} month={5} selected={selected} rateType={rateType} onSelect={onSelect} />
            <MonthGrid year={2026} month={6} selected={selected} rateType={rateType} onSelect={onSelect} />
        </div>
        <div className="flex items-center justify-between border-t border-secondary pt-3">
            <p className="text-xs text-tertiary">
                <span className="font-medium text-success-primary">Green</span> = best rate · <span className="line-through">struck</span> = sold out
            </p>
            <Button size="sm" onClick={onDone}>
                Done
            </Button>
        </div>
    </div>
);

/** The bookable schedules shown in the Course dropdown. */
export const COURSES = [course.name, "Sagamore Short Course", "Practice Range"];
