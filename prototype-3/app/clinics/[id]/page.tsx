import { MCG_CLINICS } from "@/components/mcg-3/instruction/data";
import { ServicePage } from "@/components/mcg-3/instruction/hub/service-page";
import { Routed } from "../../instruction/routed";

/** Old clinic URLs keep working: they render the clinic's service page. */
export const generateStaticParams = () => MCG_CLINICS.map((clinic) => ({ id: clinic.id }));

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <Routed>
            <ServicePage id={id} />
        </Routed>
    );
}
