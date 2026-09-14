/**
 * Checks whether a value is considered "empty".
 *
 * - string: empty after trimming.
 * - number: equal to `0`.
 * - boolean: `false`.
 * - `null`/`undefined`: always empty.
 * - array: length `0`.
 * - other objects: no own enumerable keys.
 * - anything else (function, symbol, ...): never empty.
 *
 * @param value - Value to check.
 * @returns `true` if the value is considered empty.
 */
export declare function isEmpty(value: any): boolean;
/**
 * Checks whether a value is a valid number (not `NaN`, not `Infinity`).
 * @param value - Value to check.
 * @returns Type-guard: `true` if `value` is a finite number.
 */
export declare function isNumber(value: any): value is number;
/**
 * Nếu giá trị của `value` không phải là null hoặc undefined thì lấy, ngược lại trả về `defaultValue`.
 * @note Sử dụng thay cho cú pháp `??`. Nếu TS3.7 trở lên thì không cần dùng.
 * @param value Giá trị cần kiểm tra
 * @param defaultValue Giá trị mặc định trả về nếu `value` là null hoặc undefined
 * @global
 */
export declare function nullish(value: any, defaultValue: any): any;
/**
 * JSON.parse với giá trị mặc định nếu có lỗi
 * @param s giá trị JSON cần parse
 * @param defaultValue giá trị mặc định trả về nếu có lỗi khi parse. Mặc định là null
 * @returns any
 */
export declare function jsonParse<T = any>(s: string, defaultValue?: T | any): T | null;
/**
 * Converts Vietnamese diacritics to their plain ASCII equivalents
 * (e.g. `"Điều chỉnh"` -> `"Dieu chinh"`).
 *
 * @param s - Input string.
 * @returns The string with Vietnamese diacritics removed.
 */
export declare function vi2en(s: string): string;
/**
 * Normalizes Windows-style line endings (`\r\n`) to Unix-style (`\n`).
 * @param value - Input string.
 * @returns The string with all `\r\n` replaced by `\n`.
 */
export declare function crlf2lf(value: string): string;
/**
 * Removes every newline from a string, after normalizing line endings and
 * trimming surrounding whitespace.
 * @param value - Input string.
 * @returns The string with all newlines removed.
 */
export declare function removeNewline(value: string): string;
/**
 * Thêm ký tự vào đầu chuỗi cho đến khi đạt được độ dài mục tiêu
 * @param str Chuỗi gốc
 * @param targetLength Độ dài mục tiêu sau khi thêm ký tự
 * @param padChar Ký tự dùng để thêm vào đầu chuỗi (mặc định là "0")
 * @returns Chuỗi đã được thêm ký tự vào đầu nếu cần thiết
 * @global
 */
export declare function padStart(str: string, targetLength: number, padChar?: string): string;
/**
 * Thêm ký tự vào cuối chuỗi cho đến khi đạt được độ dài mục tiêu
 * @param str Chuỗi gốc
 * @param targetLength Độ dài mục tiêu sau khi thêm ký tự
 * @param padChar Ký tự dùng để thêm vào cuối chuỗi (mặc định là "0")
 * @returns Chuỗi đã được thêm ký tự vào cuối nếu cần thiết
 * @global
 */
export declare function padEnd(str: string, targetLength: number, padChar?: string): string;
/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param array - Array to shuffle (mutated directly).
 * @returns The same array reference, shuffled.
 */
export declare function shuffleArray(array: any[]): any[];
/**
 * Collects an object's own enumerable values into an array.
 * @param obj - Source object. `null`/`undefined` yields an empty array.
 * @returns Array of the object's values.
 */
export declare function objectValueToArray(obj: any): any[];
/**
 * Groups list items by the key returned from `fn`, similar to Lodash's
 * `groupBy`. Keys are compared by their JSON representation, so they can be
 * primitives or plain objects.
 *
 * @param list - Array-like list of items to group. `null`/`undefined` yields an empty array.
 * @param fn - Maps an item to the value used to group it.
 * @returns Array of groups, each an array of items sharing the same key.
 */
export declare function groupBy(list: any, fn: (item: any) => any): any[];
/**
 * Remove keys from object or array
 * @param objectOrArray Object or array
 * @param keys Keys to remove
 * @returns Object or array with keys removed
 */
export declare function removeByKey<T = any>(objectOrArray: T, keys: string[]): T;
/**
 * Remove empty values from object or array
 * @param objectOrArray Object or array
 * @param options Options:
 * - removeNull: Remove null values. Default: true
 * - removeUndefined: Remove undefined values. Default: true
 * - removeEmptyString: Remove empty string values. Default: true
 * @returns Object or array with empty values removed
 */
export declare function removeEmptyValue<T = any>(objectOrArray: T, options?: {
    removeNull?: boolean;
    removeUndefined?: boolean;
    removeEmptyString?: boolean;
}): T;
/**
 * Generates a random string of the given length, optionally guaranteeing at
 * least one character from each requested category ("upper", "lower",
 * "number", "specific").
 *
 * @param length - Desired length of the resulting string.
 * @param opt - Character categories that must each appear at least once.
 * `"specific"` only counts as a required category when `specificChars` is
 * non-empty; otherwise it's silently ignored (as if not requested at all).
 * @param specificChars - Custom character set used for the `"specific"` category.
 * @returns A random string of exactly `length` characters. If `opt` is empty
 * (or every requested category ends up unusable), falls back to alphanumeric
 * characters rather than returning an empty string.
 * @throws {Error} If `length` is smaller than the number of required categories,
 * since the "at least one of each" guarantee couldn't fit otherwise.
 */
export declare function randomString(length: number, opt?: ("upper" | "lower" | "number" | "specific")[], specificChars?: string): string;
/**
 * Formats a byte value (0-255) as a zero-padded, 2-digit lowercase hex string.
 * Intended for internal use with well-formed byte values (e.g. from a
 * `Uint8Array`); values outside 0-255 are not validated.
 *
 * @param b - Byte value, expected in the 0-255 range.
 * @returns 2-character hex string, e.g. `"0f"`.
 */
export declare function byte2hex(b: number): string;
/**
 * Generates the raw 16 bytes of a UUIDv7 (timestamp + random, RFC 4122
 * variant). Relies on the Web Crypto `crypto.getRandomValues` API, available
 * in browsers and modern Node.js.
 *
 * @returns 16-byte `Uint8Array` encoding a UUIDv7.
 */
export declare function uuid7bin(): Uint8Array;
/**
 * Generates a UUIDv7 string (e.g. `"01890a5d-ac96-774b-bcce-b302099a8057"`).
 * @returns UUIDv7 in the standard 8-4-4-4-12 hex string format.
 */
export declare function uuid7(): string;
/**
 * Encodes a string to base64 (UTF-8 bytes).
 * @param str - String to encode.
 * @returns Base64-encoded string.
 */
export declare function base64encode(str: string): string;
/**
 * Decodes a base64 string back to its original (UTF-8) string.
 * @param base64 - Base64-encoded string.
 * @returns Decoded string.
 */
export declare function base64decode(base64: string): string;
/**
 * Reads a nested property from an object using a dot-separated path.
 * Example: `getObjectValue(user, 'abc.def')` returns `user.abc.def`.
 *
 * Equivalent to optional chaining (`object?.abc?.def`), for use on
 * TypeScript versions below 3.7 (e.g. Angular versions below 9). On newer
 * TypeScript versions, prefer optional chaining directly instead.
 *
 * @param object - Source object.
 * @param path - Dot-separated property path.
 * @returns The resolved value, or `null`/`undefined` if any segment is missing.
 * @global
 */
export declare function getObjectValue(object: null | undefined | Record<string, any>, path: string): any;
/**
 * Short alias for {@link getObjectValue}.
 * @param object - Source object.
 * @param path - Dot-separated property path.
 * @returns The resolved value, or `null`/`undefined` if any segment is missing.
 */
export declare function ov(object: null | undefined | Record<string, any>, path: string): any;
/**
 * Converts a value to an integer, similar to `parseInt`/`Number` but with an
 * explicit fallback for empty values (see {@link isEmpty}).
 *
 * @param value - Value to convert.
 * @param defaultValue - Value returned when `value` is empty. Defaults to `0`.
 * @returns The parsed integer, `defaultValue` if `value` is empty, or `NaN`
 * if `value` is a non-numeric, non-empty string.
 */
export declare function toInt(value: any, defaultValue?: number | null | undefined): number | null | undefined;
/**
 * Converts a positive integer to a Roman numeral. Only supports the standard
 * range (1-3999); larger numbers produce a non-standard repeating "M" prefix.
 *
 * @param num - Number to convert.
 * @returns Roman numeral string, or `""` if `num` is zero or negative.
 */
export declare function numberToRoman(num: number): string;
/**
 * Converts a Roman numeral string to a number. Does not validate that the
 * input is a well-formed Roman numeral (use {@link isRomanNumber} first if
 * that matters) — unrecognized characters make the result `NaN`.
 *
 * @param roman - Roman numeral string (case-sensitive, uppercase letters).
 * @returns The numeric value, or `NaN` if `roman` contains unrecognized characters.
 */
export declare function romanToNumber(roman: string): number;
/**
 * Checks whether a string is a well-formed Roman numeral (1-3999), matching
 * the standard subtractive notation. Case-insensitive.
 *
 * @param value - String to validate.
 * @returns `true` if `value` is a valid Roman numeral.
 */
export declare function isRomanNumber(value: string): boolean;
/**
 * Converts a base64 string to a `Blob`. Browser-only (relies on `atob` and
 * `Blob`).
 *
 * @param base64 - Base64-encoded content.
 * @param mimeType - MIME type to assign to the resulting `Blob`.
 * @param sliceSize - Chunk size (in decoded characters) used while building
 * the byte arrays, to avoid excessive memory allocation for large inputs.
 * @returns A `Blob` containing the decoded bytes.
 */
export declare function base64ToBlob(base64: string, mimeType: string, sliceSize?: number): Blob;
/**
 * Triggers a browser download (or opens in a tab) for base64-encoded file
 * content. Browser-only (relies on `document`, `URL.createObjectURL`).
 *
 * @param fileName - Suggested file name for the download.
 * @param mimeType - MIME type/subtype (a bare subtype like `"pdf"` is
 * expanded to `"application/pdf"`).
 * @param base64Content - Base64-encoded file content.
 * @param action - `"download"` saves the file, `"open"` opens it in the same
 * tab, `"open_blank"` opens it in a new tab. Defaults to `"download"`.
 */
export declare function downloadFile(fileName: string, mimeType: string, base64Content: string, action?: "download" | "open" | "open_blank"): void;
/**
 * Recursively clones plain objects, arrays and `Date` instances.
 *
 * Note: `Date` has no own enumerable properties, so a plain for-in copy
 * would silently turn every `Date` into an empty `{}` — it's special-cased
 * here. Other special object types (`Map`, `Set`, `RegExp`, ...) are not
 * handled and will also be cloned as plain `{}`.
 *
 * @param obj - Value to clone.
 * @returns A deep copy of `obj` (primitives are returned as-is).
 */
export declare function deepClone(obj: any): any;
