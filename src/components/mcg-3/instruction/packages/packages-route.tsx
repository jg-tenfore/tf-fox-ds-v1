"use client";

import { packageById, subscriptionById } from "../data";
import { useInstructionQuery } from "../nav";
import { PackCheckoutPage, PackPurchasedPage, type Purchase } from "./pack-checkout-page";
import { PackDetailPage, PlanDetailPage } from "./pack-detail-page";
import { MonthlyPlansPage, PackagesPage } from "./packages-page";

/**
 * `/instruction/packages` — one route, every state in the URL (Crane's `packages-routes.tsx`):
 *   (none)                       the catalog; `?lessons=5|10` filters, `?coach=<id>` scopes to one instructor
 *   `?step=plans`                monthly plans (concept)
 *   `?pack=<pack id>`            pack detail → `&step=checkout` → `&step=done` (buys it into the store)
 *   `?pack=<plan id>`            plan detail (`&date=<iso>` start, `&renew=0`) → `&step=checkout` → `&step=done`
 * An unknown `pack` falls back to the catalog. `/instruction/credits` is `CreditsPage`.
 */
export const PackagesRoute = () => {
    const { query } = useInstructionQuery();
    if (query.pack) {
        const pack = packageById(query.pack);
        const plan = pack ? undefined : subscriptionById(query.pack);
        const purchase: Purchase | undefined = pack ? { kind: "pack", pack } : plan ? { kind: "plan", plan } : undefined;
        // Assigned packs (Thrive imports) are never for sale: only their detail renders.
        if (purchase && !(purchase.kind === "pack" && purchase.pack.availability === "assigned" && query.step)) {
            if (query.step === "checkout") return <PackCheckoutPage purchase={purchase} />;
            if (query.step === "done") return <PackPurchasedPage purchase={purchase} />;
            return purchase.kind === "pack" ? <PackDetailPage pack={purchase.pack} /> : <PlanDetailPage plan={purchase.plan} />;
        }
        if (purchase?.kind === "pack") return <PackDetailPage pack={purchase.pack} />;
    }
    if (query.step === "plans") return <MonthlyPlansPage />;
    return <PackagesPage />;
};
