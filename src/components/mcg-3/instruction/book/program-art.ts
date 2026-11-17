/**
 * Which photo a program shows in the booking summary and its confirmation: the program's own art,
 * else its Academy program art (`programArt`, which falls back to the range photo). Crane's
 * `useOfferingArt` also swaps in an org default photo set (`?photos=`); P3 has no default sets, so
 * this is the course's own photo or the Academy's.
 */
import { programArt } from "../data";

export const programArtFor = (programId: string, own?: string | null) => own || programArt(programId).image;
