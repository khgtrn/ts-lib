# numberToWords — spelling out numbers

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
- Designed to be easy to extend with more languages: see [src/number-to-words/locales.ts](https://github.com/khgtrn/ts-lib/blob/main/src/number-to-words/locales.ts).
