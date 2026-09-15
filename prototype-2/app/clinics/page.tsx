import { InstructionHubScreen } from "@/components/mcg-2/instruction/instruction-hub";

/**
 * Prototype 2 has no Clinics tab — clinics live under Instruction. The old URL still
 * works and opens Instruction filtered to group clinics.
 */
export default function Page() {
    return <InstructionHubScreen initialFilter={{ format: "group" }} />;
}
