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
    const group: FormGroup<User> = fb.group<User>({ name: 'Dan', id: 1, address: { city: 'Hello' } });
    expect(group.getRawValue()).toEqual({ name: 'Dan', id: 1, address: { city: 'Hello' } });
    expect(group.getControl).toBeDefined();
  });

  it('should control', () => {
    const control: FormControl<string> = fb.control('Hello');
    expect(control.value).toEqual('Hello');
    expect(control.enabledWhile).toBeDefined();
  });

  it('should array', () => {
    const array: FormArray<User> = fb.array<User>([fb.control({ name: 'Hello', id: 1, address: { city: 'Hello' } })]);
    expect(array.getRawValue()).toEqual([
      {
        name: 'Hello',
        id: 1,
        address: { city: 'Hello' }
      }
    ]);
    expect(array.markAllAsDirty).toBeDefined();
  });
});
