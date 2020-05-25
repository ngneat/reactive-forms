import { Injectable } from '@angular/core';
import { FormBuilder as NgFormBuilder } from '@angular/forms';
import { FormArray } from './formArray';
import { FormControl } from './formControl';
import { FormGroup } from './formGroup';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, OrBoxedValue, ValidatorFn } from './types';

function isAbstractControlOptions<T>(
  options: AbstractControlOptions<T> | { [key: string]: any }
): options is AbstractControlOptions<T> {
  return (
    (<AbstractControlOptions<T>>options).asyncValidators !== undefined ||
    (<AbstractControlOptions<T>>options).validators !== undefined ||
    (<AbstractControlOptions<T>>options).updateOn !== undefined
  );
}

export type FbControlConfig<T = any, E extends object = any> =
  | AbstractControl<T>
  | [
      OrBoxedValue<T>,
      ValidatorFn<T, E> | ValidatorFn<T, E>[] | null,
      AsyncValidatorFn<T, E> | AsyncValidatorFn<T, E>[] | null
    ]
  | [OrBoxedValue<T>, ValidatorFn<T, E> | ValidatorFn<T, E>[] | AbstractControlOptions<T, E> | null]
  | [T | OrBoxedValue<T>]
  | OrBoxedValue<T>
  | T;

export type FbGroupConfig<T = any, E extends object = any> = { [key in keyof T]: FbControlConfig<T[key]> };

@Injectable({ providedIn: 'root' })
export class FormBuilder extends NgFormBuilder {
  group<T extends object, E extends object = any, GroupConfig extends FbGroupConfig<T, E> = FbGroupConfig<T, E>>(
    controlsConfig: GroupConfig,
    options?:
      | AbstractControlOptions<T, E>
      | {
          validator?: ValidatorFn<T, E> | ValidatorFn<T, E>[];
          asyncValidator?: AsyncValidatorFn<T, E> | AsyncValidatorFn<T, E>[];
        }
      | null
  ): FormGroup<T, E> {
    const controls = (this as any)._reduceControls(controlsConfig);

    let validators: ValidatorFn | ValidatorFn[] | null = null;
    let asyncValidators: AsyncValidatorFn | AsyncValidatorFn[] | null = null;
    let updateOn: AbstractControlOptions['updateOn'] | undefined;

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

    return new FormGroup(controls, { asyncValidators, updateOn, validators });
  }

  control<T, E extends object = any>(
    formState: OrBoxedValue<T>,
    validatorOrOpts?: ValidatorFn<T, E> | ValidatorFn<T, E>[] | AbstractControlOptions<T, E> | null,
    asyncValidator?: AsyncValidatorFn<T, E> | AsyncValidatorFn<T, E>[] | null
  ): FormControl<T, E> {
    return new FormControl(formState, validatorOrOpts, asyncValidator);
  }

  array<T, E extends object = any>(
    controlsConfig: FbControlConfig<T, E>[],
    validatorOrOpts?: ValidatorFn<T[], E> | ValidatorFn<T[], E>[] | AbstractControlOptions<T[], E> | null,
    asyncValidator?: AsyncValidatorFn<T[], E> | AsyncValidatorFn<T[], E>[] | null
  ): FormArray<T, E> {
    const controls = controlsConfig.map(c => (this as any)._createControl(c));
    return new FormArray(controls, validatorOrOpts, asyncValidator);
  }
}
