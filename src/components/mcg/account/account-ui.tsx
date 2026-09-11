"use client";

/**
 * Shared pieces for the MCG account screens — the tiles, panels and rows the hub /
 * activity / wallet / settings pages all draw from, and the demo fixtures a signed-in
 * walkthrough needs before the golfer has booked anything.
 *
 * The account's own chrome (the left nav and the two-pane layout) lives in
 * `account-shell`; the signed-out invitation stays here because it is content, not
 * chrome — it replaces the whole page rather than sitting inside it.
 *
 * None of this lives in `mcg-chrome` on purpose: chrome is what every route shares,
 * and everything here is account-specific. The fixtures sit alongside the components
 * so a Storybook story can hand a screen a populated account without the prototype
 * session — the same markup, rendered from props instead of localStorage.
 */
import { type FC, type ReactNode, useEffect, useState } from "react";
import {
    ArrowRight,
    Calendar,
    CalendarCheck01,
    Flag06,
    GraduationHat01,
    InfoCircle,
    LogIn01,
    ShoppingBag03,
    Ticket02,
    Trophy01,
    UserPlus01,
    Users01,
} from "@untitledui/icons";
import Link from "next/link";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { mcgLogo } from "@/components/foundations/mcg/mcg-assets";
import { CREDIT_BALANCES, type CreditBalance, coachById, money } from "@/components/instruction/instruction-catalog";
import { cx } from "@/utils/cx";
import { type ActivityItem, type ActivityKind, type LessonCredit, type SessionUser, useSession } from "../session";

/* ------------------------------------------------------------------ */
/* Account facts                                                       */
/* ------------------------------------------------------------------ */

/** Seeded join date. A brand-new account (`isNew`) says "joined today" instead. */
export const MEMBER_SINCE = "March 2021";

/** The demo golfer's county record — what makes resident green fees apply. */
export const RESIDENT = {
    id: "MCG-RES-40218",
    zip: "20850",
    town: "Rockville, MD",
    verifiedOn: "Verified Sep 2, 2026",
    savings: "Save up to $18 a round at all nine county courses",
};

/* ------------------------------------------------------------------ */
/* Resident status                                                     */
/* ------------------------------------------------------------------ */

/**
 * Resident status now lives on the shared session, because resident pricing is a
 * tee-sheet concern before it is an account-page one: the same flag reprices every
 * course on /tee-times and at checkout. These wrappers keep the original call shape
 * so the account screens did not have to change.
 */
export const useResident = (initial = true): [boolean, (value: boolean) => void] => {
    const { isResident, setResident, ready } = useSession();
    // Before localStorage has been read, prefer the caller's optimistic default so a
    // signed-in demo doesn't flash the non-resident price.
    return [ready ? isResident : initial, setResident];
};

/** Clearing resident status is part of `reset()` now; kept for call-site compatibility. */
export const clearResident = () => {};

/* ------------------------------------------------------------------ */
/* Activity kinds                                                      */
/* ------------------------------------------------------------------ */

interface KindMeta {
    label: string;
    icon: FC<{ className?: string }>;
    tile: string;
    mark: string;
}

/** How each activity kind reads in a list — one icon, one tint, used everywhere. */
export const KIND: Record<ActivityKind, KindMeta> = {
    "tee-time": { label: "Tee time", icon: Flag06, tile: "bg-utility-green-50", mark: "text-utility-green-700" },
    lesson: { label: "Lesson", icon: GraduationHat01, tile: "bg-utility-blue-50", mark: "text-utility-blue-700" },
    clinic: { label: "Clinic", icon: Users01, tile: "bg-utility-purple-50", mark: "text-utility-purple-700" },
    event: { label: "Event", icon: Trophy01, tile: "bg-utility-orange-50", mark: "text-utility-orange-700" },
    purchase: { label: "Purchase", icon: ShoppingBag03, tile: "bg-utility-pink-50", mark: "text-utility-pink-700" },
    package: { label: "Package", icon: Ticket02, tile: "bg-utility-indigo-50", mark: "text-utility-indigo-700" },
    dining: { label: "Dining", icon: CalendarCheck01, tile: "bg-secondary_subtle", mark: "text-fg-secondary" },
};

/* ------------------------------------------------------------------ */
/* Demo fixtures                                                       */
/* ------------------------------------------------------------------ */

/**
 * A season of play across the county portfolio. Upcoming first, then the history a
 * returning golfer would actually have: rounds at five of the nine courses, a lesson
 * redeemed against a credit pack, a junior camp, and Pro Shop orders.
 */
export const DEMO_ACTIVITY: ActivityItem[] = [
    {
        id: "act-tee-needwood",
        kind: "tee-time",
        title: "Needwood — 18 holes",
        detail: "4 players · Riding cart",
        isoDate: "2026-09-12",
        dateLabel: "Sat, Sep 12",
        timeLabel: "7:40 AM",
        courseSlug: "needwood",
        amount: 148,
        status: "Upcoming",
    },
    {
        id: "act-lesson-martin",
        kind: "lesson",
        title: "45-Minute Private with Mike Kenny",
        detail: "Falls Road · Paid with 1 lesson credit",
        isoDate: "2026-09-15",
        dateLabel: "Tue, Sep 15",
        timeLabel: "4:30 PM",
        courseSlug: "falls-road",
        status: "Upcoming",
    },
    {
        id: "act-clinic-shortgame",
        kind: "clinic",
        title: "Short Game School — week 1 of 4",
        detail: "Little Bennett · Wednesdays through Oct 7",
        isoDate: "2026-09-16",
        dateLabel: "Wed, Sep 16",
        timeLabel: "6:00 PM",
        courseSlug: "little-bennett",
        amount: 180,
        status: "Upcoming",
    },
    {
        id: "act-dining-grill",
        kind: "dining",
        title: "The Grill at Falls Road",
        detail: "Party of 4 · Patio",
        isoDate: "2026-09-18",
        dateLabel: "Fri, Sep 18",
        timeLabel: "6:30 PM",
        courseSlug: "falls-road",
        status: "Upcoming",
    },
    {
        id: "act-event-scramble",
        kind: "event",
        title: "Fall Member-Guest Scramble",
        detail: "Hampshire Greens · Shotgun start, two-person teams",
        isoDate: "2026-09-26",
        dateLabel: "Sat, Sep 26",
        timeLabel: "9:00 AM",
        courseSlug: "hampshire-greens",
        amount: 95,
        status: "Upcoming",
    },
    {
        id: "act-tee-laytonsville",
        kind: "tee-time",
        title: "Laytonsville — 18 holes",
        detail: "2 players · Walking",
        isoDate: "2026-08-30",
        dateLabel: "Sun, Aug 30",
        timeLabel: "8:20 AM",
        courseSlug: "laytonsville",
        amount: 72,
        status: "Completed",
    },
    {
        id: "act-purchase-prov1",
        kind: "purchase",
        title: "Pro Shop — Titleist Pro V1 (dozen)",
        detail: "Order #MCG-10432 · Picked up at Needwood",
        isoDate: "2026-08-24",
        dateLabel: "Mon, Aug 24",
        amount: 54.99,
        status: "Completed",
    },
    {
        id: "act-lesson-doug",
        kind: "lesson",
        title: "45-Minute Private with Doug Hamilton",
        detail: "Little Bennett · Redeemed 1 lesson credit",
        isoDate: "2026-08-18",
        dateLabel: "Tue, Aug 18",
        timeLabel: "5:15 PM",
        courseSlug: "little-bennett",
        status: "Completed",
    },
    {
        id: "act-tee-crossvines",
        kind: "tee-time",
        title: "The Crossvines Golf — 18 holes",
        detail: "3 players · Riding cart",
        isoDate: "2026-08-09",
        dateLabel: "Sun, Aug 9",
        timeLabel: "9:10 AM",
        courseSlug: "crossvines",
        amount: 135,
        status: "Completed",
    },
    {
        id: "act-tee-northwest-cancelled",
        kind: "tee-time",
        title: "Northwest — 18 holes",
        detail: "4 players · Cancelled for storms, refunded in full",
        isoDate: "2026-08-02",
        dateLabel: "Sun, Aug 2",
        timeLabel: "7:00 AM",
        courseSlug: "northwest",
        amount: 136,
        status: "Cancelled",
    },
    {
        id: "act-clinic-junior",
        kind: "clinic",
        title: "Junior Golf Camp — week 3",
        detail: "Northwest · Ages 9–12",
        isoDate: "2026-07-20",
        dateLabel: "Mon, Jul 20",
        timeLabel: "9:00 AM",
        courseSlug: "northwest",
        amount: 225,
        status: "Completed",
    },
    {
        id: "act-purchase-glove",
        kind: "purchase",
        title: "Pro Shop — FootJoy StaSof glove",
        detail: "Order #MCG-10318 · Shipped",
        isoDate: "2026-07-29",
        dateLabel: "Wed, Jul 29",
        amount: 27,
        status: "Completed",
    },
    {
        id: "act-dining-needwood",
        kind: "dining",
        title: "The Grill at Needwood",
        detail: "Party of 2 · After the morning round",
        isoDate: "2026-07-12",
        dateLabel: "Sun, Jul 12",
        timeLabel: "1:15 PM",
        courseSlug: "needwood",
        amount: 58.4,
        status: "Completed",
    },
];

/**
 * The seeded credit packs, in the session's shape. `CreditBalance` carries redemption
 * history and `LessonCredit` does not, so the history is re-attached on the way back
 * out (see `toCreditBalance`) rather than duplicated here.
 */
export const DEMO_CREDITS: LessonCredit[] = CREDIT_BALANCES.map(({ history: _history, ...credit }) => credit);

/** Pro Shop product ids the demo golfer has hearted. */
export const DEMO_SAVED = ["pv1-dozen", "mcg-quarter-zip", "sun-mountain-cart-bag", "footjoy-stasof"];

export const RECENT_ORDERS = [
    { id: "MCG-10432", date: "Sep 2, 2026", summary: "Titleist Pro V1 (dozen) · MCG logo hat", total: 81.99, status: "Picked up at Needwood" },
    { id: "MCG-10318", date: "Aug 12, 2026", summary: "MCG quarter-zip, Medium", total: 64.0, status: "Shipped" },
    { id: "MCG-10190", date: "Jul 19, 2026", summary: "Range pass — 10 large buckets", total: 80.0, status: "6 buckets left" },
];

export const PAYMENT_METHODS = [
    { brand: "visa" as const, last4: "4242", expiry: "09 / 28", isDefault: true },
    { brand: "mastercard" as const, last4: "8813", expiry: "02 / 27", isDefault: false },
];

export const GIFT_CARD = {
    balance: 75,
    code: "MCG-GC-4471-2290",
    history: [
        { date: "Aug 24, 2026", label: "Pro Shop — Titleist Pro V1", amount: -25 },
        { date: "Jun 6, 2026", label: "Gift card added (Father’s Day)", amount: 100 },
    ],
};

/** Where the hub sends a golfer next. Ordered the way the nav is. */
export const QUICK_LINKS: { label: string; href: string; blurb: string; icon: FC<{ className?: string }> }[] = [
    { label: "Book a tee time", href: "/tee-times", blurb: "Nine county courses on one tee sheet", icon: Flag06 },
    { label: "Shop the Pro Shop", href: "/shop", blurb: "Balls, gloves, apparel — pick up at any course", icon: ShoppingBag03 },
    { label: "Book a lesson", href: "/instruction", blurb: "Privates, playing lessons and clinics", icon: GraduationHat01 },
    { label: "Events & leagues", href: "/events", blurb: "Scrambles, outings and county championships", icon: Trophy01 },
    { label: "County calendar", href: "/calendar", blurb: "Everything happening across the portfolio", icon: Calendar },
    { label: "The Grill", href: "/grill", blurb: "Reserve a table before or after the round", icon: CalendarCheck01 },
];

/* ------------------------------------------------------------------ */
/* Derivations                                                         */
/* ------------------------------------------------------------------ */

/** Re-attach the seeded redemption history so `CreditCardPanel` can render a pack. */
export const toCreditBalance = (credit: LessonCredit): CreditBalance => ({
    ...credit,
    history: CREDIT_BALANCES.find((balance) => balance.id === credit.id)?.history ?? [],
});

/** Only credits whose instructor resolves — `CreditCardPanel` needs a real coach. */
export const renderableCredits = (credits: LessonCredit[]): LessonCredit[] => credits.filter((credit) => Boolean(coachById(credit.coachId)));

export const upcomingOf = (activity: ActivityItem[]): ActivityItem[] =>
    activity.filter((item) => item.status === "Upcoming").sort((a, b) => a.isoDate.localeCompare(b.isoDate));

/** Anything not upcoming is history — completed and cancelled alike, newest first. */
export const pastOf = (activity: ActivityItem[]): ActivityItem[] =>
    activity.filter((item) => item.status !== "Upcoming").sort((a, b) => b.isoDate.localeCompare(a.isoDate));

export const creditsRemaining = (credits: LessonCredit[]): number => credits.reduce((sum, credit) => sum + credit.creditsRemaining, 0);

export const countOf = (activity: ActivityItem[], kind: ActivityKind): number =>
    activity.filter((item) => item.kind === kind && item.status === "Completed").length;

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/** Initials tile, tinted with the MCG green the shell already sets. */
export const Initials = ({ user, size = "md" }: { user: SessionUser; size?: "md" | "lg" }) => (
    <span
        className={cx(
            "flex shrink-0 items-center justify-center rounded-full bg-brand-solid font-semibold text-white",
            size === "lg" ? "size-16 text-xl" : "size-12 text-md",
        )}
        aria-hidden="true"
    >
        {user.initials}
    </span>
);

/** A titled card. `flush` hands the body its own padding — for divided lists. */
export const Panel = ({ title, sub, action, flush, children }: { title: string; sub?: string; action?: ReactNode; flush?: boolean; children: ReactNode }) => (
    <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-primary">{title}</h2>
                {sub && <p className="text-sm text-tertiary">{sub}</p>}
            </div>
            {action}
        </div>
        <div className={cx("rounded-2xl bg-primary ring-1 ring-secondary ring-inset", !flush && "p-5")}>{children}</div>
    </section>
);

export const StatTile = ({ icon: Icon, label, value, sub }: { icon: FC<{ className?: string }>; label: string; value: string; sub?: string }) => (
    <div className="rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
        <div className="flex items-center gap-1.5 text-tertiary">
            <Icon className="size-4 text-fg-quaternary" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wide uppercase">{label}</span>
        </div>
        <p className="mt-2 text-display-xs font-semibold text-primary tabular-nums">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-tertiary">{sub}</p>}
    </div>
);

const STATUS_COLOR = { Upcoming: "success", Completed: "gray", Cancelled: "error" } as const;

export const StatusBadge = ({ status }: { status: ActivityItem["status"] }) => (
    <Badge color={STATUS_COLOR[status]} size="sm" type="pill-color">
        {status}
    </Badge>
);

/** One line of history — the same row on the hub and on the full Activity page. */
export const ActivityRow = ({ item, showStatus = true }: { item: ActivityItem; showStatus?: boolean }) => {
    const meta = KIND[item.kind];
    return (
        <div className="flex items-center gap-3.5 px-5 py-4">
            <span className={cx("flex size-10 shrink-0 items-center justify-center rounded-lg", meta.tile)}>
                <meta.icon className={cx("size-5", meta.mark)} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-primary">{item.title}</p>
                <p className="truncate text-sm text-tertiary">
                    {item.dateLabel}
                    {item.timeLabel ? ` · ${item.timeLabel}` : ""} · {item.detail}
                </p>
            </div>
            {item.amount !== undefined && (
                <span className="hidden shrink-0 text-sm font-semibold text-primary tabular-nums sm:block">{money(item.amount)}</span>
            )}
            {showStatus && <StatusBadge status={item.status} />}
        </div>
    );
};

/** An empty list that still tells the golfer what to do next. */
export const EmptyState = ({ icon: Icon, title, blurb, actions }: { icon: FC<{ className?: string }>; title: string; blurb: string; actions?: ReactNode }) => (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <span className="bg-secondary_subtle flex size-12 items-center justify-center rounded-full ring-1 ring-secondary ring-inset">
            <Icon className="size-6 text-fg-quaternary" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
            <p className="text-md font-semibold text-primary">{title}</p>
            <p className="mx-auto max-w-md text-sm text-tertiary">{blurb}</p>
        </div>
        {actions && <div className="mt-2 flex flex-wrap justify-center gap-2.5">{actions}</div>}
    </div>
);

/* ------------------------------------------------------------------ */
/* Account chrome                                                      */
/* ------------------------------------------------------------------ */

/**
 * What an account page shows when nobody is signed in. Browsing the prototype is
 * never gated, so this is an invitation rather than a wall: sign in, create an
 * account, or carry on to the parts of the site that need neither.
 */
export const SignedOut = ({ title, blurb }: { title: string; blurb: string }) => (
    <>
        <div className="border-b border-secondary bg-primary px-6 py-9 sm:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <h1 className="text-display-sm font-semibold text-primary">{title}</h1>
                <p className="mt-2 max-w-2xl text-md text-tertiary">{blurb}</p>
            </div>
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10 sm:px-8">
            <div className="flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                <div className="flex flex-col gap-1.5">
                    <p className="text-lg font-semibold text-primary">Sign in to Montgomery County Golf</p>
                    <p className="text-sm text-tertiary">
                        One account covers all nine county courses — your tee times, lesson credits, Pro Shop orders and resident rate live together.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    <Button href="/signin" size="lg" iconLeading={LogIn01}>
                        Sign in
                    </Button>
                    <Button href="/signup" size="lg" color="secondary" iconLeading={UserPlus01}>
                        Create an account
                    </Button>
                </div>
                <p className="text-xs text-tertiary">Prototype — any email and password will sign you in.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {QUICK_LINKS.slice(0, 4).map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 rounded-2xl bg-primary p-4 ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand"
                    >
                        <link.icon className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-primary">{link.label}</span>
                            <span className="block truncate text-xs text-tertiary">{link.blurb}</span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    </Link>
                ))}
            </div>
        </div>
    </>
);

/* ------------------------------------------------------------------ */
/* Auth chrome                                                         */
/* ------------------------------------------------------------------ */

/** The elevated card every auth screen sits in, centred in the shell. */
export const AuthCard = ({ children, width = "md" }: { children: ReactNode; width?: "sm" | "md" }) => (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6">
        <div className={cx("w-full rounded-2xl bg-primary px-6 py-8 shadow-lg ring-1 ring-secondary sm:px-8", width === "sm" ? "max-w-sm" : "max-w-md")}>
            {children}
        </div>
    </div>
);

/** Logo + heading + sub, shared by sign in / sign up / verify / reset. */
export const AuthHeading = ({ title, blurb }: { title: string; blurb: ReactNode }) => (
    <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-secondary_subtle flex size-14 items-center justify-center rounded-2xl ring-1 ring-secondary ring-inset">
            <McgMark />
        </span>
        <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold text-primary">{title}</h1>
            <p className="text-md text-tertiary">{blurb}</p>
        </div>
    </div>
);

const McgMark = () => <img src={mcgLogo} alt="" className="h-8 w-auto" />;

/**
 * The standing note that nothing here is real. Every auth screen carries it, so a
 * stakeholder clicking through never wonders which password to use.
 */
export const PrototypeHint = ({ children }: { children: ReactNode }) => (
    <div className="bg-secondary_subtle flex items-start gap-2.5 rounded-xl px-4 py-3 ring-1 ring-secondary ring-inset">
        <InfoCircle className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <p className="text-xs text-tertiary">{children}</p>
    </div>
);
