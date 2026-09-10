"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEnum = void 0;
/**
 * Base class for simulating Java-style enums in TypeScript.
 *
 * Subclasses only need to `extends BaseEnum<...>` and declare constants as
 * `static readonly Xxx = new SubClass(value, label, opts?)`, without
 * redeclaring a constructor. Because `BaseEnum`'s constructor is `protected`,
 * subclasses inherit it while keeping the same protection — instances can't
 * be `new`-ed from outside the class, which preserves enum singleton/identity
 * semantics (`===` comparisons always work as expected).
 *
 * @typeParam T - Type of the `value` field (defaults to `number`).
 */
class BaseEnum {
    /**
     * Creates an enum constant. Only callable from within a subclass
     * (the constructor is `protected`), typically from a `static readonly`
     * field declaration.
     *
     * @param value - Identifying value of the constant (used by `fromValue()`, `equals()`).
     * @param label - Display label/description of the constant.
     * @param opts - Optional extra data, freely defined by the subclass as needed.
     */
    constructor(value, label, opts) {
        this.value = value;
        this.label = label;
        this.opts = opts;
        let map = BaseEnum.registry.get(this.constructor);
        if (!map) {
            map = new Map();
            BaseEnum.registry.set(this.constructor, map);
        }
        map.set(value, this);
    }
    /**
     * Returns the names of the `static readonly` fields declared on the
     * subclass, in declaration order. Mirrors the idea of an enum constant's
     * name in Java, but here returns the names for every constant at once.
     *
     * @returns Array of constant names, e.g. `['Admin', 'User']`.
     */
    static names() {
        return Object.getOwnPropertyNames(this).filter((key) => key !== "prototype" && this[key] instanceof BaseEnum);
    }
    /**
     * Returns every instance (constant) created on the subclass, similar to
     * Java's `Enum.values()`.
     *
     * @returns Array of the subclass's instances, in creation order.
     */
    static values() {
        var _a;
        return Array.from(((_a = BaseEnum.registry.get(this)) !== null && _a !== void 0 ? _a : new Map()).values());
    }
    /**
     * Looks up a constant by its declared field name (matches Java's standard
     * `Enum.valueOf(String)`). Unlike `fromValue()`, which looks up by `value`,
     * this looks up by the static field's name (key).
     *
     * @param name - Name of the constant to look up, e.g. `'Admin'`.
     * @returns The matching instance.
     * @throws {Error} If no constant with that name exists.
     */
    static valueOf(name) {
        const constant = this[name];
        if (!(constant instanceof BaseEnum)) {
            throw new Error(`No enum constant ${this.name}.${name}`);
        }
        return constant;
    }
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
    static fromValue(value) {
        var _a;
        return (_a = BaseEnum.registry.get(this)) === null || _a === void 0 ? void 0 : _a.get(value);
    }
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
    equals(other) {
        var _a;
        if (other instanceof BaseEnum) {
            return this === other;
        }
        return ((_a = BaseEnum.registry.get(this.constructor)) === null || _a === void 0 ? void 0 : _a.get(other)) === this;
    }
    /**
     * Returns the field name this instance was assigned to, similar to Java's
     * `Enum.name()`.
     *
     * @returns The constant's name, e.g. `'Admin'`; an empty string if not
     * found (a theoretical case that shouldn't occur under normal usage).
     */
    name() {
        const ctor = this.constructor;
        const key = Object.getOwnPropertyNames(ctor).find((k) => k !== "prototype" && ctor[k] === this);
        return key !== null && key !== void 0 ? key : "";
    }
    /**
     * Converts the constant to a display string, defaulting to `label`.
     *
     * @returns The constant's display label.
     */
    toString() {
        return this.label;
    }
}
exports.BaseEnum = BaseEnum;
/**
 * Registry of every instance created, keyed per subclass and per `value`.
 * The outer key is the subclass constructor (so each subclass has its own
 * list), the inner key is each constant's `value`. Backs `values()`,
 * `fromValue()` and `equals()`.
 */
BaseEnum.registry = new Map();
