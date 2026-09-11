import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HomePage } from "@/components/mcg/home-page";

/**
 * "MCG Prototype / Home" — the prototype's front door, rendered from the exact same
 * component the `/` route uses. Every MCG Prototype story in this category works this
 * way: the story and the route share one file, so validating a change here validates
 * it in the prototype and vice versa.
 */
const meta: Meta<typeof HomePage> = {
    title: "MCG Prototype/Home",
    component: HomePage,
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof HomePage>;

export const Landing: Story = { name: "Landing" };
