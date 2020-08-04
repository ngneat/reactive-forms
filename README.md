<p align="center">
 <img width="25%" src="./logo.svg">
</p>

<br />

![Test](https://github.com/ngneat/reactive-forms/workflows/Test/badge.svg?branch=master)
[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)](LICENSE)
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)]()

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
- [Control Errors](#control-errors)
- [ControlValueAccessor](#control-value-accessor)
- [Form Builder](#form-builder)
- [Persist Form](#persist-form)
- [ESLint Rule](#eslint-rule)
- [Migration](#migration)

## Control Type

Each `AbstractControl` takes a generic, which serves as the `type` for any method exposed by Angular or this library:

Use it with a `FormControl`:

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.valueChanges.subscribe(value => {
  // value is typed as string
});
```

Use it with a `FormGroup`:

```ts
import { FormGroup } from '@ngneat/reactive-forms';

interface Profile {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
  };
}

const profileForm = new FormGroup<Profile>({
  firstName: new FormControl(''),
  lastName: new FormControl(''),
  address: new FormGroup({
    street: new FormControl(''),
    city: new FormControl('')
  })
});

// typed as Profile
profileForm.setValue(new Profile());
// typed as Partial<Profile>
profileForm.patchValue({ firstName: 'Netanel' });
```

Use it with a `FormArray`:

```ts
import { FormArray, FormControl } from '@ngneat/reactive-forms';

const control = new FormArray<string>([new FormControl()]);

control.value$.subscribe(value => {
  // value is typed as string[]
});
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

const control = new FormGroup<Person>(...);
control.select(state => state.name).subscribe(name => ...)
```

## Control Methods

### `setValue()`

In addition to the built-in method functionality, it can also take an `observable`.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const control = new FormGroup<Person>();
control.setValue(query.select('formValue'));
```

### `patchValue()`

In addition to the built-in method functionality, it can also take an `observable`.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const control = new FormGroup<Person>();
control.patchValue(query.select('formValue'));
```

### `disabledWhile()`

Takes an observable that emits a boolean indicating whether to `disable` the control.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.disabledWhile(query.select('isDisabled'));
```

### `enabledWhile()`

Takes an observable that emits a `boolean` indicating whether to `enable` the control.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.enabledWhile(query.select('isEnabled'));
```

### `mergeValidators()`

Unlike the built-in `setValidator()` method, it persists any existing validators.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('', Validators.required);
control.mergeValidators(Validators.minLength(2));
control.mergeAsyncValidators(...);
```

### `markAllAsDirty()`

Marks all the group's controls as `dirty`.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const control = new FormGroup<Person>();
control.markAllAsDirty();
```

### `validateOn()`

Takes an observable that emits a response, which is either `null` or an error object ([`ValidationErrors`](https://angular.io/api/forms/ValidationErrors)). The control's `setErrors()` method is called whenever the source emits.

```ts
const passwordValidator = combineLatest([
  this.signup.select(state => state.password),
  this.signup.select(state => state.repeatPassword)
]).pipe(
  map(([password, repeat]) => {
    return password === repeat
      ? null
      : {
          isEqual: false
        };
  })
);

this.signup.validateOn(passwordValidator);
```

### `hasErrorAndTouched()`

A syntactic sugar method to be used in the template:

```ts
import { FormControl } from '@ngneat/reactive-forms';

this.control = new FormControl('', Validators.required);
```

```html
<span *ngIf="control.hasErrorAndTouched('required')"></span>
```

### `hasErrorAndDirty()`

A syntactic sugar method to be used in the template:

```ts
import { FormControl } from '@ngneat/reactive-forms';

this.control = new FormControl('', Validators.required);
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

### `getControl()`

A method with `typed` parameters which obtains a reference to a specific control.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const group = new FormGroup<Profile>(...);
const address = group.getControl('name') as FormGroup<Profile['address']>;
const city = group.getControl('address', 'city') as FormControl<string>;
```

**Note that the return type should still be inferred.**

### Control Path

The **array** path variation of `hasError()`, `getError()`, and `get()` is now `typed`:

```ts
const num = group.get(['phone', 'num']) as FormControl<string>;
const hasError = group.hasError('required', ['phone', 'num']);
const getError = group.getError('required', ['phone', 'num']);
```

## Control Errors

Each `AbstractControl` takes a second generic, which serves as the type of the errors:

```ts
type MyErrors = { isEqual: false };

const control = new FormControl<string, MyErrors>();
control.getError('isEqual'); // keyof MyErrors
control.hasError('isEqual'); // keyof MyErrors

// error type is MyErrors['isEqual']
const error = control.getError('isEqual'); // keyof MyErrors
```

The library provides a type for the built-in Angular validators types:

```ts
import { FormControl, NgValidatorsErrors } from '@ngneat/reactive-forms';

const control = new FormControl<string, NgValidatorsErrors>();
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
  writeValue(value) {
    // value is typed a boolean
  }

  // `this.onChange`, and `this.onTouched` are already here!
}
```

Note that you can also use it as `interface`.

## Form Builder

We also introduce a `typed` version of `FormBuilder` which returns a `typed` `FormGroup`, `FormControl` and `FormArray` with all our sweet additions:

```ts
import { FormBuilder } from '@ngneat/reactive-forms';

const fb = new FormBuilder();
// Returns a FormGroup<{name: string, id: number}>
const group = fb.group({ name: 'ngneat', id: 1 });

interface User {
  userName: string;
  email: string;
}

// We'll get an error because "id" does not exist in type `User`
const userGroup: FormGroup<User> = fb.group({ id: 1, userName: 'User', email: 'Email' });
```

## Persist Form

Automatically persist the `FormGroup`'s value to the given storage:

```ts
const group = new FormGroup<Profile>();
const unsubscribe = group.persist('profile').subscribe();
```

The `persist` function will also set the `FromGroup` value to the latest state available in the storage before subscribing to value changes.

##### `PersistOptions`

Change the target storage or `debounceTime` value by providing options as a second argument in the `persist` function call.

| Option              | Description                                           | Default               |
|---------------------|-------------------------------------------------------|-----------------------|
| `debounceTime`      | Update delay in ms between value changes              | 250                   |
| `manager`           | A manager implementing the `PersistManager` interface | `LocalStorageManager` |
| `arrControlFactory` | Factory functions for `FormArray`                     |                       |


By default the library provides `LocalStorageManager` and `SessionStorageManager`. It's possible to store the form value into a custom storage. Just implement the `PersistManager` interface, and use it when calling the `persist` function.

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
  group = new FormGroup<Profile>();

  ngOnInit() {
    this.group.persist('profile', { manager: new StateStoreManager() }).subscribe();
  }
}
```

##### Using `FormArray` Controls.

When working with a `FormArray`, it's required to pass a `factory` function that defines how to create the `controls` inside the `FormArray`.

```ts
interface Profile {
  skills: string[];
}

const group = new FormGroup<Profile>({
  skills: new FormArray([])
});

group.persist('profile', {
  arrControlFactory: {
     skills: value => new FormControl(value)
  }
});
```

Becuase the form is strongly typed, you can only configure factories for properties that are of type `Array`. The library makes it also possible to correclty infer the type of `value` for the factory function.

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

Check out the [documentation](https://github.com/ngneat/reactive-forms/tree/master/projects/ngneat/eslint-plugin-reactive-forms).

## Migration

The command will replace entities coming from `@angular/reactive-forms` with `@ngneat/reactive-forms`.

```bash
ng g @ngneat/reactive-forms:migrate
```

Further information about the script can be found [here](https://github.com/ngneat/reactive-forms/tree/master/schematics/src/migrate/migration.md).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.netbasal.com"><img src="https://avatars1.githubusercontent.com/u/6745730?v=4" width="100px;" alt=""/><br /><sub><b>Netanel Basal</b></sub></a><br /><a href="https://github.com/@ngneat/reactive-forms/commits?author=NetanelBasal" title="Code">💻</a> <a href="https://github.com/@ngneat/reactive-forms/commits?author=NetanelBasal" title="Documentation">📖</a> <a href="#ideas-NetanelBasal" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-NetanelBasal" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/Coly010"><img src="https://avatars2.githubusercontent.com/u/12140467?v=4" width="100px;" alt=""/><br /><sub><b>Colum Ferry</b></sub></a><br /><a href="https://github.com/@ngneat/reactive-forms/commits?author=Coly010" title="Code">💻</a> <a href="https://github.com/@ngneat/reactive-forms/commits?author=Coly010" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/danzrou"><img src="https://avatars3.githubusercontent.com/u/6433766?v=4" width="100px;" alt=""/><br /><sub><b>Dan Roujinsky</b></sub></a><br /><a href="https://github.com/@ngneat/reactive-forms/commits?author=danzrou" title="Code">💻</a> <a href="https://github.com/@ngneat/reactive-forms/commits?author=danzrou" title="Documentation">📖</a> <a href="#ideas-danzrou" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/theblushingcrow"><img src="https://avatars3.githubusercontent.com/u/638818?v=4" width="100px;" alt=""/><br /><sub><b>Inbal Sinai</b></sub></a><br /><a href="https://github.com/@ngneat/reactive-forms/commits?author=theblushingcrow" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/itayod"><img src="https://avatars2.githubusercontent.com/u/6719615?v=4" width="100px;" alt=""/><br /><sub><b>Itay Oded</b></sub></a><br /><a href="https://github.com/@ngneat/reactive-forms/commits?author=itayod" title="Code">💻</a> <a href="#ideas-itayod" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/@ngneat/reactive-forms/commits?author=itayod" title="Documentation">📖</a> <a href="https://github.com/@ngneat/reactive-forms/commits?author=itayod" title="Tests">⚠️</a> <a href="#tool-itayod" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/tehshin"><img src="https://avatars1.githubusercontent.com/u/876923?v=4" width="100px;" alt=""/><br /><sub><b>tehshin</b></sub></a><br /><a href="https://github.com/@ngneat/reactive-forms/commits?author=tehshin" title="Code">💻</a> <a href="https://github.com/@ngneat/reactive-forms/commits?author=tehshin" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
