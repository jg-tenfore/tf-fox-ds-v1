import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { clinicsHref, instructionHref } from "@/components/mcg-3/instruction/data";
import { p3Story } from "./p3-story-kit";

/**
 * Instruction hub (`/instruction`) — Prototype 3's one-step search, made lighter after the Nov 17
 * call and ported back from Crane: it lands on format tiles and short result sections with a compact
 * search · course · **Filters** bar (no lesson-credit banner, no filter wall). The full filter set
 * (courses, format, dates, days, skill set) opens behind Filters (`?expanded=1`). Every change is
 * written to the URL, so a webmaster link like `?formats=clinic&course=needwood&days=sat` lands
 * filtered with the panel collapsed and a one-line summary. The **Instructors** tab
 * (`/instruction/instructors` or `?view=instructors`) lists every Academy pro behind the search.
 */
const meta: Meta = {
    title: "Prototypes/MCG Prototype 3/Instruction hub",
    id: "mcg-prototype-3-hub",
    parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const Collapsed: Story = p3Story(instructionHref(), "Default landing: header, Services | Instructors, the compact bar, five format tiles and the first six of each section.", {}, "Hub (collapsed)");
export const FiltersOpen: Story = p3Story(
    instructionHref({ expanded: true }),
    "`?expanded=1`: the full filter set inline — courses (logos), format, dates + presets, days, skill set.",
    {},
    "Filters open",
);
export const DeepLinked: Story = p3Story(
    instructionHref({ formats: ["clinic"], courses: ["needwood"], days: [6] }),
    "A webmaster link (Saturday clinics at Needwood) lands filtered with the panel collapsed: a summary line, removable chips and Edit filters.",
    {},
    "Sat clinics at Needwood (deep link)",
);
export const NoResults: Story = p3Story(
    instructionHref({ formats: ["clinic"], courses: ["needwood"], days: [1] }),
    "Monday clinics at Needwood: nothing runs then, so the empty state offers Clear filters and Edit filters.",
    {},
    "No results",
);
export const GroupPrograms: Story = p3Story(clinicsHref(), "Where MCG's Clinics link lands (`/clinics` redirects here): the four group formats, titled “Clinics & programs”.", {}, "Clinics & programs");
export const ClinicsRedirect: Story = p3Story("/clinics", "`/clinics` itself: replaced with the group-programs search on arrival.", {}, "/clinics → group programs");
export const InstructorsTab: Story = p3Story(instructionHref({ view: "instructors" }), "Every bookable Academy instructor plus county clinic staff: headshot, credential, home courses, lessons from $, next opening, sample rating.", {}, "Instructors tab");
export const InstructorsPath: Story = p3Story("/instruction/instructors", "The same tab at its own path.", {}, "Instructors (path)");
export const InstructorsAtCourse: Story = p3Story(
    "/instruction/instructors?course=falls-road",
    "Narrowed to Falls Road with the course select — the deep link an instructor page on mcggolf.com can use.",
    {},
    "Instructors at Falls Road",
);
export const SavedOnly: Story = p3Story(
    instructionHref({ view: "instructors", extra: { saved: "1" } }),
    "`?saved=1`: only the instructors the golfer saved (the heart on a profile) — here Mike Kenny and Kate Schanuel.",
    { savedInstructors: ["mike-kenny", "kate-schanuel"] },
    "Instructors · saved only",
);
export const SavedOnlyNone: Story = p3Story(
    instructionHref({ view: "instructors", extra: { saved: "1" } }),
    "`?saved=1` with nothing saved yet: how to save one.",
    {},
    "Instructors · saved only, none yet",
);
export const SignedOut: Story = p3Story(instructionHref(), "The hub for a guest — nothing on it needs an account.", { signedIn: false }, "Signed out");
