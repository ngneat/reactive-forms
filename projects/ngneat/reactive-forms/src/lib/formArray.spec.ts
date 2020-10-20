import { of, Subject } from 'rxjs';
import { FormArray } from './formArray';
import { FormControl } from './formControl';
import { FormGroup } from '@angular/forms';

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
    control.value$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(['', '']);
    control.patchValue(['1', '2']);
    expect(spy).toHaveBeenCalledWith(['1', '2']);
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
    const validator = (control: FormArray) => (control.length < 4 ? { minimum: 4 } : null);
    control.setValidators(validator);
    control.errors$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith({ minimum: 4 });
    spy.mockReset();
    control.push(new FormControl('Name'));
    control.push(new FormControl('Phone'));
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
    control.removeWhen(elt => elt.value.match(/Name$/) != null);
    expect(control.getRawValue()).toEqual(['Phone', 'StreetNumber', 'ZipCode']);
  });

  it('should removeIf with nested form groups', () => {
    const control = new FormArray([]);
    control.clear();
    control.push(new FormGroup({ type: new FormControl('Jedi'), name: new FormControl('Luke') }));
    control.push(new FormGroup({ type: new FormControl('Sith'), name: new FormControl('Vader') }));
    control.push(new FormGroup({ type: new FormControl('Jedi'), name: new FormControl('Yoda') }));
    control.push(new FormGroup({ type: new FormControl('Jedi'), name: new FormControl('Obi-Wan') }));
    control.push(new FormGroup({ type: new FormControl('Sith'), name: new FormControl('Doku') }));
    control.push(new FormGroup({ type: new FormControl('Jedi'), name: new FormControl('Windu') }));
    control.push(new FormGroup({ type: new FormControl('Sith'), name: new FormControl('Palpatine') }));
    control.removeWhen(elt => elt.get('type').value === 'Sith');
    expect(control.getRawValue()).toEqual([
      { type: 'Jedi', name: 'Luke' },
      { type: 'Jedi', name: 'Yoda' },
      { type: 'Jedi', name: 'Obi-Wan' },
      { type: 'Jedi', name: 'Windu' }
    ]);
  });
});
