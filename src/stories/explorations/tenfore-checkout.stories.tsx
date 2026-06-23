import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";
import { Calendar, Check, Clock, Flag01, HelpCircle, InfoCircle, MarkerPin01, Plus, Users01, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { course, formatPrice, rates } from "@/components/booking/sagamore-data";
import { cx } from "@/utils/cx";
import { DropdownCell, PlayerAvatar, SiteFooter, TopNav } from "./tenfore-chrome";

/**
 * "Tenfore Fox / Checkout" — the per-player checkout, a faithful recreation of
 * Tenfore's checkout screen: editable players + transportation, a live booking
 * summary, a hold countdown, and a common-questions accordion.
 */
const meta: Meta = {
    title: "Tenfore Fox/Checkout",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/** A box in the PLAYERS / HOLES / TRANSPORTATION header row. */
const CheckoutFact = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-1 flex-col gap-1 px-5 py-4">
        <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">{label}</span>
        <span className="text-sm text-secondary">{value}</span>
    </div>
);

const SummaryDetail = ({ icon: Icon, children }: { icon: typeof Calendar; children: string }) => (
    <span className="flex items-center gap-1.5 text-xs text-secondary">
        <Icon className="size-3.5 shrink-0 text-fg-quaternary" aria-hidden="true" />
        {children}
    </span>
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

export const Default: Story = {
    name: "Checkout",
    render: () => <CheckoutScreen />,
};
