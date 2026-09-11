"use client";

/**
 * `/account` — the profile hub, rebuilt on the Overview template.
 *
 * The shape is the template's: a welcome line, a four-up snapshot, an Upcoming panel
 * with a Details link per row, and the Golf Buddies module carried at full brand
 * weight. What it says is MCG's. There is no membership tier here and no handicap —
 * a county system sells rounds, not membership — so the sub-line reports the one
 * status that actually changes what a golfer pays: Montgomery County residency.
 *
 * The `*Override` props exist for Storybook. `useSession` returns an inert signed-out
 * session outside the app, so a story hands the same component a populated account
 * instead of the screen forking its markup for "demo mode".
 */
import { useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Flag06, GraduationHat01, Heart, Package, ShieldTick, Ticket02, UserPlus01, XClose } from "@untitledui/icons";
import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { money } from "@/components/instruction/instruction-catalog";
import { CreditCardPanel } from "@/components/instruction/instruction-ui";
import { cx } from "@/utils/cx";
import { McgShell } from "../mcg-chrome";
import { type ActivityItem, type LessonCredit, type SessionUser, useSession } from "../session";
import { AccountShell } from "./account-shell";
import {
    EmptyState,
    KIND,
    Panel,
    QUICK_LINKS,
    RECENT_ORDERS,
    RESIDENT,
    SignedOut,
    StatTile,
    countOf,
    creditsRemaining,
    renderableCredits,
    toCreditBalance,
    upcomingOf,
    useResident,
} from "./account-ui";

/**
 * Invented golfers, deliberately plain. The buddies concept is a proposal, not a
 * record of anything — nobody here should read as a real MCG member or coach.
 */
const BUDDIES = [
    { name: "Alex Rivera", initials: "AR", note: "6 rounds together" },
    { name: "Dana Whitfield", initials: "DW", note: "4 rounds together" },
    { name: "Marcus Hill", initials: "MH", note: "3 rounds together" },
    { name: "Priya Shah", initials: "PS", note: "2 rounds together" },
];

const BuddyAvatar = ({ initials }: { initials: string }) => (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">{initials}</span>
);

/**
 * The template's `MembershipBanner`, told the MCG way. There is nothing to upgrade
 * to, so the prompt is the one thing a golfer can change about their own pricing:
 * add a county address and every green fee drops.
 */
const ResidencyBanner = () => (
    <section className="flex flex-wrap items-center gap-4 rounded-2xl bg-brand-section p-6 text-white">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
            <ShieldTick className="size-5.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
            <p className="text-md font-semibold text-white">You're paying the non-resident rate</p>
            <p className="text-sm text-white/70">
                {RESIDENT.savings}. Add your Montgomery County address and the resident rate applies automatically at checkout.
            </p>
        </div>
        <Link
            href="/account/settings"
            className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary transition duration-100 ease-linear hover:bg-white/90"
        >
            Add your address
        </Link>
    </section>
);

export interface AccountHubProps {
    userOverride?: SessionUser | null;
    activityOverride?: ActivityItem[];
    creditsOverride?: LessonCredit[];
    savedOverride?: string[];
    /** Force the first-run banner without a `?welcome=1` query string. */
    welcomeOverride?: boolean;
    /** Residency without the session — the sub-line and the banner both read it. */
    residentOverride?: boolean;
}

export const AccountHubScreen = ({ userOverride, activityOverride, creditsOverride, savedOverride, welcomeOverride, residentOverride }: AccountHubProps) => {
    const session = useSession();
    const user = userOverride ?? session.user;
    const activity = activityOverride ?? session.activity;
    const credits = creditsOverride ?? session.credits;
    const saved = savedOverride ?? session.saved;
    const [sessionResident] = useResident(true);
    const isResident = residentOverride ?? sessionResident;

    // Read the query string after mount rather than with `useSearchParams`: a static
    // export would otherwise need a Suspense boundary around the whole page.
    const [welcome, setWelcome] = useState(welcomeOverride ?? false);
    useEffect(() => {
        if (welcomeOverride !== undefined) return;
        setWelcome(new URLSearchParams(window.location.search).get("welcome") === "1");
    }, [welcomeOverride]);

    if (!user) {
        return (
            <McgShell>
                <SignedOut
                    title="My account"
                    blurb="Sign in to see your tee times, lesson credits, Pro Shop orders and resident rate in one place. You can keep browsing without an account."
                />
            </McgShell>
        );
    }

    const upcoming = upcomingOf(activity);
    const packs = renderableCredits(credits);

    return (
        <AccountShell active="overview">
            <div className="flex flex-col gap-8">
                {/* Welcome */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="text-display-sm font-semibold text-primary">
                            {user.isNew ? "Welcome" : "Welcome back"}, {user.first}
                        </h2>
                        <p className="mt-1.5 text-md text-tertiary">
                            {isResident ? (
                                <>
                                    Montgomery County resident · you pay the resident rate at all nine county courses.{" "}
                                    <Link
                                        href="/account/settings"
                                        className="font-semibold text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover"
                                    >
                                        Update residency
                                    </Link>
                                </>
                            ) : (
                                <>
                                    Non-resident rate · county residents pay less on every round.{" "}
                                    <Link
                                        href="/account/settings"
                                        className="font-semibold text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover"
                                    >
                                        Add your address
                                    </Link>
                                </>
                            )}
                        </p>
                    </div>
                    <Button href="/tee-times" size="md" iconLeading={Flag06}>
                        Book a tee time
                    </Button>
                </div>

                {welcome && (
                    <section className="flex flex-wrap items-center gap-4 rounded-2xl bg-brand-section p-6 text-white">
                        <div className="min-w-0 flex-1">
                            <p className="text-lg font-semibold text-white">Welcome to Montgomery County Golf, {user.first}.</p>
                            <p className="mt-1 text-sm text-white/70">
                                Your account is ready. Nine county courses share one tee sheet — book a round at Falls Road, Needwood or Little Bennett, or
                                start with a lesson at the academy.
                            </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                            <Link
                                href="/tee-times"
                                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary transition duration-100 ease-linear hover:bg-white/90"
                            >
                                Find a tee time
                            </Link>
                            <button
                                type="button"
                                onClick={() => setWelcome(false)}
                                aria-label="Dismiss welcome message"
                                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition duration-100 ease-linear hover:bg-white/20"
                            >
                                <XClose className="size-4" aria-hidden="true" />
                            </button>
                        </div>
                    </section>
                )}

                {!isResident && <ResidencyBanner />}

                {/* Snapshot */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatTile icon={Flag06} label="Rounds played" value={String(countOf(activity, "tee-time"))} />
                    <StatTile icon={Ticket02} label="Lesson credits" value={String(creditsRemaining(credits))} />
                    <StatTile icon={GraduationHat01} label="Upcoming" value={String(upcoming.length)} />
                    <StatTile icon={Heart} label="Saved items" value={String(saved.length)} />
                </div>

                {/* Upcoming */}
                <section className="rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                        <h3 className="text-md font-semibold text-primary">Upcoming</h3>
                        <Link
                            href="/account/activity"
                            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover"
                        >
                            View all <ChevronRight className="size-4" aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="divide-y divide-secondary border-t border-secondary">
                        {upcoming.length > 0 ? (
                            upcoming.slice(0, 4).map((item) => {
                                const meta = KIND[item.kind];
                                return (
                                    <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                                        <div className="flex min-w-0 items-center gap-3.5">
                                            <span className={cx("flex size-10 shrink-0 items-center justify-center rounded-lg", meta.tile)}>
                                                <meta.icon className={cx("size-5", meta.mark)} aria-hidden="true" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-primary">{item.title}</p>
                                                <p className="mt-0.5 truncate text-sm text-tertiary">
                                                    {item.dateLabel}
                                                    {item.timeLabel ? ` · ${item.timeLabel}` : ""} · {item.detail}
                                                </p>
                                            </div>
                                        </div>
                                        <Button href="/account/activity" color="link-color" size="sm" iconTrailing={ArrowRight}>
                                            Details
                                        </Button>
                                    </div>
                                );
                            })
                        ) : (
                            <EmptyState
                                icon={Flag06}
                                title="Nothing booked yet"
                                blurb="Nine public county courses share one tee sheet — find a time that works, or book a lesson with an MCG coach to start the season sharp."
                                actions={
                                    <>
                                        <Button href="/tee-times" size="md" iconLeading={Flag06}>
                                            Find a tee time
                                        </Button>
                                        <Button href="/instruction" size="md" color="secondary" iconLeading={GraduationHat01}>
                                            Book a lesson
                                        </Button>
                                    </>
                                }
                            />
                        )}
                    </div>
                </section>

                {/* Golf Buddies — the connect concept, kept prominent */}
                <section className="overflow-hidden rounded-2xl bg-brand-section text-white">
                    <div className="flex flex-col gap-1 px-6 pt-6">
                        <span className="text-xs font-semibold tracking-wide text-white/60 uppercase">New · Golf Buddies</span>
                        <h3 className="text-xl font-semibold text-white">Connect with your golf buddies</h3>
                        <p className="max-w-xl text-sm text-white/70">
                            You've played with these golfers across the county this season. Add them as buddies to fill out a foursome faster, share tee times,
                            and keep a regular group together.
                        </p>
                    </div>
                    <div className="mt-5 grid grid-cols-1 gap-3 px-6 sm:grid-cols-2">
                        {BUDDIES.map((buddy) => (
                            <div key={buddy.name} className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                                <BuddyAvatar initials={buddy.initials} />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-white">{buddy.name}</p>
                                    <p className="truncate text-xs text-white/60">{buddy.note}</p>
                                </div>
                                <button
                                    type="button"
                                    className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary transition duration-100 ease-linear hover:bg-white/90"
                                >
                                    <UserPlus01 className="size-3.5" aria-hidden="true" /> Add
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-4">
                        <p className="text-sm text-white/70">Playing with someone who doesn't have an MCG account yet?</p>
                        <button type="button" className="text-sm font-semibold text-white underline underline-offset-2">
                            Invite a buddy
                        </button>
                    </div>
                </section>

                <Panel
                    title="Lesson credits"
                    sub="Prepaid lessons, ready to redeem against any opening on that coach's calendar."
                    flush={packs.length > 0}
                    action={
                        <Button href="/account/wallet" color="link-color" size="sm" iconTrailing={ArrowRight}>
                            Open wallet
                        </Button>
                    }
                >
                    {packs.length > 0 ? (
                        <div className="grid gap-4 p-5">
                            {packs.map((credit) => (
                                <CreditCardPanel
                                    key={credit.id}
                                    balance={toCreditBalance(credit)}
                                    action={
                                        <Button href="/instruction" size="sm" color="secondary">
                                            Book with these credits
                                        </Button>
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Ticket02}
                            title="No lesson credits"
                            blurb="A five-lesson package works out cheaper than booking one at a time, and credits never need to be used with the same course twice."
                            actions={
                                <Button href="/instruction" size="md" iconLeading={GraduationHat01}>
                                    See packages
                                </Button>
                            }
                        />
                    )}
                </Panel>

                <Panel
                    title="Recent orders"
                    flush
                    action={
                        <Button href="/shop" color="link-color" size="sm" iconTrailing={ArrowRight}>
                            Back to the Pro Shop
                        </Button>
                    }
                >
                    <div className="divide-y divide-secondary">
                        {RECENT_ORDERS.map((order) => (
                            <div key={order.id} className="flex items-center gap-3.5 px-5 py-4">
                                <span className="bg-secondary_subtle flex size-10 shrink-0 items-center justify-center rounded-lg">
                                    <Package className="size-5 text-fg-quaternary" aria-hidden="true" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-primary">Order #{order.id}</p>
                                    <p className="truncate text-sm text-tertiary">
                                        {order.date} · {order.summary}
                                    </p>
                                </div>
                                <span className="hidden shrink-0 text-sm text-tertiary sm:block">{order.status}</span>
                                <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">{money(order.total)}</span>
                            </div>
                        ))}
                    </div>
                </Panel>

                <section className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-primary">Jump back in</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {QUICK_LINKS.map((link) => (
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
                </section>
            </div>
        </AccountShell>
    );
};
