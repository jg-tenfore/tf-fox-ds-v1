import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WalletExperience } from "./wallet-experience";

/**
 * "Profile / Wallet · Punch Cards" — the punch-card experience in a modal: the
 * visual card, an activatable QR code with a countdown timer to scan at the
 * register, and packs to buy.
 */
const meta: Meta = { title: "Profile ∕ Account/Wallet", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

export const PunchCards: Story = { name: "Punch Cards", render: () => <WalletExperience initialModal="punch" /> };
export const PunchCardQR: Story = { name: "Punch Card · QR", render: () => <WalletExperience initialModal="punch" punchQR /> };
