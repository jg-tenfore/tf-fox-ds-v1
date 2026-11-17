import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "@untitledui/icons";

/**
 * The parts every Reviews › <round> › Summary is built from, after Buck's review summaries:
 * one article on a grey page, a dated header, then short blocks. A link is either a story
 * id (stays in Storybook, →) or a full address (a prototype page, opens a new tab, ↗).
 */

/** [story id or full URL, label] */
export type SummaryLink = [string, string];

export const B = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-primary">{children}</strong>;

const SummaryLinkItem = ({ to, children }: { to: string; children: ReactNode }) => {
    const external = /^https?:/.test(to);
    const Icon = external ? ArrowUpRight : ArrowRight;
    return (
        <a
            href={external ? to : `./?path=/${to.endsWith("--docs") ? "docs" : "story"}/${to}`}
            target={external ? "_blank" : "_top"}
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover hover:underline"
        >
            {children}
            <Icon aria-hidden="true" className="size-3.5" />
        </a>
    );
};

export const Links = ({ links }: { links: SummaryLink[] }) => (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {links.map(([to, label]) => (
            <SummaryLinkItem key={to + label} to={to}>
                {label}
            </SummaryLinkItem>
        ))}
    </div>
);

export const Block = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-2">
        <h2 className="text-md font-semibold text-primary">{title}</h2>
        <div className="flex flex-col gap-2 text-sm leading-relaxed text-secondary">{children}</div>
    </section>
);

export interface Change {
    title: string;
    body: ReactNode;
    links?: SummaryLink[];
}

/** Numbered cards: what was built, each with links to its screens. */
export const Changes = ({ items }: { items: Change[] }) => (
    <div className="flex flex-col gap-3">
        {items.map((c, i) => (
            <div key={c.title} className="rounded-xl p-4 ring-1 ring-secondary">
                <p className="font-semibold text-primary">
                    {i + 1} · {c.title}
                </p>
                <div className="mt-1 text-xs leading-relaxed text-tertiary">{c.body}</div>
                {c.links && c.links.length > 0 && (
                    <div className="mt-2">
                        <Links links={c.links} />
                    </div>
                )}
            </div>
        ))}
    </div>
);

export const List = ({ items }: { items: ReactNode[] }) => (
    <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
        {items.map((item, i) => (
            <li key={i}>{item}</li>
        ))}
    </ul>
);

/** The page: a dated header, then the blocks. */
export const SummaryPage = ({
    eyebrow,
    title,
    intro,
    meta,
    children,
}: {
    eyebrow: string;
    title: string;
    intro: ReactNode;
    /** Short facts under the intro, e.g. the pull request. */
    meta?: string[];
    children: ReactNode;
}) => (
    <div className="min-h-screen bg-secondary px-8 py-10">
        <article className="mx-auto flex max-w-3xl flex-col gap-8 rounded-2xl bg-primary p-8 shadow-xs ring-1 ring-secondary">
            <header className="flex flex-col gap-2 border-b border-secondary pb-6">
                <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">{eyebrow}</span>
                <h1 className="text-display-xs font-semibold text-primary">{title}</h1>
                <div className="text-sm text-tertiary">{intro}</div>
                {meta && meta.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {meta.map((m) => (
                            <span
                                key={m}
                                className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-secondary ring-1 ring-primary ring-inset"
                            >
                                {m}
                            </span>
                        ))}
                    </div>
                )}
            </header>
            {children}
        </article>
    </div>
);
