import { expectTypeOf } from 'expect-type';
import { Observable } from 'rxjs';
import { FormControl } from '../formControl';

test('control value should be type of string', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.value).toBeString();
});

test('control valueChanges should be stream of strings', () => {
  const control = new FormControl<string>('a string');
  expectTypeOf(control.valueChanges$).toMatchTypeOf(new Observable<string>());
});
