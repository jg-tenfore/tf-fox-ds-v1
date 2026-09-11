"use client";

/**
 * `/tee-times/checkout` — per-player checkout for a county tee time.
 *
 * Modelled on the Tenfore Tee Time Details screen (editable player cards, a facts bar,
 * an order-summary rail, a hold countdown) with the two things a county system adds:
 *
 *  - **The resident card sits at the top of the form.** It is the largest single change
 *    to the bill, so it is a switch above the players rather than a promo code below them.
 *  - **Every golfer is priced separately.** Adult, senior and junior rates are per person
 *    in the same foursome — which is normal on a muni and impossible to express with a
 *    single group price — so the rate class lives on each player card and each line of
 *    the summary shows what that golfer is paying and why.
 *
 * Confirming writes the round into the prototype session (`addActivity` + `checkout`) and
 * hands the receipt to the confirmation screen.
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Check, Clock, CreditCard01, Flag01, InfoCircle, MarkerPin01, Users01, XClose } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Toggle } from "@/components/base/toggle/toggle";
import { MetaLine, MicroLabel, SectionTitle, StepRail, SummaryLine } from "@/components/instruction/instruction-ui";
import { McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import { newId, useSession } from "@/components/mcg/session";
import {
    BOOKING_FEE,
    DEFAULT_SELECTION,
    RATE_CLASS_LABEL,
    TRANSPORT_HINT,
    TRANSPORT_LABEL,
    TRANSPORT_ORDER,
    calendarUrl,
    courseInfo,
    greenFee,
    money,
    newConfirmation,
    readSelection,
    transportFee,
    writeReceipt,
    type RateClass,
    type ReceiptLine,
    type TeeSelection,
    type Transport,
} from "@/components/mcg/tee-times-data";
import { DropdownCell } from "@/stories/explorations/tenfore-chrome";
import { asset } from "@/utils/asset";
import { cx } from "@/utils/cx";

/** Progress across the three tee-time screens. */
export const TEE_RAIL = ["Tee sheet", "Players & payment", "Confirmed"];

/** The reservation is held for five minutes while the group is filled in. */
const HOLD_SECONDS = 300;

interface PlayerInfo {
    first: string;
    last: string;
    email: string;
    phone: string;
    rateClass: RateClass;
}

const EMPTY_PLAYER: PlayerInfo = { first: "", last: "", email: "", phone: "", rateClass: "adult" };

/** Regulars the prototype can drop into a foursome without typing four addresses. */
const SAMPLE_GUESTS: PlayerInfo[] = [
    { first: "Dana", last: "Whitfield", email: "dana.whitfield@example.com", phone: "(301) 555-0148", rateClass: "adult" },
    { first: "Ray", last: "Okonkwo", email: "ray.okonkwo@example.com", phone: "(240) 555-0163", rateClass: "senior" },
    { first: "Elise", last: "Tran", email: "elise.tran@example.com", phone: "(301) 555-0192", rateClass: "junior" },
];

const initialsOf = (p: PlayerInfo): string | undefined => (p.first ? `${p.first[0]}${p.last[0] ?? ""}`.toUpperCase() : undefined);
const nameOf = (p: PlayerInfo, index: number): string => (p.first ? `${p.first} ${p.last}`.trim() : `Player ${index + 1}`);

/** A read-only cell in the facts bar, styled to sit beside the dropdown cells. */
const Fact = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-1 flex-col gap-1 px-5 py-4">
        <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">{label}</span>
        <span className="text-sm text-secondary">{value}</span>
    </div>
);

/** Player tile with its seat number, lifted from the Tenfore checkout. */
const PlayerAvatar = ({ number, initials }: { number: number; initials?: string }) => (
    <div className="relative shrink-0">
        <Avatar size="md" initials={initials} placeholderIcon={initials ? undefined : Users01} />
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary-solid text-[10px] font-semibold text-white ring-2 ring-secondary">
            {number}
        </span>
    </div>
);

export interface TeeCheckoutScreenProps {
    /** The slot being booked. Omit in the app — it comes from the tee sheet via storage. */
    selection?: TeeSelection;
    /** Open with the county resident rate already applied. */
    resident?: boolean;
    /** Start the hold clock here, so a story can show the about-to-expire state. */
    holdSeconds?: number;
}

export const TeeCheckoutScreen = ({ selection: given, resident: initialResident = false, holdSeconds = HOLD_SECONDS }: TeeCheckoutScreenProps) => {
    const router = useRouter();
    const { user, addActivity, checkout, setCourse, isResident, setResident: persistResident, ready } = useSession();

    // The tee sheet wrote the slot to storage; a story passes it directly; a cold open falls back.
    const [selection, setSelection] = useState<TeeSelection>(given ?? DEFAULT_SELECTION);
    useEffect(() => {
        if (given) return;
        const stored = readSelection();
        if (stored) setSelection(stored);
    }, [given]);

    const course = courseInfo(selection.courseSlug);

    const [players, setPlayers] = useState(selection.players);
    const [holes, setHoles] = useState(selection.holes);
    const [transport, setTransport] = useState<Transport>("walking");
    const [resident, setLocalResident] = useState(initialResident);
    useEffect(() => {
        if (ready) setLocalResident(isResident || initialResident);
    }, [ready, isResident, initialResident]);
    const setResident = (value: boolean) => {
        setLocalResident(value);
        persistResident(value);
    };
    const [openCell, setOpenCell] = useState<null | "players" | "transport">(null);

    // Keep the form in step with whatever the tee sheet actually handed us.
    useEffect(() => {
        setPlayers(selection.players);
        setHoles(selection.holes);
    }, [selection]);

    const [details, setDetails] = useState<PlayerInfo[]>(() =>
        Array.from({ length: 4 }, (_, i) =>
            i === 0
                ? user
                    ? { first: user.first, last: user.last, email: user.email, phone: user.phone, rateClass: "adult" as RateClass }
                    : EMPTY_PLAYER
                : i < selection.players
                  ? SAMPLE_GUESTS[i - 1]
                  : EMPTY_PLAYER,
        ),
    );

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [draft, setDraft] = useState<PlayerInfo>(EMPTY_PLAYER);

    const openEdit = (index: number) => {
        setDraft(details[index]);
        setEditIndex(index);
    };
    const saveEdit = () => {
        if (editIndex === null) return;
        setDetails((all) => all.map((p, i) => (i === editIndex ? draft : p)));
        setEditIndex(null);
    };

    /* ---------------- the hold ---------------- */
    const [secondsLeft, setSecondsLeft] = useState(holdSeconds);
    useEffect(() => {
        const timer = setInterval(() => setSecondsLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
        return () => clearInterval(timer);
    }, []);
    const mmss = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;
    const expired = secondsLeft === 0;

    /* ---------------- pricing ---------------- */
    const seats = Array.from({ length: players }, (_, i) => i);

    const fees = useMemo(
        () =>
            seats.map((i) => {
                const player = details[i];
                return greenFee({
                    slug: selection.courseSlug,
                    holes,
                    weekend: selection.weekend,
                    twilight: selection.twilight,
                    resident,
                    rateClass: player.rateClass,
                });
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [players, details, holes, resident, selection],
    );

    const cartEach = transportFee(transport, holes, selection.twilight);
    const greenTotal = fees.reduce((sum, fee) => sum + fee, 0);
    const cartTotal = cartEach * players;
    const total = greenTotal + cartTotal + BOOKING_FEE;
    const residentSaving = useMemo(
        () =>
            seats.reduce(
                (sum, i) =>
                    sum +
                    (greenFee({ slug: selection.courseSlug, holes, weekend: selection.weekend, twilight: selection.twilight, rateClass: details[i].rateClass }) -
                        greenFee({
                            slug: selection.courseSlug,
                            holes,
                            weekend: selection.weekend,
                            twilight: selection.twilight,
                            resident: true,
                            rateClass: details[i].rateClass,
                        })),
                0,
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [players, details, holes, selection],
    );

    const everyoneNamed = seats.every((i) => details[i].first.trim().length > 0);

    /* ---------------- confirm ---------------- */
    const confirm = () => {
        const lines: ReceiptLine[] = seats.map((i) => ({
            label: nameOf(details[i], i),
            detail: [RATE_CLASS_LABEL[details[i].rateClass], resident ? "County resident" : null, selection.twilight ? "Twilight" : `${holes} holes`]
                .filter(Boolean)
                .join(" · "),
            amount: fees[i],
        }));
        if (cartEach > 0) {
            lines.push({ label: TRANSPORT_LABEL[transport], detail: `${money(cartEach)} × ${players}`, amount: cartTotal });
        }
        lines.push({ label: "Online booking fee", amount: BOOKING_FEE });

        const receipt = {
            ...selection,
            players,
            holes,
            confirmation: newConfirmation(),
            transport,
            resident,
            lines,
            total,
            cardLast4: "4242",
            email: details[0].email || user?.email || "golf@mcggolf.com",
        };

        writeReceipt(receipt);
        setCourse(selection.courseSlug);
        addActivity({
            id: newId("tee"),
            kind: "tee-time",
            title: `${course.name} — ${holes} holes`,
            detail: `${players} ${players === 1 ? "golfer" : "golfers"} · ${TRANSPORT_LABEL[transport]}${resident ? " · Resident rate" : ""}`,
            isoDate: selection.isoDate,
            dateLabel: selection.dateLabel,
            timeLabel: selection.timeLabel,
            courseSlug: selection.courseSlug,
            amount: total,
            status: "Upcoming",
        });
        // Anything the golfer had in the cart is settled with the same payment.
        checkout();
        router.push("/tee-times/confirmation");
    };

    return (
        <McgShell>
            <McgPage width="6xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button size="sm" color="link-gray" iconLeading={ArrowLeft} href="/tee-times">
                        Back to the tee sheet
                    </Button>
                    <span className="text-sm text-tertiary">
                        Confirmation and cancellation policy below · <span className="text-secondary">(301) 762-1600</span>
                    </span>
                </div>

                <div className="mt-5">
                    <StepRail steps={TEE_RAIL} current={1} />
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    {/* ---------------- left: the booking ---------------- */}
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-display-sm font-semibold text-primary">You&rsquo;re one step from the first tee</h1>
                                <p className="max-w-xl text-md text-tertiary">
                                    Name your group and pick how you&rsquo;re getting around. We&rsquo;ll hold {selection.timeLabel} at {course.name} while you do.
                                </p>
                            </div>
                            <img src={course.logo} alt={course.name} className="h-12 w-auto max-w-32 object-contain" />
                        </div>

                        {/* Players / Holes / Transportation */}
                        <div className="flex flex-col divide-y divide-secondary rounded-xl bg-primary ring-1 ring-secondary sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                            <DropdownCell
                                label="Players"
                                value={`${players} ${players === 1 ? "Player" : "Players"}`}
                                open={openCell === "players"}
                                onToggle={() => setOpenCell((p) => (p === "players" ? null : "players"))}
                                onClose={() => setOpenCell(null)}
                                align="left"
                                edge="left"
                            >
                                <div className="w-56">
                                    <p className="mb-3 text-sm font-semibold text-primary">Players</p>
                                    <RadioGroup aria-label="Players" value={String(players)} onChange={(v) => setPlayers(Number(v))} className="flex flex-col gap-2.5">
                                        {[1, 2, 3, 4].map((n) => (
                                            <RadioButton key={n} value={String(n)} label={`${n} ${n === 1 ? "player" : "players"}`} />
                                        ))}
                                    </RadioGroup>
                                </div>
                            </DropdownCell>

                            {/* Holes are set by the slot you picked off the board, so this one is a fact, not a control. */}
                            <Fact label="Holes" value={selection.twilight ? `Twilight · ${holes}` : `${holes} holes`} />

                            <DropdownCell
                                label="Transportation"
                                value={TRANSPORT_LABEL[transport]}
                                open={openCell === "transport"}
                                onToggle={() => setOpenCell((p) => (p === "transport" ? null : "transport"))}
                                onClose={() => setOpenCell(null)}
                                align="right"
                                edge="right"
                            >
                                <div className="w-72">
                                    <p className="mb-3 text-sm font-semibold text-primary">Getting around</p>
                                    <RadioGroup
                                        aria-label="Transportation"
                                        value={transport}
                                        onChange={(v) => setTransport(v as Transport)}
                                        className="flex flex-col gap-3"
                                    >
                                        {TRANSPORT_ORDER.map((option) => {
                                            const fee = transportFee(option, holes, selection.twilight);
                                            return (
                                                <RadioButton
                                                    key={option}
                                                    value={option}
                                                    label={`${TRANSPORT_LABEL[option]} — ${fee === 0 ? "free" : `${money(fee)} each`}`}
                                                    hint={<span className="text-xs">{TRANSPORT_HINT[option]}</span>}
                                                />
                                            );
                                        })}
                                    </RadioGroup>
                                </div>
                            </DropdownCell>
                        </div>

                        {/* Resident rate — the biggest lever on the bill, so it sits above the players */}
                        <section
                            className={cx(
                                "flex flex-wrap items-center justify-between gap-4 rounded-xl px-5 py-4 ring-1 ring-inset transition duration-100 ease-linear",
                                resident ? "bg-brand-primary ring-2 ring-brand" : "bg-primary ring-secondary",
                            )}
                        >
                            <div className="flex min-w-0 items-start gap-3">
                                <MarkerPin01 className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                <div className="flex min-w-0 flex-col gap-0.5">
                                    <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-primary">
                                        Montgomery County resident rate
                                        {resident && residentSaving > 0 && (
                                            <Badge color="success" size="sm" type="pill-color">
                                                Saving {money(residentSaving)}
                                            </Badge>
                                        )}
                                    </span>
                                    <span className="text-sm text-tertiary">
                                        Applies to every golfer in the group. Bring a county ID or an MCG resident card to the pro shop — the rate is verified at
                                        check-in, not here.
                                    </span>
                                </div>
                            </div>
                            <Toggle size="md" label="I'm a county resident" isSelected={resident} onChange={setResident} aria-label="Apply the Montgomery County resident rate" />
                        </section>

                        {/* Player cards */}
                        <section className="flex flex-col gap-3">
                            <SectionTitle sub="Every golfer is priced on their own rate, so senior and junior players in the same group pay their own fee.">
                                Who&rsquo;s playing
                            </SectionTitle>

                            {seats.map((i) => {
                                const player = details[i];
                                const filled = player.first.trim().length > 0;
                                const isHost = i === 0;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => openEdit(i)}
                                        className="group flex items-center justify-between gap-4 rounded-xl bg-primary px-4 py-4 text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <PlayerAvatar number={i + 1} initials={initialsOf(player)} />
                                            <div className="flex min-w-0 flex-col">
                                                <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-primary">
                                                    {nameOf(player, i)}
                                                    {isHost && <span className="rounded-full bg-tertiary px-2 py-0.5 text-[10px] font-medium text-secondary">You</span>}
                                                    {filled && player.rateClass !== "adult" && (
                                                        <Badge color="brand" size="sm" type="pill-color">
                                                            {RATE_CLASS_LABEL[player.rateClass]}
                                                        </Badge>
                                                    )}
                                                </span>
                                                <span className="truncate text-xs text-tertiary">{filled ? player.email : "Tap to add this golfer's details"}</span>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-4">
                                            <span className="text-sm font-semibold text-primary tabular-nums">{money(fees[i])}</span>
                                            {filled ? (
                                                <span className="flex items-center gap-1 text-sm font-medium text-success-primary">
                                                    <Check className="size-4" aria-hidden="true" /> Added
                                                </span>
                                            ) : (
                                                <span className="flex items-center rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-secondary shadow-xs-skeuomorphic ring-1 ring-primary transition duration-100 ease-linear ring-inset group-hover:bg-primary_hover">
                                                    Add details
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </section>

                        {/* Payment */}
                        <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                            <SectionTitle sub="Green fees are charged when you book. Carts and anything you add in the shop are settled at the counter.">
                                Payment
                            </SectionTitle>

                            <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary_subtle px-4 py-3.5 ring-1 ring-secondary ring-inset">
                                <span className="flex items-center gap-2.5 text-sm font-semibold text-primary">
                                    <CreditCard01 className="size-4 text-fg-brand-primary" aria-hidden="true" />
                                    Pay by card
                                </span>
                                <img src={asset("card-images/Visa.svg")} alt="Visa" className="h-5 w-auto shrink-0" />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Input label="Name on card" defaultValue={user ? `${user.first} ${user.last}` : "Justin Girard"} />
                                <Input label="Card number" icon={CreditCard01} defaultValue="4242 4242 4242 4242" />
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <Input label="Expiry" defaultValue="04 / 28" />
                                    <Input label="CVV" defaultValue="123" />
                                    <Input label="ZIP" defaultValue="20850" />
                                </div>
                            </div>
                        </section>

                        {/* Policy */}
                        <section className="flex flex-col gap-3 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                            <div className="flex items-center gap-2">
                                <InfoCircle className="size-5 text-fg-brand-primary" aria-hidden="true" />
                                <h4 className="text-lg font-semibold text-primary">Before you go</h4>
                            </div>
                            <ul className="flex flex-col gap-2 text-sm text-tertiary">
                                <li>Tee times open eight days ahead at 7:00 AM across all nine county courses.</li>
                                <li>Check in at the pro shop 20 minutes before your time. Resident and senior rates are verified there.</li>
                                <li>Cancel free up to 24 hours ahead. Inside 24 hours the county charges the first golfer&rsquo;s green fee.</li>
                                <li>Weekends and holidays are 18-hole play only until 1:00 PM. Frost delays are called by 6:30 AM in spring and fall.</li>
                            </ul>
                        </section>
                    </div>

                    {/* ---------------- right: the bill ---------------- */}
                    <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
                        <section aria-label="Order summary" className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                            <SectionTitle>Your round</SectionTitle>

                            <div className="flex items-center gap-3">
                                <img src={course.logo} alt="" aria-hidden="true" className="h-9 w-auto max-w-16 object-contain" />
                                <div className="flex min-w-0 flex-col">
                                    <span className="truncate text-sm font-semibold text-primary">{course.name}</span>
                                    <span className="truncate text-xs text-tertiary">{course.location}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 rounded-xl bg-secondary_subtle px-4 py-3.5">
                                <MetaLine icon={Calendar}>{selection.dateLabel}</MetaLine>
                                <MetaLine icon={Clock}>
                                    {selection.timeLabel}
                                    {selection.twilight ? " · Twilight" : ""}
                                </MetaLine>
                                <MetaLine icon={Flag01}>{holes} holes</MetaLine>
                                <MetaLine icon={Users01}>
                                    {players} {players === 1 ? "golfer" : "golfers"} · {TRANSPORT_LABEL[transport]}
                                </MetaLine>
                            </div>

                            <div className="flex flex-col border-t border-secondary pt-3">
                                <MicroLabel>Green fees</MicroLabel>
                                {seats.map((i) => (
                                    <SummaryLine
                                        key={i}
                                        label={
                                            <>
                                                {nameOf(details[i], i)}
                                                <span className="text-tertiary">
                                                    {" "}
                                                    · {RATE_CLASS_LABEL[details[i].rateClass]}
                                                    {resident ? " · resident" : ""}
                                                </span>
                                            </>
                                        }
                                        value={money(fees[i])}
                                    />
                                ))}
                                {cartEach > 0 && <SummaryLine label={`${TRANSPORT_LABEL[transport]} × ${players}`} value={money(cartTotal)} />}
                                <SummaryLine label="Online booking fee" value={money(BOOKING_FEE)} muted />
                                {resident && residentSaving > 0 && <SummaryLine label="Resident rate applied" value={`−${money(residentSaving)}`} />}
                                <div className="mt-2 border-t border-secondary pt-2.5">
                                    <SummaryLine label="Due now" value={money(total)} strong />
                                </div>
                            </div>

                            <Button size="lg" color="primary" iconLeading={Flag01} onClick={confirm} isDisabled={expired || !everyoneNamed} className="w-full">
                                {expired ? "Hold expired" : `Confirm and pay ${money(total)}`}
                            </Button>

                            {!everyoneNamed && !expired && <p className="text-xs text-tertiary">Add a name for every golfer to confirm.</p>}
                        </section>

                        {/* Hold countdown */}
                        <div
                            className={cx(
                                "rounded-xl px-5 py-4 ring-1 ring-inset",
                                expired ? "bg-error-secondary ring-error_subtle" : "bg-utility-blue-50 ring-utility-blue-200",
                            )}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className={cx("flex items-center gap-2 text-sm font-semibold", expired ? "text-error-primary" : "text-utility-blue-700")}>
                                    <Clock className="size-4" aria-hidden="true" />
                                    {expired ? "Hold released" : "Time left to book"}
                                </span>
                                <span className={cx("text-xl font-semibold tabular-nums", expired ? "text-error-primary" : "text-utility-blue-700")}>{mmss}</span>
                            </div>
                            <p className={cx("mt-2 text-xs leading-relaxed", expired ? "text-error-primary" : "text-utility-blue-600")}>
                                {expired
                                    ? "This time went back on the county board. Head back to the tee sheet and grab another — there are usually a few left within the hour."
                                    : `${selection.timeLabel} at ${course.name} is held for you while you check out. Leave before confirming and it returns to the county board.`}
                            </p>
                            {expired && (
                                <div className="mt-3">
                                    <Button size="sm" color="secondary" href="/tee-times">
                                        Back to the tee sheet
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl bg-primary px-5 py-4 ring-1 ring-secondary ring-inset">
                            <MicroLabel>After you book</MicroLabel>
                            <p className="mt-1.5 text-xs leading-relaxed text-tertiary">
                                Your round lands in your MCG account and you can{" "}
                                <a href={calendarUrl(selection)} target="_blank" rel="noreferrer" className="font-medium text-brand-secondary hover:underline">
                                    add it to your calendar
                                </a>{" "}
                                in one tap from the confirmation.
                            </p>
                        </div>
                    </aside>
                </div>
            </McgPage>

            {/* Player edit modal */}
            {editIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/50 p-4 backdrop-blur-[2px]" onClick={() => setEditIndex(null)}>
                    <div onClick={(event) => event.stopPropagation()} className="w-full max-w-xl overflow-hidden rounded-2xl bg-primary shadow-xl ring-1 ring-secondary">
                        <header className="flex items-center justify-between border-b border-secondary px-6 py-4">
                            <h2 className="text-lg font-semibold text-primary">Player {editIndex + 1}</h2>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => setEditIndex(null)}
                                className="flex size-8 items-center justify-center rounded-md text-fg-quaternary transition duration-100 ease-linear hover:bg-secondary_hover"
                            >
                                <XClose className="size-5" />
                            </button>
                        </header>

                        <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-6 py-5">
                            <div className="flex items-center gap-3">
                                <PlayerAvatar number={editIndex + 1} initials={initialsOf(draft)} />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-primary">{nameOf(draft, editIndex)}</span>
                                    <span className="text-xs text-tertiary">We check the group in by name at the pro shop.</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Input label="First name" placeholder="e.g. Dana" value={draft.first} onChange={(v) => setDraft((d) => ({ ...d, first: v }))} />
                                <Input label="Last name" placeholder="e.g. Whitfield" value={draft.last} onChange={(v) => setDraft((d) => ({ ...d, last: v }))} />
                            </div>
                            <Input label="Email" type="email" placeholder="e.g. dana@example.com" value={draft.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} />
                            <Input label="Phone" type="tel" placeholder="e.g. (301) 555-0148" value={draft.phone} onChange={(v) => setDraft((d) => ({ ...d, phone: v }))} />

                            <div className="border-t border-secondary pt-4">
                                <p className="mb-1 text-sm font-semibold text-primary">Rate</p>
                                <p className="mb-3 text-xs text-tertiary">Verified with ID at check-in. Senior rates run Monday to Friday; junior rates run any day.</p>
                                <RadioGroup
                                    aria-label="Rate"
                                    value={draft.rateClass}
                                    onChange={(v) => setDraft((d) => ({ ...d, rateClass: v as RateClass }))}
                                    className="flex flex-col gap-2.5"
                                >
                                    {(Object.keys(RATE_CLASS_LABEL) as RateClass[]).map((rate) => (
                                        <RadioButton
                                            key={rate}
                                            value={rate}
                                            label={RATE_CLASS_LABEL[rate]}
                                            hint={money(
                                                greenFee({
                                                    slug: selection.courseSlug,
                                                    holes,
                                                    weekend: selection.weekend,
                                                    twilight: selection.twilight,
                                                    resident,
                                                    rateClass: rate,
                                                }),
                                            )}
                                        />
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>

                        <footer className="flex items-center justify-end gap-3 border-t border-secondary px-6 py-4">
                            <Button color="secondary" onClick={() => setEditIndex(null)}>
                                Cancel
                            </Button>
                            <Button color="primary" onClick={saveEdit}>
                                Save player
                            </Button>
                        </footer>
                    </div>
                </div>
            )}
        </McgShell>
    );
};
