"use client";

/**
 * Three ways to fold MCG Prototype 3's header into a hamburger menu at phone width
 * (Reviews › Nov 27 – Mobile Nav). Today's `McgNav` stacks a utility bar (club, location,
 * account, sign out, cart) over the logo and six sections, and wraps badly below desktop.
 *
 * Each option keeps a single slim bar (logo, cart, menu) and moves everything else into
 * the menu:
 *  - A · Full-screen menu: the whole screen in MCG black, big section links.
 *  - B · Side drawer: Fox's slideout menu, light, account first, sections with icons.
 *  - C · Drop-down sheet: slides from the top, sections as tiles, cart and account below.
 *
 * Presentational on purpose: sections call `onNavigate(href)` so the stories stay put.
 * Wiring the chosen one into `McgNav` means swapping those buttons for `Link`s and reading
 * the session, below the `lg` breakpoint.
 */
import { type FC, type ReactNode, useState } from "react";
import {
    Calendar,
    ChevronRight,
    Flag01,
    GraduationHat01,
    LogIn01,
    LogOut01,
    MarkerPin01,
    Menu01,
    Receipt,
    ShoppingBag03,
    ShoppingCart01,
    Ticket01,
    User01,
    XClose,
} from "@untitledui/icons";
import { Dialog as AriaDialog, Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { McgLogo } from "@/components/foundations/mcg/mcg-logo";
import { MCG_GREEN } from "@/components/instruction-3/instruction-catalog";
import { clubBrandStyle } from "@/stories/explorations/tenfore-chrome";
import { cx } from "@/utils/cx";
import { MCG, NAV } from "./mcg-chrome";

export interface MobileNavUser {
    first: string;
    last: string;
    email: string;
    initials: string;
}

export interface MobileNavProps {
    /** Signed-in golfer; null when signed out. */
    user?: MobileNavUser | null;
    cartCount?: number;
    cartTotal?: number;
    /** The section the golfer is on, e.g. "/tee-times". */
    activeHref?: string;
    /** Open the menu on first render (for review stories). */
    defaultOpen?: boolean;
    onNavigate?: (href: string) => void;
    onSignIn?: () => void;
    onSignOut?: () => void;
}

const ICONS: Record<string, FC<{ className?: string }>> = {
    "/tee-times": Flag01,
    "/shop": ShoppingBag03,
    "/events": Ticket01,
    "/instruction": GraduationHat01,
    "/calendar": Calendar,
    "/grill": Receipt,
};

const money = (n: number) => `$${n.toFixed(2)}`;
const itemsLabel = (n: number) => `${n} ${n === 1 ? "item" : "items"}`;
const brand = clubBrandStyle(MCG_GREEN);

/* ------------------------------------------------------------------ */
/* Shared bar parts                                                    */
/* ------------------------------------------------------------------ */

const BarButton = ({ label, onPress, expanded, children }: { label: string; onPress: () => void; expanded?: boolean; children: ReactNode }) => (
    <button
        type="button"
        aria-label={label}
        aria-expanded={expanded}
        onClick={onPress}
        className="relative flex size-11 items-center justify-center rounded-lg text-white transition duration-100 ease-linear hover:bg-white/10"
    >
        {children}
    </button>
);

/** Cart icon with a count badge; the total sits beside it when `showTotal`. */
const CartButton = ({ count, total, showTotal, onPress }: { count: number; total: number; showTotal?: boolean; onPress: () => void }) => (
    <button
        type="button"
        aria-label={`Cart, ${itemsLabel(count)}, ${money(total)}`}
        onClick={onPress}
        className="flex h-11 items-center gap-1.5 rounded-lg px-2.5 text-white transition duration-100 ease-linear hover:bg-white/10"
    >
        <span className="relative">
            <ShoppingCart01 className="size-5" aria-hidden="true" />
            {count > 0 && (
                <span className="absolute -top-1.5 -right-2 flex min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black tabular-nums">
                    {count}
                </span>
            )}
        </span>
        {showTotal && <span className="text-sm font-medium tabular-nums">{money(total)}</span>}
    </button>
);

const Lockup = ({ onPress, showName = true, compact }: { onPress: () => void; showName?: boolean; compact?: boolean }) => (
    <button type="button" onClick={onPress} className="flex min-w-0 items-center gap-2.5 text-left" aria-label={`${MCG.name} home`}>
        <McgLogo className={cx("w-auto shrink-0", compact ? "h-8" : "h-9")} />
        {showName && <span className="line-clamp-2 max-w-40 text-sm leading-tight font-semibold text-white">{MCG.name}</span>}
    </button>
);

const useMenu = (defaultOpen = false) => {
    const [open, setOpen] = useState(defaultOpen);
    return { open, setOpen, close: () => setOpen(false) };
};

/* ------------------------------------------------------------------ */
/* A · Full-screen menu                                                */
/* ------------------------------------------------------------------ */

/**
 * Bar: logo + name, cart with total, menu. The menu takes the whole screen in MCG black:
 * location, six big section links, the cart, then the account at the bottom.
 */
export const MobileNavFullScreen = ({
    user,
    cartCount = 0,
    cartTotal = 0,
    activeHref = "/tee-times",
    defaultOpen,
    onNavigate,
    onSignIn,
    onSignOut,
}: MobileNavProps) => {
    const { open, setOpen, close } = useMenu(defaultOpen);
    const go = (href: string) => {
        close();
        onNavigate?.(href);
    };

    return (
        <>
            <header style={brand} className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-white/10 bg-primary-solid pr-2 pl-4 text-white">
                <Lockup onPress={() => go("/")} />
                <div className="ml-auto flex shrink-0 items-center">
                    <CartButton count={cartCount} total={cartTotal} showTotal onPress={() => go("/cart")} />
                    <BarButton label="Open menu" expanded={open} onPress={() => setOpen(true)}>
                        <Menu01 className="size-6" aria-hidden="true" />
                    </BarButton>
                </div>
            </header>

            <AriaModalOverlay
                isOpen={open}
                onOpenChange={setOpen}
                isDismissable
                className={({ isEntering, isExiting }) =>
                    cx(
                        "fixed inset-0 z-50 bg-primary-solid",
                        isEntering && "duration-200 ease-out animate-in fade-in",
                        isExiting && "duration-150 ease-in animate-out fade-out",
                    )
                }
            >
                <AriaModal className="size-full">
                    <AriaDialog aria-label="Menu" style={brand} className="flex size-full flex-col overflow-y-auto text-white outline-hidden">
                        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 pr-2 pl-4">
                            <Lockup onPress={() => go("/")} />
                            <div className="ml-auto">
                                <BarButton label="Close menu" onPress={close}>
                                    <XClose className="size-6" aria-hidden="true" />
                                </BarButton>
                            </div>
                        </div>

                        <p className="flex items-center gap-1.5 px-5 pt-5 text-sm text-white/60">
                            <MarkerPin01 className="size-4 text-white/40" aria-hidden="true" />
                            {MCG.city}
                        </p>

                        <nav aria-label="Main" className="flex flex-col px-3 pt-3">
                            {NAV.map((item) => {
                                const active = item.href === activeHref;
                                return (
                                    <button
                                        key={item.href}
                                        type="button"
                                        onClick={() => go(item.href)}
                                        aria-current={active ? "page" : undefined}
                                        className={cx(
                                            "flex items-center justify-between rounded-xl px-3 py-3.5 text-left text-display-xs font-semibold transition duration-100 ease-linear",
                                            active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                                        )}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className={cx("h-6 w-1 rounded-full", active ? "bg-brand-solid" : "bg-transparent")} aria-hidden="true" />
                                            {item.label}
                                        </span>
                                        <ChevronRight className="size-5 text-white/40" aria-hidden="true" />
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="mt-auto flex flex-col gap-4 px-5 pt-8 pb-8">
                            <button
                                type="button"
                                onClick={() => go("/cart")}
                                className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3.5 ring-1 ring-white/10 transition duration-100 ease-linear ring-inset hover:bg-white/10"
                            >
                                <span className="flex items-center gap-3 text-md font-medium">
                                    <ShoppingCart01 className="size-5 text-white/60" aria-hidden="true" />
                                    Cart
                                </span>
                                <span className="text-sm text-white/70 tabular-nums">
                                    {itemsLabel(cartCount)} · <span className="font-semibold text-white">{money(cartTotal)}</span>
                                </span>
                            </button>

                            {user ? (
                                <div className="flex items-center gap-3 border-t border-white/10 pt-5">
                                    <Avatar size="md" initials={user.initials} />
                                    <button type="button" onClick={() => go("/account")} className="min-w-0 flex-1 text-left">
                                        <p className="truncate text-md font-semibold text-white">
                                            {user.first} {user.last}
                                        </p>
                                        <p className="truncate text-sm text-white/60">View account</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            close();
                                            onSignOut?.();
                                        }}
                                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition duration-100 ease-linear hover:bg-white/10 hover:text-white"
                                    >
                                        <LogOut01 className="size-4" aria-hidden="true" />
                                        Sign out
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t border-white/10 pt-5">
                                    <Button
                                        size="lg"
                                        color="primary"
                                        iconLeading={LogIn01}
                                        className="w-full"
                                        onClick={() => {
                                            close();
                                            onSignIn?.();
                                        }}
                                    >
                                        Sign in
                                    </Button>
                                </div>
                            )}
                        </div>
                    </AriaDialog>
                </AriaModal>
            </AriaModalOverlay>
        </>
    );
};

/* ------------------------------------------------------------------ */
/* B · Side drawer                                                     */
/* ------------------------------------------------------------------ */

/**
 * Bar: logo + name, cart, menu. The menu is Fox's slideout drawer from the right, light:
 * who you are first, the club and location, the six sections with icons, sign out last.
 */
export const MobileNavDrawer = ({
    user,
    cartCount = 0,
    cartTotal = 0,
    activeHref = "/tee-times",
    defaultOpen,
    onNavigate,
    onSignIn,
    onSignOut,
}: MobileNavProps) => {
    const { open, setOpen, close } = useMenu(defaultOpen);
    const go = (href: string) => {
        close();
        onNavigate?.(href);
    };

    return (
        <>
            <header style={brand} className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-white/10 bg-primary-solid pr-2 pl-4 text-white">
                <Lockup onPress={() => go("/")} />
                <div className="ml-auto flex shrink-0 items-center">
                    <CartButton count={cartCount} total={cartTotal} onPress={() => go("/cart")} />
                    <BarButton label="Open menu" expanded={open} onPress={() => setOpen(true)}>
                        <Menu01 className="size-6" aria-hidden="true" />
                    </BarButton>
                </div>
            </header>

            <SlideoutMenu isOpen={open} onOpenChange={setOpen} isDismissable dialogClassName="gap-0" className="z-50">
                <div style={brand} className="flex size-full flex-col">
                    <SlideoutMenu.Header onClose={close} className="pb-5">
                        {user ? (
                            <button type="button" onClick={() => go("/account")} className="flex items-center gap-3 pr-10 text-left">
                                <Avatar size="lg" initials={user.initials} />
                                <span className="min-w-0">
                                    <span className="block truncate text-lg font-semibold text-primary">Hi, {user.first}</span>
                                    <span className="block truncate text-sm text-tertiary">{user.email}</span>
                                </span>
                            </button>
                        ) : (
                            <div className="flex flex-col gap-3 pr-10">
                                <p className="text-lg font-semibold text-primary">Welcome</p>
                                <Button
                                    size="md"
                                    color="primary"
                                    iconLeading={LogIn01}
                                    onClick={() => {
                                        close();
                                        onSignIn?.();
                                    }}
                                >
                                    Sign in
                                </Button>
                            </div>
                        )}
                    </SlideoutMenu.Header>

                    <SlideoutMenu.Content className="gap-5 border-t border-secondary pt-5">
                        <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                            <McgLogo className="h-9 w-auto shrink-0" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-primary">{MCG.name}</p>
                                <p className="flex items-center gap-1 truncate text-sm text-tertiary">
                                    <MarkerPin01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                                    {MCG.city}
                                </p>
                            </div>
                        </div>

                        <nav aria-label="Main" className="flex flex-col gap-0.5">
                            {NAV.map((item) => {
                                const Icon = ICONS[item.href] ?? Flag01;
                                const active = item.href === activeHref;
                                return (
                                    <button
                                        key={item.href}
                                        type="button"
                                        onClick={() => go(item.href)}
                                        aria-current={active ? "page" : undefined}
                                        className={cx(
                                            "flex items-center gap-3 rounded-lg px-3 py-3 text-left text-md font-semibold transition duration-100 ease-linear",
                                            active ? "bg-active text-primary" : "text-secondary hover:bg-primary_hover",
                                        )}
                                    >
                                        <Icon className={cx("size-5 shrink-0", active ? "text-fg-brand-primary" : "text-fg-quaternary")} aria-hidden="true" />
                                        <span className="flex-1">{item.label}</span>
                                        {active && <span className="size-2 rounded-full bg-brand-solid" aria-hidden="true" />}
                                    </button>
                                );
                            })}
                        </nav>

                        <button
                            type="button"
                            onClick={() => go("/cart")}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-md font-semibold text-secondary transition duration-100 ease-linear hover:bg-primary_hover"
                        >
                            <ShoppingCart01 className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            <span className="flex-1">Cart</span>
                            <span className="text-sm font-medium text-tertiary tabular-nums">
                                {itemsLabel(cartCount)} · {money(cartTotal)}
                            </span>
                        </button>
                    </SlideoutMenu.Content>

                    {user && (
                        <SlideoutMenu.Footer>
                            <Button
                                size="md"
                                color="secondary"
                                iconLeading={LogOut01}
                                className="w-full"
                                onClick={() => {
                                    close();
                                    onSignOut?.();
                                }}
                            >
                                Sign out
                            </Button>
                        </SlideoutMenu.Footer>
                    )}
                </div>
            </SlideoutMenu>
        </>
    );
};

/* ------------------------------------------------------------------ */
/* C · Drop-down sheet                                                 */
/* ------------------------------------------------------------------ */

/**
 * Bar: menu on the left, logo in the middle, cart on the right. The menu drops down from
 * the top over a dimmed page: the six sections as tiles, then the cart and the account.
 */
export const MobileNavSheet = ({
    user,
    cartCount = 0,
    cartTotal = 0,
    activeHref = "/tee-times",
    defaultOpen,
    onNavigate,
    onSignIn,
    onSignOut,
}: MobileNavProps) => {
    const { open, setOpen, close } = useMenu(defaultOpen);
    const go = (href: string) => {
        close();
        onNavigate?.(href);
    };

    const bar = (isOpen: boolean) => (
        <div className="grid h-16 shrink-0 grid-cols-[auto_1fr_auto] items-center gap-2 px-2">
            <BarButton label={isOpen ? "Close menu" : "Open menu"} expanded={isOpen} onPress={() => (isOpen ? close() : setOpen(true))}>
                {isOpen ? <XClose className="size-6" aria-hidden="true" /> : <Menu01 className="size-6" aria-hidden="true" />}
            </BarButton>
            <div className="flex justify-center">
                <Lockup onPress={() => go("/")} showName={false} />
            </div>
            <CartButton count={cartCount} total={cartTotal} onPress={() => go("/cart")} />
        </div>
    );

    return (
        <>
            <header style={brand} className="sticky top-0 z-10 border-b border-white/10 bg-primary-solid text-white">
                {bar(false)}
            </header>

            <AriaModalOverlay
                isOpen={open}
                onOpenChange={setOpen}
                isDismissable
                className={({ isEntering, isExiting }) =>
                    cx(
                        "fixed inset-0 z-50 bg-overlay/70",
                        isEntering && "duration-200 ease-out animate-in fade-in",
                        isExiting && "duration-150 ease-in animate-out fade-out",
                    )
                }
            >
                <AriaModal
                    className={({ isEntering, isExiting }) =>
                        cx(
                            "fixed inset-x-0 top-0",
                            isEntering && "duration-200 ease-out animate-in slide-in-from-top",
                            isExiting && "duration-150 ease-in animate-out slide-out-to-top",
                        )
                    }
                >
                    <AriaDialog
                        aria-label="Menu"
                        style={brand}
                        className="flex max-h-dvh flex-col overflow-y-auto rounded-b-2xl bg-primary-solid text-white shadow-xl outline-hidden"
                    >
                        {bar(true)}

                        <div className="flex flex-col gap-5 px-4 pt-2 pb-5">
                            <div className="text-center">
                                <p className="text-md font-semibold text-white">{MCG.name}</p>
                                <p className="mt-0.5 flex items-center justify-center gap-1 text-sm text-white/60">
                                    <MarkerPin01 className="size-3.5 text-white/40" aria-hidden="true" />
                                    {MCG.city}
                                </p>
                            </div>

                            <nav aria-label="Main" className="grid grid-cols-3 gap-2.5">
                                {NAV.map((item) => {
                                    const Icon = ICONS[item.href] ?? Flag01;
                                    const active = item.href === activeHref;
                                    return (
                                        <button
                                            key={item.href}
                                            type="button"
                                            onClick={() => go(item.href)}
                                            aria-current={active ? "page" : undefined}
                                            className={cx(
                                                "flex aspect-square flex-col items-center justify-center gap-2 rounded-xl text-sm font-semibold transition duration-100 ease-linear ring-inset",
                                                active
                                                    ? "bg-white/10 text-white ring-2 ring-brand"
                                                    : "bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10",
                                            )}
                                        >
                                            <Icon className={cx("size-6", active ? "text-fg-brand-primary" : "text-white/60")} aria-hidden="true" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>

                            <button
                                type="button"
                                onClick={() => go("/cart")}
                                className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 transition duration-100 ease-linear ring-inset hover:bg-white/10"
                            >
                                <span className="flex items-center gap-3 text-sm font-semibold">
                                    <ShoppingCart01 className="size-5 text-white/60" aria-hidden="true" />
                                    Cart · {itemsLabel(cartCount)}
                                </span>
                                <span className="text-sm font-semibold tabular-nums">{money(cartTotal)}</span>
                            </button>

                            <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                                {user ? (
                                    <>
                                        <button type="button" onClick={() => go("/account")} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
                                            <Avatar size="sm" initials={user.initials} />
                                            <span className="truncate text-sm font-semibold">
                                                {user.first} {user.last[0]}.
                                            </span>
                                            <span className="text-sm text-white/60">· Account</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                close();
                                                onSignOut?.();
                                            }}
                                            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition duration-100 ease-linear hover:bg-white/10 hover:text-white"
                                        >
                                            <LogOut01 className="size-4" aria-hidden="true" />
                                            Sign out
                                        </button>
                                    </>
                                ) : (
                                    <Button
                                        size="md"
                                        color="secondary"
                                        iconLeading={User01}
                                        className="flex-1"
                                        onClick={() => {
                                            close();
                                            onSignIn?.();
                                        }}
                                    >
                                        Sign in
                                    </Button>
                                )}
                            </div>
                        </div>
                    </AriaDialog>
                </AriaModal>
            </AriaModalOverlay>
        </>
    );
};
