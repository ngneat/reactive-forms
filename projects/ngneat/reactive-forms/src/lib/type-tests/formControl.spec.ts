import { expectTypeOf } from 'expect-type';
import { Observable, of, Subscription } from 'rxjs';
import { FormControl } from '../formControl';
import { Validators } from '../validators';
import { Errors, pattern, required, requiredAsync, patternAsync, errors } from './mocks.spec';

test('control value should be of type string', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.value).toBeString();
  const controlWithoutGeneric = new FormControl('a string');
  expectTypeOf(controlWithoutGeneric.value).toBeString();
});

test('control value should be of type string when initial with empty value', () => {
  const control = new FormControl<string>();
  expectTypeOf(control.value).toBeString();
  const controlWithoutGeneric = new FormControl();
  expectTypeOf(controlWithoutGeneric.value).toBeAny();
});

test('control valueChanges$ should be of type stream of string', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.value$).toMatchTypeOf(new Observable<string>());
  const controlWithoutGeneric = new FormControl('a string');
  expectTypeOf(controlWithoutGeneric.value$).toMatchTypeOf(new Observable<string>());
});

test('control toucheChanges$ should be of type stream of boolean', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.touch$).toMatchTypeOf(new Observable<boolean>());
});

test('control dirtyChanges$ should be of type stream of boolean', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.touch$).toMatchTypeOf(new Observable<boolean>());
});

test('control select parameter should be of type stream of given type', () => {
  const control = new FormControl<string>('a string');
  const cb = (value: string) => parseInt(value);
  expectTypeOf(control.select<number>(cb)).toEqualTypeOf(new Observable<string>());
  const controlWithoutGeneric = new FormControl<string>('a string');
  expectTypeOf(controlWithoutGeneric.select<number>(cb)).toEqualTypeOf(new Observable<string>());
});

test('control setValue should accept value of type string or stream of string', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.setValue)
    .parameter(0)
    .toBeString();
  expectTypeOf(control.setValue(of('string'))).toEqualTypeOf(new Subscription());
  const controlWithoutGeneric = new FormControl<string>('a string');
  expectTypeOf(controlWithoutGeneric.setValue)
    .parameter(0)
    .toBeString();
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
  const control = new FormControl<string>('string', Validators.required);
  const control2 = new FormControl<string>('string', [Validators.required, Validators.email]);
  control.setValidators(pattern);
  control.setValidators([required, pattern]);
});

test('should be able to set any validators without Error type', () => {
  const control = new FormControl<string>('string');
  control.setValidators(pattern);
  control.setValidators([required, pattern]);
});

test('should be able to set any validators by provided Error type', () => {
  const control = new FormControl<string, { required: boolean }>('string');
  expectTypeOf(control.setValidators)
    .parameter(0)
    .not.toBeAny();
  control.setValidators(required);
  control.setValidators([required]);
});

test('should be able to set async validators', () => {
  const control = new FormControl<string, Errors>();
  control.setAsyncValidators([requiredAsync, patternAsync]);
});

test('should be able check if has errors', () => {
  const control = new FormControl<string, Errors>('', required);
  expectTypeOf(control.hasError)
    .parameter(0)
    .not.toBeAny();
  expectTypeOf(control.hasError)
    .parameter(0)
    .toMatchTypeOf('required');
  expectTypeOf(control.hasError)
    .parameter(0)
    .not.toMatchTypeOf(3);
  control.hasError('required');
  control.hasError('pattern');
  const controlWithoutGeneric = new FormControl(null, required);
  expectTypeOf(controlWithoutGeneric.hasError)
    .parameter(0)
    .not.toBeAny();
  expectTypeOf(control.hasError)
    .parameter(0)
    .toMatchTypeOf('required');
});

test('validators should not infer value', () => {
  const control = new FormControl<string, Errors>('', required);
  expectTypeOf(control.value).toBeString();
  const controlWithoutGeneric = new FormControl<string, Errors>('', required);
  expectTypeOf(controlWithoutGeneric.value).toBeString();
  const controlWithoutGeneric2 = new FormControl(null, required);
  expectTypeOf(controlWithoutGeneric2.value).toBeAny();
  expectTypeOf(controlWithoutGeneric2.setValue)
    .parameter(0)
    .toBeAny();
  const controlWithoutGeneric3 = new FormControl(null, [required, Validators.min(2), Validators.email]);
  expectTypeOf(controlWithoutGeneric3.value).toBeAny();
  expectTypeOf(controlWithoutGeneric3.setValue)
    .parameter(0)
    .toBeAny();
});

test('should be able to set errors', () => {
  const control = new FormControl<string, Errors>();
  control.setErrors(errors);
});

test('should infer errors', () => {
  const control = new FormControl('', Validators.required);
  expectTypeOf(control.getError('required')).toBeBoolean();
  const control2 = new FormControl('', [Validators.required, Validators.pattern('some string')]);
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
