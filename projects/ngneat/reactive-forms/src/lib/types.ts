import {
  AbstractControl as NgAbstractControl,
  AbstractControlOptions as NgAbstractControlOptions,
  ValidationErrors
} from '@angular/forms';
import { Observable } from 'rxjs';
import { FormArray } from './formArray';
import { FormControl } from './formControl';
import { FormGroup } from './formGroup';

export type ValidatorFn<E extends ValidationErrors = any, T = any> = (control: any) => E | null;
export type AsyncValidatorFn<E extends ValidationErrors = any, T = any> = (
  control: any
) => Promise<E | null> | Observable<E | null>;

export interface AbstractControlOptions<T = any, E extends ValidationErrors = any> extends NgAbstractControlOptions {
  validators?: ValidatorFn<Partial<E>, T> | ValidatorFn<Partial<E>, T>[] | null;
  asyncValidators?: AsyncValidatorFn<Partial<E>, T> | AsyncValidatorFn<Partial<E>, T>[] | null;
}

export interface ControlOptions {
  onlySelf?: boolean;
  emitEvent?: boolean;
  emitModelToViewChange?: boolean;
  emitViewToModelChange?: boolean;
}

export type ControlEventOptions = Pick<ControlOptions, 'emitEvent' | 'onlySelf'>;
export type OnlySelf = Pick<ControlOptions, 'onlySelf'>;
export type EmitEvent = Pick<ControlOptions, 'emitEvent'>;
export type ControlPath = Array<string | number> | string;
export type ControlState = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

export interface AbstractControl<T = any, E extends object = any> extends NgAbstractControl {
  value: T;
  errors: E | null;
}

export type ExtractStrings<T> = Extract<keyof T, string>;

export interface NgValidatorsErrors {
  required: true;
  email: true;
  pattern: { requiredPattern: string; actualValue: string };
  minlength: { requiredLength: number; actualLength: number };
  maxlength: { requiredLength: number; actualLength: number };
  min: { min: number; actual: number };
  max: { max: number; actual: number };
}

export type BoxedValue<T> = { value: T; disabled: boolean };
export type OrBoxedValue<T> = T | BoxedValue<T>;

export type Obj = { [key: string]: any };
type ArrayType<T> = T extends Array<infer R> ? R : any;

export type KeyValueControls<T extends Obj, E = any> = {
  [K in keyof T]: T[K] extends FormControl<T[K]>
    ? FormControl<T[K]>
    : T[K] extends FormGroup<T[K]>
    ? FormGroup<T[K]>
    : T[K] extends FormArray<ArrayType<T[K]>>
    ? FormArray<ArrayType<T[K]>>
    : AbstractControl<T[K]>;
};
export type ExtractAbstractControl<T, U> = T extends KeyValueControls<any>
  ? { [K in keyof U]: AbstractControl<U[K]> }
  : T;
