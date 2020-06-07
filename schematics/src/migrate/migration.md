# Reactive Forms Migration Script

```sh
ng g @ngneat/reactive-forms:migrate
```

## What will be done?

First you will ask to provide the script your source root (`./src/app` is the default), then the script will iterate recursively over all your `ts` files and will replace entities coming from `@angular/reactive-forms` with `@ngneat/reactive-forms`:

### Examples:

#### Before:

```typescript
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
```

#### After:

```typescript
import { FormControl, FormGroup, FormArray, FormBuilder } from '@ngneat/reactive-forms';
```

### Issues:

If you encounter any issues with the migration script please open a github issue, so we can resolve them and make a better experience for everyone.
