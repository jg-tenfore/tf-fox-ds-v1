import { ACADEMY_ROSTER } from "@/components/mcg/academy-roster";
import { InstructorProfileScreen } from "@/components/mcg/academy/instructor-profile";

/**
 * `/instruction/pro/[id]` — the alternative, product-page-shaped instructor profile.
 *
 * A second route on purpose: `/instruction/instructors/[id]` keeps rendering the simpler
 * layout, so the two can be opened side by side and compared.
 */
export const generateStaticParams = () => ACADEMY_ROSTER.map((instructor) => ({ id: instructor.id }));

export default async function InstructorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <InstructorProfileScreen instructorId={id} />;
}
