import { Injectable } from '@angular/core';
import { FormBuilder as NgFormBuilder } from '@angular/forms';
import { FormArray } from './formArray';
import { FormControl } from './formControl';
import { FormGroup } from './formGroup';
import { AbstractControlOptions, AsyncValidatorFn, AbstractControl, OrBoxedValue, ValidatorFn } from './types';

function isAbstractControlOptions<T>(
  options: AbstractControlOptions<T> | { [key: string]: any }
): options is AbstractControlOptions<T> {
  return (
    (<AbstractControlOptions<T>>options).asyncValidators !== undefined ||
    (<AbstractControlOptions<T>>options).validators !== undefined ||
    (<AbstractControlOptions<T>>options).updateOn !== undefined
  );
}

export type FbControlConfig<T = any> =
  | AbstractControl<T>
  | [OrBoxedValue<T>, ValidatorFn<T> | ValidatorFn<T>[] | null, AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null]
  | [OrBoxedValue<T>, ValidatorFn<T> | ValidatorFn<T>[] | AbstractControlOptions<T> | null]
  | [T | OrBoxedValue<T>]
  | OrBoxedValue<T>
  | T;

@Injectable({ providedIn: 'root' })
export class FormBuilder extends NgFormBuilder {
  group<T extends object, E extends object = any>(
    controlsConfig: { [K in keyof T]: FbControlConfig<T[K]> },
    options?:
      | AbstractControlOptions<T>
      | {
          validator?: ValidatorFn<T> | ValidatorFn<T>[];
          asyncValidator?: AsyncValidatorFn<T> | AsyncValidatorFn<T>[];
        }
      | null
  ): FormGroup<T, E> {
    const controls = (this as any)._reduceControls(controlsConfig);

    let validators: ValidatorFn<T> | ValidatorFn<T>[] | null = null;
    let asyncValidators: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null = null;
    let updateOn: AbstractControlOptions<T>['updateOn'] | undefined;

    if (options != null) {
      if (isAbstractControlOptions(options)) {
        validators = options.validators != null ? options.validators : null;
        asyncValidators = options.asyncValidators != null ? options.asyncValidators : null;
        updateOn = options.updateOn != null ? options.updateOn : undefined;
      } else {
        // `options` are legacy form group options
        validators = options['validator'] != null ? options['validator'] : null;
        asyncValidators = options['asyncValidator'] != null ? options['asyncValidator'] : null;
      }
    }

    // Todo: dan remove the any
    return new FormGroup(controls, { asyncValidators, updateOn, validators });
  }

  control<T, E extends object = any>(
    formState: OrBoxedValue<T>,
    validatorOrOpts?: ValidatorFn<T> | ValidatorFn<T>[] | AbstractControlOptions<T> | null,
    asyncValidator?: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null
  ): FormControl<T, E> {
    return new FormControl(formState, validatorOrOpts, asyncValidator);
  }

  array<T, E extends object = any>(
    controlsConfig: FbControlConfig<T>[],
    validatorOrOpts?: ValidatorFn<T[]> | ValidatorFn<T[]>[] | AbstractControlOptions<T[]> | null,
    asyncValidator?: AsyncValidatorFn<T[]> | AsyncValidatorFn<T[]>[] | null
  ): FormArray<T, E> {
    const controls = controlsConfig.map(c => (this as any)._createControl(c));
    return new FormArray(controls, validatorOrOpts, asyncValidator);
  }
}
