import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { generateTeeTimes } from "@/components/booking/sagamore-data";
import { KETTLE_HILLS_CLUB, TeeCell } from "../explorations/tenfore-chrome";
import { ClubStyleGuide, DEFAULT_DATE, Eg, fmtNice } from "./club-style-guide";

/** "Design Systems / Kettle Hills" — the booking components in the Kettle Hills blue colorway. */
const meta: Meta = {
    title: "Design Systems/Kettle Hills",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const SLOTS = generateTeeTimes("weekday").filter((s) => s.spotsAvailable > 0);
const NAV = KETTLE_HILLS_CLUB.navColor!;

export const Components: Story = {
    name: "Style guide",
    render: () => (
        <ClubStyleGuide
            config={{
                club: KETTLE_HILLS_CLUB,
                accentName: "Kettle Hills blue",
                accentValue: NAV,
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
                            { value: "9 Holes (Ponds)", label: "9 Holes (Ponds)" },
                            { value: "9 Holes (Front Valley)", label: "9 Holes (Front Valley)" },
                            { value: "9 Holes (Rolling)", label: "9 Holes (Rolling)" },
                        ],
                    },
                ],
                cards: (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <Eg state="18 holes">
                            <TeeCell slot={SLOTS[2]} holesOverride={18} holesWord />
                        </Eg>
                        <Eg state="Nine · Ponds">
                            <TeeCell slot={SLOTS[4]} nineLabel="Ponds" nineColor={NAV} holesOverride={9} holesWord />
                        </Eg>
                        <Eg state="Nine · Rolling">
                            <TeeCell slot={SLOTS[6]} nineLabel="Rolling" nineColor={NAV} holesOverride={9} holesWord />
                        </Eg>
                    </div>
                ),
            }}
        />
    ),
};
