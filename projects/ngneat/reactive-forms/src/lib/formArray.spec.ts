import { of, Subject } from 'rxjs';
import { FormArray } from './formArray';
import { FormControl } from './formControl';

const errorFn = group => {
  return { isInvalid: true };
};

const createArray = (withError = false) => {
  return new FormArray<string>([new FormControl(''), new FormControl('')], withError ? errorFn : []);
};

describe('FormArray', () => {
  it('should valueChanges$', () => {
    const control = createArray();
    const spy = jest.fn();
    control.valueChanges$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(['', '']);
    control.patchValue(['1', '2']);
    expect(spy).toHaveBeenCalledWith(['1', '2']);
  });

  it('should disabledChanges$', () => {
    const control = createArray();
    const spy = jest.fn();
    control.disabledChanges$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(false);
    control.disable();
    expect(spy).toHaveBeenCalledWith(true);
    control.disable();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should enabledChanges$', () => {
    const control = createArray();
    const spy = jest.fn();
    control.enabledChanges$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(true);
    control.disable();
    expect(spy).toHaveBeenCalledWith(false);
    control.disable();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should statusChanges$', () => {
    const control = createArray();
    const spy = jest.fn();
    control.statusChanges$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith('VALID');
    control.disable();
    expect(spy).toHaveBeenCalledWith('DISABLED');
  });

  it('should select$', () => {
    const control = createArray();
    const spy = jest.fn();
    control.select(state => state[0]).subscribe(spy);
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
    control.patchValue(state => ['6', '7']);
    expect(control.value).toEqual(['6', '7']);
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
    control.touchChanges$.subscribe(spy);
    control.markAsTouched();
    expect(spy).toHaveBeenCalledWith(true);
    control.markAsUntouched();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should markAsPristine/Dirty', () => {
    const control = createArray();
    const spy = jest.fn();
    control.dirtyChanges$.subscribe(spy);
    control.markAllAsDirty();
    expect(spy).toHaveBeenCalledWith(true);
    control.markAsPristine();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should markAllAsDirty', () => {
    const control = createArray();

    spyOn(control, 'markAsDirty');
    control.markAllAsDirty();
    expect(control.markAsDirty).toHaveBeenCalled();
  });

  it('should reset', () => {
    const control = createArray();

    spyOn(control, 'reset');
    control.reset();
    expect(control.reset).toHaveBeenCalled();
  });

  it('should setValidators', () => {
    const control = createArray();

    spyOn(control, 'setValidators');
    control.setValidators([]);
    expect(control.setValidators).toHaveBeenCalled();
  });

  it('should setAsyncValidators', () => {
    const control = createArray();

    spyOn(control, 'setAsyncValidators');
    control.setAsyncValidators([]);
    expect(control.setAsyncValidators).toHaveBeenCalled();
  });

  it('should validateOn', () => {
    const control = createArray();

    const subject = new Subject<object>();
    control.validateOn(subject);
    subject.next({ someError: true });
    expect(control.errors).toEqual({ someError: true });
    subject.next(null);
    expect(control.errors).toEqual(null);
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
    const validator = (control: FormArray) => (control.length < 4 ? { minimum: 4 } : null);
    control.setValidators(validator);
    control.errorChanges$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith({ minimum: 4 });
    control.push(new FormControl('Name'));
    control.push(new FormControl('Phone'));
    expect(spy).toHaveBeenCalledWith(null);
  });
});
