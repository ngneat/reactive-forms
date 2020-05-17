import { AbstractControl as AngularAbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

export interface ValidatorFn<T> {
  (control: AbstractControl<T>): ValidationErrors | null;
}

export interface AsyncValidatorFn<T> {
  (control: AbstractControl<T>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
}

export interface ControlOptions {
  onlySelf?: boolean;
  emitEvent?: boolean;
  emitModelToViewChange?: boolean;
  emitViewToModelChange?: boolean;
}

export type LimitedControlOptions = Pick<ControlOptions, 'emitEvent' | 'onlySelf'>;

export interface AbstractControlOptions<T> {
  validators?: ValidatorFn<T> | ValidatorFn<T>[] | null;
  asyncValidators?: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null;
  updateOn?: 'change' | 'blur' | 'submit';
}

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
