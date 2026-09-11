import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AcademyInstructorDetailScreen } from "@/components/mcg/academy/instructor-detail";
import { AcademyInstructorsScreen } from "@/components/mcg/academy/instructors-screen";

/**
 * "MCG Prototype / Academy" — the MCG Golf Academy instructor pages:
 * `/instruction/instructors` and `/instruction/instructors/[id]`.
 *
 * These mirror the real Academy pages on mcggolf.com, which organise 23 instructors
 * behind a strip of nine course logos. Every name, credential, title, course, email
 * and phone number here is transcribed from that site. Nothing biographical is
 * invented: only Mike Dickson has a published bio, and nobody has a specialism, a
 * years-teaching figure or a rating.
 *
 * Each story renders the exact component the Next route renders — the route files
 * under `src/app/instruction/instructors` are thin wrappers around these same
 * screens, so Storybook and the prototype can't drift.
 */
const meta: Meta = {
    title: "MCG Prototype/Academy",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/* ---- Roster ------------------------------------------------------- */

export const Instructors: Story = {
    name: "Instructors — All courses",
    render: () => <AcademyInstructorsScreen />,
};

export const InstructorsFallsRoad: Story = {
    name: "Instructors — Falls Road (nine instructors)",
    render: () => <AcademyInstructorsScreen initialCourse="falls-road" />,
};

export const InstructorsEmptyCourse: Story = {
    name: "Instructors — Hampshire Greens (empty state)",
    render: () => <AcademyInstructorsScreen initialCourse="hampshire-greens" />,
};

/* ---- Detail ------------------------------------------------------- */

export const InstructorDetail: Story = {
    name: "Instructor — Mike Kenny (standard)",
    render: () => <AcademyInstructorDetailScreen instructorId="mike-kenny" />,
};

export const InstructorDetailMultiCourse: Story = {
    name: "Instructor — Doug Hamilton (three courses)",
    render: () => <AcademyInstructorDetailScreen instructorId="doug-hamilton" />,
};

export const InstructorDetailWithBio: Story = {
    name: "Instructor — Mike Dickson (published bio)",
    render: () => <AcademyInstructorDetailScreen instructorId="mike-dickson" />,
};

export const InstructorDetailComingSoon: Story = {
    name: "Instructor — Jim Smithburger (coming soon)",
    render: () => <AcademyInstructorDetailScreen instructorId="jim-smithburger" />,
};
