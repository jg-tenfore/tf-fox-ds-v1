import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Check, Lock01 } from "@untitledui/icons";
import { FLOGOLF_CLUB } from "../explorations/tenfore-chrome";
import { ClubStyleGuide, DEFAULT_DATE, Eg, fmtNice } from "./club-style-guide";

/** "Design Systems / FloGolf Indoor" — the simulator components in the FloGolf green colorway. */
const meta: Meta = {
    title: "Design Systems/FloGolf Indoor",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const GREEN = FLOGOLF_CLUB.navColor!;
const SLOT = "flex h-14 w-28 shrink-0 flex-col justify-center gap-1 rounded-lg px-3";

export const Components: Story = {
    name: "Style guide",
    render: () => (
        <ClubStyleGuide
            config={{
                club: FLOGOLF_CLUB,
                accentName: "FloGolf green",
                accentValue: GREEN,
                calendarPrices: false,
                selectorCells: [
                    { label: "Date", value: fmtNice(DEFAULT_DATE) },
                    { label: "Time", value: "6:30 PM" },
                    { label: "Players", value: "4 Players" },
                ],
                menuTitle: "Start time",
                menuDefault: "1110",
                menuSections: [
                    {
                        rows: [
                            { value: "1110", label: "6:30 PM", right: "$20.00" },
                            { value: "1140", label: "7:00 PM", right: "$27.50" },
                            { value: "1170", label: "7:30 PM", right: "$27.50" },
                            { value: "1200", label: "8:00 PM", right: "$27.50" },
                        ],
                    },
                ],
                cards: (
                    <div className="flex flex-wrap gap-3">
                        <Eg state="Open">
                            <div className={`${SLOT} bg-primary ring-1 ring-secondary ring-inset`}>
                                <span className="text-sm font-semibold text-primary tabular-nums">6:30 PM</span>
                                <span className="text-xs font-semibold text-secondary tabular-nums">$20.00</span>
                            </div>
                        </Eg>
                        <Eg state="Selected">
                            <div className={`${SLOT} text-white`} style={{ backgroundColor: GREEN }}>
                                <span className="text-sm font-semibold tabular-nums">6:30 PM</span>
                                <span className="flex items-center gap-1 text-xs">
                                    <Check className="size-3.5" aria-hidden="true" /> Selected
                                </span>
                            </div>
                        </Eg>
                        <Eg state="Booked">
                            <div className={`${SLOT} bg-quaternary ring-1 ring-secondary ring-inset`}>
                                <span className="text-sm font-medium text-tertiary tabular-nums line-through">6:30 PM</span>
                                <span className="flex items-center gap-1 text-xs font-medium text-tertiary">
                                    <Lock01 className="size-3" aria-hidden="true" /> Booked
                                </span>
                            </div>
                        </Eg>
                    </div>
                ),
            }}
        />
    ),
};
