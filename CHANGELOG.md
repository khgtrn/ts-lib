# Changelog

Formatted per [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0]

### Added

- `BaseEnum<T>` — a base class for simulating Java-style enums: subclasses only need to `extends` and declare `static readonly` fields, no constructor to write (thanks to the base constructor being `protected`). Ships with `values()`, `names()`, `valueOf(name)`, `fromValue(value)`, `equals(other)`, `name()`, `toString()`, and an optional `opts` parameter for storing extra data per constant.
- A set of utility functions in `func.ts`: `isEmpty`, `isNumber`, `vi2en`, `crlf2lf`, `removeNewline`, `shuffleArray`, `objectValueToArray`, `groupBy`, `removeByKey`, `removeEmptyValue`, `randomString`, `byte2hex`, `uuid7bin`/`uuid7`, `base64encode`/`base64decode`, `getObjectValue`/`ov`, `toInt`, `numberToRoman`/`romanToNumber`/`isRomanNumber`, `base64ToBlob`, `downloadFile`, `deepClone`.
  - `groupBy(null, fn)` returns `[]` instead of throwing.
  - `base64encode()` encodes in chunks instead of spreading the whole byte array, so it doesn't overflow the call stack on long strings.
  - `randomString()` throws a clear error if `length` is smaller than the number of required character categories, instead of silently returning a longer string; falls back to an alphanumeric character set when called without `opt`, instead of returning an empty string.
  - `deepClone()` special-cases `Date` so it isn't turned into an empty `{}`.
- `numberToWords(num, locale?)` — spells out numbers as words, supporting Vietnamese (default) and English, with a per-locale registry architecture designed for adding more languages (`src/number-to-words/locales.ts`). Supports negative numbers, decimals (passed as a `string` to preserve leading zeros exactly and avoid floating-point rounding errors), and magnitudes up to billion-level.
- Full type declarations (`.d.ts`) for both the ESM (`dist/esm`) and CJS (`dist/cjs`) builds, compatible down to **TypeScript 2.7** (e.g. Angular 6 projects) — achieved by avoiding `unknown`/conditional-type usage in public signatures (`BaseEnum.equals()`, `BaseEnum.fromValue()`, `isNumber()` use `any` instead) and avoiding `import type`/`export type` syntax (needs TypeScript 3.8+).
- Compiled JS targets `ES2015` (the lowest this TypeScript version supports — `ES5`/`ES3` were removed) so `?.`/`??` are downleveled into plain conditional expressions — verified parseable by `acorn@5.7.4`, the parser bundled with webpack 4 (used by Angular CLI 6), which can't parse native `?.`/`??` syntax at all.
- `"sideEffects": false` on both the ESM and CJS package.json files so bundlers (esbuild, webpack, Rollup, ...) tree-shake unused exports correctly — e.g. importing a single function from `func.ts` doesn't pull in the unused `BaseEnum` class.
- `"engines": { "node": ">=19" }` — the first Node version where `crypto.getRandomValues` is a stable global, used by `uuid7bin()`.
- `"DOM"` added to `lib` in `tsconfig.json` so standard browser APIs (`crypto`, `btoa`, `Blob`, `document`, `URL`, `TextEncoder`/`TextDecoder`) are recognized with correct types.
- `src/number-to-words/` structured as `index.ts` (the main exported function), `types.ts`, `locales.ts`, and `helpers.ts`, rather than one file, to keep the public surface separate from per-language word lists and shared conversion logic.
- `round(value, precision?)` — rounds `value` to `precision` decimal places (defaults to `10`), mainly to clean up binary floating-point noise from arithmetic (e.g. `491.66999999999996` instead of `491.67`) rather than to reduce genuine precision.
