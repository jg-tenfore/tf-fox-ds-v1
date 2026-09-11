import { ACADEMY_ROSTER } from "@/components/mcg/academy-roster";
import { AcademyInstructorDetailScreen } from "@/components/mcg/academy/instructor-detail";

/** `output: "export"` needs every instructor page enumerated at build time. */
export const generateStaticParams = () => ACADEMY_ROSTER.map((instructor) => ({ id: instructor.id }));

export default async function InstructorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AcademyInstructorDetailScreen instructorId={id} />;
}
