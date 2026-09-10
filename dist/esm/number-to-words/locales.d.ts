import { NumberToWordsDefinition, NumberToWordsLocale } from "./types";
/**
 * Registry of per-language spelling rules. Add a new language by adding a
 * key here (and, if its word lists warrant it, a dedicated block above) —
 * no other file needs to change.
 */
export declare const definitions: Record<NumberToWordsLocale, NumberToWordsDefinition>;
