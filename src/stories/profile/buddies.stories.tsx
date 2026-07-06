import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flag06, MessageChatCircle, UserPlus01, Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ProfileShell } from "./profile-shell";
import { Avatar, Panel, StatTile } from "./profile-ui";

/**
 * "Profile / Golf Buddies" — the member's connections plus suggestions and
 * pending invites, to encourage members to build a regular group.
 */
const meta: Meta = { title: "Profile/Golf Buddies", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

const BUDDIES = [
    { name: "Mark Thompson", initials: "MT", hcp: "12.1", last: "Played Jun 28 · Championship Course" },
    { name: "Sarah Lin", initials: "SL", hcp: "6.3", last: "Played Jun 20 · Twilight Scramble" },
    { name: "Dave Rossi", initials: "DR", hcp: "15.8", last: "Played Jun 14 · Simulator Bay 2" },
];

const SUGGESTED = [
    { name: "Priya Nair", initials: "PN", note: "2 rounds together" },
    { name: "Tom Becker", initials: "TB", note: "Played together last weekend" },
    { name: "Elena Cruz", initials: "EC", note: "In your Wednesday league" },
];

const PENDING = [{ name: "Chris Doyle", initials: "CD", note: "Invited Jul 2" }];

const BuddiesScreen = () => (
    <ProfileShell active="buddies">
        <div className="flex flex-col gap-10">
            <div>
                <h2 className="text-display-sm font-semibold text-primary">Golf Buddies</h2>
                <p className="mt-1.5 text-md text-tertiary">Stay connected with the members you play with — see their rounds and invite them to tee times.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <StatTile icon={Users01} label="Buddies" value="3" />
                <StatTile icon={Flag06} label="Rounds together" value="21" />
                <StatTile icon={UserPlus01} label="Pending" value="1" />
            </div>

            <Panel title="Your buddies" action={<Button color="secondary" size="sm" iconLeading={UserPlus01}>Invite a buddy</Button>}>
                <div className="divide-y divide-secondary">
                    {BUDDIES.map((b) => (
                        <div key={b.name} className="flex items-center gap-4 py-4">
                            <Avatar initials={b.initials} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-primary">
                                    {b.name} <span className="font-normal text-tertiary">· {b.hcp} hcp</span>
                                </p>
                                <p className="truncate text-sm text-tertiary">{b.last}</p>
                            </div>
                            <div className="hidden shrink-0 gap-2 sm:flex">
                                <Button color="secondary" size="sm" iconLeading={MessageChatCircle}>Message</Button>
                                <Button color="primary" size="sm" iconLeading={Flag06}>Invite to play</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Panel>

            <Panel title="Suggested">
                <div className="divide-y divide-secondary">
                    {SUGGESTED.map((s) => (
                        <div key={s.name} className="flex items-center gap-4 py-4">
                            <Avatar initials={s.initials} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-primary">{s.name}</p>
                                <p className="truncate text-sm text-tertiary">{s.note}</p>
                            </div>
                            <Button color="primary" size="sm" iconLeading={UserPlus01}>Add</Button>
                        </div>
                    ))}
                </div>
            </Panel>

            <Panel title="Pending invites">
                <div className="divide-y divide-secondary">
                    {PENDING.map((p) => (
                        <div key={p.name} className="flex items-center gap-4 py-4">
                            <Avatar initials={p.initials} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-primary">{p.name}</p>
                                <p className="truncate text-sm text-tertiary">{p.note}</p>
                            </div>
                            <Button color="link-gray" size="sm">Cancel</Button>
                        </div>
                    ))}
                </div>
            </Panel>
        </div>
    </ProfileShell>
);

export const Default: Story = { name: "Golf Buddies", render: () => <BuddiesScreen /> };
