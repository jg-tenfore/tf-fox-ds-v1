import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KETTLE_HILLS_CLUB, KETTLE_HILLS_NINES, TeeTimesScreen } from "./tenfore-chrome";

/**
 * "Tenfore Fox / 3 Courses (Kettle Hills)" — the tee-sheet experience re-skinned
 * for Kettle Hills Golf Course, which offers three nine-hole courses. Same
 * selector-bar GUI, different club identity + course list.
 */
const meta: Meta = {
    title: "Tenfore Fox/Tee Times/3 Courses (Kettle Hills)",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    name: "3 Courses (Kettle Hills)",
    render: () => <TeeTimesScreen club={KETTLE_HILLS_CLUB} nines={KETTLE_HILLS_NINES} parallelTwilightNines />,
};
