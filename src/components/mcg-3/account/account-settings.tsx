"use client";

/**
 * `/account/settings` — profile, notifications, password, residency, and the reset.
 *
 * The last one is the demo tool: "Reset prototype data" clears the whole prototype
 * session — user, cart, activity, credits, saved items — so a walkthrough can be run
 * again from a clean state without clearing site data by hand. It asks once before
 * doing it, because it is genuinely destructive mid-demo.
 */
import { useState } from "react";
import { AlertTriangle, Lock01, RefreshCcw01, ShieldTick } from "@untitledui/icons";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { McgShell } from "../mcg-chrome";
import { type SessionUser, useSession } from "../session";
import { AccountShell } from "./account-shell";
import { Initials, MEMBER_SINCE, Panel, RESIDENT, SignedOut, clearResident, useResident } from "./account-ui";

/** Notification rows, each with the reason a golfer would actually keep it on. */
const NOTIFICATIONS: { id: string; label: string; hint: string; on: boolean }[] = [
    {
        id: "booking",
        label: "Booking confirmations",
        hint: "Tee times, lessons, clinics and Grill reservations — sent by email the moment they are booked.",
        on: true,
    },
    { id: "reminder", label: "Round reminders", hint: "A text the evening before, with your course, time and group.", on: true },
    { id: "weather", label: "Weather and closures", hint: "Frost delays, cart-path-only days and course closures at the courses you play.", on: true },
    { id: "lesson", label: "Lesson credit reminders", hint: "A nudge when credits are unused with two months left on the clock.", on: true },
    { id: "offers", label: "Twilight rates and offers", hint: "Late-day openings and seasonal rates across the nine county courses.", on: false },
    { id: "events", label: "Events and leagues", hint: "Scrambles, member-guests and league sign-ups opening at your home course.", on: false },
];

type Field = "first" | "last" | "email" | "phone" | "home" | "street" | "zip";

export interface AccountSettingsProps {
    userOverride?: SessionUser | null;
}

export const AccountSettingsScreen = ({ userOverride }: AccountSettingsProps) => {
    const router = useRouter();
    const session = useSession();
    const user = userOverride ?? session.user;

    // The form holds only what has been edited. The session user arrives a tick after
    // mount (localStorage is read in an effect), so seeding state from it would strand
    // the fields empty — reading through a draft keeps them correct either way.
    const [draft, setDraft] = useState<Partial<Record<Field, string>>>({});
    const [notifications, setNotifications] = useState<Record<string, boolean>>(() => Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, n.on])));
    const [isResident, setResident] = useResident(true);
    const [confirmReset, setConfirmReset] = useState(false);
    const [saved, setSaved] = useState(false);

    const defaults: Record<Field, string> = {
        first: user?.first ?? "",
        last: user?.last ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        home: "Needwood",
        street: "18 Monroe Street",
        zip: RESIDENT.zip,
    };
    const value = (field: Field) => draft[field] ?? defaults[field];
    const edit = (field: Field) => (next: string) => {
        setSaved(false);
        setDraft((state) => ({ ...state, [field]: next }));
    };

    if (!user) {
        return (
            <McgShell>
                <SignedOut title="Settings" blurb="Sign in to update your details, notifications and Montgomery County residency." />
            </McgShell>
        );
    }

    const resetPrototype = () => {
        clearResident();
        session.reset();
        router.push("/");
    };

    return (
        <AccountShell active="settings">
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                    <Initials user={user} />
                    <div className="min-w-0">
                        <h2 className="text-display-sm font-semibold text-primary">My Account</h2>
                        <p className="mt-1 truncate text-md text-tertiary">
                            {user.email} · {user.isNew ? "Joined today" : `Playing county golf since ${MEMBER_SINCE}`}
                        </p>
                    </div>
                </div>
                <Panel
                    title="Profile"
                    sub={`Member since ${MEMBER_SINCE} · these details appear on your bookings and Pro Shop orders.`}
                    action={
                        <div className="flex items-center gap-3">
                            {saved && <span className="text-sm text-success-primary">Saved</span>}
                            <Button size="sm" onClick={() => setSaved(true)}>
                                Save changes
                            </Button>
                        </div>
                    }
                >
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Input label="First name" value={value("first")} onChange={edit("first")} />
                        <Input label="Last name" value={value("last")} onChange={edit("last")} />
                        <Input label="Email" type="email" value={value("email")} onChange={edit("email")} hint="Used for booking confirmations." />
                        <Input label="Mobile" type="tel" value={value("phone")} onChange={edit("phone")} hint="Used for round reminders and closure alerts." />
                        <Input
                            label="Home course"
                            value={value("home")}
                            onChange={edit("home")}
                            hint="Falls Road, Northwest, Hampshire Greens, Laytonsville, Little Bennett, Needwood or The Crossvines."
                        />
                    </div>
                </Panel>

                <Panel title="Notifications" sub="Booking confirmations always come by email. Everything else is up to you." flush>
                    <div className="divide-y divide-secondary">
                        {NOTIFICATIONS.map((item) => (
                            <div key={item.id} className="flex items-start justify-between gap-6 px-5 py-4">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-primary">{item.label}</p>
                                    <p className="mt-0.5 text-sm text-tertiary">{item.hint}</p>
                                </div>
                                <Toggle
                                    size="md"
                                    aria-label={item.label}
                                    isSelected={notifications[item.id]}
                                    onChange={(value) => setNotifications((state) => ({ ...state, [item.id]: value }))}
                                />
                            </div>
                        ))}
                    </div>
                </Panel>

                <Panel
                    title="Montgomery County residency"
                    sub="Residents pay a lower green fee at all nine county courses. The rate is applied automatically at checkout."
                >
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap items-center gap-3">
                            {isResident ? (
                                <Badge color="success" size="md" type="pill-color">
                                    Resident verified
                                </Badge>
                            ) : (
                                <Badge color="gray" size="md" type="pill-color">
                                    Non-resident rate
                                </Badge>
                            )}
                            <span className="flex items-center gap-1.5 text-sm text-tertiary">
                                <ShieldTick className="size-4 text-fg-quaternary" aria-hidden="true" />
                                {isResident ? `${RESIDENT.verifiedOn} · ID ${RESIDENT.id}` : "Add your county address to claim the resident rate"}
                            </span>
                        </div>

                        <Checkbox label="I live in Montgomery County, Maryland" hint={RESIDENT.savings} isSelected={isResident} onChange={setResident} />

                        {isResident && (
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Input label="Street address" value={value("street")} onChange={edit("street")} />
                                <Input label="ZIP code" value={value("zip")} onChange={edit("zip")} inputMode="numeric" />
                            </div>
                        )}
                    </div>
                </Panel>

                <Panel title="Password" sub="Eight characters or more, with a number and a special character.">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Input label="Current password" type="password" placeholder="••••••••" />
                        <div className="hidden sm:block" />
                        <Input label="New password" type="password" placeholder="••••••••" />
                        <Input label="Confirm new password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Button size="sm" color="secondary" iconLeading={Lock01}>
                            Update password
                        </Button>
                        <span className="text-sm text-tertiary">Last changed February 2026.</span>
                    </div>
                </Panel>

                <Panel title="Prototype tools" sub="This is a demo build — nothing here talks to a real system.">
                    <div className="bg-secondary_subtle flex flex-col gap-4 rounded-xl p-5 ring-1 ring-secondary ring-inset">
                        <div className="flex items-start gap-2.5">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-fg-warning-secondary" aria-hidden="true" />
                            <p className="text-sm text-tertiary">
                                Reset clears everything the prototype remembers about this browser — the signed-in golfer, the cart, booked activity, lesson
                                credits, saved Pro Shop items and residency — and returns you to the home page. Useful for running a walkthrough twice.
                            </p>
                        </div>
                        {confirmReset ? (
                            <div className="flex flex-wrap items-center gap-3">
                                <Button size="md" color="primary-destructive" iconLeading={RefreshCcw01} onClick={resetPrototype}>
                                    Yes, reset everything
                                </Button>
                                <Button size="md" color="secondary" onClick={() => setConfirmReset(false)}>
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <Button size="md" color="secondary-destructive" iconLeading={RefreshCcw01} onClick={() => setConfirmReset(true)}>
                                    Reset prototype data
                                </Button>
                            </div>
                        )}
                    </div>
                </Panel>
            </div>
        </AccountShell>
    );
};
