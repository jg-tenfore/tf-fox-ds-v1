"use client";

/**
 * `/clinics` — the county clinic program.
 *
 * Two catalogs render side by side, and the split is the point. The county runs
 * Parks-department programs aimed at people who are not yet golfers — Get Golf Ready,
 * First Tee, Women on Course, Senior Swing & Stretch. The MCG Golf Academy runs
 * instructor-led group programs for people who already play, and those are modeled
 * once, in `instruction-catalog`'s `GROUP_SERVICES`. Rather than restate them here,
 * the Academy section renders the real services with `ServiceCard` — the same
 * component the Instruction catalog uses — and every one of them routes to
 * `/instruction`, which owns booking.
 *
 * The helper block at the top exists because the most common question a county pro
 * shop fields is not "when is it" but "which one am I".
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, GraduationHat01, Users01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ServiceCard } from "@/components/instruction/instruction-ui";
import { McgHero, McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import {
    ACADEMY_CLINICS,
    AUDIENCES,
    type ClinicAudience,
    type ClinicLevel,
    COURSE_NAME,
    COURSE_SLUGS,
    isFull,
    LEVEL_COLOR,
    LEVELS,
    MCG_CLINICS,
} from "@/components/mcg/events-catalog";
import { cx } from "@/utils/cx";
import { ClinicCard, FilterChips, NoResults, SectionTitle, SelectMenu } from "./events-ui";

type LevelFilter = "all" | ClinicLevel;
type AudienceFilter = "all" | ClinicAudience;

const LEVEL_OPTIONS: { id: LevelFilter; label: string }[] = [{ id: "all", label: "Any experience" }, ...LEVELS.map((l) => ({ id: l as LevelFilter, label: l }))];
const AUDIENCE_OPTIONS: { id: AudienceFilter; label: string }[] = [{ id: "all", label: "Everyone" }, ...AUDIENCES.map((a) => ({ id: a as AudienceFilter, label: a }))];

/* ------------------------------------------------------------------ */
/* "Which clinic is right for me"                                      */
/* ------------------------------------------------------------------ */

/**
 * A routing block, not marketing. Each row sets the filters below rather than
 * navigating away, so the answer appears in the same grid the golfer is already
 * looking at.
 */
const HELPER_ROUTES: { title: string; blurb: string; level: LevelFilter; audience: AudienceFilter }[] = [
    {
        title: "I have never played",
        blurb: "Start with Get Golf Ready. Five weeks, clubs lent to you, and the last session is nine real holes.",
        level: "New to golf",
        audience: "Adults",
    },
    {
        title: "I can hit it, but I've never played a course",
        blurb: "A beginner series that ends on the course is what you want — Women on Course, or League Ready if you already play nine.",
        level: "Beginner",
        audience: "Adults",
    },
    {
        title: "I want my kid to try golf",
        blurb: "First Tee for ages 7–14 with no experience; the Junior Pathway once they can get round a few holes.",
        level: "all",
        audience: "Juniors",
    },
    {
        title: "I'm playing tournaments this season",
        blurb: "Teen Tour Prep for juniors, and the Golf Academy's scoring and launch-monitor programs for adults.",
        level: "Advanced",
        audience: "all",
    },
    {
        title: "I'm coming back to the game later in life",
        blurb: "Senior Swing & Stretch rebuilds the swing around the body you have now, not the one you had at forty.",
        level: "All levels",
        audience: "Seniors",
    },
];

const HelperBlock = ({ onPick }: { onPick: (level: LevelFilter, audience: AudienceFilter) => void }) => (
    <section className="mb-9 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset sm:p-7">
        <div className="flex items-start gap-3">
            <GraduationHat01 className="mt-0.5 size-6 shrink-0 text-fg-brand-primary" aria-hidden="true" />
            <div>
                <h2 className="text-lg font-semibold text-primary">Which clinic is right for me?</h2>
                <p className="mt-1 max-w-2xl text-sm text-tertiary">
                    Pick the line that sounds most like you and the list below narrows to match. Nothing here needs experience or your own clubs unless it says so.
                </p>
            </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {HELPER_ROUTES.map((r) => (
                <button
                    key={r.title}
                    type="button"
                    onClick={() => onPick(r.level, r.audience)}
                    className="group flex flex-col gap-1 rounded-xl bg-secondary p-4 text-left transition duration-100 ease-linear hover:bg-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                    <span className="text-sm font-semibold text-primary group-hover:underline">{r.title}</span>
                    <span className="text-sm text-tertiary">{r.blurb}</span>
                </button>
            ))}
        </div>
    </section>
);

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const ClinicsBrowseScreen = () => {
    const router = useRouter();
    const [level, setLevel] = useState<LevelFilter>("all");
    const [audience, setAudience] = useState<AudienceFilter>("all");
    const [course, setCourse] = useState<string>("all");
    const [menu, setMenu] = useState<null | "course" | "audience">(null);

    const clear = () => {
        setLevel("all");
        setAudience("all");
        setCourse("all");
    };

    const list = useMemo(
        () =>
            MCG_CLINICS.filter(
                (c) => (level === "all" || c.level === level) && (audience === "all" || c.audience === audience) && (course === "all" || c.courseSlug === course),
            ).sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
        [level, audience, course],
    );

    // Academy programs share the course filter but not the county skill/age vocabulary,
    // so they narrow by course only — a filter that silently hid them would be worse
    // than one that doesn't apply.
    const academy = ACADEMY_CLINICS.filter(({ service }) => course === "all" || service.courseSlug === course);

    const seriesCount = MCG_CLINICS.filter((c) => c.sessions > 1).length;

    return (
        <McgShell>
            <McgHero
                title="County clinics and learn-to-play"
                blurb="Group clinics and multi-week series at all nine MCG courses — from a first swing to tournament preparation. Loaner clubs are provided on every beginner program, and scholarships cover the fee for any family that asks."
                right={
                    <div className="flex flex-col items-start gap-2 text-sm text-tertiary">
                        <span className="tabular-nums">
                            <span className="font-semibold text-primary">{MCG_CLINICS.length}</span> county programs · <span className="font-semibold text-primary">{seriesCount}</span>{" "}
                            multi-week series
                        </span>
                        <Button size="md" color="secondary" href="/instruction" iconTrailing={ArrowUpRight}>
                            Private lessons at the Golf Academy
                        </Button>
                    </div>
                }
            />

            <McgPage>
                <HelperBlock
                    onPick={(l, a) => {
                        setLevel(l);
                        setAudience(a);
                    }}
                />

                {/* Filters */}
                <div className="flex flex-col gap-3">
                    <FilterChips options={LEVEL_OPTIONS} value={level} onChange={setLevel} />
                    <div className="flex flex-wrap items-center gap-2.5">
                        <SelectMenu
                            label="For"
                            value={audience}
                            options={AUDIENCE_OPTIONS}
                            open={menu === "audience"}
                            onOpen={() => setMenu((m) => (m === "audience" ? null : "audience"))}
                            onChange={(id) => {
                                setAudience(id);
                                setMenu(null);
                            }}
                        />
                        <SelectMenu
                            label="Course"
                            value={course}
                            options={[{ id: "all", label: `All ${COURSE_SLUGS.length} courses` }, ...COURSE_SLUGS.map((slug) => ({ id: slug as string, label: COURSE_NAME[slug] }))]}
                            open={menu === "course"}
                            onOpen={() => setMenu((m) => (m === "course" ? null : "course"))}
                            onChange={(id) => {
                                setCourse(id);
                                setMenu(null);
                            }}
                        />
                        {(level !== "all" || audience !== "all" || course !== "all") && (
                            <button type="button" onClick={clear} className="text-sm font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary">
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <p className="mt-5 mb-6 text-sm text-tertiary">
                    <span className="font-semibold text-secondary tabular-nums">{list.length}</span> county {list.length === 1 ? "program" : "programs"}
                    {course !== "all" && <span> at {COURSE_NAME[course]}</span>}
                    {list.some(isFull) && <span> · {list.filter(isFull).length} with a waitlist</span>}
                </p>

                {list.length === 0 ? (
                    <NoResults noun="clinics" onClear={clear} />
                ) : (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {list.map((clinic) => (
                            <ClinicCard
                                key={clinic.id}
                                clinic={clinic}
                                levelBadge={
                                    <Badge color={LEVEL_COLOR[clinic.level]} size="sm" type="pill-color">
                                        {clinic.level}
                                    </Badge>
                                }
                            />
                        ))}
                    </div>
                )}

                {/* Academy-led programs — referenced, not duplicated */}
                {academy.length > 0 && (
                    <section className="mt-14 border-t border-secondary pt-8">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <SectionTitle sub="Instructor-led group programs run by the MCG Golf Academy. These are booked through Instruction, alongside private lessons and lesson credits.">
                                Academy-led clinics
                            </SectionTitle>
                            <Button size="md" color="secondary" href="/instruction" iconTrailing={ArrowUpRight}>
                                Go to Instruction
                            </Button>
                        </div>
                        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {academy.map(({ service }) => (
                                <ServiceCard key={service.id} service={service} onSelect={() => router.push("/instruction")} />
                            ))}
                        </div>
                    </section>
                )}

                {/* County footer note */}
                <section className="mt-14 flex flex-col gap-3 border-t border-secondary pt-8">
                    <h2 className="text-lg font-semibold text-primary">Cost should never be the reason</h2>
                    <p className="max-w-3xl text-sm text-tertiary">
                        Every county clinic has scholarship places held back for Montgomery County residents, and First Tee covers the full fee for any family that asks at registration.
                        Ask at any pro shop, or call the golf office on {""}
                        <span className="font-semibold text-secondary">(301) 762-1600</span>. No documentation required.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <Link href="/calendar" className={cx("flex items-center gap-1.5 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline")}>
                            <Users01 className="size-4" aria-hidden="true" />
                            See clinics on the county calendar
                        </Link>
                        <Link href="/events" className="flex items-center gap-1.5 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline">
                            Ready to compete? Browse county events
                        </Link>
                    </div>
                </section>
            </McgPage>
        </McgShell>
    );
};
