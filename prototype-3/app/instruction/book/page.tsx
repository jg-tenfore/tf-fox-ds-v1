import { BookPage } from "@/components/mcg-3/instruction/book/book-page";
import { Routed } from "../routed";

/** `/instruction/book?coach=&service=&course=` (+ date, time, players, step…) — see `book/book-model.ts`. */
export default function Page() {
    return (
        <Routed>
            <BookPage />
        </Routed>
    );
}
