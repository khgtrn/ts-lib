# @khgtrn/lib

[![npm version](https://img.shields.io/npm/v/@khgtrn/lib.svg)](https://www.npmjs.com/package/@khgtrn/lib)
[![npm downloads](https://img.shields.io/npm/d18m/@khgtrn/lib.svg)](https://www.npmjs.com/package/@khgtrn/lib)
[![license](https://img.shields.io/github/license/khgtrn/ts-lib.svg)](https://github.com/khgtrn/ts-lib/blob/main/LICENSE)

Shared TypeScript utility library: Java-style enums, common helper functions, number-to-words conversion (Vietnamese/English), and floating-point-safe rounding.

Built as both ESM (`dist/esm`) and CJS (`dist/cjs`), with full type declarations, with no runtime dependency beyond standard Web APIs (`crypto`, `TextEncoder`/`TextDecoder`, `btoa`/`atob` — available in browsers and Node.js >= 19).

## Installation

```bash
pnpm add @khgtrn/lib
```

Requires Node.js >= 19 at runtime (needed for `crypto.getRandomValues` as a global — see `engines` in [package.json](https://github.com/khgtrn/ts-lib/blob/main/package.json)). The shipped `.d.ts` files are compatible down to **TypeScript 2.7**, and the compiled JS itself avoids syntax (`?.`, `??`) that older bundlers can't parse — no separate install/config needed to consume this package from a legacy toolchain (e.g. Angular 6).

## Contents

- [BaseEnum](base-enum.md) — Java-style enums
- [Utility functions](func.md) — common helpers
- [numberToWords](number-to-words.md) — spelling out numbers
- [round](round.md) — floating-point-safe rounding
- [Development](development.md) — building the library and these docs
- [Changelog](changelog.md)

## License

MIT
