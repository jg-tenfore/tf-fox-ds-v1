/**
 * Shared UI for the MCG Instruction screens — the pieces both the Book a Lesson and
 * Packages & Credits flows draw from.
 *
 * Everything here is built on the existing Fox design system: the Global Nav chrome
 * (`tenfore-chrome`), the base Button / Badge / Input components, and the Tee Time and
 * Shop Checkout layout patterns. Nothing new is introduced at the token level — the MCG
 * skin comes entirely from `clubBrandStyle(MCG_GREEN)`, which re-points every
 * brand-derived token at MCG's green.
 *
 * Several pieces here come from the Sagamore booking prototype: the service catalog
 * card, the capacity meter with its waitlist state, daypart-sectioned slots, the
 * "any available instructor" card, and the exit guard.
 */

import { createContext, useContext, type FC, type ReactNode } from "react";
import { Award01, Calendar, CheckCircle, Clock, MarkerPin01, Star01, Ticket02, Users01, XClose, Zap } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { McgLogo } from "@/components/foundations/mcg/mcg-logo";
import { cx } from "@/utils/cx";
import {
    AUDIENCE_COLOR,
    AUDIENCE_LABEL,
    type Audience,
    COURSE_LOGO,
    COURSE_NAME,
    type Coach,
    type CreditBalance,
    type Daypart,
    type LessonService,
    MCG_GREEN,
    type Slot,
    adjLabel,
    byDaypart,
    coachById,
    guardrailSummary,
    money,
    money0,
    packageById,
    perPlayer,
    serviceFromPrice,
    servicePrice,
    spotsLeft,
} from "./instruction-catalog";
import { coachPhoto } from "@/components/mcg/academy-photo";
import { NAV_ITEMS_WITH_INSTRUCTION, SiteFooter, TopNav, clubBrandStyle, type Club } from "@/stories/explorations/tenfore-chrome";

/* ------------------------------------------------------------------ */
/* Club identity                                                       */
/* ------------------------------------------------------------------ */

/** Montgomery County Golf, skinned for the Academy screens. */
export const MCG_CLUB: Club = {
    name: "Montgomery County Golf",
    city: "Montgomery County, MD",
    phone: "(301) 762-1600",
    addressLine: "Montgomery County, MD",
    email: "academy@mcggolf.com",
    Logo: McgLogo,
    // Black nav so the green MCG mark reads against it; brand accents pick up MCG green.
    navColor: undefined,
};

export { MCG_GREEN };
export { SiteFooter };

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

/** Section heading used down the left column of every Instruction screen. */
export const SectionTitle = ({ children, sub }: { children: ReactNode; sub?: string }) => (
    <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-primary">{children}</h2>
        {sub && <p className="max-w-3xl text-sm text-tertiary">{sub}</p>}
    </div>
);

/** Uppercase micro-label — the same treatment the Tee Time selector bar uses. */
export const MicroLabel = ({ children }: { children: ReactNode }) => (
    <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">{children}</span>
);

/** An icon + text meta line, matching the Clinics / Events detail pattern. */
export const MetaLine = ({ icon: Icon, children }: { icon: FC<{ className?: string }>; children: ReactNode }) => (
    <span className="flex items-center gap-1.5 text-sm text-tertiary">
        <Icon className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        {children}
    </span>
);

/** A course's brand logo chip — how every screen names which MCG course you're at. */
export const CourseChip = ({ slug, size = "sm" }: { slug: string; size?: "sm" | "md" }) => (
    <span
        className={cx(
            "inline-flex items-center gap-2 rounded-full bg-secondary_subtle ring-1 ring-secondary ring-inset",
            size === "sm" ? "py-1 pr-3 pl-1.5" : "py-1.5 pr-3.5 pl-2",
        )}
    >
        <img src={COURSE_LOGO[slug]} alt="" className={cx("w-auto rounded-full bg-primary object-contain", size === "sm" ? "h-5" : "h-6")} />
        <span className={cx("font-semibold text-secondary", size === "sm" ? "text-xs" : "text-sm")}>{COURSE_NAME[slug]}</span>
    </span>
);

/** Instructor initials tile — the Profile avatar treatment, tinted MCG green. */
export const CoachAvatar = ({ coach, size = "md" }: { coach: Coach; size?: "sm" | "md" | "lg" | "xl" }) => {
    const box = cx(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold",
        size === "sm" && "size-9 text-xs",
        size === "md" && "size-12 text-sm",
        size === "lg" && "size-20 text-xl",
        size === "xl" && "size-28 text-2xl",
    );

    // "Any available instructor" is a choice, not a person — keep it clearly drawn.
    if (coach.isAny) {
        return (
            <span className={cx(box, "border border-dashed border-brand bg-brand-primary text-brand-secondary")}>
                <Users01 className={cx(size === "lg" || size === "xl" ? "size-8" : size === "md" ? "size-5" : "size-4")} aria-hidden="true" />
            </span>
        );
    }

    const photo = coachPhoto(coach);
    if (!photo) {
        return (
            <span className={cx(box, "text-white")} style={{ backgroundColor: MCG_GREEN }}>
                {coach.initials}
            </span>
        );
    }

    return (
        <span className={cx(box, "bg-secondary_subtle ring-1 ring-secondary ring-inset")}>
            <img src={photo} alt="" aria-hidden="true" className="size-full object-cover" loading="lazy" />
        </span>
    );
};

/** Rating + review count, matching the Pro Shop product card. */
export const Rating = ({ value, reviews }: { value?: number; reviews?: number }) => {
    if (value === undefined) return null;
    return (
        <span className="flex items-center gap-1.5 text-sm text-tertiary">
            <Star01 className="size-4 fill-current text-fg-warning-secondary" aria-hidden="true" />
            <span className="font-semibold text-secondary tabular-nums">{value.toFixed(1)}</span>
            {reviews !== undefined && <span className="tabular-nums">({reviews})</span>}
        </span>
    );
};

/** Audience pill — Adult / Junior / Senior, colored consistently across both flows. */
export const AudienceBadge = ({ audience }: { audience: Audience }) => (
    <Badge color={AUDIENCE_COLOR[audience]} size="sm" type="pill-color">
        {AUDIENCE_LABEL[audience]}
    </Badge>
);

/** A row of filter chips — the catalog's primary narrowing control. */
export const FilterChips = <T extends string>({ options, value, onChange }: { options: { id: T; label: string }[]; value: T; onChange: (id: T) => void }) => (
    <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
            <button
                key={o.id}
                type="button"
                onClick={() => onChange(o.id)}
                className={cx(
                    "rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
                    value === o.id ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
                )}
            >
                {o.label}
            </button>
        ))}
    </div>
);

/* ------------------------------------------------------------------ */
/* Capacity                                                            */
/* ------------------------------------------------------------------ */

/**
 * Seats left in a scheduled program. Full turns into a waitlist prompt rather than a
 * dead card — the behavior the Sagamore prototype gets right and a flat "0 spots"
 * does not.
 */
export const CapacityMeter = ({ service, compact }: { service: LessonService; compact?: boolean }) => {
    const left = spotsLeft(service);
    if (left === null || service.capacity === undefined) return null;
    const full = left === 0;
    const low = left > 0 && left <= 3;
    const pct = ((service.capacity - left) / service.capacity) * 100;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
                <span className={cx("text-xs font-semibold", full ? "text-error-primary" : low ? "text-warning-primary" : "text-tertiary")}>
                    {full ? "Full — join the waitlist" : low ? `Only ${left} ${left === 1 ? "spot" : "spots"} left` : `${left} of ${service.capacity} spots left`}
                </span>
                {!compact && <span className="text-xs text-quaternary tabular-nums">{service.registered} enrolled</span>}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-quaternary">
                <div
                    className={cx("h-full rounded-full", full ? "bg-error-solid" : low ? "bg-warning-solid" : "")}
                    style={{ width: `${pct}%`, ...(full || low ? {} : { backgroundColor: MCG_GREEN }) }}
                />
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Service catalog card                                                */
/* ------------------------------------------------------------------ */

/**
 * One service in the catalog — a private lesson or a scheduled program. Both render
 * as the same card because, structurally, they are the same object: this is what
 * folding lessons into the clinics catalog buys you.
 */
export const ServiceCard = ({ service, onSelect, selected }: { service: LessonService; onSelect?: () => void; selected?: boolean }) => {
    const isGroup = service.kind === "group";
    const coach = isGroup && service.coachIds?.[0] ? coachById(service.coachIds[0]) : undefined;
    const rails = guardrailSummary(service);
    const left = spotsLeft(service);
    const full = left === 0;

    return (
        <button
            type="button"
            onClick={onSelect}
            className={cx(
                "group flex flex-col overflow-hidden rounded-2xl bg-primary text-left ring-1 transition duration-100 ease-linear ring-inset",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                selected ? "ring-2 ring-brand" : "ring-secondary hover:ring-brand",
            )}
        >
            {isGroup && service.image && (
                <div className="relative aspect-[16/7] w-full overflow-hidden bg-secondary_subtle">
                    <img src={service.image} alt="" className="size-full object-cover" />
                    {service.save && (
                        <span className="absolute top-3 left-3 rounded-full bg-success-solid px-2.5 py-1 text-xs font-semibold text-white">{service.save}</span>
                    )}
                </div>
            )}

            <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-md font-semibold text-primary">{service.name}</span>
                            <AudienceBadge audience={service.audience} />
                            {isGroup && (
                                <Badge color="gray" size="sm" type="modern">
                                    Group
                                </Badge>
                            )}
                        </div>
                        <span className="text-sm text-tertiary">{service.meta}</span>
                    </div>
                    <div className="flex shrink-0 flex-col items-end">
                        {!isGroup && <MicroLabel>From</MicroLabel>}
                        <span className="text-lg font-semibold text-primary tabular-nums">{money0(serviceFromPrice(service))}</span>
                        {!isGroup && service.maxPlayers > 1 && <span className="text-xs text-tertiary">per lesson</span>}
                        {isGroup && service.sessions && service.sessions > 1 && (
                            <span className="text-xs text-tertiary tabular-nums">{money0(service.basePrice / service.sessions)} a session</span>
                        )}
                    </div>
                </div>

                <p className="text-sm text-tertiary">{service.desc}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <MetaLine icon={Clock}>{service.durationMin} min</MetaLine>
                    {!isGroup && (
                        <MetaLine icon={Users01}>
                            {service.minPlayers === service.maxPlayers ? `${service.maxPlayers}` : `${service.minPlayers}–${service.maxPlayers}`} golfers
                        </MetaLine>
                    )}
                    {isGroup && service.courseSlug && <MetaLine icon={MarkerPin01}>{COURSE_NAME[service.courseSlug]}</MetaLine>}
                    {isGroup && service.ageGroup && <MetaLine icon={Users01}>{service.ageGroup}</MetaLine>}
                    {rails && (
                        <span className="flex items-center gap-1.5 text-sm text-warning-primary">
                            <Calendar className="size-4 shrink-0" aria-hidden="true" />
                            {rails}
                        </span>
                    )}
                </div>

                <div className="mt-auto flex flex-col gap-3 border-t border-secondary pt-3.5">
                    {isGroup && <CapacityMeter service={service} compact />}
                    <div className="flex items-center justify-between gap-3">
                        {coach ? (
                            <span className="flex items-center gap-2">
                                <CoachAvatar coach={coach} size="sm" />
                                <span className="text-sm text-secondary">with {coach.name}</span>
                            </span>
                        ) : (
                            <span className="text-sm text-tertiary">Any MCG instructor</span>
                        )}
                        <span className="text-sm font-semibold text-brand-secondary transition duration-100 ease-linear group-hover:underline">
                            {full ? "Join waitlist" : "Choose"}
                        </span>
                    </div>
                </div>
            </div>
        </button>
    );
};

/* ------------------------------------------------------------------ */
/* Instructor card                                                     */
/* ------------------------------------------------------------------ */

/**
 * An instructor as a choice. Carries the price *for the selected service* so the
 * per-instructor adjustment is visible at the moment it matters, plus the next open
 * slot so nobody picks a person who can't see them this week.
 */
export const CoachCard = ({
    coach,
    price,
    nextOpen,
    onSelect,
    selected,
    service,
}: {
    coach: Coach;
    price: number;
    nextOpen: string;
    onSelect?: () => void;
    selected?: boolean;
    /** When given, the card prices this service rather than showing a "from". */
    service?: LessonService;
}) => (
    <button
        type="button"
        onClick={onSelect}
        className={cx(
            "group flex flex-col gap-4 rounded-2xl bg-primary p-5 text-left ring-1 transition duration-100 ease-linear ring-inset",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
            selected ? "ring-2 ring-brand" : coach.isAny ? "ring-brand/40 hover:ring-brand" : "ring-secondary hover:ring-brand",
        )}
    >
        <div className="flex items-start gap-3.5">
            <CoachAvatar coach={coach} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-md font-semibold text-primary">
                    {coach.name}
                    {/* The Academy prints the credential after the name — "Mike Kenny, PGA". */}
                    {coach.credential && <span className="font-medium text-tertiary">, {coach.credential}</span>}
                </span>
                <span className="text-sm text-tertiary">{coach.title}</span>
                {coach.isAny ? (
                    <span className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-success-secondary px-2.5 py-0.5 text-xs font-semibold text-success-primary">
                        <Zap className="size-3.5" aria-hidden="true" />
                        Fastest availability
                    </span>
                ) : (
                    <Rating value={coach.rating} reviews={coach.reviews} />
                )}
            </div>
            <div className="flex shrink-0 flex-col items-end">
                <MicroLabel>{service ? "This lesson" : "From"}</MicroLabel>
                <span className="text-lg font-semibold text-primary tabular-nums">{money0(price)}</span>
                {!coach.isAny && coach.priceAdj !== 0 && <span className="text-xs text-tertiary">{adjLabel(coach.priceAdj)}</span>}
            </div>
        </div>

        {!coach.isAny && (
            <>
                <div className="flex flex-wrap gap-1.5">
                    {coach.courseSlugs.map((slug) => (
                        <CourseChip key={slug} slug={slug} />
                    ))}
                </div>
                {coach.focus && coach.focus.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {coach.focus.map((f) => (
                            <span key={f} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary">
                                {f}
                            </span>
                        ))}
                    </div>
                )}
            </>
        )}
        {coach.isAny && <p className="text-sm text-tertiary">{coach.bio}</p>}

        <div className="flex items-center justify-between gap-3 border-t border-secondary pt-3.5">
            <MetaLine icon={Clock}>
                {coach.isAny ? "Earliest today" : "Next opening"} <span className="font-semibold text-secondary">{nextOpen}</span>
            </MetaLine>
            <span className="text-sm font-semibold text-brand-secondary transition duration-100 ease-linear group-hover:underline">Choose</span>
        </div>
    </button>
);

/* ------------------------------------------------------------------ */
/* Availability                                                        */
/* ------------------------------------------------------------------ */

/** A single bookable time. Booked and blocked slots stay visible so the day reads honestly. */
export const SlotButton = ({
    label,
    status,
    blockedReason,
    price,
    note,
    selected,
    onSelect,
}: {
    label: string;
    status: "open" | "booked" | "blocked";
    blockedReason?: string;
    price?: number;
    /** e.g. which instructor is free at this time, under "any instructor". */
    note?: string;
    selected?: boolean;
    onSelect?: () => void;
}) => {
    if (status !== "open") {
        return (
            <div className="flex flex-col items-center justify-center gap-0.5 rounded-lg bg-secondary_subtle px-2 py-2.5 text-center ring-1 ring-secondary ring-inset">
                <span className="text-sm font-medium text-quaternary line-through tabular-nums">{label}</span>
                <span className="text-[11px] text-quaternary">{status === "booked" ? "Booked" : (blockedReason ?? "Unavailable")}</span>
            </div>
        );
    }
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cx(
                "flex flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2.5 text-center ring-1 transition duration-100 ease-linear ring-inset",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                selected ? "bg-brand-solid text-white ring-transparent" : "bg-primary ring-secondary hover:ring-brand",
            )}
        >
            <span className={cx("text-sm font-semibold tabular-nums", selected ? "text-white" : "text-primary")}>{label}</span>
            {note ? (
                <span className={cx("truncate text-[11px]", selected ? "text-white/80" : "text-tertiary")}>{note}</span>
            ) : (
                price !== undefined && <span className={cx("text-[11px] tabular-nums", selected ? "text-white/80" : "text-tertiary")}>{money0(price)}</span>
            )}
        </button>
    );
};

/**
 * A day's slots split into Morning / Afternoon / Evening. A flat twenty-cell grid is
 * a wall; three labelled blocks are a schedule.
 */
export const DaypartSlots = ({
    slots,
    price,
    selected,
    onSelect,
    noteFor,
}: {
    slots: Slot[];
    price?: number;
    selected: number | null;
    onSelect: (minutes: number) => void;
    /** Optional per-slot caption, e.g. the instructor free at that time. */
    noteFor?: (slot: Slot) => string | undefined;
}) => {
    const groups = byDaypart(slots);
    return (
        <div className="flex flex-col gap-5">
            {groups.map(({ daypart, slots: block }) => {
                const open = block.filter((s) => s.status === "open").length;
                return (
                    <div key={daypart.id} className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between gap-3">
                            <MicroLabel>{daypart.label}</MicroLabel>
                            <span className="text-xs text-quaternary tabular-nums">{open} open</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-7">
                            {block.map((s) => (
                                <SlotButton
                                    key={s.minutes}
                                    label={s.label}
                                    status={s.status}
                                    blockedReason={s.blockedReason}
                                    price={price}
                                    note={noteFor?.(s)}
                                    selected={selected === s.minutes}
                                    onSelect={() => onSelect(s.minutes)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

/** One instructor's column in the facility calendar. */
export const CoachColumn = ({
    coach,
    slots,
    courseSlug,
    onPick,
}: {
    coach: Coach;
    slots: Slot[];
    courseSlug: string;
    onPick?: (minutes: number) => void;
}) => {
    const openCount = slots.filter((s) => s.status === "open").length;
    return (
        // Fixed width so a course with two instructors still reads as columns rather
        // than two full-width lists.
        <div className="flex w-52 shrink-0 flex-col rounded-xl bg-primary ring-1 ring-secondary ring-inset">
            <div className="flex flex-col items-center gap-2 border-b border-secondary px-3 py-4 text-center">
                <CoachAvatar coach={coach} size="sm" />
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-primary">{coach.name}</span>
                    <span className="text-xs text-tertiary">{coach.title.split("·")[0].trim()}</span>
                </div>
                {openCount > 0 ? (
                    <Badge color="success" size="sm" type="pill-color">
                        {openCount} open
                    </Badge>
                ) : (
                    <Badge color="gray" size="sm" type="pill-color">
                        Full
                    </Badge>
                )}
            </div>
            <div className="flex flex-col gap-1.5 p-2.5">
                {slots.map((s) => (
                    <SlotButton key={s.minutes} label={s.label} status={s.status} blockedReason={s.blockedReason} onSelect={() => onPick?.(s.minutes)} />
                ))}
            </div>
            <div className="border-t border-secondary px-3 py-2.5 text-center">
                <CourseChip slug={courseSlug} />
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Credits                                                             */
/* ------------------------------------------------------------------ */

/** Credit dots — five lessons read faster as five marks than as "3 of 5". */
export const CreditPips = ({ total, remaining }: { total: number; remaining: number }) => (
    <div className="flex items-center gap-1.5" role="img" aria-label={`${remaining} of ${total} credits remaining`}>
        {Array.from({ length: total }, (_, i) => (
            <span
                key={i}
                className={cx("size-3 rounded-full ring-1 ring-inset", i < remaining ? "ring-transparent" : "bg-secondary_subtle ring-secondary")}
                style={i < remaining ? { backgroundColor: MCG_GREEN } : undefined}
            />
        ))}
    </div>
);

/**
 * A credit balance as the golfer sees it in their wallet — and, read the other way,
 * the outstanding liability MCG carries for that instructor.
 */
export const CreditCardPanel = ({ balance, expired, action }: { balance: CreditBalance; expired?: boolean; action?: ReactNode }) => {
    const coach = coachById(balance.coachId)!;
    const pack = packageById(balance.packageId);
    const spent = balance.creditsRemaining === 0;
    return (
        <div className={cx("flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-inset", expired ? "ring-error_subtle" : "ring-secondary")}>
            <div className="flex items-start gap-3.5">
                <CoachAvatar coach={coach} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-md font-semibold text-primary">{pack?.label ?? "Lesson credits"}</span>
                    <span className="text-sm text-tertiary">with {coach.name}</span>
                </div>
                {expired && (
                    <Badge color="error" size="sm" type="pill-color">
                        Expired
                    </Badge>
                )}
                {!expired && spent && (
                    <Badge color="gray" size="sm" type="pill-color">
                        Used up
                    </Badge>
                )}
                {!expired && !spent && pack?.availability === "assigned" && (
                    <Badge color="blue" size="sm" type="pill-color">
                        Assigned
                    </Badge>
                )}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl bg-secondary_subtle px-4 py-3.5">
                <div className="flex flex-col gap-2">
                    <MicroLabel>Lessons remaining</MicroLabel>
                    <div className="flex items-center gap-3">
                        <span className="text-display-xs font-semibold text-primary tabular-nums">
                            {balance.creditsRemaining}
                            <span className="text-md font-medium text-tertiary">/{balance.creditsTotal}</span>
                        </span>
                        <CreditPips total={balance.creditsTotal} remaining={balance.creditsRemaining} />
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <MicroLabel>Value remaining</MicroLabel>
                    <span className="text-lg font-semibold text-primary tabular-nums">{money(balance.valueRemaining)}</span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                <MetaLine icon={Ticket02}>
                    {pack?.availability === "assigned" ? "Issued" : "Purchased"} {balance.purchasedOn}
                </MetaLine>
                <MetaLine icon={Calendar}>{balance.expiresOn ? `Expires ${balance.expiresOn}` : "No expiry"}</MetaLine>
                {pack && (
                    <MetaLine icon={Users01}>{pack.transferable ? "Transferable" : "Non-transferable"}</MetaLine>
                )}
            </div>

            {balance.history.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-secondary pt-3.5">
                    <MicroLabel>Redemption history</MicroLabel>
                    <div className="flex flex-col divide-y divide-secondary">
                        {balance.history.map((h) => (
                            <div key={`${h.date}-${h.label}`} className="flex items-center justify-between gap-4 py-2 text-sm">
                                <span className="min-w-0 flex-1 truncate text-secondary">{h.label}</span>
                                <span className="shrink-0 text-tertiary tabular-nums">{h.date}</span>
                                <span className="shrink-0 font-semibold text-primary tabular-nums">−{money(h.valueRelieved)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {action && <div className="flex flex-wrap gap-2.5">{action}</div>}
        </div>
    );
};

/** The howItWorks / included / restrictions triad, from the prototype's pack detail. */
export const PolicyList = ({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "neutral" | "good" | "limit" }) => (
    <div className="flex flex-col gap-2.5">
        <MicroLabel>{title}</MicroLabel>
        <ul className="flex flex-col gap-2">
            {items.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-secondary">
                    <span
                        className={cx(
                            "mt-1.5 size-1.5 shrink-0 rounded-full",
                            tone === "limit" && "bg-fg-warning-secondary",
                            tone === "neutral" && "bg-fg-quaternary",
                        )}
                        style={tone === "good" ? { backgroundColor: MCG_GREEN } : undefined}
                    />
                    {t}
                </li>
            ))}
        </ul>
    </div>
);

/* ------------------------------------------------------------------ */
/* Checkout                                                            */
/* ------------------------------------------------------------------ */

/** A line in an order summary — the Shop Checkout treatment. */
export const SummaryLine = ({ label, value, muted, strong }: { label: ReactNode; value: ReactNode; muted?: boolean; strong?: boolean }) => (
    <div className="flex items-start justify-between gap-4 py-1.5">
        <span className={cx("text-sm", strong ? "font-semibold text-primary" : muted ? "text-tertiary" : "text-secondary")}>{label}</span>
        <span className={cx("shrink-0 text-sm tabular-nums", strong ? "font-semibold text-primary" : muted ? "text-tertiary" : "text-secondary")}>{value}</span>
    </div>
);

/** The "you saved" / credit-applied callout, in MCG green. */
export const SavingNote = ({ children }: { children: ReactNode }) => (
    <div className="flex items-start gap-2.5 rounded-xl bg-success-secondary px-4 py-3">
        <CheckCircle className="mt-0.5 size-4 shrink-0 text-fg-success-secondary" aria-hidden="true" />
        <p className="text-sm text-success-primary">{children}</p>
    </div>
);

/** Numbered progress rail across the booking steps — the Progress Steps pattern, simplified. */
export const StepRail = ({ steps, current }: { steps: string[]; current: number }) => (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {steps.map((s, i) => {
            const done = i < current;
            const active = i === current;
            return (
                <li key={s} className="flex items-center gap-2">
                    <span
                        className={cx(
                            "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-1 ring-inset",
                            done && "bg-brand-solid text-white ring-transparent",
                            active && "bg-primary text-brand-secondary ring-2 ring-brand",
                            !done && !active && "bg-primary text-quaternary ring-secondary",
                        )}
                    >
                        {done ? <CheckCircle className="size-3.5" aria-hidden="true" /> : i + 1}
                    </span>
                    <span className={cx("text-sm", active ? "font-semibold text-primary" : done ? "text-secondary" : "text-quaternary")}>{s}</span>
                    {i < steps.length - 1 && <span className="mx-1 h-px w-5 bg-border-secondary" aria-hidden="true" />}
                </li>
            );
        })}
    </ol>
);

/** Credential row on the instructor profile. */
export const CredentialList = ({ items = [] }: { items?: string[] }) => (
    <ul className="flex flex-col gap-2">
        {items.map((c) => (
            <li key={c} className="flex items-start gap-2.5 text-sm text-secondary">
                <Award01 className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                {c}
            </li>
        ))}
    </ul>
);

/**
 * Exit guard — a booking half-filled is worth confirming before it's thrown away.
 * Lifted from the prototype's `exitConfirmModal`.
 */
export const ExitConfirm = ({ open, onStay, onLeave }: { open: boolean; onStay: () => void; onLeave: () => void }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-6" role="dialog" aria-modal="true" aria-labelledby="exit-confirm-title">
            <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-primary p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                    <h2 id="exit-confirm-title" className="text-lg font-semibold text-primary">
                        Leave without booking?
                    </h2>
                    <button type="button" onClick={onStay} aria-label="Close" className="text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary">
                        <XClose className="size-5" aria-hidden="true" />
                    </button>
                </div>
                <p className="text-sm text-tertiary">Your instructor, time and golfers won&rsquo;t be saved, and the slot goes back to the calendar.</p>
                <div className="flex flex-wrap justify-end gap-2.5">
                    <Button size="md" color="secondary" onClick={onStay}>
                        Keep booking
                    </Button>
                    <Button size="md" color="primary-destructive" onClick={onLeave}>
                        Discard
                    </Button>
                </div>
            </div>
        </div>
    );
};

/** Page-level hero band used at the top of the Academy screens. */
export const AcademyHero = ({ title, blurb, right }: { title: string; blurb: string; right?: ReactNode }) => (
    <div className="flex flex-col gap-5 border-b border-secondary bg-primary px-6 py-9 sm:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                    <McgLogo className="h-8 w-auto" />
                    <MicroLabel>MCG Academy</MicroLabel>
                </div>
                <h1 className="max-w-2xl text-display-sm font-semibold text-primary">{title}</h1>
                <p className="max-w-2xl text-md text-tertiary">{blurb}</p>
            </div>
            {right}
        </div>
    </div>
);

/** "Nine courses, one academy" strip — the county-system fact no single club has. */
export const CourseStrip = ({ slugs, activeSlug, onSelect }: { slugs: string[]; activeSlug?: string; onSelect?: (slug: string) => void }) => (
    <div className="flex flex-wrap gap-2">
        {slugs.map((slug) => {
            const active = slug === activeSlug;
            return (
                <button
                    key={slug}
                    type="button"
                    onClick={() => onSelect?.(slug)}
                    className={cx(
                        "flex items-center gap-2 rounded-full py-1.5 pr-4 pl-2 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
                        active ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
                    )}
                >
                    <img src={COURSE_LOGO[slug]} alt="" className="size-6 rounded-full bg-primary object-contain" />
                    {COURSE_NAME[slug]}
                </button>
            );
        })}
    </div>
);

/** Location line with the course name spelled out. */
export const CourseLine = ({ slug }: { slug: string }) => <MetaLine icon={MarkerPin01}>{COURSE_NAME[slug]}</MetaLine>;

/** One service on an instructor's profile menu, priced for that instructor. */
export const MenuItemRow = ({ service, coach, onBook, selected }: { service: LessonService; coach?: Coach; onBook?: () => void; selected?: boolean }) => {
    const rails = guardrailSummary(service);
    const one = servicePrice(service, coach, 1);
    return (
        <div
            className={cx(
                "flex flex-col gap-3 rounded-xl p-4 ring-1 transition duration-100 ease-linear ring-inset sm:flex-row sm:items-center sm:gap-5",
                selected ? "bg-brand-primary ring-2 ring-brand" : "bg-primary ring-secondary",
            )}
        >
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-primary">{service.name}</span>
                    <AudienceBadge audience={service.audience} />
                </div>
                <p className="text-sm text-tertiary">{service.desc}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <MetaLine icon={Clock}>{service.durationMin} min</MetaLine>
                    <MetaLine icon={Users01}>
                        {service.minPlayers === service.maxPlayers ? `${service.maxPlayers}` : `${service.minPlayers}–${service.maxPlayers}`} golfers
                    </MetaLine>
                    {rails && (
                        <span className="flex items-center gap-1.5 text-sm text-warning-primary">
                            <Calendar className="size-4 shrink-0" aria-hidden="true" />
                            {rails}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
                <div className="flex flex-col sm:items-end">
                    <span className="text-lg font-semibold text-primary tabular-nums">{money0(one)}</span>
                    {service.maxPlayers > 1 && (
                        <span className="text-xs text-tertiary tabular-nums">
                            {money0(perPlayer(service, coach, service.maxPlayers))} ea. at {service.maxPlayers}
                        </span>
                    )}
                </div>
                {onBook && (
                    <Button size="sm" color="primary" onClick={onBook}>
                        Book
                    </Button>
                )}
            </div>
        </div>
    );
};

/**
 * The page shell every Instruction screen sits in — the Global Nav top bar with
 * "Instruction" added, the MCG footer, and the brand-token override that turns every
 * brand-derived accent MCG green.
 *
 * Defined at module scope on purpose: nesting it inside a flow component would make it
 * a new component type on each render, remounting the whole tree (and dropping input
 * focus) every time a field changes.
 */
const ShellContext = createContext<((children: ReactNode) => ReactNode) | null>(null);

/**
 * Swap the shell out from above the flow.
 *
 * The two Instruction flows call `InstructionShell` in about forty places, once per
 * step branch. In Storybook that shell is right: the `TopNav` is the design-system
 * chrome and its links are meant to be inert. In the routed prototype it is wrong —
 * the golfer would land on Instruction and find every nav link dead.
 *
 * Rather than thread a prop through both flows (and every story), the prototype wraps
 * them in this provider and hands back `McgShell`. No provider means no override, so
 * Storybook renders exactly what it rendered before.
 */
export const InstructionShellProvider = ({ shell, children }: { shell: (children: ReactNode) => ReactNode; children: ReactNode }) => (
    <ShellContext.Provider value={shell}>{children}</ShellContext.Provider>
);

export const InstructionShell = ({ children }: { children: ReactNode }) => {
    const shell = useContext(ShellContext);
    if (shell) return <>{shell(children)}</>;

    return (
        <div className="flex min-h-dvh flex-col bg-secondary" style={clubBrandStyle(MCG_GREEN)}>
            <TopNav active="Instruction" club={MCG_CLUB} accountLabel="Justin G." items={NAV_ITEMS_WITH_INSTRUCTION} />
            <main className="flex-1">{children}</main>
            <SiteFooter club={MCG_CLUB} />
        </div>
    );
};

export type { Daypart };
