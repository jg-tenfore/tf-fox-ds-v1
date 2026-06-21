import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthSimple } from "./account-auth-simple";

/**
 * Simple sign-up page for new Sagamore members — an elevated Untitled UI card
 * with full credentials (email, first/last name, password + confirm, birthday
 * MM/DD/YYYY dropdowns, phone), a green create-account CTA, and the Google /
 * Apple icon social group.
 */
const meta = {
    title: "Account/Sign up",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    render: () => <AuthSimple defaultMode="signup" />,
};
