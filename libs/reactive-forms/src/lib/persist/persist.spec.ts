
import { timer, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { fakeAsync, tick } from '@angular/core/testing';
import { FormGroup } from '../form-group';
import { FormArray } from "../form-array";
import { persistControl, wrapIntoObservable } from './persist';
import { FormControl } from "../form-control";

const createGroup = () => {
  return new FormGroup(
    {
      name: new FormControl(),
      phone: new FormGroup({
        num: new FormControl(),
        prefix: new FormControl()
      }),
      skills: new FormArray([])
    }
  );
};

describe('.persist()', () => {
  const person: any = { name: 'ewan', phone: { num: 5550153, prefix: 288 }, skills: ['acting', 'motorcycle'] };

  it.each([[0], [300], [500]])(
    'should persist without disabled controls',
    fakeAsync((tickMs: number) => {
      const control = createGroup();
      control.get('skills').disable();
      const debounceTime = 50;
      const persistManager = {
        getValue: jest.fn(),
        setValue: jest.fn((key, value) => {
          return tickMs ? timer(tickMs).pipe(switchMap(() => of(value))) : value;
        })
      };
      let persistValue: any;

      persistControl(control, 'key', { debounceTime, manager: persistManager }).subscribe(value => (persistValue = value));
      control.get('name').setValue('ewan');
      tick(debounceTime);
      control.get('name').setValue('ewan mc');
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
      control.get('skills').disable();
      const debounceTime = 50;
      const persistManager = {
        getValue: jest.fn(),
        setValue: jest.fn((key, value) => {
          return tickMs ? timer(tickMs).pipe(switchMap(() => of(value))) : value;
        })
      };
      let persistValue: any;
      persistControl(control, 'key', { debounceTime, manager: persistManager, persistDisabledControls: true })
        .subscribe(value => (persistValue = value));
      control.get('name').setValue('ewan');
      tick(debounceTime);
      control.get('name').setValue('ewan mc');
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
    fakeAsync((value: any, tickMs: number) => {
      const control = createGroup();
      const arrFactorySpy = jest.fn(value => new FormControl(value));
      const persistManager = {
        getValue: jest.fn<any, never>(() => {
          return tickMs ? timer(tickMs).pipe(switchMap(() => wrapIntoObservable(value))) : value;
        }),
        setValue: jest.fn()
      };
      persistControl(control, 'key', {
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
      expect(control.get('skills')).toHaveLength(2);
    })
  );
});