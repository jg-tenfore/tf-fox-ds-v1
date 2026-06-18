import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { FC, ReactNode } from "react";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Flag01,
    InfoCircle,
    MarkerPin02,
    Phone,
    SearchLg,
    Star01,
    Tag01,
    Umbrella03,
    User01,
    Users01,
} from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { PlayerStepper } from "@/components/booking/player-stepper";
import {
    course,
    formatPrice,
    generateTeeTimes,
    type TeeTime,
} from "@/components/booking/sagamore-data";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";

/**
 * GolfNow-faithful exploration of the Sagamore Spring tee-time experience.
 * Reproduces the marketplace's search-results + checkout GUI — header, filter
 * rail, dark tee-time cards with Hot Deal badges, and the players/checkout
 * screen — using real Sagamore data and golf edge cases (spots left, 9 vs 18,
 * walking vs riding, twilight pricing, last-minute discounts, ratings).
 */
const meta = {
    title: "Explorations/GolfNow",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Brand + helpers                                                            */
/* -------------------------------------------------------------------------- */

const photos = sagamoreImagesByCategory("photography");
const heroPhoto = photos[0]?.src ?? "";

const courseRating = 4.3;
const reviewCount = 187;
const distanceMiles = 12.4;

/** Build the day's tee sheet, decorate slots with golf edge cases. */
interface DecoratedSlot extends TeeTime {
    holes: 9 | 18;
    ride: "walking" | "cart";
    cartIncluded: boolean;
    isHotDeal: boolean;
    /** Original (pre-discount) price when a Hot Deal. */
    wasPrice?: number;
}

const decorate = (slots: TeeTime[]): DecoratedSlot[] =>
    slots.map((slot, i) => {
        const isTwilight = slot.timeOfDay === "twilight";
        // Last-minute / hot deals: a fixed pattern of discounted slots.
        const isHotDeal = i % 6 === 2 || (isTwilight && i % 3 === 0);
        const holes: 9 | 18 = isTwilight && i % 2 === 0 ? 9 : 18;
        const cartIncluded = isTwilight || i % 4 !== 1;
        const wasPrice = isHotDeal ? slot.price + (isTwilight ? 8 : 14) : undefined;
        return {
            ...slot,
            holes,
            ride: cartIncluded ? "cart" : "walking",
            cartIncluded,
            isHotDeal,
            wasPrice,
        };
    });

const morning = decorate(generateTeeTimes("weekday").filter((s) => s.timeOfDay === "morning" && s.spotsAvailable > 0)).slice(0, 6);
const midday = decorate(generateTeeTimes("weekday").filter((s) => s.timeOfDay === "midday" && s.spotsAvailable > 0)).slice(0, 12);
const twilight = decorate(generateTeeTimes("weekday").filter((s) => s.timeOfDay === "twilight" && s.spotsAvailable > 0)).slice(0, 6);

const hotDealCount = [...morning, ...midday, ...twilight].filter((s) => s.isHotDeal).length;

/* -------------------------------------------------------------------------- */
/* Header / top nav                                                           */
/* -------------------------------------------------------------------------- */

const TopBar = () => (
    <header className="bg-primary">
        {/* Channel strip */}
        <div className="border-b border-secondary bg-secondary">
            <div className="mx-auto flex h-7 max-w-[1200px] items-center gap-5 px-4 text-xs font-medium tracking-wide text-tertiary uppercase">
                <span>Sagamore TV</span>
                <span>Pro Shop</span>
                <span>On Course</span>
            </div>
        </div>
        {/* Main nav */}
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-4">
            <SagamoreLogo className="h-9 w-auto" />
            <nav className="hidden items-center gap-5 text-sm font-semibold text-secondary md:flex">
                <a className="font-bold text-brand-secondary">Hot Deals</a>
                <a>Courses Near Me</a>
                <a>Destinations</a>
                <a>Best Courses</a>
                <a>Rewards &amp; Credits</a>
                <a>Gift Cards</a>
            </nav>
            <div className="ml-auto flex items-center gap-3">
                <Avatar size="sm" initials="JG" />
                <div className="hidden text-right leading-tight sm:block">
                    <p className="text-xs text-tertiary">Hi, Justin</p>
                    <p className="text-xs font-bold text-brand-secondary">Rewards: 1,240</p>
                </div>
            </div>
        </div>
    </header>
);

/** The search bar + "Hot Deals Near Me" pill row from GolfNow. */
const SearchRow = () => (
    <div className="border-b border-secondary bg-secondary">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-3 px-4 py-3">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-primary px-2 py-1 shadow-xs ring-1 ring-secondary">
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-secondary">
                    <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
                    Thu, Jun 18
                </div>
                <span className="h-5 w-px bg-border-secondary" />
                <div className="flex flex-1 items-center gap-1.5 px-3 py-1.5 text-sm text-secondary">
                    <MarkerPin02 className="size-4 text-fg-quaternary" aria-hidden="true" />
                    {course.name} — Lynnfield, MA
                </div>
                <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-full bg-brand-solid px-5 py-2 text-sm font-semibold text-white hover:bg-brand-solid_hover"
                >
                    <SearchLg className="size-4" aria-hidden="true" />
                    Search
                </button>
            </div>
            <button
                type="button"
                className="flex items-center gap-1.5 rounded-full bg-brand-solid px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-solid_hover"
            >
                <Tag01 className="size-4" aria-hidden="true" />
                Hot Deals Near Me
            </button>
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/* Left rail — course card                                                    */
/* -------------------------------------------------------------------------- */

const Stars = ({ value, className }: { value: number; className?: string }) => (
    <span className={`flex items-center gap-0.5 ${className ?? ""}`} aria-label={`${value} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => {
            const filled = i + 1 <= Math.round(value);
            return <Star01 key={i} className={`size-3.5 ${filled ? "fill-current text-warning-primary" : "text-quaternary"}`} aria-hidden="true" />;
        })}
    </span>
);

const CourseRail = () => (
    <aside className="w-full shrink-0 lg:w-[300px]">
        <div className="overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
            <div className="relative">
                <img src={heroPhoto} alt={course.name} className="h-44 w-full object-cover" />
                <span className="absolute top-3 left-3 rounded bg-primary-solid px-2 py-1 text-xs font-semibold text-white">Sagamore Spring</span>
                <button type="button" className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-primary p-1 shadow ring-1 ring-secondary">
                    <ChevronLeft className="size-4 text-fg-secondary" aria-hidden="true" />
                </button>
                <button type="button" className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-primary p-1 shadow ring-1 ring-secondary">
                    <ChevronRight className="size-4 text-fg-secondary" aria-hidden="true" />
                </button>
            </div>

            <div className="space-y-3 p-4">
                <div>
                    <h2 className="text-lg leading-snug font-bold text-primary">{course.name}</h2>
                    <p className="text-sm text-tertiary">{course.address}</p>
                </div>

                <div className="flex items-center gap-2">
                    <Stars value={courseRating} />
                    <span className="text-xs font-semibold text-secondary tabular-nums">{courseRating.toFixed(1)}</span>
                    <a className="text-xs font-semibold text-brand-secondary underline">{reviewCount} Reviews</a>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary">
                    <span className="flex items-center gap-1">
                        <Flag01 className="size-3.5 text-fg-quaternary" aria-hidden="true" /> Holes {course.holes} · Par {course.par}
                    </span>
                    <span className="flex items-center gap-1">
                        <MarkerPin02 className="size-3.5 text-fg-quaternary" aria-hidden="true" /> {distanceMiles} mi away
                    </span>
                    <span>Length {course.yards.toLocaleString()} yds</span>
                </div>

                <p className="text-sm leading-relaxed text-tertiary">
                    Sagamore Spring Golf Club is a classic New England public course established in {course.established}. Tree-lined fairways and
                    true-rolling greens make it a local favorite for walkers and riders alike.
                </p>

                <div className="flex items-center gap-3 border-t border-secondary pt-3 text-xs font-semibold text-brand-secondary">
                    <a className="underline">Read More…</a>
                    <a className="underline">Directions</a>
                    <a className="underline">Details</a>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-secondary p-3 text-xs text-tertiary">
                    <Umbrella03 className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    <p>
                        <span className="font-semibold text-secondary">Free cancellation</span> up to 24 hrs before tee time. Rain check guaranteed for
                        weather closures.
                    </p>
                </div>

                <div className="flex items-center gap-2 border-t border-secondary pt-3 text-xs text-tertiary">
                    <Phone className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                    {course.phone}
                </div>
            </div>
        </div>
    </aside>
);

/* -------------------------------------------------------------------------- */
/* Filter bar (the pill tabs that open dropdowns on GolfNow)                  */
/* -------------------------------------------------------------------------- */

const FilterPill = ({ icon: Icon, label, active }: { icon: FC<{ className?: string }>; label: string; active?: boolean }) => (
    <button
        type="button"
        className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
            active ? "border-transparent bg-brand-solid text-white hover:bg-brand-solid_hover" : "border-secondary bg-primary text-secondary hover:bg-secondary_hover"
        }`}
    >
        <Icon className="size-4" aria-hidden="true" />
        {label}
    </button>
);

const FilterBar = () => (
    <div className="mb-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-lg text-primary">
                <span className="font-normal text-tertiary">Showing Tee Times for: </span>
                <span className="font-bold">{course.name}</span>
                <span className="font-normal text-tertiary"> on Thu, Jun 18</span>
            </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-primary px-2 py-1 ring-1 ring-secondary">
                <button type="button" className="rounded-full p-1.5 hover:bg-secondary_hover">
                    <ChevronLeft className="size-4 text-fg-quaternary" aria-hidden="true" />
                </button>
                <span className="flex items-center gap-1.5 px-2 text-sm font-semibold text-secondary">
                    <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" /> Thu, Jun 18
                </span>
                <button type="button" className="rounded-full p-1.5 hover:bg-secondary_hover">
                    <ChevronRight className="size-4 text-fg-quaternary" aria-hidden="true" />
                </button>
            </div>

            <FilterPill icon={Tag01} label="Off" active />
            <FilterPill icon={Calendar} label="Time" />
            <FilterPill icon={Tag01} label="Price" />
            <FilterPill icon={Users01} label="Golfers" />
            <FilterPill icon={Flag01} label="Holes" />
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-tertiary">
            <InfoCircle className="size-3.5 text-fg-quaternary" aria-hidden="true" />
            Convenience fee details · {hotDealCount} Hot Deals available today
        </p>
    </div>
);

/* -------------------------------------------------------------------------- */
/* Tee-time card (the dark GolfNow result card)                              */
/* -------------------------------------------------------------------------- */

const TeeCard = ({ slot }: { slot: DecoratedSlot }) => {
    const [time, period] = slot.label.split(" ");
    return (
        <button
            type="button"
            className="group relative flex flex-col overflow-hidden rounded-lg text-left shadow-sm ring-1 ring-secondary transition hover:shadow-md"
        >
            {/* Header band */}
            <div className="relative flex items-baseline gap-1 bg-primary-solid px-3 py-2 text-white">
                <span className="text-lg font-bold tabular-nums">{time}</span>
                <span className="text-xs font-semibold">{period}</span>
                {slot.isHotDeal && (
                    <span className="absolute top-1.5 right-1.5">
                        <Badge color="brand" size="sm" type="pill-color">
                            Hot Deal
                        </Badge>
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-1.5 bg-secondary px-3 py-2.5">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold tabular-nums text-primary">{formatPrice(slot.price)}</span>
                    {slot.wasPrice && <span className="text-xs text-tertiary line-through tabular-nums">{formatPrice(slot.wasPrice)}</span>}
                </div>

                <p className="text-xs font-medium text-tertiary">
                    Prepaid · {slot.holes} Holes · {slot.cartIncluded ? "Cart incl." : "Walking"}
                </p>

                <div className="flex items-center gap-3 text-xs text-tertiary">
                    <span className="flex items-center gap-1">
                        <Flag01 className="size-3 text-fg-quaternary" aria-hidden="true" /> {slot.holes}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users01 className="size-3 text-fg-quaternary" aria-hidden="true" /> 1–{slot.spotsAvailable}
                    </span>
                    {slot.timeOfDay === "twilight" && (
                        <Badge color="gray" size="sm" type="pill-color">
                            Twilight
                        </Badge>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-secondary pt-1.5">
                    <span className="text-xs text-quaternary">+ {formatPrice(2.49)} fee</span>
                    <span className={`text-xs font-bold ${slot.spotsAvailable <= 1 ? "text-warning-primary" : "text-tertiary"}`}>
                        {slot.spotsAvailable === 1 ? "1 left" : `${slot.spotsAvailable} left`}
                    </span>
                </div>
            </div>
        </button>
    );
};

const TeeGroup = ({ title, slots }: { title: string; slots: DecoratedSlot[] }) => (
    <section className="mb-6">
        <h3 className="mb-2 text-sm font-bold text-primary">
            {title} <span className="font-normal text-tertiary">· {slots.length} times</span>
        </h3>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {slots.map((slot) => (
                <TeeCard key={slot.id} slot={slot} />
            ))}
        </div>
    </section>
);

/* -------------------------------------------------------------------------- */
/* STORY: Search Results                                                       */
/* -------------------------------------------------------------------------- */

export const SearchResults: Story = {
    render: () => (
        <div className="min-h-screen bg-secondary text-primary">
            <TopBar />
            <SearchRow />
            <div className="mx-auto max-w-[1200px] px-4 py-5">
                <div className="flex flex-col gap-5 lg:flex-row">
                    <CourseRail />
                    <main className="min-w-0 flex-1">
                        <FilterBar />
                        <TeeGroup title="Morning Tee Times" slots={morning} />
                        <TeeGroup title="Midday Tee Times" slots={midday} />
                        <TeeGroup title="Twilight Tee Times" slots={twilight} />
                    </main>
                </div>
            </div>
        </div>
    ),
};

/* -------------------------------------------------------------------------- */
/* STORY: Checkout (players / book screen)                                     */
/* -------------------------------------------------------------------------- */

const selected = midday.find((s) => s.isHotDeal) ?? midday[3];

const SummaryRow = ({ label, amount, accent, strong, info }: { label: string; amount: string; accent?: boolean; strong?: boolean; info?: boolean }) => (
    <div className="flex items-center justify-between gap-4 py-1 text-sm">
        <span className={`flex items-center gap-1 ${strong ? "font-bold text-primary" : "text-secondary"}`}>
            {info && <InfoCircle className="size-3.5 text-fg-quaternary" aria-hidden="true" />}
            {label}
        </span>
        <span className={`tabular-nums ${accent ? "font-bold text-brand-secondary" : strong ? "font-bold text-primary" : "text-primary"}`}>{amount}</span>
    </div>
);

const Pill = ({ children }: { children: ReactNode }) => (
    <span className="rounded-full border border-secondary bg-primary px-3 py-1 text-xs font-semibold text-secondary">{children}</span>
);

export const Checkout: Story = {
    render: () => {
        const greenFees = selected.price;
        const fee = 2.49;
        const taxes = 0;
        const discount = selected.wasPrice ? selected.wasPrice - selected.price : 0;
        const total = greenFees + fee + taxes;

        return (
            <div className="min-h-screen bg-secondary text-primary">
                <TopBar />

                <div className="mx-auto max-w-[1100px] px-4 py-6">
                    {/* Course hero + booking panel */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                        {/* Left: course info */}
                        <div className="space-y-5">
                            <div className="relative overflow-hidden rounded-xl ring-1 ring-secondary">
                                <img src={heroPhoto} alt={course.name} className="h-72 w-full object-cover" />
                                <span className="absolute top-3 left-3 rounded bg-primary-solid px-2 py-1 text-xs font-semibold text-white">
                                    Sagamore Spring
                                </span>
                            </div>

                            <div className="flex gap-5 border-b border-secondary text-sm font-semibold">
                                <a className="border-b-2 border-brand pb-2 text-brand-secondary">Info</a>
                                <a className="pb-2 text-tertiary">Location</a>
                                <a className="pb-2 text-tertiary">Notes &amp; Policies</a>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-primary">{course.name}</h1>
                                <p className="text-sm text-tertiary">{course.address}</p>
                                <div className="mt-1.5 flex items-center gap-2">
                                    <Stars value={courseRating} />
                                    <a className="text-xs font-semibold text-brand-secondary underline">{reviewCount} Reviews</a>
                                </div>
                            </div>

                            <p className="text-sm leading-relaxed text-tertiary">
                                Established in {course.established}, Sagamore Spring Golf Club is a well-regarded public 18 perfect for golfers of every
                                level. Walk or ride tree-lined fairways with greens that run true to form.
                            </p>

                            {/* Tee details table */}
                            <div>
                                <h2 className="mb-2 text-sm font-bold text-primary">Tee Details</h2>
                                <div className="overflow-hidden rounded-lg ring-1 ring-secondary">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-primary-solid text-left text-white">
                                                <th className="px-4 py-2 font-semibold">Tee</th>
                                                <th className="px-4 py-2 font-semibold">Par</th>
                                                <th className="px-4 py-2 font-semibold">Length</th>
                                                <th className="px-4 py-2 font-semibold">Rating</th>
                                                <th className="px-4 py-2 font-semibold">Slope</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-primary">
                                            <tr className="border-b border-secondary">
                                                <td className="px-4 py-2 text-secondary">Blue (18-hole)</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">70</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">5,936 yards</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">68.4</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">119</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 text-secondary">White (18-hole)</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">70</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">5,512 yards</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">66.9</td>
                                                <td className="px-4 py-2 tabular-nums text-secondary">114</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right: booking panel */}
                        <aside className="space-y-4">
                            <div className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary">
                                <div className="grid grid-cols-3 gap-2 border-b border-secondary p-4 text-sm">
                                    <div>
                                        <p className="text-xs text-tertiary">Date</p>
                                        <p className="font-semibold text-primary">Thu, Jun 18</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-tertiary">Time</p>
                                        <p className="font-semibold text-primary">{selected.label}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-tertiary">Holes</p>
                                        <p className="font-semibold text-primary">{selected.holes}</p>
                                    </div>
                                    <div className="col-span-3 mt-1 flex flex-wrap items-center gap-2">
                                        <Pill>Prepaid · {selected.holes} Holes</Pill>
                                        <Pill>{selected.cartIncluded ? "Riding cart" : "Walking"}</Pill>
                                        {selected.timeOfDay === "twilight" && <Pill>Twilight</Pill>}
                                        {selected.isHotDeal && (
                                            <Badge color="brand" size="md" type="pill-color">
                                                Hot Deal
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Rewards banner */}
                                <div className="flex items-center justify-between gap-3 bg-brand-solid px-4 py-3">
                                    <div className="text-white">
                                        <p className="text-sm font-bold">Sagamore Rewards</p>
                                        <p className="text-xs text-primary_on-brand">+ 56 to be earned on this tee time</p>
                                    </div>
                                    <span className="text-lg font-bold text-white">+ 56</span>
                                </div>

                                <div className="space-y-4 p-4">
                                    <p className="text-lg font-bold text-primary tabular-nums">
                                        {formatPrice(greenFees)} <span className="text-sm font-normal text-tertiary">/ golfer</span>
                                    </p>

                                    <div>
                                        <p className="mb-2 text-sm font-semibold text-secondary">Number of Golfers</p>
                                        <PlayerStepper defaultValue={1} max={selected.spotsAvailable} />
                                        <p className="mt-1.5 flex items-center gap-1 text-xs text-warning-primary">
                                            <InfoCircle className="size-3.5" aria-hidden="true" />
                                            {selected.spotsAvailable === 1 ? "Only 1 spot left" : `${selected.spotsAvailable} spots left`} on this slot
                                        </p>
                                    </div>

                                    <div className="border-t border-secondary pt-3">
                                        <SummaryRow label={`Green Fees (1 Golfer x ${formatPrice(greenFees)})`} amount={formatPrice(greenFees)} />
                                        <SummaryRow label="Convenience Fee" amount={formatPrice(fee)} info />
                                        <SummaryRow label="Estimated Taxes" amount={formatPrice(taxes)} />
                                        {discount > 0 && <SummaryRow label="Hot Deal Discount" amount={`-${formatPrice(discount)}`} accent info />}
                                        <div className="mt-1 border-t border-secondary pt-2">
                                            <SummaryRow label="Total" amount={formatPrice(total)} strong />
                                        </div>
                                    </div>

                                    <Button size="lg" className="w-full justify-center">
                                        Continue to Book
                                    </Button>

                                    <p className="flex items-start gap-1.5 text-xs text-tertiary">
                                        <Umbrella03 className="mt-0.5 size-3.5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                        Free cancellation up to 24 hrs before tee time. Weather rain checks honored.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Secure checkout block (lower section of the GolfNow checkout) */}
                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
                        <div className="space-y-5 rounded-xl bg-primary p-5 ring-1 ring-secondary">
                            <div>
                                <h2 className="text-sm font-bold text-primary">Secure Checkout</h2>
                                <p className="mt-1 text-md font-semibold text-primary">{course.name}</p>
                                <p className="text-sm text-tertiary">Prepaid · {selected.holes} Holes</p>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-secondary">
                                    <span>Thu, Jun 18 · {selected.label}</span>
                                    <Pill>{selected.cartIncluded ? "Riding cart" : "Walking"}</Pill>
                                    <Pill>{selected.holes} Holes</Pill>
                                    <span className="flex items-center gap-1">
                                        <Users01 className="size-3.5 text-fg-quaternary" aria-hidden="true" /> 1 golfer
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 text-sm font-bold text-primary">Payment Options</h3>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <Input label="Billing Name" placeholder="Justin Girard" isRequired />
                                    <Input label="Billing Address" placeholder="33 Rich St" isRequired />
                                    <Input label="City / State" placeholder="Lynnfield, MA" isRequired />
                                    <Input label="Postal Code" placeholder="01940" isRequired />
                                    <Input label="Card Number" icon={User01} placeholder="•••• •••• •••• 1009" isRequired />
                                    <Input label="Phone Number" placeholder="(617) 470-7879" />
                                </div>
                                <label className="mt-3 flex items-center gap-2">
                                    <Checkbox /> <span className="text-sm text-secondary">Save billing address to my account profile</span>
                                </label>
                            </div>

                            <div className="border-t border-secondary pt-4">
                                <h3 className="mb-2 text-sm font-bold text-primary">Stay Connected</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <Checkbox /> <span className="text-sm text-tertiary">Send me offers and news from Sagamore Spring by email</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <Checkbox /> <span className="text-sm text-tertiary">Send me a text reminder about my reservation</span>
                                    </label>
                                </div>
                            </div>

                            <div className="border-t border-secondary pt-4 text-sm font-semibold text-brand-secondary">
                                <a className="mr-4 underline">Add a promo code or credit</a>
                                <a className="underline">Add a gift card</a>
                            </div>
                        </div>

                        {/* Summary sidebar */}
                        <aside className="space-y-4">
                            <div className="rounded-xl bg-primary p-5 ring-1 ring-secondary">
                                <h3 className="mb-3 text-sm font-bold text-primary">Summary</h3>
                                <SummaryRow label={`Green Fees (1 Golfer x ${formatPrice(greenFees)})`} amount={formatPrice(greenFees)} />
                                <SummaryRow label="Convenience Fee" amount={formatPrice(fee)} info />
                                <SummaryRow label="Estimated Taxes" amount={formatPrice(taxes)} />
                                {discount > 0 && <SummaryRow label="Total Discounts" amount={`-${formatPrice(discount)}`} accent info />}
                                <div className="mt-2 space-y-1 border-t border-secondary pt-2">
                                    <SummaryRow label="Total" amount={formatPrice(total)} strong />
                                    <SummaryRow label="Due at Course" amount={formatPrice(0)} />
                                    <SummaryRow label="Total Due Now" amount={formatPrice(total)} accent />
                                </div>
                                <p className="mt-3 flex items-start gap-1.5 text-xs text-tertiary">
                                    <InfoCircle className="mt-0.5 size-3.5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                    This tee time requires advance payment through Sagamore Spring.
                                </p>
                            </div>

                            <label className="flex items-start gap-2 rounded-xl bg-primary p-4 ring-1 ring-secondary">
                                <Checkbox />
                                <span className="text-xs text-tertiary">
                                    By checking the box and clicking below, I agree to the <span className="font-semibold text-brand-secondary">Terms of Use</span>,{" "}
                                    <span className="font-semibold text-brand-secondary">Privacy Policy</span>, and{" "}
                                    <span className="font-semibold text-brand-secondary">Cancellation &amp; Weather Policy</span>.
                                </span>
                            </label>

                            <Button size="lg" className="w-full justify-center">
                                Make Your Reservation — {formatPrice(total)}
                            </Button>
                        </aside>
                    </div>
                </div>
            </div>
        );
    },
};
