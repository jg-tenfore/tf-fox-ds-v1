import { InstructionHubPage } from "@/components/mcg-3/instruction/hub/instruction-hub-page";
import { Routed } from "../routed";

/** `/instruction/instructors` — the hub on the Instructors tab. */
export default function Page() {
    return (
        <Routed>
            <InstructionHubPage view="instructors" />
        </Routed>
    );
}
