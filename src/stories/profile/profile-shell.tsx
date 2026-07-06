import type { FC, ReactNode } from "react";
import { Award05, ClockRewind, Home01, LogOut01, Ticket02, User01, Users01, Wallet01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { SAGAMORE_CLUB, SiteFooter, TopNav } from "../explorations/tenfore-chrome";

/**
 * Shared chrome for the member Profile — a two-pane layout modeled on Airbnb's
 * account settings: a slim top bar, a trimmed left nav that buckets the 14 legacy
 * member items into 6 groups, and a content pane. Re-skinned with design-system
 * tokens. The Overview and My Account buckets are built; the rest are placeholders.
 */

export const MEMBER = {
    firstName: "Justin",
    lastName: "Girard",
    preferred: "Justin",
    email: "hello@girardjustin.com",
    phone: "+1 (555) 018-7879",
    handicap: "8.4",
    memberNo: "SAG-04821",
    tier: "Signature Member",
    since: "2019",
    homeClub: "Sagamore Golf Club",
    address: "1287 Main Street, Lynnfield, MA 01940",
    emergency: "",
    balance: 142.5,
    initials: "JG",
};

export type BucketKey = "overview" | "account" | "activity" | "wallet" | "buddies" | "events" | "memberships";

type NavItem = { key: BucketKey; label: string; Icon: FC<{ className?: string }>; note: string };

export const NAV: NavItem[] = [
    { key: "overview", label: "Overview", Icon: Home01, note: "Your club at a glance" },
    { key: "account", label: "My Account", Icon: User01, note: "Personal info, payment, memberships, documents" },
    { key: "activity", label: "Activity", Icon: ClockRewind, note: "Reservations, purchases, statements" },
    { key: "wallet", label: "Wallet", Icon: Wallet01, note: "Balance, gift & punch cards" },
    { key: "buddies", label: "Golf Buddies", Icon: Users01, note: "Connect & play together" },
    { key: "events", label: "Events", Icon: Ticket02, note: "Scrambles, clinics & more" },
];

/** Lower nav section — sales-oriented, sits just above Log out. */
export const MEMBERSHIP_ITEM: NavItem = { key: "memberships", label: "Memberships", Icon: Award05, note: "Plans & benefits" };

const NavRow = ({ item, active }: { item: NavItem; active: boolean }) => (
    <button
        type="button"
        aria-current={active ? "page" : undefined}
        className={cx(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition duration-100 ease-linear",
            active ? "bg-active font-semibold text-primary" : "text-secondary hover:bg-primary_hover",
        )}
    >
        <item.Icon className={cx("size-5 shrink-0", active ? "text-fg-brand-primary" : "text-fg-quaternary")} aria-hidden="true" />
        <span className="text-sm">{item.label}</span>
    </button>
);

export const ProfileShell = ({ active, children }: { active: BucketKey; children: ReactNode }) => (
    <div className="flex min-h-dvh flex-col bg-secondary">
        {/* Global site navigation — the member is signed in */}
        <TopNav active="" club={SAGAMORE_CLUB} accountLabel="Justin G." />

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 lg:flex-row">
            {/* Left nav */}
            <aside className="w-full shrink-0 lg:w-64">
                <h1 className="mb-5 text-display-xs font-semibold text-primary">My Profile</h1>
                <nav className="flex flex-col gap-1">
                    {NAV.map((item) => (
                        <NavRow key={item.key} item={item} active={item.key === active} />
                    ))}
                </nav>
                <div className="my-4 border-t border-secondary" />
                <nav className="flex flex-col gap-1">
                    <NavRow item={MEMBERSHIP_ITEM} active={active === "memberships"} />
                </nav>
                {/* Keep the sign-out action visually distinct from the Memberships CTA */}
                <div className="my-4 border-t border-secondary" />
                <nav className="flex flex-col gap-1">
                    <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-secondary transition duration-100 ease-linear hover:bg-primary_hover">
                        <LogOut01 className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                        <span className="text-sm">Log out</span>
                    </button>
                </nav>
            </aside>

            {/* Content */}
            <main className="min-w-0 flex-1">{children}</main>
        </div>

        <SiteFooter club={SAGAMORE_CLUB} />
    </div>
);
