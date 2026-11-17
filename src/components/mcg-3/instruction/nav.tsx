"use client";

/**
 * Instruction navigation — one URL model for the P3 app and Storybook.
 *
 * Every Instruction state is a URL (`data/query.ts`). In the Next app those URLs are real:
 * links are `next/link`, pushes go through the App Router, and filter tweaks rewrite the
 * query in place with `history.replaceState` (Next keeps `useSearchParams` in step with it).
 * The state passed is `null` on purpose: Next 16.2 patches `replaceState` and treats any state
 * that carries its `__NA` marker as its own internal call, skipping the `useSearchParams` sync.
 * With `null`, Next copies its internal state across itself and the screen re-renders.
 *
 * Storybook can't navigate the App Router, so a story mounts `InstructionMemoryNav` (see
 * `story-router.tsx`): the same hooks and links then read and write an in-memory path, and
 * every screen stays clickable end to end inside one story.
 *
 *     const { query, setQuery } = useInstructionQuery();
 *     setQuery({ formats: ["clinic"] }, { replace: true });
 *     <InstructionLink href={serviceHref("private-45")}>45-minute private</InstructionLink>
 *
 * Hrefs are app-relative (`/instruction/...`, no basePath, no trailing slash); Next adds both.
 */
import { createContext, forwardRef, useCallback, useContext, useMemo, type AnchorHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RouterProvider as AriaRouterProvider } from "react-aria-components";
import { splitPath, withQuery, type InstructionQuery } from "./data/query";

export interface InstructionNavApi {
    /** App-relative path + query, e.g. `/instruction/book?coach=mike-kenny`. */
    path: string;
    push: (href: string) => void;
    replace: (href: string) => void;
    /** True inside a Storybook memory router. */
    memory: boolean;
}

const MemoryNavContext = createContext<InstructionNavApi | null>(null);

/** Mount around a story (see `story-router.tsx`) to navigate in memory instead of the App Router. */
export const InstructionMemoryNav = ({ value, children }: { value: Omit<InstructionNavApi, "memory">; children: ReactNode }) => {
    const api = useMemo<InstructionNavApi>(() => ({ ...value, memory: true }), [value]);
    return (
        <MemoryNavContext.Provider value={api}>
            {/* Fox `Button href` (react-aria links) navigate through this too. */}
            <AriaRouterProvider navigate={api.push}>{children}</AriaRouterProvider>
        </MemoryNavContext.Provider>
    );
};

const normalizePathname = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";

/** The deploy's basePath (`/tf-fox-ds-v1/prototype-3` on Pages, "" locally). */
const BASE_PATH = (process.env.NEXT_PUBLIC_ASSET_BASE ?? "/").replace(/\/+$/, "");

/** An app-relative href as the browser URL (basePath + trailing slash, which `output: "export"` serves). */
const browserUrl = (href: string) => {
    const [pathname, qs] = href.split("?");
    const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
    return `${BASE_PATH}${withSlash}${qs ? `?${qs}` : ""}`;
};

/** Current path + push/replace, from the memory router when there is one, else the App Router. */
export const useInstructionNav = (): InstructionNavApi => {
    const memory = useContext(MemoryNavContext);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const qs = searchParams?.toString() ?? "";
    const path = `${normalizePathname(pathname ?? "/")}${qs ? `?${qs}` : ""}`;
    const push = useCallback((href: string) => router.push(href), [router]);
    const replace = useCallback(
        (href: string) => {
            const [nextPath] = href.split("?");
            // Same page: rewrite the query in place (no RSC round trip per keystroke).
            if (typeof window !== "undefined" && normalizePathname(nextPath) === normalizePathname(pathname ?? "/")) {
                window.history.replaceState(null, "", browserUrl(href));
            } else router.replace(href, { scroll: false });
        },
        [router, pathname],
    );
    return useMemo(() => memory ?? { path, push, replace, memory: false }, [memory, path, push, replace]);
};

/**
 * The Instruction URL state for the current route: `query` parsed from the URL, `setQuery(patch)`
 * writes it back (a new history entry, or `{ replace: true }` for filter tweaks that shouldn't stack
 * up Back presses), `hrefWith(patch)` builds a link to the same page.
 */
export const useInstructionQuery = () => {
    const { path, push, replace } = useInstructionNav();
    const { pathname, query } = useMemo(() => splitPath(path), [path]);
    const hrefWith = useCallback((patch: Partial<InstructionQuery>) => withQuery(pathname, { ...query, ...patch }), [pathname, query]);
    const setQuery = useCallback(
        (patch: Partial<InstructionQuery>, opts?: { replace?: boolean }) => {
            const next = hrefWith(patch);
            if (opts?.replace) replace(next);
            else push(next);
        },
        [hrefWith, push, replace],
    );
    return { pathname, query, setQuery, hrefWith };
};

export type InstructionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; children?: ReactNode; scroll?: boolean };

/** A link that works in the P3 app (`next/link`) and in a Storybook memory router. */
export const InstructionLink = forwardRef<HTMLAnchorElement, InstructionLinkProps>(({ href, onClick, scroll, ...rest }, ref) => {
    const memory = useContext(MemoryNavContext);
    if (memory) {
        return (
            <a
                ref={ref}
                href={href}
                {...rest}
                onClick={(e) => {
                    onClick?.(e);
                    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || rest.target === "_blank") return;
                    e.preventDefault();
                    memory.push(href);
                }}
            />
        );
    }
    return <Link ref={ref} href={href} onClick={onClick} scroll={scroll} {...rest} />;
});
InstructionLink.displayName = "InstructionLink";

/**
 * Wraps the routed Instruction pages in the P3 app. Fox `Button href` renders a react-aria link,
 * and the app-wide `RouteProvider` would print the bare app-relative href (`/instruction/book?…`),
 * which breaks "open in new tab" under the Pages basePath. This provider keeps navigation on the
 * Next router but prints the browser URL (basePath + trailing slash) in the `href` attribute.
 */
export const InstructionAppRouter = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const navigate = useCallback((href: string) => router.push(href), [router]);
    const useHref = useCallback((href: string) => (href.startsWith("/") ? browserUrl(href) : href), []);
    return (
        <AriaRouterProvider navigate={navigate} useHref={useHref}>
            {children}
        </AriaRouterProvider>
    );
};
