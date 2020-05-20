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

✅ Seamless `FormControl`, `FormGroup`, `FormArray` Replacement<br>
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
- [ESLint Rule](#eslint-rule)
- [Schematics](#schematics)

## Types

Each `AbstractControl` takes a generic that serves as the `type` for each method Angular and this library exposes:

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

Observe the control's value. Unlike the behavior of the built-in `valueChanges` observable, it emits the current `rawValue` **immediately**. ( which means you'll also get the values of the `disabled` controls)

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.valueChanges$.subscribe(value => ...);
```

### `disabledChanges$`

Observe the control's `disable` status.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.disabledChanges$.subscribe(isDisabled => ...);
```

### `enabledChanges$`

Observe the control's `enable` status.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.enabledChanges$.subscribe(isEnabled => ...);
```

### `statusChanges$`

Observe the control's `status`.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.statusChanges$.subscribe(status => ...);
```

The `status` is typed as `ControlState`.

### `touchChanges$`

Observe the control's `touched` status.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.touchChanges$.subscribe(isTouched => ...);
```

This emits **only** when `markAsTouched` or `markAsUnTouched` has been called.

### `dirtyChanges$`

Observe the control's `dirty` status.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.dirtyChanges$.subscribe(isDirty => ...);
```

This emits **only** when `markAsDirty` or `markAsPristine` has been called.

### Methods

### `connect()`

Subscribes to the given source observable, and calls `patchValue` when emits.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.connect(query.select('formValue'));
```

### `select()`

Select a `slice` of the form's state.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const control = new FormGroup<Person>(...);
control.select(state => state.name).subscribe(name => ...)
```

### `setValue()`

In addition to the built-in method, it also takes an `observable`.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const control = new FormGroup<Person>();
control.setValue(query.select('formValue'));
```

### `patchValue()`

In addition to the built-in method, it also takes an `observable` or a `callback` function.

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

Unlike the built-in `setValidator` method, it'll persist any existing validators.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.mergeValidators(Validators.minLength(2));
control.mergeAsyncValidators(...);
```

### `markAllAsDirty()`

Mark all the controls as `dirty`.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const control = new FormGroup<Person>();
control.markAllAsDirty();
```

### `validateOn()`

Takes an observable that emits an `error-like` response and call `setErrors()` with the response.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
const error$ = source.pipe(map(condition => ({
  condition ? { someError: true } : null
})));

control.validateOn(error$);
```

### `hasErrorAndTouched()`

A sugar method to use in the template:

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>('', Validators.required);

// In the HTML *ngIf
control.hasErrorAndTouched('required');
```

### `hasErrorAndDirty()`

A sugar method to use in the template:

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>('', Validators.required);
// In the HTML *ngIf
control.hasErrorAndDirty('required');
```

### `setEnable()`

Set whether the control is `enabled`.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.setEnable();
control.setEnable(false);
```

### `setDisable`

Set whether the control is `disabled`.

```ts
import { FormControl } from '@ngneat/reactive-forms';

const control = new FormControl<string>();
control.setDisable();
control.setDisable(false);
```

### `getControl()`

A `typed` method to obtain a reference to a specific control.

```ts
import { FormGroup } from '@ngneat/reactive-forms';

const group = new FormGroup<Person>(...);
group.getControl('name');
group.getControl('nested', 'field');
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
