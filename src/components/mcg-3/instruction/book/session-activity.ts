/**
 * Booking → P3 account activity. Instruction keeps its own store (`instruction-store.tsx`), but
 * Prototype 3's account page lists `useSession().activity`, so a booking made here is also added
 * there — the lesson or registration then shows under "Your activity".
 */
import type { ActivityItem } from "@/components/mcg-3/session";
import { courseShortName, dateOfIso, type Coach, type LessonService } from "../data";
import type { BookableProgram } from "./book-model";

const dateLabelOf = (iso: string) => dateOfIso(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

export const lessonActivity = ({
    id,
    service,
    coach,
    course,
    dateIso,
    timeLabel,
    players,
    total,
}: {
    id: string;
    service: LessonService;
    coach: Coach;
    course: string;
    dateIso: string;
    timeLabel: string;
    players: number;
    total: number;
}): ActivityItem => ({
    id,
    kind: "lesson",
    title: `${service.name} with ${coach.name}`,
    detail: `${courseShortName(course)} · ${players} ${players === 1 ? "golfer" : "golfers"} · ${id}`,
    isoDate: dateIso,
    dateLabel: dateLabelOf(dateIso),
    timeLabel,
    courseSlug: course,
    amount: total,
    status: "Upcoming",
});

export const programActivity = ({ id, program, firstIso, people, total }: { id: string; program: BookableProgram; firstIso: string; people: number; total: number }): ActivityItem => ({
    id,
    kind: "clinic",
    title: program.name,
    detail: `${program.schedule} · ${people} ${people === 1 ? "spot" : "spots"} · ${id}`,
    isoDate: firstIso,
    dateLabel: dateLabelOf(firstIso),
    timeLabel: program.time.split(" – ")[0] || undefined,
    courseSlug: program.courseSlug,
    amount: total,
    status: "Upcoming",
});
