import { FormArray } from "../form-array";
import { FormControl } from "../form-control";
import { FormGroup } from "../form-group";
import { diff } from './diff';

describe('FormControl valueChanges$ diff() operator', () => {
  const control = new FormControl<string | null>();
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
  const control = new FormControl<Record<any, any>>();
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

const createGroup = () => {
  return new FormGroup<any>(
    {
      name: new FormControl(),
      phone: new FormGroup({
        num: new FormControl(),
        prefix: new FormControl()
      }),
      skills: new FormArray([])
    },
  );
};

const createArray = (elements: any[]): FormArray<any, any> => {
  const controlList = elements.map(element => new FormControl<any>(element));

  return new FormArray(controlList);
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
    const arrayControl = control.get('skills');
    arrayControl.push(new FormControl('3'));
    expect(spy).toHaveBeenCalledWith({ skills: [null, null, '3'] });
    expect(spy).toHaveBeenCalledTimes(9);
  });

  it('should allow removing value deep from FormArray', () => {
    const arrayControl = control.get('skills');
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
          e: new FormArray<string>([])
        }),
        d: new FormControl()
      })
    });
    deep.value$.pipe(diff()).subscribe(spy);
    const arrayControl = deep
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


describe('FormArray valueChanges$ diff() operator', () => {
  const createArray = () => {
    return new FormArray<string>([new FormControl(''), new FormControl('')]);
  };

  const control = createArray();
  const spy = jest.fn();
  control.value$.pipe(diff()).subscribe(spy);

  it('should be initialized', () => {
    expect(spy).toHaveBeenCalledWith(['', '']);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should filter duplicated calls', () => {
    control.patchValue(['1', '2'] as any);
    expect(spy).toHaveBeenCalledWith(['1', '2']);
    expect(spy).toHaveBeenCalledTimes(2);
    control.patchValue(['1', '2'] as any);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should push new value', () => {
    control.push(new FormControl('3'));
    expect(spy).toHaveBeenCalledWith(['1', '2', '3']);
    expect(spy).toHaveBeenCalledTimes(3);
    control.patchValue(['1', '2', '3'] as any);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should override previous values', () => {
    control.patchValue(['2', '3', '4'] as any);
    expect(spy).toHaveBeenCalledWith(['2', '3', '4']);
    expect(spy).toHaveBeenCalledTimes(4);
  });

  it('should clear control', () => {
    control.removeAt(1);
    expect(spy).toHaveBeenCalledWith(['2', '4']);
    expect(spy).toHaveBeenCalledTimes(5);
    control.removeAt(0);
    expect(spy).toHaveBeenCalledWith(['4']);
    expect(spy).toHaveBeenCalledTimes(6);
    control.removeAt(0);
    expect(spy).toHaveBeenCalledWith([]);
    expect(spy).toHaveBeenCalledTimes(7);
  });

  it('should push empty value', () => {
    control.push(new FormControl(''));
    expect(spy).toHaveBeenCalledWith(['']);
    expect(spy).toHaveBeenCalledTimes(8);
  });
});