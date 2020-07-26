import { expectTypeOf } from 'expect-type';
import {
  Observable,
  of,
  Subscription
} from 'rxjs';
import { FormArray } from '../formArray';
import { FormControl } from '../formControl';
import { FormGroup } from '../formGroup';
import {
  User,
  user,
  Errors,
  required,
  pattern,
  patternAsync,
  requiredAsync,
  errors,
  NestedForm,
  NestedFormControls,
  nestedFormValue
} from './mocks.spec';

test('control should be constructed with abstract controls', () => {
  expectTypeOf(FormArray).toBeConstructibleWith([new FormControl<User>()]);
});

test('control value should be of type User[]', () => {
  const control = new FormArray<User>([]);
  expectTypeOf(control.value).toEqualTypeOf([user]);
});

test('control value should be constructed according to generic control type', () => {
  const control = new FormArray<FormGroup<NestedFormControls>>([]);
  expectTypeOf<NestedForm[]>(control.value).toEqualTypeOf([nestedFormValue]);
})

test('control valueChanges$ should be of type stream of User[]', () => {
  const control = new FormArray<User>([]);
  expectTypeOf(control.value$).toMatchTypeOf(new Observable<User[]>());
});

test('control valueChanges$ should be of type stream of the controls type', () => {
  const control = new FormArray<FormGroup<NestedFormControls>>([]);
  expectTypeOf(control.value$).toMatchTypeOf(new Observable<NestedForm[]>());
});

test('control toucheChanges$ should be of type stream of boolean', () => {
  const control = new FormArray<User>([]);
  expectTypeOf(control.touch$).toMatchTypeOf(new Observable<boolean>());
});

test('control dirtyChanges$ should be of type stream of boolean', () => {
  const control = new FormArray<User>([]);
  expectTypeOf(control.touch$).toMatchTypeOf(new Observable<boolean>());
});

test('control select parameter should be of type stream of given type', () => {
  const control = new FormArray<User>([]);
  const cb = (users: User[]) => users.map(user => user.id);
  expectTypeOf(control.select<User['id'][]>(cb)).toEqualTypeOf(new Observable<User['id'][]>());
});

test('control setValue should accept value of type User[] or stream of User[]', () => {
  const control = new FormArray<User>([]);
  const anotherUser = { id: 1, name: 'Netanel' };
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

test('control be able to reset should with type of User[]', () => {
  const control = new FormArray<User>([]);
  control.reset([user]);
});

// test('should be able to push control of type User', () => {
//   const control = new FormArray<User>([]);
//   expectTypeOf(control.push)
//     .parameter(0)
//     .toEqualTypeOf<FormGroup<User, any> | FormControl<User, any>>();
// });
//
// test('should be able to insert control of type User as index', () => {
//   const control = new FormArray<User>([]);
//   expectTypeOf(control.insert)
//     .parameter(1)
//     .toEqualTypeOf<FormGroup<User, any> | FormControl<User, any>>();
// });
//
// test('should be able to set control of type User as index', () => {
//   const control = new FormArray<User>([]);
//   expectTypeOf(control.setControl)
//     .parameter(1)
//     .toEqualTypeOf<FormGroup<User, any> | FormControl<User, any>>();
// });

test('should be able to set validators', () => {
  const control = new FormArray<User, Errors>([]);
  control.setValidators(pattern);
  control.setValidators([required, pattern]);
});

test('should be able to set async validators', () => {
  const control = new FormArray<User, Errors>([]);
  control.setAsyncValidators([requiredAsync, patternAsync]);
});

test('should be able check if has errors', () => {
  const control = new FormArray<User, Errors>([]);
  control.hasError('required');
  control.hasError('pattern');
});

test('should be able to set errors', () => {
  const control = new FormArray<User, Errors>([]);
  control.setErrors(errors);
});

test('should be able to get errors', () => {
  const control = new FormArray<User, Errors>([]);
  expectTypeOf(control.getError('required')).toBeBoolean();
  expectTypeOf(control.getError('pattern')).toMatchTypeOf(errors.pattern);
});

test('should be able to call hasErrorAndTouched', () => {
  const control = new FormArray<User, Errors>([]);
  control.hasErrorAndTouched('required');
  control.hasErrorAndTouched('pattern');
  expectTypeOf(control.hasErrorAndTouched).returns.toBeBoolean();
});

test('should be able to call hasErrorAndDirty', () => {
  const control = new FormArray<User, Errors>([]);
  control.hasErrorAndDirty('required');
  control.hasErrorAndDirty('pattern');
  expectTypeOf(control.hasErrorAndDirty).returns.toBeBoolean();
});

test('should be able to insert controls', () => {
  const control = new FormArray<string>([]);
  control.setControl(0, new FormControl<string>());
  control.setControl(1, new FormControl<string>());
});

test('should be able to insert groups', () => {
  const control = new FormArray<User>([]);
  control.setControl(
    0,
    new FormGroup<User>({ id: new FormControl(1) })
  );
  control.setControl(
    0,
    new FormGroup<User>({ id: new FormControl(2) })
  );
});

test('should be able to set value to controls', () => {
  const control = new FormArray<string>([]);
  control.setControl(0, new FormControl());
  control.at(0).setValue('string');
  expectTypeOf(control.at(0).setValue)
    .parameter(1)
    .not.toBeAny();
});

test('should be able to set value to groups', () => {
  const control = new FormArray<any>([]);
  control.setControl(
    0,
    new FormGroup<any>({ name: new FormControl<any>() })
  );
  control.at(0).setValue({ name: 'Itay' });
  expectTypeOf(control.at(0).setValue)
    .parameter(1)
    .not.toBeAny();
});

test('should be able to set value to control inside group', () => {
  const control = new FormArray<FormGroup<User>>([]);
  control.setControl(
    0,
    new FormGroup<User>({ id: new FormControl<number>() })
  );
  control
    .at(0)
    .get('id')
    .setValue(3);
  expectTypeOf((control.at(0)).getControl('id').value).toBeNumber();
});
