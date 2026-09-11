"use client";

/**
 * `/instruction/instructors` — the MCG Golf Academy roster.
 *
 * The real Academy site splits its staff across nine course tabs, one course visible at
 * a time. That is the right shape for someone who already knows where they play and the
 * wrong shape for everyone else: there is no view of the county's 23 instructors, and a
 * pro who teaches at three courses (Doug Hamilton) is three separate cards you can't
 * tell are the same person.
 *
 * This page keeps the logo strip and keeps the course grouping, but turns the strip into
 * a filter with an "All courses" default. The whole Academy reads as one page; picking a
 * logo narrows it to exactly what the real tab shows. A multi-course instructor appears
 * under each of their courses — as on the site — but it is one card, and the card names
 * all three courses, so it is legible as one person.
 */
import { useState } from "react";
import { Award01, Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ACADEMY_COURSE_ORDER, ACADEMY_ROSTER, academyInstructorsAt, academyLogo } from "@/components/mcg/academy-roster";
import { MCG, McgHero, McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import { ACADEMY_COURSE_NAME, ALL_COURSES, AcademyCourseEmpty, AcademyCourseStrip, InstructorCard } from "./academy-ui";

const BOOKABLE = ACADEMY_ROSTER.filter((instructor) => !instructor.comingSoon).length;

/** One course heading plus its cards — the unit the real site puts behind a tab. */
const CourseSection = ({ slug }: { slug: string }) => {
    const instructors = academyInstructorsAt(slug);

    return (
        <section id={slug} className="flex scroll-mt-24 flex-col gap-5">
            <div className="flex flex-col items-center gap-1.5 text-center">
                <h2 className="text-display-xs font-semibold text-brand-secondary">{ACADEMY_COURSE_NAME[slug]}</h2>
                <p className="text-sm text-tertiary">
                    {instructors.length === 0 ? "No published instructors" : `${instructors.length} ${instructors.length === 1 ? "instructor" : "instructors"}`}
                </p>
            </div>

            {instructors.length === 0 ? (
                <AcademyCourseEmpty courseSlug={slug} phone={MCG.phone} />
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {instructors.map((instructor) => (
                        <InstructorCard key={instructor.id} instructor={instructor} />
                    ))}
                </div>
            )}
        </section>
    );
};

export const AcademyInstructorsScreen = ({ initialCourse = ALL_COURSES }: { initialCourse?: string }) => {
    const [course, setCourse] = useState(initialCourse);
    const slugs = course === ALL_COURSES ? ACADEMY_COURSE_ORDER : [course];

    return (
        <McgShell>
            <McgHero
                eyebrow={false}
                title="MCG Golf Academy — Instructors"
                blurb="Twenty-three instructors across nine county courses. Every card here is a real MCG Academy instructor: their title, the courses they teach at, and the fastest way to reach them."
                leading={<img src={academyLogo} alt="MCG Golf Academy" className="h-32 w-auto object-contain sm:h-40" />}
            />

            <AcademyCourseStrip value={course} onChange={setCourse} />

            <McgPage>
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                            <span className="flex items-center gap-2 text-sm text-tertiary">
                                <Users01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                {ACADEMY_ROSTER.length} instructors
                            </span>
                            <span className="flex items-center gap-2 text-sm text-tertiary">
                                <Award01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                {BOOKABLE} bookable online
                            </span>
                        </div>
                        {/* This page IS /instruction, so the CTA has to go somewhere useful:
                            the packages view, for a golfer who'd rather buy ahead than
                            pick a pro. Booking itself starts from an instructor card. */}
                        <Button size="md" color="secondary" href="/instruction/packages">
                            Lesson packages
                        </Button>
                    </div>

                    {slugs.map((slug) => (
                        <CourseSection key={slug} slug={slug} />
                    ))}
                </div>
            </McgPage>
        </McgShell>
    );
};
