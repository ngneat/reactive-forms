import { FormGroup } from './form-group';
import { FormControl } from './form-control';
import { FormArray } from './form-array';
import { AbstractControl } from '@angular/forms';

type NonUndefined<T> = T extends undefined ? never : T;

// This type is **Experimental**
export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: NonUndefined<T[K]> extends AbstractControl ? T[K] : NonUndefined<T[K]> extends (infer R)[]
  ? FormArray<R>
  : NonUndefined<T[K]> extends Record<any, any>
  ? FormGroup<ControlsOf<T[K]>>
  : FormControl<T[K]>;
};

export type ValuesOf<T extends ControlsOf<any>> = {
  [K in keyof T]: NonUndefined<T[K]> extends FormControl<infer R>
  ? R
  : NonUndefined<T[K]> extends FormGroup<infer R>
  ? ValuesOf<R>
  : NonUndefined<T[K]> extends FormArray<infer R, infer C>
  ? R extends Record<any, any>
    ? ValuesOf<R>[]
    : R[]
  : NonUndefined<T[K]>;
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<any, any> ? DeepPartial<T[K]> : T[K];
};

export type BoxedValue<T> = T | { value: T; disabled?: boolean };
