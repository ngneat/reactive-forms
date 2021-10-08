import { FormGroup } from './form-group';
import { FormControl } from './form-control';
import { FormArray } from './form-array';
import { AbstractControl } from '@angular/forms';

// This type is **Experimental** 
export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends AbstractControl ? T[K] : T[K] extends (infer R)[]
  ? FormArray<R>
  : T[K] extends Record<any, any>
  ? FormGroup<ControlsOf<T[K]>>
  : FormControl<T[K]>;
};

export type ValuesOf<T extends ControlsOf<any>> = {
  [K in keyof T]: T[K] extends FormControl<infer R>
  ? R
  : T[K] extends FormGroup<infer R>
  ? ValuesOf<R>
  : T[K] extends FormArray<infer R> ? R[] : T[K];
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<any, any> ? DeepPartial<T[K]> : T[K];
};

export type BoxedValue<T> = T | { value: T; disabled?: boolean };
