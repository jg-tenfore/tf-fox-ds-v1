import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WalletExperience } from "./wallet-experience";

/**
 * "Profile / Wallet" — balance, gift cards, and punch cards. The gift-card purchase
 * and punch-card (activatable QR + timer) flows open in modals from this page.
 */
const meta: Meta = { title: "Profile ∕ Account/Wallet", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

export const Default: Story = { name: "Wallet", render: () => <WalletExperience /> };
