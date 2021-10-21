import { expectTypeOf } from 'expect-type';
import { FormGroup } from './form-group';
import { FormControl } from './form-control';
import { FormArray } from './form-array';
import { AbstractControl } from '@angular/forms';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { ControlsOf } from '..';
import { ValuesOf } from './types';

const createGroup = () => {
  return new FormGroup(
    {
      name: new FormControl(''),
      phone: new FormGroup({
        num: new FormControl<number>(),
        prefix: new FormControl<number>(),
      }),
    },
    {
      validators: () => {
        return { isInvalid: true };
      },
    }
  );
};

describe('FormGroup Functionality', () => {
  it('should valueChanges$', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.value$.subscribe(spy);

    expect(spy).toHaveBeenCalledWith({
      name: '',
      phone: { num: null, prefix: null },
    });

    control.patchValue({
      name: 'changed',
    });

    expect(spy).toHaveBeenCalledWith({
      name: 'changed',
      phone: { num: null, prefix: null },
    });
  });

  it('should disabledChanges$', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.disabled$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(false);
    control.disable();
    expect(spy).toHaveBeenCalledWith(true);
    control.disable();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should enabledChanges$', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.enabled$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(true);
    control.disable();
    expect(spy).toHaveBeenCalledWith(false);
    control.disable();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should statusChanges$', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.status$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith('INVALID');
    control.disable();
    expect(spy).toHaveBeenCalledWith('DISABLED');
  });

  it('should select$', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.select((state) => state.name).subscribe(spy);
    expect(spy).toHaveBeenCalledWith('');
    control.patchValue({
      name: 'changed',
    });
    expect(spy).toHaveBeenCalledWith('changed');
    control.patchValue({
      name: 'changed',
    });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should setValue', () => {
    const control = createGroup();

    control.setValue(
      of({
        name: 'a',
        phone: {
          num: 1,
          prefix: 2,
        },
      })
    );
    expect(control.value).toEqual({
      name: 'a',
      phone: {
        num: 1,
        prefix: 2,
      },
    });

    control.setValue({
      name: 'd',
      phone: {
        num: 1,
        prefix: 2,
      },
    });

    expect(control.value).toEqual({
      name: 'd',
      phone: {
        num: 1,
        prefix: 2,
      },
    });
  });

  it('should patchValue', () => {
    const control = createGroup();

    control.patchValue(
      of({
        name: 'patched',
      })
    );

    expect(control.value).toEqual({
      name: 'patched',
      phone: {
        num: null,
        prefix: null,
      },
    });

    control.patchValue({
      name: 'dd',
      phone: {
        num: 1,
        prefix: 2,
      },
    });

    expect(control.value).toEqual({
      name: 'dd',
      phone: {
        num: 1,
        prefix: 2,
      },
    });
  });

  it('should disabledWhile', () => {
    const control = createGroup();
    const subject = new Subject<boolean>();
    control.disabledWhile(subject);
    expect(control.disabled).toBeFalsy();
    subject.next(true);
    expect(control.disabled).toBeTruthy();
    subject.next(false);
    expect(control.disabled).toBeFalsy();
  });

  it('should enableWhile', () => {
    const control = createGroup();

    const subject = new Subject<boolean>();
    control.enabledWhile(subject);
    expect(control.enabled).toBeTruthy();
    subject.next(false);
    expect(control.enabled).toBeFalsy();
    subject.next(true);
    expect(control.enabled).toBeTruthy();
  });

  it('should markAsTouched/Untouched', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.touch$.subscribe(spy);
    control.markAsTouched();
    expect(spy).toHaveBeenCalledWith(true);
    control.markAsUntouched();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should reset', () => {
    const control = createGroup();
    jest.spyOn(control, 'reset');
    control.reset();
    expect(control.reset).toHaveBeenCalled();
  });

  it('should setErrors', () => {
    const control = createGroup();
    control.setErrors({ customError: true });
    expect(control.errors).toEqual({ customError: true });
  });

  it('should mergeErrors', () => {
    const control = createGroup();
    control.mergeErrors({ customError: true });
    expect(control.errors).toEqual({ isInvalid: true, customError: true });
  });

  it('should removeError', () => {
    const control = createGroup();
    control.setErrors({ customError: true, otherError: true });
    control.removeError('otherError');
    expect(control.errors).toEqual({ customError: true });
  });

  it('should setValidators', () => {
    const control = createGroup();
    jest.spyOn(control, 'setValidators');
    control.setValidators([]);
    expect(control.setValidators).toHaveBeenCalled();
  });

  it('should setAsyncValidators', () => {
    const control = createGroup();
    jest.spyOn(control, 'setAsyncValidators');
    control.setAsyncValidators([]);
    expect(control.setAsyncValidators).toHaveBeenCalled();
  });

  it('should hasErrorAndTouched', () => {
    const control = createGroup();
    expect(control.hasErrorAndTouched('isInvalid')).toBeFalsy();
    control.markAsTouched();
    expect(control.hasErrorAndTouched('isInvalid')).toBeTruthy();
  });

  it('should hasErrorAndDirty', () => {
    const control = createGroup();
    expect(control.hasErrorAndDirty('isInvalid')).toBeFalsy();
    control.markAsDirty();
    expect(control.hasErrorAndDirty('isInvalid')).toBeTruthy();
  });

  it('should setEnable', () => {
    const control = createGroup();
    control.setEnable();
    expect(control.enabled).toBe(true);
    control.setEnable(false);
    expect(control.enabled).toBe(false);
  });

  it('should setDisable', () => {
    const control = createGroup();
    control.setDisable();
    expect(control.enabled).toBe(false);
    control.setDisable(false);
    expect(control.enabled).toBe(true);
  });

  it('should getControl', () => {
    const control = createGroup();
    const nameControl = control.get('name');
    expect(nameControl).toBeInstanceOf(FormControl);
    const numControl = control.get(['phone', 'num']);
    expect(numControl).toBeInstanceOf(FormControl);
  });

  it('should errorChanges$', () => {
    const control = createGroup();
    const validator = (control: any) =>
      control.getRawValue().name === 'Test' ? { invalidName: true } : null;
    control.setValidators(validator);
    const spy = jest.fn();
    control.errors$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(null);
    spy.mockReset();
    control.patchValue({ name: 'Test' });
    expect(spy).toHaveBeenCalledWith({ invalidName: true });
    spy.mockReset();
    control.setErrors({ myError: 'So wrong' });
    expect(spy).toHaveBeenCalledWith({ myError: 'So wrong' });
  });
});

type Base = {
  name: string;
  phone: {
    prefix: string;
    number: string;
  };
};

describe('FormGroup Types', () => {
  it('should infer basic', () => {
    const group = new FormGroup({
      name: new FormControl(''),
      phone: new FormGroup({
        prefix: new FormControl(''),
        number: new FormControl(''),
      }),
    });

    expectTypeOf(group.value).toEqualTypeOf<Base>();

    expectTypeOf(group.valueChanges).toEqualTypeOf<Observable<Base>>();

    expectTypeOf(group.value$).toEqualTypeOf<Observable<Base>>();

    expectTypeOf(group.disabled$).toEqualTypeOf<Observable<boolean>>();
    expectTypeOf(group.enabled$).toEqualTypeOf<Observable<boolean>>();
    expectTypeOf(group.status$).toEqualTypeOf<Observable<boolean>>();

    const name$ = group.select((state) => {
      expectTypeOf(state).toEqualTypeOf<Base>();

      return state.name;
    });

    expectTypeOf(name$).toEqualTypeOf<Observable<string>>();

    // @ts-expect-error - should be typed
    group.reset({ foo: '' });
  });

  it('should in infer the control types', () => {
    const group = new FormGroup({
      name: new FormControl(''),
      phone: new FormGroup({
        prefix: new FormControl(''),
        number: new FormControl(''),
      }),
      one: new FormGroup({
        two: new FormGroup({
          three: new FormControl(0),
        }),
      }),
    });

    expectTypeOf(group.get('name')).toEqualTypeOf<FormControl<string>>();

    expectTypeOf(group.get('phone')).toEqualTypeOf<
      FormGroup<{
        prefix: FormControl<string>;
        number: FormControl<string>;
      }>
    >();

    expectTypeOf(group.get(['phone'])).toEqualTypeOf<
      FormGroup<{
        prefix: FormControl<string>;
        number: FormControl<string>;
      }>
    >();

    expectTypeOf(group.get(['phone', 'number'])).toEqualTypeOf<
      FormControl<string>
    >();
    expectTypeOf(group.get(['one', 'two', 'three'])).toEqualTypeOf<
      FormControl<number>
    >();

    expectTypeOf(group.get('phone.prefix')).toEqualTypeOf<AbstractControl>();

    // @ts-expect-error - should be typed
    group.get(['notexists']);

    // @ts-expect-error - should be typed
    group.get(['phone', 'prefax']);
  });

  it('should infer setValue', () => {
    const group = new FormGroup({
      name: new FormControl(''),
      phone: new FormGroup({
        prefix: new FormControl(''),
        number: new FormControl(''),
      }),
    });

    group.setValue({ name: '', phone: { number: '', prefix: '' } });

    const sub = group.setValue(
      of({ name: '', phone: { number: '', prefix: '' } })
    );
    expectTypeOf(sub).toEqualTypeOf<Subscription>();

    try {
      // @ts-expect-error - should be typed
      group.setValue(of({ name: 1, phone: { number: '', prefix: '' } }));

      // @ts-expect-error - should be typed
      group.setValue({ name: '' });

      // @ts-expect-error - should be typed
      group.setValue(of(1000));
    } catch {
      //
    }
  });

  it('should infer patchValue', () => {
    const group = new FormGroup({
      name: new FormControl(''),
      phone: new FormGroup({
        prefix: new FormControl(''),
        number: new FormControl(''),
      }),
    });

    group.patchValue({ name: '', phone: { number: '', prefix: '' } });

    const sub = group.patchValue(
      of({ name: '', phone: { number: '', prefix: '' } })
    );
    expectTypeOf(sub).toEqualTypeOf<Subscription>();

    sub.unsubscribe();

    group.patchValue({ name: '' });
    const subtwo = group.patchValue(of({ phone: { number: '', prefix: '' } }));
    subtwo.unsubscribe();

    try {
      // @ts-expect-error - should be typed
      group.patchValue({ name: 1, phone: { number: '', prefix: '' } });

      // @ts-expect-error - should be typed
      group.patchValue(of(1000));
    } catch {
      //
    }
  });

  it('should infer getRawValue', () => {
    const group = new FormGroup({
      name: new FormControl(''),
      phone: new FormGroup({
        prefix: new FormControl(''),
        number: new FormControl(''),
      }),
    });

    expectTypeOf(group.getRawValue()).toEqualTypeOf<Base>();
  });
});



describe('ControlsOf', () => {

  it('should infer the type', () => {
    interface Foo {
      str: string;
      nested: {
        one: string;
        two: number,
        deep: {
          id: number;
          arr: string[]
        }
      },
      arr: string[]
    }

    const group = new FormGroup<ControlsOf<Foo>>({
      str: new FormControl(''),
      nested: new FormGroup({
        one: new FormControl(''),
        two: new FormControl(),
        deep: new FormGroup({
          id: new FormControl(1),
          arr: new FormArray([])
        })
      }),
      arr: new FormArray([])
    });

    expectTypeOf(group.value).toEqualTypeOf<Foo>();

    expectTypeOf(group.get('str')).toEqualTypeOf<FormControl<string>>();
    expectTypeOf(group.get('nested')).toEqualTypeOf<FormGroup<ControlsOf<Foo['nested']>>>();
    expectTypeOf(group.get('arr')).toEqualTypeOf<FormArray<string, FormControl<string>>>();

    expectTypeOf(group.get('nested').value).toEqualTypeOf<Foo['nested']>();
    expectTypeOf(group.get('arr').value).toEqualTypeOf<Foo['arr']>();


    new FormGroup<ControlsOf<Foo>>({
      // @ts-expect-error - should be typed
      str: new FormControl(1),
      // @ts-expect-error - should be typed
      nested: new FormGroup({
        // one: new FormControl(''),
        two: new FormControl()
      }),
      // @ts-expect-error - should be typed
      arr: new FormArray([new FormControl(1)])
    })
  })

  it('should allow FormControls as objects or arrays', () => {

    interface Bar {
      str: string;
      controlGroup: FormControl<{
        one: string;
        two: number
      }>,
      controlArr: FormControl<string[]>,
      group: {
        id: string;
        deep: {
          id: number;
          arr: FormControl<string[]>
        }
      }
      arr: string[],
      arrGroup: Array<{ name: string, count: number }>;
    }


    const group = new FormGroup<ControlsOf<Bar>>({
      str: new FormControl(''),
      controlGroup: new FormControl({ one: '', two: 1 }),
      controlArr: new FormControl([]),
      group: new FormGroup({
        id: new FormControl(),
        deep: new FormGroup({
          id: new FormControl(),
          arr: new FormControl([])
        })
      }),
      arr: new FormArray([]),
      arrGroup: new FormArray([])
    });

    expectTypeOf(group.value).toEqualTypeOf<ValuesOf<ControlsOf<Bar>>>();

    new FormGroup<ControlsOf<Bar>>({
      str: new FormControl(''),
      // @ts-expect-error - should be FormControl
      controlGroup: new FormGroup({ one: new FormControl(''), two: new FormControl() }),
      // @ts-expect-error - should be FormControl
      controlArr: new FormArray([]),
      // @ts-expect-error - should be FormGroup
      group: new FormControl(),
      // @ts-expect-error - should be FormArray
      arr: new FormControl([]),
      // @ts-expect-error - should be FormArray
      arrGroup: new FormControl([])
    });

  })


  it('should work with optional fields', () => {
    type Foo = {
      name?: string;
      foo: string;
      baz: null | string;
      arr?: string[];
      nested: {
        id: string
      }
    }

    const group = new FormGroup<ControlsOf<Foo>>({
      foo: new FormControl(''),
      name: new FormControl(''),
      baz: new FormControl(null),
      arr: new FormArray([]),
      nested: new FormGroup({
        id: new FormControl('')
      })
    })

    // @ts-expect-error - should be a string
    group.get('name')?.patchValue(1);

    expectTypeOf(group.get('name')).toEqualTypeOf<FormControl<string | undefined> | undefined>();

    expectTypeOf(group.value.name).toEqualTypeOf<string | undefined>();
    expectTypeOf(group.value.arr).toEqualTypeOf<string[] | undefined>();
    expectTypeOf(group.value.baz).toEqualTypeOf<string | null>();
    expectTypeOf(group.value.nested).toEqualTypeOf<{ id: string }>();
  })

});
