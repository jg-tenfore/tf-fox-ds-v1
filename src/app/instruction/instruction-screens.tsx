"use client";

/**
 * Instruction, routed.
 *
 * The two Instruction flows predate the prototype's chrome: they were built for
 * Storybook and bring their own `InstructionShell`, which wraps the design-system
 * `TopNav` — deliberately inert links. Mounted at a real URL that shell is wrong, and
 * a golfer who reached Instruction would find every other tab dead.
 *
 * Rather than fork the flows or thread a prop through forty `InstructionShell` calls,
 * `InstructionShellProvider` lets the app hand the flows a different shell from above.
 * Storybook supplies none and renders exactly what it rendered before; here we supply
 * `McgShell`, so the flows sit inside the routed nav, footer and cart with no other
 * change to them at all.
 */

import type { ReactNode } from "react";
import { InstructionShellProvider } from "@/components/instruction/instruction-ui";
import { LessonPackagesFlow } from "@/components/instruction/lesson-packages-flow";
import { AcademyInstructorsScreen } from "@/components/mcg/academy/instructors-screen";
import { McgShell } from "@/components/mcg/mcg-chrome";

/** Module scope, so the context value is referentially stable across renders. */
const routedShell = (body: ReactNode) => <McgShell>{body}</McgShell>;

const Routed = ({ children }: { children: ReactNode }) => <InstructionShellProvider shell={routedShell}>{children}</InstructionShellProvider>;

/**
 * `/instruction` — the Academy front door.
 *
 * Instructor-first: a golfer picks a pro here, picks a lesson from that pro's profile,
 * and lands on `/instruction/book` for time, details and payment. The service-first
 * catalog that used to live at this URL is retired from the routed app; group clinics
 * are reached through the Clinics tab and each instructor's profile instead.
 *
 * `LessonBookingFlow`'s catalog and instructor steps still exist as component states —
 * the Storybook stories document them — they are simply no longer the way in.
 */
export const InstructionCatalogScreen = () => <AcademyInstructorsScreen />;

/** `/instruction/packages` — Flow B, browsing lesson packs. */
export const InstructionPackagesScreen = () => (
    <Routed>
        <LessonPackagesFlow step="browse" />
    </Routed>
);

/** `/instruction/credits` — Flow B opened on the golfer's credit wallet. */
export const InstructionCreditsScreen = () => (
    <Routed>
        <LessonPackagesFlow step="wallet" />
    </Routed>
);
