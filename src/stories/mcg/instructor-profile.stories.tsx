import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InstructorProfileScreen } from "@/components/mcg/academy/instructor-profile";

/**
 * "MCG Prototype / Instructor Profile" — the **alternative** instructor page, at
 * `/instruction/pro/[id]`.
 *
 * The existing detail page (MCG Prototype / Academy → "Instructor — …") is the Academy's
 * own layout. This one is modelled on the Pro Shop product page instead: a composed
 * gallery with a thumbnail rail and a lightbox, a booking box where the buy box goes,
 * then the one-off lessons, the next openings, the packs, the programs, and a reviews
 * block. Both routes stay live so the two can be compared directly.
 *
 * The reviews are **sample data** and the page says so, loudly, in the section header —
 * these are real, named Montgomery County employees and nothing here is real feedback
 * about any of them.
 */
const meta: Meta = {
    title: "MCG Prototype/Instructor Profile",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Director: Story = {
    name: "Mike Kenny — Director of Instruction (packs + monthly plan)",
    render: () => <InstructorProfileScreen instructorId="mike-kenny" />,
};

export const MultiCourse: Story = {
    name: "Doug Hamilton — three courses",
    render: () => <InstructorProfileScreen instructorId="doug-hamilton" />,
};

export const PublishedBio: Story = {
    name: "Mike Dickson — the one published bio",
    render: () => <InstructorProfileScreen instructorId="mike-dickson" />,
};

export const Lpga: Story = {
    name: "Kate Schanuel — LPGA",
    render: () => <InstructorProfileScreen instructorId="kate-schanuel" />,
};

export const NineHole: Story = {
    name: "Dave Degirolamo — Sligo Creek (nine holes)",
    render: () => <InstructorProfileScreen instructorId="dave-degirolamo" />,
};

export const ComingSoon: Story = {
    name: "Jim Smithburger — profile coming soon",
    render: () => <InstructorProfileScreen instructorId="jim-smithburger" />,
};
