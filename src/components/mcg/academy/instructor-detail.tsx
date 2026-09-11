"use client";

/**
 * `/instruction/instructors/[id]` — one MCG Golf Academy instructor.
 *
 * The real site's "LEARN MORE" goes to a page that is mostly a headshot, a title, the
 * line "Please call or email with any questions." and a BOOK NOW button. That copy is
 * kept, because it is the Academy's own, but the page carries more than a phone number:
 * the lesson menu priced for this instructor, when they are next free, the programs they
 * run, and the credit packs sold against them.
 *
 * Everything biographical stops at what the Academy publishes — name, credential, title,
 * courses, contact, and (for Mike Dickson alone) a bio. No specialisms, no years
 * teaching, no ratings: these are real, named county employees, and a plausible-looking
 * invented detail is exactly the kind of thing that outlives a prototype. Where the
 * layout wants substance it uses structural facts instead.
 */
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Award01, Calendar, Clock, MarkerPin01, Ticket02, Users01 } from "@untitledui/icons";
import Link from "next/link";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import {
    COURSE_NAME,
    clinicsForCoach,
    coachById,
    fromPrice,
    money0,
    nextOpening,
    packagesForCoach,
    servicePrice,
    servicesForCoach,
    spotsLeft,
} from "@/components/instruction/instruction-catalog";
import { CredentialList, MenuItemRow, MetaLine, SectionTitle } from "@/components/instruction/instruction-ui";
import { academyDisplayName, academyInstructor, instructorPhoto } from "@/components/mcg/academy-roster";
import { McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import { DEFAULT_DATE } from "@/stories/explorations/tee-search-popovers";
import { ACADEMY_COURSE_NAME, InstructorContact, InstructorCourseList } from "./academy-ui";

/* ------------------------------------------------------------------ */
/* Panels                                                              */
/* ------------------------------------------------------------------ */

const Panel = ({ children }: { children: ReactNode }) => (
    <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">{children}</section>
);

/** A group program this instructor runs, the way the Clinics screens summarise one. */
const ProgramRow = ({ name, meta, courseSlug, price, left }: { name: string; meta: string; courseSlug?: string; price: number; left: number | null }) => (
    <div className="flex flex-col gap-3 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset sm:flex-row sm:items-center sm:gap-5">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-sm font-semibold text-primary">{name}</span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <MetaLine icon={Calendar}>{meta}</MetaLine>
                {courseSlug && <MetaLine icon={MarkerPin01}>{COURSE_NAME[courseSlug]}</MetaLine>}
            </div>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
            <span className="text-lg font-semibold text-primary tabular-nums">{money0(price)}</span>
            {left !== null && (
                <span className={left === 0 ? "text-xs font-semibold text-error-primary" : "text-xs text-tertiary"}>
                    {left === 0 ? "Full — waitlist" : `${left} spots left`}
                </span>
            )}
        </div>
    </div>
);

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const AcademyInstructorDetailScreen = ({ instructorId }: { instructorId: string }) => {
    const instructor = academyInstructor(instructorId);

    if (!instructor) {
        return (
            <McgShell>
                <McgPage width="3xl">
                    <div className="flex flex-col items-start gap-4 rounded-2xl bg-primary p-8 ring-1 ring-secondary ring-inset">
                        <h1 className="text-display-xs font-semibold text-primary">Instructor not found</h1>
                        <p className="text-sm text-tertiary">That instructor isn&rsquo;t on the MCG Golf Academy roster.</p>
                        <Button size="md" color="secondary" href="/instruction/instructors" iconLeading={ArrowLeft}>
                            All instructors
                        </Button>
                    </div>
                </McgPage>
            </McgShell>
        );
    }

    const coach = coachById(instructor.id);
    const privates = servicesForCoach(instructor.id).filter((service) => service.kind === "private");
    const programs = clinicsForCoach(instructor.id);
    const packages = packagesForCoach(instructor.id);
    const bookable = !instructor.comingSoon;
    const nextOpen = bookable ? nextOpening(instructor.id, DEFAULT_DATE) : null;

    return (
        <McgShell>
            {/* ---- Hero: the site's own layout — copy on the left, headshot on the right ---- */}
            <div className="border-b border-secondary bg-primary px-6 py-9 sm:px-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex max-w-2xl flex-col items-start gap-4">
                        <Link
                            href="/instruction/instructors"
                            className="flex items-center gap-1.5 text-sm font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary"
                        >
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            All instructors
                        </Link>

                        <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">MCG Golf Academy</span>

                        <div className="flex flex-col gap-2">
                            <h1 className="text-display-sm font-semibold text-primary">{academyDisplayName(instructor)}</h1>
                            <p className="text-lg text-tertiary">{instructor.role}</p>
                        </div>

                        <InstructorCourseList slugs={instructor.courseSlugs} />

                        {bookable ? (
                            <>
                                <p className="text-md text-secondary">Please call or email with any questions.</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button size="lg" color="primary" href="/instruction" iconTrailing={ArrowRight}>
                                        Book a lesson
                                    </Button>
                                    {instructor.email && (
                                        <Button size="lg" color="secondary" href={`mailto:${instructor.email}`}>
                                            Email {instructor.name.split(" ")[0]}
                                        </Button>
                                    )}
                                </div>
                                <InstructorContact instructor={instructor} />
                            </>
                        ) : (
                            <Badge color="gray" size="md" type="pill-color">
                                Coming soon
                            </Badge>
                        )}
                    </div>

                    <img
                        src={instructorPhoto(instructor)}
                        alt={instructor.comingSoon ? "" : academyDisplayName(instructor)}
                        className={
                            instructor.comingSoon
                                ? "aspect-[4/5] w-full max-w-xs rounded-2xl bg-secondary object-contain p-10 opacity-60 ring-1 ring-secondary ring-inset"
                                : "aspect-[4/5] w-full max-w-xs rounded-2xl bg-secondary object-cover object-top ring-1 ring-secondary ring-inset"
                        }
                    />
                </div>
            </div>

            <McgPage>
                {!bookable ? (
                    /* ---- Coming Soon: an honest single panel, not four empty ones ---- */
                    <div className="flex flex-col gap-6 lg:max-w-2xl">
                        <Panel>
                            <SectionTitle sub="The Academy publishes a card for this instructor but hasn't published a photo, a lesson menu or online booking for them yet.">
                                Profile coming soon
                            </SectionTitle>
                            <p className="text-sm text-tertiary">
                                {instructor.name} teaches at {instructor.courseSlugs.map((slug) => ACADEMY_COURSE_NAME[slug]).join(" and ")}. Until their
                                profile is live, the shop books their lessons by phone — or book any Academy instructor online and note who you&rsquo;d like.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button size="md" color="primary" href="/instruction">
                                    Browse the lesson catalog
                                </Button>
                                <Button size="md" color="secondary" href="/instruction/instructors" iconLeading={ArrowLeft}>
                                    All instructors
                                </Button>
                            </div>
                        </Panel>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* ---- Left: what you can actually book ---- */}
                        <div className="flex flex-col gap-6 lg:col-span-2">
                            {instructor.bio && (
                                <Panel>
                                    <SectionTitle>About {instructor.name}</SectionTitle>
                                    <p className="text-sm text-tertiary">{instructor.bio}</p>
                                </Panel>
                            )}

                            <Panel>
                                <SectionTitle sub={`Academy rates, adjusted for ${instructor.name}. Prices shown are for one golfer.`}>
                                    Lesson menu
                                </SectionTitle>
                                <div className="flex flex-col gap-3">
                                    {privates.map((service) => (
                                        <MenuItemRow key={service.id} service={service} coach={coach} />
                                    ))}
                                </div>
                            </Panel>

                            {programs.length > 0 && (
                                <Panel>
                                    <SectionTitle sub="Scheduled group programs this instructor runs.">Programs</SectionTitle>
                                    <div className="flex flex-col gap-3">
                                        {programs.map((program) => (
                                            <ProgramRow
                                                key={program.id}
                                                name={program.name}
                                                meta={program.meta}
                                                courseSlug={program.courseSlug}
                                                price={servicePrice(program, coach, 1)}
                                                left={spotsLeft(program)}
                                            />
                                        ))}
                                    </div>
                                </Panel>
                            )}

                            {packages.length > 0 && (
                                <Panel>
                                    <SectionTitle sub="Credit packs redeemable against this instructor's 45-minute private.">Lesson packages</SectionTitle>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {packages.map((pack) => (
                                            <div key={pack.id} className="flex flex-col gap-2 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
                                                <div className="flex items-start justify-between gap-3">
                                                    <span className="text-sm font-semibold text-primary">{pack.label}</span>
                                                    {pack.badge && (
                                                        <Badge color="brand" size="sm" type="pill-color">
                                                            {pack.badge}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="text-xl font-semibold text-primary tabular-nums">{money0(pack.price)}</span>
                                                <span className="text-xs text-tertiary tabular-nums">
                                                    {money0(pack.perLessonPrice)} per lesson · save {money0(pack.savings)}
                                                </span>
                                                <MetaLine icon={Ticket02}>Expires {pack.expiration}</MetaLine>
                                            </div>
                                        ))}
                                    </div>
                                    <Button size="sm" color="secondary" href="/instruction/packages" className="w-fit">
                                        See all packages
                                    </Button>
                                </Panel>
                            )}
                        </div>

                        {/* ---- Right: the booking rail ---- */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-4 rounded-2xl bg-primary p-6 shadow-lg ring-1 ring-secondary lg:sticky lg:top-24">
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">Lessons from</span>
                                    <span className="text-display-xs font-semibold text-primary tabular-nums">{money0(fromPrice(instructor.id))}</span>
                                </div>

                                <div className="flex flex-col gap-2 border-t border-secondary pt-4">
                                    <MetaLine icon={Clock}>
                                        Next opening <span className="font-semibold text-secondary">{nextOpen}</span>
                                    </MetaLine>
                                    <MetaLine icon={Users01}>
                                        {privates.length} private {privates.length === 1 ? "lesson" : "lessons"} on the menu
                                    </MetaLine>
                                    <MetaLine icon={MarkerPin01}>
                                        {instructor.courseSlugs.length === 1
                                            ? ACADEMY_COURSE_NAME[instructor.courseSlugs[0]]
                                            : `${instructor.courseSlugs.length} courses`}
                                    </MetaLine>
                                </div>

                                <Button size="lg" color="primary" href="/instruction" className="w-full">
                                    Book a lesson
                                </Button>

                                <div className="border-t border-secondary pt-4">
                                    <InstructorContact instructor={instructor} />
                                </div>
                            </div>

                            {coach && coach.credentials && coach.credentials.length > 0 && (
                                <Panel>
                                    <div className="flex items-center gap-2">
                                        <Award01 className="size-4 text-fg-brand-primary" aria-hidden="true" />
                                        <h2 className="text-lg font-semibold text-primary">Credentials</h2>
                                    </div>
                                    <CredentialList items={coach.credentials} />
                                </Panel>
                            )}
                        </div>
                    </div>
                )}
            </McgPage>
        </McgShell>
    );
};
