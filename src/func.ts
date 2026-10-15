const UINT32_RANGE = 0x100000000;

/**
 * Creates a generator of uniformly distributed integers in `[0, bound)` backed
 * by the Web Crypto CSPRNG. Random words are fetched in batches of `batchSize`
 * to amortize `crypto.getRandomValues` calls; the buffer lives only inside the
 * returned closure (never shared across calls) and is zeroed once consumed.
 * Uses rejection sampling against 2^32 so every value is exactly equiprobable.
 * @param batchSize - Number of 32-bit words fetched per `getRandomValues` call (capped at 16384, the Web Crypto 64 KiB limit).
 * @returns A function `(bound) => number` returning a uniform integer in
 * `[0, bound)`; throws a `RangeError` if `bound` is not an integer in `[1, 2^32]`.
 */
function createSecureRandomInt(batchSize: number): (bound: number) => number {
  const buf = new Uint32Array(Math.min(Math.max(batchSize, 1), 16384));
  let pos = buf.length;

  return (bound: number): number => {
    if (!Number.isInteger(bound) || bound < 1 || bound > UINT32_RANGE) {
      throw new RangeError(`bound must be an integer in [1, 2^32], got ${bound}`);
    }
    // Largest multiple of `bound` that fits in 2^32; values at or above it are rejected
    const limit = UINT32_RANGE - (UINT32_RANGE % bound);
    let r: number;
    do {
      if (pos >= buf.length) {
        crypto.getRandomValues(buf);
        pos = 0;
      }
      r = buf[pos]!;
      buf[pos++] = 0;
    } while (r >= limit);
    return r % bound;
  };
}

/**
 * Checks at runtime that `value` has the same kind of type as `sample`:
 * same `typeof`, array vs. non-array, plain object vs. class instance
 * (e.g. a `Date` sample requires a `Date` or subclass value). Only the top level is
 * checked — array elements and object fields are not inspected.
 * @param value - Value to check.
 * @param sample - Reference value whose kind `value` must match.
 * @returns `true` if `value` is non-null and of the same kind as `sample`.
 */
function isSameKind(value: unknown, sample: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value !== typeof sample) return false;
  if (typeof sample !== "object" || sample === null) return true;
  if (Array.isArray(sample)) return Array.isArray(value);
  if (Array.isArray(value)) return false;
  if (isPlainObject(sample)) return isPlainObject(value);
  // Same class or a subclass of it (prototype-based, so it can't throw on a missing `constructor`)
  return Object.getPrototypeOf(sample).isPrototypeOf(value);
}

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
export function isEmpty(value: any): boolean {
  if (typeof value === "string") {
    return value.trim() === "";
  } else if (typeof value === "number") {
    return value === 0;
  } else if (typeof value === "boolean") {
    return !value;
  } else if (value === undefined || value === null) {
    return true;
  } else if (Array.isArray(value)) {
    return value.length === 0;
  } else if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  } else if (value instanceof Date) {
    return false;
  } else if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }
  return false;
}

/**
 * Checks whether a value is a valid number (not `NaN`, not `Infinity`).
 * @param value - Value to check.
 * @returns Type-guard: `true` if `value` is a finite number.
 */
export function isNumber(value: any): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Returns `value` if it is neither null nor undefined, otherwise returns `defaultValue`.
 * @note Use this instead of the `??` syntax on TS versions below 3.7, where `??` is unavailable.
 * @param value Value to check
 * @param defaultValue Default value returned when `value` is null or undefined
 * @returns `value`, or `defaultValue` if `value` is null or undefined
 */
export function nullish(value: any, defaultValue: any): any {
  return value !== null && value !== undefined ? value : defaultValue;
}

/**
 * JSON.parse with a default value on error
 * @param s JSON value to parse. `null`/`undefined` are treated as an error (`JSON.parse` is
 * not called, since `JSON.parse(null)` does not throw and instead returns `null`)
 * @param defaultValue Default value returned when parsing fails, or when `s` is null/undefined.
 * Defaults to null
 * @returns The parsed value, or `defaultValue` if parsing fails or `s` is null/undefined
 */
export function jsonParse<T = any>(s: string | null | undefined, defaultValue: T): T;
export function jsonParse<T = any>(s: string | null | undefined, defaultValue?: null): T | null;
export function jsonParse<T = any>(
  s: string | null | undefined,
  defaultValue: T | null = null,
): T | null {
  if (s === null || s === undefined) return defaultValue;
  try {
    return JSON.parse(s) as T;
  } catch (e) {
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
export function vi2en(s: string): string {
  return (
    s
      // Decompose accented characters into base character + combining mark
      .normalize("NFD")
      // Strip all combining diacritical marks
      .replace(/[\u0300-\u036f]/g, "")
      // đ/Đ have no combining-mark decomposition, handle them separately
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
  );
}

/**
 * Normalizes Windows-style line endings (`\r\n`) to Unix-style (`\n`).
 * @param value - Input string.
 * @returns The string with all `\r\n` replaced by `\n`.
 */
export function crlf2lf(value: string): string {
  return value.replace(/\r\n/g, "\n");
}

/**
 * Removes every newline from a string, after normalizing line endings and
 * trimming surrounding whitespace.
 * @param value - Input string.
 * @returns The string with all newlines removed.
 */
export function removeNewline(value: string): string {
  return crlf2lf(value).trim().replace(/\n/g, "");
}
/**
 * Pads the start of a string with a character until it reaches the target length
 * @param str Original string
 * @param targetLength Target length after padding
 * @param padChar Character used to pad the start (defaults to "0")
 * @returns The string padded at the start, if padding was needed
 */
export function padStart(str: string, targetLength: number, padChar: string = "0"): string {
  str = String(str);
  if (str.length >= targetLength || !padChar) return str;

  const padding = padChar
    .repeat(Math.ceil((targetLength - str.length) / padChar.length))
    .substring(0, targetLength - str.length);

  return padding + str;
}

/**
 * Pads the end of a string with a character until it reaches the target length
 * @param str Original string
 * @param targetLength Target length after padding
 * @param padChar Character used to pad the end (defaults to "0")
 * @returns The string padded at the end, if padding was needed
 */
export function padEnd(str: string, targetLength: number, padChar: string = "0"): string {
  str = String(str);
  if (str.length >= targetLength || !padChar) return str;

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
export function shuffleArray(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements i and j
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/**
 * Returns a shuffled copy of an array using Fisher-Yates driven by the Web
 * Crypto CSPRNG, so the resulting order is unpredictable (unlike
 * {@link shuffleArray}, which uses `Math.random`).
 * @param array - Source array (not mutated).
 * @returns A new array with the same elements in random order.
 */
export function shuffleSecure<T>(array: T[]): T[] {
  const arr = [...array];
  const randomInt = createSecureRandomInt(arr.length);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

/**
 * Collects an object's own enumerable values into an array.
 * @param obj - Source object. `null`/`undefined` yields an empty array.
 * @returns Array of the object's values.
 */
export function objectValueToArray(obj: any): any[] {
  if (obj === null || obj === undefined) return [];
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
export function groupBy(list: any, fn: (item: any) => any): any[] {
  if (!list) return [];

  var groups: Record<string, any> = {};
  for (var i = 0; i < list.length; i++) {
    var group = JSON.stringify(fn(list[i]));
    if (group in groups) {
      groups[group].push(list[i]);
    } else {
      groups[group] = [list[i]];
    }
  }

  return objectValueToArray(groups);
}

/**
 * Checks whether `value` is a plain object (`{}` literal or `Object.create(null)`),
 * as opposed to an array or a special built-in like `Date`/`Map`/`Set`/`RegExp`.
 * @param value - Value to check.
 * @returns `true` if `value` is a plain object.
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Remove keys from object or array
 * @param objectOrArray Object or array
 * @param keys Keys to remove
 * @returns Object or array with keys removed
 */
export function removeByKey<T = any>(objectOrArray: T, keys: string[]): T {
  if (Array.isArray(objectOrArray)) {
    return objectOrArray.map((item: any): any =>
      typeof item === "object" && item !== null ? removeByKey(item, keys) : item,
    ) as T;
  }

  if (isPlainObject(objectOrArray)) {
    const source = objectOrArray as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    Object.keys(source).forEach((key) => {
      if (keys.includes(key)) return;
      const value = source[key];
      result[key] =
        Array.isArray(value) || (typeof value === "object" && value !== null)
          ? removeByKey(value, keys)
          : value;
    });

    return result as T;
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
export function removeEmptyValue<T = any>(
  objectOrArray: T,
  options: {
    removeNull?: boolean;
    removeUndefined?: boolean;
    removeEmptyString?: boolean;
  } = {},
): T {
  const { removeNull = true, removeUndefined = true, removeEmptyString = true } = options;

  const shouldRemove = (value: unknown): boolean =>
    (removeNull && value === null) ||
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
      .filter((item): boolean => !shouldRemove(item));

    return result as unknown as T;
  }

  if (isPlainObject(objectOrArray)) {
    const source = objectOrArray as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    Object.keys(source).forEach((key) => {
      const rawValue = source[key];
      const value =
        Array.isArray(rawValue) || (typeof rawValue === "object" && rawValue !== null)
          ? removeEmptyValue(rawValue, { removeNull, removeUndefined, removeEmptyString })
          : rawValue;

      if (!shouldRemove(value)) {
        result[key] = value;
      }
    });

    return result as T;
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
export function randomString(
  length: number,
  opt: ("upper" | "lower" | "number" | "specific")[] = [],
  specificChars = "",
): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";

  const cats = new Set(opt);
  if (!specificChars) cats.delete("specific");

  if (length < cats.size) {
    throw new Error(
      `Length (${length}) too short: need at least ${cats.size} for ${[...cats].join(", ")}`,
    );
  }

  // Build the character groups (split by code point so emoji / surrogate pairs are never cut in half)
  const groups: string[][] = [];
  if (cats.has("upper")) groups.push([...upper]);
  if (cats.has("lower")) groups.push([...lower]);
  if (cats.has("number")) groups.push([...digits]);
  if (cats.has("specific")) groups.push([...specificChars]);

  const pool = groups.length ? ([] as string[]).concat(...groups) : [...upper, ...lower, ...digits];
  const randomInt = createSecureRandomInt(Math.max(length, 0));

  // Guarantee at least one character from each required group
  const result = groups.map((g) => g[randomInt(g.length)]!);

  // Fill up the remaining characters to reach the requested length
  while (result.length < length) {
    result.push(pool[randomInt(pool.length)]!);
  }

  // Shuffle so the guaranteed characters aren't always at the front
  return shuffleSecure(result).join("");
}

/**
 * Formats a byte value (0-255) as a zero-padded, 2-digit lowercase hex string.
 * Intended for internal use with well-formed byte values (e.g. from a
 * `Uint8Array`); values outside 0-255 are not validated.
 *
 * @param b - Byte value, expected in the 0-255 range.
 * @returns 2-character hex string, e.g. `"0f"`.
 */
export function byte2hex(b: number): string {
  return ("0" + b.toString(16)).slice(-2);
}

/**
 * Generates the raw 16 bytes of a UUIDv7 (timestamp + random, RFC 4122
 * variant). Relies on the Web Crypto `crypto.getRandomValues` API, available
 * in browsers and modern Node.js.
 *
 * @returns 16-byte `Uint8Array` encoding a UUIDv7.
 */
export function uuid7bin(): Uint8Array {
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
    bytes[i + 6] = rnd[i]!;
  }
  // version 7
  bytes[6] = (bytes[6]! & 0x0f) | 0x70;
  // variant RFC4122
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;

  return bytes;
}

/**
 * Generates a UUIDv7 string (e.g. `"01890a5d-ac96-774b-bcce-b302099a8057"`).
 * @returns UUIDv7 in the standard 8-4-4-4-12 hex string format.
 */
export function uuid7(): string {
  var bin = uuid7bin();
  var hex = [];
  for (var i = 0; i < bin.length; i++) {
    hex.push(byte2hex(bin[i]!));
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
export function base64encode(str: string): string {
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
export function base64decode(base64: string): string {
  return new TextDecoder().decode(
    Uint8Array.from(atob(base64), (c: string): number => c.charCodeAt(0)),
  );
}

/**
 * Reads a nested property from an object using a dot-separated path.
 * Example: `getObjectValue(user, 'abc.def')` returns `user.abc.def`.
 *
 * Equivalent to optional chaining (`object?.abc?.def`), for use on
 * TypeScript versions below 3.7 (e.g. Angular versions below 9). On newer
 * TypeScript versions, prefer optional chaining directly instead.
 *
 * With `defaultValue`, the result is checked at runtime against the kind of
 * `defaultValue` (see `isSameKind`): if the path is missing, resolves to
 * `null`/`undefined`, or resolves to a value of a different kind (e.g. a
 * string where `defaultValue` is a number), `defaultValue` is returned. The
 * result is therefore really of type `T`, not just typed as `T`. Only the top
 * level is checked — array elements and object fields are not inspected.
 * A `null`/`undefined` `defaultValue` disables the check.
 *
 * @typeParam T - Expected type of the resolved value.
 * @param object - Source object.
 * @param path - Dot-separated property path.
 * @param defaultValue - Fallback returned when the value is missing or of a
 * different kind; also defines the expected kind.
 * @returns The resolved value; without `defaultValue`, `null`/`undefined` if
 * any segment is missing (not type-checked at runtime).
 */
export function getObjectValue(
  object: null | undefined | Record<string, any>,
  path: string,
  defaultValue: string,
): string;
export function getObjectValue(
  object: null | undefined | Record<string, any>,
  path: string,
  defaultValue: number,
): number;
export function getObjectValue(
  object: null | undefined | Record<string, any>,
  path: string,
  defaultValue: boolean,
): boolean;
export function getObjectValue<T>(
  object: null | undefined | Record<string, any>,
  path: string,
  defaultValue: T,
): T;
export function getObjectValue<T = any>(
  object: null | undefined | Record<string, any>,
  path: string,
): T | null | undefined;
export function getObjectValue(
  object: null | undefined | Record<string, any>,
  path: string,
  defaultValue?: any,
): any {
  const value =
    object === null || object === undefined
      ? null
      : path
          .split(".")
          .reduce(
            (acc: any, part: string): any => (acc === null || acc === undefined ? acc : acc[part]),
            object,
          );

  // No default: unchanged legacy behavior (null/undefined when missing)
  if (defaultValue === undefined) return value;
  // A null default carries no type to check against: only replace missing values
  if (defaultValue === null) return value === undefined ? null : value;
  return isSameKind(value, defaultValue) ? value : defaultValue;
}

/**
 * Short alias for {@link getObjectValue}.
 * @param object - Source object.
 * @param path - Dot-separated property path.
 * @param defaultValue - Fallback returned when the value is missing or of a
 * different kind; also defines the expected kind.
 * @returns See {@link getObjectValue}.
 */
export function ov(
  object: null | undefined | Record<string, any>,
  path: string,
  defaultValue: string,
): string;
export function ov(
  object: null | undefined | Record<string, any>,
  path: string,
  defaultValue: number,
): number;
export function ov(
  object: null | undefined | Record<string, any>,
  path: string,
  defaultValue: boolean,
): boolean;
export function ov<T>(
  object: null | undefined | Record<string, any>,
  path: string,
  defaultValue: T,
): T;
export function ov<T = any>(
  object: null | undefined | Record<string, any>,
  path: string,
): T | null | undefined;
export function ov(
  object: null | undefined | Record<string, any>,
  path: string,
  defaultValue?: any,
): any {
  return getObjectValue(object, path, defaultValue);
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
export function toInt(
  value: any,
  defaultValue: number | null | undefined = 0,
): number | null | undefined {
  if (isNumber(value)) return Math.trunc(value);
  if (isEmpty(value)) return defaultValue;
  return typeof value === "string" ? Number.parseInt(value.trim()) : Number(value);
}

/**
 * Converts a positive integer to a Roman numeral. Only supports the standard
 * range (1-3999); larger numbers produce a non-standard repeating "M" prefix.
 *
 * @param num - Number to convert.
 * @returns Roman numeral string, or `""` if `num` is zero or negative.
 */
export function numberToRoman(num: number): string {
  if (num <= 0) return "";

  const romanMap: { value: number; numeral: string }[] = [
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
export function romanToNumber(roman: string): number {
  const map: any = {
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
    } else {
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
export function isRomanNumber(value: string): boolean {
  if (!value) return false;
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
export function base64ToBlob(base64: string, mimeType: string, sliceSize: number = 512): Blob {
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
export function downloadFile(
  fileName: string,
  mimeType: string,
  base64Content: string,
  action: "download" | "open" | "open_blank" = "download",
): void {
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
  } else if (action === "open") {
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
export function deepClone(obj: any) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  let clonedObj: any = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
}
