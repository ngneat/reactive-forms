import { Validators } from '@angular/forms';
import { expectTypeOf } from 'expect-type';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { ControlState } from './core';
import { FormControl } from './form-control';

describe('FormControl Functionality', () => {
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

  it('should markAsTouched/Untouched', () => {
    const control = new FormControl<string>();
    const spy = jest.fn();
    control.touch$.subscribe(spy);
    control.markAsTouched();
    expect(spy).toHaveBeenCalledWith(true);
    control.markAsUntouched();
    expect(spy).toHaveBeenCalledWith(false);
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
    const control = new FormControl<string>('', Validators.required);
    const spy = jest.fn();

    control.errors$.subscribe(spy);

    expect(spy).toHaveBeenCalledWith({ required: true });

    control.patchValue('foo');
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(null);

    control.patchValue('');
    expect(spy).toHaveBeenCalledWith({ required: true });

    control.setErrors({ myError: 'So wrong' });
    expect(spy).toHaveBeenCalledWith({ myError: 'So wrong' });
  });
});

describe('FormControl Types', () => {
  it('should infer basic', () => {
    const control = new FormControl('');

    expectTypeOf(control.value).toEqualTypeOf<string>();
    expectTypeOf(control.valueChanges).toEqualTypeOf<Observable<string>>();
    expectTypeOf(control.value$).toEqualTypeOf<Observable<string>>();

    expectTypeOf(control.disabled$).toEqualTypeOf<Observable<boolean>>();
    expectTypeOf(control.enabled$).toEqualTypeOf<Observable<boolean>>();
    expectTypeOf(control.status$).toEqualTypeOf<Observable<ControlState>>();

    // @ts-expect-error - should be typed
    control.reset(1);
  });

  it('should infer setValue', () => {
    const control = new FormControl('');

    control.setValue('foo');

    const sub = control.setValue(of('foo'));
    expectTypeOf(sub).toEqualTypeOf<Subscription>();

    try {
      // @ts-expect-error - should be typed
      control.setValue(of(1));

      // @ts-expect-error - should be typed
      control.setValue(1);

      // @ts-expect-error - should be typed
      control.setValue(of(1000));
    } catch {
      //
    }
  });

  it('should infer patchValue', () => {
    const control = new FormControl('');

    control.patchValue('foo');

    const sub = control.patchValue(of('foo'));
    expectTypeOf(sub).toEqualTypeOf<Subscription>();

    sub.unsubscribe();

    control.patchValue('foo');
    const subtwo = control.patchValue(of('foo'));
    subtwo.unsubscribe();

    try {
      // @ts-expect-error - should be typed
      control.patchValue(null);

      // @ts-expect-error - should be typed
      group.patchValue(of(1000));
    } catch {
      //
    }
  });

  it('should infer getRawValue', () => {
    const control = new FormControl('');

    expectTypeOf(control.getRawValue()).toEqualTypeOf<string>();
  });
});
