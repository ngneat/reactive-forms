import { of, Subject } from 'rxjs';
import { FormControl } from './formControl';
import { FormGroup } from './formGroup';
import { Validators } from '@angular/forms';
import { NgValidatorsErrors } from './types';
import { FormArray } from './formArray';

type Person = {
  name: string;
  phone: {
    num: number;
    prefix: number;
  };
};

type T = { name: string; street: number; ids: string[] };

const c = new FormGroup<T>({
  name: new FormControl(),
  street: new FormControl(null),
  ids: new FormArray([])
});

const errorFn = group => {
  return { isInvalid: true };
};

const g = new FormGroup<Person, NgValidatorsErrors>({
  name: new FormControl(),
  phone: new FormGroup({
    num: new FormControl(null, Validators.required),
    prefix: new FormControl()
  })
});


g.hasError('required', ['phone', 'num']);
const err = g.getError('maxlength', ['phone', 'prefix']);
const control = g.get(['phone', 'num']);
const control2 = g.get('any');

const createGroup = (withError = false) => {
  return new FormGroup<Person>(
    {
      name: new FormControl(),
      phone: new FormGroup({
        num: new FormControl(),
        prefix: new FormControl()
      })
    },
    { validators: withError ? errorFn : [] }
  );
};

describe('FormGroup', () => {
  it('should valueChanges$', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.valueChanges$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith({ name: null, phone: { num: null, prefix: null } });
    control.patchValue({
      name: 'changed'
    });
    expect(spy).toHaveBeenCalledWith({ name: 'changed', phone: { num: null, prefix: null } });
  });

  it('should disabledChanges$', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.disabledChanges$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(false);
    control.disable();
    expect(spy).toHaveBeenCalledWith(true);
    control.disable();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should enabledChanges$', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.enabledChanges$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(true);
    control.disable();
    expect(spy).toHaveBeenCalledWith(false);
    control.disable();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should statusChanges$', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.statusChanges$.subscribe(spy);
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
        }
      })
    );
    expect(control.value).toEqual({
      name: 'a',
      phone: {
        num: 1,
        prefix: 2
      }
    });

    control.setValue({
      name: 'd',
      phone: {
        num: 1,
        prefix: 2
      }
    });
    expect(control.value).toEqual({
      name: 'd',
      phone: {
        num: 1,
        prefix: 2
      }
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
      }
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
      }
    });

    control.patchValue(state => ({
      ...state,
      name: 'ccc'
    }));

    expect(control.value).toEqual({
      name: 'ccc',
      phone: {
        num: 1,
        prefix: 2
      }
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
    control.touchChanges$.subscribe(spy);
    control.markAsTouched();
    expect(spy).toHaveBeenCalledWith(true);
    control.markAsUntouched();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should markAsPristine/Dirty', () => {
    const control = createGroup();
    const spy = jest.fn();
    control.dirtyChanges$.subscribe(spy);
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
    control.errorChanges$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(null);
    control.patchValue({ name: 'Test' });
    expect(spy).toHaveBeenCalledWith({ invalidName: true });
  });
});
