import { expectTypeOf } from 'expect-type';
import { Observable, of, Subscription } from 'rxjs';
import { FormControl } from '../formControl';
import { FormGroup } from '../formGroup';
import { ControlType } from '../types';
import { Validators } from '../validators';
import { Errors, errors, pattern, patternAsync, required, requiredAsync, User, user } from './mocks.spec';

test('control should be constructed with abstract controls', () => {
  expectTypeOf(FormGroup).toBeConstructibleWith({ name: new FormControl() });
});

test('control should be constructed with null', () => {
  expectTypeOf(FormGroup).toBeConstructibleWith(null);
});

test('control value should be of type User', () => {
  const control = new FormGroup<User>(null);
  expectTypeOf(control.value).toEqualTypeOf(user);
});

test('control valueChanges$ should be of type stream of Users', () => {
  const control = new FormGroup<User>(null);
  expectTypeOf(control.valueChanges$).toMatchTypeOf(new Observable<User>());
});

test('control toucheChanges$ should be of type stream of boolean', () => {
  const control = new FormGroup<User>(null);
  expectTypeOf(control.touchChanges$).toMatchTypeOf(new Observable<boolean>());
});

test('control dirtyChanges$ should be of type stream of boolean', () => {
  const control = new FormGroup<User>(null);
  expectTypeOf(control.touchChanges$).toMatchTypeOf(new Observable<boolean>());
});

test('get control should accept a type of given generic keys', () => {
  const control = new FormGroup<User>(null);
  expectTypeOf(control.getControl('id')).toMatchTypeOf(new FormControl<number>() as ControlType<any>);
});

test('control select parameter should be of type stream of given type', () => {
  const control = new FormGroup<User>(null);
  const cb = (user: User) => user.id;
  expectTypeOf(control.select<User['id']>(cb)).toEqualTypeOf(new Observable<User['id']>());
});

test('control setValue should accept value of type User or stream of User', () => {
  const control = new FormGroup<User>(null);
  const anotherUser = { id: 2, name: 'Netanel' };
  expectTypeOf(control.setValue)
    .parameter(0)
    .not.toBeAny();
  expectTypeOf(control.setValue(of(anotherUser))).toEqualTypeOf(new Subscription());
});

test('control patchValue should accept value of type User or stream of User', () => {
  const control = new FormGroup<User>(null);
  expectTypeOf(control.patchValue(of(user))).toEqualTypeOf(new Subscription());
});

test('control disableWhile should return subscription', () => {
  const control = new FormGroup<User>(null);
  expectTypeOf(control.disabledWhile).returns.not.toBeAny();
  expectTypeOf(control.disabledWhile).returns.toMatchTypeOf(new Subscription());
});

test('control reset should accept type of User', () => {
  const control = new FormGroup<User>(null);
  expectTypeOf(control.reset)
    .parameter(0)
    .toBeObject();
});

test('should be able to set validators', () => {
  const control = new FormGroup<User, Errors>(null);
  control.setValidators(pattern);
  control.setValidators([required, pattern]);
});

test('should be able to set async validators', () => {
  const control = new FormGroup<User, Errors>(null);
  control.setAsyncValidators([requiredAsync, patternAsync]);
});

test('should be able check if has errors', () => {
  const control = new FormGroup<User, Errors>(null);
  control.hasError('required');
  control.hasError('pattern');
});

test('should be able to set errors', () => {
  const control = new FormGroup<User, Errors>(null);
  control.setErrors(errors);
});

test('should be able to get errors', () => {
  const control = new FormGroup<User, Errors>(null);
  expectTypeOf(control.getError('required')).toBeBoolean();
  expectTypeOf(control.getError('pattern')).toMatchTypeOf(errors.pattern);
});

test('should be able to call hasErrorAndTouched', () => {
  const control = new FormGroup<User, Errors>(null);
  control.hasErrorAndTouched('required');
  control.hasErrorAndTouched('pattern');
  expectTypeOf(control.hasErrorAndTouched).returns.toBeBoolean();
});

test('should be able to call hasErrorAndDirty', () => {
  const control = new FormGroup<User, Errors>(null);
  control.hasErrorAndDirty('required');
  control.hasErrorAndDirty('pattern');
  expectTypeOf(control.hasErrorAndDirty).returns.toBeBoolean();
});

test('should be able to create group containing form controls with type of Array', () => {
  const list = ['a', 'b', 'c'];
  const form = new FormGroup({
    view: new FormControl(list)
  });
});

test('should be able to support array of validators', () => {
  const c = new FormControl('', [Validators.minLength(2)]);
  // TODO: support typing for array of validators
  const control = new FormControl('a string', [Validators.required, Validators.email]);

  const form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    child: new FormControl('', Validators.required)
  });

  const form2 = new FormGroup({
    name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)]))
  });
});

test('should be to set value to control inside group', () => {
  const control = new FormGroup<User>({ id: new FormControl<number>() });
  control.get(['id']).setValue(3);
  expectTypeOf(control.getControl('id').setValue)
    .parameter(0)
    .not.toBeAny();
});

test('should support nested objects', () => {
  const control = new FormGroup<{ user: User }>({ user: new FormControl<User>() });
  expectTypeOf(control.get(['user']).value.id).toBeNumber();
  expectTypeOf(control.get(['user', 'id']).value).toBeNumber();
});
