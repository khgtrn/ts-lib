# Library for Typescript/Javascript

[![npm version](https://img.shields.io/npm/v/@khgtrn/lib.svg)](https://www.npmjs.com/package/@khgtrn/lib)
[![npm downloads](https://img.shields.io/npm/d18m/@khgtrn/lib.svg)](https://www.npmjs.com/package/@khgtrn/lib)
[![license](https://img.shields.io/github/license/khgtrn/ts-lib.svg)](https://github.com/khgtrn/ts-lib/blob/main/LICENSE)

Shared TypeScript utility library: Java-style enums, common helper functions, number-to-words conversion (Vietnamese/English), and floating-point-safe rounding.

Built as both ESM (`dist/esm`) and CJS (`dist/cjs`), with full type declarations, with no runtime dependency beyond standard Web APIs (`crypto`, `TextEncoder`/`TextDecoder`, `btoa`/`atob` — available in browsers and Node.js >= 19).

## Installation

```bash
pnpm add @khgtrn/lib
```

Requires Node.js >= 19 at runtime (needed for `crypto.getRandomValues` as a global — see `engines` in [package.json](package.json)). The shipped `.d.ts` files are compatible down to **TypeScript 2.7**, and the compiled JS itself avoids syntax (`?.`, `??`) that older bundlers can't parse — no separate install/config needed to consume this package from a legacy toolchain (e.g. Angular 6).

## BaseEnum — Java-style enums

`BaseEnum` is a base class for simulating Java enums: each constant is a singleton instance, and subclasses only need to `extends` and declare `static readonly` fields — no constructor to write.

```ts
import { BaseEnum } from '@khgtrn/lib';

class Role extends BaseEnum<number> {
  static readonly Admin = new Role(1, 'Administrator');
  static readonly User = new Role(0, 'User');

  isAdmin(): boolean {
    return this === Role.Admin;
  }
}

Role.Admin.label;                 // 'Administrator'
Role.Admin === Role.Admin;         // true — identity is preserved
Role.Admin.equals(1);              // true — compares by value
Role.values();                     // [Role.Admin, Role.User]
Role.names();                      // ['Admin', 'User']
Role.valueOf('Admin');             // Role.Admin (looks up by field name, throws if missing)
Role.fromValue(1);                 // Role.Admin (looks up by value, returns undefined if missing)
Role.Admin.name();                 // 'Admin'
new Role(2, 'x');                  // compile error — constructor is protected
```

The constructor also accepts an optional third parameter, `opt?: O`, for storing arbitrary extra data per constant. Pass the second type argument on `BaseEnum<T, O>` to get accurate type hints on `opt`:

```ts
class Role extends BaseEnum<number, { icon: string }> {
  static readonly Admin = new Role(1, 'Administrator', { icon: 'shield' });
}

Role.Admin.opt?.icon;   // typed as `string | undefined`
```

Without an explicit `O`, it defaults to `any`.

## Utility functions (`func.ts`)

| Function | Description |
| --- | --- |
| `isEmpty(value)` | Checks whether a value is empty (string, `0`, `false`, null/undefined, empty array/object) |
| `isNumber(value)` | Type-guard: a valid finite number (not NaN/Infinity) |
| `nullish(value, defaultValue)` | Returns `value` unless it's `null`/`undefined`, in which case returns `defaultValue` — a `??`-equivalent for pre-3.7 TypeScript |
| `jsonParse(s, defaultValue?)` | `JSON.parse` with a fallback value instead of throwing on invalid input |
| `vi2en(s)` | Strips Vietnamese diacritics (`"Điều chỉnh"` -> `"Dieu chinh"`) |
| `crlf2lf(value)` | Normalizes `\r\n` -> `\n` |
| `removeNewline(value)` | Removes all newlines, trims surrounding whitespace |
| `padStart(str, targetLength, padChar?)` / `padEnd(str, targetLength, padChar?)` | Pads a string to a target length by adding characters to the left/right (defaults to `"0"`) |
| `shuffleArray(array)` | Shuffles an array in place (Fisher-Yates) |
| `objectValueToArray(obj)` | Collects an object's values into an array |
| `groupBy(list, fn)` | Groups items by a computed key |
| `isPlainObject(value)` | Type-guard: a plain object (`{}` literal or `Object.create(null)`), not an array or a special built-in (`Date`/`Map`/`Set`/`RegExp`) |
| `removeByKey(objectOrArray, keys)` | Removes fields by name, recursively through nested structures |
| `removeEmptyValue(objectOrArray, options?)` | Removes `null`/`undefined`/`""` fields, recursively through nested structures |
| `randomString(length, opt?, specificChars?)` | Generates a random string, optionally requiring uppercase/lowercase/digit/custom characters |
| `byte2hex(b)` | Byte (0-255) -> 2-character hex |
| `uuid7bin()` / `uuid7()` | Generates a UUIDv7 (16 bytes / standard string) |
| `base64encode(str)` / `base64decode(base64)` | Base64 encode/decode (UTF-8, safe for large strings) |
| `getObjectValue(object, path)` / `ov(object, path)` | Reads a nested value via a `"a.b.c"` dot path |
| `toInt(value, defaultValue?)` | Converts to an integer, with a fallback for empty values |
| `numberToRoman(num)` / `romanToNumber(roman)` | Converts between Roman numerals and numbers (1-3999) |
| `isRomanNumber(value)` | Validates a Roman numeral string |
| `base64ToBlob(base64, mimeType, sliceSize?)` | Base64 -> `Blob` (browser) |
| `downloadFile(fileName, mimeType, base64Content, action?)` | Downloads/opens a file from base64 (browser) |
| `deepClone(obj)` | Deep-clones an object/array/`Date` |

See the JSDoc in [src/func.ts](src/func.ts) for full parameter/return details.

## numberToWords — spelling out numbers

```ts
import { numberToWords } from '@khgtrn/lib';

numberToWords(1005);            // "một nghìn không trăm linh năm" (Vietnamese by default)
numberToWords(1005, 'en');      // "one thousand five"
numberToWords('1.05', 'vi');    // "một phẩy không năm"
numberToWords(-123, 'en');      // "negative one hundred twenty-three"
```

- Integers can be passed as either a `number` or a `string`.
- Decimals **must be passed as a `string`** (e.g. `'1.05'`), since a `number` can't preserve a leading fractional zero and may pick up floating-point rounding errors — passing a decimal `number` throws with a hint to fix it.
- Supports up to billion-level magnitude, comfortably covering `Number.MAX_SAFE_INTEGER`.
- Designed to be easy to extend with more languages: see [src/number-to-words/locales.ts](src/number-to-words/locales.ts).

## round — floating-point-safe rounding

```ts
import { round } from '@khgtrn/lib';

round(491.66999999999996);      // 491.67 (default precision = 10)
round(1.23456, 2);              // 1.23
```

Rounds `value` to `precision` decimal places (default `10`), mainly to clean up binary floating-point noise from arithmetic rather than to reduce genuine precision.

## Development

```bash
pnpm install
pnpm run build   # builds dist/esm and dist/cjs
pnpm run play    # builds then runs tests/a.ts as a quick smoke test
```

## License

MIT
