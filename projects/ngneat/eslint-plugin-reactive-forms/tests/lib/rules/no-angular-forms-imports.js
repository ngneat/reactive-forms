/**
 * @fileoverview Forbid imports from @angular/forms
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-angular-forms-imports'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parserOptions: { sourceType: 'module', ecmaVersion: 2015 } });
ruleTester.run('no-angular-forms-imports', rule, {
  valid: [
    { code: "import { FormGroup } from '@ngneat/reactive-forms';" },
    { code: "import { FormBuilder } from '@ngneat/reactive-forms';" },
    { code: "import { AbstractControlDir } from '@angular/forms';" },
    { code: "import { AbstractControlDir, Validators } from '@angular/forms';" },
    { code: "import { FormControlDirective, Validators } from '@angular/forms';" }
  ],

  invalid: [
    {
      code: "import { AbstractControl } from '@angular/forms';",
      output: "import { AbstractControl } from '@ngneat/reactive-forms';",
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    },
    {
      code: "import { AsyncValidatorFn } from '@angular/forms';",
      output: "import { AsyncValidatorFn } from '@ngneat/reactive-forms';",
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    },
    {
      code: "import { ControlValueAccessor } from '@angular/forms';",
      output: "import { ControlValueAccessor } from '@ngneat/reactive-forms';",
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    },
    {
      code: "import { FormArray } from '@angular/forms';",
      output: "import { FormArray } from '@ngneat/reactive-forms';",
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    },
    {
      code: "import { FormBuilder } from '@angular/forms';",
      output: "import { FormBuilder } from '@ngneat/reactive-forms';",
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    },
    {
      code: "import { FormControl } from '@angular/forms';",
      output: "import { FormControl } from '@ngneat/reactive-forms';",
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    },
    {
      code: "import { FormGroup } from '@angular/forms';",
      output: "import { FormGroup } from '@ngneat/reactive-forms';",
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    },
    {
      code: "import { ValidatorFn } from '@angular/forms';",
      output: "import { ValidatorFn } from '@ngneat/reactive-forms';",
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    },
    {
      code: "import { FormArray, FormBuilder } from '@angular/forms';",
      output: "import { FormArray, FormBuilder } from '@ngneat/reactive-forms';",
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    },
    {
      code: `import {
        FormControl,
        FormArray
      } from '@angular/forms';`,
      output: `import { FormArray, FormControl } from '@ngneat/reactive-forms';`,
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    },
    {
      code: `import {
        ControlValueAccessor,
        FormControl,
        FormArray
      } from '@angular/forms';`,
      output: `import { ControlValueAccessor, FormArray, FormControl } from '@ngneat/reactive-forms';`,
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    }
  ]
});
