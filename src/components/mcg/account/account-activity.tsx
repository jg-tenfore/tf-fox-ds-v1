"use client";

/**
 * `/account/activity` — everything the golfer has booked or bought, in one list.
 *
 * Split upcoming from past rather than paginating: the two are read for different
 * reasons (what do I need to turn up to, versus what did I pay for), and a golfer
 * with a busy September should never have to scroll past July to find Saturday.
 *
 * Filter chips narrow both halves at once. A prepaid package shows under "All" —
 * the wallet is the right place to manage one, so it gets no chip of its own.
 */
import { useState } from "react";
import { ArrowRight, ClockRewind, Flag06, GraduationHat01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FilterChips } from "@/components/instruction/instruction-ui";
import { McgShell } from "../mcg-chrome";
import { type ActivityItem, type ActivityKind, type SessionUser, useSession } from "../session";
import { AccountShell } from "./account-shell";
import { ActivityRow, EmptyState, Panel, SignedOut, pastOf, upcomingOf } from "./account-ui";

type Filter = "all" | ActivityKind;

const FILTERS: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "tee-time", label: "Tee times" },
    { id: "lesson", label: "Lessons" },
    { id: "clinic", label: "Clinics" },
    { id: "event", label: "Events" },
    { id: "purchase", label: "Purchases" },
    { id: "dining", label: "Dining" },
];

export interface AccountActivityProps {
    userOverride?: SessionUser | null;
    activityOverride?: ActivityItem[];
}

export const AccountActivityScreen = ({ userOverride, activityOverride }: AccountActivityProps) => {
    const session = useSession();
    const user = userOverride ?? session.user;
    const activity = activityOverride ?? session.activity;
    const [filter, setFilter] = useState<Filter>("all");

    if (!user) {
        return (
            <McgShell>
                <SignedOut
                    title="Activity"
                    blurb="Sign in to see every tee time, lesson, clinic, event and Pro Shop order on your MCG account — upcoming and past."
                />
            </McgShell>
        );
    }

    const matches = (item: ActivityItem) => filter === "all" || item.kind === filter;
    const upcoming = upcomingOf(activity).filter(matches);
    const past = pastOf(activity).filter(matches);
    const label = FILTERS.find((f) => f.id === filter)?.label ?? "Activity";

    return (
        <AccountShell active="activity">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-display-sm font-semibold text-primary">Your activity</h2>
                            <p className="text-sm text-tertiary">
                                {upcoming.length} upcoming · {past.length} in history
                            </p>
                        </div>
                        <Button href="/tee-times" size="md" iconLeading={Flag06}>
                            Book a tee time
                        </Button>
                    </div>
                    <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
                </div>

                <Panel title="Upcoming" flush>
                    {upcoming.length > 0 ? (
                        <div className="divide-y divide-secondary">
                            {upcoming.map((item) => (
                                <ActivityRow key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Flag06}
                            title={filter === "all" ? "Nothing booked yet" : `No ${label.toLowerCase()} coming up`}
                            blurb={
                                filter === "all"
                                    ? "Book a round at any of the nine county courses, or take a lesson with an MCG coach — it will appear here straight away."
                                    : "Change the filter to see the rest of your account, or book something new."
                            }
                            actions={
                                filter === "all" ? (
                                    <>
                                        <Button href="/tee-times" size="md" iconLeading={Flag06}>
                                            Find a tee time
                                        </Button>
                                        <Button href="/instruction" size="md" color="secondary" iconLeading={GraduationHat01}>
                                            Book a lesson
                                        </Button>
                                    </>
                                ) : undefined
                            }
                        />
                    )}
                </Panel>

                <Panel
                    title="Past"
                    flush
                    action={
                        <Button href="/shop" color="link-color" size="sm" iconTrailing={ArrowRight}>
                            Buy it again
                        </Button>
                    }
                >
                    {past.length > 0 ? (
                        <div className="divide-y divide-secondary">
                            {past.map((item) => (
                                <ActivityRow key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={ClockRewind}
                            title="No history yet"
                            blurb="Completed rounds, lessons and orders land here once they happen — along with anything that gets cancelled."
                        />
                    )}
                </Panel>
            </div>
        </AccountShell>
    );
};
