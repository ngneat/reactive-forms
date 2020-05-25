import { AbstractControl as AngularAbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormGroup } from './formGroup';
import { FormControl } from './formControl';
import { FormArray } from './formArray';

export interface ValidatorFn<T, E extends object = any> {
  (control: AbstractControl<T>): ValidationErrors<E> | null;
}

export interface AsyncValidatorFn<T, E extends object = any> {
  (control: AbstractControl<T>): Promise<ValidationErrors<E> | null> | Observable<ValidationErrors<E> | null>;
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

export interface AbstractControlOptions<T, E extends object = any> {
  validators?: ValidatorFn<T, Partial<E>> | ValidatorFn<T, Partial<E>>[] | null;
  asyncValidators?: AsyncValidatorFn<T, Partial<E>> | AsyncValidatorFn<T, Partial<E>>[] | null;
  updateOn?: 'change' | 'blur' | 'submit';
}

export type ControlPath = Array<string | number> | string;

export type ControlState = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

export interface AbstractControl<T> extends AngularAbstractControl {
  value: T;
  validator: ValidatorFn<T> | null;
  asyncValidator: AsyncValidatorFn<T> | null;

  setValue(value: T, options?: ControlOptions): void;

  patchValue(value: Partial<T>, options?: ControlOptions): void;

  setValidators(newValidator: ValidatorFn<T> | ValidatorFn<T>[] | null): void;

  setAsyncValidators(newValidator: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null): void;
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
export type ValidationErrors<T extends object = any> = T;

const uniqueKey = Symbol();
interface UniqToken {
  [uniqueKey]: never;
}
type ExtractAny<T> = T extends Extract<T, string & number & boolean & object & null & undefined> ? any : never;
export type Control<T extends object> = T & UniqToken;

export type ControlType<T> = [T] extends [ExtractAny<T>]
  ? FormControl<any> | FormGroup<any> | FormArray<any>
  : [T] extends [Control<infer Type>]
  ? FormControl<Type>
  : [T] extends [Array<infer ItemType>]
  ? FormArray<ItemType>
  : [T] extends [object]
  ? FormGroup<T>
  : FormControl<T>;
