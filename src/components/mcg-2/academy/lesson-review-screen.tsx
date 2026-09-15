"use client";

/**
 * `/instruction/review` — the post-lesson review prompt.
 *
 * This is the only way a review gets into Tenfore. When a lesson booked through MCG is
 * marked complete, the golfer who took it is sent here (by email, and from the lesson's
 * row in Account → Activity) with the booking in the link. There is no "write a review"
 * button on an instructor's profile: a review with no completed lesson behind it isn't
 * verified, and verified is the point.
 *
 * Three states:
 *  - **prompt** — stars, an optional headline and comment, and what happens next;
 *  - **submitted** — thanks, and where the review will appear (or why not yet);
 *  - **off** — the instructor has reviews switched off, so the link says so instead of
 *    collecting feedback nobody will publish.
 */
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, CheckVerified01, Star01 } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { COURSE_NAME, coachById, serviceById } from "@/components/instruction-2/instruction-catalog";
import { coachPhoto } from "@/components/mcg-2/academy-photo";
import { McgPage, McgShell } from "@/components/mcg-2/mcg-chrome";
import { cx } from "@/utils/cx";
import { instructorHref } from "./academy-ui";
import { type LessonReviewTarget, REVIEW_MINIMUM, instructorReviews, reviewsEnabled } from "./instructor-reviews";

export { type LessonReviewTarget, reviewHref } from "./instructor-reviews";

const STAR_WORDS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

/** Five tappable stars, exposed as a radio group so it works from the keyboard. */
const StarPicker = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => {
    const [hover, setHover] = useState(0);
    const shown = hover || value;

    return (
        <div className="flex flex-wrap items-center gap-4">
            <div role="radiogroup" aria-label="Rating" className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={value === n}
                        aria-label={`${n} ${n === 1 ? "star" : "stars"} — ${STAR_WORDS[n]}`}
                        onClick={() => onChange(n)}
                        onMouseEnter={() => setHover(n)}
                        className="rounded-md p-1 transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-focus-ring"
                    >
                        <Star01 className={cx("size-9", n <= shown ? "fill-utility-yellow-400 text-utility-yellow-400" : "text-utility-yellow-200")} aria-hidden="true" />
                    </button>
                ))}
            </div>
            <span className="text-md font-semibold text-secondary">{shown ? STAR_WORDS[shown] : "Tap to rate"}</span>
        </div>
    );
};

/** The booking the review is attached to — who, what, where, when. */
const LessonSummary = ({ target }: { target: LessonReviewTarget }) => {
    const coach = coachById(target.coachId);
    const service = serviceById(target.serviceId);
    if (!coach || !service) return null;
    const photo = coachPhoto(coach);

    return (
        <div className="flex items-center gap-4 rounded-xl bg-secondary p-4 ring-1 ring-secondary ring-inset">
            <Avatar size="lg" src={photo ?? undefined} initials={coach.initials} alt={coach.name} />
            <div className="flex min-w-0 flex-col gap-0.5">
                <p className="text-md font-semibold text-primary">{service.name}</p>
                <p className="text-sm text-tertiary">
                    {[`with ${coach.name}`, target.courseSlug ? COURSE_NAME[target.courseSlug] : null, target.dateLabel].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-success-primary">
                    <CheckVerified01 className="size-3.5" aria-hidden="true" />
                    Completed lesson — this review will be marked verified
                </p>
            </div>
        </div>
    );
};

export interface LessonReviewScreenProps {
    /** Bypass the URL reader — for stories, where the iframe has no query string. */
    target?: LessonReviewTarget;
    /** Open on a given state, for stories. */
    initialState?: "prompt" | "submitted";
    initialStars?: number;
}

export const LessonReviewScreen = ({ target: given, initialState = "prompt", initialStars = 0 }: LessonReviewScreenProps = {}) => {
    const [read, setRead] = useState<LessonReviewTarget | null>(null);
    const [ready, setReady] = useState(Boolean(given));
    const [state, setState] = useState(initialState);
    const [stars, setStars] = useState(initialStars);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {
        if (given) return;
        const params = new URLSearchParams(window.location.search);
        const coachId = params.get("coach");
        const serviceId = params.get("service");
        if (coachId && serviceId && coachById(coachId) && serviceById(serviceId)) {
            setRead({ coachId, serviceId, courseSlug: params.get("course") ?? undefined, dateLabel: params.get("date") ?? undefined });
        }
        setReady(true);
    }, [given]);

    const target = given ?? read;
    if (!ready) return <McgShell>{null}</McgShell>;

    const coach = target ? coachById(target.coachId) : undefined;

    // A link that lost its booking — nothing to attach a review to.
    if (!target || !coach) {
        return (
            <McgShell>
                <McgPage width="3xl">
                    <div className="flex flex-col items-start gap-4 rounded-2xl bg-primary p-8 ring-1 ring-secondary ring-inset">
                        <h1 className="text-display-xs font-semibold text-primary">This review link is incomplete</h1>
                        <p className="text-sm text-tertiary">
                            Reviews are attached to a completed lesson. Open the link from your post-lesson email, or find the lesson in your account activity.
                        </p>
                        <Button size="md" color="secondary" href="/account/activity" iconLeading={ArrowLeft}>
                            Your activity
                        </Button>
                    </div>
                </McgPage>
            </McgShell>
        );
    }

    const summary = instructorReviews(coach.id);
    // The review this golfer is writing is the next one counted.
    const afterThis = summary.count + 1;

    return (
        <McgShell>
            <McgPage width="3xl">
                <div className="flex flex-col gap-6 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset sm:p-8">
                    {!reviewsEnabled(coach.id) ? (
                        <>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-display-xs font-semibold text-primary">Thanks for taking a lesson</h1>
                                <p className="text-md text-tertiary">
                                    {`${coach.name} doesn't collect public reviews. If there's anything about the lesson you'd like the Academy to know, the shop is happy to hear it.`}
                                </p>
                            </div>
                            <LessonSummary target={target} />
                            <div className="flex flex-wrap gap-3">
                                <Button size="lg" color="primary" href={instructorHref(coach.id)}>
                                    Book another lesson
                                </Button>
                                <Button size="lg" color="secondary" href="/account/activity">
                                    Your activity
                                </Button>
                            </div>
                        </>
                    ) : state === "submitted" ? (
                        <div className="flex flex-col items-start gap-4">
                            <CheckCircle className="size-10 text-fg-success-primary" aria-hidden="true" />
                            <div className="flex flex-col gap-2">
                                <h1 className="text-display-xs font-semibold text-primary">Thanks — your review is in</h1>
                                <p className="text-md text-tertiary">
                                    {summary.status === "published"
                                        ? `It will appear on ${coach.name}'s profile with your initials once the Academy has checked it, usually within a day.`
                                        : afterThis >= REVIEW_MINIMUM
                                          ? `That makes ${REVIEW_MINIMUM} — ${coach.name}'s rating will be published on their profile once the Academy has checked the reviews.`
                                          : `${coach.name}'s rating appears once ${REVIEW_MINIMUM} golfers have reviewed a lesson. Yours makes ${afterThis} of ${REVIEW_MINIMUM}.`}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button size="lg" color="primary" href={instructorHref(coach.id)}>
                                    Book another lesson
                                </Button>
                                <Button size="lg" color="secondary" href="/account/activity">
                                    Your activity
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-display-xs font-semibold text-primary">How was your lesson?</h1>
                                <p className="text-md text-tertiary">
                                    Only golfers who took a lesson can review it. Your review is shown with your initials, never your name.
                                </p>
                            </div>

                            <LessonSummary target={target} />

                            <StarPicker value={stars} onChange={setStars} />

                            <Input label="Headline" placeholder="Sum it up in a few words" value={title} onChange={setTitle} hint="Optional" />
                            <TextArea
                                label="Your review"
                                placeholder="What did you work on? How was booking, setup and pacing?"
                                rows={5}
                                value={text}
                                onChange={setText}
                                hint="Optional. Keep it about the lesson — reviews that name other golfers aren't published."
                            />

                            <div className="flex flex-col gap-3 border-t border-secondary pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-tertiary">The Academy checks reviews before they&rsquo;re published.</p>
                                <Button size="lg" color="primary" isDisabled={stars === 0} onClick={() => setState("submitted")}>
                                    Submit review
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </McgPage>
        </McgShell>
    );
};
