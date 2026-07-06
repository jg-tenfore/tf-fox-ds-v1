import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { FC } from "react";
import { ArrowRight, Award01, Award05, CalendarHeart01, ChevronRight, Flag06, UserPlus01, Wallet01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { MEMBER, ProfileShell } from "./profile-shell";

/**
 * "Profile / Overview" — the member dashboard: welcoming messaging, an at-a-glance
 * snapshot, upcoming reservations, and a prominent Golf Buddies module that
 * introduces the connect concept early to nudge members to play together.
 */
const meta: Meta = {
    title: "Profile/Overview",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const money = (n: number) => `$${n.toFixed(2)}`;

const StatTile = ({ icon: Icon, label, value }: { icon: FC<{ className?: string }>; label: string; value: string }) => (
    <div className="rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
        <div className="flex items-center gap-1.5 text-tertiary">
            <Icon className="size-4 text-fg-quaternary" aria-hidden="true" />
            <span className="text-xs font-medium tracking-wide uppercase">{label}</span>
        </div>
        <p className="mt-2 text-display-xs font-semibold text-primary tabular-nums">{value}</p>
    </div>
);

const UPCOMING = [
    { title: "Tee Time · Championship Course", when: "Sat, Jul 11 · 8:10 AM", meta: "4 players" },
    { title: "Short Game Clinic with Mike Doucette", when: "Wed, Jul 8 · 5:30 PM", meta: "Learning Center" },
];

const BUDDIES = [
    { name: "Mark Thompson", initials: "MT", note: "6 rounds together" },
    { name: "Sarah Lin", initials: "SL", note: "4 rounds together" },
    { name: "Dave Rossi", initials: "DR", note: "3 rounds together" },
    { name: "Priya Nair", initials: "PN", note: "2 rounds together" },
];

const Avatar = ({ initials }: { initials: string }) => (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-brand-secondary ring-1 ring-secondary ring-inset">
        {initials}
    </span>
);

/** Non-member / expired upsell banner shown on the Overview. */
const MembershipBanner = ({ expired }: { expired?: boolean }) => (
    <section className="flex flex-wrap items-center gap-4 rounded-2xl bg-brand-section p-6 text-white">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Award05 className="size-5.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
            <p className="text-md font-semibold text-white">{expired ? "Your membership has expired" : "Get more out of Sagamore"}</p>
            <p className="text-sm text-white/70">
                {expired
                    ? "Renew your annual membership to restore unlimited golf, member rates, and event priority."
                    : "Become an annual member for unlimited golf, member tee-time rates, and access to leagues, clinics, and events."}
            </p>
        </div>
        <button type="button" className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary transition duration-100 ease-linear hover:bg-white/90">
            {expired ? "Renew membership" : "View memberships"}
        </button>
    </section>
);

const OverviewScreen = ({ membership = "member" }: { membership?: "member" | "guest" | "expired" }) => (
    <ProfileShell active="overview">
        <div className="flex flex-col gap-8">
            {/* Welcome */}
            <div>
                <h2 className="text-display-sm font-semibold text-primary">Welcome back, {MEMBER.preferred}</h2>
                <p className="mt-1.5 text-md text-tertiary">
                    {membership === "member" ? `${MEMBER.tier} since ${MEMBER.since} · ${MEMBER.homeClub}` : membership === "expired" ? `Membership expired · ${MEMBER.homeClub}` : `Guest · ${MEMBER.homeClub}`}
                </p>
            </div>

            {membership !== "member" && <MembershipBanner expired={membership === "expired"} />}

            {/* Snapshot */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatTile icon={Flag06} label="Handicap" value={MEMBER.handicap} />
                <StatTile icon={Wallet01} label="Balance" value={money(MEMBER.balance)} />
                <StatTile icon={CalendarHeart01} label="Upcoming" value="2" />
                <StatTile icon={Award01} label="Punch cards" value="3" />
            </div>

            {/* Upcoming */}
            <section className="rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
                <div className="flex items-center justify-between px-5 py-4">
                    <h3 className="text-md font-semibold text-primary">Upcoming</h3>
                    <button type="button" className="flex items-center gap-1 text-sm font-semibold text-brand-secondary">
                        View all <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                </div>
                <div className="divide-y divide-secondary border-t border-secondary">
                    {UPCOMING.map((u) => (
                        <div key={u.title} className="flex items-center justify-between gap-4 px-5 py-4">
                            <div>
                                <p className="text-sm font-semibold text-primary">{u.title}</p>
                                <p className="mt-0.5 text-sm text-tertiary">
                                    {u.when} · {u.meta}
                                </p>
                            </div>
                            <Button color="link-color" size="sm" iconTrailing={ArrowRight}>
                                Details
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Golf Buddies — prominent connect module */}
            <section className="overflow-hidden rounded-2xl bg-brand-section text-white">
                <div className="flex flex-col gap-1 px-6 pt-6">
                    <span className="text-xs font-semibold tracking-wide text-white/60 uppercase">New · Golf Buddies</span>
                    <h3 className="text-xl font-semibold text-white">Connect with your golf buddies</h3>
                    <p className="max-w-xl text-sm text-white/70">
                        We noticed you've played with these members recently. Add them as buddies to see their rounds, invite them to tee times, and build your regular group.
                    </p>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-3 px-6 sm:grid-cols-2">
                    {BUDDIES.map((b) => (
                        <div key={b.name} className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                            <Avatar initials={b.initials} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-white">{b.name}</p>
                                <p className="truncate text-xs text-white/60">{b.note}</p>
                            </div>
                            <button
                                type="button"
                                className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary transition duration-100 ease-linear hover:bg-white/90"
                            >
                                <UserPlus01 className="size-3.5" aria-hidden="true" /> Add
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4">
                    <p className="text-sm text-white/70">Know someone who isn't a member yet?</p>
                    <button type="button" className="text-sm font-semibold text-white underline underline-offset-2">
                        Invite a buddy
                    </button>
                </div>
            </section>
        </div>
    </ProfileShell>
);

export const Default: Story = {
    name: "Overview",
    render: () => <OverviewScreen />,
};

export const NonMember: Story = {
    name: "Overview (Non-member)",
    render: () => <OverviewScreen membership="guest" />,
};
