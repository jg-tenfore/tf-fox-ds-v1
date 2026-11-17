"use client";

import type { ReactNode } from "react";
import { ArrowRight, Calendar, CheckCircle, Clock, Dotpoints01, MarkerPin01, Package, Ticket02, Users01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { McgShell } from "@/components/mcg-3/mcg-chrome";
import { cx } from "@/utils/cx";
import {
    academyDisplayName,
    ageRangeLabel,
    ANY_INSTRUCTOR,
    bookHref,
    clinicById,
    coachById,
    coachDay,
    coachesForService,
    courseName,
    courseShortName,
    fmtDate,
    fmtDateShort,
    FORMAT_LABEL,
    groupSizePrices,
    guardrailSummary,
    INSTRUCTION_TODAY,
    instructionHref,
    LEVEL_TONE,
    MCG_COURSE_INFO,
    MCG_ORG,
    money0,
    nextOpening,
    offeringById,
    packagesHref,
    proHref,
    serviceById,
    servicePrice,
    SKILL_LABEL,
    TODAY_ISO,
    type ClinicLevel,
    type InstructionQuery,
    type LessonService,
    type Offering,
} from "../data";
import { useInstructionStore } from "../instruction-store";
import { AcademyLogoTile, cardBase, focusRing, LinkButton } from "../kit";
import { InstructionLink, useInstructionQuery } from "../nav";
import { BackLink, CheckList, DetailSection, Hero, MetaInline, MobileActionBar, SideCard, SpotsMeter } from "./detail-ui";
import { FilterToggle, InstructorAvatar, offeringArt, SkillPill } from "./hub-ui";

/** The page body: Prototype 3's gutters (McgPage), a little tighter on mobile. */
const Page = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cx("mx-auto w-full max-w-7xl px-4 pt-6 pb-12 sm:px-8 md:pt-8 lg:pb-16", className)}>{children}</div>
);

/** The hub search this page was opened from (filters only), for "All instruction" and booking links. */
const hubQuery = (q: InstructionQuery): Partial<InstructionQuery> => ({ courses: q.courses, formats: q.formats, skills: q.skills, days: q.days, from: q.from, to: q.to, q: q.q });

const BackToHub = ({ query, label }: { query: InstructionQuery; label?: string }) => {
    const groupOnly = query.formats.length > 0 && !query.formats.includes("private");
    return (
        <div className="mb-5">
            <BackLink href={instructionHref(hubQuery(query))}>{label ?? (groupOnly ? "Clinics & programs" : "All instruction")}</BackLink>
        </div>
    );
};

/**
 * `/instruction/service/:id` (also `/clinics/:id`) — a private lesson (choose an instructor), or a
 * group program / county clinic (schedule, capacity, Register or Join waitlist). Ids are Prototype
 * 3's: `private-45`, `clinic-adult-l2`, `ggr-needwood`. `?course=` narrows a private to one course;
 * the rest of the query is the hub search it came from (kept for Back and passed on to booking).
 *
 * Crane also moves its header course switcher to the page's course; Prototype 3's nav has no
 * course switcher, so that's left out.
 */
export const ServicePage = ({ id }: { id: string }) => {
    const { query } = useInstructionQuery();
    const offering = offeringById(id);
    const service = serviceById(id);
    if (!offering) {
        return (
            <McgShell>
                <Page>
                    <BackToHub query={query} />
                    <h1 className="text-display-xs font-semibold text-primary">That lesson isn&rsquo;t offered</h1>
                    <p className="mt-2 max-w-2xl text-md text-tertiary">It may have finished or moved. Every current lesson, clinic and program is on the Instruction page.</p>
                    <LinkButton href={instructionHref()} variant="filled" iconTrailing={ArrowRight} className="mt-6">
                        All instruction
                    </LinkButton>
                </Page>
            </McgShell>
        );
    }
    if (offering.format === "private" && service) return <PrivateService service={service} offering={offering} query={query} />;
    return <ProgramService offering={offering} query={query} />;
};

/* ------------------------------------------------------------------ */
/* Private lesson                                                      */
/* ------------------------------------------------------------------ */

const InstructorRow = ({ avatar, name, nameHref, sub, price, action }: { avatar: ReactNode; name: string; nameHref?: string; sub: string; price?: string; action: ReactNode }) => (
    <li className="flex items-center gap-3 px-4 py-3.5 md:gap-4 md:px-5">
        {avatar}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {nameHref ? (
                <InstructionLink href={nameHref} className={cx("truncate rounded-sm text-md font-semibold text-primary hover:underline", focusRing)}>
                    {name}
                </InstructionLink>
            ) : (
                <span className="truncate text-md font-semibold text-primary">{name}</span>
            )}
            <span className="line-clamp-2 text-sm text-tertiary md:truncate">{sub}</span>
            {price && <span className="text-sm font-semibold text-primary tabular-nums md:hidden">{price}</span>}
        </div>
        {price && <span className="hidden shrink-0 text-md font-semibold text-primary tabular-nums md:block">{price}</span>}
        {action}
    </li>
);

const PrivateService = ({ service, offering, query }: { service: LessonService; offering: Offering; query: InstructionQuery }) => {
    const { setQuery } = useInstructionQuery();
    const course = query.courses.length === 1 ? query.courses[0] : undefined;
    const coaches = coachesForService(service, course);
    const from = coaches.length ? Math.min(...coaches.map((c) => servicePrice(service, c, 1))) : service.basePrice;
    const rails = guardrailSummary(service);
    const prices = groupSizePrices(service);
    const maxAdj = Math.max(0, ...coaches.map((c) => servicePrice(service, c, 1) - service.basePrice));
    const pickCourse = (slug?: string) => setQuery({ courses: slug ? [slug] : [] }, { replace: true });
    const book = (coach: string, courseSlug?: string) => bookHref({ coach, service: service.id, course: courseSlug, from: query.from, to: query.to });
    const bookBtn = (href: string | undefined, label = "Book") =>
        href ? (
            <LinkButton href={href} variant="filled" size="sm">
                {label}
            </LinkButton>
        ) : (
            <span className="inline-flex h-9 cursor-not-allowed items-center rounded-lg bg-tertiary px-3.5 text-sm font-semibold text-quaternary opacity-50" aria-disabled="true">
                {label}
            </span>
        );

    return (
        <McgShell>
            <Page>
                <BackToHub query={query} />
                <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="flex min-w-0 flex-col gap-8">
                        {/* ---------- Title ---------- */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Badge type="color" size="sm" color="brand">
                                    {FORMAT_LABEL.private}
                                </Badge>
                                <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">MCG Golf Academy</span>
                            </div>
                            <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">{service.name}</h1>
                            <p className="text-lg text-secondary tabular-nums">
                                From <span className="font-semibold text-primary">{money0(from)}</span> · {service.durationMin} min
                            </p>
                            <p className="max-w-2xl text-md text-tertiary">{service.desc}</p>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-tertiary">
                                <MetaInline icon={Users01}>
                                    {service.minPlayers}–{service.maxPlayers} golfers
                                </MetaInline>
                                <MetaInline icon={Clock}>{service.durationMin} minutes</MetaInline>
                                {rails && <MetaInline icon={Calendar}>{rails}</MetaInline>}
                                {offering.skills.map((s) => (
                                    <SkillPill key={s}>{SKILL_LABEL[s]}</SkillPill>
                                ))}
                            </div>
                        </div>

                        {/* ---------- Course ---------- */}
                        <section className="flex flex-col gap-3" aria-labelledby="svc-course">
                            <h2 id="svc-course" className="text-lg font-semibold text-primary">
                                Where
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                <FilterToggle isSelected={!course} onChange={() => pickCourse()}>
                                    {MCG_ORG.anyCourseLabel}
                                </FilterToggle>
                                {MCG_COURSE_INFO.map((c) => (
                                    <FilterToggle key={c.id} isSelected={course === c.id} onChange={() => pickCourse(c.id)}>
                                        {c.shortName}
                                    </FilterToggle>
                                ))}
                            </div>
                        </section>

                        {/* ---------- Instructors ---------- */}
                        <section className="flex flex-col gap-3" aria-labelledby="svc-instructors">
                            <div className="flex flex-col gap-1">
                                <h2 id="svc-instructors" className="text-lg font-semibold text-primary">
                                    Choose an instructor
                                </h2>
                                <p className="text-sm text-tertiary">
                                    {course
                                        ? `${coaches.length} ${coaches.length === 1 ? "instructor teaches" : "instructors teach"} this at ${courseName(course)}.`
                                        : `${coaches.length} instructors teach this across the county. Pick a course to book whoever is free first.`}
                                </p>
                            </div>
                            {coaches.length === 0 ? (
                                <p className="rounded-xl bg-secondary p-4 text-sm text-tertiary ring-1 ring-secondary ring-inset">
                                    No Academy instructor teaches at {course ? courseName(course) : "this course"} yet. Pick another course above.
                                </p>
                            ) : (
                                <ul className={cx("flex flex-col divide-y divide-border-secondary overflow-hidden", cardBase)}>
                                    <InstructorRow
                                        avatar={<InstructorAvatar initials="Any" size="md" />}
                                        name={ANY_INSTRUCTOR.name}
                                        sub={course ? "Whoever is free first · you'll see who before you pay" : "Pick a course first"}
                                        price={`from ${money0(from)}`}
                                        action={bookBtn(course ? book("any", course) : undefined)}
                                    />
                                    {coaches.map((c) => {
                                        const atCourse = course ? coachDay(c.id, course, INSTRUCTION_TODAY).find((sl) => sl.status === "open") : undefined;
                                        const opening = course
                                            ? atCourse
                                                ? `today ${atCourse.label}`
                                                : "No openings today"
                                            : nextOpening(c.id) === "No openings today"
                                              ? "No openings today"
                                              : `today ${nextOpening(c.id)}`;
                                        return (
                                            <InstructorRow
                                                key={c.id}
                                                avatar={<InstructorAvatar photo={c.photo} initials={c.initials} size="md" />}
                                                name={academyDisplayName(c)}
                                                nameHref={proHref(c.id)}
                                                sub={`${c.title} · ${opening === "No openings today" ? opening : `Next: ${opening}`}`}
                                                price={money0(servicePrice(service, c, 1))}
                                                action={bookBtn(book(c.id, course ?? c.courseSlugs[0]))}
                                            />
                                        );
                                    })}
                                </ul>
                            )}
                        </section>
                    </div>

                    {/* ---------- Price by group size ---------- */}
                    <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-6">
                        <div className={cx("p-5", cardBase)}>
                            <h2 className="text-md font-semibold text-primary">Price by group size</h2>
                            <p className="mt-0.5 text-sm text-tertiary">Academy rate for the whole lesson. Bring friends and it costs less each.</p>
                            <table className="mt-4 w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs text-quaternary">
                                        <th className="pb-2 font-medium">Golfers</th>
                                        <th className="pb-2 text-right font-medium">Total</th>
                                        <th className="pb-2 text-right font-medium">Each</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-secondary">
                                    {prices.map((p) => (
                                        <tr key={p.players}>
                                            <td className="py-2 text-secondary">{p.players}</td>
                                            <td className="py-2 text-right font-semibold text-primary tabular-nums">{money0(p.total)}</td>
                                            <td className="py-2 text-right text-tertiary tabular-nums">{money0(p.each)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {maxAdj > 0 && (
                                <p className="mt-3 text-xs text-tertiary">Lead and master instructors add up to {money0(maxAdj)}; each instructor&rsquo;s own price is shown beside their name.</p>
                            )}
                        </div>
                        <div className={cx("flex flex-col gap-3 p-5", cardBase)}>
                            <div className="flex items-start gap-3">
                                <Ticket02 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-sm font-semibold text-primary">Taking a few lessons?</p>
                                    <p className="text-sm text-tertiary">Packs of 5 or 10 with one instructor cost less per lesson.</p>
                                </div>
                            </div>
                            <LinkButton href={packagesHref()} size="sm" className="self-start">
                                Lesson packages
                            </LinkButton>
                        </div>
                    </aside>
                </div>
            </Page>
        </McgShell>
    );
};

/* ------------------------------------------------------------------ */
/* Group program / county clinic                                       */
/* ------------------------------------------------------------------ */

interface ProgramModel {
    id: string;
    name: string;
    blurb: string;
    banner?: string;
    format: Offering["format"];
    source: Offering["source"];
    sample?: boolean;
    courseSlug: string;
    location?: string;
    schedule: string;
    time?: string;
    sessions: number;
    sessionDates: string[];
    capacity?: number;
    spotsLeft?: number;
    price: number;
    priceUnit: string;
    perSession?: boolean;
    instructor: { id?: string; name: string; title?: string; initials: string; photo?: string | null; bio?: string | null };
    level?: ClinicLevel;
    audience?: string;
    who?: string;
    learn?: string[];
    bring?: string[];
    provided?: string[];
    equipment?: string;
}

const programModel = (offering: Offering): ProgramModel => {
    const base = {
        id: offering.id,
        name: offering.name,
        blurb: offering.blurb,
        banner: offering.banner ?? offering.image,
        format: offering.format,
        source: offering.source,
        sample: offering.sample,
        courseSlug: offering.courseSlugs[0],
        spotsLeft: offering.spotsLeft,
        price: offering.priceFrom,
        priceUnit: offering.priceUnit,
    };
    const clinic = offering.source === "county" ? clinicById(offering.id) : undefined;
    if (clinic) {
        return {
            ...base,
            location: clinic.location,
            schedule: clinic.schedule,
            time: clinic.time,
            sessions: clinic.sessions,
            sessionDates: clinic.sessionDates,
            capacity: clinic.perSession ? undefined : clinic.capacity,
            perSession: !!clinic.perSession,
            instructor: { name: clinic.instructor.name, title: clinic.instructor.title, initials: clinic.instructor.initials, bio: clinic.instructor.bio },
            level: clinic.level,
            audience: clinic.audience,
            who: [ageRangeLabel(clinic.rules?.age), clinic.prerequisites].filter(Boolean).join(" · "),
            learn: clinic.learn,
            bring: clinic.bring,
            provided: clinic.provided,
        };
    }
    const s = serviceById(offering.id)!;
    const coach = s.coachIds?.[0] ? coachById(s.coachIds[0]) : undefined;
    return {
        ...base,
        location: courseName(s.courseSlug ?? ""),
        schedule: s.schedule ?? offering.meta,
        time: s.time,
        sessions: s.sessions ?? 1,
        sessionDates: s.sessionDates ?? [],
        capacity: s.capacity,
        instructor: coach
            ? { id: coach.id, name: academyDisplayName(coach), title: coach.title, initials: coach.initials, photo: coach.photo, bio: coach.bio }
            : { name: "MCG Academy instructor", initials: "MCG" },
        who: [s.ageGroup, ageRangeLabel(s.rules?.age)].filter(Boolean).join(" · "),
        equipment: s.rules?.equipmentProvided === undefined ? undefined : s.rules.equipmentProvided ? "Clubs and balls provided" : "Bring your own clubs — range balls provided",
    };
};

const ProgramService = ({ offering, query }: { offering: Offering; query: InstructionQuery }) => {
    const p = programModel(offering);
    const { programs } = useInstructionStore();
    const registration = programs.find((r) => r.serviceId === p.id);
    const full = p.spotsLeft === 0;
    const upcoming = p.sessionDates.filter((d) => d >= TODAY_ISO);
    const next = upcoming[0] ?? p.sessionDates[0];
    const register = bookHref({ coach: p.instructor.id ?? "any", service: p.id, course: p.courseSlug, from: query.from, to: query.to, step: full ? "waitlist" : undefined });
    const cta = full ? "Join waitlist" : p.perSession ? "Choose dates" : "Register";

    const card = (
        <SideCard>
            {registration ? (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-success-primary p-3 text-sm text-success-primary">
                    <CheckCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>
                        {registration.waitlisted
                            ? "You're on the waitlist — we'll email you if a spot opens."
                            : `You're registered (${registration.participants} ${registration.participants === 1 ? "golfer" : "golfers"}).`}
                    </span>
                </div>
            ) : null}
            <div className="flex items-baseline gap-1.5">
                <span className="text-display-xs font-semibold text-primary tabular-nums">{money0(p.price)}</span>
                {p.price > 0 && <span className="text-sm text-tertiary">{p.priceUnit}</span>}
            </div>
            <p className="mt-3 flex items-start gap-2 text-sm text-secondary">
                <Calendar className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                <span>
                    {p.schedule}
                    {p.time && <span className="block text-tertiary">{p.time}</span>}
                </span>
            </p>
            {p.capacity !== undefined && p.spotsLeft !== undefined && <SpotsMeter capacity={p.capacity} spotsLeft={p.spotsLeft} className="mt-4" />}
            <LinkButton href={register} variant="filled" size="lg" iconTrailing={ArrowRight} className="mt-5 w-full">
                {cta}
            </LinkButton>
            <p className="mt-2.5 text-center text-xs text-tertiary">
                {full ? "No charge to join the waitlist" : p.perSession ? "Pay per session — pick the dates that suit you" : "Free cancellation up to 48 hours before the first session"}
            </p>
        </SideCard>
    );

    return (
        <McgShell>
            <Page className="pb-10 lg:pb-20">
                <BackToHub query={query} />
                <Hero src={offeringArt(p.format, p.banner)} alt={p.name} />

                <div className="mt-6 flex flex-wrap items-center gap-2">
                    <Badge type="color" size="sm" color="gray">
                        {FORMAT_LABEL[p.format]}
                    </Badge>
                    {p.level && (
                        <Badge type="color" size="sm" color={LEVEL_TONE[p.level]}>
                            {p.level}
                        </Badge>
                    )}
                    {p.audience && (
                        <Badge type="color" size="sm" color="gray">
                            {p.audience}
                        </Badge>
                    )}
                    {p.sample && (
                        <Badge type="color" size="sm" color="gray">
                            Sample program
                        </Badge>
                    )}
                    {full && (
                        <Badge type="color" size="sm" color="error">
                            Waitlist
                        </Badge>
                    )}
                    {!full && p.spotsLeft !== undefined && p.spotsLeft <= 3 && (
                        <Badge type="color" size="sm" color="warning">
                            {p.spotsLeft} left
                        </Badge>
                    )}
                </div>
                <h1 className="mt-3 max-w-3xl text-display-xs font-semibold text-primary md:text-display-sm">{p.name}</h1>
                <p className="mt-2 text-md font-semibold text-brand-secondary">
                    with {p.instructor.name}
                    {p.instructor.title ? `, ${p.instructor.title}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-tertiary">
                    <MetaInline icon={Calendar}>{next ? `${p.sessions > 1 ? "Starts" : "On"} ${fmtDate(next)}` : p.schedule}</MetaInline>
                    {p.time && <MetaInline icon={Clock}>{p.time}</MetaInline>}
                    <MetaInline icon={MarkerPin01}>
                        {p.location && p.location !== courseName(p.courseSlug) ? `${p.location} · ${courseShortName(p.courseSlug)}` : courseName(p.courseSlug)}
                    </MetaInline>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-3">
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        <div className="lg:hidden">{card}</div>
                        <DetailSection first title="About">
                            <p className="text-md text-secondary">{p.blurb}</p>
                        </DetailSection>
                        {p.learn && p.learn.length > 0 && (
                            <DetailSection first title="What you'll learn">
                                <CheckList items={p.learn} />
                            </DetailSection>
                        )}

                        <DetailSection title={p.sessions > 1 ? `Schedule · ${p.sessions} sessions` : "Schedule"}>
                            <p className="text-sm text-secondary">
                                {p.schedule}
                                {p.time ? ` · ${p.time}` : ""}
                            </p>
                            {p.sessionDates.length > 0 && (
                                <ol className="mt-3 flex flex-wrap gap-2">
                                    {p.sessionDates.map((d, i) => (
                                        <li
                                            key={d}
                                            className={cx(
                                                "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm ring-1 ring-secondary ring-inset",
                                                d < TODAY_ISO ? "bg-secondary text-quaternary line-through" : "bg-primary text-secondary",
                                            )}
                                        >
                                            <span className="text-xs font-semibold text-quaternary tabular-nums">{i + 1}</span>
                                            {fmtDateShort(d)}
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </DetailSection>

                        <DetailSection title="Location">
                            <p className="flex items-start gap-2 text-sm text-secondary">
                                <MarkerPin01 className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                <span>
                                    <span className="font-semibold text-primary">{courseName(p.courseSlug)}</span>
                                    {p.location && p.location !== courseName(p.courseSlug) && <span className="block text-tertiary">Meet at the {p.location}</span>}
                                </span>
                            </p>
                        </DetailSection>

                        <DetailSection title="Instructor">
                            <div className="flex items-start gap-4">
                                <InstructorAvatar photo={p.instructor.photo} initials={p.instructor.initials} size="lg" />
                                <div className="flex min-w-0 flex-col gap-1">
                                    <p className="text-md font-semibold text-primary">{p.instructor.name}</p>
                                    {p.instructor.title && <p className="text-sm text-tertiary">{p.instructor.title}</p>}
                                    {p.instructor.bio && <p className="mt-1 text-sm text-secondary">{p.instructor.bio}</p>}
                                    {p.instructor.id && (
                                        <InstructionLink
                                            href={proHref(p.instructor.id)}
                                            className={cx("mt-1 inline-flex items-center gap-1 self-start rounded-sm text-sm font-semibold text-brand-secondary hover:underline", focusRing)}
                                        >
                                            View profile <ArrowRight className="size-4" aria-hidden="true" />
                                        </InstructionLink>
                                    )}
                                </div>
                            </div>
                        </DetailSection>

                        {(p.who || p.equipment) && (
                            <DetailSection title="Who it's for">
                                {p.who && <p className="text-sm text-secondary">{p.who}</p>}
                                {p.equipment && <p className="mt-1.5 text-sm text-tertiary">{p.equipment}</p>}
                            </DetailSection>
                        )}

                        {!!(p.bring?.length || p.provided?.length) && (
                            <DetailSection title="What's included">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {[
                                        { icon: Package, title: "We provide", items: p.provided ?? [] },
                                        { icon: Dotpoints01, title: "Bring", items: p.bring ?? [] },
                                    ]
                                        .filter((g) => g.items.length)
                                        .map((g) => (
                                            <div key={g.title}>
                                                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
                                                    <g.icon className="size-4 text-fg-quaternary" aria-hidden="true" /> {g.title}
                                                </p>
                                                <ul className="flex flex-col gap-1.5">
                                                    {g.items.map((x) => (
                                                        <li key={x} className="text-sm text-tertiary">
                                                            {x}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                </div>
                            </DetailSection>
                        )}

                        <div className={cx("flex items-center gap-4 p-4", cardBase)}>
                            <AcademyLogoTile className="h-12 w-16" />
                            <p className="text-sm text-tertiary">
                                {p.source === "county" ? "Run by Montgomery County Golf's clinic program." : "An MCG Golf Academy program."} Questions? Call the Academy desk at {MCG_ORG.phone}{" "}
                                or ask at the {courseShortName(p.courseSlug)} pro shop.
                            </p>
                        </div>
                    </div>
                    <aside className="hidden lg:block">{card}</aside>
                </div>
            </Page>
            <MobileActionBar
                summary={
                    <div className="flex flex-col">
                        <span className="text-md font-semibold text-primary tabular-nums">{money0(p.price)}</span>
                        <span className="truncate text-xs text-tertiary">{p.priceUnit}</span>
                    </div>
                }
                action={
                    <LinkButton href={register} variant="filled">
                        {cta}
                    </LinkButton>
                }
            />
        </McgShell>
    );
};
