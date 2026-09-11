"use client";

/**
 * `/instruction/pro/[id]` — the **alternative**, richer instructor profile.
 *
 * This is a second layout for the same person, not a replacement: `instructor-detail.tsx`
 * (at `/instruction/instructors/[id]`) stays exactly as it is so the two can be put side
 * by side. Where that one is the Academy's own page with a booking rail bolted on, this
 * one borrows the Pro Shop product page wholesale — gallery on the left, a buy box on the
 * right, then everything you can actually purchase, then reviews — and asks whether an
 * instructor reads better as a *product* than as a staff card.
 *
 * Two constraints shape it, and neither is negotiable:
 *
 *  - **Nothing biographical is invented.** These are real, named county employees. The
 *    page shows what the Academy publishes (name, credential, title, courses, contact,
 *    and Mike Dickson's bio) and otherwise leans on structural facts: the lesson menu
 *    priced for them, their calendar, their packs, their programs. No specialisms, no
 *    years teaching, no playing history, no philosophy.
 *  - **The reviews are openly fake.** The product layout needs a reviews block to be
 *    worth evaluating, so it has one — sourced from `instructor-reviews.ts`, written to
 *    be about the lesson experience rather than the person, attributed to initials, and
 *    carrying an undismissable notice in the section header saying exactly what it is.
 */
import { type ReactNode, useEffect, useState } from "react";
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    Calendar,
    CalendarCheck01,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard01,
    Heart,
    MarkerPin01,
    RefreshCcw01,
    Share07,
    Ticket02,
    Users01,
    XClose,
} from "@untitledui/icons";
import Link from "next/link";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { mcgCourse } from "@/components/foundations/mcg/mcg-assets";
import {
    SUBSCRIPTIONS,
    applyGuardrails,
    byDaypart,
    clinicsForCoach,
    coachById,
    coachDay,
    fromPrice,
    money0,
    nextOpening,
    packagesForCoach,
    servicePrice,
    servicesForCoach,
    spotsLeft,
} from "@/components/instruction/instruction-catalog";
import { CapacityMeter, CourseChip, CreditPips, MenuItemRow, MetaLine, MicroLabel, SectionTitle, SlotButton } from "@/components/instruction/instruction-ui";
import { type AcademyInstructor, academyBanner, academyDisplayName, academyInstructor, academyLogo, instructorPhoto } from "@/components/mcg/academy-roster";
import { McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import { bookHref } from "./book-screen";
import { StarRating, money } from "@/stories/explorations/store-ui";
import { DEFAULT_DATE } from "@/stories/explorations/tee-search-popovers";
import { asset } from "@/utils/asset";
import { cx } from "@/utils/cx";
import { ACADEMY_COURSE_NAME, InstructorContact } from "./academy-ui";
import { type InstructorReview, SAMPLE_REVIEW_NOTICE, SAMPLE_REVIEW_NOTICE_SHORT, instructorReviews } from "./instructor-reviews";

/* ------------------------------------------------------------------ */
/* Gallery composition                                                 */
/* ------------------------------------------------------------------ */

interface Shot {
    src: string;
    /** Caption used as the alt text and the thumbnail's accessible name. */
    label: string;
    /** Headshots are framed from the top; scenery isn't. */
    top?: boolean;
}

/** Generic golf photography, used for the "what a lesson looks like" frames. */
const GENERIC = [1, 2, 3, 4, 5, 6, 7].map((n) => asset(`events-images/event-${n}.png`));

/** Stable pick, so an instructor's gallery is identical on every build. */
const pick = (id: string, offset: number) => {
    let h = 2166136261;
    for (let i = 0; i < id.length; i++) {
        h ^= id.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return GENERIC[((h >>> 0) + offset * 3) % GENERIC.length];
};

/**
 * A product page needs a gallery and an instructor has exactly one headshot, so the rest
 * is composed from things that are genuinely about them: the courses they teach at (where
 * MCG photography exists), two generic range/lesson frames, and the Academy banner.
 * Capped at five so the thumbnail rail stays the height of the main image.
 */
const galleryFor = (instructor: AcademyInstructor): Shot[] => {
    const shots: Shot[] = [{ src: instructorPhoto(instructor), label: academyDisplayName(instructor), top: true }];

    for (const slug of instructor.courseSlugs) {
        for (const photo of mcgCourse(slug)?.photos ?? []) {
            shots.push({ src: photo.src, label: photo.name });
        }
    }

    shots.push({ src: pick(instructor.id, 0), label: "MCG Golf Academy lesson tee" });
    shots.push({ src: pick(instructor.id, 1), label: "Practice range" });
    shots.push({ src: academyBanner, label: "MCG Golf Academy" });

    // Two courses can hand back the same frame; dedupe before capping.
    const seen = new Set<string>();
    return shots.filter((shot) => !seen.has(shot.src) && seen.add(shot.src)).slice(0, 5);
};

/* ------------------------------------------------------------------ */
/* Gallery (the product page's, kept intact)                           */
/* ------------------------------------------------------------------ */

const galleryArrow =
    "flex size-9 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-md ring-1 ring-primary transition duration-100 ease-linear hover:bg-primary_hover";

const Thumb = ({ shot, active, onClick }: { shot: Shot; active: boolean; onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={`View ${shot.label}`}
        className={cx(
            "flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary transition duration-100 ease-linear ring-inset",
            active ? "ring-2 ring-brand" : "ring-1 ring-secondary hover:ring-brand",
        )}
    >
        <img src={shot.src} alt="" className={cx("size-full object-cover", shot.top && "object-top")} loading="lazy" />
    </button>
);

const transitionFor = (dir: number) => cx("duration-300 animate-in fade-in zoom-in-95", dir > 0 ? "slide-in-from-right-4" : "slide-in-from-left-4");

/** Full-screen lightbox opened by clicking the main image. */
const Lightbox = ({
    shots,
    active,
    dir,
    onSelect,
    onGo,
    onClose,
}: {
    shots: Shot[];
    active: number;
    dir: number;
    onSelect: (i: number) => void;
    onGo: (d: number) => void;
    onClose: () => void;
}) => (
    <div className="fixed inset-0 z-50 flex flex-col bg-primary p-4 sm:p-6">
        <div className="flex shrink-0 items-center justify-between gap-4 pb-3">
            <span className="truncate text-sm font-medium text-secondary">{shots[active].label}</span>
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-fg-secondary ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary_hover"
            >
                <XClose className="size-5" aria-hidden="true" />
            </button>
        </div>

        <div className="flex min-h-0 flex-1 gap-4">
            {shots.length > 1 && (
                <div className="flex shrink-0 flex-col gap-3 self-center">
                    {shots.map((shot, i) => (
                        <Thumb key={shot.src} shot={shot} active={i === active} onClick={() => onSelect(i)} />
                    ))}
                </div>
            )}
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-secondary ring-1 ring-secondary ring-inset">
                <img
                    key={active}
                    src={shots[active].src}
                    alt={shots[active].label}
                    className={cx("max-h-full max-w-full object-contain p-4", transitionFor(dir))}
                />
            </div>
        </div>

        {shots.length > 1 && (
            <div className="flex shrink-0 justify-end gap-3 pt-3">
                <button type="button" aria-label="Previous image" onClick={() => onGo(-1)} className={galleryArrow}>
                    <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
                <button type="button" aria-label="Next image" onClick={() => onGo(1)} className={galleryArrow}>
                    <ChevronRight className="size-5" aria-hidden="true" />
                </button>
            </div>
        )}
    </div>
);

/** Thumbnail rail + main image, with hover arrows, arrow keys and click-to-expand. */
const Gallery = ({ shots, badge }: { shots: Shot[]; badge?: string }) => {
    const [active, setActive] = useState(0);
    const [dir, setDir] = useState(1);
    const [open, setOpen] = useState(false);

    const select = (i: number) => {
        setDir(i >= active ? 1 : -1);
        setActive(i);
    };
    const go = (delta: number) => {
        setDir(delta > 0 ? 1 : -1);
        setActive((a) => (a + delta + shots.length) % shots.length);
    };

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
            else if (e.key === "ArrowRight") go(1);
            else if (e.key === "ArrowLeft") go(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, shots.length]);

    const shot = shots[active];

    return (
        <>
            <div className="flex gap-3">
                {shots.length > 1 && (
                    <div className="flex shrink-0 flex-col gap-3">
                        {shots.map((s, i) => (
                            <Thumb key={s.src} shot={s} active={i === active} onClick={() => select(i)} />
                        ))}
                    </div>
                )}
                <div className="group relative flex-1 overflow-hidden rounded-2xl bg-secondary ring-1 ring-secondary ring-inset">
                    <button type="button" onClick={() => setOpen(true)} aria-label={`Expand ${shot.label}`} className="block w-full cursor-zoom-in">
                        <img
                            key={active}
                            src={shot.src}
                            alt={shot.label}
                            className={cx("aspect-[4/5] w-full object-cover", shot.top && "object-top", transitionFor(dir))}
                        />
                    </button>
                    {badge && (
                        <span className="absolute top-4 left-4">
                            <Badge color="brand" size="md" type="pill-color">
                                {badge}
                            </Badge>
                        </span>
                    )}
                    {shots.length > 1 && (
                        <>
                            <button
                                type="button"
                                aria-label="Previous image"
                                onClick={() => go(-1)}
                                className={cx(galleryArrow, "absolute top-1/2 left-3 -translate-y-1/2 opacity-0 group-hover:opacity-100")}
                            >
                                <ChevronLeft className="size-5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next image"
                                onClick={() => go(1)}
                                className={cx(galleryArrow, "absolute top-1/2 right-3 -translate-y-1/2 opacity-0 group-hover:opacity-100")}
                            >
                                <ChevronRight className="size-5" aria-hidden="true" />
                            </button>
                        </>
                    )}
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-primary/85 px-4 py-2 text-xs font-medium text-secondary">
                        {shot.label}
                    </span>
                </div>
            </div>
            {open && <Lightbox shots={shots} active={active} dir={dir} onSelect={select} onGo={go} onClose={() => setOpen(false)} />}
        </>
    );
};

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

/**
 * The notice that has to travel with every sample rating on this page.
 *
 * Deliberately a warning-toned banner at full width rather than a footnote: the content
 * below it is invented, it is attached to a real person's name, and someone screenshotting
 * this page has to carry the caveat with them.
 */
const SampleReviewNotice = () => (
    <div className="flex items-start gap-3 rounded-xl bg-warning-primary p-4 ring-1 ring-secondary ring-inset">
        <AlertTriangle className="size-5 shrink-0 text-fg-warning-primary" aria-hidden="true" />
        <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-primary">{SAMPLE_REVIEW_NOTICE}</p>
            <p className="text-sm text-tertiary">
                Ratings and comments below are placeholder content generated for this prototype so the layout can be evaluated. MCG does not publish instructor
                reviews, and nothing here reflects any MCG instructor.
            </p>
        </div>
    </div>
);

const Bars = ({ distribution }: { distribution: number[] }) => (
    <div className="flex w-full max-w-md flex-col gap-1.5">
        {distribution.map((frac, i) => (
            <div key={i} className="flex items-center gap-3">
                <span className="w-3 text-xs text-tertiary tabular-nums">{5 - i}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <span className="block h-full rounded-full bg-primary-solid" style={{ width: `${frac * 100}%` }} />
                </span>
            </div>
        ))}
    </div>
);

const ReviewCard = ({ review }: { review: InstructorReview }) => (
    <div className="flex flex-col gap-3 rounded-xl bg-secondary p-4 ring-1 ring-secondary ring-inset">
        <StarRating rating={review.stars} />
        <p className="text-sm font-semibold text-primary">{review.title}</p>
        <p className="text-sm leading-relaxed text-tertiary">{review.text}</p>
        <div className="mt-auto flex items-center gap-2.5 pt-1">
            <Avatar size="xs" initials={review.initials} />
            {/* The avatar already carries the initials — the byline only needs the date. */}
            <span className="text-xs text-tertiary">{review.date}</span>
        </div>
    </div>
);

/** Slide-over with the full sample list — the notice comes with it. */
const ReviewsFlyout = ({ summary, onClose }: { summary: ReturnType<typeof instructorReviews>; onClose: () => void }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <button type="button" aria-label="Close reviews" onClick={onClose} className="absolute inset-0 bg-overlay/70" />
            <div className="relative flex h-full w-full max-w-md flex-col bg-primary shadow-xl duration-300 animate-in slide-in-from-right">
                <div className="flex-1 overflow-y-auto p-6">
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="flex size-10 items-center justify-center rounded-full text-fg-secondary ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary_hover"
                    >
                        <XClose className="size-5" aria-hidden="true" />
                    </button>

                    <h2 className="mt-4 text-display-xs font-semibold text-primary">Reviews</h2>

                    <div className="mt-4">
                        <SampleReviewNotice />
                    </div>

                    <div className="mt-5 flex gap-8">
                        <div className="flex shrink-0 flex-col items-start gap-1">
                            <span className="text-display-sm font-semibold text-primary tabular-nums">{summary.average.toFixed(1)}</span>
                            <StarRating rating={summary.average} />
                            <span className="text-sm text-tertiary tabular-nums">{summary.count} ratings</span>
                        </div>
                        <Bars distribution={summary.distribution} />
                    </div>

                    <div className="mt-5 flex flex-col gap-3">
                        {summary.reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

const Panel = ({ children, id }: { children: ReactNode; id?: string }) => (
    <section id={id} className="flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset sm:p-8">
        {children}
    </section>
);

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const InstructorProfileScreen = ({ instructorId }: { instructorId: string }) => {
    const instructor = academyInstructor(instructorId);
    const [reviewsOpen, setReviewsOpen] = useState(false);
    const [slot, setSlot] = useState<number | null>(null);

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

    const shots = galleryFor(instructor);

    /* ---- Coming soon: placeholder art, no booking box, no reviews ---- */
    if (instructor.comingSoon) {
        return (
            <McgShell>
                <McgPage width="6xl">
                    <Link
                        href="/instruction/instructors"
                        className="mb-6 flex w-fit items-center gap-1.5 text-sm font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        All instructors
                    </Link>

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                        <div className="overflow-hidden rounded-2xl bg-secondary ring-1 ring-secondary ring-inset">
                            <img src={instructorPhoto(instructor)} alt="" className="aspect-[4/5] w-full object-contain p-14 opacity-60" />
                        </div>

                        <div className="flex flex-col items-start gap-4">
                            <Badge color="gray" size="md" type="pill-color">
                                Coming soon
                            </Badge>
                            <h1 className="text-display-xs font-semibold text-primary">{academyDisplayName(instructor)}</h1>
                            <p className="text-lg text-tertiary">{instructor.role}</p>
                            <div className="flex flex-wrap gap-2">
                                {instructor.courseSlugs.map((slug) => (
                                    <CourseChip key={slug} slug={slug} size="md" />
                                ))}
                            </div>
                            <div className="flex flex-col gap-2 rounded-xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                                <h2 className="text-md font-semibold text-primary">Profile coming soon</h2>
                                <p className="text-sm text-tertiary">
                                    {`The Academy publishes a card for ${instructor.name} but hasn\u2019t published a photo, a lesson menu or online booking yet. They teach at `}
                                    {instructor.courseSlugs.map((slug) => ACADEMY_COURSE_NAME[slug]).join(" and ")}
                                    {" \u2014 until the profile is live, the shop books their lessons by phone."}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button size="lg" color="primary" href="/instruction">
                                    Browse the lesson catalog
                                </Button>
                                <Button size="lg" color="secondary" href="/instruction/instructors" iconLeading={ArrowLeft}>
                                    All instructors
                                </Button>
                            </div>
                        </div>
                    </div>
                </McgPage>
            </McgShell>
        );
    }

    const coach = coachById(instructor.id);
    const privates = servicesForCoach(instructor.id).filter((service) => service.kind === "private");
    /**
     * What the headline "Book a lesson" button books. The 45-minute private is the
     * Academy's standard lesson and what most golfers want; the per-row buttons below
     * cover everything else, so this only has to be a sensible default.
     */
    const headlineService = privates.find((service) => service.id === "private-45") ?? privates[0];
    const programs = clinicsForCoach(instructor.id);
    const packages = packagesForCoach(instructor.id);
    const subscription = SUBSCRIPTIONS.find((sub) => sub.coachId === instructor.id);
    const reviews = instructorReviews(instructor.id);

    const homeCourse = instructor.courseSlugs[0];
    // One compact strip: the instructor's day at their home course, narrowed by the
    // guardrails of the lesson most people book, grouped the way the calendar groups it.
    const anchorService = privates.find((service) => service.id === "private-45") ?? privates[0];
    const day = anchorService ? byDaypart(applyGuardrails(coachDay(instructor.id, homeCourse, DEFAULT_DATE), anchorService, DEFAULT_DATE)) : [];
    const anchorPrice = anchorService ? servicePrice(anchorService, coach, 1) : 0;

    return (
        <McgShell>
            <McgPage width="7xl">
                <Link
                    href="/instruction/instructors"
                    className="mb-6 flex w-fit items-center gap-1.5 text-sm font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary"
                >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    All instructors
                </Link>

                {/* ---- Gallery + booking box ---- */}
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    <Gallery shots={shots} badge={instructor.credential ?? undefined} />

                    <div className="flex flex-col">
                        {/* Academy lockup, standing in for the product page's brand chip */}
                        <div className="mb-3 flex items-center gap-2">
                            <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary ring-1 ring-secondary ring-inset">
                                <img src={academyLogo} alt="" className="max-h-5 max-w-5 object-contain" />
                            </span>
                            <span className="text-sm font-medium text-secondary">MCG Golf Academy</span>
                        </div>

                        <h1 className="text-display-xs font-semibold text-primary">{academyDisplayName(instructor)}</h1>
                        <p className="mt-1 text-md text-tertiary">{instructor.role}</p>

                        {/* Rating — sample data, and labelled as such right here */}
                        <button
                            type="button"
                            onClick={() => setReviewsOpen(true)}
                            className="mt-3 flex w-fit flex-wrap items-center gap-2 text-left transition duration-100 ease-linear hover:opacity-80"
                        >
                            <StarRating rating={reviews.average} />
                            <span className="text-sm text-tertiary tabular-nums underline underline-offset-2">{reviews.count} ratings</span>
                            <Badge color="warning" size="sm" type="pill-color">
                                {SAMPLE_REVIEW_NOTICE_SHORT}
                            </Badge>
                        </button>

                        {/* Price */}
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-xl font-semibold text-primary tabular-nums">Lessons from {money0(fromPrice(instructor.id))}</span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {instructor.courseSlugs.map((slug) => (
                                <CourseChip key={slug} slug={slug} size="md" />
                            ))}
                        </div>

                        <div className="mt-4 flex flex-col gap-2 border-t border-secondary pt-4">
                            <MetaLine icon={Clock}>
                                Next opening <span className="font-semibold text-secondary">{nextOpening(instructor.id, DEFAULT_DATE)}</span>
                            </MetaLine>
                            <MetaLine icon={Users01}>
                                {privates.length} private {privates.length === 1 ? "lesson" : "lessons"} on the menu
                            </MetaLine>
                            <MetaLine icon={MarkerPin01}>
                                {instructor.courseSlugs.length === 1 ? ACADEMY_COURSE_NAME[homeCourse] : `${instructor.courseSlugs.length} courses`}
                            </MetaLine>
                        </div>

                        <div className="mt-6">
                            <Button
                                color="primary"
                                size="lg"
                                href={bookHref({ coachId: instructor.id, serviceId: headlineService.id, courseSlug: homeCourse })}
                                iconTrailing={ArrowRight}
                                className="w-full"
                            >
                                Book a lesson
                            </Button>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <Button color="secondary" size="lg" iconLeading={Heart}>
                                Save
                            </Button>
                            <Button color="secondary" size="lg" iconLeading={Share07}>
                                Share
                            </Button>
                        </div>

                        {/* The Academy's own line, and the Academy's own contact details */}
                        <div className="mt-6 border-t border-secondary pt-5">
                            <p className="mb-3 text-sm text-secondary">Please call or email with any questions.</p>
                            <InstructorContact instructor={instructor} />
                        </div>

                        {instructor.bio && (
                            <div className="mt-6 border-t border-secondary pt-5">
                                <h2 className="text-md font-semibold text-primary">About {instructor.name}</h2>
                                <p className="mt-2 text-sm leading-relaxed text-tertiary">{instructor.bio}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-6">
                    {/* ---- One-off reservations: the heart of this layout ---- */}
                    <Panel id="reservations">
                        <SectionTitle
                            sub={`Every private lesson ${instructor.name} teaches, priced at this instructor's rate. Book any one of them on its own — no pack, no commitment.`}
                        >
                            One-off reservations
                        </SectionTitle>
                        {/*
                         * `MenuItemRow` already carries the duration, the party-size range, the
                         * per-golfer price at capacity and the guardrail line, so the strip under
                         * it only adds what the row rounds off — the exact split at full party —
                         * and the action that takes you into the booking flow.
                         */}
                        <div className="flex flex-col gap-3">
                            {privates.map((service) => (
                                <div key={service.id} className="flex flex-col gap-2">
                                    <MenuItemRow service={service} coach={coach} />
                                    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1 px-4">
                                        <span className="text-xs text-tertiary tabular-nums">
                                            {service.maxPlayers > 1
                                                ? `Booked for ${service.maxPlayers}: ${money(servicePrice(service, coach, service.maxPlayers) / service.maxPlayers)} per golfer`
                                                : "One golfer, one instructor"}
                                        </span>
                                        <Button
                                            size="sm"
                                            color="link-color"
                                            href={bookHref({ coachId: instructor.id, serviceId: service.id, courseSlug: homeCourse })}
                                            iconTrailing={ArrowRight}
                                        >
                                            Book this lesson
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    {/* ---- Availability preview ---- */}
                    {anchorService && day.length > 0 && (
                        <Panel id="availability">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <SectionTitle
                                    sub={`${anchorService.name} at ${ACADEMY_COURSE_NAME[homeCourse]} on ${DEFAULT_DATE.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.`}
                                >
                                    Next openings
                                </SectionTitle>
                                <Button size="sm" color="secondary" href={bookHref({ coachId: instructor.id, serviceId: headlineService.id, courseSlug: homeCourse })} iconLeading={Calendar}>
                                    See full calendar
                                </Button>
                            </div>
                            <div className="flex flex-col gap-4">
                                {day.map(({ daypart, slots }) => (
                                    <div key={daypart.id} className="flex flex-col gap-2.5">
                                        <div className="flex items-center justify-between gap-3">
                                            <MicroLabel>{daypart.label}</MicroLabel>
                                            <span className="text-xs text-quaternary tabular-nums">{slots.filter((s) => s.status === "open").length} open</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-7">
                                            {slots.map((s) => (
                                                <SlotButton
                                                    key={s.minutes}
                                                    label={s.label}
                                                    status={s.status}
                                                    blockedReason={s.blockedReason}
                                                    price={anchorPrice}
                                                    selected={slot === s.minutes}
                                                    onSelect={() => setSlot(s.minutes)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>
                    )}

                    {/* ---- Packages (and the monthly plan, where one exists) ---- */}
                    {(packages.length > 0 || subscription) && (
                        <Panel id="packages">
                            <SectionTitle sub="Buy lessons ahead at a lower rate. Credits are redeemed against this instructor's 45-minute private.">
                                Packages
                            </SectionTitle>
                            <div className="grid gap-4 lg:grid-cols-3">
                                {packages.map((pack) => (
                                    <div key={pack.id} className="flex flex-col gap-3 rounded-xl bg-secondary p-5 ring-1 ring-secondary ring-inset">
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="text-sm font-semibold text-primary">{pack.label}</span>
                                            {pack.badge && (
                                                <Badge color="brand" size="sm" type="pill-color">
                                                    {pack.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <CreditPips total={pack.credits} remaining={pack.credits} />
                                        <span className="text-display-xs font-semibold text-primary tabular-nums">{money0(pack.price)}</span>
                                        <span className="text-xs text-tertiary tabular-nums">
                                            {money0(pack.perLessonPrice)} per lesson · save {money0(pack.savings)}
                                        </span>
                                        <div className="flex flex-col gap-1.5">
                                            <MetaLine icon={Ticket02}>Expires {pack.expiration}</MetaLine>
                                            <MetaLine icon={Users01}>{pack.transferable ? "Transferable" : "Non-transferable"}</MetaLine>
                                        </div>
                                        <Button size="sm" color="secondary" href="/instruction/packages" className="mt-auto w-full">
                                            Buy {pack.credits} lessons
                                        </Button>
                                    </div>
                                ))}

                                {subscription && (
                                    <div className="flex flex-col gap-3 rounded-xl bg-brand-primary p-5 ring-1 ring-brand ring-inset">
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="text-sm font-semibold text-primary">{subscription.label}</span>
                                            <Badge color="brand" size="sm" type="pill-color">
                                                Monthly plan
                                            </Badge>
                                        </div>
                                        <span className="text-display-xs font-semibold text-primary tabular-nums">
                                            {money0(subscription.monthlyPrice)}
                                            <span className="text-sm font-medium text-tertiary"> / month</span>
                                        </span>
                                        <span className="text-xs text-tertiary tabular-nums">
                                            {money0(subscription.listMonthly)} booked one at a time · save{" "}
                                            {money0(subscription.listMonthly - subscription.monthlyPrice)} a month
                                        </span>
                                        <div className="flex flex-col gap-1.5">
                                            <MetaLine icon={CreditCard01}>{subscription.lessonsPerMonth} lessons every month</MetaLine>
                                            <MetaLine icon={RefreshCcw01}>Cancel anytime · {subscription.renewalNoticeDays} days&rsquo; notice</MetaLine>
                                        </div>
                                        <Button size="sm" color="primary" href="/instruction/packages" className="mt-auto w-full">
                                            Start monthly plan
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Panel>
                    )}

                    {/* ---- Programs they run ---- */}
                    {programs.length > 0 && (
                        <Panel id="programs">
                            <SectionTitle sub="Scheduled group programs this instructor runs. A full program still takes waitlist entries.">
                                Programs they run
                            </SectionTitle>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {programs.map((program) => {
                                    const left = spotsLeft(program);
                                    const full = left === 0;
                                    return (
                                        <div key={program.id} className="flex flex-col gap-3 rounded-xl bg-secondary p-5 ring-1 ring-secondary ring-inset">
                                            <div className="flex items-start justify-between gap-3">
                                                <span className="text-sm font-semibold text-primary">{program.name}</span>
                                                <span className="shrink-0 text-lg font-semibold text-primary tabular-nums">
                                                    {money0(servicePrice(program, coach, 1))}
                                                </span>
                                            </div>
                                            <p className="text-sm text-tertiary">{program.desc}</p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                <MetaLine icon={CalendarCheck01}>{program.schedule ?? program.meta}</MetaLine>
                                                {program.courseSlug && <MetaLine icon={MarkerPin01}>{ACADEMY_COURSE_NAME[program.courseSlug]}</MetaLine>}
                                            </div>
                                            <CapacityMeter service={program} />
                                            <Button size="sm" color={full ? "secondary" : "primary"} href="/clinics" className="mt-auto w-fit">
                                                {full ? "Join the waitlist" : "Register"}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </Panel>
                    )}

                    {/* ---- Reviews ---- */}
                    <Panel id="reviews">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-lg font-semibold text-primary">Reviews</h2>
                            <SampleReviewNotice />
                        </div>

                        <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
                            <div className="flex shrink-0 flex-col items-start gap-1">
                                <span className="text-display-sm font-semibold text-primary tabular-nums">{reviews.average.toFixed(1)}</span>
                                <StarRating rating={reviews.average} />
                                <span className="text-sm text-tertiary tabular-nums">{reviews.count} ratings</span>
                            </div>
                            <Bars distribution={reviews.distribution} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {reviews.reviews.slice(0, 3).map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>

                        <Button color="secondary" size="lg" className="w-full" onClick={() => setReviewsOpen(true)}>
                            Read more reviews
                        </Button>
                    </Panel>
                </div>
            </McgPage>

            {reviewsOpen && <ReviewsFlyout summary={reviews} onClose={() => setReviewsOpen(false)} />}
        </McgShell>
    );
};
