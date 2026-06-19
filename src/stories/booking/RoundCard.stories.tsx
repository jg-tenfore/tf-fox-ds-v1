import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/base/buttons/button";
import { RoundCard } from "@/components/booking/round-card";
import { sampleBookings, type Booking } from "@/components/booking/sagamore-data";

/**
 * The round card is a Resy-style reservation card for the Sagamore Spring "My
 * rounds" list. It pairs a course photo with the tee date and time, a quick
 * holes · players · ride read, a status badge (green for upcoming, gray once
 * played, red if scrubbed), the party total, and a trailing slot for actions.
 */
const meta = {
    title: "Booking/Molecules/Round Card",
    tags: ["!dev"],
    component: RoundCard,
    parameters: { layout: "padded" },
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-xl">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof RoundCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const byStatus = (status: Booking["status"]): Booking => sampleBookings.find((b) => b.status === status)!;

/** Actions for a round you can still change — review the booking or scrub it. */
const upcomingActions = (
    <>
        <Button color="secondary" size="sm">
            View
        </Button>
        <Button color="link-destructive" size="sm">
            Cancel
        </Button>
    </>
);

/** Once the round is in the books, you can revisit it or tee up a rematch. */
const completedActions = (
    <>
        <Button color="link-gray" size="sm">
            View
        </Button>
        <Button color="secondary" size="sm">
            Book again
        </Button>
    </>
);

/** Play with the booking and actions live. */
export const Playground: Story = {
    args: {
        booking: byStatus("upcoming"),
        actions: upcomingActions,
    },
};

/** A confirmed tee time at Sagamore Spring — green badge, ready to play. */
export const Upcoming: Story = {
    args: {
        booking: byStatus("upcoming"),
        actions: upcomingActions,
    },
};

/** A round already walked — muted gray badge with a nudge to book again. */
export const Completed: Story = {
    args: {
        booking: byStatus("completed"),
        actions: completedActions,
    },
};

/** A scrubbed tee time — red badge, with the option to rebook the slot. */
export const Cancelled: Story = {
    args: {
        booking: { ...byStatus("completed"), id: "b-0900", status: "cancelled", dateLabel: "Fri, May 23", timeLabel: "10:20 AM" },
        actions: (
            <Button color="secondary" size="sm">
                Rebook
            </Button>
        ),
    },
};

/** The full "My rounds" stack — every Sagamore Spring booking with fitting actions. */
export const List: Story = {
    args: { booking: sampleBookings[0] },
    render: () => (
        <div className="flex flex-col gap-3">
            {sampleBookings.map((booking) => (
                <RoundCard
                    key={booking.id}
                    booking={booking}
                    actions={booking.status === "completed" ? completedActions : upcomingActions}
                />
            ))}
        </div>
    ),
};
