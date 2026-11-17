"use client";

/**
 * `InstructionStory` — mounts the Instruction screens in Storybook at a URL, with an in-memory
 * router, the P3 session and the Instruction store, so every link and button in the story works
 * (filters, tiles, booking steps, packages) exactly as it does on :3002.
 *
 *     export const Search: Story = { render: () => <InstructionStory path="/instruction?course=needwood" /> };
 *
 * Paths outside Instruction (Tee Times, Sign in, Cart…) show a short "leaves the story" card.
 */
import { useCallback, useMemo, useState } from "react";
import { SessionProvider } from "@/components/mcg-3/session";
import { McgPage, McgShell } from "@/components/mcg-3/mcg-chrome";
import { clinicsHref } from "./data";
import { InstructionStoreProvider } from "./instruction-store";
import { renderInstructionRoute } from "./instruction-routes";
import { InstructionLink, InstructionMemoryNav } from "./nav";

const Elsewhere = ({ path, onBack }: { path: string; onBack: () => void }) => (
    <McgShell>
        <McgPage width="3xl">
            <div className="flex flex-col items-start gap-3 rounded-2xl bg-primary p-8 ring-1 ring-secondary ring-inset">
                <p className="text-lg font-semibold text-primary">This link leaves the Instruction story</p>
                <p className="text-sm text-tertiary">
                    <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">{path}</code> is another part of Prototype 3. Open it on the P3 app, or go back.
                </p>
                <div className="flex gap-4 text-sm font-semibold">
                    <button type="button" onClick={onBack} className="cursor-pointer text-brand-secondary hover:underline">
                        Back
                    </button>
                    <InstructionLink href="/instruction" className="text-brand-secondary hover:underline">
                        Instruction home
                    </InstructionLink>
                </div>
            </div>
        </McgPage>
    </McgShell>
);

export const InstructionStory = ({ path: initialPath }: { path: string }) => {
    const [stack, setStack] = useState<string[]>([initialPath]);
    const path = stack[stack.length - 1];
    const push = useCallback((href: string) => {
        setStack((s) => [...s, href.startsWith("/clinics") && !href.startsWith("/clinics/") ? clinicsHref() : href]);
        if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    }, []);
    const replace = useCallback((href: string) => setStack((s) => [...s.slice(0, -1), href]), []);
    const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), []);
    const nav = useMemo(() => ({ path, push, replace }), [path, push, replace]);
    const pathname = path.split("?")[0];
    const screen = renderInstructionRoute(pathname);
    return (
        <SessionProvider>
            <InstructionStoreProvider>
                <InstructionMemoryNav value={nav}>{screen ?? <Elsewhere path={path} onBack={back} />}</InstructionMemoryNav>
            </InstructionStoreProvider>
        </SessionProvider>
    );
};
