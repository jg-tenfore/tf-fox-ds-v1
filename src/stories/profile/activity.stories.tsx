import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { FC } from "react";
import { useState } from "react";
import { CalendarCheck01, Download01, File02, Flag06, Monitor01, TrendUp02, Trophy01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { ProfileShell } from "./profile-shell";
import { money, Panel, Segmented, StatusBadge } from "./profile-ui";

/**
 * "Profile / Activity" — reservations, purchase history, and statements in one
 * scrollable page (buckets the legacy Purchase History + Reservations + Statements
 * items). Re-skinned with design-system tokens.
 */
const meta: Meta = { title: "Profile/Activity", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

type ResType = "tee" | "sim" | "activity" | "dining";
const TYPE_UI: Record<ResType, { icon: FC<{ className?: string }>; bg: string; fg: string; label: string }> = {
    tee: { icon: Flag06, bg: "bg-utility-green-50", fg: "text-utility-green-700", label: "Tee Time" },
    sim: { icon: Monitor01, bg: "bg-utility-blue-50", fg: "text-utility-blue-700", label: "Simulator" },
    activity: { icon: Trophy01, bg: "bg-utility-orange-50", fg: "text-utility-orange-700", label: "Activity" },
    dining: { icon: CalendarCheck01, bg: "bg-utility-purple-50", fg: "text-utility-purple-700", label: "Dining" },
};

const RESERVATIONS: { type: ResType; title: string; when: string; detail: string; status: "Upcoming" | "Completed" | "Cancelled" }[] = [
    { type: "tee", title: "Championship Course", when: "Sat, Jul 11 · 8:10 AM", detail: "4 players", status: "Upcoming" },
    { type: "sim", title: "Simulator Bay 3", when: "Thu, Jul 9 · 6:00 PM", detail: "1 hour", status: "Upcoming" },
    { type: "activity", title: "Short Game Clinic", when: "Wed, Jul 8 · 5:30 PM", detail: "Learning Center", status: "Upcoming" },
    { type: "dining", title: "The Grill", when: "Fri, Jul 3 · 7:00 PM", detail: "Party of 2", status: "Completed" },
    { type: "tee", title: "Championship Course", when: "Sun, Jun 28 · 7:30 AM", detail: "2 players", status: "Completed" },
    { type: "sim", title: "Simulator Bay 1", when: "Mon, Jun 22 · 5:00 PM", detail: "2 hours", status: "Completed" },
    { type: "dining", title: "The Grill", when: "Sat, Jun 14 · 6:30 PM", detail: "Party of 4", status: "Cancelled" },
];

const TXNS = [
    { date: "Jul 5", desc: "Pro Shop — FootJoy Glove", cat: "Order", amount: 28.0 },
    { date: "Jul 3", desc: "The Grill — Dinner", cat: "Charge", amount: 64.5 },
    { date: "Jul 1", desc: "Monthly Membership Dues", cat: "Charge", amount: 210.0 },
    { date: "Jun 28", desc: "Green Fees — 2 players", cat: "Charge", amount: 90.0 },
    { date: "Jun 24", desc: "Pro Shop — Titleist Pro V1 (dozen)", cat: "Order", amount: 54.99 },
    { date: "Jun 20", desc: "Simulator — 2 hours", cat: "Charge", amount: 70.0 },
];

const STATEMENTS = [
    { period: "June 2026", amount: 486.49 },
    { period: "May 2026", amount: 512.0 },
    { period: "April 2026", amount: 398.25 },
    { period: "March 2026", amount: 441.1 },
];

const RES_FILTERS: { key: "all" | ResType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "tee", label: "Tee Times" },
    { key: "sim", label: "Simulator" },
    { key: "activity", label: "Activities" },
    { key: "dining", label: "Dining" },
];

const ActivityScreen = () => {
    const [filter, setFilter] = useState<"all" | ResType>("all");
    const rows = filter === "all" ? RESERVATIONS : RESERVATIONS.filter((r) => r.type === filter);

    return (
        <ProfileShell active="activity">
            <div className="flex flex-col gap-10">
                <Panel title="Reservations" action={<Segmented options={RES_FILTERS} value={filter} onChange={setFilter} />}>
                    <div className="divide-y divide-secondary">
                        {rows.map((r, i) => {
                            const t = TYPE_UI[r.type];
                            return (
                                <div key={i} className="flex items-center gap-3.5 py-4">
                                    <span className={cx("flex size-10 shrink-0 items-center justify-center rounded-lg", t.bg)}>
                                        <t.icon className={cx("size-5", t.fg)} aria-hidden="true" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-primary">{r.title}</p>
                                        <p className="truncate text-sm text-tertiary">
                                            {r.when} · {r.detail}
                                        </p>
                                    </div>
                                    <StatusBadge status={r.status} />
                                </div>
                            );
                        })}
                        {rows.length === 0 && <p className="py-8 text-center text-sm text-tertiary">No reservations of this type.</p>}
                    </div>
                </Panel>

                <Panel title="Purchase history" action={<Button color="link-color" size="sm" iconLeading={TrendUp02}>Member spending</Button>}>
                    <div className="grid grid-cols-2 gap-4 border-b border-secondary py-5">
                        <div>
                            <p className="text-xs font-medium tracking-wide text-quaternary uppercase">This month</p>
                            <p className="mt-1 text-xl font-semibold text-primary tabular-nums">{money(312.4)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-wide text-quaternary uppercase">This year</p>
                            <p className="mt-1 text-xl font-semibold text-primary tabular-nums">{money(2847.0)}</p>
                        </div>
                    </div>
                    <div className="divide-y divide-secondary">
                        {TXNS.map((t, i) => (
                            <div key={i} className="flex items-center gap-3 py-3.5">
                                <span className="w-12 shrink-0 text-xs font-medium text-tertiary tabular-nums">{t.date}</span>
                                <span className="min-w-0 flex-1 truncate text-sm text-primary">{t.desc}</span>
                                <Badge color={t.cat === "Order" ? "brand" : "gray"} size="sm" type="pill-color">
                                    {t.cat}
                                </Badge>
                                <span className="w-16 shrink-0 text-right text-sm font-semibold text-primary tabular-nums">{money(t.amount)}</span>
                            </div>
                        ))}
                    </div>
                </Panel>

                <Panel title="Statements">
                    <div className="divide-y divide-secondary">
                        {STATEMENTS.map((s) => (
                            <div key={s.period} className="flex items-center gap-3 py-4">
                                <File02 className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                <span className="flex-1 text-sm font-medium text-primary">{s.period} statement</span>
                                <span className="text-sm text-tertiary tabular-nums">{money(s.amount)}</span>
                                <Button color="link-color" size="sm" iconLeading={Download01}>
                                    Download
                                </Button>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>
        </ProfileShell>
    );
};

export const Default: Story = { name: "Activity", render: () => <ActivityScreen /> };
