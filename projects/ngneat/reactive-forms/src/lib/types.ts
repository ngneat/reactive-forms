import {
  AbstractControl as NgAbstractControl,
  AbstractControlOptions as NgAbstractControlOptions,
  ValidationErrors as NgValidationErrors
} from '@angular/forms';
import { Observable } from 'rxjs';
import { FormArray } from './formArray';
import { FormControl } from './formControl';
import { FormGroup } from './formGroup';

export type ValidationErrors<T = NgValidationErrors> = T;
export type ValidatorFn<T = any, E = any> = (control: AbstractControl<T>) => ValidationErrors<E> | null;
export type AsyncValidatorFn<T = any, E = any> = (
  control: AbstractControl<T>
) => Promise<ValidationErrors<E> | null> | Observable<ValidationErrors<E> | null>;

export interface AbstractControlOptions<T = any, E = any> extends NgAbstractControlOptions {
  validators?: ValidatorFn<T, E> | ValidatorFn<T, E>[] | null;
  asyncValidators?: AsyncValidatorFn<T, E> | AsyncValidatorFn<T, E>[] | null;
}

export type ValidatorOrOpts = ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;
export type AsyncValidator = AsyncValidatorFn | AsyncValidatorFn[] | null;
export type Validator = ValidatorFn | ValidatorFn[];

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

export interface AbstractControl<T = any> extends NgAbstractControl {
  value: T;
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

export type BoxedValue<T> = { value: T; disabled?: boolean };
export type OrBoxedValue<T> = T | BoxedValue<T>;

export type Obj = { [key: string]: any };
type ArrayType<T> = T extends Array<infer R> ? R : any;

export type KeyValueControls<T extends Obj> = {
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

/**
* Convert an object of a FormGroup's "value" or "controls" to its "value"
* */
export type ControlsValue<C extends object> = {
  [key in keyof C]: C[key] extends FormControl | FormGroup | FormArray | AbstractControl ? C[key]['value'] : C[key];
};

/**
 * Convert an object of a FormGroup's "value" or "controls" to "controls".
 * Converting any non-control type to AbstractControl
* */
export type ControlsOfValue<T extends Obj> = {
  [K in keyof T]: T[K] extends FormControl
    ? FormControl<T[K]['value']>
    : T[K] extends FormGroup
      ? FormGroup<T[K]['value']>
      : T[K] extends FormArray
        ? FormArray<T[K]['value']>
        : T[K] extends AbstractControl
          ? AbstractControl<T[K]['value']>
          : AbstractControl<T[K]>
};

/**
 * Use with FormGroup you want a regular FormControl for each property
 *
 * @example
 * new FormGroup<FlatControls<{
 *   name: string;
 *   phone: {
 *      num: number;
 *      prefix: number;
 *   };
 * }>>({
 *   name: new FormControl<string>(),
 *   phone: new FormControl<{num: number, prefix: number}>(),
 * });
 * */
export type FlatControls<T extends Object> = {
  [key in keyof T]: FormControl<T[key]>;
};
