/**
 * Flow A — Book a Lesson.
 *
 * One component covering the whole golfer-facing booking path, driven by a `step` prop
 * so each state can be published as its own story while the screens stay clickable end
 * to end.
 *
 * Restructured against the Sagamore booking prototype. Three changes matter:
 *
 *  - **Service-first, not instructor-first.** You pick *what* before *who*. Only this
 *    order can carry a group clinic, which has a fixed roster rather than an
 *    instructor's open calendar — so privates and clinics share one catalog and one
 *    flow rather than living in parallel systems.
 *  - **"Any available instructor" is a first-class choice.** The MCG call's loudest
 *    complaint was landing on one pro's empty calendar and starting over. This fixes
 *    that at the front of the flow instead of after the golfer hits the wall.
 *  - **A waitlist instead of a dead end** when a day or a program is full.
 *
 * Built on the existing Fox chrome and checkout patterns: the Global Nav top bar and
 * footer, the Tee Times COURSE / DATE selector bar, the Tee Time Details participant
 * cards, and the Shop Checkout order summary — all re-skinned to MCG green.
 */

import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Bell01,
    Calendar,
    Check,
    CheckCircle,
    ChevronRight,
    Clock,
    CreditCard01,
    Edit03,
    InfoCircle,
    MarkerPin01,
    Plus,
    SearchLg,
    Ticket02,
    User01,
    Users01,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { TextArea } from "@/components/base/textarea/textarea";
import { mcgCourses } from "@/components/foundations/mcg/mcg-assets";
import { newId, useSession } from "@/components/mcg/session";
import { asset } from "@/utils/asset";
import { cx } from "@/utils/cx";
import { CalendarPanel, DEFAULT_DATE, fmtNice } from "@/stories/explorations/tee-search-popovers";
import { DropdownCell, MenuRow } from "@/stories/explorations/tenfore-chrome";
import {
    ANY_INSTRUCTOR,
    CATALOG_FILTERS,
    COACHES,
    COURSE_NAME,
    CREDIT_BALANCES,
    EMPTY_PARTICIPANT,
    HOST_PARTICIPANT,
    LESSON_SERVICES,
    MCG_GREEN,
    PROMOS,
    SAMPLE_GUESTS,
    WAITLIST_WINDOWS,
    type Coach,
    type LessonService,
    type Participant,
    type Slot,
    anyInstructorDay,
    applyGuardrails,
    clinicsForCoach,
    coachById,
    coachDay,
    coachesAtCourse,
    coachesForService,
    fromPrice,
    guardrailSummary,
    initialsOf,
    isoOf,
    money,
    money0,
    nextOpening,
    packagesForCoach,
    perPlayer,
    serviceById,
    servicePrice,
    servicesForCoach,
    slotLabel,
    spotsLeft,
} from "./instruction-catalog";
import {
    AcademyHero,
    AudienceBadge,
    CapacityMeter,
    CoachAvatar,
    CoachCard,
    CoachColumn,
    CourseChip,
    CourseStrip,
    CredentialList,
    DaypartSlots,
    ExitConfirm,
    FilterChips,
    InstructionShell,
    MenuItemRow,
    MetaLine,
    MicroLabel,
    PolicyList,
    Rating,
    SavingNote,
    SectionTitle,
    ServiceCard,
    StepRail,
    SummaryLine,
} from "./instruction-ui";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type BookingStep = "catalog" | "instructor" | "profile" | "facility" | "time" | "waitlist" | "details" | "checkout" | "confirmation";

export interface LessonBookingFlowProps {
    /** Which screen to open on. The flow stays navigable from there. */
    step?: BookingStep;
    serviceId?: string;
    /** "any" opens the flow with the any-available-instructor path selected. */
    coachId?: string;
    courseSlug?: string;
    players?: number;
    /** Checkout payment mode — card, or a credit from a lesson pack. */
    payWith?: "card" | "credit";
    /** Force the instructor's day to be full, for the dead-end story. */
    fullyBooked?: boolean;
    /** Open the catalog pre-filtered, e.g. "group". */
    filter?: string;
    /** Open the course selector on the instructor profile — the cross-course case. */
    highlightCourseSwitcher?: boolean;
    /**
     * Instructor-first mode. The instructor and lesson arrive already chosen, so the
     * flow drops its catalog and instructor steps, shows a three-step rail, and sends
     * "back" to the instructor's profile rather than to a catalog the golfer never saw.
     */
    locked?: boolean;
}

const PRIVATE_RAIL = ["Lesson", "Instructor", "Time", "Details", "Payment"];
/**
 * The instructor-first rail. The golfer picked a pro on /instruction and a lesson on
 * that pro's profile, so those two steps are already satisfied when they arrive at
 * /instruction/book — the rail starts at the first decision still open to them.
 */
const BOOKING_RAIL = ["Time", "Details", "Payment"];
const BOOKING_INDEX: Partial<Record<BookingStep, number>> = { time: 0, waitlist: 0, details: 1, checkout: 2, confirmation: 2 };
const GROUP_RAIL = ["Program", "Details", "Payment"];

const PRIVATE_INDEX: Partial<Record<BookingStep, number>> = {
    catalog: 0,
    instructor: 1,
    profile: 1,
    facility: 2,
    time: 2,
    waitlist: 2,
    details: 3,
    checkout: 4,
    confirmation: 4,
};
const GROUP_INDEX: Partial<Record<BookingStep, number>> = { catalog: 0, details: 1, waitlist: 1, checkout: 2, confirmation: 2 };

/** Catalog sections, in display order. */
const SECTION_ORDER = ["Featured", "Private lessons", "Group clinics & programs"];

/* ------------------------------------------------------------------ */
/* Flow                                                                */
/* ------------------------------------------------------------------ */

export const LessonBookingFlow = ({
    step: initialStep = "catalog",
    serviceId: initialServiceId = "private-45",
    coachId: initialCoachId = "mike-kenny",
    courseSlug: initialCourseSlug,
    players: initialPlayers = 1,
    payWith: initialPayWith = "card",
    fullyBooked = false,
    filter: initialFilter = "all",
    highlightCourseSwitcher = false,
    locked = false,
}: LessonBookingFlowProps) => {
    const { addActivity } = useSession();

    const [step, setStep] = useState<BookingStep>(initialStep);
    const [serviceId, setServiceId] = useState(initialServiceId);
    const [coachId, setCoachId] = useState(initialCoachId);

    const service = serviceById(serviceId) ?? LESSON_SERVICES[0];
    const isGroup = service.kind === "group";
    const pickedCoach = coachById(coachId);

    const [courseSlug, setCourseSlug] = useState(initialCourseSlug ?? service.courseSlug ?? pickedCoach?.courseSlugs[0] ?? "falls-road");
    const [date, setDate] = useState<Date>(DEFAULT_DATE);
    const [rateType, setRateType] = useState<"weekday" | "weekend">("weekday");
    const [players, setPlayers] = useState(initialPlayers);
    const [pickedMinutes, setPickedMinutes] = useState<number | null>(10 * 60 + 30);
    const [payWith, setPayWith] = useState<"card" | "credit">(initialPayWith);
    const [filter, setFilter] = useState(initialFilter);
    const [openCell, setOpenCell] = useState<null | "course" | "date" | "lesson">(null);
    const [exitOpen, setExitOpen] = useState(false);
    const [promoInput, setPromoInput] = useState("");
    const [promo, setPromo] = useState<string | null>(null);
    const [waitWindow, setWaitWindow] = useState("any");
    const [waitDays, setWaitDays] = useState<string[]>(["Sat", "Sun"]);

    const [participants, setParticipants] = useState<Participant[]>(() =>
        Array.from({ length: 4 }, (_, i) => (i === 0 ? HOST_PARTICIPANT : i < initialPlayers ? SAMPLE_GUESTS[i - 1] : EMPTY_PARTICIPANT)),
    );
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [note, setNote] = useState("");

    const closeCell = () => setOpenCell(null);
    const toggleCell = (k: "course" | "date" | "lesson") => setOpenCell((p) => (p === k ? null : k));

    /* ---------------- availability ---------------- */
    const rawSlots: Slot[] = isGroup
        ? []
        : coachId === "any"
          ? anyInstructorDay(courseSlug, date)
          : coachDay(coachId, courseSlug, date, { fullyBooked });
    const slots = isGroup ? [] : applyGuardrails(rawSlots, service, date);
    const openSlots = slots.filter((s) => s.status === "open");
    const pickedSlot = slots.find((s) => s.minutes === pickedMinutes && s.status === "open");

    /**
     * Under "any available instructor" the slot carries who's free, so the golfer sees
     * a real name from the moment they pick a time — never an unassigned booking.
     */
    const resolvedCoach: Coach | undefined =
        coachId === "any" ? coachById(pickedSlot?.coachId ?? coachesAtCourse(courseSlug)[0]?.id ?? "") : isGroup ? coachById(service.coachIds?.[0] ?? "") : pickedCoach;

    /* ---------------- pricing ---------------- */
    const lessonTotal = servicePrice(service, resolvedCoach, players);
    const facilityFee = 4;
    const creditBalance = resolvedCoach ? CREDIT_BALANCES.find((b) => b.coachId === resolvedCoach.id) : undefined;
    const creditEligible = Boolean(creditBalance && creditBalance.creditsRemaining > 0 && service.id === "private-45" && players === 1);
    const creditCovers = payWith === "credit" && creditEligible;
    const promoRule = promo ? PROMOS[promo] : null;
    const discount = promoRule ? (promoRule.type === "percent" ? (lessonTotal * promoRule.value) / 100 : Math.min(promoRule.value, lessonTotal)) : 0;
    const dueNow = creditCovers ? facilityFee : Math.max(0, lessonTotal - discount) + facilityFee;

    const rail = locked ? BOOKING_RAIL : isGroup ? GROUP_RAIL : PRIVATE_RAIL;
    const railIndex = (locked ? BOOKING_INDEX : isGroup ? GROUP_INDEX : PRIVATE_INDEX)[step] ?? 0;

    /** Pick a service and route by kind — a program skips instructor and time. */
    /**
     * Record the booking in the prototype session the first time the confirmation
     * renders, so it turns up under My account alongside tee times and orders.
     * `useSession` is inert outside the app, so this is a no-op in Storybook — and the
     * ref keeps a re-render (or a story that opens straight on `confirmation`) from
     * writing the same lesson twice.
     */
    const recorded = useRef(false);
    useEffect(() => {
        if (step !== "confirmation" || recorded.current) return;
        recorded.current = true;

        const booked = resolvedCoach ?? COACHES[0];
        const slug = service.courseSlug ?? courseSlug;
        addActivity({
            id: newId("lesson"),
            kind: "lesson",
            title: service.name,
            detail: `with ${booked.name} · ${COURSE_NAME[slug]}`,
            isoDate: isoOf(date),
            dateLabel: (isGroup ? service.schedule : undefined) ?? fmtNice(date),
            timeLabel: isGroup || pickedMinutes === null ? undefined : slotLabel(pickedMinutes),
            courseSlug: slug,
            amount: dueNow,
            status: "Upcoming",
        });
        // Deliberately keyed on the step alone: the booking is a snapshot taken once.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    const chooseService = (s: LessonService) => {
        setServiceId(s.id);
        setPlayers(1);
        if (s.kind === "group") {
            setCourseSlug(s.courseSlug ?? courseSlug);
            setCoachId(s.coachIds?.[0] ?? coachId);
            setStep(spotsLeft(s) === 0 ? "waitlist" : "details");
        } else {
            setStep("instructor");
        }
    };

    const chooseCoach = (id: string) => {
        setCoachId(id);
        const c = coachById(id);
        if (c && !c.isAny && !c.courseSlugs.includes(courseSlug)) setCourseSlug(c.courseSlugs[0]);
        setStep("time");
    };

    /* ================================================================ */
    /* 1 — Catalog: lessons and clinics in one place                    */
    /* ================================================================ */
    if (step === "catalog") {
        const match = CATALOG_FILTERS.find((f) => f.id === filter)?.match ?? null;
        const visible = LESSON_SERVICES.filter((s) => !match || s.tags.includes(match));
        const sections = SECTION_ORDER.map((label) => ({ label, items: visible.filter((s) => s.section === label) })).filter((g) => g.items.length > 0);

        return (
            <InstructionShell>
                <AcademyHero
                    title="Golf lessons & clinics"
                    blurb="Private lessons, playing lessons, multi-week clinics and junior camps across all nine MCG courses — in one place. Pick what you want to work on; we'll find you an instructor and a time."
                    right={
                        <div className="flex gap-3">
                            <div className="rounded-xl bg-secondary_subtle px-4 py-3 ring-1 ring-secondary ring-inset">
                                <MicroLabel>Instructors</MicroLabel>
                                <p className="text-display-xs font-semibold text-primary tabular-nums">{COACHES.length}</p>
                            </div>
                            <div className="rounded-xl bg-secondary_subtle px-4 py-3 ring-1 ring-secondary ring-inset">
                                <MicroLabel>Courses</MicroLabel>
                                <p className="text-display-xs font-semibold text-primary tabular-nums">{mcgCourses.length}</p>
                            </div>
                        </div>
                    }
                />

                <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8">
                    <StepRail steps={PRIVATE_RAIL} current={0} />

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <FilterChips options={CATALOG_FILTERS.map((f) => ({ id: f.id, label: f.label }))} value={filter} onChange={setFilter} />
                        <Button size="sm" color="secondary" iconLeading={Users01} onClick={() => setStep("facility")}>
                            See every instructor&rsquo;s calendar
                        </Button>
                    </div>

                    {sections.length === 0 ? (
                        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-primary px-6 py-14 text-center ring-1 ring-secondary ring-inset">
                            <SearchLg className="size-6 text-fg-quaternary" aria-hidden="true" />
                            <p className="text-md font-semibold text-primary">Nothing matches that filter</p>
                            <Button size="sm" color="secondary" onClick={() => setFilter("all")}>
                                Show everything
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-7 flex flex-col gap-9">
                            {sections.map(({ label, items }) => (
                                <section key={label} className="flex flex-col gap-4">
                                    <SectionTitle
                                        sub={
                                            label === "Group clinics & programs"
                                                ? "Scheduled programs with a fixed instructor, course and roster. Space is limited."
                                                : label === "Private lessons"
                                                  ? "Book with any MCG instructor. Prices shown are the lowest across the academy."
                                                  : undefined
                                        }
                                    >
                                        {label}
                                    </SectionTitle>
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {items.map((s) => (
                                            <ServiceCard key={s.id} service={s} selected={s.id === serviceId} onSelect={() => chooseService(s)} />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* 2 — Choose an instructor                                         */
    /* ================================================================ */
    if (step === "instructor") {
        const eligible = coachesForService(service, undefined);
        const options = [ANY_INSTRUCTOR, ...eligible];

        return (
            <InstructionShell>
                <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8">
                    <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep("catalog")}>
                        All lessons &amp; clinics
                    </Button>

                    <div className="mt-5">
                        <StepRail steps={rail} current={railIndex} />
                    </div>

                    <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="text-md font-semibold text-primary">{service.name}</span>
                                <AudienceBadge audience={service.audience} />
                            </div>
                            <Button size="sm" color="link-color" onClick={() => setStep("catalog")}>
                                Change lesson
                            </Button>
                        </div>
                        <p className="max-w-3xl text-sm text-tertiary">{service.desc}</p>
                    </div>

                    <div className="mt-7 flex flex-col gap-4">
                        <SectionTitle sub="Rates are the academy price for this lesson, adjusted for the instructor. Pick a person, or let us match you with whoever is free soonest.">
                            Who would you like?
                        </SectionTitle>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {options.map((c) => (
                                <CoachCard
                                    key={c.id}
                                    coach={c}
                                    service={service}
                                    price={servicePrice(service, c, 1)}
                                    nextOpen={c.isAny ? (anyInstructorDay(courseSlug, date).find((s) => s.status === "open")?.label ?? "—") : nextOpening(c.id, date)}
                                    selected={c.id === coachId}
                                    onSelect={() => chooseCoach(c.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* Instructor profile (branch)                                      */
    /* ================================================================ */
    if (step === "profile") {
        const coach = pickedCoach ?? COACHES[0];
        const menu = servicesForCoach(coach.id).filter((s) => s.kind === "private");
        const packs = packagesForCoach(coach.id);
        const programs = clinicsForCoach(coach.id);
        const multiCourse = coach.courseSlugs.length > 1;

        return (
            <InstructionShell>
                <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8">
                    <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep("instructor")}>
                        All instructors
                    </Button>

                    <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <div className="flex flex-wrap items-start gap-5">
                                    <CoachAvatar coach={coach} size="lg" />
                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                        <h1 className="text-display-xs font-semibold text-primary">{coach.name}</h1>
                                        <p className="text-md text-tertiary">{coach.title}</p>
                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                                            <Rating value={coach.rating} reviews={coach.reviews} />
                                            <MetaLine icon={Clock}>{coach.yearsTeaching} years teaching</MetaLine>
                                        </div>
                                    </div>
                                </div>
                                <p className="max-w-2xl text-md text-tertiary">{coach.bio}</p>

                                <div className="flex flex-col gap-2.5 border-t border-secondary pt-5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <MicroLabel>{multiCourse ? "Teaches at" : "Home course"}</MicroLabel>
                                        {multiCourse && (
                                            <Badge color="brand" size="sm" type="pill-color">
                                                {coach.courseSlugs.length} courses
                                            </Badge>
                                        )}
                                    </div>
                                    <CourseStrip slugs={coach.courseSlugs} activeSlug={courseSlug} onSelect={setCourseSlug} />
                                    {multiCourse && (
                                        <p className={cx("text-sm", highlightCourseSwitcher ? "font-medium text-brand-secondary" : "text-tertiary")}>
                                            One lesson menu, {coach.courseSlugs.length} calendars. Pick a course and availability follows — no duplicated menu items.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <section className="flex flex-col gap-4">
                                <SectionTitle sub="The academy menu, priced for this instructor. Party size splits the total — the instructor's hour is the same either way.">
                                    Lessons with {coach.name}
                                </SectionTitle>
                                <div className="flex flex-col gap-3">
                                    {menu.map((s) => (
                                        <MenuItemRow
                                            key={s.id}
                                            service={s}
                                            coach={coach}
                                            selected={s.id === serviceId}
                                            onBook={() => {
                                                setServiceId(s.id);
                                                setPlayers(1);
                                                setCoachId(coach.id);
                                                setStep("time");
                                            }}
                                        />
                                    ))}
                                </div>
                            </section>

                            {programs.length > 0 && (
                                <section className="flex flex-col gap-4">
                                    <SectionTitle sub="Same catalog, same checkout — a program is a service with a roster instead of an open calendar.">
                                        Programs {coach.name} runs
                                    </SectionTitle>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {programs.map((p) => (
                                            <ServiceCard key={p.id} service={p} onSelect={() => chooseService(p)} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        <aside className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
                            <div className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                                <div className="flex items-end justify-between gap-3">
                                    <div className="flex flex-col">
                                        <MicroLabel>Lessons from</MicroLabel>
                                        <span className="text-display-xs font-semibold text-primary tabular-nums">{money0(fromPrice(coach.id))}</span>
                                    </div>
                                    <CourseChip slug={courseSlug} size="md" />
                                </div>
                                <div className="flex items-center gap-2 rounded-xl bg-secondary_subtle px-3.5 py-3">
                                    <Clock className="size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                    <span className="text-sm text-secondary">
                                        Next opening <span className="font-semibold text-primary">{nextOpening(coach.id, date)}</span>
                                    </span>
                                </div>
                                <Button size="lg" color="primary" iconTrailing={ArrowRight} onClick={() => setStep("time")}>
                                    Book a lesson
                                </Button>
                                <Button size="md" color="secondary" iconLeading={Users01} onClick={() => setStep("facility")}>
                                    Compare instructors
                                </Button>
                            </div>

                            {packs.length > 0 && (
                                <div className="flex flex-col gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                                    <SectionTitle sub="Rates are set per instructor, so packages are too.">Lesson packages</SectionTitle>
                                    {packs.map((p) => (
                                        <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-secondary_subtle px-4 py-3">
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate text-sm font-semibold text-primary">{p.label}</span>
                                                <span className="text-xs text-tertiary tabular-nums">
                                                    {money0(p.perLessonPrice)} per lesson · save {money0(p.savings)}
                                                </span>
                                            </div>
                                            <span className="shrink-0 text-md font-semibold text-primary tabular-nums">{money0(p.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                                <SectionTitle>Credentials</SectionTitle>
                                <CredentialList items={coach.credentials} />
                            </div>
                        </aside>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* Facility calendar (branch)                                       */
    /* ================================================================ */
    if (step === "facility") {
        const atCourse = coachesAtCourse(courseSlug);
        const window = (id: string) => coachDay(id, courseSlug, date).filter((s) => s.minutes >= 8 * 60 && s.minutes <= 15 * 60);

        return (
            <InstructionShell>
                <AcademyHero
                    title={`Who's available at ${COURSE_NAME[courseSlug]}`}
                    blurb="Every instructor at one course, side by side, for one day. The question the pro shop gets asked at the counter — answered on one screen."
                />
                <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8">
                    <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep("catalog")}>
                        Back to lessons &amp; clinics
                    </Button>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <CourseStrip slugs={Object.keys(COURSE_NAME)} activeSlug={courseSlug} onSelect={setCourseSlug} />
                        <div className="flex rounded-xl bg-primary shadow-sm ring-1 ring-secondary">
                            <DropdownCell label="Date" value={fmtNice(date)} open={openCell === "date"} onToggle={() => toggleCell("date")} onClose={closeCell} align="right" edge="right">
                                <CalendarPanel selected={date} onSelect={setDate} rateType={rateType} onRateType={setRateType} onDone={closeCell} showPrices={false} />
                            </DropdownCell>
                        </div>
                    </div>

                    {atCourse.length === 0 ? (
                        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-primary px-6 py-14 text-center ring-1 ring-secondary ring-inset">
                            <InfoCircle className="size-6 text-fg-quaternary" aria-hidden="true" />
                            <p className="text-md font-semibold text-primary">No instructors are based at {COURSE_NAME[courseSlug]}</p>
                            <p className="max-w-md text-sm text-tertiary">Pick another course above — or ask the Academy about travelling instruction.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                                {atCourse.map((c) => (
                                    <CoachColumn
                                        key={c.id}
                                        coach={c}
                                        courseSlug={courseSlug}
                                        slots={window(c.id)}
                                        onPick={(minutes) => {
                                            setPickedMinutes(minutes);
                                            setCoachId(c.id);
                                            setServiceId("private-45");
                                            setStep("details");
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="mt-4 flex items-center gap-2 text-sm text-tertiary">
                                <InfoCircle className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                Times shown are 45-minute private slots. Pick any open time to book it directly.
                            </p>
                        </>
                    )}
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* 3 — Pick a time                                                  */
    /* ================================================================ */
    if (step === "time") {
        const coach = pickedCoach ?? ANY_INSTRUCTOR;
        const rails = guardrailSummary(service);
        const anyMode = coachId === "any";
        const courseOptions = anyMode ? Object.keys(COURSE_NAME) : coach.courseSlugs;

        return (
            <InstructionShell>
                <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8">
                    {locked ? (
                        <Button size="sm" color="link-gray" iconLeading={ArrowLeft} href={`/instruction/pro/${coach.id}`}>
                            Back to {coach.name}
                        </Button>
                    ) : (
                        <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep("instructor")}>
                            Change instructor
                        </Button>
                    )}

                    <div className="mt-5">
                        <StepRail steps={rail} current={railIndex} />
                    </div>

                    <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <CoachAvatar coach={coach} />
                                <div className="flex flex-col">
                                    <span className="text-md font-semibold text-primary">{coach.name}</span>
                                    <span className="text-sm text-tertiary">{service.name}</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <AudienceBadge audience={service.audience} />
                                <CourseChip slug={courseSlug} />
                            </div>
                        </div>

                        <div className="flex flex-col divide-y divide-secondary rounded-xl bg-secondary_subtle ring-1 ring-secondary sm:flex-row sm:divide-x sm:divide-y-0">
                            <DropdownCell label="Lesson" value={service.name} open={openCell === "lesson"} onToggle={() => toggleCell("lesson")} onClose={closeCell} align="left" edge="left">
                                <div className="w-72">
                                    <p className="mb-3 text-sm font-semibold text-primary">Lesson type</p>
                                    <div className="flex flex-col gap-0.5">
                                        {LESSON_SERVICES.filter((s) => s.kind === "private").map((s) => (
                                            <MenuRow
                                                key={s.id}
                                                selected={s.id === serviceId}
                                                onClick={() => {
                                                    setServiceId(s.id);
                                                    setPlayers(1);
                                                }}
                                                label={s.name}
                                                right={<span className="text-xs text-tertiary tabular-nums">{money0(servicePrice(s, coach, 1))}</span>}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </DropdownCell>
                            <DropdownCell label="Course" value={COURSE_NAME[courseSlug]} open={openCell === "course"} onToggle={() => toggleCell("course")} onClose={closeCell} align="center">
                                <div className="w-64">
                                    <p className="mb-3 text-sm font-semibold text-primary">Course</p>
                                    <div className="flex flex-col gap-0.5">
                                        {courseOptions.map((slug) => (
                                            <MenuRow key={slug} selected={slug === courseSlug} onClick={() => setCourseSlug(slug)} label={COURSE_NAME[slug]} />
                                        ))}
                                    </div>
                                </div>
                            </DropdownCell>
                            <DropdownCell label="Date" value={fmtNice(date)} open={openCell === "date"} onToggle={() => toggleCell("date")} onClose={closeCell} align="right" edge="right">
                                <CalendarPanel selected={date} onSelect={setDate} rateType={rateType} onRateType={setRateType} onDone={closeCell} showPrices={false} />
                            </DropdownCell>
                        </div>

                        {anyMode && (
                            <div className="flex items-start gap-2.5 rounded-xl bg-success-secondary px-4 py-3">
                                <Users01 className="mt-0.5 size-4 shrink-0 text-fg-success-secondary" aria-hidden="true" />
                                <p className="text-sm text-success-primary">
                                    Showing every open slot at {COURSE_NAME[courseSlug]} across {coachesAtCourse(courseSlug).length}
                                    {" instructors. Each time shows who’s free — you’ll see your instructor before you pay."}
                                </p>
                            </div>
                        )}

                        {rails && (
                            <div className="flex items-start gap-2.5 rounded-xl bg-warning-secondary px-4 py-3">
                                <Calendar className="mt-0.5 size-4 shrink-0 text-fg-warning-secondary" aria-hidden="true" />
                                <p className="text-sm text-warning-primary">
                                    <span className="font-semibold">{service.name}</span> is offered {rails}. Times outside that window show as unavailable.
                                </p>
                            </div>
                        )}

                        {openSlots.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 rounded-xl bg-secondary_subtle px-6 py-10 text-center">
                                <Clock className="size-6 text-fg-quaternary" aria-hidden="true" />
                                <p className="text-md font-semibold text-primary">
                                    {coach.name} has nothing open on {fmtNice(date)}
                                </p>
                                <p className="max-w-md text-sm text-tertiary">
                                    Nothing here sends you back to the start. Try another day, let us match you with whoever is free, or join the waitlist and we&rsquo;ll
                                    text you when something opens.
                                </p>
                                <div className="mt-1 flex flex-wrap justify-center gap-2.5">
                                    <Button size="sm" color="primary" iconLeading={Users01} onClick={() => chooseCoach("any")}>
                                        Any available instructor
                                    </Button>
                                    <Button size="sm" color="secondary" iconLeading={Bell01} onClick={() => setStep("waitlist")}>
                                        Join the waitlist
                                    </Button>
                                    <Button size="sm" color="link-gray" iconLeading={Calendar} onClick={() => setDate(new Date(date.getTime() + 86400000))}>
                                        Try {fmtNice(new Date(date.getTime() + 86400000))}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <MicroLabel>{openSlots.length} open times</MicroLabel>
                                    <span className="text-sm text-tertiary tabular-nums">
                                        {money0(servicePrice(service, resolvedCoach, 1))} · {service.durationMin} min
                                    </span>
                                </div>
                                <DaypartSlots
                                    slots={slots}
                                    price={anyMode ? undefined : servicePrice(service, coach, 1)}
                                    selected={pickedMinutes}
                                    onSelect={setPickedMinutes}
                                    noteFor={anyMode ? (s) => (s.coachId ? coachById(s.coachId)?.name : undefined) : undefined}
                                />
                                <div className="flex items-center justify-between gap-4 border-t border-secondary pt-5">
                                    <Button size="md" color="link-gray" iconLeading={Bell01} onClick={() => setStep("waitlist")}>
                                        Nothing works? Join the waitlist
                                    </Button>
                                    <Button size="lg" color="primary" iconTrailing={ArrowRight} isDisabled={!pickedSlot} onClick={() => setStep("details")}>
                                        Continue
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* Waitlist (branch)                                                */
    /* ================================================================ */
    if (step === "waitlist") {
        const coach = resolvedCoach ?? ANY_INSTRUCTOR;
        const full = isGroup && spotsLeft(service) === 0;
        const toggleDay = (d: string) => setWaitDays((list) => (list.includes(d) ? list.filter((x) => x !== d) : [...list, d]));

        return (
            <InstructionShell>
                <div className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-8">
                    <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep(isGroup ? "catalog" : "time")}>
                        Back
                    </Button>

                    <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                        <div className="flex items-start gap-3.5">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-warning-secondary">
                                <Bell01 className="size-5 text-fg-warning-secondary" aria-hidden="true" />
                            </span>
                            <div className="flex flex-col gap-1">
                                <h1 className="text-display-xs font-semibold text-primary">Join the waitlist</h1>
                                <p className="text-md text-tertiary">
                                    {full
                                        ? `${service.name} is full. We'll text you the moment a spot opens — you keep your place in line until it does.`
                                        : `We'll text you as soon as a matching slot opens with ${coach.name}. No charge until you accept.`}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 rounded-xl bg-secondary_subtle px-4 py-3.5">
                            <MicroLabel>You&rsquo;re waiting for</MicroLabel>
                            <span className="text-sm font-semibold text-primary">{service.name}</span>
                            <div className="flex flex-wrap gap-x-5 gap-y-1">
                                <MetaLine icon={User01}>{coach.name}</MetaLine>
                                <MetaLine icon={MarkerPin01}>{COURSE_NAME[courseSlug]}</MetaLine>
                                {isGroup ? <MetaLine icon={Calendar}>{service.schedule}</MetaLine> : <MetaLine icon={Calendar}>From {fmtNice(date)}</MetaLine>}
                            </div>
                            {isGroup && <CapacityMeter service={service} />}
                        </div>

                        {!isGroup && (
                            <>
                                <div className="flex flex-col gap-2.5">
                                    <MicroLabel>Times that work</MicroLabel>
                                    <FilterChips options={WAITLIST_WINDOWS.map((w) => ({ id: w.id, label: w.label }))} value={waitWindow} onChange={setWaitWindow} />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <MicroLabel>Days that work</MicroLabel>
                                    <div className="flex flex-wrap gap-1.5">
                                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
                                            const on = waitDays.includes(d);
                                            return (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    onClick={() => toggleDay(d)}
                                                    className={cx(
                                                        "rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
                                                        on ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
                                                    )}
                                                >
                                                    {d}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5 rounded-xl bg-secondary_subtle px-4 py-3.5">
                                    <InfoCircle className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                    <p className="text-sm text-tertiary">
                                        Widening to <span className="font-semibold text-secondary">any available instructor</span> would put{" "}
                                        {anyInstructorDay(courseSlug, date).filter((s) => s.status === "open").length} slots in front of you today.
                                    </p>
                                </div>
                            </>
                        )}

                        <div className="flex flex-col gap-3 border-t border-secondary pt-5">
                            <Input label="Mobile number" defaultValue={HOST_PARTICIPANT.phone} />
                            <div className="flex flex-wrap gap-2.5">
                                <Button size="lg" color="primary" iconLeading={Bell01}>
                                    Add me to the waitlist
                                </Button>
                                {!isGroup && (
                                    <Button size="lg" color="secondary" onClick={() => chooseCoach("any")}>
                                        Show me any instructor instead
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* 4 — Details (private) / program enrolment (group)                */
    /* ================================================================ */
    if (step === "details") {
        const coach = resolvedCoach ?? COACHES[0];
        const maxPlayers = service.maxPlayers;
        const isJunior = service.audience === "junior";
        const setParticipant = (i: number, patch: Partial<Participant>) => setParticipants((list) => list.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

        return (
            <InstructionShell>
                <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8">
                    <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep(isGroup ? "catalog" : "time")}>
                        {isGroup ? "All lessons & clinics" : "Change time"}
                    </Button>

                    <div className="mt-5">
                        <StepRail steps={rail} current={railIndex} />
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                        <div className="flex flex-col gap-6">
                            {/* A program is a fixed roster, so there's a schedule instead of a calendar */}
                            {isGroup && (
                                <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                    <SectionTitle sub={service.desc}>{service.name}</SectionTitle>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="flex flex-col gap-1 rounded-xl bg-secondary_subtle px-4 py-3.5">
                                            <MicroLabel>Schedule</MicroLabel>
                                            <span className="text-sm font-semibold text-primary">{service.schedule}</span>
                                            <span className="text-sm text-tertiary">
                                                {service.sessions} {service.sessions === 1 ? "session" : "sessions"} · {service.durationMin} min each
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 rounded-xl bg-secondary_subtle px-4 py-3.5">
                                            <MicroLabel>Where &amp; who</MicroLabel>
                                            <span className="text-sm font-semibold text-primary">{COURSE_NAME[service.courseSlug ?? courseSlug]}</span>
                                            <span className="text-sm text-tertiary">
                                                {coach.name} · {service.ageGroup}
                                            </span>
                                        </div>
                                    </div>
                                    <CapacityMeter service={service} />
                                    {spotsLeft(service) === 0 && (
                                        <Button size="md" color="secondary" iconLeading={Bell01} onClick={() => setStep("waitlist")}>
                                            Full — join the waitlist
                                        </Button>
                                    )}
                                </section>
                            )}

                            {!isGroup && maxPlayers > 1 && (
                                <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                    <SectionTitle
                                        sub={`${service.name} takes ${service.minPlayers}–${maxPlayers} golfers. The instructor's ${service.durationMin} minutes are the same either way, so the total climbs slowly and each golfer pays less.`}
                                    >
                                        How many golfers?
                                    </SectionTitle>
                                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                                        {Array.from({ length: maxPlayers }, (_, i) => i + 1).map((n) => {
                                            const active = players === n;
                                            return (
                                                <button
                                                    key={n}
                                                    type="button"
                                                    onClick={() => setPlayers(n)}
                                                    className={cx(
                                                        "flex flex-col items-start gap-1 rounded-xl px-4 py-3.5 text-left ring-1 transition duration-100 ease-linear ring-inset",
                                                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                                                        active ? "bg-brand-primary ring-2 ring-brand" : "bg-secondary_subtle ring-secondary hover:bg-primary_hover",
                                                    )}
                                                >
                                                    <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                                                        <Users01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                                        {n} {n === 1 ? "golfer" : "golfers"}
                                                    </span>
                                                    <span className="text-md font-semibold text-primary tabular-nums">{money0(servicePrice(service, coach, n))}</span>
                                                    <span className="text-xs text-tertiary tabular-nums">{money0(perPlayer(service, coach, n))} each</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <SectionTitle
                                    sub={
                                        isJunior
                                            ? "Junior sessions collect an age so the instructor can plan around it."
                                            : isGroup
                                              ? "One seat per enrolment. Add another golfer by enrolling them separately."
                                              : "Everyone taking the lesson, so the instructor knows who to expect."
                                    }
                                >
                                    {isGroup ? "Who's enrolling" : "Who's taking the lesson"}
                                </SectionTitle>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {participants.slice(0, isGroup ? 1 : players).map((p, i) => {
                                        const filled = Boolean(p.first);
                                        const open = editIndex === i;
                                        return (
                                            <div key={i} className={cx("flex flex-col rounded-xl ring-1 transition duration-100 ease-linear ring-inset", open ? "ring-2 ring-brand" : "ring-secondary")}>
                                                <button type="button" onClick={() => setEditIndex(open ? null : i)} className="flex items-center gap-3 px-4 py-3.5 text-left">
                                                    <span
                                                        className={cx(
                                                            "flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                                                            filled ? "text-white" : "bg-secondary text-quaternary",
                                                        )}
                                                        style={filled ? { backgroundColor: MCG_GREEN } : undefined}
                                                    >
                                                        {filled ? initialsOf(p) : <User01 className="size-5" aria-hidden="true" />}
                                                    </span>
                                                    <span className="flex min-w-0 flex-1 flex-col">
                                                        <span className="truncate text-sm font-semibold text-primary">{filled ? `${p.first} ${p.last}` : `Golfer ${i + 1}`}</span>
                                                        <span className="truncate text-xs text-tertiary">
                                                            {filled ? (isJunior && p.age ? `Age ${p.age} · ${p.email}` : p.email) : "Add their details"}
                                                        </span>
                                                    </span>
                                                    <span className="shrink-0 text-fg-quaternary">
                                                        {filled ? <Edit03 className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
                                                    </span>
                                                </button>
                                                {open && (
                                                    <div className="flex flex-col gap-3 border-t border-secondary px-4 py-4">
                                                        <div className="grid gap-3 sm:grid-cols-2">
                                                            <Input label="First name" value={p.first} onChange={(v) => setParticipant(i, { first: v })} placeholder="First" />
                                                            <Input label="Last name" value={p.last} onChange={(v) => setParticipant(i, { last: v })} placeholder="Last" />
                                                        </div>
                                                        <Input label="Email" value={p.email} onChange={(v) => setParticipant(i, { email: v })} placeholder="name@example.com" />
                                                        <div className="grid gap-3 sm:grid-cols-2">
                                                            <Input label="Phone" value={p.phone} onChange={(v) => setParticipant(i, { phone: v })} placeholder="(240) 555-0100" />
                                                            {isJunior && <Input label="Age" value={p.age ?? ""} onChange={(v) => setParticipant(i, { age: v })} placeholder="11" />}
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <Button size="sm" color="secondary" iconLeading={Check} onClick={() => setEditIndex(null)}>
                                                                Done
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <SectionTitle sub="Optional — what you'd like to work on, or anything the instructor should know.">Note for {coach.name}</SectionTitle>
                                <TextArea
                                    aria-label={`Note for ${coach.name}`}
                                    rows={3}
                                    value={note}
                                    onChange={setNote}
                                    placeholder="Slicing my driver, and I play at Falls Road most Saturdays."
                                />
                            </section>
                        </div>

                        <LessonSummary
                            coach={coach}
                            service={service}
                            courseSlug={courseSlug}
                            date={date}
                            minutes={pickedMinutes}
                            players={players}
                            lessonTotal={lessonTotal}
                            facilityFee={facilityFee}
                            total={lessonTotal + facilityFee}
                            matched={coachId === "any"}
                            cta={
                                <Button size="lg" color="primary" iconTrailing={ArrowRight} isDisabled={isGroup && spotsLeft(service) === 0} onClick={() => setStep("checkout")}>
                                    Continue to payment
                                </Button>
                            }
                        />
                    </div>
                </div>
                <ExitConfirm open={exitOpen} onStay={() => setExitOpen(false)} onLeave={() => { setExitOpen(false); setStep("catalog"); }} />
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* 5 — Checkout                                                     */
    /* ================================================================ */
    if (step === "checkout") {
        const coach = resolvedCoach ?? COACHES[0];
        const hasCredit = Boolean(creditBalance && creditBalance.creditsRemaining > 0);
        const applyPromo = () => {
            const code = promoInput.trim().toUpperCase();
            if (PROMOS[code]) {
                setPromo(code);
                setPromoInput("");
            }
        };

        return (
            <InstructionShell>
                <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep("details")}>
                            Back to details
                        </Button>
                        <Button size="sm" color="link-gray" onClick={() => setExitOpen(true)}>
                            Cancel booking
                        </Button>
                    </div>

                    <div className="mt-5">
                        <StepRail steps={rail} current={railIndex} />
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                        <div className="flex flex-col gap-6">
                            <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <SectionTitle sub="MCG charges online bookings at the time you book. No invoices.">How you&rsquo;re paying</SectionTitle>

                                <div className="flex flex-col gap-3">
                                    {hasCredit && (
                                        <button
                                            type="button"
                                            onClick={() => creditEligible && setPayWith("credit")}
                                            disabled={!creditEligible}
                                            className={cx(
                                                "flex items-start gap-3.5 rounded-xl px-4 py-4 text-left ring-1 transition duration-100 ease-linear ring-inset",
                                                payWith === "credit" && creditEligible ? "bg-brand-primary ring-2 ring-brand" : "bg-secondary_subtle ring-secondary",
                                                !creditEligible && "cursor-not-allowed opacity-50",
                                            )}
                                        >
                                            <RadioButtonBase size="md" isSelected={payWith === "credit" && creditEligible} isDisabled={!creditEligible} />
                                            <span className="flex min-w-0 flex-1 flex-col gap-1">
                                                <span className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-semibold text-primary">Use a lesson credit</span>
                                                    <Badge color="success" size="sm" type="pill-color">
                                                        {creditBalance!.creditsRemaining} available
                                                    </Badge>
                                                </span>
                                                <span className="text-sm text-tertiary">
                                                    {creditEligible
                                                        ? `From your ${creditBalance!.creditsTotal}-lesson pack with ${coach.name} — covers the lesson in full, and you'll still pay the facility fee.`
                                                        : `Your credits cover 45-minute privates with ${coach.name}, one golfer at a time. This booking doesn't qualify.`}
                                                </span>
                                            </span>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setPayWith("card")}
                                        className={cx(
                                            "flex items-start gap-3.5 rounded-xl px-4 py-4 text-left ring-1 transition duration-100 ease-linear ring-inset",
                                            payWith === "card" ? "bg-brand-primary ring-2 ring-brand" : "bg-secondary_subtle ring-secondary",
                                        )}
                                    >
                                        <RadioButtonBase size="md" isSelected={payWith === "card"} />
                                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                                            <span className="text-sm font-semibold text-primary">Pay by card</span>
                                            <span className="text-sm text-tertiary">Charged now. Your card is saved so {coach.name} can book and charge you directly next time.</span>
                                        </span>
                                        <img src={asset("card-images/Visa.svg")} alt="Visa" className="h-5 w-auto shrink-0" />
                                    </button>
                                </div>

                                {payWith === "card" && (
                                    <div className="flex flex-col gap-3 border-t border-secondary pt-5">
                                        <Input label="Name on card" defaultValue="Justin Girard" />
                                        <Input label="Card number" icon={CreditCard01} defaultValue="4242 4242 4242 4242" />
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <Input label="Expiry" defaultValue="04 / 28" />
                                            <Input label="CVV" defaultValue="123" />
                                        </div>
                                    </div>
                                )}

                                {payWith === "credit" && creditEligible && (
                                    <SavingNote>
                                        One credit applied — {money(servicePrice(service, coach, 1))} covered. That leaves {creditBalance!.creditsRemaining - 1} lessons with{" "}
                                        {coach.name}
                                        {creditBalance!.expiresOn ? `, good through ${creditBalance!.expiresOn}.` : " — no expiry."}
                                    </SavingNote>
                                )}
                            </section>

                            {/* Promo code — the academy runs junior and veteran discounts */}
                            <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <SectionTitle>Promo code</SectionTitle>
                                {promoRule ? (
                                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-success-secondary px-4 py-3">
                                        <span className="flex items-center gap-2.5 text-sm font-semibold text-success-primary">
                                            <CheckCircle className="size-4 shrink-0 text-fg-success-secondary" aria-hidden="true" />
                                            {promo} — {promoRule.label}
                                        </span>
                                        <Button size="sm" color="link-gray" onClick={() => setPromo(null)}>
                                            Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap items-end gap-3">
                                        <Input aria-label="Promo code" placeholder="MCGJUNIOR" value={promoInput} onChange={setPromoInput} wrapperClassName="flex-1 min-w-48" />
                                        <Button size="md" color="secondary" onClick={applyPromo} isDisabled={!promoInput.trim()}>
                                            Apply
                                        </Button>
                                    </div>
                                )}
                            </section>

                            <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <SectionTitle>Cancellation</SectionTitle>
                                <div className="flex items-start gap-2.5">
                                    <InfoCircle className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                    <p className="max-w-xl text-sm text-tertiary">
                                        Cancel or reschedule at least 24 hours before your lesson and your credit or payment is returned in full. Inside 24 hours the lesson is
                                        charged, at the instructor&rsquo;s discretion.
                                    </p>
                                </div>
                            </section>
                        </div>

                        <LessonSummary
                            coach={coach}
                            service={service}
                            courseSlug={courseSlug}
                            date={date}
                            minutes={pickedMinutes}
                            players={players}
                            lessonTotal={lessonTotal}
                            facilityFee={facilityFee}
                            total={dueNow}
                            creditApplied={creditCovers ? lessonTotal : 0}
                            discount={creditCovers ? 0 : discount}
                            discountLabel={promoRule?.label}
                            matched={coachId === "any"}
                            cta={
                                <Button size="lg" color="primary" onClick={() => setStep("confirmation")}>
                                    {creditCovers ? `Confirm — pay ${money(dueNow)}` : `Pay ${money(dueNow)}`}
                                </Button>
                            }
                        />
                    </div>
                </div>
                <ExitConfirm open={exitOpen} onStay={() => setExitOpen(false)} onLeave={() => { setExitOpen(false); setStep("catalog"); }} />
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* 6 — Confirmation                                                 */
    /* ================================================================ */
    const coach = resolvedCoach ?? COACHES[0];
    const remaining = creditCovers && creditBalance ? creditBalance.creditsRemaining - 1 : creditBalance?.creditsRemaining;

    return (
        <InstructionShell>
            <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-8">
                <div className="flex flex-col items-center gap-3 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-success-secondary">
                        <CheckCircle className="size-7 text-fg-success-primary" aria-hidden="true" />
                    </span>
                    <h1 className="text-display-sm font-semibold text-primary">{isGroup ? "You're enrolled" : "Lesson booked"}</h1>
                    <p className="max-w-lg text-md text-tertiary">
                        You&rsquo;re on {coach.name}&rsquo;s {isGroup ? "roster" : "calendar"}. A confirmation is on its way to {HOST_PARTICIPANT.email}, and it&rsquo;s in your
                        MCG account under Instruction.
                    </p>
                </div>

                <div className="mt-8 flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-secondary pb-5">
                        <div className="flex items-center gap-3.5">
                            <CoachAvatar coach={coach} />
                            <div className="flex flex-col">
                                <span className="text-md font-semibold text-primary">{coach.name}</span>
                                <span className="text-sm text-tertiary">{service.name}</span>
                            </div>
                        </div>
                        <Badge color="success" size="md" type="pill-color">
                            Confirmed
                        </Badge>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex flex-col gap-1">
                            <MicroLabel>When</MicroLabel>
                            <span className="text-sm font-semibold text-primary">{isGroup ? service.schedule : fmtNice(date)}</span>
                            <span className="text-sm text-tertiary tabular-nums">
                                {isGroup
                                    ? `${service.sessions} ${service.sessions === 1 ? "session" : "sessions"} · ${service.durationMin} min each`
                                    : `${pickedMinutes !== null ? slotLabel(pickedMinutes) : "—"} · ${service.durationMin} min`}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <MicroLabel>Where</MicroLabel>
                            <span className="text-sm font-semibold text-primary">{COURSE_NAME[service.courseSlug ?? courseSlug]}</span>
                            <span className="text-sm text-tertiary">Learning centre · meet at the lesson tee</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <MicroLabel>{isGroup ? "Enrolled" : "Golfers"}</MicroLabel>
                            <span className="text-sm font-semibold text-primary">{isGroup ? 1 : players}</span>
                            <span className="text-sm text-tertiary">
                                {participants
                                    .slice(0, isGroup ? 1 : players)
                                    .map((p) => p.first)
                                    .filter(Boolean)
                                    .join(", ")}
                            </span>
                        </div>
                    </div>

                    {coachId === "any" && (
                        <div className="flex items-start gap-2.5 rounded-xl bg-secondary_subtle px-4 py-3.5">
                            <Users01 className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                            <p className="text-sm text-tertiary">
                                You asked for any available instructor and we matched you with{" "}
                                <span className="font-semibold text-secondary">{coach.name}</span>. Want someone else? Reschedule free up to 24 hours before.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-1 border-t border-secondary pt-5">
                        <MicroLabel>Payment</MicroLabel>
                        {creditCovers ? (
                            <>
                                <SummaryLine label={`${service.name} — 1 lesson credit`} value={`−${money(lessonTotal)}`} />
                                <SummaryLine label="Facility fee" value={money(facilityFee)} />
                                <div className="mt-1 border-t border-secondary pt-2">
                                    <SummaryLine label="Charged to your card" value={money(dueNow)} strong />
                                </div>
                                <div className="mt-3">
                                    <SavingNote>
                                        {coach.name} — {remaining} lesson {remaining === 1 ? "credit" : "credits"} left.
                                    </SavingNote>
                                </div>
                            </>
                        ) : (
                            <>
                                <SummaryLine label={`${service.name}${isGroup ? "" : ` · ${players} ${players === 1 ? "golfer" : "golfers"}`}`} value={money(lessonTotal)} />
                                {discount > 0 && <SummaryLine label={promoRule?.label ?? "Discount"} value={`−${money(discount)}`} />}
                                <SummaryLine label="Facility fee" value={money(facilityFee)} />
                                <div className="mt-1 border-t border-secondary pt-2">
                                    <SummaryLine label="Charged to Visa ···· 4242" value={money(dueNow)} strong />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 border-t border-secondary pt-5">
                        <Button size="md" color="primary" iconLeading={Calendar}>
                            Add to calendar
                        </Button>
                        {locked ? (
                            <Button size="md" color="secondary" href={`/instruction/pro/${coach.id}`}>
                                Book another with {coach.name}
                            </Button>
                        ) : (
                            <Button size="md" color="secondary" onClick={() => setStep("profile")}>
                                Book another with {coach.name}
                            </Button>
                        )}
                        <Button size="md" color="link-gray" {...(locked ? { href: "/instruction" } : { onClick: () => setStep("catalog") })}>
                            Back to the Academy
                        </Button>
                    </div>
                </div>

                {clinicsForCoach(coach.id).length > 0 && (
                    <div className="mt-8 flex flex-col gap-3">
                        <SectionTitle sub={`${coach.name} also runs these MCG programs.`}>While you&rsquo;re here</SectionTitle>
                        <div className="flex flex-col gap-2.5">
                            {clinicsForCoach(coach.id).map((p) => (
                                <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3.5 ring-1 ring-secondary ring-inset">
                                    <div className="flex min-w-0 flex-col">
                                        <span className="truncate text-sm font-semibold text-primary">{p.name}</span>
                                        <span className="text-xs text-tertiary">
                                            {p.schedule} · {COURSE_NAME[p.courseSlug ?? courseSlug]}
                                        </span>
                                    </div>
                                    <Button size="sm" color="secondary" iconTrailing={ChevronRight} onClick={() => chooseService(p)}>
                                        {money0(p.basePrice)}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </InstructionShell>
    );
};

/* ------------------------------------------------------------------ */
/* Booking summary rail — the Shop Checkout order panel, for a lesson  */
/* ------------------------------------------------------------------ */

const LessonSummary = ({
    coach,
    service,
    courseSlug,
    date,
    minutes,
    players,
    lessonTotal,
    facilityFee,
    total,
    creditApplied = 0,
    discount = 0,
    discountLabel,
    matched,
    cta,
}: {
    coach: Coach;
    service: LessonService;
    courseSlug: string;
    date: Date;
    minutes: number | null;
    players: number;
    lessonTotal: number;
    facilityFee: number;
    total: number;
    creditApplied?: number;
    discount?: number;
    discountLabel?: string;
    /** The instructor came from "any available" rather than being picked. */
    matched?: boolean;
    cta: React.ReactNode;
}) => {
    const isGroup = service.kind === "group";
    return (
        <aside className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset lg:sticky lg:top-6 lg:self-start">
            <SectionTitle>{isGroup ? "Your program" : "Your lesson"}</SectionTitle>

            <div className="flex items-center gap-3">
                <CoachAvatar coach={coach} size="sm" />
                <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold text-primary">{coach.name}</span>
                    <span className="truncate text-xs text-tertiary">{matched ? "Matched for you" : service.name}</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 rounded-xl bg-secondary_subtle px-4 py-3.5">
                <MetaLine icon={Calendar}>{isGroup ? service.schedule : fmtNice(date)}</MetaLine>
                <MetaLine icon={Clock}>
                    {isGroup
                        ? `${service.sessions} × ${service.durationMin} min`
                        : `${minutes !== null ? slotLabel(minutes) : "Pick a time"} · ${service.durationMin} min`}
                </MetaLine>
                <MetaLine icon={MarkerPin01}>{COURSE_NAME[service.courseSlug ?? courseSlug]}</MetaLine>
                {!isGroup && (
                    <MetaLine icon={Users01}>
                        {players} {players === 1 ? "golfer" : "golfers"}
                    </MetaLine>
                )}
            </div>

            <div className="flex flex-col border-t border-secondary pt-3">
                <SummaryLine
                    label={
                        <>
                            {service.name}
                            {!isGroup && players > 1 && <span className="text-tertiary"> · {players} golfers</span>}
                        </>
                    }
                    value={money(lessonTotal)}
                />
                {!isGroup && players > 1 && <SummaryLine label={`${money(lessonTotal / players)} per golfer`} value="" muted />}
                {creditApplied > 0 && <SummaryLine label="Lesson credit applied" value={`−${money(creditApplied)}`} />}
                {discount > 0 && <SummaryLine label={discountLabel ?? "Promo discount"} value={`−${money(discount)}`} />}
                <SummaryLine label="Facility fee" value={money(facilityFee)} muted />
                <div className="mt-2 border-t border-secondary pt-2.5">
                    <SummaryLine label="Due now" value={money(total)} strong />
                </div>
            </div>

            {cta}

            <p className="text-xs text-tertiary">Free cancellation up to 24 hours before your {isGroup ? "first session" : "lesson"}.</p>
        </aside>
    );
};
