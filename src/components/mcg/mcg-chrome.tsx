"use client";

/**
 * MCG prototype chrome — the nav, footer and page shell every route shares.
 *
 * This is the routed sibling of `tenfore-chrome`'s `TopNav`: same visual language and
 * the same MCG brand override, but the items are real links and the account / cart
 * read from the prototype session. Keeping it here (rather than forking TopNav) means
 * the Storybook screens and the prototype stay visually identical while only the
 * prototype pays for routing.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut01, Mail01, MarkerPin01, Phone, ShoppingCart01, User01 } from "@untitledui/icons";
import { McgLogo } from "@/components/foundations/mcg/mcg-logo";
import { MCG_GREEN } from "@/components/instruction/instruction-catalog";
import { clubBrandStyle } from "@/stories/explorations/tenfore-chrome";
import { cx } from "@/utils/cx";
import { useSession } from "./session";
import type { ReactNode } from "react";

export const MCG = {
    name: "Montgomery County Golf",
    city: "Montgomery County, MD",
    phone: "(301) 762-1600",
    address: "Montgomery County, MD",
    email: "golf@mcggolf.com",
};

/** Every tab in the prototype's global nav, in order. */
export const NAV: { label: string; href: string }[] = [
    { label: "Tee Times", href: "/tee-times" },
    { label: "Shop", href: "/shop" },
    { label: "Events", href: "/events" },
    { label: "Instruction", href: "/instruction" },
    { label: "Calendar", href: "/calendar" },
    { label: "Clinics", href: "/clinics" },
    { label: "Grill", href: "/grill" },
];

const money = (n: number) => `$${n.toFixed(2)}`;

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

export const McgNav = () => {
    const pathname = usePathname() ?? "/";
    const { user, cartCount, cartTotal, signOut } = useSession();

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    return (
        <header className="w-full border-b border-white/10 bg-primary-solid text-white">
            {/* Utility bar */}
            <div className="flex items-center justify-between gap-4 px-6 pt-4 pb-3 text-xs text-white/70">
                <div className="flex items-center gap-3">
                    <span>{MCG.name}</span>
                    <span className="text-white/40">·</span>
                    <span className="flex items-center gap-1">
                        <MarkerPin01 className="size-3.5 text-white/50" aria-hidden="true" />
                        {MCG.city}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link href="/account" className="flex items-center gap-1.5 text-white/70 transition duration-100 ease-linear hover:text-white">
                                <User01 className="size-3.5" aria-hidden="true" />
                                {user.first} {user.last[0]}.
                            </Link>
                            <button
                                type="button"
                                onClick={signOut}
                                className="flex items-center gap-1.5 text-white/70 transition duration-100 ease-linear hover:text-white"
                            >
                                <LogOut01 className="size-3.5" aria-hidden="true" />
                                Sign out
                            </button>
                        </>
                    ) : (
                        <Link href="/signin" className="flex items-center gap-1.5 text-white/70 transition duration-100 ease-linear hover:text-white">
                            <User01 className="size-3.5" aria-hidden="true" />
                            Sign in
                        </Link>
                    )}
                    <Link href="/cart" className="flex items-center gap-1.5 text-white transition duration-100 ease-linear hover:text-white/80">
                        <span className="relative">
                            <ShoppingCart01 className="size-3.5 text-white/50" aria-hidden="true" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 flex min-w-3.5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-black tabular-nums">
                                    {cartCount}
                                </span>
                            )}
                        </span>
                        <span className="tabular-nums">{money(cartTotal)}</span>
                    </Link>
                </div>
            </div>

            {/* Brand + primary nav */}
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 pt-5 pb-6">
                <Link href="/" className="flex items-center gap-3">
                    <McgLogo className="h-11 w-auto" />
                    <span className="text-lg font-semibold text-white">{MCG.name}</span>
                </Link>
                <nav className="flex flex-wrap items-center gap-x-7 gap-y-2 text-sm font-medium">
                    {NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                isActive(item.href)
                                    ? "border-b-2 border-white pb-1 text-white"
                                    : "pb-1 text-white/60 transition duration-100 ease-linear hover:text-white"
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
};

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export const McgFooter = () => (
    <footer className="bg-primary-solid px-8 py-10 text-sm text-white/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:flex-row sm:justify-between">
            <div className="flex flex-col gap-1.5">
                <p className="text-md font-semibold text-white">{MCG.name}</p>
                <p>{MCG.address}</p>
                <p className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-white/50" aria-hidden="true" />
                    {MCG.phone}
                </p>
                <p className="flex items-center gap-1.5">
                    <Mail01 className="size-3.5 text-white/50" aria-hidden="true" />
                    <span className="underline">{MCG.email}</span>
                </p>
            </div>
            <nav className="grid grid-cols-2 gap-x-10 gap-y-1.5 sm:grid-cols-3">
                {NAV.map((item) => (
                    <Link key={item.href} href={item.href} className="text-white/70 transition duration-100 ease-linear hover:text-white">
                        {item.label}
                    </Link>
                ))}
                <Link href="/account" className="text-white/70 transition duration-100 ease-linear hover:text-white">
                    My account
                </Link>
                <Link href="/signin" className="text-white/70 transition duration-100 ease-linear hover:text-white">
                    Sign in
                </Link>
            </nav>
        </div>
        <p className="mx-auto mt-8 w-full max-w-7xl border-t border-white/10 pt-6 text-xs text-white/40">
            Prototype — built on the Tenfore Fox design system. Not a live booking site.
        </p>
    </footer>
);

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

/**
 * The page shell. Carries the MCG brand override so every brand-derived token —
 * buttons, focus rings, selected states — renders in the club's green, exactly as the
 * Storybook screens do.
 */
export const McgShell = ({ children, bg = "secondary" }: { children: ReactNode; bg?: "primary" | "secondary" }) => (
    <div className={cx("flex min-h-dvh flex-col", bg === "secondary" ? "bg-secondary" : "bg-primary")} style={clubBrandStyle(MCG_GREEN)}>
        <McgNav />
        <main className="flex-1">{children}</main>
        <McgFooter />
    </div>
);

/** A centred page body with the standard gutter. */
export const McgPage = ({ children, width = "7xl" }: { children: ReactNode; width?: "3xl" | "5xl" | "6xl" | "7xl" }) => (
    <div
        className={cx(
            "mx-auto w-full px-6 py-8 sm:px-8",
            width === "3xl" && "max-w-3xl",
            width === "5xl" && "max-w-5xl",
            width === "6xl" && "max-w-6xl",
            width === "7xl" && "max-w-7xl",
        )}
    >
        {children}
    </div>
);

/** Page header band, matching `AcademyHero` from the Instruction kit. */
export const McgHero = ({
    title,
    blurb,
    right,
    leading,
    eyebrow = true,
}: {
    title: string;
    blurb?: string;
    right?: ReactNode;
    /**
     * A mark that sits beside the headline rather than opposite it — for a page whose
     * identity IS the mark, like the Academy. It reads as a lockup with the title
     * instead of a second, competing brand in the far corner.
     */
    leading?: ReactNode;
    /**
     * The "Montgomery County Golf" lockup above the title. On most pages it anchors
     * the hero, but a page that already carries its own brand — the Academy, whose
     * title names it and whose lockup sits opposite — gets three MCG marks stacked
     * within 200px of each other. Those pages turn it off.
     */
    eyebrow?: boolean;
}) => (
    <div className={cx("border-b border-secondary bg-primary px-6 py-9 sm:px-8", leading && "[&>div]:lg:items-center [&>div]:lg:justify-start [&>div]:lg:gap-7")}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            {leading && <div className="flex shrink-0 items-center">{leading}</div>}
            <div className="flex flex-col gap-3">
                {eyebrow && (
                    <div className="flex items-center gap-2.5">
                        <McgLogo className="h-8 w-auto" />
                        <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">Montgomery County Golf</span>
                    </div>
                )}
                <h1 className="max-w-2xl text-display-sm font-semibold text-primary">{title}</h1>
                {blurb && <p className="max-w-2xl text-md text-tertiary">{blurb}</p>}
            </div>
            {right}
        </div>
    </div>
);
