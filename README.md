<p align="center">
 <img width="25%" src="./logo.svg">
</p>

<br />

![Test](https://github.com/ngneat/reactive-forms/workflows/Test/badge.svg?branch=master)
[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)](LICENSE)
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)

> (Angular Reactive) Forms with Benefits 😉

How many times have you told yourself "I wish Angular Reactive Forms would support types", or "I really want API to query the form reactively. It missed some methods."

Your wish is my command! This library extends every Angular `AbstractControl`, and provides features that don't exist in the original one. It adds types, reactive queries, and helper methods. The most important thing is that you can start using it today! In most cases, the only thing that you need to change is the `import` path. So don't worry, no form refactoring required - we've got you covered; One schematics [command](https://github.com/ngneat/reactive-forms/blob/master/schematics/src/migrate/migration.md), and you're done!

Let's take a look at all the neat things we provide:

## 🔮 Features

✅ Offers (almost) seamless `FormControl`, `FormGroup`, `FormArray` Replacement<br>
✅ Allows Typed Forms! <br>
✅ Provides Reactive Queries <br>
✅ Provides Helpful Methods <br>
✅ Typed and DRY `ControlValueAccessor` <br>
✅ Typed `FormBuilder` <br>
✅ Persist the form's state to local storage

```
👉 npm install @ngneat/reactive-forms
```

## Table of Contents

- [Control Type](#control-type)
- [Control Queries](#control-queries)
- [Control Methods](#control-methods)
- [Control Operators](#control-operators)
- [ControlValueAccessor](#controlvalueaccessor)
- [Form Builder](#form-builder)
- [Persist Form](#persist-form)
- [ESLint Rule](#eslint-rule)

## Control Type

`FormControl/FormArray` takes a generic that defines the `type` of the control. This `type` is than used to enhance every method exposed by Angular or this library. 

Use it with a `FormControl`:

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();

// Or auto infer it based on the initial value
const control = new FormControl('');

control.valueChanges.subscribe(value => {
  // value is typed as string
});
```

Use it with a `FormArray`:

```ts
import { FormArray, FormControl } from '@ngneat/reactive-forms';

const control = new FormArray<string>([new FormControl('')]);

control.value$.subscribe(value => {
  // value is typed as string[]
});
```

If you use a `FormGroup`, it'll automatically infer the `type` based on the `controls` you supply:

```ts
import { FormGroup, FormControl } from '@ngneat/reactive-forms';

const profileForm = new FormGroup({
  firstName: new FormControl(''),
  lastName: new FormControl(''),
  address: new FormGroup({
    street: new FormControl(''),
    city: new FormControl('')
  })
});


profileForm.setValue(new Profile());

profileForm.patchValue({ firstName: 'Netanel' });
```

You can use the **experimental** `ControlsOf` feature if you want to force a `FormGroup` to implement an external `type`:

```ts
import { FormGroup, FormControl, ControlsOf } from '@ngneat/reactive-forms';

interface Profile {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
  };
}

const profileForm = new FormGroup<ControlsOf<Profile>>({
  firstName: new FormControl(''),
  lastName: new FormControl(''),
  address: new FormGroup({
    street: new FormControl(''),
    city: new FormControl('')
  })
});
```
#### Gotchas

- When using `array` types, it'll automatically infer it as `FormArray`. If you need a `FormControl`, you must set it within your interface explicitly:

```ts
interface User {
  name: string;
  // 👇🏻
  skills: FormControl<string[]>;
}
```

- Optional fields will only work with top-level values, and will not work with `FormGroup`:

```ts
interface User {
  name?: string;
  foo?: string[]; 
  // 👇🏻 will not work 
  nested?: {
    id: string;
  };
}
```

## Control Queries

### `value$`

Observes the control's value. Unlike the behavior of the built-in `valueChanges` observable, it emits the current `rawValue` **immediately** (which means you'll also get the values of `disabled` controls).

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.value$.subscribe(value => ...);
```

### `disabled$`

Observes the control's `disable` status.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.disabled$.subscribe(isDisabled => ...);
```

### `enabled$`

Observes the control's `enable` status.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.enabled$.subscribe(isEnabled => ...);
```

### `status$`

Observes the control's `status`.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.status$.subscribe(status => ...);
```

The `status` is `typed` as `ControlState` (valid, invalid, pending or disabled).

### `touch$`

Observes the control's `touched` status.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.touch$.subscribe(isTouched => ...);
```

This emits a value **only** when `markAsTouched`, or `markAsUnTouched`, has been called.

### `dirty$`

Observes the control's `dirty` status.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.dirty$.subscribe(isDirty => ...);
```

This emits a value **only** when `markAsDirty`, or `markAsPristine`, has been called.

### `errors$`

Observes the control's `errors`.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.errors$.subscribe(errors => ...);
```

### `select()`

Selects a `slice` of the form's state based on the given predicate.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const group = new FormGroup({
  name: new FormControl('')
});

group.select(state => state.name).subscribe(name => ...)
```

## Control Methods

### `setValue()`

In addition to the built-in method functionality, it can also take an `observable`.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const group = new FormGroup({
  name: new FormControl('')
});

group.setValue(store.select('formValue'));
```

### `patchValue()`

In addition to the built-in method functionality, it can also take an `observable`.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const group = new FormGroup({
  name: new FormControl('')
});

group.patchValue(store.select('formValue'));
```

### `disabledWhile()`

Takes an observable that emits a boolean indicating whether to `disable` the control.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.disabledWhile(store.select('isDisabled'));
```

### `enabledWhile()`

Takes an observable that emits a `boolean` indicating whether to `enable` the control.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.enabledWhile(store.select('isEnabled'));
```

### `markAllAsDirty()`

Marks all the group's controls as `dirty`.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const control = new FormGroup();
control.markAllAsDirty();
```

### `hasErrorAndTouched()`

A syntactic sugar method to be used in the template:

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('', Validators.required);
```

```html
<span *ngIf="control.hasErrorAndTouched('required')"></span>
```

### `hasErrorAndDirty()`

A syntactic sugar method to be used in the template:

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('', Validators.required);
```

```html
<span *ngIf="control.hasErrorAndDirty('required')"></span>
```

### `setEnable()`

Sets whether the control is `enabled`.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.setEnable();
control.setEnable(false);
```

### `setDisable()`

Sets whether the control is `disabled`.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.setDisable();
control.setDisable(false);
```

### `get()`

A method with `typed` parameters which obtains a reference to a specific control.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const group = new FormGroup({
  name: new FormControl(''),
  address: new FormGroup({
    street: new FormControl(''),
    city: new FormControl('')
  })
});

const name = group.get('name'); // FormControl<string>
const city = group.get(['address', 'city']); // FormControl<string>

// Don't use it like this
group.get('address.city') // AbstractControl
```

### `mergeErrors()`

Merge validation errors. Unlike `setErrors()`, this will not overwrite errors already held by the control.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const group = new FormGroup(...);
group.mergeErrors({ customError: true });
```

### `removeError()`

Remove an error by key from the control.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const group = new FormGroup(...);
group.removeError('customError');
```

### FormArray methods

### remove()

Remove a control from an array based on its value

```ts
import { FormArray } from '@ngneat/reactive-forms';

const array = new FormArray<string>(...);
// Remove empty strings
array.remove('')
```

### removeIf()

Remove a control from an array based on a predicate

```ts
import { FormArray } from '@ngneat/reactive-forms';

const array = new FormArray(...);
// Only keep addresses in NYC
array.removeIf((control) => control.get('address').get('city').value !== 'New York')
```

## Control Operators

Each `valueChanges` or `values$` takes an operator `diff()`, which emits only changed parts of form:

```ts
import { FormGroup, FormControl, diff } from '@ngneat/reactive-forms';

const control = new FormGroup({
  name: new FormControl(''),
  phone: new FormGroup({
    num: new FormControl(''),
    prefix: new FormControl('')
  }),
  skills: new FormArray<string>([])
});

control.value$
  .pipe(diff())
  .subscribe(value => {
    // value is emitted only if it has been changed, and only the changed parts.
  });
```

## ControlValueAccessor

The library exposes a `typed` version of `ControlValueAccessor`, which already implements `registerOnChange` and `registerOnTouched` under the hood:

```ts
import { ControlValueAccessor } from '@ngneat/reactive-forms';

@Component({
  selector: 'my-checkbox',
  host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MyCheckboxComponent,
      multi: true
    }
  ]
})
export class MyCheckboxComponent extends ControlValueAccessor<boolean> {
  writeValue(value: boolean) {

  }

  // `this.onChange`, and `this.onTouched` are already here!
}
```

Note that you can also use it as `interface`.

## Form Builder

We also introduce a `typed` version of `FormBuilder` which returns a `typed` `FormGroup`, `FormControl` and `FormArray` with all our sweet additions:

```ts
import { FormBuilder } from '@ngneat/reactive-forms';

constructor(
  private fb: FormBuilder
) {}

const group = this.fb.group({ name: 'ngneat', id: 1 });

group.get('name') // FormControl<string>
```

Due to the complexity of the builder API, we are currently couldn't create a "good" implementation of `ControlsOf` for the builder.

## Persist Form

Automatically persist the `AbstractControl`'s value to the given storage:

```ts
import { persistControl } from '@ngneat/reactive-forms';

const group = new FormGroup(...);
const unsubscribe = persistControl(group, 'profile').subscribe();
```

The `persistControl` function will also set the `FromGroup` value to the latest state available in the storage before subscribing to value changes.

##### `PersistOptions`

Change the target storage or `debounceTime` value by providing options as a second argument in the `persist` function call.

| Option              | Description                                           | Default               |
|---------------------|-------------------------------------------------------|-----------------------|
| `debounceTime`      | Update delay in ms between value changes              | 250                   |
| `manager`           | A manager implementing the `PersistManager` interface | `LocalStorageManager` |
| `arrControlFactory` | Factory functions for `FormArray`                     |                       |
| `persistDisabledControls` | Defines whether values of disabled controls should be persisted | false |


By default the library provides `LocalStorageManager` and `SessionStorageManager`. It's possible to store the form value into a custom storage. Just implement the `PersistManager` interface, and use it when calling the `persistControl` function.

```ts

export class StateStoreManager<T> implements PersistManager<T> {
  setValue(key: string, data: T) {
     ...
  }

  getValue(key: string) {
    ...
  }
}

export class FormComponent implements OnInit {
  group = new FormGroup();

  ngOnInit() {
    persist(this.group, 'profile', { manager: new StateStoreManager() }).subscribe();
  }
}
```

##### Using `FormArray` Controls.

When working with a `FormArray`, it's required to pass a `factory` function that defines how to create the `controls` inside the `FormArray`.

```ts
const group = new FormGroup({
  skills: new FormArray<string>([])
});

persist(group, 'profile', {
  arrControlFactory: {
     skills: value => new FormControl(value)
  }
});
```

Because the form is strongly typed, you can only configure factories for properties that are of type `Array`. The library makes it also possible to correctly infer the type of `value` for the factory function.

## ESLint Rule

We provide a special lint rule that forbids the imports of any token we expose, such as the following:
`AbstractControl`,
`AsyncValidatorFn`,
`ControlValueAccessor`,
`FormArray`,
`FormBuilder`,
`FormControl`,
`FormGroup`,
`ValidatorFn`,
from `@angular/forms`.

Check out the [documentation](https://github.com/ngneat/reactive-forms/tree/master/libs/eslint-plugin-reactive-forms).
