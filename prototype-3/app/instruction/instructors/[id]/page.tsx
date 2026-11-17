import { ACADEMY_ROSTER } from "@/components/mcg-3/instruction/data";
import { InstructorProfilePage } from "@/components/mcg-3/instruction/pro/instructor-profile-page";
import { Routed } from "../../routed";

/** An instructor's profile. `/instruction/pro/[id]` and `/instruction/instructors/[id]` render the same page. */
export const generateStaticParams = () => ACADEMY_ROSTER.map((instructor) => ({ id: instructor.id }));

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <Routed>
            <InstructorProfilePage id={id} />
        </Routed>
    );
}
