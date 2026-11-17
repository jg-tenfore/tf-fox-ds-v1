import { PackagesRoute } from "@/components/mcg-3/instruction/packages/packages-route";
import { Routed } from "../routed";

/** `/instruction/packages` — packs and plans; `?pack=` detail, `&step=checkout|done`. */
export default function Page() {
    return (
        <Routed>
            <PackagesRoute />
        </Routed>
    );
}
