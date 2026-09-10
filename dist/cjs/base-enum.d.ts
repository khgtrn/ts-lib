/**
 * Base class for simulating Java-style enums in TypeScript.
 *
 * Subclasses only need to `extends BaseEnum<...>` and declare constants as
 * `static readonly Xxx = new SubClass(value, label, opt?)`, without
 * redeclaring a constructor. Because `BaseEnum`'s constructor is `protected`,
 * subclasses inherit it while keeping the same protection — instances can't
 * be `new`-ed from outside the class, which preserves enum singleton/identity
 * semantics (`===` comparisons always work as expected).
 *
 * @typeParam T - Type of the `value` field (defaults to `number`).
 */
export declare abstract class BaseEnum<T = number, O = any> {
    readonly value: T;
    readonly label: string;
    readonly opt?: O | undefined;
    /**
     * Registry of every instance created, keyed per subclass and per `value`.
     * The outer key is the subclass constructor (so each subclass has its own
     * list), the inner key is each constant's `value`. Backs `values()`,
     * `fromValue()` and `equals()`.
     */
    private static readonly registry;
    /**
     * Creates an enum constant. Only callable from within a subclass
     * (the constructor is `protected`), typically from a `static readonly`
     * field declaration.
     *
     * @param value - Identifying value of the constant (used by `fromValue()`, `equals()`).
     * @param label - Display label/description of the constant.
     * @param opt - Optional extra data, freely defined by the subclass as needed.
     */
    protected constructor(value: T, label: string, opt?: O | undefined);
    /**
     * Returns the names of the `static readonly` fields declared on the
     * subclass, in declaration order. Mirrors the idea of an enum constant's
     * name in Java, but here returns the names for every constant at once.
     *
     * @returns Array of constant names, e.g. `['Admin', 'User']`.
     */
    static names(this: Function): string[];
    /**
     * Returns every instance (constant) created on the subclass, similar to
     * Java's `Enum.values()`.
     *
     * @returns Array of the subclass's instances, in creation order.
     */
    static values<T extends BaseEnum<any>>(this: Function & {
        prototype: T;
    }): T[];
    /**
     * Looks up a constant by its declared field name (matches Java's standard
     * `Enum.valueOf(String)`). Unlike `fromValue()`, which looks up by `value`,
     * this looks up by the static field's name (key).
     *
     * @param name - Name of the constant to look up, e.g. `'Admin'`.
     * @returns The matching instance.
     * @throws {Error} If no constant with that name exists.
     */
    static valueOf<T extends BaseEnum<any>>(this: Function & {
        prototype: T;
    }, name: string): T;
    /**
     * Looks up a constant by its `value` field.
     *
     * Note: `value`'s type isn't tied to the subclass's own `value` type
     * parameter (unlike a conditional type would give) — that syntax requires
     * TypeScript 2.8+, and this library targets TypeScript 2.7 and up.
     *
     * @param value - Value to look up (of the subclass's `T` type).
     * @returns The matching instance, or `undefined` if none is found.
     */
    static fromValue<T extends BaseEnum<any>>(this: Function & {
        prototype: T;
    }, value: any): T | undefined;
    /**
     * Compares this constant against an arbitrary value.
     *
     * - If `other` is a `BaseEnum` instance: compares identity (`===`)
     *   directly, even if `other` belongs to a different enum class (always
     *   `false` in that case).
     * - If `other` is a raw value (number/string/...): looks up the matching
     *   constant by `value` within this instance's own subclass, then compares
     *   identity.
     * - Anything else (wrong type, no match, `null`/`undefined`...): returns
     *   `false`.
     *
     * @param other - Value or enum instance to compare against.
     * @returns `true` if both refer to the same enum constant, otherwise `false`.
     */
    equals(other: any): boolean;
    /**
     * Returns the field name this instance was assigned to, similar to Java's
     * `Enum.name()`.
     *
     * @returns The constant's name, e.g. `'Admin'`; an empty string if not
     * found (a theoretical case that shouldn't occur under normal usage).
     */
    name(): string;
    /**
     * Converts the constant to a display string, defaulting to `label`.
     *
     * @returns The constant's display label.
     */
    toString(): string;
}
