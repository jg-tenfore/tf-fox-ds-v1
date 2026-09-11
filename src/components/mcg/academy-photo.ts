/**
 * Resolve an instructor's headshot.
 *
 * This lives apart from `academy-roster.ts` so the Instruction kit can render a photo
 * without importing the whole roster, and so the lookup has one home: a `Coach` in the
 * instruction catalog and an `AcademyInstructor` on the Academy page are the same
 * person addressed by the same id.
 */
import { asset } from "@/utils/asset";
import { ACADEMY_ROSTER } from "./academy-roster";

const WITH_PHOTOS = new Set(ACADEMY_ROSTER.filter((i) => !i.comingSoon).map((i) => i.id));

/** The Academy's placeholder for an instructor whose photo isn't published yet. */
export const COMING_SOON_PHOTO = asset("mcg-academy-images/coming-soon.jpg");

/**
 * A headshot URL, or `null` when the caller should fall back to initials — which
 * covers the "any available instructor" card and anyone not on the published roster.
 */
export const coachPhoto = (coach: { id: string; isAny?: boolean; comingSoon?: boolean }): string | null => {
    if (coach.isAny) return null;
    if (coach.comingSoon) return COMING_SOON_PHOTO;
    return WITH_PHOTOS.has(coach.id) ? asset(`mcg-academy-images/${coach.id}.jpg`) : null;
};
