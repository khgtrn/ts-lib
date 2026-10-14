/**
 * Shifts the decimal point of `value` by `exponent` places using exponent
 * notation, avoiding the floating-point error of multiplying by a power of 10
 * (e.g. `1.005 * 100` is `100.49999999999999`, but `Number("1.005e2")` is
 * `100.5`).
 */
function shift(value, exponent) {
    const [mantissa, exp = "0"] = String(value).split("e");
    return Number(`${mantissa}e${Number(exp) + exponent}`);
}
/**
 * Rounds `value` to `precision` decimal places, mainly to clean up binary
 * floating-point noise from arithmetic (e.g. `491.66999999999996` instead of
 * `491.67`) rather than to reduce genuine precision. `precision` defaults to
 * 10, which is generous enough to preserve real fractional input while still
 * clearing noise that typically appears around the 15th-17th significant
 * digit.
 *
 * Halves are rounded away from zero based on the number's shortest decimal
 * representation, so `round(1.005, 2)` is `1.01` and `round(-1.005, 2)` is
 * `-1.01`.
 *
 * @param value - Number to round.
 * @param precision - Number of decimal places to keep. Defaults to `10`.
 * @returns `value` rounded to `precision` decimal places.
 */
export function round(value, precision = 10) {
    if (!Number.isFinite(value))
        return value;
    const rounded = shift(Math.round(shift(Math.abs(value), precision)), -precision);
    return value < 0 ? -rounded : rounded;
}
