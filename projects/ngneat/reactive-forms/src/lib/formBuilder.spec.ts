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

  it('should group', () => {
    const group: FormGroup<User> = fb.group({ name: 'ngneat', id: 1, address: { city: 'Hello' } });
    expect(group.getRawValue()).toEqual({ name: 'ngneat', id: 1, address: { city: 'Hello' } });

    const keys: (keyof FormGroup)[] = [
      'getControl',
      'enabledWhile',
      'disabledWhile',
      'touchChanges$',
      'dirtyChanges$',
      'valueChanges$',
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

    keys.forEach(key => expect(group[key]).toBeDefined());
  });

  it('should control', () => {
    const control = fb.control('ngneat');
    expect(control.value).toEqual('ngneat');

    const keys: (keyof FormControl)[] = [
      'enabledWhile',
      'disabledWhile',
      'touchChanges$',
      'dirtyChanges$',
      'valueChanges$',
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
      'touchChanges$',
      'dirtyChanges$',
      'valueChanges$',
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
