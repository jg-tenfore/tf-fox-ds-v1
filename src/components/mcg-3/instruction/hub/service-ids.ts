import { ALL_OFFERINGS, LESSON_SERVICES, MCG_CLINICS } from "../data";

/** Every id `/instruction/service/[id]` must export: privates, Academy programs and county clinics. */
export const serviceRouteIds = () => [...new Set([...LESSON_SERVICES.map((s) => s.id), ...MCG_CLINICS.map((c) => c.id), ...ALL_OFFERINGS.map((o) => o.id)])];
