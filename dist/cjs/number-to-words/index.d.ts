import { NumberToWordsLocale } from "./types";
export { NumberToWordsLocale };
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
export declare function numberToWords(num: number | string, locale?: NumberToWordsLocale): string;
