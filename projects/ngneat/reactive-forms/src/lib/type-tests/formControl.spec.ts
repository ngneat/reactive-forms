import { expectTypeOf } from 'expect-type';
import { Observable, of, Subscription } from 'rxjs';
import { FormControl } from '../formControl';

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

test('control connect parameter should be of type stream of string', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.connect)
    .parameter(0)
    .toMatchTypeOf(new Observable<string>());
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
  expectTypeOf(control.reset)
    .parameter(0)
    .toBeString();
});
