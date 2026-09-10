"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberToWords = numberToWords;
const helpers_1 = require("./helpers");
const locales_1 = require("./locales");
/**
 * Spells out a number as words, following Vietnamese or English reading
 * conventions (e.g. `1005` -> `"một nghìn không trăm linh năm"` in Vietnamese,
 * `"one thousand five"` in English).
 *
 * Decimals are supported by passing `num` as a numeric **string** (e.g.
 * `"1.05"`) rather than a `number` — a JS `number` can only exactly
 * represent an integer here, so a non-integer `number` is rejected rather
 * than silently read out with floating-point rounding artifacts (e.g.
 * `0.1 + 0.2`). The fractional part is read one digit at a time after the
 * locale's decimal separator word (e.g. `"1.05"` -> `"một phẩy không năm"`,
 * `"one point zero five"`), keeping `1.05` distinct from `1.5` since a
 * leading fractional zero changes the value. Trailing fractional zeros
 * don't (`1.50 === 1.5`), so they're dropped — `"1.50"` reads the same as
 * `"1.5"`.
 *
 * @param num - Number to convert, as an integer `number` or a numeric string
 * (optionally with a decimal point, e.g. `"1.05"`). The integer part must be
 * finite and within the supported range (currently up to just under 10^18,
 * comfortably covering `Number.MAX_SAFE_INTEGER`).
 * @param locale - Target language. Defaults to `"vi"`. To support another
 * language, add an entry to the `definitions` registry in `locales.ts`.
 * @returns The number spelled out in words.
 * @throws {Error} If `num` is a non-integer `number`, an invalid numeric
 * string, `locale` isn't registered, or the integer part exceeds the
 * locale's supported range.
 */
function numberToWords(num, locale = "vi") {
    const definition = locales_1.definitions[locale];
    if (!definition) {
        throw new Error(`numberToWords: unsupported locale "${locale}"`);
    }
    const normalized = (0, helpers_1.normalizeNumericInput)(num);
    const isNegative = normalized.startsWith("-");
    const numStr = isNegative ? normalized.slice(1) : normalized;
    const [integerStr, rawFractionalStr] = numStr.split(".");
    // Trailing zeros never change the fractional value (1.50 === 1.5), unlike
    // leading zeros (0.05 !== 0.5), so only trailing zeros are safe to drop.
    const fractionalStr = rawFractionalStr === null || rawFractionalStr === void 0 ? void 0 : rawFractionalStr.replace(/0+$/, "");
    const integerWords = (0, helpers_1.convertIntegerPart)(Number(integerStr), definition, num, locale);
    const words = fractionalStr
        ? `${integerWords} ${definition.decimalSeparator} ${(0, helpers_1.convertFractionalPart)(fractionalStr, definition)}`
        : integerWords;
    return isNegative ? `${definition.negativePrefix}${words}` : words;
}
