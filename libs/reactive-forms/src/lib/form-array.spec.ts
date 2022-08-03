import { Validators } from '@angular/forms';
import { expectTypeOf } from 'expect-type';
import { Observable, of, Subject, Subscription } from 'rxjs';
import {ControlsOf, FormControl, FormGroup, ValuesOf} from '..';
import { ControlState } from './core';
import { FormArray } from './form-array';

type Base = {
  name: string;
  nameControl: FormControl<string>;
  phone: {
    prefix: string;
    number: string;
  };
  phoneControl: FormControl<{
    prefix: string;
    number: string;
  }>;
  phoneGroup: FormGroup<ControlsOf<{
    prefix: string;
    number: string;
  }>>
  deep: Base[];
  deepFormArray: FormArray<Base>;
};

type ValueOfBase = {
  name: string;
  nameControl: string;
  phone: {
    prefix: string;
    number: string;
  };
  phoneControl:{
    prefix: string;
    number: string;
  };
  phoneGroup:{
    prefix: string;
    number: string;
  };
  deep: ValueOfBase[];
  deepFormArray: ValueOfBase[];
}

describe('FormArray Types', () => {
  it('should infer primitives', () => {
    const arr = new FormArray<string>([new FormControl('')]);

    expectTypeOf(arr.value).toEqualTypeOf<string[]>();
    expectTypeOf(arr.valueChanges).toEqualTypeOf<Observable<string[]>>();
    expectTypeOf(arr.value$).toEqualTypeOf<Observable<string[]>>();

    // @ts-expect-error - should be typed
    new FormArray<string>([new FormControl(1)]);

    arr.insert(0, new FormControl(''));

    // @ts-expect-error - should be typed
    arr.insert(0, new FormControl(1));
    arr.push(new FormControl(''));
    // @ts-expect-error - should be typed
    arr.push(new FormControl(1));

    expectTypeOf(arr.disabled$).toEqualTypeOf<Observable<boolean>>();
    expectTypeOf(arr.enabled$).toEqualTypeOf<Observable<boolean>>();
    expectTypeOf(arr.invalid$).toEqualTypeOf<Observable<boolean>>();
    expectTypeOf(arr.valid$).toEqualTypeOf<Observable<boolean>>();
    expectTypeOf(arr.status$).toEqualTypeOf<Observable<ControlState>>();

    const first$ = arr.select((state) => {
      expectTypeOf(state).toEqualTypeOf<string[]>();

      return state[0];
    });

    expectTypeOf(first$).toEqualTypeOf<Observable<string>>();

    // @ts-expect-error - should be typed
    arr.reset({ foo: '' });

    arr.reset(['1']);
  });

  it('should infer objects', () => {
    const arr = new FormArray<Base>([
      new FormGroup({
        name: new FormControl(''),
        nameControl: new FormControl(''),
        phone: new FormGroup({
          prefix: new FormControl(''),
          number: new FormControl(''),
        }),
        phoneControl: new FormControl({
          prefix: '',
          number: '',
        }),
        phoneGroup: new FormGroup({
          prefix: new FormControl(''),
          number: new FormControl(''),
        }),
        deep: new FormArray([]),
        deepFormArray: new FormArray([]),
      }),
    ]);

    expectTypeOf(arr.value).toEqualTypeOf<ValueOfBase[]>();
    expectTypeOf(arr.valueChanges).toEqualTypeOf<Observable<ValueOfBase[]>>();
    expectTypeOf(arr.value$).toEqualTypeOf<Observable<ValueOfBase[]>>();

    // @ts-expect-error - should be typed
    arr.insert(0, new FormControl(1));
    arr.push(
      new FormGroup({
        name: new FormControl(''),
        nameControl: new FormControl(''),
        phone: new FormGroup({
          prefix: new FormControl(''),
          number: new FormControl(''),
        }),
        phoneControl: new FormControl({
          prefix: '',
          number: '',
        }),
        phoneGroup: new FormGroup({
          prefix: new FormControl(''),
          number: new FormControl(''),
        }),
        deep: new FormArray([]),
        deepFormArray: new FormArray([]),
      })
    );

    arr.push(
      // @ts-expect-error - should be typed, missing `name`
      new FormGroup({
        phone: new FormGroup({
          prefix: new FormControl(''),
          number: new FormControl(''),
        }),
      })
    );

    const first$ = arr.select((state) => {
      expectTypeOf(state).toEqualTypeOf<ValueOfBase[]>();

      return state[0];
    });

    expectTypeOf(first$).toEqualTypeOf<Observable<Base>>();

    // @ts-expect-error - should be typed
    arr.reset({ foo: '' });

    arr.reset([{ name: '', phone: { prefix: '', number: '' }, nameControl: '', phoneControl: { prefix: '', number: '' }, phoneGroup: { prefix: '', number: '' }, deep: [], deepFormArray: [] }]);

    expectTypeOf(arr.getRawValue()).toEqualTypeOf<ValueOfBase[]>();
  });

  it('should infer setValue', () => {
    const arr = new FormArray<Base>([]);

    try {
      arr.setValue([{ name: '', phone: { prefix: '', number: '' }, nameControl: '', phoneControl: { prefix: '', number: '' }, phoneGroup: { prefix: '', number: '' }, deep: [], deepFormArray: [] }]);

      const sub = arr.setValue(
        of([{ name: '', phone: { prefix: '', number: '' }, nameControl: '', phoneControl: { prefix: '', number: '' }, phoneGroup: { prefix: '', number: '' }, deep: [], deepFormArray: [] }])
      );
      expectTypeOf(sub).toEqualTypeOf<Subscription>();
    } catch {
      //
    }

    try {
      // @ts-expect-error - should be typed
      arr.setValue(of({ name: 1, phone: { number: '', prefix: '' } }));

      // @ts-expect-error - should be typed
      arr.setValue({ name: '' });

      // @ts-expect-error - should be typed
      arr.setValue(of(1000));
    } catch {
      //
    }
  });

  it('should infer patchValue', () => {
    const arr = new FormArray<Base>([]);

    arr.patchValue([{ name: '', phone: { number: '', prefix: '' } }]);

    const sub = arr.patchValue(
      of([{ name: '', phone: { number: '', prefix: '' } }])
    );
    expectTypeOf(sub).toEqualTypeOf<Subscription>();

    sub.unsubscribe();

    arr.patchValue([{ name: '' }]);
    const subtwo = arr.patchValue(of([{ phone: { number: '', prefix: '' } }]));
    subtwo.unsubscribe();

    try {
      // @ts-expect-error - should be typed
      arr.patchValue({ name: 1, phone: { number: '', prefix: '' } });

      // @ts-expect-error - should be typed
      arr.patchValue(of(1000));
    } catch {
      //
    }
  });
});

const errorFn = () => {
  return { isInvalid: true };
};

const createArray = (withError = false) => {
  return new FormArray<string>(
    [new FormControl(''), new FormControl('')],
    withError ? errorFn : []
  );
};

describe('FormArray Functionality', () => {
  it('should valueChanges$', () => {
    const control = createArray();
    const spy = jest.fn();
    control.value$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(['', '']);
    control.patchValue(['1', '2']);
    expect(spy).toHaveBeenCalledWith(['1', '2']);
    control.push(new FormControl('3'));
    expect(spy).toHaveBeenCalledWith(['1', '2', '3']);
    control.push(new FormControl(''));
    expect(spy).toHaveBeenCalledWith(['1', '2', '3', '']);
    control.removeAt(1);
    expect(spy).toHaveBeenCalledWith(['1', '3', '']);
  });

  it('should disabledChanges$', () => {
    const control = createArray();
    const spy = jest.fn();
    control.disabled$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(false);
    control.disable();
    expect(spy).toHaveBeenCalledWith(true);
    control.disable();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should enabledChanges$', () => {
    const control = createArray();
    const spy = jest.fn();
    control.enabled$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(true);
    control.disable();
    expect(spy).toHaveBeenCalledWith(false);
    control.disable();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should invalidChanges$', () => {
    const control = new FormArray([new FormControl<string | null>(null, Validators.required)]);
    const spy = jest.fn();
    control.invalid$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(true);
    control.setValue(['abc']);
    expect(spy).toHaveBeenCalledWith(false);
    control.setValue([null]);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should validChanges$', () => {
    const control = new FormArray([new FormControl<string | null>(null, Validators.required)]);
    const spy = jest.fn();
    control.valid$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(false);
    control.setValue(['abc']);
    expect(spy).toHaveBeenCalledWith(true);
    control.setValue([null]);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should statusChanges$', () => {
    const control = createArray();
    const spy = jest.fn();
    control.status$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith('VALID');
    control.disable();
    expect(spy).toHaveBeenCalledWith('DISABLED');
  });

  it('should select$', () => {
    const control = createArray();
    const spy = jest.fn();
    control.select((state) => state[0]).subscribe(spy);
    expect(spy).toHaveBeenCalledWith('');
    control.patchValue(['1', '2']);
    expect(spy).toHaveBeenCalledWith('1');
    control.patchValue(['1', '2']);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should setValue', () => {
    const control = createArray();

    control.setValue(of(['1', '2']));
    expect(control.value).toEqual(['1', '2']);
    control.setValue(['3', '4']);
    expect(control.value).toEqual(['3', '4']);
  });

  it('should patchValue', () => {
    const control = createArray();

    control.patchValue(of(['1', '2']));
    expect(control.value).toEqual(['1', '2']);
    control.patchValue(['5', '4']);
    expect(control.value).toEqual(['5', '4']);
  });

  it('should disabledWhile', () => {
    const control = createArray();

    const subject = new Subject<boolean>();
    control.disabledWhile(subject);
    expect(control.disabled).toBeFalsy();
    subject.next(true);
    expect(control.disabled).toBeTruthy();
    subject.next(false);
    expect(control.disabled).toBeFalsy();
  });

  it('should enableWhile', () => {
    const control = createArray();

    const subject = new Subject<boolean>();
    control.enabledWhile(subject);
    expect(control.enabled).toBeTruthy();
    subject.next(false);
    expect(control.enabled).toBeFalsy();
    subject.next(true);
    expect(control.enabled).toBeTruthy();
  });

  it('should markAsTouched/Untouched', () => {
    const control = createArray();

    const spy = jest.fn();
    control.touch$.subscribe(spy);
    control.markAsTouched();
    expect(spy).toHaveBeenCalledWith(true);
    control.markAsUntouched();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should markAsPristine/Dirty', () => {
    const control = createArray();
    const spy = jest.fn();
    control.dirty$.subscribe(spy);
    control.markAllAsDirty();
    expect(spy).toHaveBeenCalledWith(true);
    control.markAsPristine();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should markAllAsDirty', () => {
    const control = createArray();

    jest.spyOn(control, 'markAsDirty');
    control.markAllAsDirty();
    expect(control.markAsDirty).toHaveBeenCalled();
  });

  it('should reset', () => {
    const control = createArray();

    jest.spyOn(control, 'reset');
    control.reset();
    expect(control.reset).toHaveBeenCalled();
  });

  it('should setValidators', () => {
    const control = createArray();

    jest.spyOn(control, 'setValidators');
    control.setValidators([]);
    expect(control.setValidators).toHaveBeenCalled();
  });

  it('should setAsyncValidators', () => {
    const control = createArray();

    jest.spyOn(control, 'setAsyncValidators');
    control.setAsyncValidators([]);
    expect(control.setAsyncValidators).toHaveBeenCalled();
  });

  it('should hasErrorAndTouched', () => {
    const control = createArray(true);
    expect(control.hasErrorAndTouched('isInvalid')).toBeFalsy();
    control.markAsTouched();
    expect(control.hasErrorAndTouched('isInvalid')).toBeTruthy();
  });

  it('should hasErrorAndDirty', () => {
    const control = createArray(true);

    expect(control.hasErrorAndDirty('isInvalid')).toBeFalsy();
    control.markAsDirty();
    expect(control.hasErrorAndDirty('isInvalid')).toBeTruthy();
  });

  it('should setErrors', () => {
    const control = createArray(true);
    control.setErrors({ customError: true });
    expect(control.errors).toEqual({ customError: true });
  });

  it('should mergeErrors', () => {
    const control = createArray(true);
    control.mergeErrors({ customError: true });
    expect(control.errors).toEqual({ isInvalid: true, customError: true });
  });

  it('should removeError', () => {
    const control = createArray();
    control.setErrors({ customError: true, otherError: true });
    control.removeError('otherError');
    expect(control.errors).toEqual({ customError: true });
  });

  it('should setEnable', () => {
    const control = createArray();

    control.setEnable();
    expect(control.enabled).toBe(true);
    control.setEnable(false);
    expect(control.enabled).toBe(false);
  });

  it('should setDisable', () => {
    const control = createArray();

    control.setDisable();
    expect(control.enabled).toBe(false);
    control.setDisable(false);
    expect(control.enabled).toBe(true);
  });

  it('should errorChanges$', () => {
    const control = createArray();
    const spy = jest.fn();
    const validator = (control: any) =>
      control.length < 4 ? { minimum: 4 } : null;
    control.setValidators(validator);
    control.errors$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith({ minimum: 4 });

    control.push(new FormControl('Name1'));
    control.push(new FormControl('Name2'));
    control.push(new FormControl('Name3'));
    control.push(new FormControl('Name4'));

    expect(spy).toHaveBeenCalledWith(null);
    spy.mockReset();

    control.setErrors({ myError: 'So wrong' });
    expect(spy).toHaveBeenCalledWith({ myError: 'So wrong' });
  });

  it('should remove', () => {
    const control = createArray();
    control.clear();
    control.push(new FormControl('Name'));
    control.push(new FormControl('Name'));
    control.push(new FormControl('Phone'));
    control.push(new FormControl('Name'));
    control.push(new FormControl('Address'));
    control.remove('Name');
    expect(control.getRawValue()).toEqual(['Phone', 'Address']);
  });

  it('should removeIf', () => {
    const control = createArray();
    control.clear();
    control.push(new FormControl('FirstName'));
    control.push(new FormControl('LastName'));
    control.push(new FormControl('Phone'));
    control.push(new FormControl('MiddleName'));
    control.push(new FormControl('StreetNumber'));
    control.push(new FormControl('StreetName'));
    control.push(new FormControl('ZipCode'));
    control.removeWhen((elt) => elt.value.match(/Name$/) != null);
    expect(control.getRawValue()).toEqual(['Phone', 'StreetNumber', 'ZipCode']);
  });

  it('should removeIf with nested form groups', () => {
    const control = new FormArray<{ type: string; name: string }>([]);
    control.clear();
    control.push(
      new FormGroup({
        type: new FormControl('Jedi'),
        name: new FormControl('Luke'),
      })
    );
    control.push(
      new FormGroup({
        type: new FormControl('Sith'),
        name: new FormControl('Vader'),
      })
    );
    control.push(
      new FormGroup({
        type: new FormControl('Jedi'),
        name: new FormControl('Yoda'),
      })
    );
    control.push(
      new FormGroup({
        type: new FormControl('Jedi'),
        name: new FormControl('Obi-Wan'),
      })
    );
    control.push(
      new FormGroup({
        type: new FormControl('Sith'),
        name: new FormControl('Doku'),
      })
    );
    control.push(
      new FormGroup({
        type: new FormControl('Jedi'),
        name: new FormControl('Windu'),
      })
    );
    control.push(
      new FormGroup({
        type: new FormControl('Sith'),
        name: new FormControl('Palpatine'),
      })
    );
    control.removeWhen((elt) => elt.get('type').value === 'Sith');

    expect(control.getRawValue()).toEqual([
      { type: 'Jedi', name: 'Luke' },
      { type: 'Jedi', name: 'Yoda' },
      { type: 'Jedi', name: 'Obi-Wan' },
      { type: 'Jedi', name: 'Windu' },
    ]);
  });
});
