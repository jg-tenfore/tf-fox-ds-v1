import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { bookHref, clinicById, serviceHref } from "@/components/mcg-3/instruction/data";
import { p3Story } from "./p3-story-kit";

/**
 * "MCG Prototype 3 / Programs" — the formats MCG asked for beyond private lessons and group
 * clinics, now on **Prototype 3's updated service pages (ported from Crane)**: art, schedule and
 * every session date, location, instructor, capacity, who it's for, and Register / Join waitlist.
 * Junior league, Op 36 and junior camps are **sample programs**: MCG doesn't run them today.
 */
const meta: Meta = {
    title: "Prototypes/MCG Prototype 3/Programs",
    id: "mcg-prototype-3-programs",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const JuniorLeague: Story = p3Story(serviceHref("junior-league-northwest"), "MCG Junior League — Fall Season at Northwest: six Tuesday sessions.", {}, "Junior league (sample)");

export const Op36: Story = p3Story(serviceHref("op36-little-bennett"), "Op 36 — Level 1 to 5 Pathway at Little Bennett.", {}, "Op 36 (sample)");

export const JuniorCamp: Story = p3Story(serviceHref("junior-camp-needwood"), "Junior Golf Camp at Needwood: four days in November.", {}, "Junior camp (sample)");

/** Girls Golf is sold by the session: three dates picked in the URL (`sessions=`), so Buy 3 applies. */
const GIRLS_GOLF_SESSIONS = (() => {
    const dates = clinicById("girls-golf-needwood")?.sessionDates ?? [];
    return [dates[0], dates[2], dates[3]].filter(Boolean).join(",");
})();

export const PerSessionClinic: Story = p3Story(
    `${bookHref({ coach: "any", service: "girls-golf-needwood", course: "needwood" })}&sessions=${GIRLS_GOLF_SESSIONS}`,
    "Girls Golf — Saturday Skills is sold per session: registration opens with sessions 1, 3 and 4 chosen (`sessions=`), so the Buy 3 discount applies to the whole registration.",
    {},
    "Group clinic — per-session with Buy 3",
);
