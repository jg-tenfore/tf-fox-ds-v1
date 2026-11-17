import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { filterOfferings, parseInstructionQuery, queryToFilter, splitPath } from "@/components/mcg-3/instruction/data";
import { cx } from "@/utils/cx";
import { LEGACY_LINKS, canonicalOf, runChecks } from "./deep-link-checks";
import { P3Story, p3Url } from "./p3-story-kit";
import { P3_LINKS, P3_SCREEN_GROUPS } from "./p3-screens";

/**
 * Every Instruction state in Prototype 3 is a URL (Nov 17 call: link from an instructor's MCG page
 * straight to their booking; webmaster-built filtered links). This page lists P3's deep links —
 * what each parses to, its canonical form, a link that opens it on the running P3 app
 * (`localhost:3002` locally, `/tf-fox-ds-v1/prototype-3/` on Pages) and a Preview that mounts it
 * right here — and runs the URL-model and data checks ported from Crane, including Fox P3's
 * older link shapes (`courses=`, numeric `days=`, trailing slashes). A failing check throws.
 *
 * The URL model: `src/components/mcg-3/instruction/data/query.ts` (params table in its header).
 */
const meta: Meta = {
    title: "Prototypes/MCG Prototype 3/Deep links & checks",
    id: "mcg-prototype-3-deep-links",
    parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const summary = (path: string) => {
    const { pathname, query } = splitPath(path);
    const parts = [
        query.view === "instructors" && "view: instructors",
        query.courses.length && `course: ${query.courses.join(", ")}`,
        query.formats.length && `formats: ${query.formats.join(", ")}`,
        query.days.length && `days: ${query.days.join(", ")}`,
        query.skills.length && `skills: ${query.skills.join(", ")}`,
        query.coach && `coach: ${query.coach}`,
        query.service && `service: ${query.service}`,
        query.date && `date: ${query.date}`,
        query.time && `time: ${query.time}`,
        query.step && `step: ${query.step}`,
        query.pack && `pack: ${query.pack}`,
        query.expanded && "expanded",
        ...Object.entries(query.extra).map(([k, v]) => `${k}: ${v}`),
    ].filter(Boolean);
    const p = pathname.replace(/\/+$/, "") || "/";
    const results = p === "/instruction" ? `${filterOfferings(queryToFilter(parseInstructionQuery(path))).length} results` : "";
    return { parts: parts.join(" · ") || "—", results };
};

const Copy = ({ text }: { text: string }) => {
    const [done, setDone] = useState(false);
    return (
        <button
            type="button"
            onClick={() => {
                void navigator.clipboard?.writeText(text).then(() => {
                    setDone(true);
                    setTimeout(() => setDone(false), 1200);
                });
            }}
            className="cursor-pointer text-xs font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary"
        >
            {done ? "Copied" : "Copy"}
        </button>
    );
};

const DeepLinks = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const checks = runChecks(P3_LINKS.map((l) => l.path));
    const failed = checks.filter((c) => !c.ok);
    if (failed.length) throw new Error(`P3 Instruction checks failed:\n${failed.map((c) => `✗ ${c.label} ${c.detail ?? ""}`).join("\n")}`);
    if (preview)
        return (
            <div>
                <div className="sticky top-0 z-50 flex items-center gap-3 bg-primary-solid px-4 py-2 text-sm text-white">
                    <button type="button" onClick={() => setPreview(null)} className="cursor-pointer font-semibold hover:underline">
                        ← All deep links
                    </button>
                    <code className="truncate text-xs opacity-80">{preview}</code>
                </div>
                <P3Story key={preview} path={preview} />
            </div>
        );
    return (
        <div className="min-h-screen bg-secondary p-8 text-primary">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">
                <header className="flex flex-col gap-1">
                    <span className="text-xs font-semibold tracking-wide text-brand-secondary uppercase">MCG Prototype 3 · Instruction</span>
                    <h1 className="text-display-sm font-semibold">Deep links & checks</h1>
                    <p className="max-w-3xl text-md text-tertiary">
                        Every link below opens Prototype 3 in that exact state. <strong>Open in P3</strong> goes to the running app (
                        <code className="text-sm">{p3Url("/instruction").replace(/\/instruction\/$/, "")}</code>); <strong>Preview</strong> mounts it in this story. {P3_LINKS.length} links,{" "}
                        {checks.length} checks — <span className="font-semibold text-success-primary">{checks.length - failed.length} passed</span>.
                    </p>
                </header>

                {P3_SCREEN_GROUPS.map((g) => (
                    <section key={g.label} className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary">
                        <h2 className="border-b border-secondary px-4 py-3 text-md font-semibold">
                            {g.label} <span className="font-normal text-tertiary">· {g.items.length}</span>
                        </h2>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-secondary text-xs text-tertiary">
                                <tr>
                                    <th className="w-[22%] px-4 py-2 font-semibold">State</th>
                                    <th className="w-[38%] px-4 py-2 font-semibold">Path</th>
                                    <th className="px-4 py-2 font-semibold">Parses to</th>
                                    <th className="w-36 px-4 py-2 font-semibold">Open</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary">
                                {g.items.map(([label, path]) => {
                                    const s = summary(path);
                                    const canonical = canonicalOf(path);
                                    return (
                                        <tr key={path}>
                                            <td className="px-4 py-2.5 align-top font-semibold text-primary">{label}</td>
                                            <td className="px-4 py-2.5 align-top">
                                                <div className="font-mono text-xs break-all text-secondary">{path}</div>
                                                {canonical !== path && <div className="mt-1 font-mono text-xs break-all text-tertiary">→ {canonical}</div>}
                                            </td>
                                            <td className="px-4 py-2.5 align-top text-secondary">
                                                {s.parts}
                                                {s.results && <div className="text-xs text-tertiary">{s.results}</div>}
                                            </td>
                                            <td className="px-4 py-2.5 align-top">
                                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold">
                                                    <a href={p3Url(path)} target="_blank" rel="noreferrer" className="text-brand-secondary hover:underline">
                                                        Open in P3
                                                    </a>
                                                    <button type="button" onClick={() => setPreview(path)} className="cursor-pointer text-brand-secondary hover:underline">
                                                        Preview
                                                    </button>
                                                    <Copy text={p3Url(path)} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </section>
                ))}

                <section className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary">
                    <h2 className="border-b border-secondary px-4 py-3 text-md font-semibold">Older Fox links and their canonical form</h2>
                    <table className="w-full text-left text-sm">
                        <tbody className="divide-y divide-secondary">
                            {LEGACY_LINKS.map((l) => {
                                const ok = canonicalOf(l.href) === l.canonical;
                                return (
                                    <tr key={l.href}>
                                        <td className="w-8 px-4 py-2.5 align-top">
                                            <span className={cx("font-semibold", ok ? "text-success-primary" : "text-error-primary")}>{ok ? "✓" : "✗"}</span>
                                        </td>
                                        <td className="px-4 py-2.5 align-top font-semibold text-primary">{l.label}</td>
                                        <td className="px-4 py-2.5 align-top font-mono text-xs break-all text-secondary">
                                            {l.href}
                                            <div className="text-tertiary">→ {l.canonical}</div>
                                        </td>
                                        <td className="px-4 py-2.5 align-top text-xs font-semibold">
                                            <a href={p3Url(l.href)} target="_blank" rel="noreferrer" className="text-brand-secondary hover:underline">
                                                Open in P3
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>

                <section className="rounded-xl bg-primary p-5 ring-1 ring-secondary">
                    <h2 className="text-lg font-semibold">Checks</h2>
                    <ul className="mt-3 grid gap-1.5 text-sm">
                        {checks.map((c) => (
                            <li key={c.label} className="flex gap-2">
                                <span className={cx("font-semibold", c.ok ? "text-success-primary" : "text-error-primary")}>{c.ok ? "✓" : "✗"}</span>
                                <span className="break-all text-secondary">{c.label}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export const DeepLinksAndChecks: Story = { name: "Deep links & checks", render: () => <DeepLinks /> };
