import { Validators as NgValidators, AbstractControl } from '@angular/forms';
import { ValidatorFn, ValidationErrors, AsyncValidatorFn, NgValidatorsErrors } from './types';

export class Validators extends NgValidators {
  static required(control: AbstractControl) {
    return super.required(control) as ValidationErrors<{ required: NgValidatorsErrors['required'] }> | null;
  }

  static requiredTrue(control: AbstractControl) {
    return super.requiredTrue(control) as ValidationErrors<{ required: NgValidatorsErrors['required'] }> | null;
  }

  static email(control: AbstractControl) {
    return super.email(control) as ValidationErrors<{ email: NgValidatorsErrors['email'] }> | null;
  }

  static min<T = any>(min: number) {
    return super.min(min) as ValidatorFn<T, { min: NgValidatorsErrors['min'] }>;
  }

  static max<T = any>(max: number) {
    return super.max(max) as ValidatorFn<T, { max: NgValidatorsErrors['max'] }>;
  }

  static minLength<T = any>(minLength: number) {
    return super.minLength(minLength) as ValidatorFn<
      T,
      {
        minlength: NgValidatorsErrors['minlength'];
      }
    >;
  }

  static maxLength<T = any>(maxLength: number) {
    return super.maxLength(maxLength) as ValidatorFn<
      T,
      {
        maxlength: NgValidatorsErrors['maxlength'];
      }
    >;
  }

  static pattern<T = any>(pattern: string | RegExp) {
    return super.pattern(pattern) as ValidatorFn<
      T,
      {
        pattern: NgValidatorsErrors['pattern'];
      }
    >;
  }

  static compose(validators: null): null;
  static compose<E extends object = any>(validators: (ValidatorFn | null | undefined)[]): ValidatorFn<E> | null;
  static compose<E extends object = any>(validators: (ValidatorFn | null | undefined)[] | null): ValidatorFn<E> | null {
    return super.compose(validators) as ValidatorFn<E> | null;
  }

  static composeAsync<E extends object = any>(validators: (AsyncValidatorFn | null)[]) {
    return super.composeAsync(validators) as AsyncValidatorFn<E> | null;
  }
}
