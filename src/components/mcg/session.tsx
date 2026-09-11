"use client";

/**
 * Prototype session — the thin layer of state that makes the MCG prototype feel like
 * one application rather than a set of screens.
 *
 * Everything lives in `localStorage` under a single key, so a walkthrough survives a
 * refresh and a shared link opens clean. There is no server: signing in accepts any
 * credentials, and every "purchase" simply appends to this store.
 *
 * Storybook renders the same components without this provider, so every hook here
 * falls back to a sane default when no provider is present. That keeps a component
 * usable in a story *and* in the app without branching.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const KEY = "mcg-prototype-session-v1";

/* ------------------------------------------------------------------ */
/* Shapes                                                              */
/* ------------------------------------------------------------------ */

export interface SessionUser {
    first: string;
    last: string;
    email: string;
    phone: string;
    initials: string;
    /** Set when the account was created in this session rather than seeded. */
    isNew?: boolean;
}

export interface CartLine {
    id: string;
    /** What kind of thing this is, so checkout can group and label it. */
    kind: "product" | "tee-time" | "lesson" | "clinic" | "event" | "package" | "membership";
    name: string;
    detail?: string;
    image?: string;
    unitPrice: number;
    qty: number;
    /** Where it came from, for the "keep shopping" link. */
    href?: string;
}

export type ActivityKind = "tee-time" | "lesson" | "clinic" | "event" | "purchase" | "package" | "dining";

export interface ActivityItem {
    id: string;
    kind: ActivityKind;
    title: string;
    detail: string;
    /** ISO date the thing happens (or happened). */
    isoDate: string;
    dateLabel: string;
    timeLabel?: string;
    courseSlug?: string;
    amount?: number;
    status: "Upcoming" | "Completed" | "Cancelled";
}

export interface LessonCredit {
    id: string;
    coachId: string;
    packageId: string;
    creditsTotal: number;
    creditsRemaining: number;
    valueRemaining: number;
    purchasedOn: string;
    expiresOn?: string;
}

export interface SessionState {
    user: SessionUser | null;
    cart: CartLine[];
    activity: ActivityItem[];
    credits: LessonCredit[];
    /** Course the golfer is browsing, shared by the nav and the tee sheet. */
    courseSlug: string;
    /** Product ids the golfer has hearted in the Pro Shop. */
    saved: string[];
    /**
     * Montgomery County residency. A county system's defining commercial fact: it
     * drives the green fee on every course, so it lives on the session rather than
     * on the account page that happens to set it.
     */
    isResident: boolean;
}

export const DEMO_USER: SessionUser = {
    first: "Justin",
    last: "Girard",
    email: "hello@girardjustin.com",
    phone: "(240) 555-0117",
    initials: "JG",
};

const EMPTY: SessionState = {
    user: null,
    cart: [],
    activity: [],
    credits: [],
    courseSlug: "falls-road",
    saved: [],
    isResident: false,
};

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

export interface SessionApi extends SessionState {
    /** True once localStorage has been read, so the UI can avoid a hydration flash. */
    ready: boolean;
    cartCount: number;
    cartTotal: number;

    signIn: (user?: Partial<SessionUser>) => void;
    signOut: () => void;

    addToCart: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
    setQty: (id: string, qty: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;

    /** Turn the cart into activity and empty it — the end of any checkout. */
    checkout: (items?: ActivityItem[]) => void;
    addActivity: (item: ActivityItem) => void;

    addCredits: (credit: LessonCredit) => void;
    spendCredit: (coachId: string, value: number) => void;

    setCourse: (slug: string) => void;
    toggleSaved: (id: string) => void;
    setResident: (value: boolean) => void;
    reset: () => void;
}

const noop = () => {};

const SessionContext = createContext<SessionApi | null>(null);

const read = (): SessionState => {
    if (typeof window === "undefined") return EMPTY;
    try {
        const raw = window.localStorage.getItem(KEY);
        if (!raw) return EMPTY;
        return { ...EMPTY, ...(JSON.parse(raw) as Partial<SessionState>) };
    } catch {
        // Private windows and blocked site data both land here.
        return EMPTY;
    }
};

const write = (state: SessionState) => {
    try {
        window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
        /* storage unavailable — the session just won't persist */
    }
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<SessionState>(EMPTY);
    const [ready, setReady] = useState(false);

    // Read after mount so the server-rendered HTML and the first client render match.
    useEffect(() => {
        setState(read());
        setReady(true);
    }, []);

    useEffect(() => {
        if (ready) write(state);
    }, [state, ready]);

    const update = useCallback((fn: (s: SessionState) => SessionState) => setState(fn), []);

    const api = useMemo<SessionApi>(() => {
        const cartCount = state.cart.reduce((n, l) => n + l.qty, 0);
        const cartTotal = state.cart.reduce((n, l) => n + l.qty * l.unitPrice, 0);

        return {
            ...state,
            ready,
            cartCount,
            cartTotal,

            signIn: (user) =>
                update((s) => ({
                    ...s,
                    user: { ...DEMO_USER, ...user, initials: `${(user?.first ?? DEMO_USER.first)[0]}${(user?.last ?? DEMO_USER.last)[0]}`.toUpperCase() },
                })),
            signOut: () => update((s) => ({ ...s, user: null })),

            addToCart: (line) =>
                update((s) => {
                    const existing = s.cart.find((l) => l.id === line.id);
                    if (existing) {
                        return { ...s, cart: s.cart.map((l) => (l.id === line.id ? { ...l, qty: l.qty + (line.qty ?? 1) } : l)) };
                    }
                    return { ...s, cart: [...s.cart, { ...line, qty: line.qty ?? 1 }] };
                }),
            setQty: (id, qty) => update((s) => ({ ...s, cart: qty <= 0 ? s.cart.filter((l) => l.id !== id) : s.cart.map((l) => (l.id === id ? { ...l, qty } : l)) })),
            removeFromCart: (id) => update((s) => ({ ...s, cart: s.cart.filter((l) => l.id !== id) })),
            clearCart: () => update((s) => ({ ...s, cart: [] })),

            checkout: (items) => update((s) => ({ ...s, cart: [], activity: [...(items ?? []), ...s.activity] })),
            addActivity: (item) => update((s) => ({ ...s, activity: [item, ...s.activity] })),

            addCredits: (credit) => update((s) => ({ ...s, credits: [credit, ...s.credits] })),
            spendCredit: (coachId, value) =>
                update((s) => ({
                    ...s,
                    credits: s.credits.map((c) =>
                        c.coachId === coachId && c.creditsRemaining > 0
                            ? { ...c, creditsRemaining: c.creditsRemaining - 1, valueRemaining: Math.max(0, c.valueRemaining - value) }
                            : c,
                    ),
                })),

            setCourse: (slug) => update((s) => ({ ...s, courseSlug: slug })),
            setResident: (value) => update((s) => ({ ...s, isResident: value })),
            toggleSaved: (id) => update((s) => ({ ...s, saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] })),
            reset: () => update(() => EMPTY),
        };
    }, [state, ready, update]);

    return <SessionContext.Provider value={api}>{children}</SessionContext.Provider>;
};

/**
 * Read the prototype session. Outside a provider — i.e. inside a Storybook story —
 * this returns an inert session so the same component renders either way.
 */
export const useSession = (): SessionApi => {
    const ctx = useContext(SessionContext);
    if (ctx) return ctx;
    return {
        ...EMPTY,
        ready: true,
        cartCount: 0,
        cartTotal: 0,
        signIn: noop,
        signOut: noop,
        addToCart: noop,
        setQty: noop,
        removeFromCart: noop,
        clearCart: noop,
        checkout: noop,
        addActivity: noop,
        addCredits: noop,
        spendCredit: noop,
        setCourse: noop,
        toggleSaved: noop,
        setResident: noop,
        reset: noop,
    };
};

/** Stable id for anything the prototype creates. */
export const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
