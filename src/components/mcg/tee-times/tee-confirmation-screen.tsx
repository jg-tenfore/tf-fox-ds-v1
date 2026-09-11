"use client";

/**
 * `/tee-times/confirmation` — the receipt.
 *
 * Deliberately printable-feeling rather than celebratory: a confirmation number the
 * starter can look up, the course's own mark so a golfer with rounds at three MCG
 * courses can tell them apart at a glance, and every line of what was charged — because
 * on a county system the per-golfer rates (resident, senior, junior) are exactly what
 * people query at the counter.
 */

import { useEffect, useState } from "react";
import { ArrowRight, CalendarPlus01, CheckCircle, Clock, Flag01, MarkerPin01, Users01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { MetaLine, MicroLabel, SectionTitle, StepRail, SummaryLine } from "@/components/instruction/instruction-ui";
import { McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import {
    BOOKING_FEE,
    DEFAULT_SELECTION,
    TRANSPORT_LABEL,
    calendarUrl,
    courseInfo,
    greenFee,
    money,
    readReceipt,
    type TeeReceipt,
} from "@/components/mcg/tee-times-data";
import { TEE_RAIL } from "./tee-checkout-screen";

/** What a story sees when nothing has been booked in this browser yet. */
const DEMO_RECEIPT: TeeReceipt = {
    ...DEFAULT_SELECTION,
    confirmation: "MCG-4821",
    transport: "riding",
    resident: true,
    cardLast4: "4242",
    email: "hello@girardjustin.com",
    lines: [
        { label: "Justin Girard", detail: "Adult · County resident · 18 holes", amount: greenFee({ slug: "falls-road", holes: 18, weekend: false, twilight: false, resident: true }) },
        {
            label: "Dana Whitfield",
            detail: "Adult · County resident · 18 holes",
            amount: greenFee({ slug: "falls-road", holes: 18, weekend: false, twilight: false, resident: true }),
        },
        { label: "Riding cart", detail: "$22.00 × 2", amount: 44 },
        { label: "Online booking fee", amount: BOOKING_FEE },
    ],
    total: greenFee({ slug: "falls-road", holes: 18, weekend: false, twilight: false, resident: true }) * 2 + 44 + BOOKING_FEE,
};

export interface TeeConfirmationScreenProps {
    /** The receipt to render. Omit in the app — checkout leaves it in storage. */
    receipt?: TeeReceipt;
}

export const TeeConfirmationScreen = ({ receipt: given }: TeeConfirmationScreenProps) => {
    const [receipt, setReceipt] = useState<TeeReceipt>(given ?? DEMO_RECEIPT);
    useEffect(() => {
        if (given) return;
        const stored = readReceipt();
        if (stored) setReceipt(stored);
    }, [given]);

    const course = courseInfo(receipt.courseSlug);

    return (
        <McgShell>
            <McgPage width="3xl">
                <StepRail steps={TEE_RAIL} current={2} />

                <div className="mt-8 flex flex-col items-center gap-3 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-success-secondary">
                        <CheckCircle className="size-7 text-fg-success-primary" aria-hidden="true" />
                    </span>
                    <h1 className="text-display-sm font-semibold text-primary">You&rsquo;re on the sheet</h1>
                    <p className="max-w-lg text-md text-tertiary">
                        {receipt.timeLabel} at {course.name}, {receipt.dateLabel}. A confirmation is on its way to {receipt.email}, and the round is in your MCG
                        account.
                    </p>
                </div>

                <div className="mt-8 flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                    {/* Course + confirmation number */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-secondary pb-5">
                        <div className="flex items-center gap-3.5">
                            <img src={course.logo} alt="" aria-hidden="true" className="h-11 w-auto max-w-20 object-contain" />
                            <div className="flex flex-col">
                                <span className="text-md font-semibold text-primary">{course.name}</span>
                                <span className="text-sm text-tertiary">
                                    {course.location} · par {course.par}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                            <Badge color="success" size="md" type="pill-color">
                                Confirmed
                            </Badge>
                            <span className="text-sm text-tertiary">
                                Confirmation <span className="font-semibold text-secondary tabular-nums">{receipt.confirmation}</span>
                            </span>
                        </div>
                    </div>

                    {/* The round */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1">
                            <MicroLabel>When</MicroLabel>
                            <span className="text-sm font-semibold text-primary">{receipt.dateLabel}</span>
                            <MetaLine icon={Clock}>
                                {receipt.timeLabel}
                                {receipt.twilight ? " · Twilight" : ""}
                            </MetaLine>
                        </div>
                        <div className="flex flex-col gap-1">
                            <MicroLabel>Where</MicroLabel>
                            <span className="text-sm font-semibold text-primary">{course.name}</span>
                            <MetaLine icon={MarkerPin01}>{course.location}</MetaLine>
                        </div>
                        <div className="flex flex-col gap-1">
                            <MicroLabel>Group</MicroLabel>
                            <span className="text-sm font-semibold text-primary">
                                {receipt.players} {receipt.players === 1 ? "golfer" : "golfers"}
                            </span>
                            <MetaLine icon={Users01}>{TRANSPORT_LABEL[receipt.transport]}</MetaLine>
                        </div>
                        <div className="flex flex-col gap-1">
                            <MicroLabel>Round</MicroLabel>
                            <span className="text-sm font-semibold text-primary">{receipt.holes} holes</span>
                            <MetaLine icon={Flag01}>{receipt.weekend ? "Weekend rate" : "Weekday rate"}</MetaLine>
                        </div>
                    </div>

                    {receipt.resident && (
                        <div className="flex items-start gap-2.5 rounded-xl bg-secondary_subtle px-4 py-3.5">
                            <MarkerPin01 className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                            <p className="text-sm text-tertiary">
                                Booked at the <span className="font-semibold text-secondary">Montgomery County resident rate</span>. Bring a county ID or your MCG
                                resident card to the pro shop — the rate is verified at check-in.
                            </p>
                        </div>
                    )}

                    {/* What was charged */}
                    <div className="flex flex-col border-t border-secondary pt-5">
                        <MicroLabel>What you paid</MicroLabel>
                        {receipt.lines.map((line, i) => (
                            <SummaryLine
                                key={`${line.label}-${i}`}
                                label={
                                    <>
                                        {line.label}
                                        {line.detail && <span className="text-tertiary"> · {line.detail}</span>}
                                    </>
                                }
                                value={money(line.amount)}
                            />
                        ))}
                        <div className="mt-1 border-t border-secondary pt-2">
                            <SummaryLine label={`Charged to Visa ···· ${receipt.cardLast4}`} value={money(receipt.total)} strong />
                        </div>
                    </div>

                    {/* Next steps */}
                    <div className="flex flex-wrap gap-3 border-t border-secondary pt-5">
                        <Button size="md" color="primary" iconLeading={CalendarPlus01} href={calendarUrl(receipt)} target="_blank" rel="noreferrer">
                            Add to calendar
                        </Button>
                        <Button size="md" color="secondary" href="/account">
                            View in my account
                        </Button>
                        <Button size="md" color="link-gray" iconTrailing={ArrowRight} href="/tee-times">
                            Book another round
                        </Button>
                    </div>
                </div>

                {/* Day-of detail — the stuff a starter would tell you */}
                <section className="mt-8 flex flex-col gap-3">
                    <SectionTitle sub={course.blurb}>Before you tee off at {course.name}</SectionTitle>
                    <ul className="flex flex-col gap-2 rounded-2xl bg-primary p-6 text-sm text-tertiary ring-1 ring-secondary ring-inset">
                        <li>Check in at the pro shop 20 minutes before {receipt.timeLabel}. Resident, senior and junior rates are verified there.</li>
                        <li>Cancel or change free up to 24 hours before your time, in your MCG account or by calling (301) 762-1600.</li>
                        <li>Soft spikes only, and collared shirts on the course — the county keeps the dress code light but it is a dress code.</li>
                        <li>Rain check policy is system-wide: play fewer than nine and the round comes back to your account as a credit at any MCG course.</li>
                    </ul>
                </section>
            </McgPage>
        </McgShell>
    );
};
