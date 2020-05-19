# Forbid imports from @angular/forms (no-angular-forms-imports)

In order to aid the migration to `@ngneat/reactive-forms`, check for imports from `@angular/forms`.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```ts
import { FormGroup, FormArray } from '@angular/forms';
```

Examples of **correct** code for this rule:

```ts
import { FormGroup, FormArray } from '@ngneat/reactive-forms';
```
