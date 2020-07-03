import { Validators as NgValidators, ValidationErrors } from '@angular/forms';
import { ValidatorFn, NgValidatorsErrors, AsyncValidatorFn, AbstractControl } from './types';

export class Validators extends NgValidators {
  static required<T = any>(control: AbstractControl<T>) {
    return NgValidators.required(control) as { required: NgValidatorsErrors['required'] } | null;
  }

  static requiredTrue<T = any>(control: AbstractControl<T>) {
    return NgValidators.requiredTrue(control) as { required: NgValidatorsErrors['required'] } | null;
  }

  static email<T = any>(control: AbstractControl<T>) {
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
  static compose<T = any, E extends ValidationErrors = any>(
    validators: (ValidatorFn<any, T> | null | undefined)[]
  ): ValidatorFn<E> | null;
  static compose<T = any, E extends ValidationErrors = any>(
    validators: (ValidatorFn<any, T> | null | undefined)[] | null
  ): ValidatorFn<Partial<E>, T> | null {
    return NgValidators.compose(validators) as ValidatorFn<E, T> | null;
  }

  static composeAsync<E extends object = any>(validators: (AsyncValidatorFn<E> | null)[]) {
    return NgValidators.composeAsync(validators) as AsyncValidatorFn<E> | null;
  }
}
