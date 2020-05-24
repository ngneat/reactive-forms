<p align="center">
 <img width="25%" src="./logo.svg">
</p>

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)]()

> (Angular Reactive) Forms with Benefits 😉

How many times have you told yourself "I wish Angular Reactive Forms would support types", or "I really want API to query the form reactively. It missed some methods."

Your wish is my command! This library extends every Angular `AbstractControl`, and provides features that don't exist in the original one. It adds types, reactive queries, and helper methods. The most important thing is that you can start using it today! The only thing that you need to change is the import path. So don't worry, no form refactoring required - we've got you covered; One schematics command (link), and you're done!

Let's take a look at all the neat things we provide:

## 🔮 Features

✅ Offers seamless `FormControl`, `FormGroup`, `FormArray` Replacement<br>
✅ Allows Typed Forms! <br>
✅ Provides Reactive Queries <br>
✅ Provides Helpful Methods

```
👉 npm install @ngneat/reactive-forms
```

## Table of Contents

- [Types](#types)
- [Queries](#queries)
- [Methods](#methods)
- [Form Builder](#form-builder)
- [ESLint Rule](#eslint-rule)
- [Schematics](#schematics)

## Types

Each `AbstractControl` takes a generic, which serves as the `type` for any method exposed by Angular or this library:

Use it with a `FormControl`:

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl('');
control.valueChanges$.subscribe(value => {
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

profileForm.setValue(new Profile()); // typed as Profile
profileForm.patchValue(new Profile()); // typed as Partial<Profile>
```

Use it with a `FormArray`:

```ts
import { FormArray, FormControl } from '@ngneat/reactive-forms';

const control = new FormArray<string>([new FormControl()]);

control.valueChanges$.subscribe(value => {
  // value is typed as string[]
});
```

## Queries

### `valueChanges$`

Observes the control's value. Unlike the behavior of the built-in `valueChanges` observable, it emits the current `rawValue` **immediately** (which means you'll also get the values of `disabled` controls).

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.valueChanges$.subscribe(value => ...);
```

### `disabledChanges$`

Observes the control's `disable` status.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.disabledChanges$.subscribe(isDisabled => ...);
```

### `enabledChanges$`

Observes the control's `enable` status.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.enabledChanges$.subscribe(isEnabled => ...);
```

### `statusChanges$`

Observes the control's `status`.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.statusChanges$.subscribe(status => ...);
```

The `status` is typed as `ControlState` (valid, invalid, pending or disabled).

### `touchChanges$`

Observes the control's `touched` status.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.touchChanges$.subscribe(isTouched => ...);
```

This emits a value **only** when `markAsTouched`, or `markAsUnTouched`, has been called.

### `dirtyChanges$`

Observes the control's `dirty` status.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.dirtyChanges$.subscribe(isDirty => ...);
```

This emits a value **only** when `markAsDirty`, or `markAsPristine`, has been called.

### Methods

### `select()`

Selects a `slice` of the form's state based on the given predicate.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const control = new FormGroup<Person>(...);
control.select(state => state.name).subscribe(name => ...)
```

### `setValue()`

In addition to the built-in method functionality, it can also take an `observable`.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const control = new FormGroup<Person>();
control.setValue(query.select('formValue'));
```

### `patchValue()`

In addition to the built-in method functionality, it can take an `observable` or a `callback` function.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const control = new FormGroup<Person>();
control.patchValue(query.select('formValue'));

control.patchValue(state => ({
  ...state,
  name: state.someProp ? 'someName' : 'anotherName'
}));
```

### `disabledWhile()`

Takes an observable that emits a boolean indicating whether to `disable` the control.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.disabledWhile(query.select('isDisabled'));
```

### `enabledWhile()`

Takes an observable that emits a `boolean` indicating whether to `enable` the control.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.enabledWhile(query.select('isEnable'));
```

### `mergeValidators()`

Unlike the built-in `setValidator()` method, it persists any existing validators.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
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

Takes an observable that emits a response, which is either `null` or an error object ([`ValidationErrors`](https://angular.io/api/forms/ValidationErrors). The control's `setErrors()` method is called whenever the source emits.

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

this.control = new FormControl<string>('', Validators.required);
```

```html
<span *ngIf="control.hasErrorAndTouched('required')"></span>
```

### `hasErrorAndDirty()`

A syntactic sugar method to be used in the template:

```ts
import { FormControl } from '@ngneat/reactive-forms';

this.control = new FormControl<string>('', Validators.required);
```

```html
<span *ngIf="control.hasErrorAndDirty('required')"></span>
```

### `setEnable()`

Sets whether the control is `enabled`.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.setEnable();
control.setEnable(false);
```

### `setDisable`

Sets whether the control is `disabled`.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.setDisable();
control.setDisable(false);
```

### `getControl()`

A `typed` method which obtains a reference to a specific control.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const group = new FormGroup<Person>(...);
const nameControl = group.getControl('name');
const nestedFieldControl = group.getControl('nested', 'field');
```

There is no need to infer it! (i.e: `as FormControl`)

## Errors Methods

Each `AbstractControl` takes a second generic which serves as the type of the errors:

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

## Form Builder

We also introduce a typed version of `FormBuilder` which returns a typed `FormGroup`, `FormControl` and `FormArray` with all our sweet additions:

```ts
import { FormBuilder } from '@ngneat/reactive-forms';

const fb = new FormBuilder();
const group = fb.group({ name: 'ngneat', id: 1 }); // Returns a FormGroup<{name: string, id: number}>

interface User {
  userName: string;
  email: string;
}

const userGroup: FormGroup<User> = fb.group({ userName: 'User', email: 'Email', id: 1 }); // Will error as "id" does not exist in User
```

## ESLint Rule

We provide a special lint rule that forbids the imports of `FormControl`, `FormGroup`, and `FormArray` from `@angular/forms`.
Check out the [documentation](https://github.com/ngneat/reactive-forms/tree/master/projects/ngneat/eslint-plugin-reactive-forms).

## Schematics

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
