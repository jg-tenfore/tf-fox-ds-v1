import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "@/components/base/avatar/avatar";
import { GOLFERS } from "@/data/sagamore";

/**
 * Avatars represent golfers in a group booking — the foursome on a tee time,
 * the member profile, the playing partners on a saved round. We lead with
 * initials (monochromatic, no photos required).
 */
const meta = {
    title: "Base/Avatar",
    component: Avatar,
    parameters: { layout: "centered" },
    argTypes: {
        size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
        status: { control: "inline-radio", options: [undefined, "online", "offline"] },
        initials: { control: "text" },
    },
    args: {
        size: "md",
        initials: "MA",
        alt: "Marcus Avery",
    },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
    render: (args) => (
        <div className="flex items-center gap-3">
            <Avatar {...args} size="xs" />
            <Avatar {...args} size="sm" />
            <Avatar {...args} size="md" />
            <Avatar {...args} size="lg" />
            <Avatar {...args} size="xl" />
            <Avatar {...args} size="2xl" />
        </div>
    ),
};

/** The foursome on a championship tee time, drawn from Sagamore data. */
export const Foursome: Story = {
    render: () => (
        <div className="flex items-center -space-x-2">
            {GOLFERS.map((golfer) => (
                <div key={golfer.id} className="rounded-full ring-2 ring-white">
                    <Avatar size="md" initials={golfer.initials} alt={golfer.name} />
                </div>
            ))}
        </div>
    ),
};

export const WithStatus: Story = {
    render: (args) => (
        <div className="flex items-center gap-3">
            <Avatar {...args} status="online" />
            <Avatar {...args} initials="PR" alt="Priya Raghavan" status="offline" />
        </div>
    ),
};
