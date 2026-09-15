"use client";

/**
 * The chrome every signed-in account screen sits in — the routed MCG equivalent of
 * the Storybook `ProfileShell`.
 *
 * Same two-pane geometry as the template (slim left nav bucketing the account areas,
 * a content pane beside it), but wrapped in the prototype's own chrome: `McgShell`
 * brings the real `McgNav` and `McgFooter` along, so the account pages sit inside the
 * site rather than inside a second, parallel one.
 *
 * Every nav row is a real link, and only to routes that exist. The template lists
 * Golf Buddies, Events and Memberships as buckets; here those have no page behind
 * them, and a nav row that goes nowhere is worse than one that is absent — Golf
 * Buddies lives on the Overview as a module instead, and Events is already in the
 * global nav.
 */
import type { FC, ReactNode } from "react";
import { ClockRewind, Home01, LogOut01, User01, Wallet01 } from "@untitledui/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cx } from "@/utils/cx";
import { McgShell } from "../mcg-chrome";
import { useSession } from "../session";

export type AccountSection = "overview" | "activity" | "wallet" | "settings";

interface AccountNavItem {
    key: AccountSection;
    label: string;
    href: string;
    Icon: FC<{ className?: string }>;
}

/** The four account areas that have a route. Order matches the old tab row. */
export const ACCOUNT_NAV: AccountNavItem[] = [
    { key: "overview", label: "Overview", href: "/account", Icon: Home01 },
    { key: "activity", label: "Activity", href: "/account/activity", Icon: ClockRewind },
    { key: "wallet", label: "Wallet", href: "/account/wallet", Icon: Wallet01 },
    { key: "settings", label: "My Account", href: "/account/settings", Icon: User01 },
];

const rowClass = (active: boolean) =>
    cx(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition duration-100 ease-linear",
        active ? "bg-active font-semibold text-primary" : "text-secondary hover:bg-primary_hover",
    );

const NavRow = ({ item, active }: { item: AccountNavItem; active: boolean }) => (
    <Link href={item.href} aria-current={active ? "page" : undefined} className={rowClass(active)}>
        <item.Icon className={cx("size-5 shrink-0", active ? "text-fg-brand-primary" : "text-fg-quaternary")} aria-hidden="true" />
        <span className="text-sm">{item.label}</span>
    </Link>
);

/**
 * Which row is lit. The pathname is the source of truth in the app — the longest
 * matching href wins, so `/account/wallet` never lights up Overview — and the
 * `active` prop is the fallback for anywhere the pathname isn't a real account route
 * (a Storybook story, most of all), which keeps a story and its route identical.
 */
const resolveActive = (pathname: string, fallback: AccountSection): AccountSection => {
    const matched = [...ACCOUNT_NAV]
        .sort((a, b) => b.href.length - a.href.length)
        .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
    return matched?.key ?? fallback;
};

export const AccountShell = ({ active, children }: { active: AccountSection; children: ReactNode }) => {
    const pathname = usePathname() ?? "";
    const router = useRouter();
    const { signOut } = useSession();
    const current = resolveActive(pathname, active);

    const handleSignOut = () => {
        signOut();
        router.push("/");
    };

    return (
        <McgShell>
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row">
                {/* Left nav */}
                <aside className="w-full shrink-0 lg:w-64">
                    <h1 className="mb-5 text-display-xs font-semibold text-primary">My MCG account</h1>
                    <nav className="flex flex-col gap-1">
                        {ACCOUNT_NAV.map((item) => (
                            <NavRow key={item.key} item={item} active={item.key === current} />
                        ))}
                    </nav>

                    {/* Sign out is kept visually separate from the account areas */}
                    <div className="my-4 border-t border-secondary" />
                    <nav className="flex flex-col gap-1">
                        <button type="button" onClick={handleSignOut} className={rowClass(false)}>
                            <LogOut01 className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            <span className="text-sm">Sign out</span>
                        </button>
                    </nav>
                </aside>

                {/* Content — `McgShell` already owns the page's <main> */}
                <div className="min-w-0 flex-1">{children}</div>
            </div>
        </McgShell>
    );
};
