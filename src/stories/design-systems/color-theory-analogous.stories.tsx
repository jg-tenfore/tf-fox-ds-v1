import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ClubStyleGuide } from "./club-style-guide";
import { WHEEL } from "./color-harmony";
import { comboGuideConfig } from "./combo-style-guide";

/** "Design Systems / Color Theory / Analogous" — every chromatic base hue in a analogous harmony. */
const meta: Meta = {
    title: "Design Systems/Color Theory/Analogous",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const mk = (key: string): Story => ({
    name: WHEEL.find((f) => f.key === key)!.label,
    render: () => <ClubStyleGuide config={comboGuideConfig(key, "analogous")} />,
});

export const Rose = mk("rose");
export const Red = mk("red");
export const Orange = mk("orange");
export const Amber = mk("amber");
export const Yellow = mk("yellow");
export const Lime = mk("lime");
export const Green = mk("green");
export const Emerald = mk("emerald");
export const Teal = mk("teal");
export const Cyan = mk("cyan");
export const Sky = mk("sky");
export const Blue = mk("blue");
export const Indigo = mk("indigo");
export const Violet = mk("violet");
export const Purple = mk("purple");
export const Fuchsia = mk("fuchsia");
export const Pink = mk("pink");
