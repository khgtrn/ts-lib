import { NumberToWordsDefinition } from "./types";
/**
 * Spells out a non-negative integer using the given locale's rules.
 * @param value - Non-negative integer to spell out (the absolute integer part).
 * @param definition - Rules of the target locale.
 * @param num - Original input, only used in the error message.
 * @param locale - Locale code, only used in the error message.
 * @returns The integer in words, e.g. `1005` -> `"một nghìn không trăm linh năm"`.
 * @throws {Error} If `value` needs a larger scale word than `definition.scaleWords` provides.
 */
export declare function convertIntegerPart(value: number, definition: NumberToWordsDefinition, num: number | string, locale: string): string;
/**
 * Spells out a fractional part one digit at a time, e.g. "05" -> "không năm".
 * @param fractionalDigits - Digits after the decimal separator, as written (leading zeros kept).
 * @param definition - Rules of the target locale.
 * @returns The digits in words, separated by spaces.
 */
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
 *
 * @param num - Integer `number`, or numeric string such as `"-1.50"`.
 * @returns The trimmed numeric string.
 * @throws {Error} If `num` is a non-finite or non-integer `number`, or a
 * string that isn't a plain decimal number.
 */
export declare function normalizeNumericInput(num: number | string): string;
