import { expectTypeOf } from 'expect-type';
import { Observable, of, Subscription } from 'rxjs';
import { FormControl } from '../formControl';
import { Errors, pattern, required, requiredAsync, patternAsync, errors } from './mocks.spec';

test('control value should be of type string', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.value).toBeString();
});

test('control value should be of type string when initial with empty value', () => {
  const control = new FormControl<string>();
  expectTypeOf(control.value).toBeString();
});

test('control valueChanges$ should be of type stream of string', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.valueChanges$).toMatchTypeOf(new Observable<string>());
});

test('control toucheChanges$ should be of type stream of boolean', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.touchChanges$).toMatchTypeOf(new Observable<boolean>());
});

test('control dirtyChanges$ should be of type stream of boolean', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.touchChanges$).toMatchTypeOf(new Observable<boolean>());
});

test('control select parameter should be of type stream of given type', () => {
  const control = new FormControl<string>('a string');
  const cb = (value: string) => parseInt(value);
  expectTypeOf(control.select<number>(cb)).toEqualTypeOf(new Observable<string>());
});

test('control setValue should accept value of type string or stream of string', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.setValue)
    .parameter(0)
    .toEqualTypeOf('another string');
  expectTypeOf(control.setValue(of('string'))).toEqualTypeOf(new Subscription());
});

test('control patchValue should accept value of type string or stream of string', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.patchValue)
    .parameter(0)
    .toEqualTypeOf('another string');
  expectTypeOf(control.patchValue(of('string'))).toEqualTypeOf(new Subscription());
});

test('control disableWhile should return subscription', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.disabledWhile).returns.not.toBeAny();
  expectTypeOf(control.disabledWhile).returns.toMatchTypeOf(new Subscription());
});

test('control reset should accept type of string', () => {
  const control = new FormControl<string>('a string');
  control.reset('string');
  control.reset({ value: 'string', disabled: true });
});

test('should be able to construct with validators', () => {
  new FormControl<string, Errors>('a string', required);
});

test('should be able to set validators', () => {
  const control = new FormControl<string, Errors>('string');
  control.setValidators(pattern);
  control.setValidators([required, pattern]);
});

test('should be able to set async validators', () => {
  const control = new FormControl<string, Errors>();
  control.setAsyncValidators([requiredAsync, patternAsync]);
});

test('should be able check if has errors', () => {
  const control = new FormControl<string, Errors>();
  control.hasError('required');
  control.hasError('pattern');
});

test('should be able to set errors', () => {
  const control = new FormControl<string, Errors>();
  control.setErrors(errors);
});

test('should be able to get errors', () => {
  const control = new FormControl<string, Errors>();
  expectTypeOf(control.getError('required')).toBeBoolean();
  expectTypeOf(control.getError('pattern')).toMatchTypeOf(errors.pattern);
});

test('should be able to call hasErrorAndTouched', () => {
  const control = new FormControl<string, Errors>();
  control.hasErrorAndTouched('required');
  control.hasErrorAndTouched('pattern');
  expectTypeOf(control.hasErrorAndTouched).returns.toBeBoolean();
});

test('should be able to call hasErrorAndDirty', () => {
  const control = new FormControl<string, Errors>();
  control.hasErrorAndDirty('required');
  control.hasErrorAndDirty('pattern');
  expectTypeOf(control.hasErrorAndDirty).returns.toBeBoolean();
});
