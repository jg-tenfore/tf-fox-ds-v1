import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FLOGOLF_BAYS, FLOGOLF_CLUB, TeeTimesScreen } from "./tenfore-chrome";

/**
 * "Tenfore Fox / Simulator (FloGolf)" — the tee-sheet experience re-skinned for
 * FloGolf Lounge, an indoor golf simulator venue. The first selector becomes
 * "Simulator Bay" (ten bays), and each booking plays a full 18.
 */
const meta: Meta = {
    title: "Tenfore Fox/Simulator (FloGolf)",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    name: "Simulator (FloGolf)",
    render: () => <TeeTimesScreen club={FLOGOLF_CLUB} courses={FLOGOLF_BAYS} courseLabel="Simulator Bay" holesOverride={18} />,
};
