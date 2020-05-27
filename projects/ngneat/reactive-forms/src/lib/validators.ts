import { Validators as NgValidators, AbstractControl } from '@angular/forms';
import { ValidatorFn, NgValidatorsErrors, AsyncValidatorFn } from './types';

export class Validators extends NgValidators {
  static required(control: AbstractControl) {
    return NgValidators.required(control) as { required: NgValidatorsErrors['required'] } | null;
  }

  static requiredTrue(control: AbstractControl) {
    return NgValidators.requiredTrue(control) as { required: NgValidatorsErrors['required'] } | null;
  }

  static email(control: AbstractControl) {
    return NgValidators.email(control) as { email: NgValidatorsErrors['email'] } | null;
  }

  static min(min: number) {
    return NgValidators.min(min) as ValidatorFn<{ min: NgValidatorsErrors['min'] }>;
  }

  static max(max: number) {
    return NgValidators.max(max) as ValidatorFn<{ max: NgValidatorsErrors['max'] }>;
  }

  static minLength(minLength: number) {
    return NgValidators.minLength(minLength) as ValidatorFn<{
      minlength: NgValidatorsErrors['minlength'];
    }>;
  }

  static maxLength(maxLength: number) {
    return NgValidators.maxLength(maxLength) as ValidatorFn<{
      maxlength: NgValidatorsErrors['maxlength'];
    }>;
  }

  static pattern(pattern: string | RegExp) {
    return NgValidators.pattern(pattern) as ValidatorFn<{
      pattern: NgValidatorsErrors['pattern'];
    }>;
  }

  static compose(validators: null): null;
  static compose<E extends object = any>(validators: (ValidatorFn | null | undefined)[]): ValidatorFn<E> | null;
  static compose<E extends object = any>(validators: (ValidatorFn | null | undefined)[] | null): ValidatorFn<E> | null {
    return super.compose(validators) as ValidatorFn<E> | null;
  }

  static composeAsync<E extends object = any>(validators: (AsyncValidatorFn<E> | null)[]) {
    return super.composeAsync(validators) as AsyncValidatorFn<E> | null;
  }
}
