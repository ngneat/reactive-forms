import { Validators } from '@angular/forms';
import { FormArray } from './formArray';
import { FormBuilder } from './formBuilder';
import { FormControl } from './formControl';
import { FormGroup } from './formGroup';

interface User {
  id: number;
  name: string;
  address: {
    city: string;
  };
}

describe('FormBuilder', () => {
  const fb = new FormBuilder();

  describe('group', () => {
    it('should accept an object', () => {
      const group: FormGroup<User> = fb.group({ name: 'ngneat', id: 1, address: { city: 'Hello' } });
      expect(group.getRawValue()).toEqual({ name: 'ngneat', id: 1, address: { city: 'Hello' } });
    });

    it('should accept boxed value', () => {
      const group: FormGroup<User> = fb.group({
        name: ['ngneat', Validators.required],
        id: [1],
        address: [{ value: { city: 'Hello' }, disabled: false }]
      });
      expect(group.getRawValue()).toEqual({ name: 'ngneat', id: 1, address: { city: 'Hello' } });
    });

    it('should have extended keys', () => {
      const group: FormGroup<User> = fb.group({ name: 'ngneat', id: 1, address: { city: 'Hello' } });
      const keys: (keyof FormGroup)[] = [
        'getControl',
        'enabledWhile',
        'disabledWhile',
        'touch$',
        'dirty$',
        'value$',
        'disabled$',
        'enabled$',
        'status$',
        'errors$',
        'select',
        'disabledWhile',
        'enabledWhile',
        'mergeValidators',
        'mergeAsyncValidators',
        'markAllAsDirty',
        'validateOn',
        'hasErrorAndTouched',
        'hasErrorAndDirty',
        'setEnable',
        'setDisable'
      ];

      keys.forEach(key => expect(group[key]).toBeDefined());
    });
  });

  it('should control', () => {
    const control = fb.control('ngneat');
    expect(control.value).toEqual('ngneat');

    const keys: (keyof FormControl)[] = [
      'enabledWhile',
      'disabledWhile',
      'touch$',
      'dirty$',
      'value$',
      'disabled$',
      'enabled$',
      'status$',
      'errors$',
      'select',
      'disabledWhile',
      'enabledWhile',
      'mergeValidators',
      'mergeAsyncValidators',
      'markAllAsDirty',
      'validateOn',
      'hasErrorAndTouched',
      'hasErrorAndDirty',
      'setEnable',
      'setDisable'
    ];
    keys.forEach(key => expect(control[key]).toBeDefined());
  });

  it('should array', () => {
    const array: FormArray<User> = fb.array([fb.control({ name: 'ngneat', id: 1, address: { city: 'ngneat' } })]);
    expect(array.getRawValue()).toEqual([
      {
        name: 'ngneat',
        id: 1,
        address: { city: 'ngneat' }
      }
    ]);

    const keys: (keyof FormArray)[] = [
      'enabledWhile',
      'disabledWhile',
      'touch$',
      'dirty$',
      'value$',
      'disabledChanges$',
      'enabledChanges$',
      'statusChanges$',
      'errorChanges$',
      'select',
      'disabledWhile',
      'enabledWhile',
      'mergeValidators',
      'mergeAsyncValidators',
      'markAllAsDirty',
      'validateOn',
      'hasErrorAndTouched',
      'hasErrorAndDirty',
      'setEnable',
      'setDisable'
    ];
    keys.forEach(key => expect(array[key]).toBeDefined());
  });
});
