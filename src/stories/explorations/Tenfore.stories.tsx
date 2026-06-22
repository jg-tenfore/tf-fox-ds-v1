import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import {
    ArrowLeft,
    Calendar,
    Check,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download01,
    Flag01,
    HelpCircle,
    InfoCircle,
    LifeBuoy01,
    Mail01,
    MarkerPin01,
    MessageChatCircle,
    Phone,
    Plus,
    ShoppingCart01,
    User01,
    Users01,
    XClose,
} from "@untitledui/icons";
import { Carousel } from "@/components/application/carousel/carousel-base";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { cx } from "@/utils/cx";
import {
    course,
    formatPrice,
    generateTeeTimes,
    rates,
    type TeeTime,
} from "@/components/booking/sagamore-data";
import { CalendarPanel, CellDropdown, COURSES, DEFAULT_DATE, dayType, fmtNice } from "./tee-search-popovers";

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
    <header className="w-full border-b border-white/10 bg-primary-solid text-white">
        {/* Utility bar */}
        <div className="flex items-center justify-between gap-4 px-6 pt-4 pb-3 text-xs text-white/70">
            <div className="flex items-center gap-3">
                <span>{course.name}</span>
                <span className="text-white/40">·</span>
                <span className="flex items-center gap-1">
                    <MarkerPin01 className="size-3.5 text-white/50" aria-hidden="true" />
                    {course.city}
                    <ChevronDown className="size-3.5 text-white/50" aria-hidden="true" />
                </span>
            </div>
            <div className="flex items-center gap-4">
                <button type="button" className="flex items-center gap-1.5 text-white/70 transition duration-100 ease-linear hover:text-white">
                    <User01 className="size-3.5" aria-hidden="true" />
                    Sign in
                </button>
                <span className="flex items-center gap-1.5 text-white">
                    <ShoppingCart01 className="size-3.5 text-white/50" aria-hidden="true" />
                    $0.00
                </span>
            </div>
        </div>

        {/* Brand + primary nav */}
        <div className="flex items-center justify-between gap-6 px-6 pt-5 pb-6">
            <div className="flex items-center gap-3">
                <SagamoreLogo className="h-11 w-auto" />
                <span className="text-lg font-semibold text-white">{course.name}</span>
            </div>
            <nav className="flex items-center gap-7 text-sm font-medium">
                {NAV_ITEMS.map((item) => (
                    <a
                        key={item}
                        href="#"
                        className={
                            item === active
                                ? "border-b-2 border-white pb-1 text-white"
                                : "pb-1 text-white/60 transition duration-100 ease-linear hover:text-white"
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

/**
 * A clickable cell in the COURSE / DATE / PLAYERS bar. Keeps the original
 * info-cell styling (uppercase label + value) but opens a June-19-style
 * dropdown popover when tapped.
 */
const DropdownCell = ({
    label,
    value,
    open,
    onToggle,
    onClose,
    align = "left",
    edge,
    children,
}: {
    label: string;
    value: string;
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    align?: "left" | "center" | "right";
    edge?: "left" | "right";
    children: React.ReactNode;
}) => (
    <div className="relative flex-1">
        <button
            type="button"
            onClick={onToggle}
            className={cx(
                "flex h-full w-full items-center justify-between gap-2 px-5 py-4 text-left transition duration-100 ease-linear",
                // Round the outer corners so the hover/open fill matches the bar's rounded edges.
                edge === "left" && "rounded-t-xl sm:rounded-t-none sm:rounded-l-xl",
                edge === "right" && "rounded-b-xl sm:rounded-b-none sm:rounded-r-xl",
                open ? "bg-secondary_hover" : "hover:bg-secondary_hover",
            )}
        >
            <span className="flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">{label}</span>
                <span className="text-sm text-secondary">{value}</span>
            </span>
            <ChevronDown className={cx("size-4 shrink-0 text-fg-quaternary transition duration-100 ease-linear", open && "rotate-180")} />
        </button>
        <CellDropdown open={open} onClose={onClose} align={align}>
            {children}
        </CellDropdown>
    </div>
);

/**
 * A single tee-sheet cell, matching the reference: large time, a holes/players
 * meta row, the per-player price + day type, and an optional "BACK 9" footer
 * banner for slots that play the back nine first.
 */
const TeeCell = ({ slot, back9, dayLabel = "Weekday" }: { slot: TeeTime; back9?: boolean; dayLabel?: string }) => {
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
                    <span className="font-semibold text-secondary tabular-nums">{formatPrice(slot.price)}.00</span> {dayLabel}
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
    const [openCell, setOpenCell] = useState<null | "course" | "date" | "players">(null);
    const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
    const [selected, setSelected] = useState<Date>(DEFAULT_DATE);
    const [rateType, setRateType] = useState<"weekday" | "weekend">("weekday");
    const [players, setPlayers] = useState(1);
    const close = () => setOpenCell(null);
    const toggle = (k: "course" | "date" | "players") => setOpenCell((p) => (p === k ? null : k));

    // Bring the Sagamore mark into the sticky bar once it's scrolled to the top (June 19 behavior).
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [stuck, setStuck] = useState(false);
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const weekend = dayType(selected) === "weekend";
    // Show the entire day's tee sheet so the sticky selector bar is visible while scrolling.
    const slots = generateTeeTimes(weekend ? "weekend" : "weekday");
    // A fixed pattern of which cells carry the "BACK 9" banner, echoing the reference.
    const back9 = new Set([5, 9, 11, 13, 16, 18, 21, 23, 27, 31, 34, 38, 41, 45]);

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Tee Times" />

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 pt-10 pb-20">
                {/* Sentinel — when it scrolls out of view, the sticky bar gains the Sagamore mark */}
                <div ref={sentinelRef} className="h-px" />
                {/* Course / Date / Players selector bar — dropdowns reuse the June 19 GUI; sticks to the top on scroll */}
                <div className="sticky top-0 z-30 mb-6 -mx-6 bg-secondary/95 px-6 pt-2 pb-2 backdrop-blur-sm">
                    {stuck && (
                        <div className="mb-2.5 flex items-center justify-center gap-2.5">
                            <SagamoreLogo className="h-7 w-auto" />
                            <span className="text-sm font-semibold text-primary">{course.name}</span>
                        </div>
                    )}
                    <div className="flex flex-col divide-y divide-secondary rounded-xl bg-primary shadow-lg ring-1 ring-secondary sm:flex-row sm:divide-x sm:divide-y-0">
                    <DropdownCell label="Course" value={selectedCourse} open={openCell === "course"} onToggle={() => toggle("course")} onClose={close} align="left" edge="left">
                        <div className="w-64">
                            <p className="mb-3 text-sm font-semibold text-primary">Course</p>
                            <RadioGroup aria-label="Course" value={selectedCourse} onChange={setSelectedCourse} className="flex flex-col gap-2.5">
                                {COURSES.map((c) => (
                                    <RadioButton key={c} value={c} label={c} />
                                ))}
                            </RadioGroup>
                        </div>
                    </DropdownCell>
                    <DropdownCell label="Date" value={fmtNice(selected)} open={openCell === "date"} onToggle={() => toggle("date")} onClose={close} align="center">
                        <CalendarPanel selected={selected} onSelect={setSelected} rateType={rateType} onRateType={setRateType} onDone={close} />
                    </DropdownCell>
                    <DropdownCell label="Players" value={`${players} ${players === 1 ? "Player" : "Players"}`} open={openCell === "players"} onToggle={() => toggle("players")} onClose={close} align="right" edge="right">
                        <div className="w-56">
                            <p className="mb-3 text-sm font-semibold text-primary">Players</p>
                            <RadioGroup aria-label="Players" value={String(players)} onChange={(v) => setPlayers(Number(v))} className="flex flex-col gap-2.5">
                                {[1, 2, 3, 4].map((n) => (
                                    <RadioButton key={n} value={String(n)} label={`${n} ${n === 1 ? "player" : "players"}`} />
                                ))}
                            </RadioGroup>
                        </div>
                    </DropdownCell>
                    </div>
                </div>

                {/* Tee-sheet grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {slots.map((slot, index) => (
                        <TeeCell key={slot.id} slot={slot} back9={back9.has(index)} dayLabel={weekend ? "Weekend" : "Weekday"} />
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

/** The player avatar — initials (or a placeholder) on a tile with the player-number badge. */
const PlayerAvatar = ({ number, initials }: { number: number; initials?: string }) => (
    <div className="relative shrink-0">
        {initials ? <Avatar size="md" initials={initials} /> : <Avatar size="md" placeholderIcon={User01} />}
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary-solid text-[10px] font-semibold text-white ring-2 ring-secondary">
            {number}
        </span>
    </div>
);

type Transport = "walking" | "cart" | "pull-cart";
const TRANSPORT_LABEL: Record<Transport, string> = { walking: "Walking", cart: "Cart", "pull-cart": "Pull cart" };

interface PlayerInfo {
    first: string;
    last: string;
    email: string;
    phone: string;
}
const ME: PlayerInfo = { first: "Justin", last: "girard", email: "hello@girardjustin.com", phone: "6174707879" };
const EMPTY_PLAYER: PlayerInfo = { first: "", last: "", email: "", phone: "" };
const initialsOf = (p: PlayerInfo) => (p.first ? `${p.first[0]}${p.last[0] ?? ""}`.toUpperCase() : undefined);

/** Common booking questions, shown as an FAQ-02 style accordion above the disclaimer. */
const FAQ_ITEMS = [
    {
        q: "How far in advance can I book a tee time?",
        a: "Tee times can be reserved up to 8 days ahead online, or 7 days ahead over the phone. Booking early gives you the best choice of prime morning and discounted twilight slots.",
    },
    {
        q: "What happens if my group has fewer than four players?",
        a: "Tee times are built for foursomes, so smaller groups may be paired with other golfers to complete the group. You're only ever charged for the players in your own booking.",
    },
    {
        q: "Can I add players to my reservation here at checkout?",
        a: "Yes. Choose the number of players in the booking panel above, then tap each player card to add their name, email, and phone. Your summary and pricing update instantly.",
    },
    {
        q: "What are my options for getting around the course?",
        a: "You can walk, ride in a shared golf cart, or bring a pull cart. Switch your selection in the Transportation menu and your green fees recalculate automatically.",
    },
    {
        q: "What is the cancellation and no-show policy?",
        a: "Changes and cancellations must be finalized at least 24 hours before your tee time. Showing up with fewer players than reserved may incur a per-player No-Show Fee.",
    },
];

const FaqAccordion = () => {
    const [open, setOpen] = useState<number | null>(0);
    return (
        <section className="rounded-xl bg-primary px-7 py-7 ring-1 ring-secondary ring-inset">
            <div className="mb-5 flex items-center gap-2">
                <HelpCircle className="size-5 text-fg-brand-primary" aria-hidden="true" />
                <h4 className="text-lg font-semibold text-primary">Common questions</h4>
            </div>
            <div className="flex flex-col divide-y divide-secondary">
                {FAQ_ITEMS.map((item, i) => {
                    const isOpen = open === i;
                    return (
                        <div key={item.q} className="py-3.5 first:pt-0 last:pb-0">
                            <button
                                type="button"
                                onClick={() => setOpen(isOpen ? null : i)}
                                aria-expanded={isOpen}
                                className="flex w-full items-start justify-between gap-4 text-left"
                            >
                                <span className="text-sm font-semibold text-primary">{item.q}</span>
                                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-fg-quaternary ring-1 ring-secondary ring-inset">
                                    <Plus className={cx("size-4 transition-transform duration-200 ease-out", isOpen && "rotate-45")} aria-hidden="true" />
                                </span>
                            </button>
                            {/* Smooth height + fade animation via a 0fr→1fr grid row */}
                            <div className={cx("grid transition-all duration-300 ease-out", isOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                                <div className="overflow-hidden">
                                    <p className="pr-10 text-sm leading-relaxed text-tertiary">{item.a}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const CheckoutScreen = () => {
    const holes = 9; // checkout doesn't switch holes

    const [players, setPlayers] = useState(1);
    const [transport, setTransport] = useState<Transport>("walking");
    const [details, setDetails] = useState<PlayerInfo[]>([ME, EMPTY_PLAYER, EMPTY_PLAYER, EMPTY_PLAYER]);

    const [openFact, setOpenFact] = useState<null | "players" | "transport">(null);
    const closeFact = () => setOpenFact(null);
    const toggleFact = (k: "players" | "transport") => setOpenFact((p) => (p === k ? null : k));

    // Player-details modal (shared style for editing the host or adding a guest).
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [draft, setDraft] = useState<PlayerInfo>(EMPTY_PLAYER);
    const openEdit = (i: number) => {
        setDraft(details[i]);
        setEditIndex(i);
    };
    const saveEdit = () => {
        if (editIndex === null) return;
        setDetails((d) => d.map((p, idx) => (idx === editIndex ? draft : p)));
        setEditIndex(null);
    };

    // Pricing — green fee is the walking base; transport is the per-player upcharge.
    const greenFee = rates[holes].weekday.walking;
    const transportFee = transport === "walking" ? 0 : transport === "cart" ? rates[holes].weekday.cart - rates[holes].weekday.walking : 7;

    // 5-minute hold countdown on the reservation.
    const [secondsLeft, setSecondsLeft] = useState(300);
    useEffect(() => {
        const t = setInterval(() => setSecondsLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
        return () => clearInterval(t);
    }, []);
    const mmss = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

    const seats = Array.from({ length: players }, (_, i) => i);

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Tee Times" />

            <main className="mx-auto w-full max-w-[1080px] flex-1 px-6 pt-10 pb-20">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    {/* Left column — header + facts + players */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-display-sm font-semibold text-primary">You're one step from the first tee</h1>
                            <p className="mt-2 text-md text-tertiary">Confirm your details to lock in your round at {course.name}.</p>
                        </div>
                        <div className="flex flex-col divide-y divide-secondary rounded-xl bg-primary ring-1 ring-secondary sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                            <DropdownCell label="Players" value={`${players} ${players === 1 ? "Player" : "Players"}`} open={openFact === "players"} onToggle={() => toggleFact("players")} onClose={closeFact} align="left" edge="left">
                                <div className="w-56">
                                    <p className="mb-3 text-sm font-semibold text-primary">Players</p>
                                    <RadioGroup aria-label="Players" value={String(players)} onChange={(v) => setPlayers(Number(v))} className="flex flex-col gap-2.5">
                                        {[1, 2, 3, 4].map((n) => (
                                            <RadioButton key={n} value={String(n)} label={`${n} ${n === 1 ? "player" : "players"}`} />
                                        ))}
                                    </RadioGroup>
                                </div>
                            </DropdownCell>
                            <CheckoutFact label="Holes" value={String(holes)} />
                            <DropdownCell label="Transportation" value={TRANSPORT_LABEL[transport]} open={openFact === "transport"} onToggle={() => toggleFact("transport")} onClose={closeFact} align="right" edge="right">
                                <div className="w-56">
                                    <p className="mb-3 text-sm font-semibold text-primary">Getting around</p>
                                    <RadioGroup aria-label="Transportation" value={transport} onChange={(v) => setTransport(v as Transport)} className="flex flex-col gap-2.5">
                                        <RadioButton value="walking" label="Walking" />
                                        <RadioButton value="cart" label="Cart" />
                                        <RadioButton value="pull-cart" label="Pull cart" />
                                    </RadioGroup>
                                </div>
                            </DropdownCell>
                        </div>

                        {/* Player cards — host + any added guests */}
                        {seats.map((i) => {
                            const p = details[i];
                            const filled = p.first.length > 0;
                            const isMe = i === 0;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => openEdit(i)}
                                    className="group flex items-center justify-between gap-4 rounded-xl bg-primary px-4 py-4 text-left ring-1 ring-secondary ring-inset transition duration-100 ease-linear hover:ring-brand"
                                >
                                    <div className="flex items-center gap-3">
                                        <PlayerAvatar number={i + 1} initials={initialsOf(p)} />
                                        <div className="flex flex-col">
                                            <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                                                {filled ? `${p.first} ${p.last}` : `Player ${i + 1}`}
                                                {isMe && <span className="rounded-full bg-tertiary px-2 py-0.5 text-[10px] font-medium text-secondary">You</span>}
                                            </span>
                                            <span className="text-xs text-tertiary">{filled ? p.email : "Tap to add player details"}</span>
                                        </div>
                                    </div>
                                    {filled ? (
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="flex items-center gap-1 text-sm font-medium text-success-primary">
                                                <Check className="size-4" aria-hidden="true" /> {isMe ? "Confirmed" : "Added"}
                                            </span>
                                            <span className="text-xs text-tertiary">Tap to edit</span>
                                        </div>
                                    ) : (
                                        // Styled exactly like a UUI secondary button (span avoids a nested button inside the card).
                                        <span className="flex shrink-0 items-center rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-secondary shadow-xs-skeuomorphic ring-1 ring-primary ring-inset transition duration-100 ease-linear group-hover:bg-primary_hover">
                                            Edit Info
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                        {/* Common questions — FAQ accordion above the disclaimer */}
                        <FaqAccordion />

                        {/* Disclaimer — kept within the left column, under the player */}
                        <section className="rounded-xl bg-primary px-7 py-7 ring-1 ring-secondary ring-inset">
                            <div className="mb-5 flex items-center gap-2">
                                <InfoCircle className="size-5 text-fg-brand-primary" aria-hidden="true" />
                                <h4 className="text-lg font-semibold text-primary">Disclaimer</h4>
                            </div>
                            <div className="flex flex-col gap-3 text-xs leading-relaxed text-tertiary">
                                <div>
                                    <p className="font-semibold">Important Tee Time Notes:</p>
                                    <p>
                                        Tee times may be reserved up to 8 days in advance online or 7 days in advance over the phone. Please understand that tee
                                        times are intended for four players. This means you will likely be paired up with other players if your booking is for fewer
                                        than four (4) golfers. During periods of heavy rain or in the early spring/late fall, we encourage folks to either call ahead
                                        or check our website to confirm golf car availability/restrictions. On colder mornings, be prepared for possible Frost Delays
                                        in the early spring and late fall. Questions? Call us at {course.phone}.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">Weekends &amp; Holidays:</p>
                                    <p>
                                        18-hole play is required until 1:00 pm on weekends &amp; holidays (Exception: Early Bird 9-hole play off our back 9 during the
                                        first hour of every morning). 9-hole play AND Junior Rates are offered after 1:00 pm on weekends/holidays — Juniors may
                                        certainly play before 1 pm on weekends/holidays, but they will be charged the Standard 18-hole rate.
                                    </p>
                                    <p className="mt-1">
                                        <span className="font-semibold">Group Reservations (9 or more players)</span> may be booked in advance. To inquire about larger
                                        group bookings, please get in touch with Austin at {course.phone} x113.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">Changes/Cancellations:</p>
                                    <p>All tee time changes or cancellations must be finalized no later than 24 hours before your tee time.</p>
                                    <p className="mt-1">
                                        <span className="font-semibold">No-Show!</span> If you show up with fewer players than you had reserved, your credit card will
                                        be charged a No-Show Fee for each individual no-show (see our No-Show Policy).
                                    </p>
                                </div>
                            </div>
                        </section>
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
                                    <SummaryDetail icon={Users01}>{`${players} ${players === 1 ? "Player" : "Players"} · ${holes} Holes`}</SummaryDetail>
                                </div>
                            </div>

                            {/* Green fees */}
                            <div className="flex flex-col gap-3 border-b border-secondary px-5 py-4">
                                <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Green Fees</p>
                                {seats.map((i) => {
                                    const p = details[i];
                                    const name = p.first ? `${p.first} ${p.last}` : `Player ${i + 1}`;
                                    return (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <span className="text-secondary">
                                                {name} <span className="text-tertiary">(Weekday)</span>
                                            </span>
                                            <span className="tabular-nums text-primary">{formatPrice(greenFee)}.00</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Transportation */}
                            <div className="flex flex-col gap-2 border-b border-secondary px-5 py-4">
                                <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Transportation</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-secondary">{TRANSPORT_LABEL[transport]}</span>
                                    <span className="tabular-nums text-tertiary">
                                        {formatPrice(transportFee)}.00 × {players}
                                    </span>
                                </div>
                            </div>

                            <p className="px-5 py-3 text-xs text-tertiary">
                                Final pricing including taxes and fees will be calculated at checkout.
                            </p>
                        </section>

                        {/* Reservation hold countdown */}
                        <div className="rounded-xl bg-utility-blue-50 px-5 py-4 ring-1 ring-utility-blue-200 ring-inset">
                            <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-2 text-sm font-semibold text-utility-blue-700">
                                    <Clock className="size-4" aria-hidden="true" /> Time left to book
                                </span>
                                <span className="text-xl font-semibold tabular-nums text-utility-blue-700">{mmss}</span>
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-utility-blue-600">
                                This tee time is held exclusively for you while you complete checkout. If you leave before confirming, the hold is released and
                                this slot returns to the live tee sheet for other golfers to book.
                            </p>
                        </div>

                        <Button color="primary" size="lg" iconLeading={Flag01} className="w-full">
                            Reserve
                        </Button>
                    </aside>
                </div>
            </main>

            {/* Player edit modal */}
            {editIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/50 p-4 backdrop-blur-[2px]" onClick={() => setEditIndex(null)}>
                    <div onClick={(event) => event.stopPropagation()} className="w-full max-w-xl overflow-hidden rounded-2xl bg-primary shadow-xl ring-1 ring-secondary">
                        <header className="flex items-center justify-between border-b border-secondary px-6 py-4">
                            <h2 className="text-lg font-semibold text-primary">Player {editIndex + 1} Information</h2>
                            <button type="button" aria-label="Close" onClick={() => setEditIndex(null)} className="flex size-8 items-center justify-center rounded-md text-fg-quaternary transition duration-100 ease-linear hover:bg-secondary_hover">
                                <XClose className="size-5" />
                            </button>
                        </header>

                        <div className="flex flex-col gap-4 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <PlayerAvatar number={editIndex + 1} initials={initialsOf(draft)} />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-primary">Player {editIndex + 1}</span>
                                    <span className="text-xs text-tertiary">Add this golfer's details so we can check them in on arrival.</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Input label="First name" placeholder="e.g. John" value={draft.first} onChange={(v) => setDraft((d) => ({ ...d, first: v }))} />
                                <Input label="Last name" placeholder="e.g. Doe" value={draft.last} onChange={(v) => setDraft((d) => ({ ...d, last: v }))} />
                            </div>
                            <Input label="Email" type="email" placeholder="e.g. john.doe@example.com" value={draft.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} />
                            <Input label="Phone number" type="tel" placeholder="e.g. (617) 555-0199" value={draft.phone} onChange={(v) => setDraft((d) => ({ ...d, phone: v }))} />
                        </div>

                        <footer className="flex items-center justify-end gap-3 border-t border-secondary px-6 py-4">
                            <Button color="secondary" onClick={() => setEditIndex(null)}>
                                Cancel
                            </Button>
                            <Button color="primary" onClick={saveEdit}>
                                Save Player
                            </Button>
                        </footer>
                    </div>
                </div>
            )}

            <SiteFooter />
        </div>
    );
};

/** The per-player checkout — a faithful recreation of Tenfore's checkout screen. */
export const Checkout: Story = {
    render: () => <CheckoutScreen />,
};

/* ------------------------------------------------------------------ */
/* Confirmation                                                        */
/* ------------------------------------------------------------------ */

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

/** The booking confirmation — a centered receipt-style page for a completed reservation. */
export const Confirmation: Story = {
    render: () => <ConfirmationScreen />,
};
