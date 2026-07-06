import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Announcement01, XClose } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { SAGAMORE_CLUB, SAGAMORE_NINES, TeeTimesScreen } from "./tenfore-chrome";

/**
 * "Global Nav / Tee Times / Dismissible Banner" — an announcement banner above the
 * Sagamore 18-hole tee sheet that the golfer can dismiss. Shown on the 18 Holes
 * (Sagamore) tee-times screen as an example.
 */
const meta: Meta = {
    title: "Global Nav/Tee Times/Dismissible Banner",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const BannerScreen = () => {
    const [show, setShow] = useState(true);
    const banner = show ? (
        <div className="relative mb-6 flex items-center gap-3 rounded-xl bg-brand-solid px-4 py-3 text-white sm:px-6">
            <span className="hidden size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 sm:flex">
                <Announcement01 className="size-4.5" aria-hidden="true" />
            </span>
            <p className="flex-1 text-sm">
                <span className="font-semibold">Fall aerification · Sept 15–17.</span> Greens maintenance is underway — enjoy reduced rates all week.
            </p>
            <button type="button" className="hidden shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-secondary transition duration-100 ease-linear hover:bg-white/90 sm:block">
                View rates
            </button>
            <button
                type="button"
                onClick={() => setShow(false)}
                aria-label="Dismiss"
                className={cx("flex size-8 shrink-0 items-center justify-center rounded-lg text-white/80 transition duration-100 ease-linear hover:bg-white/15 hover:text-white")}
            >
                <XClose className="size-5" aria-hidden="true" />
            </button>
        </div>
    ) : null;

    return <TeeTimesScreen club={SAGAMORE_CLUB} nines={SAGAMORE_NINES} banner={banner} />;
};

export const Default: Story = {
    name: "Dismissible Banner",
    render: () => <BannerScreen />,
};
