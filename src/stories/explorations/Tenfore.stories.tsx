import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    ArrowLeft,
    Calendar,
    ChevronDown,
    Clock,
    Flag01,
    InfoCircle,
    Mail01,
    MarkerPin01,
    Phone,
    ShoppingCart01,
    User01,
    Users01,
} from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import {
    course,
    formatPrice,
    generateTeeTimes,
    rates,
    type TeeTime,
} from "@/components/booking/sagamore-data";

/**
 * "Explorations / Tenfore" — a faithful recreation of Tenfore's own tee-time
 * booking and checkout screens, re-skinned with Sagamore Spring Golf Club
 * content. These are pixel studies of the reference product, not reusable
 * components: the tee-sheet grid and the per-player checkout are inlined here
 * so the layout, grouping, and spacing match the source screenshots.
 */
const meta: Meta = {
    title: "Explorations/Tenfore",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = ["Tee Times", "Shop", "Events", "Calendar", "Clinics", "Restaurant"] as const;

const TopNav = ({ active = "Tee Times" }: { active?: (typeof NAV_ITEMS)[number] }) => (
    <header className="sticky top-0 z-20 w-full border-b border-secondary bg-primary">
        {/* Utility bar */}
        <div className="flex items-center justify-between gap-4 px-6 py-2 text-xs text-tertiary">
            <div className="flex items-center gap-3">
                <span>{course.name}</span>
                <span className="text-quaternary">·</span>
                <span className="flex items-center gap-1">
                    <MarkerPin01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                    {course.city}
                    <ChevronDown className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                </span>
            </div>
            <div className="flex items-center gap-4">
                <button type="button" className="flex items-center gap-1.5 text-tertiary hover:text-secondary">
                    <User01 className="size-3.5" aria-hidden="true" />
                    Sign in
                </button>
                <span className="flex items-center gap-1.5 text-secondary">
                    <ShoppingCart01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                    $0.00
                </span>
            </div>
        </div>

        {/* Brand + primary nav */}
        <div className="flex items-center justify-between gap-6 px-6 pb-3">
            <div className="flex size-11 items-center justify-center overflow-hidden rounded-xl bg-brand-solid">
                <SagamoreLogo className="h-8 w-auto" />
            </div>
            <nav className="flex items-center gap-7 text-sm font-medium">
                {NAV_ITEMS.map((item) => (
                    <a
                        key={item}
                        href="#"
                        className={
                            item === active
                                ? "border-b-2 border-brand pb-1 text-primary"
                                : "pb-1 text-tertiary hover:text-secondary"
                        }
                    >
                        {item}
                    </a>
                ))}
            </nav>
        </div>
    </header>
);

const SiteFooter = () => (
    <footer className="bg-primary-solid px-8 py-10 text-sm text-white/80">
        <p className="text-md font-semibold text-white">{course.name}</p>
        <p className="mt-2">1287 Main Street {course.city} 01940</p>
        <p className="mt-1 flex items-center gap-1.5">
            <Phone className="size-3.5 text-white/50" aria-hidden="true" />
            {course.phone}
        </p>
        <p className="mt-1 flex items-center gap-1.5">
            <Mail01 className="size-3.5 text-white/50" aria-hidden="true" />
            <span className="underline">tdoucette@sagamoregolf.com</span>
        </p>
    </footer>
);

/* ------------------------------------------------------------------ */
/* Tee Times                                                           */
/* ------------------------------------------------------------------ */

/** A summary chip in the COURSE / DATE / PLAYERS info bar. */
const InfoCell = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-1 flex-col gap-1 px-5 py-3">
        <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">{label}</span>
        <span className="text-sm text-secondary">{value}</span>
    </div>
);

/**
 * A single tee-sheet cell, matching the reference: large time, a holes/players
 * meta row, the per-player price + day type, and an optional "BACK 9" footer
 * banner for slots that play the back nine first.
 */
const TeeCell = ({ slot, back9 }: { slot: TeeTime; back9?: boolean }) => {
    const holes = slot.timeOfDay === "twilight" ? 9 : 18;
    // Reference shows a player range — full slots play 1, otherwise up to 4.
    const playerRange = slot.spotsAvailable <= 1 ? "1" : "1-4";

    return (
        <button
            type="button"
            className="group flex flex-col overflow-hidden rounded-lg bg-primary text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
            <div className="flex flex-col gap-2 px-3.5 py-3">
                <span className="text-lg font-semibold text-primary">{slot.label}</span>
                <div className="flex items-center gap-3 text-xs text-tertiary tabular-nums">
                    <span className="flex items-center gap-1">
                        <Flag01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                        {holes}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                        {playerRange}
                    </span>
                </div>
                <p className="text-xs text-tertiary">
                    <span className="font-semibold text-secondary tabular-nums">{formatPrice(slot.price)}.00</span> Weekday
                </p>
            </div>
            {back9 && (
                <div className="bg-brand-solid px-3.5 py-1 text-xs font-semibold tracking-wide text-white uppercase">
                    Back 9
                </div>
            )}
        </button>
    );
};

const TeeTimesScreen = () => {
    const slots = generateTeeTimes("weekday").slice(0, 24);
    // A fixed pattern of which cells carry the "BACK 9" banner, echoing the reference.
    const back9 = new Set([5, 9, 11, 13, 16, 18, 21, 23]);

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Tee Times" />

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-6">
                {/* Course / Date / Players summary bar */}
                <div className="mb-6 flex flex-col divide-y divide-secondary rounded-xl bg-primary ring-1 ring-secondary ring-inset sm:flex-row sm:divide-x sm:divide-y-0">
                    <InfoCell label="Course" value={course.name} />
                    <InfoCell label="Date" value="Jun 18, 2026" />
                    <InfoCell label="Players" value="1" />
                </div>

                {/* Tee-sheet grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {slots.map((slot, index) => (
                        <TeeCell key={slot.id} slot={slot} back9={back9.has(index)} />
                    ))}
                </div>
            </main>

            <SiteFooter />
        </div>
    );
};

/** The Sagamore tee-sheet — a faithful recreation of Tenfore's tee-times screen. */
export const TeeTimes: Story = {
    render: () => <TeeTimesScreen />,
};

/* ------------------------------------------------------------------ */
/* Checkout                                                            */
/* ------------------------------------------------------------------ */

/** A box in the PLAYERS / HOLES / TRANSPORTATION header row. */
const CheckoutFact = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-1 flex-col gap-1 px-5 py-4">
        <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">{label}</span>
        <span className="text-sm text-secondary">{value}</span>
    </div>
);

/** A collapsed player row in the checkout list. */
const PlayerRow = ({
    icon,
    title,
    subtitle,
    action,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    action: React.ReactNode;
}) => (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-secondary px-4 py-4 ring-1 ring-secondary ring-inset">
        <div className="flex items-center gap-3">
            {icon}
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-primary">{title}</span>
                <span className="text-xs text-tertiary">{subtitle}</span>
            </div>
        </div>
        {action}
    </div>
);

const SummaryDetail = ({ icon: Icon, children }: { icon: typeof Calendar; children: string }) => (
    <span className="flex items-center gap-1.5 text-xs text-secondary">
        <Icon className="size-3.5 shrink-0 text-fg-quaternary" aria-hidden="true" />
        {children}
    </span>
);

const CheckoutScreen = () => {
    const players = 2;
    const holes = 9;
    const greenFee = rates[holes].weekday.walking; // walking 9-hole weekday, per player

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Tee Times" />

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-6">
                <Button color="primary" size="md" iconLeading={ArrowLeft} className="mb-5">
                    Back to Tee Times
                </Button>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    {/* Left column — facts + players */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col divide-y divide-secondary rounded-xl bg-primary ring-1 ring-secondary ring-inset sm:flex-row sm:divide-x sm:divide-y-0">
                            <CheckoutFact label="Players" value={String(players)} />
                            <CheckoutFact label="Holes" value={String(holes)} />
                            <CheckoutFact label="Transportation" value="Walk" />
                        </div>

                        <PlayerRow
                            icon={<Avatar size="md" placeholderIcon={User01} />}
                            title="Sign in to continue"
                            subtitle="Sign in or create an account to book this tee time."
                            action={
                                <Button color="primary" size="sm">
                                    Sign in
                                </Button>
                            }
                        />
                        <PlayerRow
                            icon={<Avatar size="md" placeholderIcon={User01} />}
                            title="Player 2"
                            subtitle="Tap to add player details."
                            action={
                                <Button color="secondary" size="sm">
                                    Edit Info
                                </Button>
                            }
                        />
                    </div>

                    {/* Right column — booking summary */}
                    <aside className="flex flex-col gap-4">
                        <section
                            aria-label="Booking summary"
                            className="flex flex-col rounded-xl bg-primary ring-1 ring-secondary ring-inset"
                        >
                            <header className="border-b border-secondary px-5 py-4">
                                <h3 className="text-md font-semibold text-primary">Booking Summary</h3>
                            </header>

                            <div className="flex flex-col gap-2 border-b border-secondary px-5 py-4">
                                <div className="flex flex-wrap justify-between gap-2">
                                    <SummaryDetail icon={Calendar}>Thursday, June 18</SummaryDetail>
                                    <SummaryDetail icon={Clock}>1:27 PM</SummaryDetail>
                                </div>
                                <div className="flex flex-wrap justify-between gap-2">
                                    <SummaryDetail icon={MarkerPin01}>Sagamore Spring Golf Club</SummaryDetail>
                                    <SummaryDetail icon={Users01}>{`${players} Players · ${holes} Holes`}</SummaryDetail>
                                </div>
                            </div>

                            {/* Green fees */}
                            <div className="flex flex-col gap-3 border-b border-secondary px-5 py-4">
                                <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Green Fees</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-secondary">
                                        Player 1 <span className="text-tertiary">(Weekday)</span>
                                    </span>
                                    <span className="tabular-nums text-primary">{formatPrice(greenFee)}.00</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-secondary">
                                        Player 2 <span className="text-tertiary">(Weekday)</span>
                                    </span>
                                    <span className="tabular-nums text-primary">{formatPrice(greenFee)}.00</span>
                                </div>
                            </div>

                            {/* Transportation */}
                            <div className="flex flex-col gap-2 border-b border-secondary px-5 py-4">
                                <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">
                                    Transportation
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-secondary">Walking</span>
                                    <span className="tabular-nums text-tertiary">$0.00 × 2</span>
                                </div>
                            </div>

                            <p className="px-5 py-3 text-xs text-tertiary">
                                Final pricing including taxes and fees will be calculated at checkout.
                            </p>
                        </section>

                        <Button color="primary" size="lg" iconLeading={Flag01} className="w-full">
                            Reserve
                        </Button>
                    </aside>
                </div>

                {/* Disclaimer */}
                <section className="mt-6 rounded-xl bg-secondary px-6 py-5 ring-1 ring-secondary ring-inset">
                    <div className="mb-3 flex items-center gap-2">
                        <InfoCircle className="size-5 text-fg-brand-primary" aria-hidden="true" />
                        <h4 className="text-md font-semibold text-primary">Disclaimer</h4>
                    </div>
                    <div className="flex flex-col gap-3 text-xs leading-relaxed text-tertiary">
                        <div>
                            <p className="font-semibold">Important Tee Time Notes:</p>
                            <p>
                                Tee times may be reserved up to 8 days in advance online or 7 days in advance over the phone.
                                Please understand that tee times are intended for four players. This means you will likely be
                                paired up with other players if your booking is for fewer than four (4) golfers. During periods
                                of heavy rain or in the early spring/late fall, we encourage folks to either call ahead or check
                                our website to confirm golf car availability/restrictions. On colder mornings, be prepared for
                                possible Frost Delays in the early spring and late fall. Questions? Call us at {course.phone}.
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold">Weekends &amp; Holidays:</p>
                            <p>
                                18-hole play is required until 1:00 pm on weekends &amp; holidays (Exception: Early Bird 9-hole
                                play off our back 9 during the first hour of every morning). 9-hole play AND Junior Rates are
                                offered after 1:00 pm on weekends/holidays — Juniors may certainly play before 1 pm on
                                weekends/holidays, but they will be charged the Standard 18-hole rate.
                            </p>
                            <p className="mt-1">
                                <span className="font-semibold">Group Reservations (9 or more players)</span> may be booked in
                                advance. To inquire about larger group bookings, please get in touch with Austin at {course.phone}{" "}
                                x113.
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold">Changes/Cancellations:</p>
                            <p>
                                All tee time changes or cancellations must be finalized no later than 24 hours before your tee
                                time.
                            </p>
                            <p className="mt-1">
                                <span className="font-semibold">No-Show!</span> If you show up with fewer players than you had
                                reserved, your credit card will be charged a No-Show Fee for each individual no-show (see our
                                No-Show Policy).
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
};

/** The per-player checkout — a faithful recreation of Tenfore's checkout screen. */
export const Checkout: Story = {
    render: () => <CheckoutScreen />,
};
