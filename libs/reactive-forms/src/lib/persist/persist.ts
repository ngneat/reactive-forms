
import { AbstractControl, UntypedFormArray } from "@angular/forms";
import { from, isObservable, Observable, of } from "rxjs";
import { debounceTime, switchMap, take, tap } from "rxjs/operators";

export interface PersistOptions<T> {
  debounceTime?: number;
  manager?: PersistManager<T>;
  arrControlFactory?: ControlFactoryMap<T>;
  persistDisabledControls?: boolean;
}

export function persistControl<T>(
  control: AbstractControl,
  key: string,
  { debounceTime, manager, arrControlFactory, persistDisabledControls }: PersistOptions<T>
): Observable<unknown> {
  const persistManager = manager || new LocalStorageManager();

  return restoreControl(control, key, persistManager, arrControlFactory).pipe(
    switchMap(() =>
      persistValue$(control, key, {
        debounceTime: debounceTime || 250,
        manager: persistManager,
        persistDisabledControls
      })
    )
  );
}

function persistValue$<T>(control: AbstractControl, key: string, options: PersistOptions<T>): Observable<T> {
  return control.valueChanges.pipe(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    debounceTime(options.debounceTime!),
    switchMap(value =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      wrapIntoObservable(options.manager!.setValue(key, options.persistDisabledControls ? (control as any).getRawValue() : value))
    )
  );
}


export function restoreControl<T>(control: AbstractControl, key: string, manager: PersistManager<T>, arrControlFactory: ControlFactoryMap<T> | undefined): Observable<T> {
  return wrapIntoObservable(manager.getValue(key)).pipe(
    take(1),
    tap(value => {
      if (!value) return;

      if (arrControlFactory) {
        handleFormArrays(control, value, arrControlFactory);
      }

      control.patchValue(value, { emitEvent: false });
    })
  );
}


function handleFormArrays<T>(
  control: AbstractControl,
  formValue: T,
  arrControlFactory: ControlFactoryMap<T>
) {
  Object.keys(formValue).forEach(controlName => {
    const value = (formValue as any)[controlName];

    if (Array.isArray(value) && control.get(controlName) instanceof UntypedFormArray) {
      if (!arrControlFactory || (arrControlFactory && !(controlName in arrControlFactory))) {
        throw new Error(`Please provide arrControlFactory for ${controlName}`);
      }
      const current = control.get(controlName) as UntypedFormArray;
      const fc = (arrControlFactory as any)[controlName]
      clearFormArray(current);
      value.forEach((v, i) => current.insert(i, fc(v)));
    }
  });
}

export function clearFormArray(control: UntypedFormArray) {
  while (control.length !== 0) {
    control.removeAt(0);
  }
}

export function wrapIntoObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
  if (isObservable(value) || isPromise(value)) {
    return from(value);
  }

  return of(value);
}

function isPromise(value: any): value is Promise<unknown> {
  return typeof value?.then === 'function';
}

export type ArrayKeys<T> = { [K in keyof T]: T[K] extends any[] ? K : never }[keyof T];
export type ControlFactory<T> = (value: T) => AbstractControl;
export type ControlFactoryMap<T> = {
  [K in ArrayKeys<T>]?: ControlFactory<ArrayType<T[K]>>;
};
type ArrayType<T> = T extends Array<infer R> ? R : any;


export interface PersistManager<T> {
  setValue(key: string, data: T): T | Promise<T> | Observable<T>;
  getValue(key: string): T | Promise<T> | Observable<T>;
}


export class LocalStorageManager<T> implements PersistManager<T> {
  setValue(key: string, data: T): T {
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }

  getValue(key: string): T {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }
}

export class SessionStorageManager<T> implements PersistManager<T> {
  setValue(key: string, data: T): T {
    sessionStorage.setItem(key, JSON.stringify(data));
    return data;
  }

  getValue(key: string): T {
    return JSON.parse(sessionStorage.getItem(key) || '{}');
  }
}