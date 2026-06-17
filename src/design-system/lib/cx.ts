/**
 * Tiny class-name combiner for NativeWind. Filters out falsy values and joins
 * the rest with spaces. NativeWind resolves conflicting utilities by source
 * order, so put overrides last.
 */
export type ClassValue = string | false | null | undefined;

export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
