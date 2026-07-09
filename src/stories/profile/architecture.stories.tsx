import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { FC } from "react";
import {
    ArrowRight,
    Award01,
    BarChartSquare02,
    CalendarCheck01,
    CalendarHeart01,
    ChevronDown,
    ChevronRight,
    CoinsStacked01,
    CreditCard01,
    File02,
    Flag06,
    Gift01,
    LogOut01,
    Monitor01,
    Package,
    Receipt,
    ShoppingBag01,
    Ticket02,
    TrendUp02,
    Trophy01,
    Users01,
} from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { MEMBERSHIP_ITEM, NAV } from "./profile-shell";

/**
 * "Profile / Architecture" — two side-by-side comparisons of the member account:
 * (1) the navigation (14-item menu → 6 buckets) and (2) the account page itself
 * (page-per-setting → grouped inline edit), plus a full old→new mapping.
 */
const meta: Meta = { title: "Profile ∕ Account/*Architecture*", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

type Icon = FC<{ className?: string }>;

const OLD: { label: string; Icon: Icon; children?: { label: string; Icon: Icon }[] }[] = [
    { label: "Dashboard", Icon: BarChartSquare02 },
    { label: "Purchase History", Icon: ShoppingBag01, children: [
        { label: "Member Charges", Icon: Receipt },
        { label: "Orders", Icon: Package },
        { label: "Member Spending", Icon: TrendUp02 },
    ] },
    { label: "Reservations", Icon: CalendarCheck01, children: [
        { label: "Tee Times", Icon: Flag06 },
        { label: "Simulator Bays", Icon: Monitor01 },
        { label: "Activities", Icon: Trophy01 },
        { label: "Restaurants", Icon: Ticket02 },
    ] },
    { label: "Golf Buddies", Icon: Users01 },
    { label: "Statements", Icon: File02 },
    { label: "My Balance", Icon: CoinsStacked01 },
    { label: "Gift Cards", Icon: Gift01 },
    { label: "Punch Cards", Icon: Ticket02 },
    { label: "Events", Icon: CalendarHeart01 },
    { label: "Payment Methods", Icon: CreditCard01 },
    { label: "Memberships", Icon: Award01 },
    { label: "Documents", Icon: File02 },
    { label: "Log Out", Icon: LogOut01 },
];

const MAP: [string, string][] = [
    ["Dashboard", "Overview"],
    ["Member Charges", "Activity › Purchase history"],
    ["Orders", "Activity › Purchase history"],
    ["Member Spending", "Activity › Purchase history"],
    ["Tee Times", "Activity › Reservations"],
    ["Simulator Bays", "Activity › Reservations"],
    ["Activities", "Activity › Reservations"],
    ["Restaurants", "Activity › Reservations"],
    ["Statements", "Activity › Statements"],
    ["My Balance", "Wallet"],
    ["Gift Cards", "Wallet"],
    ["Punch Cards", "Wallet"],
    ["Golf Buddies", "Golf Buddies"],
    ["Events", "Events"],
    ["Payment Methods", "My Account"],
    ["Documents", "My Account"],
    ["Memberships", "Memberships — own pinned section"],
    ["Log Out", "Unchanged — sign-out action"],
];

const SectionLabel = ({ n, title, note }: { n: string; title: string; note: string }) => (
    <div className="mt-12 mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-quaternary uppercase">
            {n} · {title}
        </h2>
        <p className="mt-1 max-w-xl text-sm text-tertiary">{note}</p>
    </div>
);

const PanelHeader = ({ eyebrow, count, title, tone }: { eyebrow: string; count: string; title: string; tone: "old" | "new" }) => (
    <div className="mb-3 flex items-center justify-between">
        <div>
            <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">{eyebrow}</p>
            <p className="text-sm font-semibold text-primary">{title}</p>
        </div>
        <span className={cx("rounded-full px-2.5 py-1 text-xs font-semibold", tone === "new" ? "bg-brand-primary text-brand-secondary" : "bg-secondary text-secondary")}>{count}</span>
    </div>
);

/* ---- Comparison 1: navigation ---- */

const NavCompare = () => (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
            <PanelHeader eyebrow="Before" title="Member menu" count="14 items" tone="old" />
            <nav className="flex flex-col gap-0.5">
                {OLD.map((o) => (
                    <div key={o.label}>
                        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
                            <o.Icon className="size-4.5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            <span className="flex-1 text-sm font-medium text-secondary">{o.label}</span>
                            {o.children && <ChevronDown className="size-4 text-fg-quaternary" aria-hidden="true" />}
                        </div>
                        {o.children && (
                            <div className="mb-1 ml-4 flex flex-col gap-0.5 border-l border-secondary pl-2.5">
                                {o.children.map((c) => (
                                    <div key={c.label} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5">
                                        <c.Icon className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                        <span className="text-sm text-tertiary">{c.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </div>

        <div className="hidden items-center justify-center self-center md:flex">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-primary">
                <ArrowRight className="size-5 text-fg-brand-primary" aria-hidden="true" />
            </span>
        </div>

        <div className="rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
            <PanelHeader eyebrow="After" title="My Profile" count="6 buckets + 1 pinned" tone="new" />
            <nav className="flex flex-col gap-0.5">
                {[...NAV, MEMBERSHIP_ITEM].map((n) => (
                    <div key={n.key}>
                        {/* Memberships is a sales-oriented item pinned below the 6 buckets — set it off with a rule */}
                        {n.key === "memberships" && <div className="my-1.5 border-t border-secondary" />}
                        <div className="flex items-start gap-2.5 rounded-lg px-2.5 py-2">
                            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-primary">
                                <n.Icon className="size-4 text-fg-brand-primary" aria-hidden="true" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-primary">{n.label}</p>
                                <p className="text-xs text-tertiary">{n.note}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    </div>
);

/* ---- Comparison 2: the account page (mini screen previews) ---- */

const WindowDots = () => (
    <div className="flex gap-1.5 border-b border-secondary px-3 py-2">
        <span className="size-2 rounded-full bg-quaternary" />
        <span className="size-2 rounded-full bg-quaternary" />
        <span className="size-2 rounded-full bg-quaternary" />
    </div>
);

const OldScreen = () => (
    <div className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary">
        <WindowDots />
        <div className="flex">
            <div className="w-28 shrink-0 border-r border-secondary p-2">
                {OLD.map((o) => (
                    <div
                        key={o.label}
                        className={cx("truncate rounded px-1.5 py-1 text-[10px] font-medium", o.label === "Payment Methods" ? "bg-primary-solid text-white" : "text-secondary")}
                    >
                        {o.label}
                    </div>
                ))}
            </div>
            <div className="flex-1 p-3">
                <p className="text-xs font-semibold text-primary">Account settings</p>
                <div className="mt-2 flex flex-col divide-y divide-secondary">
                    {["Payment Methods", "Memberships", "Documents", "Statements", "Gift Cards"].map((r) => (
                        <div key={r} className="flex items-center justify-between py-2">
                            <span className="text-[11px] text-secondary">{r}</span>
                            <ChevronRight className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const NewScreen = () => (
    <div className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary">
        <WindowDots />
        <div className="flex">
            <div className="flex w-28 shrink-0 flex-col gap-1 border-r border-secondary p-2">
                {NAV.map((n) => (
                    <div key={n.key} className={cx("flex items-center gap-1.5 rounded px-1.5 py-1", n.key === "account" && "bg-active")}>
                        <n.Icon className={cx("size-3 shrink-0", n.key === "account" ? "text-fg-brand-primary" : "text-fg-quaternary")} aria-hidden="true" />
                        <span className={cx("truncate text-[10px]", n.key === "account" ? "font-semibold text-primary" : "font-medium text-secondary")}>{n.label}</span>
                    </div>
                ))}
                <div className="my-0.5 border-t border-secondary" />
                <div className="flex items-center gap-1.5 rounded px-1.5 py-1">
                    <MEMBERSHIP_ITEM.Icon className="size-3 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    <span className="truncate text-[10px] font-medium text-secondary">{MEMBERSHIP_ITEM.label}</span>
                </div>
            </div>
            <div className="flex-1 p-3">
                <p className="text-xs font-semibold text-primary">Personal information</p>
                <div className="mt-2 flex flex-col divide-y divide-secondary">
                    {[
                        ["Legal name", "Justin Girard"],
                        ["Email", "hello@girardjustin.com"],
                        ["Phone", "+1 ··· 7879"],
                    ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between gap-2 py-2">
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold text-primary">{k}</p>
                                <p className="truncate text-[10px] text-tertiary">{v}</p>
                            </div>
                            <span className="shrink-0 text-[10px] font-semibold text-secondary underline">Edit</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const PageCompare = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
            <OldScreen />
            <p className="mt-2 text-xs text-tertiary">
                <span className="font-semibold text-secondary">Before</span> — long menu, a separate page per setting.
            </p>
        </div>
        <div>
            <NewScreen />
            <p className="mt-2 text-xs text-tertiary">
                <span className="font-semibold text-secondary">After</span> — short menu, grouped fields edited inline.
            </p>
        </div>
    </div>
);

const ArchitectureScreen = () => (
    <div className="min-h-dvh bg-secondary">
        <div className="mx-auto max-w-5xl px-6 py-12">
            <header>
                <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Profile · Information architecture</p>
                <h1 className="mt-1 text-display-sm font-semibold text-primary">Old account vs. new account</h1>
                <p className="mt-2 max-w-2xl text-md text-tertiary">
                    Two comparisons of the member area — the navigation and the page itself. The legacy area was a flat list of{" "}
                    <span className="font-semibold text-secondary">14 items</span> with a page per setting; the new one is{" "}
                    <span className="font-semibold text-secondary">6 buckets</span> with grouped, inline editing. Nothing was removed, just regrouped.
                </p>
            </header>

            <SectionLabel n="1" title="Navigation" note="The 14-item menu collapses into 6 buckets — less to scan, member settings together." />
            <NavCompare />

            <SectionLabel n="2" title="The account page" note="Same content on a calmer surface: a shorter menu, and inline editing instead of drilling into a page per setting." />
            <PageCompare />

            <section className="mt-12">
                <h2 className="mb-4 text-sm font-semibold tracking-wide text-quaternary uppercase">Full mapping</h2>
                <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary text-xs tracking-wide text-quaternary uppercase">
                            <tr>
                                <th className="px-4 py-2.5 font-semibold">Legacy item</th>
                                <th className="px-4 py-2.5 font-semibold">Now lives in</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary bg-primary">
                            {MAP.map(([oldItem, newHome]) => (
                                <tr key={oldItem}>
                                    <td className="px-4 py-2.5 font-medium whitespace-nowrap text-secondary">{oldItem}</td>
                                    <td className="px-4 py-2.5 text-tertiary">{newHome}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
);

export const Default: Story = { name: "*Architecture*", render: () => <ArchitectureScreen /> };
