/**
 * Sample review data for the alternative instructor profile — **illustrative only**.
 *
 * Read this before using it anywhere: the MCG Golf Academy roster is a transcription of
 * real, named Montgomery County employees. Nothing in this file is real feedback about
 * any of them, and none of it comes from MCG. It exists so the product-page layout can
 * be evaluated with its reviews block populated, and for no other reason.
 *
 * Three rules keep that honest, and any edit here has to keep all three:
 *
 *  1. **Nothing personal.** Every line is about the *lesson experience* a facility
 *     controls — how booking went, whether the bay was ready, how the range time was
 *     paced, whether the notes afterwards were legible. No claims about a person's
 *     ability, manner, specialism or history.
 *  2. **Initials only.** Authors are two initials and a month, never a name.
 *  3. **Deterministic and flattering-but-flat.** Averages are derived from the
 *     instructor id and pinned to a 4.5–5.0 band, so the same profile renders the same
 *     numbers on every build and no instructor is scored lower than another in a way
 *     that could read as a real comparison.
 *
 * The screen that renders this must show `SAMPLE_REVIEW_NOTICE` next to it.
 */

/** The standing disclaimer. The profile renders this in the reviews header, undismissable. */
export const SAMPLE_REVIEW_NOTICE = "Sample review data — illustrative only, not real student feedback.";

/** The shorter form, for the inline rating control in the booking box. */
export const SAMPLE_REVIEW_NOTICE_SHORT = "Sample data";

export interface InstructorReview {
    id: string;
    /** Two initials. Never a name. */
    initials: string;
    /** Display date, fixed so a build never shifts it. */
    date: string;
    stars: number;
    title: string;
    text: string;
}

export interface InstructorReviewSummary {
    /** Always within 4.5–5.0. */
    average: number;
    count: number;
    /** Fractions for the 5★ → 1★ bars; sums to 1. */
    distribution: number[];
    reviews: InstructorReview[];
}

/* ------------------------------------------------------------------ */
/* Copy pool                                                           */
/* ------------------------------------------------------------------ */

/**
 * Every entry is about the *booking and lesson-day experience*, phrased so it would
 * read the same about any instructor at any of the nine courses.
 */
const POOL: { title: string; text: string }[] = [
    { title: "Booking took a minute", text: "Picked a time online, got the confirmation straight away, and the bay was ready when I arrived." },
    { title: "Good use of the hour", text: "Warm-up, work, then a few swings to finish. The session was paced so nothing felt rushed at the end." },
    { title: "Clear notes afterwards", text: "Left with two drills written down and a short list of what to practise before the next session." },
    { title: "Plenty of range time", text: "Balls were waiting at the bay and there was never a wait between swings. Easy morning." },
    { title: "Easy to reschedule", text: "Weather moved my slot and the change went through the same day with no fuss at all." },
    { title: "Well organised", text: "Check-in at the shop was quick, the lesson tee was set up, and everything started on time." },
    { title: "Straightforward from start to finish", text: "Turned up, worked on one thing, and understood what to do next. That's what I wanted from it." },
    { title: "Worth the drive", text: "Slot times suited a weekday evening and the facility was quiet enough to actually concentrate." },
    { title: "Good value for the time", text: "The price is clear up front and the full session is spent hitting balls rather than talking about them." },
    { title: "Sensible pacing", text: "One change per session instead of five. Came away with something I could repeat on my own." },
    { title: "Simple to book for two", text: "Booked a two-golfer slot and both of us got enough swings. Split price was shown before paying." },
    { title: "Nice setup", text: "Video on the bay and the clip was sent over afterwards, which made the notes easier to follow." },
];

const INITIALS = ["JM", "RT", "AP", "KD", "LS", "MB", "CW", "DN", "SH", "TO", "EG", "PV"];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August"];

/* ------------------------------------------------------------------ */
/* Derivation                                                          */
/* ------------------------------------------------------------------ */

/** Stable FNV-1a over the instructor id, so nothing here shifts between builds. */
const hash = (s: string): number => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

/**
 * Bar fractions by average, tenth by tenth. Hand-written rather than solved for, so the
 * shape stays believable (a long 5★ bar, a short tail) at every point in the band.
 */
const DISTRIBUTIONS: Record<string, number[]> = {
    "4.5": [0.62, 0.28, 0.06, 0.025, 0.015],
    "4.6": [0.68, 0.24, 0.05, 0.02, 0.01],
    "4.7": [0.74, 0.2, 0.04, 0.015, 0.005],
    "4.8": [0.82, 0.14, 0.03, 0.007, 0.003],
    "4.9": [0.9, 0.08, 0.015, 0.004, 0.001],
    "5.0": [0.96, 0.04, 0, 0, 0],
};

/**
 * The sample review block for one instructor.
 *
 * Deterministic in every field: the average, the count, which lines from the pool are
 * used and in what order, and the initials and dates attached to them all come from the
 * id. Nothing is random and nothing is dated relative to "now".
 */
export const instructorReviews = (instructorId: string): InstructorReviewSummary => {
    const h = hash(instructorId);

    // 4.5 … 5.0 inclusive, one decimal place.
    const average = Math.round((4.5 + (h % 6) / 10) * 10) / 10;
    const count = 24 + (h % 71);

    const offset = h % POOL.length;
    const reviews: InstructorReview[] = Array.from({ length: 6 }, (_, i) => {
        const entry = POOL[(offset + i * 5) % POOL.length];
        // A 4★ every third card keeps the bars and the cards telling the same story.
        const stars = average >= 4.9 ? 5 : i % 3 === 2 ? 4 : 5;
        return {
            id: `${instructorId}--sample-${i}`,
            initials: INITIALS[(offset + i * 3) % INITIALS.length],
            date: `${MONTHS[(offset + i * 2) % MONTHS.length]} 2026`,
            stars,
            title: entry.title,
            text: entry.text,
        };
    });

    return {
        average,
        count,
        distribution: DISTRIBUTIONS[average.toFixed(1)] ?? DISTRIBUTIONS["4.7"],
        reviews,
    };
};
