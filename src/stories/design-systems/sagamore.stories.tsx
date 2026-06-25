import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { generateTeeTimes } from "@/components/booking/sagamore-data";
import { SAGAMORE_CLUB, TeeCell } from "../explorations/tenfore-chrome";
import { ClubStyleGuide, DEFAULT_DATE, Eg, fmtNice } from "./club-style-guide";

/** "Design Systems / Sagamore" — the booking components in the Sagamore black colorway. */
const meta: Meta = {
    title: "Design Systems/Sagamore",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const SLOTS = generateTeeTimes("weekday").filter((s) => s.spotsAvailable > 0);
const NAV = SAGAMORE_CLUB.navColor!;

export const Components: Story = {
    name: "Style guide",
    render: () => (
        <ClubStyleGuide
            config={{
                club: SAGAMORE_CLUB,
                accentName: "Sagamore black",
                accentValue: "Primary solid · near-black",
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
                            <TeeCell slot={SLOTS[4]} nineLabel="Back 9" nineColor={NAV} holesOverride={9} holesWord />
                        </Eg>
                        <Eg state="Nine · Front 9">
                            <TeeCell slot={SLOTS[6]} nineLabel="Front 9" nineColor={NAV} holesOverride={9} holesWord />
                        </Eg>
                    </div>
                ),
            }}
        />
    ),
};
