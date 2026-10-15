"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertIntegerPart = convertIntegerPart;
exports.convertFractionalPart = convertFractionalPart;
exports.normalizeNumericInput = normalizeNumericInput;
/**
 * Splits a non-negative integer into groups of 3 digits, most significant first.
 * @param num - Non-negative integer to split.
 * @returns Groups of 3 digits (each `0`-`999`), e.g. `1234567` -> `[1, 234, 567]`; `[0]` for `0`.
 */
function splitIntoGroups(num) {
    if (num === 0)
        return [0];
    const groups = [];
    let n = num;
    while (n > 0) {
        groups.unshift(n % 1000);
        n = Math.floor(n / 1000);
    }
    return groups;
}
/**
 * Spells out a non-negative integer using the given locale's rules.
 * @param value - Non-negative integer to spell out (the absolute integer part).
 * @param definition - Rules of the target locale.
 * @param num - Original input, only used in the error message.
 * @param locale - Locale code, only used in the error message.
 * @returns The integer in words, e.g. `1005` -> `"một nghìn không trăm linh năm"`.
 * @throws {Error} If `value` needs a larger scale word than `definition.scaleWords` provides.
 */
function convertIntegerPart(value, definition, num, locale) {
    if (value === 0)
        return definition.zero;
    const groups = splitIntoGroups(value);
    const maxScaleIndex = groups.length - 1;
    if (maxScaleIndex >= definition.scaleWords.length) {
        throw new Error(`numberToWords: ${num} exceeds the supported range for locale "${locale}"`);
    }
    const segments = [];
    let isLeadingGroup = true;
    groups.forEach((group, i) => {
        if (group === 0)
            return;
        const scaleIndex = maxScaleIndex - i;
        const scaleWord = definition.scaleWords[scaleIndex];
        const groupWords = definition.convertGroup(group, isLeadingGroup);
        segments.push(scaleWord ? `${groupWords} ${scaleWord}` : groupWords);
        isLeadingGroup = false;
    });
    return segments.join(" ");
}
/**
 * Spells out a fractional part one digit at a time, e.g. "05" -> "không năm".
 * @param fractionalDigits - Digits after the decimal separator, as written (leading zeros kept).
 * @param definition - Rules of the target locale.
 * @returns The digits in words, separated by spaces.
 */
function convertFractionalPart(fractionalDigits, definition) {
    return [...fractionalDigits].map((d) => definition.digits[Number(d)]).join(" ");
}
const numericStringPattern = /^-?\d+(\.\d+)?$/;
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
function normalizeNumericInput(num) {
    if (typeof num === "number") {
        if (!Number.isFinite(num)) {
            throw new Error(`numberToWords: ${num} is not a finite number`);
        }
        if (!Number.isInteger(num)) {
            throw new Error(`numberToWords: ${num} is a non-integer number, which may have lost precision as a float ` +
                `(trailing zeros, rounding) — pass it as a string instead, e.g. "${num}"`);
        }
        return num.toString();
    }
    const trimmed = num.trim();
    if (!numericStringPattern.test(trimmed)) {
        throw new Error(`numberToWords: "${num}" is not a valid numeric string`);
    }
    return trimmed;
}
