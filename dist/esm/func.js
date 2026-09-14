/**
 * Checks whether a value is considered "empty".
 *
 * - string: empty after trimming.
 * - number: equal to `0`.
 * - boolean: `false`.
 * - `null`/`undefined`: always empty.
 * - array: length `0`.
 * - `Map`/`Set`: `size` equal to `0`.
 * - `Date`: never empty (it always holds a timestamp, even if `Invalid Date`).
 * - other objects: no own enumerable keys.
 * - anything else (function, symbol, ...): never empty.
 *
 * @param value - Value to check.
 * @returns `true` if the value is considered empty.
 */
export function isEmpty(value) {
    if (typeof value === "string") {
        return value.trim() === "";
    }
    else if (typeof value === "number") {
        return value === 0;
    }
    else if (typeof value === "boolean") {
        return !value;
    }
    else if (value === undefined || value === null) {
        return true;
    }
    else if (Array.isArray(value)) {
        return value.length === 0;
    }
    else if (value instanceof Map || value instanceof Set) {
        return value.size === 0;
    }
    else if (value instanceof Date) {
        return false;
    }
    else if (typeof value === "object") {
        return Object.keys(value).length === 0;
    }
    return false;
}
/**
 * Checks whether a value is a valid number (not `NaN`, not `Infinity`).
 * @param value - Value to check.
 * @returns Type-guard: `true` if `value` is a finite number.
 */
export function isNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
}
/**
 * Nếu giá trị của `value` không phải là null hoặc undefined thì lấy, ngược lại trả về `defaultValue`.
 * @note Sử dụng thay cho cú pháp `??`. Nếu TS3.7 trở lên thì không cần dùng.
 * @param value Giá trị cần kiểm tra
 * @param defaultValue Giá trị mặc định trả về nếu `value` là null hoặc undefined
 * @global
 */
export function nullish(value, defaultValue) {
    return value !== null && value !== undefined ? value : defaultValue;
}
export function jsonParse(s, defaultValue = null) {
    if (s === null || s === undefined)
        return defaultValue;
    try {
        return JSON.parse(s);
    }
    catch (e) {
        return defaultValue;
    }
}
/**
 * Converts Vietnamese diacritics to their plain ASCII equivalents
 * (e.g. `"Điều chỉnh"` -> `"Dieu chinh"`).
 *
 * @param s - Input string.
 * @returns The string with Vietnamese diacritics removed.
 */
export function vi2en(s) {
    return (s
        // Decompose accented characters into base character + combining mark
        .normalize("NFD")
        // Strip all combining diacritical marks
        .replace(/[\u0300-\u036f]/g, "")
        // đ/Đ have no combining-mark decomposition, handle them separately
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D"));
}
/**
 * Normalizes Windows-style line endings (`\r\n`) to Unix-style (`\n`).
 * @param value - Input string.
 * @returns The string with all `\r\n` replaced by `\n`.
 */
export function crlf2lf(value) {
    return value.replace(/\r\n/g, "\n");
}
/**
 * Removes every newline from a string, after normalizing line endings and
 * trimming surrounding whitespace.
 * @param value - Input string.
 * @returns The string with all newlines removed.
 */
export function removeNewline(value) {
    return crlf2lf(value).trim().replace(/\n/g, "");
}
/**
 * Thêm ký tự vào đầu chuỗi cho đến khi đạt được độ dài mục tiêu
 * @param str Chuỗi gốc
 * @param targetLength Độ dài mục tiêu sau khi thêm ký tự
 * @param padChar Ký tự dùng để thêm vào đầu chuỗi (mặc định là "0")
 * @returns Chuỗi đã được thêm ký tự vào đầu nếu cần thiết
 * @global
 */
export function padStart(str, targetLength, padChar = "0") {
    str = String(str);
    if (str.length >= targetLength || !padChar)
        return str;
    const padding = padChar
        .repeat(Math.ceil((targetLength - str.length) / padChar.length))
        .substring(0, targetLength - str.length);
    return padding + str;
}
/**
 * Thêm ký tự vào cuối chuỗi cho đến khi đạt được độ dài mục tiêu
 * @param str Chuỗi gốc
 * @param targetLength Độ dài mục tiêu sau khi thêm ký tự
 * @param padChar Ký tự dùng để thêm vào cuối chuỗi (mặc định là "0")
 * @returns Chuỗi đã được thêm ký tự vào cuối nếu cần thiết
 * @global
 */
export function padEnd(str, targetLength, padChar = "0") {
    str = String(str);
    if (str.length >= targetLength || !padChar)
        return str;
    const padding = padChar
        .repeat(Math.ceil((targetLength - str.length) / padChar.length))
        .substring(0, targetLength - str.length);
    return str + padding;
}
/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param array - Array to shuffle (mutated directly).
 * @returns The same array reference, shuffled.
 */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
/**
 * Collects an object's own enumerable values into an array.
 * @param obj - Source object. `null`/`undefined` yields an empty array.
 * @returns Array of the object's values.
 */
export function objectValueToArray(obj) {
    if (obj === null || obj === undefined)
        return [];
    return Object.keys(obj).map((key) => obj[key]);
}
/**
 * Groups list items by the key returned from `fn`, similar to Lodash's
 * `groupBy`. Keys are compared by their JSON representation, so they can be
 * primitives or plain objects.
 *
 * @param list - Array-like list of items to group. `null`/`undefined` yields an empty array.
 * @param fn - Maps an item to the value used to group it.
 * @returns Array of groups, each an array of items sharing the same key.
 */
export function groupBy(list, fn) {
    if (!list)
        return [];
    var groups = {};
    for (var i = 0; i < list.length; i++) {
        var group = JSON.stringify(fn(list[i]));
        if (group in groups) {
            groups[group].push(list[i]);
        }
        else {
            groups[group] = [list[i]];
        }
    }
    return objectValueToArray(groups);
}
/**
 * Checks whether `value` is a plain object (`{}` literal or `Object.create(null)`),
 * as opposed to an array or a special built-in like `Date`/`Map`/`Set`/`RegExp`.
 */
export function isPlainObject(value) {
    if (typeof value !== "object" || value === null || Array.isArray(value))
        return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
/**
 * Remove keys from object or array
 * @param objectOrArray Object or array
 * @param keys Keys to remove
 * @returns Object or array with keys removed
 */
export function removeByKey(objectOrArray, keys) {
    if (Array.isArray(objectOrArray)) {
        return objectOrArray.map((item) => typeof item === "object" && item !== null ? removeByKey(item, keys) : item);
    }
    if (isPlainObject(objectOrArray)) {
        const source = objectOrArray;
        const result = {};
        Object.keys(source).forEach((key) => {
            if (keys.includes(key))
                return;
            const value = source[key];
            result[key] =
                Array.isArray(value) || (typeof value === "object" && value !== null)
                    ? removeByKey(value, keys)
                    : value;
        });
        return result;
    }
    // Primitives and non-plain objects (Date, Map, Set, RegExp, ...) are returned as-is
    return objectOrArray;
}
/**
 * Remove empty values from object or array
 * @param objectOrArray Object or array
 * @param options Options:
 * - removeNull: Remove null values. Default: true
 * - removeUndefined: Remove undefined values. Default: true
 * - removeEmptyString: Remove empty string values. Default: true
 * @returns Object or array with empty values removed
 */
export function removeEmptyValue(objectOrArray, options = {}) {
    const { removeNull = true, removeUndefined = true, removeEmptyString = true } = options;
    const shouldRemove = (value) => (removeNull && value === null) ||
        (removeUndefined && value === undefined) ||
        (removeEmptyString && value === "");
    if (Array.isArray(objectOrArray)) {
        const result = objectOrArray
            .map((item) => {
            if (Array.isArray(item) || (typeof item === "object" && item !== null)) {
                return removeEmptyValue(item, {
                    removeNull,
                    removeUndefined,
                    removeEmptyString,
                });
            }
            return item;
        })
            .filter((item) => !shouldRemove(item));
        return result;
    }
    if (isPlainObject(objectOrArray)) {
        const source = objectOrArray;
        const result = {};
        Object.keys(source).forEach((key) => {
            const rawValue = source[key];
            const value = Array.isArray(rawValue) || (typeof rawValue === "object" && rawValue !== null)
                ? removeEmptyValue(rawValue, { removeNull, removeUndefined, removeEmptyString })
                : rawValue;
            if (!shouldRemove(value)) {
                result[key] = value;
            }
        });
        return result;
    }
    // Primitives and non-plain objects (Date, Map, Set, RegExp, ...) are returned as-is
    return objectOrArray;
}
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
export function randomString(length, opt = [], specificChars = "") {
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const requiredCategories = new Set(opt);
    // Without specificChars, "specific" can't be honored, so treat it as unset
    if (!specificChars) {
        requiredCategories.delete("specific");
    }
    if (length < requiredCategories.size) {
        throw new Error(`length (${length}) is too small to include one of each required category: ${[...requiredCategories].join(", ")}`);
    }
    let result = [];
    let allChars = "";
    const randomOneChar = (chars) => chars.charAt(Math.floor(Math.random() * chars.length));
    if (requiredCategories.has("upper")) {
        allChars += upperChars;
        // Guarantee at least one uppercase letter
        result.push(randomOneChar(upperChars));
    }
    if (requiredCategories.has("lower")) {
        allChars += lowerChars;
        // Guarantee at least one lowercase letter
        result.push(randomOneChar(lowerChars));
    }
    if (requiredCategories.has("number")) {
        allChars += numbers;
        // Guarantee at least one digit
        result.push(randomOneChar(numbers));
    }
    if (requiredCategories.has("specific")) {
        allChars += specificChars;
        // Guarantee at least one character from the custom set
        result.push(randomOneChar(specificChars));
    }
    // If no category applied (e.g. opt is empty, or only "specific" was
    // requested without specificChars), fall back to alphanumeric so the
    // result isn't silently empty.
    if (!allChars) {
        allChars = upperChars + lowerChars + numbers;
    }
    // Fill up the remaining characters to reach the requested length
    for (let i = result.length; i < length; i++) {
        result.push(randomOneChar(allChars));
    }
    // Shuffle so the guaranteed characters aren't always at the front
    return shuffleArray(result).join("");
}
/**
 * Formats a byte value (0-255) as a zero-padded, 2-digit lowercase hex string.
 * Intended for internal use with well-formed byte values (e.g. from a
 * `Uint8Array`); values outside 0-255 are not validated.
 *
 * @param b - Byte value, expected in the 0-255 range.
 * @returns 2-character hex string, e.g. `"0f"`.
 */
export function byte2hex(b) {
    return ("0" + b.toString(16)).slice(-2);
}
/**
 * Generates the raw 16 bytes of a UUIDv7 (timestamp + random, RFC 4122
 * variant). Relies on the Web Crypto `crypto.getRandomValues` API, available
 * in browsers and modern Node.js.
 *
 * @returns 16-byte `Uint8Array` encoding a UUIDv7.
 */
export function uuid7bin() {
    var bytes = new Uint8Array(16);
    var now = Date.now();
    // 48-bit timestamp (ms). Division (rather than a left shift) is used so
    // values above the 32-bit range bitwise operators support are still split
    // correctly; `&` truncates the fractional part left over from the division.
    bytes[0] = (now / 0x10000000000) & 0xff;
    bytes[1] = (now / 0x100000000) & 0xff;
    bytes[2] = (now / 0x1000000) & 0xff;
    bytes[3] = (now / 0x10000) & 0xff;
    bytes[4] = (now / 0x100) & 0xff;
    bytes[5] = now & 0xff;
    // random 10 bytes
    var rnd = new Uint8Array(10);
    crypto.getRandomValues(rnd);
    for (var i = 0; i < 10; i++) {
        bytes[i + 6] = rnd[i];
    }
    // version 7
    bytes[6] = (bytes[6] & 0x0f) | 0x70;
    // variant RFC4122
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return bytes;
}
/**
 * Generates a UUIDv7 string (e.g. `"01890a5d-ac96-774b-bcce-b302099a8057"`).
 * @returns UUIDv7 in the standard 8-4-4-4-12 hex string format.
 */
export function uuid7() {
    var bin = uuid7bin();
    var hex = [];
    for (var i = 0; i < bin.length; i++) {
        hex.push(byte2hex(bin[i]));
    }
    return [
        hex.slice(0, 4).join(""),
        hex.slice(4, 6).join(""),
        hex.slice(6, 8).join(""),
        hex.slice(8, 10).join(""),
        hex.slice(10).join(""),
    ].join("-");
}
/**
 * Encodes a string to base64 (UTF-8 bytes).
 * @param str - String to encode.
 * @returns Base64-encoded string.
 */
export function base64encode(str) {
    const bytes = new TextEncoder().encode(str);
    // Spreading the whole byte array into String.fromCharCode blows the call
    // stack for large inputs, so build the binary string in bounded chunks.
    const chunkSize = 0x8000;
    let binary = "";
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}
/**
 * Decodes a base64 string back to its original (UTF-8) string.
 * @param base64 - Base64-encoded string.
 * @returns Decoded string.
 */
export function base64decode(base64) {
    return new TextDecoder().decode(Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)));
}
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
export function getObjectValue(object, path) {
    if (object === null || object === undefined)
        return null;
    return path
        .split(".")
        .reduce((acc, part) => (acc === null || acc === undefined ? acc : acc[part]), object);
}
/**
 * Short alias for {@link getObjectValue}.
 * @param object - Source object.
 * @param path - Dot-separated property path.
 * @returns The resolved value, or `null`/`undefined` if any segment is missing.
 */
export function ov(object, path) {
    return getObjectValue(object, path);
}
/**
 * Converts a value to an integer, similar to `parseInt`/`Number` but with an
 * explicit fallback for empty values (see {@link isEmpty}).
 *
 * A finite `number` is truncated directly (not routed through {@link isEmpty}),
 * so `toInt(0, 100)` returns `0` rather than `100` — `isEmpty(0)` is `true`,
 * which would otherwise make a literal `0` input indistinguishable from a
 * missing value.
 *
 * @param value - Value to convert.
 * @param defaultValue - Value returned when `value` is empty. Defaults to `0`.
 * @returns The parsed integer, `defaultValue` if `value` is empty, or `NaN`
 * if `value` is a non-numeric, non-empty string.
 */
export function toInt(value, defaultValue = 0) {
    if (isNumber(value))
        return Math.trunc(value);
    if (isEmpty(value))
        return defaultValue;
    return typeof value === "string" ? Number.parseInt(value.trim()) : Number(value);
}
/**
 * Converts a positive integer to a Roman numeral. Only supports the standard
 * range (1-3999); larger numbers produce a non-standard repeating "M" prefix.
 *
 * @param num - Number to convert.
 * @returns Roman numeral string, or `""` if `num` is zero or negative.
 */
export function numberToRoman(num) {
    if (num <= 0)
        return "";
    const romanMap = [
        { value: 1000, numeral: "M" },
        { value: 900, numeral: "CM" },
        { value: 500, numeral: "D" },
        { value: 400, numeral: "CD" },
        { value: 100, numeral: "C" },
        { value: 90, numeral: "XC" },
        { value: 50, numeral: "L" },
        { value: 40, numeral: "XL" },
        { value: 10, numeral: "X" },
        { value: 9, numeral: "IX" },
        { value: 5, numeral: "V" },
        { value: 4, numeral: "IV" },
        { value: 1, numeral: "I" },
    ];
    let result = "";
    for (const item of romanMap) {
        while (num >= item.value) {
            result += item.numeral;
            num -= item.value;
        }
    }
    return result;
}
/**
 * Converts a Roman numeral string to a number. Does not validate that the
 * input is a well-formed Roman numeral (use {@link isRomanNumber} first if
 * that matters) — unrecognized characters make the result `NaN`.
 *
 * @param roman - Roman numeral string (case-sensitive, uppercase letters).
 * @returns The numeric value, or `NaN` if `roman` contains unrecognized characters.
 */
export function romanToNumber(roman) {
    const map = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000,
    };
    let result = 0;
    for (let i = 0; i < roman.length; i++) {
        const current = map[roman.charAt(i)];
        const next = map[roman.charAt(i + 1)];
        if (next && current < next) {
            result -= current;
        }
        else {
            result += current;
        }
    }
    return result;
}
/**
 * Checks whether a string is a well-formed Roman numeral (1-3999), matching
 * the standard subtractive notation. Case-insensitive.
 *
 * @param value - String to validate.
 * @returns `true` if `value` is a valid Roman numeral.
 */
export function isRomanNumber(value) {
    if (!value)
        return false;
    const romanRegex = /^(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))$/;
    return romanRegex.test(value.toUpperCase());
}
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
export function base64ToBlob(base64, mimeType, sliceSize = 512) {
    const byteCharacters = atob(base64);
    const bytes = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byte = new Uint8Array(byteNumbers);
        bytes.push(byte);
    }
    return new Blob(bytes, { type: mimeType });
}
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
export function downloadFile(fileName, mimeType, base64Content, action = "download") {
    if (!mimeType.includes("/")) {
        mimeType = `application/${mimeType}`;
    }
    const blob = base64ToBlob(base64Content, mimeType);
    const blobUrl = URL.createObjectURL(blob);
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.download = fileName;
    if (action === "open_blank") {
        link.target = "_blank";
    }
    else if (action === "open") {
        link.target = "_self";
    }
    link.href = blobUrl;
    link.click();
    document.body.removeChild(link);
}
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
export function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    let clonedObj = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj;
}
