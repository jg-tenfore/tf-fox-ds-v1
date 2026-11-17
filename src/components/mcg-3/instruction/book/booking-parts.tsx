"use client";

/**
 * Small pieces the booking screens borrow from elsewhere in the Crane prototype (tee-time
 * selector cells and player avatars, the events kit's spots meter, stepper, check list,
 * add-to-calendar and share), rebuilt with Fox tokens. Kept beside the booking flow because
 * nothing else in Instruction uses them.
 */
import { useEffect, useId, useRef, useState, type FC, type ReactNode } from "react";
import { AlertCircle, AlertTriangle, Calendar, CalendarCheck01, Check, CheckCircle, ChevronDown, InfoCircle, Link01, Minus, Plus, Share07, User01 } from "@untitledui/icons";
import {
    Button as AriaButton,
    Menu as AriaMenu,
    MenuItem as AriaMenuItem,
    MenuTrigger as AriaMenuTrigger,
    Popover as AriaPopover,
} from "react-aria-components";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { cx } from "@/utils/cx";
import { caps, focusRing } from "../kit";

/* ------------------------------------------------------------------ */
/* Panels and notices                                                  */
/* ------------------------------------------------------------------ */

/** A white card with an optional header row (Crane's `Panel`). */
export const Panel = ({ title, children, className, bodyClassName }: { title?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) => (
    <section className={cx("flex flex-col rounded-xl bg-primary ring-1 ring-secondary ring-inset", className)}>
        {title && <header className="border-b border-secondary px-5 py-4 text-md font-semibold text-primary">{title}</header>}
        <div className={bodyClassName}>{children}</div>
    </section>
);

const NOTICE = {
    info: { box: "bg-secondary text-secondary ring-secondary", icon: InfoCircle, fg: "text-fg-quaternary" },
    success: { box: "bg-success-primary text-success-primary ring-transparent", icon: CheckCircle, fg: "text-fg-success-secondary" },
    warning: { box: "bg-warning-primary text-warning-primary ring-transparent", icon: AlertTriangle, fg: "text-fg-warning-secondary" },
    error: { box: "bg-error-primary text-error-primary ring-error_subtle", icon: AlertCircle, fg: "text-fg-error-secondary" },
} as const;

/** An inline callout (Crane's `Notice`). */
export const Notice = ({ tone, children, className }: { tone: keyof typeof NOTICE; children: ReactNode; className?: string }) => {
    const t = NOTICE[tone];
    const Icon = t.icon;
    return (
        <div role={tone === "error" ? "alert" : undefined} className={cx("flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-sm ring-1 ring-inset", t.box, className)}>
            <Icon className={cx("mt-0.5 size-4 shrink-0", t.fg)} aria-hidden="true" />
            <div className="min-w-0 flex-1">{children}</div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Selector bar (tee-time style)                                       */
/* ------------------------------------------------------------------ */

/** One cell of the Lesson · Course · Golfers bar: label + value, opening a small panel. */
export const SelectorCell = ({
    label,
    value,
    icon: Icon,
    isOpen,
    onOpenChange,
    align = "left",
    panelClassName,
    className,
    children,
}: {
    label: string;
    value: ReactNode;
    icon?: FC<{ className?: string }>;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    align?: "left" | "right";
    panelClassName?: string;
    className?: string;
    children: (close: () => void) => ReactNode;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const panelId = useId();
    useEffect(() => {
        if (!isOpen) return;
        const onDown = (e: PointerEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onOpenChange(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
        document.addEventListener("pointerdown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [isOpen, onOpenChange]);

    return (
        <div ref={ref} className={cx("min-w-0 md:relative", className)}>
            <AriaButton
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                onPress={() => onOpenChange(!isOpen)}
                className={cx(
                    "flex h-full w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition duration-100 ease-linear md:px-5 md:py-4",
                    isOpen ? "bg-secondary_hover" : "hover:bg-primary_hover",
                    "outline-none focus-visible:z-10 focus-visible:ring-4 focus-visible:ring-brand-300/60",
                )}
            >
                {Icon && <Icon className="hidden size-5 shrink-0 text-fg-quaternary lg:block" aria-hidden="true" />}
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className={cx(caps, "text-[11px] text-quaternary")}>{label}</span>
                    <span className="truncate text-md font-medium text-primary">{value}</span>
                </span>
                <ChevronDown className={cx("size-4 shrink-0 text-fg-quaternary transition duration-100 ease-linear", isOpen && "rotate-180")} aria-hidden="true" />
            </AriaButton>
            {isOpen && (
                <div
                    id={panelId}
                    role="dialog"
                    aria-label={label}
                    className={cx(
                        "absolute inset-x-0 top-full z-40 mt-2 rounded-xl bg-primary p-3 shadow-xl ring-1 ring-secondary_alt",
                        "md:inset-x-auto md:w-72",
                        align === "left" ? "md:left-0" : "md:right-0",
                        panelClassName,
                    )}
                >
                    {children(() => onOpenChange(false))}
                </div>
            )}
        </div>
    );
};

/** A row in a selector panel: label + detail, check when selected. */
export const MenuRow = ({ selected, onPress, label, detail, isDisabled }: { selected: boolean; onPress: () => void; label: ReactNode; detail?: ReactNode; isDisabled?: boolean }) => (
    <AriaButton
        onPress={onPress}
        isDisabled={isDisabled}
        aria-pressed={selected}
        className={cx(
            "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-md transition duration-100 ease-linear disabled:cursor-not-allowed disabled:opacity-50",
            selected ? "bg-active font-semibold text-primary" : "text-secondary hover:bg-primary_hover",
            focusRing,
        )}
    >
        <span className="min-w-0 flex-1">
            <span className="block truncate">{label}</span>
            {detail && <span className="block truncate text-sm font-normal text-tertiary">{detail}</span>}
        </span>
        {selected && <Check className="size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />}
    </AriaButton>
);

/* ------------------------------------------------------------------ */
/* People                                                              */
/* ------------------------------------------------------------------ */

const initialsOf = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

/** A golfer on the booking: initials (or a person glyph), with their number on the booking. */
export const PlayerAvatar = ({ number, name, size = "md" }: { number?: number; name?: string; size?: "sm" | "md" }) => (
    <span className="relative shrink-0">
        <span className={cx("flex items-center justify-center rounded-full bg-tertiary font-semibold text-secondary", size === "md" ? "size-10 text-sm" : "size-8 text-xs")}>
            {name?.trim() ? initialsOf(name) : <User01 className="size-5 text-fg-quaternary" aria-hidden="true" />}
        </span>
        {number != null && (
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-brand-solid text-[10px] font-semibold text-white ring-2 ring-bg-primary">
                {number}
            </span>
        )}
    </span>
);

export const YouTag = () => <span className="rounded-full bg-tertiary px-2 py-0.5 text-[11px] font-medium text-secondary">You</span>;

/* ------------------------------------------------------------------ */
/* Programs                                                            */
/* ------------------------------------------------------------------ */

/** "9 of 12 spots taken · 3 left" with a bar. */
export const SpotsMeter = ({ capacity, spotsLeft, noun = "spots", className }: { capacity: number; spotsLeft: number; noun?: string; className?: string }) => {
    const taken = capacity - spotsLeft;
    return (
        <div className={cx("flex flex-col gap-1.5", className)}>
            <div className="flex items-center justify-between text-sm">
                <span className="text-tertiary">
                    {taken} of {capacity} {noun} taken
                </span>
                <span className={cx("font-semibold tabular-nums", spotsLeft === 0 ? "text-error-primary" : spotsLeft <= 6 ? "text-warning-primary" : "text-primary")}>
                    {spotsLeft === 0 ? "Full" : `${spotsLeft} left`}
                </span>
            </div>
            <div role="progressbar" aria-valuemin={0} aria-valuemax={capacity} aria-valuenow={taken} aria-label={`${taken} of ${capacity} ${noun} taken`}>
                <ProgressBarBase value={taken} max={capacity} />
            </div>
        </div>
    );
};

/** − n + quantity stepper. */
export const Stepper = ({ value, onChange, min = 1, max, label }: { value: number; onChange: (n: number) => void; min?: number; max: number; label: string }) => {
    const btn = cx(
        "flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-fg-secondary ring-1 ring-primary ring-inset transition duration-100 ease-linear hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-50",
        focusRing,
    );
    return (
        <div role="group" aria-label={label} className="flex items-center gap-2">
            <AriaButton aria-label={`Fewer ${label.toLowerCase()}`} isDisabled={value <= min} onPress={() => onChange(value - 1)} className={btn}>
                <Minus className="size-4" aria-hidden="true" />
            </AriaButton>
            <span className="w-6 text-center text-md font-semibold text-primary tabular-nums" aria-live="polite">
                {value}
            </span>
            <AriaButton aria-label={`More ${label.toLowerCase()}`} isDisabled={value >= max} onPress={() => onChange(value + 1)} className={btn}>
                <Plus className="size-4" aria-hidden="true" />
            </AriaButton>
        </div>
    );
};

/** Ticked list ("What to bring", "Provided"). */
export const CheckList = ({ items }: { items: string[] }) => (
    <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                <span className="text-sm text-secondary">{item}</span>
            </li>
        ))}
    </ul>
);

/* ------------------------------------------------------------------ */
/* Confirmation actions                                                */
/* ------------------------------------------------------------------ */

const outlineBtn = cx(
    "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-md font-semibold text-secondary shadow-xs-skeuomorphic ring-1 ring-primary ring-inset transition duration-100 ease-linear hover:bg-primary_hover",
    focusRing,
);

/** "Add to calendar" with Google / Apple / Outlook (sample — remembers the choice). */
export const AddToCalendar = () => {
    const [added, setAdded] = useState<string | null>(null);
    return (
        <AriaMenuTrigger>
            <AriaButton className={outlineBtn}>
                {added ? <CalendarCheck01 className="size-5 text-fg-success-primary" aria-hidden="true" /> : <Calendar className="size-5 text-fg-quaternary" aria-hidden="true" />}
                {added ? `Added to ${added}` : "Add to calendar"}
            </AriaButton>
            <AriaPopover placement="bottom" offset={8} className="min-w-52 rounded-xl bg-primary p-1.5 shadow-lg ring-1 ring-secondary_alt outline-none">
                <AriaMenu aria-label="Add to calendar" onAction={(k) => setAdded(String(k))} className="outline-none">
                    {["Google Calendar", "Apple Calendar", "Outlook"].map((c) => (
                        <AriaMenuItem key={c} id={c} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-secondary outline-none data-[focused]:bg-primary_hover">
                            {c}
                        </AriaMenuItem>
                    ))}
                </AriaMenu>
            </AriaPopover>
        </AriaMenuTrigger>
    );
};

/** "Share" — copies the confirmation link (sample: flips to "Link copied"). */
export const ShareButton = () => {
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(t);
    }, [copied]);
    return (
        <AriaButton onPress={() => setCopied(true)} className={outlineBtn}>
            {copied ? <Link01 className="size-5 text-fg-success-primary" aria-hidden="true" /> : <Share07 className="size-5 text-fg-quaternary" aria-hidden="true" />}
            {copied ? "Link copied" : "Share"}
        </AriaButton>
    );
};
