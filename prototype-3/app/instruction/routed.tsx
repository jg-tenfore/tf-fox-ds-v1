import { Suspense, type ReactNode } from "react";
import { McgShell } from "@/components/mcg-3/mcg-chrome";
import { InstructionAppRouter } from "@/components/mcg-3/instruction/nav";

/**
 * Instruction screens read their state from the query string (`useSearchParams`), which a static
 * export renders on the client. The fallback is the bare shell, so the nav and footer are in the
 * exported HTML and the page body fills in on load. `InstructionAppRouter` makes Fox buttons with
 * an `href` print basePath-correct links (see `nav.tsx`).
 */
export const Routed = ({ children }: { children: ReactNode }) => (
    <Suspense
        fallback={
            <McgShell>
                <div className="min-h-[70vh]" />
            </McgShell>
        }
    >
        <InstructionAppRouter>{children}</InstructionAppRouter>
    </Suspense>
);
