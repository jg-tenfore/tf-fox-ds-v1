"use client";

/**
 * The MCG prototype's front door.
 *
 * A county system's home page has a different job to a private club's: the golfer
 * usually knows they want to play *somewhere in the county* this weekend, not which
 * of nine courses. So the hero is a quick-book bar across all nine, and the courses
 * are presented as a portfolio rather than a single hero property.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Calendar, Flag01, GraduationHat01, MarkerPin01, SearchLg, Ticket02, Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { mcgCourses } from "@/components/foundations/mcg/mcg-assets";
import { GROUP_SERVICES, PRIVATE_SERVICES, money0, servicePrice } from "@/components/instruction/instruction-catalog";
import { cx } from "@/utils/cx";
import { McgPage, McgShell } from "./mcg-chrome";
import { useSession } from "./session";

/** Weekday 18-hole green fee per course — the number a golfer actually compares on. */
const GREEN_FEE: Record<string, number> = {
    "falls-road": 38,
    northwest: 42,
    "hampshire-greens": 62,
    laytonsville: 34,
    "little-bennett": 36,
    needwood: 40,
    crossvines: 58,
    rattlewood: 39,
    // Sligo Creek is a nine; "weekday 18" is two trips round the same nine.
    "sligo-creek": 28,
};

const HOLES: Record<string, string> = {
    "falls-road": "18 holes · par 71",
    northwest: "18 holes · par 72",
    "hampshire-greens": "18 holes · par 71",
    laytonsville: "18 holes · par 70",
    "little-bennett": "18 holes · par 71",
    needwood: "18 holes · par 70",
    crossvines: "18 holes · par 72",
    rattlewood: "18 holes · par 72",
    "sligo-creek": "9 holes · par 34",
};

const QUICK_LINKS = [
    { href: "/tee-times", label: "Book a tee time", detail: "All nine courses on one sheet", icon: Flag01 },
    { href: "/instruction", label: "Lessons & clinics", detail: "MCG Academy — privates and programs", icon: GraduationHat01 },
    { href: "/events", label: "Leagues & events", detail: "Scrambles, leagues, county championships", icon: Users01 },
    { href: "/calendar", label: "What's on", detail: "Every course, every program, one month view", icon: Calendar },
];

export const HomePage = () => {
    const router = useRouter();
    const { user, setCourse, credits, activity } = useSession();
    const [course, setLocalCourse] = useState("any");

    const upcoming = activity.filter((a) => a.status === "Upcoming").slice(0, 2);
    const lessonFrom = Math.min(...PRIVATE_SERVICES.map((s) => servicePrice(s, undefined, 1)));

    const go = () => {
        if (course !== "any") setCourse(course);
        router.push("/tee-times");
    };

    return (
        <McgShell>
            {/* ---------------- Hero ---------------- */}
            <section className="relative isolate overflow-hidden border-b border-secondary bg-primary">
                <div className="absolute inset-0 -z-10">
                    <img src={mcgCourses.find((c) => c.slug === "northwest")?.photos?.[0]?.src} alt="" className="size-full object-cover opacity-25" />
                    <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/70 to-primary/30" />
                </div>

                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-16 sm:px-8">
                    <div className="flex max-w-3xl flex-col gap-4">
                        <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">Montgomery County Golf</span>
                        <h1 className="text-display-md font-semibold text-primary">Nine public courses. One tee sheet.</h1>
                        <p className="max-w-2xl text-lg text-tertiary">
                            Sligo Creek to Poolesville — book any MCG course, take a lesson with a county pro, or join a league. County residents play at the resident rate.
                        </p>
                    </div>

                    {/* Quick-book bar */}
                    <div className="flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-1 ring-secondary sm:flex-row sm:items-end">
                        <label className="flex flex-1 flex-col gap-1.5">
                            <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">Course</span>
                            <select
                                id="home-course"
                                value={course}
                                onChange={(e) => setLocalCourse(e.target.value)}
                                className="w-full rounded-lg bg-primary px-3.5 py-2.5 text-md text-primary ring-1 ring-primary transition duration-100 ease-linear ring-inset focus:ring-2 focus:ring-brand focus:outline-none"
                            >
                                <option value="any">Any MCG course</option>
                                {mcgCourses.map((c) => (
                                    <option key={c.slug} value={c.slug}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <Button size="xl" color="primary" iconLeading={SearchLg} onClick={go} className="sm:w-auto">
                            Find tee times
                        </Button>
                    </div>

                    {user && upcoming.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-secondary_subtle px-4 py-3 ring-1 ring-secondary ring-inset">
                            <span className="text-sm font-semibold text-primary">Coming up</span>
                            {upcoming.map((a) => (
                                <span key={a.id} className="text-sm text-tertiary">
                                    {a.title} · {a.dateLabel}
                                </span>
                            ))}
                            <Link href="/account" className="ml-auto text-sm font-semibold text-brand-secondary hover:underline">
                                My account
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <McgPage>
                {/* ---------------- Quick links ---------------- */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {QUICK_LINKS.map(({ href, label, detail, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group flex flex-col gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand"
                        >
                            <span className="flex size-10 items-center justify-center rounded-lg bg-brand-secondary">
                                <Icon className="size-5 text-white" aria-hidden="true" />
                            </span>
                            <span className="flex flex-col gap-0.5">
                                <span className="text-md font-semibold text-primary">{label}</span>
                                <span className="text-sm text-tertiary">{detail}</span>
                            </span>
                            <ArrowRight className="size-4 text-fg-quaternary transition duration-100 ease-linear group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                    ))}
                </div>

                {/* ---------------- Courses ---------------- */}
                <section className="mt-12 flex flex-col gap-5">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-display-xs font-semibold text-primary">The courses</h2>
                            <p className="text-md text-tertiary">Nine county courses, from a walkable par 34 inside the Beltway to the newest course in Maryland.</p>
                        </div>
                        <Button size="md" color="secondary" href="/tee-times" iconTrailing={ArrowRight}>
                            See all tee times
                        </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {mcgCourses.map((c) => (
                            <Link
                                key={c.slug}
                                href="/tee-times"
                                onClick={() => setCourse(c.slug)}
                                className="group flex flex-col overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand"
                            >
                                <div className="flex aspect-[16/7] items-center justify-center overflow-hidden bg-secondary_subtle p-6">
                                    {c.photos?.[0] ? (
                                        <img src={c.photos[0].src} alt="" className="size-full scale-105 object-cover" />
                                    ) : (
                                        <img src={c.logo} alt="" className="max-h-full max-w-[70%] object-contain" />
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col gap-2.5 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 flex-col gap-0.5">
                                            <span className="truncate text-md font-semibold text-primary">{c.name}</span>
                                            <span className="flex items-center gap-1.5 text-sm text-tertiary">
                                                <MarkerPin01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                                {c.location}
                                            </span>
                                        </div>
                                        <img src={c.logo} alt="" className="size-10 shrink-0 rounded-full bg-primary object-contain" />
                                    </div>
                                    <span className="text-sm text-tertiary">{HOLES[c.slug]}</span>
                                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-secondary pt-3">
                                        <span className="flex flex-col">
                                            <span className="text-xs text-quaternary">Weekday 18</span>
                                            <span className="text-lg font-semibold text-primary tabular-nums">{money0(GREEN_FEE[c.slug] ?? 40)}</span>
                                        </span>
                                        <span className="text-sm font-semibold text-brand-secondary transition duration-100 ease-linear group-hover:underline">Tee times</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ---------------- Academy + programs ---------------- */}
                <section className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <div className="flex flex-col justify-between gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                        <div className="flex flex-col gap-2.5">
                            <span className="flex size-10 items-center justify-center rounded-lg bg-brand-secondary">
                                <GraduationHat01 className="size-5 text-white" aria-hidden="true" />
                            </span>
                            <h3 className="text-lg font-semibold text-primary">The MCG Academy</h3>
                            <p className="max-w-xl text-md text-tertiary">
                                Private lessons, playing lessons, multi-week clinics and junior camps with PGA-certified county pros — from {money0(lessonFrom)}. Pick a lesson
                                and we&rsquo;ll find you an instructor and a time.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            <Button size="md" color="primary" href="/instruction" iconTrailing={ArrowRight}>
                                Browse lessons
                            </Button>
                            <Button size="md" color="secondary" href="/instruction/packages" iconLeading={Ticket02}>
                                Lesson packages
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-primary">Programs starting soon</h3>
                            <Link href="/clinics" className="text-sm font-semibold text-brand-secondary hover:underline">
                                All clinics
                            </Link>
                        </div>
                        <div className="flex flex-col divide-y divide-secondary">
                            {GROUP_SERVICES.slice(0, 4).map((s) => (
                                <Link key={s.id} href="/instruction" className="group flex items-center justify-between gap-4 py-3">
                                    <span className="flex min-w-0 flex-col">
                                        <span className="truncate text-sm font-semibold text-primary group-hover:underline">{s.name}</span>
                                        <span className="truncate text-xs text-tertiary">{s.schedule}</span>
                                    </span>
                                    <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">{money0(s.basePrice)}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ---------------- Resident rate ---------------- */}
                <section
                    className={cx(
                        "mt-12 flex flex-col items-start gap-4 rounded-2xl p-8 sm:flex-row sm:items-center sm:justify-between",
                        "bg-brand-section text-primary_on-brand",
                    )}
                >
                    <div className="flex max-w-2xl flex-col gap-2">
                        <h3 className="text-display-xs font-semibold text-primary_on-brand">Montgomery County residents play for less</h3>
                        <p className="text-md text-tertiary_on-brand">
                            Add your county residency to your MCG account and the resident rate applies automatically at checkout, on every course.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {user ? (
                            <Button size="lg" color="secondary" href="/account/settings">
                                Add residency
                            </Button>
                        ) : (
                            <>
                                <Button size="lg" color="secondary" href="/signup">
                                    Create an account
                                </Button>
                                <Button size="lg" color="link-gray" href="/signin" className="text-primary_on-brand">
                                    Sign in
                                </Button>
                            </>
                        )}
                    </div>
                </section>

                {user && credits.length > 0 && (
                    <p className="mt-6 text-sm text-tertiary">
                        You have {credits.reduce((n, c) => n + c.creditsRemaining, 0)} lesson credits waiting —{" "}
                        <Link href="/instruction" className="font-semibold text-brand-secondary hover:underline">
                            book your next lesson
                        </Link>
                        .
                    </p>
                )}
            </McgPage>
        </McgShell>
    );
};
