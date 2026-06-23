import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SAGAMORE_CLUB, SAGAMORE_NINES, TeeTimesScreen } from "./tenfore-chrome";

/**
 * "Tenfore Fox / 18 Holes" — Sagamore Spring Golf Club's full 18-hole tee
 * sheet, a faithful recreation of Tenfore's tee-times screen with the
 * Course / Date / Players selector bar.
 */
const meta: Meta = {
    title: "Tenfore Fox/18 Holes (Sagamore)",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    name: "18 Holes (Sagamore)",
    render: () => <TeeTimesScreen club={SAGAMORE_CLUB} nines={SAGAMORE_NINES} />,
};
