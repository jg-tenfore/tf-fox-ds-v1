"use client";

/**
 * Shared pieces for the MCG Golf Academy instructor pages.
 *
 * The real Academy site (mcggolf.com) organises its staff by course: a strip of nine
 * course logos sits at the top of every Academy page and acts as a tab bar, and each
 * tab lists that course's instructor cards — headshot, "Name, Credential", title, the
 * course or courses they teach at, a green BOOK NOW button, an email link, a phone
 * number, and a LEARN MORE link.
 *
 * Everything rendered here comes from `academy-roster.ts`, which is a transcription of
 * those pages. Nothing about a named MCG employee is invented: no specialisms, no years
 * of experience, no ratings. Where a layout wants more weight, it gets structural facts
 * instead — which courses they teach at, what is on their lesson menu, when they are
 * next free.
 */
import { ArrowRight, Mail01, Phone } from "@untitledui/icons";
import Link from "next/link";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { COURSE_LOGO } from "@/components/instruction/instruction-catalog";
import { servicesForCoach } from "@/components/instruction/instruction-catalog";
import { bookHref } from "./book-screen";
import { ACADEMY_COURSE_LOGOS, type AcademyInstructor, academyDisplayName, instructorPhoto } from "@/components/mcg/academy-roster";
import { cx } from "@/utils/cx";

/* ------------------------------------------------------------------ */
/* Courses                                                             */
/* ------------------------------------------------------------------ */

/** Course display names, keyed by slug, exactly as the Academy pages head each tab. */
export const ACADEMY_COURSE_NAME: Record<string, string> = Object.fromEntries(ACADEMY_COURSE_LOGOS.map((course) => [course.slug, course.name]));

/** The sentinel the course strip uses for "show every course". */
export const ALL_COURSES = "all";

/** Detail-page route for one instructor. */
/**
 * Where "Learn more" goes.
 *
 * Two instructor layouts are live while the richer one is under review: the compact
 * roster-faithful page at `/instruction/instructors/<id>`, and the product-style
 * profile at `/instruction/pro/<id>` with reservations, packages and reviews. The
 * card links to the richer one; both routes stay reachable so they can be compared.
 */
export const instructorHref = (id: string) => `/instruction/pro/${id}`;

/** The compact, roster-faithful detail page. */
export const instructorCompactHref = (id: string) => `/instruction/instructors/${id}`;

/** `tel:` target — the roster prints numbers for people, not for dialers. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d]/g, "")}`;

/* ------------------------------------------------------------------ */
/* Course strip                                                        */
/* ------------------------------------------------------------------ */

/**
 * The nine-course logo strip, in the site's own order.
 *
 * On mcggolf.com this is a tab bar: one course at a time, and no way to see the whole
 * county's staff at once. Here it is a **filter** with an "All courses" default — the
 * full roster reads as one page, and picking a logo narrows it to that course exactly
 * the way the real tabs do.
 */
export const AcademyCourseStrip = ({ value, onChange }: { value: string; onChange: (slug: string) => void }) => {
    const chip = (active: boolean) =>
        cx(
            // Fixed height, not padding: the course chips are sized by their 28px logo,
            // so a text-only chip like "All courses" would otherwise sit 8px shorter.
            "flex h-10 items-center gap-2 rounded-full pr-4 pl-2 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
            active ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover hover:ring-brand",
        );

    return (
        <div className="sticky top-0 z-20 border-b border-secondary bg-primary/95 px-6 py-3 backdrop-blur sm:px-8">
            <div
                className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-2"
                role="group"
                aria-label="Filter instructors by MCG course"
            >
                <button type="button" aria-pressed={value === ALL_COURSES} onClick={() => onChange(ALL_COURSES)} className={chip(value === ALL_COURSES)}>
                    <span className="pl-1.5">All courses</span>
                </button>
                {ACADEMY_COURSE_LOGOS.map((course) => {
                    const active = value === course.slug;
                    return (
                        <button
                            key={course.slug}
                            type="button"
                            aria-pressed={active}
                            aria-label={course.name}
                            onClick={() => onChange(course.slug)}
                            className={chip(active)}
                            title={course.name}
                        >
                            <img src={COURSE_LOGO[course.slug]} alt="" className="size-7 rounded-full bg-primary object-contain" />
                            <span className="hidden sm:inline">{course.name.replace(/ Golf Course$/, "")}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Instructor card                                                     */
/* ------------------------------------------------------------------ */

/** The course logos an instructor's card names, spelled out the way the site does. */
export const InstructorCourseList = ({ slugs }: { slugs: string[] }) => (
    <div className="flex flex-wrap gap-1.5">
        {slugs.map((slug) => (
            <span key={slug} className="bg-secondary_subtle inline-flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1.5 ring-1 ring-secondary ring-inset">
                <img src={COURSE_LOGO[slug]} alt="" className="size-5 rounded-full bg-primary object-contain" />
                <span className="text-xs font-semibold text-secondary">{ACADEMY_COURSE_NAME[slug] ?? slug}</span>
            </span>
        ))}
    </div>
);

/** Email and phone, as the card prints them — both live links. */
export const InstructorContact = ({ instructor, align = "left" }: { instructor: AcademyInstructor; align?: "left" | "center" }) => {
    if (!instructor.email && !instructor.phone) return null;
    return (
        <div className={cx("flex flex-col gap-1.5", align === "center" && "items-center")}>
            {instructor.email && (
                <a
                    href={`mailto:${instructor.email}`}
                    className="flex items-center gap-2 text-sm font-medium text-brand-secondary underline transition duration-100 ease-linear hover:text-brand-secondary_hover"
                >
                    <Mail01 className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    {instructor.email}
                </a>
            )}
            {instructor.phone && (
                <a
                    href={telHref(instructor.phone)}
                    className="flex items-center gap-2 text-sm text-tertiary transition duration-100 ease-linear hover:text-secondary"
                >
                    <Phone className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    <span className="tabular-nums">{instructor.phone}</span>
                </a>
            )}
        </div>
    );
};

/**
 * Where a roster card's "Book now" goes: straight to the time picker for this
 * instructor's standard lesson, skipping the profile.
 *
 * The card's other action, "Learn more", is the route through the profile for someone
 * still deciding. "Book now" is for someone who isn't — so it should land on a board of
 * times, not on the page they are already looking at. (It used to point at
 * `/instruction`, which became this very page when the Academy went instructor-first,
 * so the button appeared to do nothing.)
 */
export const cardBookHref = (instructor: AcademyInstructor): string => {
    const privates = servicesForCoach(instructor.id).filter((service) => service.kind === "private");
    const standard = privates.find((service) => service.id === "private-45") ?? privates[0];
    // No bookable lesson (a Coming Soon card) — fall back to the profile.
    if (!standard) return instructorHref(instructor.id);
    return bookHref({ coachId: instructor.id, serviceId: standard.id, courseSlug: instructor.courseSlugs[0] });
};

/**
 * One instructor card, the Academy page's unit of content.
 *
 * A `comingSoon` instructor keeps the placeholder headshot and the badge, and loses the
 * Book now button — there is nothing on the Academy site to book against yet. The bio
 * block only exists for Mike Dickson, so the card is laid out so its absence reads as
 * normal rather than as a hole: contact and actions are pinned to the bottom of the
 * card and the bio simply grows the middle.
 */
export const InstructorCard = ({ instructor }: { instructor: AcademyInstructor }) => (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand">
        <div className="relative aspect-[4/5] w-full bg-secondary">
            {/* The photo is the obvious thing to click, so it goes where "Learn more"
                goes. A Coming Soon card has no profile worth opening, so its
                placeholder stays inert rather than linking to an empty page. */}
            {instructor.comingSoon ? (
                <img
                    src={instructorPhoto(instructor)}
                    alt=""
                    className="size-full object-contain p-8 opacity-60"
                    loading="lazy"
                />
            ) : (
                <Link
                    href={instructorHref(instructor.id)}
                    aria-label={`View ${academyDisplayName(instructor)}'s profile`}
                    className="group block size-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                    <img
                        src={instructorPhoto(instructor)}
                        alt={academyDisplayName(instructor)}
                        className="size-full object-cover object-top transition duration-100 ease-linear group-hover:opacity-90"
                        loading="lazy"
                    />
                </Link>
            )}
            {instructor.comingSoon && (
                <span className="absolute top-3 left-3">
                    <Badge color="gray" size="sm" type="pill-color">
                        Coming soon
                    </Badge>
                </span>
            )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex flex-col gap-1">
                <h3 className="text-md font-semibold text-primary">{academyDisplayName(instructor)}</h3>
                <p className="text-sm text-tertiary">{instructor.role}</p>
            </div>

            <InstructorCourseList slugs={instructor.courseSlugs} />

            {instructor.bio && <p className="text-sm text-tertiary">{instructor.bio}</p>}

            {/* Pinned to the bottom so a card with a bio and a card without still line up. */}
            <div className="mt-auto flex flex-col gap-3 pt-1">
                {instructor.comingSoon ? (
                    <p className="text-sm text-tertiary">This instructor&rsquo;s profile isn&rsquo;t published yet. Call the course to arrange a lesson.</p>
                ) : (
                    <Button size="sm" color="primary" href={cardBookHref(instructor)} iconTrailing={ArrowRight} className="w-fit">
                        Book now
                    </Button>
                )}

                <InstructorContact instructor={instructor} />

                <Link
                    href={instructorHref(instructor.id)}
                    className="flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline"
                >
                    Learn more
                    <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
            </div>
        </div>
    </article>
);

/* ------------------------------------------------------------------ */
/* Empty course                                                        */
/* ------------------------------------------------------------------ */

/**
 * A course with nobody on it.
 *
 * Hampshire Greens is the live case: it carries no Academy instructor of its own —
 * confirmed, not a gap in the data. So the page states that plainly and sends the
 * golfer to the nearest staffed courses, rather than implying a roster is pending.
 */
export const AcademyCourseEmpty = ({ courseSlug, phone }: { courseSlug: string; phone: string }) => (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-secondary bg-primary px-6 py-12 text-center">
        <img src={COURSE_LOGO[courseSlug]} alt="" className="size-14 rounded-full bg-primary object-contain" />
        <p className="text-md font-semibold text-primary">No Academy instructor based here</p>
        <p className="max-w-md text-sm text-tertiary">
            {ACADEMY_COURSE_NAME[courseSlug] ?? courseSlug} doesn&rsquo;t have a resident Academy instructor. You can still book a lesson at any other MCG
            course and play here — or call the shop and they&rsquo;ll point you to the nearest pro.
        </p>
        <Link
            href="/instruction"
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline"
        >
            See instructors at the other courses
            <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <a
            href={telHref(phone)}
            className="flex items-center gap-2 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline"
        >
            <Phone className="size-4" aria-hidden="true" />
            <span className="tabular-nums">{phone}</span>
        </a>
    </div>
);
