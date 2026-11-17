import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { instructorHref, proHref } from "@/components/mcg-3/instruction/data";
import { InstructorProfilePage } from "@/components/mcg-3/instruction/pro/instructor-profile-page";
import { P3Story, p3Story } from "./p3-story-kit";

/**
 * The instructor profile (`/instruction/pro/:id`, and the Academy-style `/instruction/instructors/:id`)
 * — "instructor as a product page", ported back from Crane. Gallery + buy box (MCG Golf Academy
 * lockup, name and credential, title, rating with the **Sample data** tag, lessons from $, home-course
 * chips with logos, next opening, Book a lesson · Save · Share, Academy contact only), then *What they
 * offer*: private lessons with a price-by-group-size grid, the group clinics they run (registered
 * for right here — Nov 17), the next-openings time board, packs with "How lesson credits work" and
 * the monthly plan, and verified reviews with the illustrative-sample notice.
 */
const meta: Meta = {
    title: "Prototypes/MCG Prototype 3/Instructor profile",
    id: "mcg-prototype-3-instructor",
    parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const MikeKenny: Story = p3Story(
    proHref("mike-kenny"),
    "Mike Kenny, PGA (Director of Instruction): privates at his rate, his Adult Level 2 clinic, today's openings, two packs and his monthly plan, sample reviews.",
    {},
    "Mike Kenny",
);
export const AcademyUrl: Story = p3Story(
    instructorHref("doug-hamilton"),
    "The Academy-style URL renders the same profile. Doug Hamilton, Master PGA: three home courses (one menu, a calendar at each) and his own group-size pricing.",
    {},
    "Doug Hamilton · Academy URL",
);
export const WithClinics: Story = p3Story(
    proHref("kate-schanuel"),
    "Kate Schanuel, LPGA runs two programs (First Swings junior starter, the junior camp) — an instructor's clinics list on their profile and are registered for there.",
    {},
    "Kate Schanuel · with clinics",
);
export const ComingSoon: Story = p3Story(proHref("jim-smithburger"), "A Coming Soon card: placeholder art, no menu or booking — the shop books by phone.", {}, "Coming soon");
export const WithBio: Story = p3Story(instructorHref("mike-dickson"), "Mike Dickson is the one card the Academy publishes a bio for.", {}, "With a bio");
export const CollectingReviews: Story = p3Story(proHref("blessing-jasi"), "Fewer than five verified reviews: no rating is shown yet — “collecting reviews” instead.", {}, "Collecting reviews");
export const ReviewsOff: Story = p3Story(proHref("john-ross"), "Reviews switched off for this instructor: no rating, no count and no reviews block at all.", {}, "Reviews off");
export const KeepsHubQuery: Story = p3Story(
    proHref("mike-kenny", { view: "instructors", courses: ["falls-road"], formats: ["private"] }),
    "Arriving from a filtered hub: “All instructors” returns to the same filters.",
    {},
    "Back keeps the hub query",
);
export const NoOpenings: Story = {
    name: "No openings",
    render: () => <P3Story path={proHref("brent-wilkerson")} screen={<InstructorProfilePage id="brent-wilkerson" fullyBooked />} />,
    parameters: {
        docs: {
            description: {
                story: "A fully booked instructor (a prop, not a URL): next opening reads “Fully booked”, the board shows its empty state and the primary action becomes Join the waitlist (→ `step=waitlist`).",
            },
        },
    },
};
