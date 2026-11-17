import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GROUP_FORMATS, serviceHref } from "@/components/mcg-3/instruction/data";
import { p3Story } from "./p3-story-kit";

/**
 * `/instruction/service/:id` — what a hub result opens (ported from Crane). A **private lesson**
 * shows its duration, party size and price by group size, then every instructor who teaches it
 * (narrowed by `?course=`) with a Book link each, plus "Any available instructor" once a course is
 * picked. A **group program** or **county clinic** shows its art, schedule and session dates,
 * location, instructor, capacity and Register / Join waitlist. Back returns to the hub with the
 * search it came from.
 */
const meta: Meta = {
    title: "Prototypes/MCG Prototype 3/Lessons & programs",
    id: "mcg-prototype-3-service",
    parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const PrivateLesson: Story = p3Story(
    serviceHref("private-45", "falls-road"),
    "45-minute private at Falls Road: the instructors who teach it there with their own price and next opening, Book each, and the group-size price table.",
    {},
    "Private lesson",
);
export const PrivateLessonAnyCourse: Story = p3Story(serviceHref("private-45"), "No course yet: every instructor across the county; Any available instructor waits for a course.", {}, "Private lesson · any course");
export const AcademyProgram: Story = p3Story(
    serviceHref("clinic-adult-l2", "falls-road"),
    "An Academy program (Adult Level 2): banner, schedule and every session date, instructor with a profile link, spots meter and Register.",
    {},
    "Academy program",
);
export const NovemberClinic: Story = p3Story(serviceHref("clinic-3wk-nov", "falls-road"), "The 3-Week November Clinic (Cold-Weather Swing): three Tuesday sessions in November.", {}, "3-Week November Clinic");
export const CountyClinic: Story = p3Story(serviceHref("ggr-northwest"), "A county clinic (Get Golf Ready at Northwest): five weekly sessions, spots left, Register.", {}, "County clinic");
export const CountyClinicWaitlist: Story = p3Story(
    serviceHref("ggr-needwood", undefined, { formats: GROUP_FORMATS }),
    "A full county clinic (Get Golf Ready at Needwood): Waitlist badge, every spot taken, Join waitlist. Back reads “Clinics & programs” because it came from there.",
    {},
    "County clinic (waitlist)",
);
export const ClinicsPathRedirect: Story = p3Story("/clinics/ggr-northwest", "MCG's old `/clinics/:id` links open the same service page.", {}, "/clinics/:id");
export const PerSessionClinic: Story = p3Story(
    serviceHref("girls-golf-needwood", undefined, { formats: GROUP_FORMATS }),
    "Girls Golf — Saturday Skills, sold per session, opened from Clinics & programs.",
    {},
    "Per-session clinic",
);
export const NotFound: Story = p3Story("/instruction/service/not-a-lesson", "An unknown id: a short message and a way back to Instruction.", {}, "Not found");
