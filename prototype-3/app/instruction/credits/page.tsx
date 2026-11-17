import { CreditsPage } from "@/components/mcg-3/instruction/packages/credits-page";
import { Routed } from "../routed";

/** `/instruction/credits` — the golfer's lesson credits. */
export default function Page() {
    return (
        <Routed>
            <CreditsPage />
        </Routed>
    );
}
