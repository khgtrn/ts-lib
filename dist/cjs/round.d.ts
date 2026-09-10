/**
 * Rounds `value` to `precision` decimal places, mainly to clean up binary
 * floating-point noise from arithmetic (e.g. `491.66999999999996` instead of
 * `491.67`) rather than to reduce genuine precision. `precision` defaults to
 * 10, which is generous enough to preserve real fractional input while still
 * clearing noise that typically appears around the 15th-17th significant
 * digit.
 *
 * @param value - Number to round.
 * @param precision - Number of decimal places to keep. Defaults to `10`.
 * @returns `value` rounded to `precision` decimal places.
 */
export declare function round(value: number, precision?: number): number;
