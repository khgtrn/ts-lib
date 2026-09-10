/**
 * Locale code supported by {@link numberToWords}. Extend by adding a new key
 * to the `definitions` registry in `locales.ts` (see
 * {@link NumberToWordsDefinition}) — no changes to `numberToWords` itself
 * are needed to add a language.
 */
export type NumberToWordsLocale = "vi" | "en";
/**
 * Per-locale rules needed to spell out numbers.
 *
 * Numbers are split into groups of 3 digits (thousands grouping), most
 * significant group first. `scaleWords[i]` is the word placed after a group
 * at position `i` counting from the right (`0` = units group, which gets no
 * scale word; `1` = thousand-level; `2` = million-level; and so on).
 */
export interface NumberToWordsDefinition {
    /** Word for the number `0` on its own. */
    zero: string;
    /** Prefix used for negative numbers (including trailing space, if any). */
    negativePrefix: string;
    /** Word placed between the integer and fractional parts, e.g. "phẩy"/"point". */
    decimalSeparator: string;
    /** Word for each digit `0`-`9`, used to read the fractional part one digit at a time. */
    digits: string[];
    /** Scale words indexed by group position: `["", "thousand", "million", ...]`. */
    scaleWords: string[];
    /**
     * Spells out a single 0-999 group.
     * @param n - Group value, `1`-`999` (the caller never invokes this for `0`).
     * @param isLeadingGroup - `true` for the most significant non-zero group of
     * the whole number. Some languages (e.g. Vietnamese) read a zero hundreds
     * digit explicitly ("không trăm") in every group except the leading one.
     */
    convertGroup(n: number, isLeadingGroup: boolean): string;
}
