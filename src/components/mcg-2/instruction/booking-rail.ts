/**
 * Prototype 2's booking steps, named the way Square Appointments names them.
 *
 * Details and payment are one Checkout page, as in Square. Extras is Square's "Add more
 * to your appointment?".
 *
 * One rail for every private-lesson path, whichever way the golfer came in: from a
 * service (Service → Instructor → …) or from an instructor's profile (the first two are
 * already done when they arrive). Showing the completed steps rather than hiding them is
 * the point — the golfer can see what they've chosen and what's left.
 */
export const SQUARE_RAIL = ["Service", "Instructor", "Extras", "Date & time", "Checkout"];
