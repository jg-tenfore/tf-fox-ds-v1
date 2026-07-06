import type { FC, ReactNode } from "react";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

/** Shared building blocks for the Profile bucket pages — consistent panels, tiles, avatars, and pills. */

export const money = (n: number) => `$${n.toFixed(2)}`;

/** A titled card section, optionally with a right-aligned action. */
export const Panel = ({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) => (
    <section>
        <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-display-xs font-semibold text-primary">{title}</h2>
            {action}
        </div>
        <div className="rounded-2xl bg-primary px-5 ring-1 ring-secondary ring-inset">{children}</div>
    </section>
);

/** A compact stat card. */
export const StatTile = ({ icon: Icon, label, value, sub }: { icon: FC<{ className?: string }>; label: string; value: string; sub?: string }) => (
    <div className="rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
        <div className="flex items-center gap-1.5 text-tertiary">
            <Icon className="size-4 text-fg-quaternary" aria-hidden="true" />
            <span className="text-xs font-medium tracking-wide uppercase">{label}</span>
        </div>
        <p className="mt-2 text-display-xs font-semibold text-primary tabular-nums">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-tertiary">{sub}</p>}
    </div>
);

export const Avatar = ({ initials, className }: { initials: string; className?: string }) => (
    <span className={cx("flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-brand-secondary ring-1 ring-secondary ring-inset", className)}>
        {initials}
    </span>
);

type Status = "Upcoming" | "Completed" | "Cancelled" | "Active" | "Paid" | "Pending";
const STATUS_COLOR: Record<Status, "success" | "gray" | "error" | "warning"> = {
    Upcoming: "success",
    Active: "success",
    Paid: "success",
    Completed: "gray",
    Cancelled: "error",
    Pending: "warning",
};

export const StatusBadge = ({ status }: { status: Status }) => (
    <Badge color={STATUS_COLOR[status]} size="sm" type="pill-color">
        {status}
    </Badge>
);

/** A segmented pill filter. */
export const Segmented = <T extends string>({ options, value, onChange }: { options: { key: T; label: string }[]; value: T; onChange: (k: T) => void }) => (
    <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
            <button
                key={o.key}
                type="button"
                onClick={() => onChange(o.key)}
                className={cx(
                    "rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
                    value === o.key ? "bg-primary-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
                )}
            >
                {o.label}
            </button>
        ))}
    </div>
);

/** A simple left-to-right progress bar (0–1). */
export const Progress = ({ value }: { value: number }) => (
    <div className="h-2 w-full overflow-hidden rounded-full bg-quaternary">
        <div className="h-full rounded-full bg-brand-solid" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </div>
);
