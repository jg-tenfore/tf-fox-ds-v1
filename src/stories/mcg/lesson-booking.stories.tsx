import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LessonBookScreen } from "@/components/mcg/academy/book-screen";

/**
 * "MCG Prototype / Lesson Booking" — `/instruction/book`, the back half of the
 * instructor-first path.
 *
 * The Academy's flow is: pick a pro on `/instruction`, pick a lesson from that pro's
 * profile, then land here for time, details and payment. Because the first two
 * decisions are already made, the rail is three steps rather than five.
 *
 * The routed page reads its selection from the query string (so a booking link is
 * shareable) or a session hand-off. A Storybook iframe has neither, so these stories
 * pass the selection in directly — the same component the route renders.
 */
const meta: Meta<typeof LessonBookScreen> = {
    title: "MCG Prototype/Lesson Booking",
    component: LessonBookScreen,
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof LessonBookScreen>;

/** The standard case: the Director's 45-minute private at his home course. */
export const PickATime: Story = {
    name: "Time — 45-Minute Private with Mike Kenny",
    args: { selection: { coachId: "mike-kenny", serviceId: "private-45", courseSlug: "falls-road" } },
};

/** A cross-course instructor: the course cell offers all three of Doug's courses. */
export const CrossCourse: Story = {
    name: "Time — Doug Hamilton (three courses)",
    args: { selection: { coachId: "doug-hamilton", serviceId: "private-45", courseSlug: "laytonsville" } },
};

/** A guardrailed lesson — the junior private is weekends only, so most of the day is closed. */
export const Guardrailed: Story = {
    name: "Time — Junior Private (weekends only)",
    args: { selection: { coachId: "kate-schanuel", serviceId: "junior-30", courseSlug: "falls-road" } },
};

/** The on-course playing lesson: afternoons in season only. */
export const PlayingLesson: Story = {
    name: "Time — 9-Hole Playing Lesson",
    args: { selection: { coachId: "mike-dickson", serviceId: "playing-9", courseSlug: "little-bennett" } },
};

/**
 * Opened without a selection — a link that lost its query string, or someone typing
 * the URL. It says so and sends them back to pick a pro rather than silently booking
 * a lesson nobody chose.
 */
export const ColdStart: Story = {
    name: "Opened without a selection",
    args: {},
};
