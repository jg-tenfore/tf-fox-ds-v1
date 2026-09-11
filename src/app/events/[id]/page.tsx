import { EventDetailScreen } from "@/components/mcg/events/event-detail";
import { MCG_EVENTS } from "@/components/mcg/events-catalog";

/** `output: "export"` needs every event page enumerated at build time. */
export const generateStaticParams = () => MCG_EVENTS.map((event) => ({ id: event.id }));

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EventDetailScreen eventId={id} />;
}
