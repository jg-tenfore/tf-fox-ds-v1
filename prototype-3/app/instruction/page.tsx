import { InstructionHubPage } from "@/components/mcg-3/instruction/hub/instruction-hub-page";
import { Routed } from "./routed";

/** `/instruction` — the MCG Golf Academy hub: lessons, clinics, camps and instructors in one place. */
export default function Page() {
    return (
        <Routed>
            <InstructionHubPage />
        </Routed>
    );
}
