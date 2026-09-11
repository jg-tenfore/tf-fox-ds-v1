import { ClinicDetailScreen } from "@/components/mcg/events/clinic-detail";
import { MCG_CLINICS } from "@/components/mcg/events-catalog";

/** `output: "export"` needs every clinic page enumerated at build time. */
export const generateStaticParams = () => MCG_CLINICS.map((clinic) => ({ id: clinic.id }));

export default async function ClinicPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ClinicDetailScreen clinicId={id} />;
}
