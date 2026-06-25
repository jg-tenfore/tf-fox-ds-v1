import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { generateTeeTimes } from "@/components/booking/sagamore-data";
import { SAGAMORE_CLUB, TeeCell } from "../explorations/tenfore-chrome";
import { ClubStyleGuide, DEFAULT_DATE, Eg, type GuideConfig, fmtNice } from "./club-style-guide";
import { ratioVsWhite } from "./contrast";

/**
 * "Design Systems / Colorways" — the Sagamore booking style guide rendered in
 * every color family the system ships. Same format as the per-club guides; only
 * the accent swaps. Each colorway's accent is the live `utility-<family>-700`
 * token, so what you see maps to tokens already in the design system.
 */
const meta: Meta = {
    title: "Design Systems/Colorways",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const SLOTS = generateTeeTimes("weekday").filter((s) => s.spotsAvailable > 0);

/** Build the Sagamore booking config, themed to one utility hue family. */
const cfg = (label: string, family: string): GuideConfig => {
    const accent = `var(--color-${family}-700)`;
    return {
        club: { ...SAGAMORE_CLUB, name: `Sagamore · ${label}`, navColor: accent },
        accentName: label,
        accentValue: `${family}-700`,
        contrastRatio: ratioVsWhite(family, 700),
        selectorCells: [
            { label: "Course", value: "All Courses" },
            { label: "Date", value: fmtNice(DEFAULT_DATE) },
            { label: "Players", value: "2 Players" },
        ],
        menuTitle: "Course",
        menuDefault: "All Courses",
        menuSections: [
            { rows: [{ value: "All Courses", label: "All Courses" }] },
            { rows: [{ value: "18 Holes", label: "18 Holes" }] },
            {
                header: "9 Holes",
                rows: [
                    { value: "9 Holes (Back)", label: "9 Holes (Back)" },
                    { value: "9 Holes (Front)", label: "9 Holes (Front)" },
                ],
            },
        ],
        cards: (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Eg state="18 holes">
                    <TeeCell slot={SLOTS[2]} holesOverride={18} holesWord />
                </Eg>
                <Eg state="Nine · Back 9">
                    <TeeCell slot={SLOTS[4]} nineLabel="Back 9" nineColor={accent} holesOverride={9} holesWord />
                </Eg>
                <Eg state="Nine · Front 9">
                    <TeeCell slot={SLOTS[6]} nineLabel="Front 9" nineColor={accent} holesOverride={9} holesWord />
                </Eg>
            </div>
        ),
    };
};

const make = (label: string, family: string): Story => ({
    name: label,
    render: () => <ClubStyleGuide config={cfg(label, family)} />,
});

export const Brand = make("Brand", "brand");
export const Red = make("Red", "red");
export const Orange = make("Orange", "orange");
export const Amber = make("Amber", "amber");
export const Yellow = make("Yellow", "yellow");
export const Green = make("Green", "green");
export const Emerald = make("Emerald", "emerald");
export const Sky = make("Sky", "sky");
export const Blue = make("Blue", "blue");
export const Indigo = make("Indigo", "indigo");
export const Purple = make("Purple", "purple");
export const Fuchsia = make("Fuchsia", "fuchsia");
export const Pink = make("Pink", "pink");
export const Slate = make("Slate", "slate");
export const Neutral = make("Neutral", "neutral");
