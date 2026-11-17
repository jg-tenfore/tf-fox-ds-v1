"use client";

import type { FC, ReactNode } from "react";
import { ArrowLeft, CheckCircle } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { CREDIT_TERM, coachById, expiryAfter, expiryIfBoughtToday, type Coach } from "../data";
import { CoachAvatar, caps, focusRing } from "../kit";
import { InstructionLink } from "../nav";

/**
 * Small building blocks shared by Packages & credits (and exported for the instructor profile).
 * Ported from the Crane MCG prototype's `packages/packages-ui.tsx` (itself a port of this
 * prototype's `instruction-ui.tsx` pieces), restyled with Fox tokens. `CoachAvatar`, `CourseChip`
 * and `MetaLine` come from the shared Instruction kit (`../kit`).
 */

/** Uppercase micro-label ("LESSONS REMAINING"). */
export const MicroLabel = ({ children, className }: { children: ReactNode; className?: string }) => <span className={cx(caps, "text-quaternary", className)}>{children}</span>;

/** The coach for an id — packages always point at a real instructor. */
export const coachFor = (id: string): Coach => coachById(id)!;

/** A coach's headshot (or initials) — the kit avatar fed from a `Coach`. `lg` is the detail-page size. */
export const PackCoachAvatar = ({ coach, size = "md", className }: { coach: Pick<Coach, "name" | "initials" | "photo">; size?: "sm" | "md" | "lg"; className?: string }) => (
    <CoachAvatar photo={coach.photo} initials={coach.initials} size={size === "lg" ? "xl" : size} className={className} />
);

/** One dot per lesson credit: filled = still available. */
export const CreditDots = ({ total, remaining, size = "md", muted }: { total: number; remaining: number; size?: "sm" | "md"; muted?: boolean }) => (
    <span className="flex flex-wrap items-center gap-1.5" role="img" aria-label={`${remaining} of ${total} lesson credits remaining`}>
        {Array.from({ length: total }, (_, i) => (
            <span
                key={i}
                className={cx(
                    "shrink-0 rounded-full",
                    size === "sm" ? "size-2.5" : "size-3",
                    i < remaining ? (muted ? "bg-fg-quaternary" : "bg-fg-brand-primary") : "bg-primary ring-1 ring-primary ring-inset",
                )}
            />
        ))}
    </span>
);

/** How it works / What's included / Restrictions — policy as a list. */
export const PolicyList = ({ title, items, tone = "good" }: { title: string; items: string[]; tone?: "good" | "limit" }) => (
    <div className="flex flex-col gap-2.5">
        <MicroLabel>{title}</MicroLabel>
        <ul className="flex flex-col gap-2">
            {items.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-md text-secondary">
                    <span className={cx("mt-2 size-1.5 shrink-0 rounded-full", tone === "good" ? "bg-fg-brand-primary" : "bg-fg-warning-secondary")} aria-hidden="true" />
                    {t}
                </li>
            ))}
        </ul>
    </div>
);

/** A labelled number tile ("PER LESSON $99 · Normally $110"). */
export const Fact = ({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) => (
    <div className="flex flex-col gap-1 rounded-xl bg-secondary px-4 py-3.5">
        <MicroLabel>{label}</MicroLabel>
        <span className="text-xl font-semibold text-primary tabular-nums">{value}</span>
        {sub && <span className="text-sm text-tertiary">{sub}</span>}
    </div>
);

/** Green "you save" callout. */
export const SavingNote = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cx("flex items-start gap-2.5 rounded-xl bg-success-primary px-4 py-3", className)}>
        <CheckCircle className="mt-0.5 size-4 shrink-0 text-fg-success-secondary" aria-hidden="true" />
        <p className="text-sm text-success-primary">{children}</p>
    </div>
);

/** One line of an order summary. */
export const SummaryLine = ({ label, value, strong, tone }: { label: ReactNode; value: ReactNode; strong?: boolean; tone?: "success" | "muted" }) => (
    <div className="flex items-start justify-between gap-4 py-1">
        <span className={cx("text-md", strong ? "font-semibold text-primary" : "text-tertiary")}>{label}</span>
        <span
            className={cx(
                "shrink-0 text-right tabular-nums",
                strong
                    ? "text-lg font-bold text-brand-secondary"
                    : tone === "success"
                      ? "text-md font-medium text-success-primary"
                      : tone === "muted"
                        ? "text-md text-quaternary line-through"
                        : "text-md font-medium text-primary",
            )}
        >
            {value}
        </span>
    </div>
);

/**
 * "Expires 1 year after purchase" (catalog) / "Expires Oct 9, 2027 · 1 year after purchase" (once there's a
 * purchase date — pass `purchased`, or `true` for today) / "No expiry".
 */
export const useByLabel = (expiration?: string, purchased?: Date | string | true) => {
    if (!expiration || expiration === "No expiration") return "No expiry";
    if (expiration !== CREDIT_TERM) return `Use by ${expiration}`;
    if (!purchased) return `Expires ${CREDIT_TERM}`;
    return `Expires ${purchased === true ? expiryIfBoughtToday() : expiryAfter(purchased)} · ${CREDIT_TERM}`;
};

/** "5 lessons" / "1 lesson". */
export const lessonsLabel = (n: number) => `${n} ${n === 1 ? "lesson" : "lessons"}`;

/* ------------------------------------------------------------------ */
/* Page furniture (Crane's PageHeader / Panel / EmptyBlock, in Fox type) */
/* ------------------------------------------------------------------ */

/** "← Instruction" style back link. */
export const BackLink = ({ href, children }: { href: string; children: ReactNode }) => (
    <InstructionLink href={href} className={cx("inline-flex items-center gap-1.5 self-start rounded text-sm font-semibold text-brand-secondary hover:underline", focusRing)}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        {children}
    </InstructionLink>
);

/** Back link, eyebrow, title (+ actions on the right from desktop up), subtitle. */
export const PageHeader = ({ back, eyebrow, title, subtitle, actions }: { back?: ReactNode; eyebrow?: string; title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) => (
    <header className="flex flex-col gap-5">
        {back}
        <div className="flex flex-col gap-2">
            {eyebrow && <p className="text-xs font-semibold tracking-wide text-brand-secondary uppercase">{eyebrow}</p>}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <h1 className="text-display-sm font-semibold text-primary">{title}</h1>
                {actions}
            </div>
            {subtitle && <p className="max-w-4xl text-md text-tertiary">{subtitle}</p>}
        </div>
    </header>
);

/** A white card, optionally with a titled header row. */
export const Panel = ({ title, children, className, bodyClassName }: { title?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) => (
    <section className={cx("flex flex-col rounded-2xl bg-primary ring-1 ring-secondary ring-inset", className)}>
        {title && (
            <header className="border-b border-secondary px-5 py-4">
                <h2 className="text-lg font-semibold text-primary">{title}</h2>
            </header>
        )}
        <div className={bodyClassName}>{children}</div>
    </section>
);

/** A titled section inside a `Panel` (checkout): label, optional right-hand note, content. */
export const PanelSection = ({ label, right, children, className }: { label: ReactNode; right?: ReactNode; children?: ReactNode; className?: string }) => (
    <section className={cx("flex flex-col gap-3 px-5 py-5 md:px-6", className)}>
        <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-primary">{label}</h2>
            {right}
        </div>
        {children}
    </section>
);

/** Icon + one callout ("Why packages are tied to an instructor"). */
export const InfoNote = ({ icon: Icon, title, children, tone = "plain", className }: { icon: FC<{ className?: string }>; title: ReactNode; children: ReactNode; tone?: "plain" | "warning"; className?: string }) => (
    <div className={cx("flex items-start gap-3 rounded-2xl p-5", tone === "warning" ? "bg-warning-primary" : "bg-primary ring-1 ring-secondary ring-inset", className)}>
        <Icon className={cx("mt-0.5 size-5 shrink-0", tone === "warning" ? "text-fg-warning-primary" : "text-fg-brand-primary")} aria-hidden="true" />
        <div className="flex min-w-0 flex-col gap-1">
            <p className={cx("text-md font-semibold", tone === "warning" ? "text-warning-primary" : "text-primary")}>{title}</p>
            <div className={cx("max-w-3xl text-md", tone === "warning" ? "text-warning-primary" : "text-tertiary")}>{children}</div>
        </div>
    </div>
);

/** A quiet text link ("Terms", "Read the terms"). */
export const TextAction = ({ href, children }: { href: string; children: ReactNode }) => (
    <InstructionLink href={href} className={cx("rounded text-sm font-semibold text-brand-secondary hover:underline", focusRing)}>
        {children}
    </InstructionLink>
);
