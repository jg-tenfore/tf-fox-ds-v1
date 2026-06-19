import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarPlus01, CheckCircle, MarkerPin01, Phone } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { BookingSummary, type BookingSummaryProps } from "@/components/booking/booking-summary";
import { course } from "@/components/booking/sagamore-data";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";

const heroImage = sagamoreImagesByCategory("photography")[0]?.src ?? "";

/** The confirmed-round payload each story feeds the page. */
type ConfirmationArgs = Pick<BookingSummaryProps, "dateLabel" | "timeLabel" | "holes" | "players" | "ride" | "lineItems" | "total">;

const ConfirmationPage = ({ dateLabel, timeLabel, holes, players, ride, lineItems, total }: ConfirmationArgs) => {
    const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${course.name}, ${course.address}`)}`;

    return (
        <main className="flex min-h-screen flex-col bg-secondary">
            {/* Course hero banner for warmth */}
            <div className="relative h-44 w-full overflow-hidden sm:h-56">
                {heroImage ? (
                    <img src={heroImage} alt={`${course.name} fairway`} className="size-full object-cover" />
                ) : (
                    <div className="size-full bg-tertiary" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" aria-hidden="true" />
            </div>

            <div className="mx-auto -mt-16 flex w-full max-w-2xl flex-col items-center gap-8 px-4 pb-16 sm:-mt-20 sm:px-6">
                {/* Success header */}
                <header className="flex flex-col items-center gap-4 text-center">
                    <FeaturedIcon icon={CheckCircle} color="success" theme="light" size="xl" className="shadow-lg" />
                    <div className="flex flex-col gap-1">
                        <h1 className="text-display-sm font-semibold text-primary">You're booked!</h1>
                        <p className="text-md text-tertiary">
                            We've emailed your confirmation to <span className="font-medium text-secondary">olivia@sagamore.golf</span>
                        </p>
                    </div>
                </header>

                {/* Confirmed round summary */}
                <BookingSummary
                    dateLabel={dateLabel}
                    timeLabel={timeLabel}
                    holes={holes}
                    players={players}
                    ride={ride}
                    lineItems={lineItems}
                    total={total}
                    className="max-w-md"
                />

                {/* What's next */}
                <section aria-label="What's next" className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                    <h2 className="text-md font-semibold text-primary">What's next</h2>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                            <MarkerPin01 className="mt-0.5 size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            <div className="flex flex-col gap-1.5">
                                <p className="text-sm font-medium text-secondary">{course.name}</p>
                                <p className="text-sm text-tertiary">{course.address}</p>
                                <Button href={directionsHref} target="_blank" rel="noreferrer" color="link-color" size="sm" className="mt-0.5">
                                    Get directions
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone className="mt-0.5 size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            <div className="flex flex-col gap-1.5">
                                <p className="text-sm font-medium text-secondary">Pro shop</p>
                                <p className="text-sm text-tertiary">{course.phone}</p>
                            </div>
                        </div>
                    </div>

                    <Button color="secondary" size="md" iconLeading={CalendarPlus01} className="mt-1 w-full">
                        Add to calendar
                    </Button>
                </section>

                {/* Secondary actions */}
                <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
                    <Button href="#" color="secondary" size="lg" className="flex-1">
                        View my rounds
                    </Button>
                    <Button href="#" color="primary" size="lg" className="flex-1">
                        Book another tee time
                    </Button>
                </div>
            </div>
        </main>
    );
};

const meta = {
    title: "Booking/Pages/Confirmation",
    tags: ["!dev"],
    component: ConfirmationPage,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ConfirmationPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The "You're all set" screen after a confirmed foursome riding 18 on a Saturday:
 * four weekend riding green fees ($70 each) plus two shared carts ($18 each).
 */
export const Default: Story = {
    args: {
        dateLabel: "Sat, Jun 21",
        timeLabel: "7:10 AM",
        holes: 18,
        players: 4,
        ride: "cart",
        lineItems: [
            { label: "Green fees · 4 × $70", amount: 280 },
            { label: "Riding cart · 2 × $18", amount: 36 },
        ],
        total: 316,
    },
};

/** A 2-player twilight walk on a weekday — the flat $32 twilight rate, walking. */
export const Twilight: Story = {
    args: {
        dateLabel: "Wed, Jun 18",
        timeLabel: "4:40 PM",
        holes: 18,
        players: 2,
        ride: "walking",
        lineItems: [{ label: "Twilight green fees · 2 × $32", amount: 64 }],
        total: 64,
    },
};
