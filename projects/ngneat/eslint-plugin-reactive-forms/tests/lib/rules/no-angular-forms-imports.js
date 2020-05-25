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

var ruleTester = new RuleTester({ parserOptions: { sourceType: 'module' } });
ruleTester.run('no-angular-forms-imports', rule, {
  valid: [
    { code: "import { FormGroup } from '@ngneat/reactive-forms';" },
    { code: "import { FormBuilder } from '@ngneat/reactive-forms';" },
    { code: "import { ControlValueAccessor } from '@angular/forms';" }
  ],

  invalid: [
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
      code: "import { FormBuilder } from '@angular/forms';",
      output: "import { FormBuilder } from '@ngneat/reactive-forms';",
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
      output: `import { FormControl, FormArray } from '@ngneat/reactive-forms';`,
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    },
    {
      code: `import {
        FormControl,
        ControlValueAccessor,
        FormArray
      } from '@angular/forms';`,
      output: `import { ControlValueAccessor } from '@angular/forms';\r\nimport { FormControl, FormArray } from '@ngneat/reactive-forms';`,
      errors: [
        {
          messageId: 'avoidImport'
        }
      ]
    }
  ]
});
