import { serviceRouteIds } from "@/components/mcg-3/instruction/hub/service-ids";
import { ServicePage } from "@/components/mcg-3/instruction/hub/service-page";
import { Routed } from "../../routed";

/** `/instruction/service/[id]` — a private lesson, an Academy program or a county clinic. */
export const generateStaticParams = () => serviceRouteIds().map((id) => ({ id }));

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <Routed>
            <ServicePage id={id} />
        </Routed>
    );
}
