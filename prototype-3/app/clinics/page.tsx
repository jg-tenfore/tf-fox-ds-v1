import { InstructionHubScreen } from "@/components/mcg-3/instruction/instruction-hub";

/**
 * Prototype 3 has no Clinics tab — clinics live under Instruction. The old URL still
 * works and opens Instruction filtered to group clinics.
 */
export default function Page() {
    return <InstructionHubScreen initialFilter={{ formats: ["clinic", "junior-camp", "junior-league", "op36"] }} />;
}
