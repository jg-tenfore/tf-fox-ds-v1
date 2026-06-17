import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Mail01, SearchLg, Tag01 } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";

/**
 * Inputs collect everything a golfer types while booking — the email for the
 * confirmation, a promo code, searching the tee sheet. Minimal: hairline
 * border, ink focus ring, no fill.
 */
const meta = {
    title: "Base/Input",
    component: Input,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        isInvalid: { control: "boolean" },
        isDisabled: { control: "boolean" },
        label: { control: "text" },
        hint: { control: "text" },
        placeholder: { control: "text" },
    },
    args: {
        label: "Email address",
        placeholder: "you@email.com",
        hint: "We’ll send your tee-time confirmation here.",
        size: "md",
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcon: Story = {
    args: {
        label: "Confirmation email",
        icon: Mail01,
        placeholder: "you@email.com",
    },
};

export const PromoCode: Story = {
    args: {
        label: "Promo code",
        icon: Tag01,
        placeholder: "SAGAMORE20",
        hint: "Members save 20% on twilight rounds.",
    },
};

export const SearchTeeSheet: Story = {
    args: {
        label: undefined,
        icon: SearchLg,
        placeholder: "Search tee times…",
        hint: undefined,
    },
};

/** Validation edge case — an invalid promo code at checkout. */
export const Invalid: Story = {
    args: {
        label: "Promo code",
        icon: Tag01,
        placeholder: "Enter code",
        isInvalid: true,
        hint: "That code isn’t valid for this tee time.",
    },
};
