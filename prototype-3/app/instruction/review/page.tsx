import { LessonReviewPage } from "@/components/mcg-3/instruction/book/review-page";
import { Routed } from "../routed";

/** `/instruction/review` — the booking confirmation (`step=booked|waitlisted|registered`) or rate a lesson. */
export default function Page() {
    return (
        <Routed>
            <LessonReviewPage />
        </Routed>
    );
}
