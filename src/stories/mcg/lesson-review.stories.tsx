import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LessonReviewScreen } from "@/components/mcg/academy/lesson-review-screen";

/**
 * "MCG Prototype / Lesson Review" — the post-lesson review prompt at `/instruction/review`.
 *
 * The only way a review enters Tenfore: after a completed lesson the golfer who took it
 * is sent here (email, and Account → Activity → "Leave a review"). Reviews are optional
 * per instructor and no rating is published until five are in. The instructors below
 * are real; the review states attached to them are sample settings.
 */
const meta: Meta<typeof LessonReviewScreen> = {
    title: "MCG Prototype/Lesson Review",
    component: LessonReviewScreen,
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof LessonReviewScreen>;

const DOUG = { coachId: "doug-hamilton", serviceId: "private-45", courseSlug: "little-bennett", dateLabel: "Tue, Aug 18" };

export const Prompt: Story = {
    name: "Prompt — rate a completed lesson",
    args: { target: DOUG },
};

export const Rated: Story = {
    name: "Prompt — stars chosen",
    args: { target: DOUG, initialStars: 5 },
};

export const Submitted: Story = {
    name: "Submitted — rating already published",
    args: { target: DOUG, initialState: "submitted", initialStars: 5 },
};

export const SubmittedCollecting: Story = {
    name: "Submitted — counts toward the 5-review minimum",
    args: { target: { coachId: "brandon-jarvis", serviceId: "private-30", courseSlug: "rattlewood", dateLabel: "Sat, Aug 22" }, initialState: "submitted", initialStars: 4 },
};

export const InstructorOptedOut: Story = {
    name: "Instructor has reviews off",
    args: { target: { coachId: "john-ross", serviceId: "private-45", dateLabel: "Thu, Aug 20" } },
};
