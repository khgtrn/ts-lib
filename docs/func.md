# Utility functions

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

See the JSDoc in [src/func.ts](https://github.com/khgtrn/ts-lib/blob/main/src/func.ts) for full parameter/return details.
