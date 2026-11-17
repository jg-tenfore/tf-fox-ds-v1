"use client";

/**
 * Story kit for Prototype 3's Instruction stories (ported from Crane's `mcg-story-kit.tsx`).
 *
 *     export const TimeBoard = p3Story(bookHref({ coach: "mike-kenny", service: "private-45", course: "falls-road" }), "What it shows.");
 *     export const Guest = p3Story(path, "Signed out.", { signedIn: false }, "Sign-in gate (guest)");
 *
 * Every story mounts the URL with `InstructionStory` (in-memory router + P3 session + Instruction
 * store), so it stays clickable end to end. Before it mounts, the P3 session in localStorage is
 * reset to a known state — signed in as the sample golfer Morgan Hale by default, signed out with
 * `signedIn: false` — so a story never inherits whatever the previous one left behind.
 */
import { useState, type ReactNode } from "react";
import type { StoryObj } from "@storybook/nextjs-vite";
import { DEMO_USER, SessionProvider } from "@/components/mcg-3/session";
import { InstructionStoreProvider } from "@/components/mcg-3/instruction/instruction-store";
import { InstructionMemoryNav } from "@/components/mcg-3/instruction/nav";
import { InstructionStory } from "@/components/mcg-3/instruction/story-router";
import { protoBase } from "@/stories/start-here/tokens";

/** The P3 session key (`src/components/mcg-3/session.tsx`) and the saved-instructors key (`instruction-store.tsx`). */
const SESSION_KEY = "mcg-p3-prototype-session-v2";
const SAVED_KEY = "mcg-p3-saved-instructors";

export interface P3SessionSeed {
    /** Signed in as Morgan Hale (default) or signed out. */
    signedIn?: boolean;
    /** Instructor ids the golfer has saved (the heart on a profile). Default none. */
    savedInstructors?: string[];
}

/** Write a clean P3 session to localStorage. Runs during render, before `SessionProvider` reads it on mount. */
const seedSession = ({ signedIn = true, savedInstructors = [] }: P3SessionSeed) => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
                user: signedIn ? DEMO_USER : null,
                cart: [],
                activity: [],
                credits: [],
                courseSlug: "falls-road",
                saved: [],
                isResident: false,
            }),
        );
        window.localStorage.setItem(SAVED_KEY, JSON.stringify(savedInstructors));
    } catch {
        /* storage blocked: the story renders signed out */
    }
};

/** Seeds the session once (synchronously, on first render), then renders its children. */
const Seeded = ({ seed, children }: { seed: P3SessionSeed; children: ReactNode }) => {
    useState(() => {
        seedSession(seed);
        return true;
    });
    return <>{children}</>;
};

export interface P3StoryProps extends P3SessionSeed {
    /** App-relative Instruction path, e.g. `/instruction/book?coach=mike-kenny&service=private-45`. */
    path: string;
    /**
     * Render this element at `path` instead of the route table's screen — for states a URL can't
     * express (e.g. `<InstructorProfilePage id="brent-wilkerson" fullyBooked />`). The first link
     * pressed hands over to the normal routed story.
     */
    screen?: ReactNode;
}

const FixedScreen = ({ path: initialPath, screen }: { path: string; screen: ReactNode }) => {
    const [path, setPath] = useState(initialPath);
    const [left, setLeft] = useState<string | null>(null);
    if (left) return <InstructionStory key={left} path={left} />;
    return (
        <SessionProvider>
            <InstructionStoreProvider>
                <InstructionMemoryNav value={{ path, push: setLeft, replace: setPath }}>{screen}</InstructionMemoryNav>
            </InstructionStoreProvider>
        </SessionProvider>
    );
};

/** One Prototype 3 Instruction state, mounted at its URL. */
export const P3Story = ({ path, screen, ...seed }: P3StoryProps) => (
    <Seeded seed={seed}>{screen ? <FixedScreen path={path} screen={screen} /> : <InstructionStory path={path} />}</Seeded>
);

/** A story object for one URL: `p3Story(path, description, { signedIn }, name)`. */
export const p3Story = (path: string, description: string, seed: P3SessionSeed = {}, name?: string): StoryObj => ({
    ...(name ? { name } : {}),
    render: () => <P3Story path={path} {...seed} />,
    parameters: { docs: { description: { story: `${description}\n\n\`${path}\`` } } },
});

/**
 * The same path on the running Prototype 3 app: `http://localhost:3002/instruction/?…` locally,
 * `…/tf-fox-ds-v1/prototype-3/instruction/?…` on GitHub Pages. P3 routes end in a slash.
 */
export const p3Url = (path: string) => {
    const [pathname, qs] = path.split("?");
    const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
    return `${protoBase(3)}${withSlash}${qs ? `?${qs}` : ""}`;
};
