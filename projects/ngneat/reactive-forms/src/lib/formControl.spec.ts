import { of, Subject } from 'rxjs';
import { FormControl } from './formControl';
import { NgValidatorsErrors } from './types';
import { Validators } from '@angular/forms';
import { diff } from './operators/diff';

const validatorExample = new FormControl<string, NgValidatorsErrors>('', {
  validators(control: FormControl<string>) {
    return {
      maxlength: {
        actualLength: 2,
        requiredLength: 3
      }
    };
  }
});

describe('FormControl valueChanges$ diff() operator', () => {
  const control = new FormControl<string>();
  const spy = jest.fn();
  control.value$.pipe(diff()).subscribe(spy);

  it('should be initialized', () => {
    expect(spy).toHaveBeenCalledWith(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should filter duplicated calls', () => {
    control.patchValue('patched');
    expect(spy).toHaveBeenCalledWith('patched');
    expect(spy).toHaveBeenCalledTimes(2);
    control.patchValue('patched');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should push new value', () => {
    control.patchValue('updated');
    expect(spy).toHaveBeenCalledWith('updated');
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should push null value', () => {
    control.patchValue(null);
    expect(spy).toHaveBeenCalledWith(null);
    expect(spy).toHaveBeenCalledTimes(4);
  });

  it('should push empty value', () => {
    control.patchValue('');
    expect(spy).toHaveBeenCalledWith('');
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it('should push number value', () => {
    control.patchValue('0');
    expect(spy).toHaveBeenCalledWith('0');
    expect(spy).toHaveBeenCalledTimes(6);
  });
});

describe('FormControl valueChanges$ diff() operator Array input', () => {
  const control = new FormControl<(string | number)[]>();
  const spy = jest.fn();
  control.value$.pipe(diff()).subscribe(spy);

  it('should be initialized', () => {
    expect(spy).toHaveBeenCalledWith(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should push array of strings', () => {
    control.patchValue(['1', '2', '3']);
    expect(spy).toHaveBeenCalledWith(['1', '2', '3']);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should push array of numbers', () => {
    control.patchValue([1, 2, 3]);
    expect(spy).toHaveBeenCalledWith([1, 2, 3]);
    expect(spy).toHaveBeenCalledTimes(3);
  });
});

describe('FormControl valueChanges$ diff() operator Object input', () => {
  const control = new FormControl<object>();
  const spy = jest.fn();
  control.value$.pipe(diff()).subscribe(spy);

  it('should be initialized', () => {
    expect(spy).toHaveBeenCalledWith(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should push object', () => {
    control.patchValue({ a: 1, b: 2 });
    expect(spy).toHaveBeenCalledWith({ a: 1, b: 2 });
    expect(spy).toHaveBeenCalledTimes(2);
  });
});

describe('FormControl', () => {
  it('should valueChanges$', () => {
    const control = new FormControl<string>();
    const spy = jest.fn();
    control.value$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(null);
    control.patchValue('patched');
    expect(spy).toHaveBeenCalledWith('patched');
  });

  it('should disabledChanges$', () => {
    const control = new FormControl<string>();
    const spy = jest.fn();
    control.disabled$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(false);
    control.disable();
    expect(spy).toHaveBeenCalledWith(true);
    control.disable();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should enabledChanges$', () => {
    const control = new FormControl<string>();
    const spy = jest.fn();
    control.enabled$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(true);
    control.disable();
    expect(spy).toHaveBeenCalledWith(false);
    control.disable();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should statusChanges$', () => {
    const control = new FormControl<string>();
    const spy = jest.fn();
    control.status$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith('VALID');
    control.disable();
    expect(spy).toHaveBeenCalledWith('DISABLED');
  });

  it('should setValue', () => {
    const control = new FormControl<string>();

    control.setValue(of('value'));
    expect(control.value).toEqual('value');

    control.setValue('new value');
    expect(control.value).toEqual('new value');
  });

  it('should patchValue', () => {
    const control = new FormControl<string>();

    control.patchValue(of('value'));
    expect(control.value).toEqual('value');

    control.patchValue('new value');
    expect(control.value).toEqual('new value');
  });

  it('should disabledWhile', () => {
    const control = new FormControl<string>();
    const subject = new Subject<boolean>();
    control.disabledWhile(subject);
    expect(control.disabled).toBeFalsy();
    subject.next(true);
    expect(control.disabled).toBeTruthy();
    subject.next(false);
    expect(control.disabled).toBeFalsy();
  });

  it('should enableWhile', () => {
    const control = new FormControl<string>();
    const subject = new Subject<boolean>();
    control.enabledWhile(subject);
    expect(control.enabled).toBeTruthy();
    subject.next(false);
    expect(control.enabled).toBeFalsy();
    subject.next(true);
    expect(control.enabled).toBeTruthy();
  });

  it('should mergeValidators', () => {
    const control = new FormControl<string>('', Validators.required);
    expect(control.errors).toEqual({ required: true });
    control.mergeValidators(Validators.minLength(2));
    expect(control.errors).toEqual({ required: true });
    control.patchValue('a');
    expect(control.errors).toEqual({
      minlength: {
        actualLength: 1,
        requiredLength: 2
      }
    });
  });

  it('should markAsTouched/Untouched', () => {
    const control = new FormControl<string>();
    const spy = jest.fn();
    control.touch$.subscribe(spy);
    control.markAsTouched();
    expect(spy).toHaveBeenCalledWith(true);
    control.markAsUntouched();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should markAsPristine/Dirty', () => {
    const control = new FormControl<string>();
    const spy = jest.fn();
    control.dirty$.subscribe(spy);
    control.markAllAsDirty();
    expect(spy).toHaveBeenCalledWith(true);
    control.markAsPristine();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should markAllAsDirty', () => {
    const control = new FormControl<string>();
    jest.spyOn(control, 'markAsDirty');
    control.markAllAsDirty();
    expect(control.markAsDirty).toHaveBeenCalled();
  });

  it('should reset', () => {
    const control = new FormControl<string>();
    jest.spyOn(control, 'reset');
    control.reset();
    expect(control.reset).toHaveBeenCalled();
  });

  it('should setValidators', () => {
    const control = new FormControl<string>();
    jest.spyOn(control, 'setValidators');
    control.setValidators([]);
    expect(control.setValidators).toHaveBeenCalled();
  });

  it('should setAsyncValidators', () => {
    const control = new FormControl<string>();
    jest.spyOn(control, 'setAsyncValidators');
    control.setAsyncValidators([]);
    expect(control.setAsyncValidators).toHaveBeenCalled();
  });

  it('should validateOn', () => {
    const control = new FormControl<string>();
    const subject = new Subject<object>();
    control.validateOn(subject);
    subject.next({ someError: true });
    expect(control.errors).toEqual({ someError: true });
    subject.next(null);
    expect(control.errors).toEqual(null);
  });

  it('should hasErrorAndTouched', () => {
    const control = new FormControl<string>('', Validators.required);
    expect(control.hasErrorAndTouched('required')).toBeFalsy();
    control.markAsTouched();
    expect(control.hasErrorAndTouched('required')).toBeTruthy();
  });

  it('should hasErrorAndDirty', () => {
    const control = new FormControl<string>('', Validators.required);
    expect(control.hasErrorAndDirty('required')).toBeFalsy();
    control.markAsDirty();
    expect(control.hasErrorAndDirty('required')).toBeTruthy();
  });

  it('should setEnable', () => {
    const control = new FormControl<string>();
    control.setEnable();
    expect(control.enabled).toBe(true);
    control.setEnable(false);
    expect(control.enabled).toBe(false);
  });

  it('should setErrors', () => {
    const control = new FormControl<string>('', Validators.required);
    control.setErrors({ customError: true });
    expect(control.errors).toEqual({ customError: true });
  });

  it('should mergeErrors with previous errors', () => {
    const control = new FormControl<string>('', Validators.required);
    control.mergeErrors({ customError: true });
    expect(control.errors).toEqual({ required: true, customError: true });
  });

  it('should mergeErrors when no previous errors', () => {
    const control = new FormControl<string>('');
    control.mergeErrors({ customError: true });
    expect(control.errors).toEqual({ customError: true });
  });

  it('should mergeErrors when no previous errors and null is given', () => {
    const control = new FormControl<string>('');
    control.mergeErrors(null);
    expect(control.errors).toEqual(null);
  });

  it('should removeError correctly with two existing errors', () => {
    const control = new FormControl<string>('');
    control.setErrors({ customError: true, otherError: true });
    control.removeError('otherError');
    expect(control.errors).toEqual({ customError: true });
  });

  it('should removeError correctly last error', () => {
    const control = new FormControl<string>('');
    control.setErrors({ customError: true });
    control.removeError('customError');
    expect(control.errors).toEqual(null);
  });

  it('should removeError with not existing errors', () => {
    const control = new FormControl<string>('');
    control.setErrors({ customError: true });
    control.removeError('notExisting');
    expect(control.errors).toEqual({ customError: true });
  });

  it('should setDisable', () => {
    const control = new FormControl<string>();
    control.setDisable();
    expect(control.enabled).toBe(false);
    control.setDisable(false);
    expect(control.enabled).toBe(true);
  });

  it('should errorChanges$', () => {
    const control = new FormControl<string>(null, Validators.required);
    const spy = jest.fn();
    control.errors$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith({ required: true });
    spy.mockReset();
    control.patchValue(null);
    control.patchValue('');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockReset();
    control.patchValue('Test');
    expect(spy).toHaveBeenCalledWith(null);
    spy.mockReset();

    control.setErrors({ myError: 'So wrong' });
    expect(spy).toHaveBeenCalledWith({ myError: 'So wrong' });
  });
});
