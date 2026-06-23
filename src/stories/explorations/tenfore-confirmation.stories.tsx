import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download01,
    Flag01,
    LifeBuoy01,
    MarkerPin01,
    MessageChatCircle,
    Phone,
    Users01,
} from "@untitledui/icons";
import { Carousel } from "@/components/application/carousel/carousel-base";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { course } from "@/components/booking/sagamore-data";
import { cx } from "@/utils/cx";
import { PlayerAvatar, SiteFooter } from "./tenfore-chrome";

/**
 * "Tenfore Fox / Confirmation" — a centered receipt-style page for a completed
 * reservation: a black centered header, course carousel, tee-time details,
 * who's going, payment details, and help links, with confetti on load.
 */
const meta: Meta = {
    title: "Tenfore Fox/Confirmation",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/** Black confirmation header — centered logo + club name, with a back button
 *  on the left and a Get help link (jumps to Important information) on the right. */
const ConfirmationHeader = () => (
    <header className="relative flex flex-col items-center gap-2 bg-primary-solid px-6 py-6 text-center">
        <button
            type="button"
            aria-label="Back"
            className="absolute top-1/2 left-6 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition duration-100 ease-linear hover:bg-white/20"
        >
            <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <SagamoreLogo className="h-12 w-auto" />
        <span className="text-base font-semibold text-white">{course.name}</span>
        <button
            type="button"
            onClick={() => document.getElementById("important-information")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="absolute top-1/2 right-6 flex -translate-y-1/2 items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition duration-100 ease-linear hover:bg-white/20"
        >
            <MessageChatCircle className="size-4" aria-hidden="true" /> Get help
        </button>
    </header>
);

/** A row in the tee-time-details table. */
const ConfRow = ({ icon: Icon, label, value }: { icon?: typeof Calendar; label: string; value: React.ReactNode }) => (
    <tr>
        <th scope="row" className="py-3.5 text-left align-middle">
            <span className="flex items-center gap-2.5 text-sm font-medium text-secondary">
                {Icon ? <Icon className="size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" /> : null}
                {label}
            </span>
        </th>
        <td className="py-3.5 align-middle text-sm font-medium text-primary">
            <div className="flex justify-end">{value}</div>
        </td>
    </tr>
);

/** A line item in the payment-details breakdown. */
const PayRow = ({ label, sub, value }: { label: string; sub?: string; value: string }) => (
    <div className="flex items-start justify-between gap-4 py-3.5">
        <span className="flex flex-col">
            <span className="text-secondary">{label}</span>
            {sub ? <span className="mt-0.5 text-xs text-tertiary">{sub}</span> : null}
        </span>
        <span className="shrink-0 tabular-nums text-primary">{value}</span>
    </div>
);

/** Real Sagamore course photography for the confirmation carousel. */
const COURSE_PHOTOS = sagamoreImagesByCategory("photography");
const carouselArrow =
    "absolute top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-md ring-1 ring-primary transition duration-100 ease-linear hover:bg-primary_hover";

const ConfirmationScreen = () => {
    const golfers = [
        { first: "Justin", last: "Girard", email: "hello@girardjustin.com" },
        { first: "Sam", last: "Carter", email: "sam.carter@example.com" },
    ];

    // Celebrate the booking on load.
    useEffect(() => {
        confetti({ particleCount: 140, spread: 75, startVelocity: 45, origin: { y: 0.35 } });
        const t = window.setTimeout(() => confetti({ particleCount: 90, spread: 110, startVelocity: 32, origin: { y: 0.4 } }), 260);
        return () => window.clearTimeout(t);
    }, []);

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <ConfirmationHeader />

            <main className="flex-1 px-6 pt-10 pb-20">
                <div className="mx-auto max-w-2xl">
                    {/* Super container */}
                    <div className="overflow-hidden rounded-2xl bg-primary shadow-sm ring-1 ring-secondary ring-inset">
                        {/* Green check */}
                        <div className="flex justify-center px-7 pt-7">
                            <FeaturedIcon icon={CheckCircle} size="lg" color="success" theme="light" />
                        </div>

                        {/* Reservation confirmation */}
                        <div className="px-7 pt-4 text-center">
                            <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Reservation confirmation</p>
                            <p className="mt-1 text-lg font-semibold tabular-nums text-primary">#421292164</p>
                        </div>

                        {/* Course carousel */}
                        <div className="px-7 pt-6">
                            <Carousel.Root opts={{ loop: true }} className="w-full">
                                <Carousel.Content>
                                    {COURSE_PHOTOS.map((photo) => (
                                        <Carousel.Item key={photo.name}>
                                            <img src={photo.src} alt={photo.name} className="aspect-video w-full rounded-xl object-cover" loading="lazy" />
                                        </Carousel.Item>
                                    ))}
                                </Carousel.Content>
                                <Carousel.PrevTrigger className={cx(carouselArrow, "left-3")}>
                                    <ChevronLeft className="size-5" aria-hidden="true" />
                                </Carousel.PrevTrigger>
                                <Carousel.NextTrigger className={cx(carouselArrow, "right-3")}>
                                    <ChevronRight className="size-5" aria-hidden="true" />
                                </Carousel.NextTrigger>
                                <Carousel.IndicatorGroup className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                                    {({ index }) => (
                                        <Carousel.Indicator
                                            key={index}
                                            index={index}
                                            className={({ isSelected }) => cx("size-2 rounded-full transition duration-100 ease-linear", isSelected ? "w-5 bg-white" : "bg-white/60")}
                                        />
                                    )}
                                </Carousel.IndicatorGroup>
                            </Carousel.Root>
                        </div>

                        {/* Course info */}
                        <div className="px-7 pt-6 pb-7 text-center">
                            <h1 className="text-2xl font-semibold text-primary">{course.name}</h1>
                            <p className="mt-2 text-md text-tertiary">Twilight · 9 holes</p>
                            <p className="mt-1 text-md text-tertiary">1287 Main Street, Lynnfield, MA 01940</p>
                            <div className="mt-5 flex justify-center">
                                <Button href="#" color="secondary" iconLeading={MarkerPin01}>
                                    Get directions
                                </Button>
                            </div>
                        </div>

                {/* Tee time details */}
                <section className="border-t border-secondary px-7 py-7">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-primary">Tee time details</h2>
                        <Badge color="success" size="md" type="pill-color">
                            Confirmed
                        </Badge>
                    </div>

                    {/* Sub-container — the details + banner */}
                    <div className="mt-4 rounded-xl px-6 ring-1 ring-secondary ring-inset">
                        <table className="w-full">
                            <tbody className="divide-y divide-secondary">
                                <ConfRow icon={Calendar} label="Date" value="Tuesday, April 21, 2026" />
                            <ConfRow icon={Clock} label="Tee time" value="6:00 PM" />
                            <ConfRow icon={Users01} label="Players" value="2 golfers" />
                            <ConfRow icon={Flag01} label="Holes" value="9 holes" />
                            <ConfRow
                                label="Rate type"
                                value={
                                    <Badge color="purple" size="md" type="pill-color">
                                        Twilight Deal
                                    </Badge>
                                }
                            />
                            <ConfRow label="Confirmation" value="#421292164" />
                            <ConfRow label="Course confirmation" value="#SSGC|34938" />
                            <ConfRow label="Group" value="Justin Girard · 617-470-7879" />
                            </tbody>
                        </table>
                    </div>

                    {/* Free cancellation banner — outside the sub-container */}
                    <div className="mt-5 flex items-center justify-center gap-2 rounded-full bg-warning-primary px-6 py-2.5 text-center text-sm font-medium text-warning-primary ring-1 ring-utility-yellow-200 ring-inset">
                        <CheckCircle className="size-4 shrink-0" aria-hidden="true" />
                        Free cancellation up to 24 hours before your tee time
                    </div>
                </section>

                {/* Who's going */}
                <section className="border-t border-secondary px-7 py-7">
                    <h2 className="mb-4 text-lg font-semibold text-primary">Who's going</h2>
                    <div className="flex flex-col gap-4">
                        {golfers.map((g, i) => (
                            <div key={g.email} className="flex items-center gap-3">
                                <PlayerAvatar number={i + 1} initials={`${g.first[0]}${g.last[0]}`.toUpperCase()} />
                                <div className="flex flex-col">
                                    <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                                        {g.first} {g.last}
                                        {i === 0 ? <span className="rounded-full bg-tertiary px-2 py-0.5 text-[10px] font-medium text-secondary">You</span> : null}
                                    </span>
                                    <span className="text-xs text-tertiary">{g.email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Price details */}
                <section className="border-t border-secondary px-7 py-7">
                    <h2 className="text-lg font-semibold text-primary">Payment details</h2>

                    {/* Total + paid */}
                    <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-2xl font-semibold text-primary">Total</span>
                        <span className="flex items-center gap-2.5">
                            <span className="text-2xl font-semibold tabular-nums text-primary">$13.00</span>
                            <Badge color="success" size="md" type="pill-color">
                                Paid
                            </Badge>
                        </span>
                    </div>

                    {/* Line items */}
                    <div className="mt-4 flex flex-col divide-y divide-secondary border-t border-secondary text-sm">
                        <PayRow label="Twilight green fee — 9 holes × 2" value="$41.40" />
                        <PayRow label="Convenience fee" value="$6.98" />
                        <PayRow label="Youth On Course donation" value="$0.68" />
                        <PayRow label="Sagamore Pass credit" value="−$36.06" />
                        <div className="py-3.5">
                            <div className="flex items-center justify-between">
                                <span className="text-secondary">Subtotal</span>
                                <span className="tabular-nums text-primary">$13.00</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-xs text-tertiary">
                                <span>Tax</span>
                                <span className="tabular-nums">$0.00</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-tertiary">Paid online on April 18, 2026.</p>

                    {/* Total charged + card */}
                    <div className="mt-4 border-t border-secondary pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-base font-semibold text-primary">Total charged</span>
                            <span className="text-base font-semibold tabular-nums text-primary">$13.00</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="flex items-center gap-2.5 text-sm text-secondary">
                                <img src="card-images/Visa.svg" alt="Visa" className="h-6 w-auto" />
                                Visa ending in 4242
                            </span>
                            <span className="tabular-nums text-sm text-secondary">$13.00</span>
                        </div>
                    </div>

                    <Button color="secondary" size="lg" iconLeading={Download01} className="mt-6 w-full">
                        Download PDF receipt
                    </Button>
                </section>

                {/* Important information */}
                <section id="important-information" className="scroll-mt-6 border-t border-secondary px-7 py-7">
                    <h2 className="text-lg font-semibold text-primary">Important information</h2>
                    <div className="mt-5 flex flex-col gap-5">
                        <div>
                            <h3 className="text-sm font-semibold text-primary">Cancellations and changes</h3>
                            <p className="mt-2 text-sm leading-relaxed text-tertiary">
                                Free cancellation up to 24 hours before your tee time. Inside 24 hours the Twilight Deal rate is non-refundable. Eligible refunds
                                are issued as TenFore account credit valid for six months.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-primary">Course policies</h3>
                            <p className="mt-2 text-sm leading-relaxed text-tertiary">
                                Collared shirt required; no denim or tank tops. Arrive 15 minutes early to check in at the pro shop. Groups of fewer than four
                                players may be paired with other pre-paid golfers.
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col gap-3">
                        <Button color="secondary" size="lg" className="w-full">
                            Change reservation
                        </Button>
                        <Button color="secondary-destructive" size="lg" className="w-full">
                            Cancel reservation
                        </Button>
                    </div>
                </section>

                {/* Where to find help */}
                <section className="border-t border-secondary px-7 py-7">
                    <h2 className="text-lg font-semibold text-primary">Where to find help</h2>
                    <div className="mt-5 flex flex-col gap-5">
                        <div className="flex gap-3">
                            <Phone className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                            <div>
                                <p className="text-sm font-semibold text-primary">Questions about your round</p>
                                <p className="mt-1 text-sm text-tertiary">
                                    Contact {course.name} at{" "}
                                    <a href="tel:7813343151" className="font-medium text-brand-secondary hover:underline">
                                        {course.phone}
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <LifeBuoy01 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                            <div>
                                <p className="text-sm font-semibold text-primary">Help with this receipt or your account</p>
                                <p className="mt-1 text-sm text-tertiary">
                                    Reach TenFore support 24/7 —{" "}
                                    <a href="#" className="font-medium text-brand-secondary hover:underline">
                                        get support
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
};

export const Default: Story = {
    name: "Confirmation",
    render: () => <ConfirmationScreen />,
};
