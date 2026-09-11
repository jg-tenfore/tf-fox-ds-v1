"use client";

/**
 * `/instruction/book` — the back half of the instructor-first path.
 *
 * By the time a golfer arrives here they have already made the two decisions the
 * Academy cares about: **who** (chosen on `/instruction`) and **what** (chosen on that
 * instructor's profile). This page owns only what is left — time, details, payment —
 * which is why its rail is three steps rather than five.
 *
 * It deliberately does not re-implement any of that. `LessonBookingFlow` already holds
 * the guardrail logic, the any-instructor board, waitlists, lesson credits, promo codes
 * and the confirmation; `locked` mode simply enters it at the time step with the
 * instructor and lesson fixed. A second checkout would be a second thing to keep right.
 *
 * Selection arrives two ways so the page works however it is reached:
 *  - `?coach=&service=&course=` in the URL, which makes a booking linkable and is what
 *    the profile's Book buttons use;
 *  - a `sessionStorage` hand-off, for callers that would rather not put it in the URL.
 * Opened cold with neither, it says so and sends the golfer back to pick a pro rather
 * than silently booking a lesson nobody chose.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, SearchLg } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { LessonBookingFlow } from "@/components/instruction/lesson-booking-flow";
import { InstructionShellProvider } from "@/components/instruction/instruction-ui";
import { coachById, serviceById, PRIVATE_SERVICES } from "@/components/instruction/instruction-catalog";
import { McgHero, McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import type { ReactNode } from "react";

const KEY = "mcg-lesson-selection-v1";

export interface LessonSelection {
    coachId: string;
    serviceId: string;
    courseSlug?: string;
}

/** Hand a selection to `/instruction/book` without putting it in the URL. */
export const writeLessonSelection = (selection: LessonSelection) => {
    try {
        window.sessionStorage.setItem(KEY, JSON.stringify(selection));
    } catch {
        /* storage unavailable — the query-string path still works */
    }
};

/** The canonical link a Book button should use: linkable, and survives a refresh. */
export const bookHref = ({ coachId, serviceId, courseSlug }: LessonSelection) => {
    const params = new URLSearchParams({ coach: coachId, service: serviceId });
    if (courseSlug) params.set("course", courseSlug);
    return `/instruction/book/?${params.toString()}`;
};

/**
 * Read the selection on the client.
 *
 * `useSearchParams` would force a Suspense boundary under `output: "export"`, so the
 * query string is read straight off `window.location` in an effect instead.
 */
const useSelection = (): { selection: LessonSelection | null; ready: boolean } => {
    const [selection, setSelection] = useState<LessonSelection | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const coachId = params.get("coach");
        const serviceId = params.get("service");
        const courseSlug = params.get("course") ?? undefined;

        if (coachId && coachById(coachId) && serviceId && serviceById(serviceId)) {
            setSelection({ coachId, serviceId, courseSlug });
            setReady(true);
            return;
        }

        try {
            const raw = window.sessionStorage.getItem(KEY);
            if (raw) {
                const stashed = JSON.parse(raw) as LessonSelection;
                if (coachById(stashed.coachId) && serviceById(stashed.serviceId)) {
                    setSelection(stashed);
                    setReady(true);
                    return;
                }
            }
        } catch {
            /* fall through to the cold-start state */
        }
        setReady(true);
    }, []);

    return { selection, ready };
};

const routedShell = (body: ReactNode) => <McgShell>{body}</McgShell>;

/** Nothing was chosen — say so, and point back at the step that was skipped. */
const ColdStart = () => (
    <McgShell>
        <McgHero
            title="Pick an instructor first"
            blurb="Booking starts with a pro: choose one, pick the lesson you want from their menu, and we'll bring you back here for a time."
        />
        <McgPage width="5xl">
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-primary px-6 py-14 text-center ring-1 ring-secondary ring-inset">
                <SearchLg className="size-6 text-fg-quaternary" aria-hidden="true" />
                <p className="max-w-md text-md text-tertiary">
                    This page books a lesson you&rsquo;ve already chosen. It looks like you arrived without one — probably a link that lost its details.
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                    <Button size="lg" color="primary" href="/instruction" iconTrailing={ArrowRight}>
                        Choose an instructor
                    </Button>
                    <Button size="lg" color="secondary" href="/clinics">
                        Browse clinics instead
                    </Button>
                </div>
                <p className="text-sm text-tertiary">
                    {PRIVATE_SERVICES.length} lesson types across the Academy ·{" "}
                    <Link href="/instruction/packages" className="font-semibold text-brand-secondary hover:underline">
                        lesson packages
                    </Link>
                </p>
            </div>
        </McgPage>
    </McgShell>
);

export interface LessonBookScreenProps {
    /**
     * Bypass the URL and session reader. The routed page never passes this — it exists
     * so a story can render a real booking, since a Storybook iframe has no selection
     * in its query string and would otherwise only ever show the cold start.
     */
    selection?: LessonSelection;
}

export const LessonBookScreen = ({ selection: given }: LessonBookScreenProps = {}) => {
    const read = useSelection();
    const selection = given ?? read.selection;
    const ready = given ? true : read.ready;

    // Nothing renders until the client has read the selection: a flash of the cold
    // start before the real booking appears would read as an error.
    if (!ready) return <McgShell>{null}</McgShell>;
    if (!selection) return <ColdStart />;

    const coach = coachById(selection.coachId)!;

    return (
        <InstructionShellProvider shell={routedShell}>
            <LessonBookingFlow
                locked
                step="time"
                coachId={selection.coachId}
                serviceId={selection.serviceId}
                courseSlug={selection.courseSlug ?? coach.courseSlugs[0]}
            />
        </InstructionShellProvider>
    );
};
