import { expectTypeOf } from 'expect-type';
import { Observable, of, Subscription } from 'rxjs';
import { FormArray } from '../formArray';
import { FormControl } from '../formControl';

interface User {
  id: string;
  name: string;
}
const user: User = { id: '1', name: 'Itay' };

test('control should be constructed with abstract controls', () => {
  expectTypeOf(FormArray).toBeConstructibleWith([new FormControl<User>()]);
});

test('control value should be of type User[]', () => {
  const control = new FormArray<User>([]);
  expectTypeOf(control.value).toEqualTypeOf([user]);
});

test('control valueChanges$ should be of type stream of User[]', () => {
  const control = new FormArray<User>([]);
  expectTypeOf(control.valueChanges$).toMatchTypeOf(new Observable<User[]>());
});

test('control toucheChanges$ should be of type stream of boolean', () => {
  const control = new FormArray<User>([]);
  expectTypeOf(control.touchChanges$).toMatchTypeOf(new Observable<boolean>());
});

test('control dirtyChanges$ should be of type stream of boolean', () => {
  const control = new FormArray<User>([]);
  expectTypeOf(control.touchChanges$).toMatchTypeOf(new Observable<boolean>());
});

test('control connect parameter should be of type stream of User[]', () => {
  const control = new FormArray<User>([]);
  expectTypeOf(control.connect)
    .parameter(0)
    .toMatchTypeOf(new Observable<User[]>());
});

test('control select parameter should be of type stream of given type', () => {
  const control = new FormArray<User>([]);
  const cb = (users: User[]) => users.map(user => user.id);
  expectTypeOf(control.select<User['id'][]>(cb)).toEqualTypeOf(new Observable<User['id'][]>());
});

test('control setValue should accept value of type User[] or stream of User[]', () => {
  const control = new FormArray<User>([]);
  const anotherUser = { id: '2', name: 'Netanel' };
  expectTypeOf(control.setValue)
    .parameter(0)
    .toEqualTypeOf([anotherUser]);
  expectTypeOf(control.setValue(of([anotherUser]))).toEqualTypeOf(new Subscription());
});

test('control patchValue should accept value of type User[] or stream of User[]', () => {
  const control = new FormArray<User>([]);
  expectTypeOf(control.patchValue(of([user]))).toEqualTypeOf(new Subscription());
});

test('control disableWhile should return subscription', () => {
  const control = new FormArray<User>([]);
  expectTypeOf(control.disabledWhile).returns.not.toBeAny();
  expectTypeOf(control.disabledWhile).returns.toMatchTypeOf(new Subscription());
});

test('control reset should accept type of User[]', () => {
  const control = new FormArray<User>([]);
  expectTypeOf(control.reset)
    .parameter(0)
    .toBeArray();
});
