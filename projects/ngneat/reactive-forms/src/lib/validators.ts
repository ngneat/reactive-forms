import { Validators as NgValidators, AbstractControl } from '@angular/forms';
import { ValidatorFn, ValidationErrors, AsyncValidatorFn, NgValidatorsErrors } from './types';

export class Validators extends NgValidators {
  static required(control: AbstractControl) {
    return NgValidators.required(control) as ValidationErrors<{ required: NgValidatorsErrors['required'] }> | null;
  }

  static requiredTrue(control: AbstractControl) {
    return NgValidators.requiredTrue(control) as ValidationErrors<{ required: NgValidatorsErrors['required'] }> | null;
  }

  static email(control: AbstractControl) {
    return NgValidators.email(control) as ValidationErrors<{ email: NgValidatorsErrors['email'] }> | null;
  }

  static min<T = any>(min: number) {
    return NgValidators.min(min) as ValidatorFn<T, { min: NgValidatorsErrors['min'] }>;
  }

  static max<T = any>(max: number) {
    return NgValidators.max(max) as ValidatorFn<T, { max: NgValidatorsErrors['max'] }>;
  }

  static minLength<T = any>(minLength: number) {
    return NgValidators.minLength(minLength) as ValidatorFn<
      T,
      {
        minlength: NgValidatorsErrors['minlength'];
      }
    >;
  }

  static maxLength<T = any>(maxLength: number) {
    return NgValidators.maxLength(maxLength) as ValidatorFn<
      T,
      {
        maxlength: NgValidatorsErrors['maxlength'];
      }
    >;
  }

  static pattern<T = any>(pattern: string | RegExp) {
    return NgValidators.pattern(pattern) as ValidatorFn<
      T,
      {
        pattern: NgValidatorsErrors['pattern'];
      }
    >;
  }

  static compose(validators: null): null;
  static compose<E extends object = any>(validators: (ValidatorFn | null | undefined)[]): ValidatorFn<E> | null;
  static compose<E extends object = any>(validators: (ValidatorFn | null | undefined)[] | null): ValidatorFn<E> | null {
    return NgValidators.compose(validators) as ValidatorFn<E> | null;
  }

  static composeAsync<E extends object = any>(validators: (AsyncValidatorFn | null)[]) {
    return NgValidators.composeAsync(validators) as AsyncValidatorFn<E> | null;
  }
}
