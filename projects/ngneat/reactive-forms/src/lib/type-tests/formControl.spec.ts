import { expectTypeOf } from 'expect-type';
import { Observable } from 'rxjs';
import { FormControl } from '../formControl';
import { NgValidatorsErrors } from '../types';

test('control value should be type of string', () => {
  const control = new FormControl('a string');
  expectTypeOf(control.value).toBeString();
});

test('control valueChanges should be stream of strings', () => {
  const control = new FormControl('a string');
  expectTypeOf(control.valueChanges$).toMatchTypeOf(new Observable<string>());
});

test('control valueChanges should be stream of strings', () => {
  const control = new FormControl<string, NgValidatorsErrors>('a string');
  control.getError('email');
  control.hasError('maxlength');
  const error = control.getError('maxlength');
  expectTypeOf(error).toMatchTypeOf<NgValidatorsErrors['maxlength']>();
  control.setErrors({ maxlength: { actualLength: 3, requiredLength: 4 } });
});
