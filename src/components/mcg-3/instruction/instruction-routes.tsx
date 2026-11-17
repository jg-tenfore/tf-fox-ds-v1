"use client";

/**
 * Every Instruction route, as a pathname → screen table. The P3 app routes with Next's file
 * system (`prototype-3/app/instruction/**`); Storybook's memory router (`story-router.tsx`) uses
 * this table so a story can be clicked through end to end. Keep the two in step.
 *
 *   /instruction                     hub (Services tab)            ?view=instructors for the other tab
 *   /instruction/instructors         hub on the Instructors tab
 *   /instruction/service/:id         a private lesson, Academy program or county clinic
 *   /instruction/pro/:id             instructor profile            (/instruction/instructors/:id too)
 *   /instruction/book                time · details · account · payment, or program registration
 *   /instruction/review              confirmation (step=booked|waitlisted|registered) or rate a lesson
 *   /instruction/packages            packs, plans, pack detail / checkout / done
 *   /instruction/credits             My lesson credits
 *   /clinics                         → /instruction?formats=clinic,junior-camp,junior-league,op36
 *   /clinics/:id                     → the service page for that clinic
 */
import type { ReactNode } from "react";
import { LessonReviewPage } from "./book/review-page";
import { ClinicsRedirect } from "./hub/clinics-redirect";
import { BookPage } from "./book/book-page";
import { InstructionHubPage } from "./hub/instruction-hub-page";
import { ServicePage } from "./hub/service-page";
import { CreditsPage } from "./packages/credits-page";
import { PackagesRoute } from "./packages/packages-route";
import { InstructorProfilePage } from "./pro/instructor-profile-page";

/** The screen for an app-relative pathname, or null when Instruction doesn't own it. */
export const renderInstructionRoute = (pathname: string): ReactNode | null => {
    const p = pathname.replace(/\/+$/, "") || "/";
    const seg = p.split("/").filter(Boolean).map(decodeURIComponent);
    if (seg[0] === "clinics") return seg[1] ? <ServicePage key={seg[1]} id={seg[1]} /> : <ClinicsRedirect />;
    if (seg[0] !== "instruction") return null;
    if (seg.length === 1) return <InstructionHubPage />;
    switch (seg[1]) {
        case "instructors":
            return seg[2] ? <InstructorProfilePage key={seg[2]} id={seg[2]} /> : <InstructionHubPage view="instructors" />;
        case "pro":
            return seg[2] ? <InstructorProfilePage key={seg[2]} id={seg[2]} /> : null;
        case "service":
            return seg[2] ? <ServicePage key={seg[2]} id={seg[2]} /> : null;
        case "book":
            return <BookPage />;
        case "review":
            return <LessonReviewPage />;
        case "packages":
            return <PackagesRoute />;
        case "credits":
            return <CreditsPage />;
        default:
            return null;
    }
};
