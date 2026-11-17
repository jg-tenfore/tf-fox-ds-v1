/**
 * Sanity checks for Prototype 3's Instruction URL model and the data ported from Crane (Crane's
 * `src/stories/mcg/deep-link-checks.ts`, adapted: Fox has no org redirect layer — `/clinics` is
 * handled by the Instruction route table). Run by "MCG Prototype 3 / Deep links & checks"; any
 * failure throws there, so a story test run fails with it.
 */
import { isValidElement } from "react";
import {
    ALL_OFFERINGS,
    bookHref,
    clinicsHref,
    COACHES,
    dateOfIso,
    filterOfferings,
    GROUP_SERVICES,
    instructionHref,
    instructorHref,
    instructorProfile,
    MCG_CLINICS,
    offeringById,
    offeringsAt,
    parseInstructionQuery,
    proHref,
    queryToFilter,
    REBASE_DAYS,
    serializeInstructionQuery,
    serviceById,
    serviceHref,
    splitPath,
    TODAY_ISO,
    withQuery,
} from "@/components/mcg-3/instruction/data";
import { renderInstructionRoute } from "@/components/mcg-3/instruction/instruction-routes";

export interface Check {
    label: string;
    ok: boolean;
    detail?: string;
}

const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const check = (label: string, ok: boolean, detail?: unknown): Check => ({ label, ok, detail: detail === undefined ? undefined : typeof detail === "string" ? detail : JSON.stringify(detail) });

/** The canonical form of any Instruction link: no trailing slash on the path, params in canonical order. */
export const canonicalOf = (href: string) => {
    const { pathname, query } = splitPath(href);
    return withQuery(pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname, query);
};

/** Re-serialize a link from its parsed form: the canonical link must parse back to the same query. */
export const roundTrip = (href: string) => {
    const canonical = canonicalOf(href);
    return { canonical, ok: eq(splitPath(canonical).query, splitPath(href).query) };
};

/** Fox Prototype 3's own links from before the port, and the canonical link each must become. */
export const LEGACY_LINKS: { label: string; href: string; canonical: string }[] = [
    { label: "Fox P3 link: courses= and numeric days", href: "/instruction?courses=northwest,needwood&days=1,3&formats=clinic", canonical: "/instruction?formats=clinic&course=northwest,needwood&days=mon,wed" },
    { label: "Fox P3 link: trailing slash + formats=private", href: "/instruction/?course=hampshire-greens&formats=private", canonical: "/instruction?formats=private&course=hampshire-greens" },
    { label: "Fox P3 link: Instructors tab at a course", href: "/instruction/?view=instructors&courses=falls-road", canonical: "/instruction?view=instructors&course=falls-road" },
    { label: "Instructor deep link (Academy URL)", href: "/instruction/instructors/doug-hamilton/", canonical: "/instruction/instructors/doug-hamilton" },
    { label: "Instructor's booking deep link", href: "/instruction/book/?course=little-bennett&service=private-45&coach=doug-hamilton", canonical: "/instruction/book?coach=doug-hamilton&service=private-45&course=little-bennett" },
    { label: "Group formats alias + weekends", href: "/instruction?formats=group&days=weekends", canonical: "/instruction?formats=clinic,junior-camp,junior-league,op36&days=sun,sat" },
];

const routeId = (path: string): string | undefined => {
    const el = renderInstructionRoute(path);
    return isValidElement<{ id?: string }>(el) ? el.props.id : undefined;
};

export const runChecks = (paths: string[]): Check[] => {
    const q = parseInstructionQuery;
    const needwoodClinics = filterOfferings(queryToFilter(q("/instruction?formats=clinic&course=needwood")));
    const adultL2 = serviceById("clinic-adult-l2");
    const doug = instructorProfile("doug-hamilton");
    const keys = ALL_OFFERINGS.map((o) => o.key);
    return [
        // URL model
        check(
            "bookHref matches the spec link",
            bookHref({ coach: "mike-kenny", service: "private-45", course: "falls-road" }) === "/instruction/book?coach=mike-kenny&service=private-45&course=falls-road",
            bookHref({ coach: "mike-kenny", service: "private-45", course: "falls-road" }),
        ),
        check("clinicsHref = the four group formats", clinicsHref() === "/instruction?formats=clinic,junior-camp,junior-league,op36", clinicsHref()),
        check("instructors view", instructionHref({ view: "instructors" }) === "/instruction?view=instructors" && q("?view=instructors").view === "instructors"),
        check("formats + course example", instructionHref({ formats: ["clinic"], courses: ["needwood"] }) === "/instruction?formats=clinic&course=needwood"),
        check("proHref / instructorHref / serviceHref", proHref("mike-kenny") === "/instruction/pro/mike-kenny" && instructorHref("doug-hamilton") === "/instruction/instructors/doug-hamilton" && serviceHref("private-45", "all") === "/instruction/service/private-45"),
        check("Fox P3 link: courses= and numeric days", eq(q("courses=northwest,needwood&days=1,3").courses, ["northwest", "needwood"]) && eq(q("days=1,3").days, [1, 3])),
        check("aliases: group, weekends, day names", q("formats=group").formats.length === 4 && eq(q("days=weekends").days, [0, 6]) && eq(q("days=monday,thu").days, [1, 4])),
        check("course=all means every course", q("course=all").courses.length === 0),
        check("invalid values are dropped", eq(q("formats=nope&from=tomorrow&players=9&time=25:00"), q("")), serializeInstructionQuery(q("formats=nope&from=tomorrow&players=9&time=25:00"))),
        check("booking state parses", eq(q("date=2026-10-14&time=4:30pm&players=2&step=checkout"), { ...q(""), date: "2026-10-14", time: "16:30", players: 2, step: "checkout" })),
        check("unknown params survive", serializeInstructionQuery(q("utm_source=mcg&view=instructors")) === "view=instructors&utm_source=mcg"),
        check("expanded flag", q("expanded=1").expanded && !q("expanded=0").expanded && !q("").expanded),
        ...LEGACY_LINKS.map((l) => check(`${l.label} → ${l.canonical}`, canonicalOf(l.href) === l.canonical, canonicalOf(l.href))),
        ...paths.map((p) => {
            const r = roundTrip(p);
            return check(`round-trips: ${p}`, r.ok, r.canonical);
        }),
        // Routes (Fox's stand-in for Crane's org redirects)
        check("/clinics/:id → that program's service page", routeId("/clinics/ggr-northwest") === "ggr-northwest"),
        check("/instruction/instructors/:id → the profile", routeId("/instruction/instructors/doug-hamilton/") === "doug-hamilton"),
        check("/instruction/pro/:id → the profile", routeId("/instruction/pro/mike-kenny") === "mike-kenny"),
        check("every listed path has a screen", paths.every((p) => renderInstructionRoute(p.split("?")[0]) !== null), paths.filter((p) => renderInstructionRoute(p.split("?")[0]) === null)),
        check("paths outside Instruction have none", renderInstructionRoute("/tee-times") === null),
        // Data
        check("re-based by whole weeks", REBASE_DAYS % 7 === 0, REBASE_DAYS),
        check("Adult Level 2 still meets on Thursdays", !!adultL2?.startIso && dateOfIso(adultL2.startIso).getDay() === 4, adultL2?.schedule),
        check("every program is upcoming", [...GROUP_SERVICES.map((s) => s.startIso!), ...MCG_CLINICS.map((c) => c.isoDate)].every((iso) => iso >= TODAY_ISO)),
        check("offering keys are unique", new Set(keys).size === keys.length, keys.length),
        check("offeringById resolves P3 ids", !!offeringById("private-45") && !!offeringById("clinic-adult-l2") && !!offeringById("ggr-northwest")),
        check("Needwood clinics filter", needwoodClinics.length > 0 && needwoodClinics.every((o) => o.format === "clinic" && o.courseSlugs.includes("needwood")), needwoodClinics.map((o) => o.id)),
        check("no privates where no instructor teaches (Hampshire Greens)", offeringsAt("hampshire-greens").every((o) => o.format !== "private")),
        check("instructors have headshots (or the placeholder)", COACHES.every((c) => !!c.photo), COACHES.filter((c) => !c.photo).map((c) => c.id)),
        check("instructor contact is the Academy's, never personal", COACHES.every((c) => c.contact.email === "academy@mcg.example.com" && /555-/.test(c.contact.phone))),
        check("Doug Hamilton profile: 2 packs + monthly plan + 3 courses", !!doug && doug.packs.length === 2 && !!doug.plan && doug.courses.length === 3),
    ];
};
