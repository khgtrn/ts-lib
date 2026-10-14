# round — floating-point-safe rounding

```ts
import { round } from '@khgtrn/lib';

round(491.66999999999996);      // 491.67 (default precision = 10)
round(1.23456, 2);              // 1.23
round(1.005, 2);                // 1.01
round(-1.005, 2);               // -1.01
```

Rounds `value` to `precision` decimal places (default `10`), mainly to clean up binary floating-point noise from arithmetic rather than to reduce genuine precision.

Halves are rounded away from zero based on the number's shortest decimal representation, so `1.005` rounds to `1.01` even though `1.005 * 100` is `100.49999999999999` in JavaScript.
