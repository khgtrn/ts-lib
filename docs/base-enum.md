# BaseEnum — Java-style enums

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
