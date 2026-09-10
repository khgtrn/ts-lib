import { NumberToWordsDefinition } from "./types";
/** Spells out a non-negative integer using the given locale's rules. */
export declare function convertIntegerPart(value: number, definition: NumberToWordsDefinition, num: number | string, locale: string): string;
/** Spells out a fractional part one digit at a time, e.g. "05" -> "không năm". */
export declare function convertFractionalPart(fractionalDigits: string, definition: NumberToWordsDefinition): string;
/**
 * Validates `num` and normalizes it to a plain (non-exponential, unsigned)
 * numeric string with a `-` prefix kept only to signal the sign, e.g.
 * `123` -> `"123"`, `"-1.50"` -> `"-1.50"`.
 *
 * A `number` is only accepted when it's an integer — a non-integer `number`
 * has already gone through IEEE-754 float conversion by the time this
 * function sees it (trailing zeros lost, rounding artifacts like
 * `0.1 + 0.2`), so decimals must be passed as a string instead, which is
 * read back digit-for-digit exactly as written.
 */
export declare function normalizeNumericInput(num: number | string): string;
