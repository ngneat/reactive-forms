import { fakeAsync, tick } from '@angular/core/testing';
import { of, Subject, Observable, timer, isObservable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormControl, FormGroup, FormArray, diff } from '@ngneat/reactive-forms';
import { AbstractControlOf } from '@ngneat/reactive-forms/lib/types';

/* Supporting functions from utils */
function isPromise(value: any): value is Promise<unknown> {
  return typeof value?.then === 'function';
}

function wrapIntoObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
  if (isObservable(value) || isPromise(value)) {
    return from(value);
  }
  return of(value);
}
/* END */

type Person = {
  name: string;
  phone: {
    num: number;
    prefix: number;
  };
  skills: string[];
};

const errorFn = group => {
  return { isInvalid: true };
};

const createGroup = (withError = false) => {
  return new FormGroup<Person>(
    {
      name: new FormControl(),
      phone: new FormGroup({
        num: new FormControl(),
        prefix: new FormControl()
      }),
      skills: new FormArray([])
    },
    { validators: withError ? errorFn : [] }
  );
};

const createArray = <T>(elements: T[], withError = false): FormArray<T> => {
  const controlList = elements.map(element => new FormControl<T>(element)) as Array<AbstractControlOf<T>>;
  return new FormArray<T>(controlList, withError ? errorFn : []);
};

describe('FormGroup valueChanges$ diff() operator', () => {
  const control = createGroup();
  const spy = jest.fn();
  control.value$.pipe(diff()).subscribe(spy);

  it('should be initialized', () => {
    expect(spy).toHaveBeenCalledWith({ name: null, phone: { num: null, prefix: null }, skills: [] });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should filter duplicated calls', () => {
    control.patchValue({ name: 'changed' });
    expect(spy).toHaveBeenCalledWith({ name: 'changed' });
    expect(spy).toHaveBeenCalledTimes(2);
    control.patchValue({ name: 'changed' });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should allow deep FormGroup duplicated calls filtering', () => {
    control.patchValue({ phone: { num: 1, prefix: 1 } });
    expect(spy).toHaveBeenCalledWith({ phone: { num: 1, prefix: 1 } });
    expect(spy).toHaveBeenCalledTimes(3);
    control.patchValue({ phone: { num: 1, prefix: 1 } });
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should allow deep FormArray duplicated calls filtering', () => {
    control.setControl('skills', createArray(['driving']));
    expect(spy).toHaveBeenCalledWith({ skills: ['driving'] });
    expect(spy).toHaveBeenCalledTimes(4);
    control.setControl('skills', createArray(['driving']));
    expect(spy).toHaveBeenCalledTimes(4);
  });

  it('should allow deep FormArray of numbers duplicated calls filtering', () => {
    control.setControl('skills', createArray([1, 2] as any));
    expect(spy).toHaveBeenCalledWith({ skills: [1, 2] });
    expect(spy).toHaveBeenCalledTimes(5);
    control.setControl('skills', createArray([1, 2] as any));
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it('should allow deep FormControl null value use', () => {
    control.patchValue({ name: null });
    expect(spy).toHaveBeenCalledWith({ name: null });
    expect(spy).toHaveBeenCalledTimes(6);
  });

  it('should allow deep FormArray of null values use', () => {
    control.setControl('skills', createArray([null, null]));
    expect(spy).toHaveBeenCalledWith({ skills: [null, null] });
    expect(spy).toHaveBeenCalledTimes(7);
  });

  it('should allow deep FormGroup null value use', () => {
    control.patchValue({ phone: { num: null } });
    expect(spy).toHaveBeenCalledWith({ phone: { num: null } });
    expect(spy).toHaveBeenCalledTimes(8);
  });

  it('should allow push new value deep in to FormArray', () => {
    const arrayControl = <FormArray>control.get('skills');
    arrayControl.push(new FormControl('3'));
    expect(spy).toHaveBeenCalledWith({ skills: [null, null, '3'] });
    expect(spy).toHaveBeenCalledTimes(9);
  });

  it('should allow removing value deep from FormArray', () => {
    const arrayControl = <FormArray>control.get('skills');
    arrayControl.removeAt(0);
    expect(spy).toHaveBeenCalledWith({ skills: [null, '3'] });
    expect(spy).toHaveBeenCalledTimes(10);
  });

  it('should perform advanced/deep form input', () => {
    const group = new FormGroup({
      a: new FormControl(),
      b: new FormGroup({
        c: new FormControl(),
        d: new FormControl()
      }),
      e: new FormGroup({
        f: new FormControl(),
        g: new FormControl()
      })
    });
    group.value$.pipe(diff()).subscribe(spy);
    group.patchValue({
      b: {
        c: 'new'
      },
      e: {
        g: 'new'
      }
    });
    expect(spy).toHaveBeenCalledWith({
      b: {
        c: 'new'
      },
      e: {
        g: 'new'
      }
    });
    expect(spy).toHaveBeenCalledTimes(12);
  });

  it('should perform advanced/deep form input with special form type', () => {
    const deep = new FormGroup({
      a: new FormControl(),
      b: new FormGroup({
        c: new FormGroup({
          e: new FormArray([])
        }),
        d: new FormControl()
      })
    });
    deep.value$.pipe(diff()).subscribe(spy);
    const arrayControl = <FormArray>deep
      .get('b')
      .get('c')
      .get('e');
    arrayControl.push(new FormControl('3'));
    expect(spy).toHaveBeenCalledWith({
      b: {
        c: {
          e: ['3']
        }
      }
    });
    expect(spy).toHaveBeenCalledTimes(14);
  });
});

describe('FormGroup', () => {
  it('should valueChanges$', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.value$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith({ name: null, phone: { num: null, prefix: null }, skills: [] });
    control.patchValue({
      name: 'changed'
    });
    expect(spy).toHaveBeenCalledWith({ name: 'changed', phone: { num: null, prefix: null }, skills: [] });
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
    expect(spy).toHaveBeenCalledWith('VALID');
    control.disable();
    expect(spy).toHaveBeenCalledWith('DISABLED');
  });

  it('should select$', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.select(state => state.name).subscribe(spy);
    expect(spy).toHaveBeenCalledWith(null);
    control.patchValue({
      name: 'changed'
    });
    expect(spy).toHaveBeenCalledWith('changed');
    control.patchValue({
      name: 'changed'
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
          prefix: 2
        },
        skills: []
      })
    );
    expect(control.value).toEqual({
      name: 'a',
      phone: {
        num: 1,
        prefix: 2
      },
      skills: []
    });

    control.setValue({
      name: 'd',
      phone: {
        num: 1,
        prefix: 2
      },
      skills: []
    });
    expect(control.value).toEqual({
      name: 'd',
      phone: {
        num: 1,
        prefix: 2
      },
      skills: []
    });
  });

  it('should patchValue', () => {
    const control = createGroup();

    control.patchValue(
      of({
        name: 'patched'
      })
    );

    expect(control.value).toEqual({
      name: 'patched',
      phone: {
        num: null,
        prefix: null
      },
      skills: []
    });

    control.patchValue({
      name: 'dd',
      phone: {
        num: 1,
        prefix: 2
      }
    });

    expect(control.value).toEqual({
      name: 'dd',
      phone: {
        num: 1,
        prefix: 2
      },
      skills: []
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

  it('should markAsPristine/Dirty', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.dirty$.subscribe(spy);
    control.markAllAsDirty();
    expect(spy).toHaveBeenCalledWith(true);
    control.markAsPristine();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should markAllAsDirty', () => {
    const control = createGroup();
    spyOn(control, 'markAsDirty');
    control.markAllAsDirty();
    expect(control.markAsDirty).toHaveBeenCalled();
  });

  it('should reset', () => {
    const control = createGroup();
    spyOn(control, 'reset');
    control.reset();
    expect(control.reset).toHaveBeenCalled();
  });

  it('should setErrors', () => {
    const control = createGroup(true);
    control.setErrors({ customError: true });
    expect(control.errors).toEqual({ customError: true });
  });

  it('should mergeErrors', () => {
    const control = createGroup(true);
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
    spyOn(control, 'setValidators');
    control.setValidators([]);
    expect(control.setValidators).toHaveBeenCalled();
  });

  it('should setAsyncValidators', () => {
    const control = createGroup();
    spyOn(control, 'setAsyncValidators');
    control.setAsyncValidators([]);
    expect(control.setAsyncValidators).toHaveBeenCalled();
  });

  it('should validateOn', () => {
    const control = createGroup();
    const subject = new Subject<object>();
    control.validateOn(subject);
    subject.next({ someError: true });
    expect(control.errors).toEqual({ someError: true });
    subject.next(null);
    expect(control.errors).toEqual(null);
  });

  it('should hasErrorAndTouched', () => {
    const control = createGroup(true);
    expect(control.hasErrorAndTouched('isInvalid')).toBeFalsy();
    control.markAsTouched();
    expect(control.hasErrorAndTouched('isInvalid')).toBeTruthy();
  });

  it('should hasErrorAndDirty', () => {
    const control = createGroup(true);
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
    const nameControl = control.getControl('name');
    expect(nameControl).toBeInstanceOf(FormControl);
    const numControl = control.getControl('phone', 'num');
    expect(numControl).toBeInstanceOf(FormControl);
  });

  it('should errorChanges$', () => {
    const control = createGroup();
    const validator = (control: FormGroup<Person>) =>
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

  describe('.persist()', () => {
    const person: Person = { name: 'ewan', phone: { num: 5550153, prefix: 288 }, skills: ['acting', 'motorcycle'] };

    it.each([[0], [300], [500]])(
      'should persist without disabled controls',
      fakeAsync((tickMs: number) => {
        const control = createGroup();
        control.getControl('skills').disable();
        const debounceTime = 50;
        const persistManager = {
          getValue: jest.fn(),
          setValue: jest.fn((key, value) => {
            return tickMs ? timer(tickMs).pipe(switchMap(() => of(value))) : value;
          })
        };
        let persistValue: Person;
        control.persist('key', { debounceTime, manager: persistManager }).subscribe(value => (persistValue = value));
        control.getControl('name').setValue('ewan');
        tick(debounceTime);
        control.getControl('name').setValue('ewan mc');
        tick(debounceTime);
        expect(persistManager.setValue).toHaveBeenCalledTimes(2);
        expect(persistManager.setValue).toHaveBeenLastCalledWith('key', control.value);
        expect(persistManager.setValue).not.toHaveBeenLastCalledWith('key', control.getRawValue());
        if (tickMs) {
          expect(persistValue).toBeFalsy();
          tick(tickMs);
          expect(persistValue.name).toEqual('ewan mc');
          expect(persistValue.skills).toEqual(undefined);
        }
      })
    );

    it.each([[0], [300], [500]])(
      'should persist with disabled controls',
      fakeAsync((tickMs: number) => {
        const control = createGroup();
        control.getControl('skills').disable();
        const debounceTime = 50;
        const persistManager = {
          getValue: jest.fn(),
          setValue: jest.fn((key, value) => {
            return tickMs ? timer(tickMs).pipe(switchMap(() => of(value))) : value;
          })
        };
        let persistValue: Person;
        control
          .persist('key', { debounceTime, manager: persistManager, persistDisabledControls: true })
          .subscribe(value => (persistValue = value));
        control.getControl('name').setValue('ewan');
        tick(debounceTime);
        control.getControl('name').setValue('ewan mc');
        tick(debounceTime);
        expect(persistManager.setValue).toHaveBeenCalledTimes(2);
        expect(persistManager.setValue).not.toHaveBeenLastCalledWith('key', control.value);
        expect(persistManager.setValue).toHaveBeenLastCalledWith('key', control.getRawValue());
        if (tickMs) {
          expect(persistValue).toBeFalsy();
          tick(tickMs);
          expect(persistValue.name).toEqual('ewan mc');
          expect(persistValue.skills).toEqual([]);
        }
      })
    );

    it.each([
      [person, 0],
      [Promise.resolve(person), 300],
      [of(person), 500]
    ])(
      'should restore',
      fakeAsync((value: Person | Promise<Person> | Observable<Person>, tickMs: number) => {
        const control = createGroup();
        const arrFactorySpy = jest.fn(value => new FormControl(value));
        const persistManager = {
          getValue: jest.fn<any, never>(() => {
            return tickMs ? timer(tickMs).pipe(switchMap(() => wrapIntoObservable(value))) : value;
          }),
          setValue: jest.fn()
        };
        control
          .persist('key', {
            manager: persistManager,
            arrControlFactory: { skills: arrFactorySpy }
          })
          .subscribe();
        expect(persistManager.getValue).toHaveBeenCalledWith('key');
        if (tickMs) {
          expect(control.value).not.toEqual(person);
          tick(tickMs);
          expect(control.value).toEqual(person);
        }
        expect(arrFactorySpy).toHaveBeenCalledTimes(2);
        expect(control.getControl('skills')).toHaveLength(2);
      })
    );
  });
});
