import { FormBuilder } from '../formBuilder';
import { expectTypeOf } from 'expect-type';
import { Errors, User, NestedForm } from './mocks.spec';
import { Validators } from '@angular/forms';

const fb = new FormBuilder();

test('should be able to add group validators', () => {
  const group = fb.group<User, Errors>(
    {
      name: 'Hello',
      id: [1, Validators.required]
    },
    {
      validator: Validators.required
    }
  );

  group.setValidators([Validators.pattern(/\D/)]);
});

test('should be able to build nested form', () => {
  const group = fb.group<NestedForm>({
    a: 4,
    b: {
      a: '',
      c: [1, 2, 3]
    },
    c: [{ a: 2 }]
  });

  group.setValidators([Validators.pattern(/\D/)]);
});

test('group should return proper error type', () => {
  const group = fb.group<User, Errors>(null, { validator: Validators.required });
  expectTypeOf(group.getError('required')).toBeBoolean();
});

test('control should be able to add validator', () => {
  const control = fb.control<string, Errors>('Hello');
  control.setValidators([Validators.required]);
  control.setValidators([Validators.pattern(/\D/)]);
});

test('control should return proper error type', () => {
  const control = fb.control<string, Errors>(null, Validators.required);
  expectTypeOf(control.getError('required')).toBeBoolean();
});

test('array should be able to add validator', () => {
  const array = fb.array<string, Errors>([], { validators: [Validators.required] });
  array.setValidators([Validators.pattern(/\D/)]);
});

test('array should be return proper error type', () => {
  const array = fb.array<string, Errors>(null, { validators: [Validators.required] });
  expectTypeOf(array.getError('required')).toBeBoolean();
});
