import { ClinicsRedirect } from "@/components/mcg-3/instruction/hub/clinics-redirect";
import { Routed } from "../instruction/routed";

/** Prototype 3 has no Clinics tab: the old URL opens Instruction on group programs. */
export default function Page() {
    return (
        <Routed>
            <ClinicsRedirect />
        </Routed>
    );
}
