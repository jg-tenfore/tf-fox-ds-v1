import { PRIVATE_SERVICES } from "@/components/instruction-2/instruction-catalog";
import { ServiceScreen } from "@/components/mcg-2/instruction/service-screen";

/** `/instruction/service/[id]` — choose an instructor (or any) for a private lesson. */
export const generateStaticParams = () => PRIVATE_SERVICES.map((service) => ({ id: service.id }));

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ServiceScreen serviceId={id} />;
}
