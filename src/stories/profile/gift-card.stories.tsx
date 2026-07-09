import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WalletExperience } from "./wallet-experience";

/** "Profile / Wallet · Buy Gift Card" — the gift-card purchase flow, opened in a modal. */
const meta: Meta = { title: "Profile ∕ Account/Wallet", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

export const BuyGiftCard: Story = { name: "Buy Gift Card", render: () => <WalletExperience initialModal="gift" /> };
