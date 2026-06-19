import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarPlus02 } from "@untitledui/icons";
import { Tabs } from "@/components/application/tabs/tabs";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button } from "@/components/base/buttons/button";
import { RoundCard } from "@/components/booking/round-card";
import { sampleBookings, type Booking } from "@/components/booking/sagamore-data";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";

/**
 * The "My rounds" page is the Sagamore Spring equivalent of Resy's
 * "Reservations" screen: a top bar with the course logo and a green
 * book-a-tee-time CTA, a heading, and tabs that split a golfer's rounds into
 * Upcoming and Past. Upcoming rounds can be modified or cancelled; past rounds
 * can be re-booked. When there's nothing on the books, an empty state nudges
 * the golfer back to the tee sheet.
 */

const photos = sagamoreImagesByCategory("photography");
/** Deterministic per-card thumbnail so stories and SSR stay stable. */
const thumbnailFor = (index: number): string | undefined => photos[index % Math.max(photos.length, 1)]?.src;

const upcomingActions = (
    <>
        <Button color="secondary" size="sm">
            Modify
        </Button>
        <Button color="link-destructive" size="sm">
            Cancel
        </Button>
    </>
);

const pastActions = (
    <Button color="secondary" size="sm">
        Book again
    </Button>
);

interface MyRoundsPageProps {
    bookings: Booking[];
}

const MyRoundsPage = ({ bookings }: MyRoundsPageProps) => {
    const upcoming = bookings.filter((b) => b.status === "upcoming");
    const past = bookings.filter((b) => b.status === "completed");

    return (
        <div className="flex min-h-dvh flex-col bg-primary">
            {/* Top bar */}
            <header className="flex items-center justify-between gap-4 border-b border-secondary px-4 py-4 md:px-8">
                <SagamoreLogo className="h-10 w-auto" />
                <Button color="primary" size="md" iconLeading={CalendarPlus02}>
                    Book a tee time
                </Button>
            </header>

            <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-8 md:py-12">
                <h1 className="mb-6 text-display-xs font-semibold text-primary">My rounds</h1>

                <Tabs>
                    <Tabs.List type="button-border" size="md">
                        <Tabs.Item id="upcoming" badge={upcoming.length || undefined}>
                            Upcoming
                        </Tabs.Item>
                        <Tabs.Item id="past" badge={past.length || undefined}>
                            Past
                        </Tabs.Item>
                    </Tabs.List>

                    <Tabs.Panel id="upcoming" className="pt-6">
                        {upcoming.length > 0 ? (
                            <ul className="flex flex-col gap-4">
                                {upcoming.map((booking, i) => (
                                    <li key={booking.id}>
                                        <RoundCard booking={booking} thumbnailSrc={thumbnailFor(i)} actions={upcomingActions} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState size="md" className="py-12">
                                <EmptyState.Header>
                                    <EmptyState.FeaturedIcon color="brand" icon={CalendarPlus02} />
                                </EmptyState.Header>
                                <EmptyState.Content>
                                    <EmptyState.Title>No upcoming rounds</EmptyState.Title>
                                    <EmptyState.Description>
                                        You don't have any tee times booked yet. Find an open slot and get back on the course.
                                    </EmptyState.Description>
                                </EmptyState.Content>
                                <EmptyState.Footer>
                                    <Button color="primary" size="md" iconLeading={CalendarPlus02}>
                                        Book a tee time
                                    </Button>
                                </EmptyState.Footer>
                            </EmptyState>
                        )}
                    </Tabs.Panel>

                    <Tabs.Panel id="past" className="pt-6">
                        {past.length > 0 ? (
                            <ul className="flex flex-col gap-4">
                                {past.map((booking, i) => (
                                    <li key={booking.id}>
                                        <RoundCard booking={booking} thumbnailSrc={thumbnailFor(i + upcoming.length)} actions={pastActions} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState size="md" className="py-12">
                                <EmptyState.Header>
                                    <EmptyState.FeaturedIcon color="gray" />
                                </EmptyState.Header>
                                <EmptyState.Content>
                                    <EmptyState.Title>No past rounds</EmptyState.Title>
                                    <EmptyState.Description>Rounds you've played will show up here once they're complete.</EmptyState.Description>
                                </EmptyState.Content>
                            </EmptyState>
                        )}
                    </Tabs.Panel>
                </Tabs>
            </main>
        </div>
    );
};

const meta = {
    title: "Booking/Pages/My Rounds",
    tags: ["!dev"],
    component: MyRoundsPage,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MyRoundsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full "My rounds" page with upcoming and past tee times booked. */
export const Default: Story = {
    args: {
        bookings: sampleBookings,
    },
};

/** No tee times on the books — the empty state invites the golfer to book one. */
export const Empty: Story = {
    args: {
        bookings: sampleBookings.filter((b) => b.status !== "upcoming"),
    },
};
