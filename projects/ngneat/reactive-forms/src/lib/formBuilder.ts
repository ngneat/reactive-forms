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
  | [OrBoxedValue<T>, ValidatorFn | ValidatorFn[] | null, AsyncValidatorFn | AsyncValidatorFn[] | null]
  | [OrBoxedValue<T>, ValidatorFn | ValidatorFn[] | AbstractControlOptions | null]
  | [T | OrBoxedValue<T>]
  | OrBoxedValue<T>
  | T;

export type FbGroupConfig<T = any> = { [key in keyof T]: FbControlConfig<T[key]> };

@Injectable({ providedIn: 'root' })
export class FormBuilder extends NgFormBuilder {
  group<T extends object, E extends object = any, GroupConfig extends FbGroupConfig<T> = FbGroupConfig<T>>(
    controlsConfig: GroupConfig,
    options?:
      | AbstractControlOptions<T>
      | {
          validator?: ValidatorFn | ValidatorFn[];
          asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[];
        }
      | null
  ): FormGroup<T, E> {
    const controls = (this as any)._reduceControls(controlsConfig);

    let validators: ValidatorFn | ValidatorFn[] | null = null;
    let asyncValidators: AsyncValidatorFn | AsyncValidatorFn[] | null = null;
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

    return new FormGroup(controls, { asyncValidators, updateOn, validators });
  }

  control<T, E extends object = any>(
    formState: OrBoxedValue<T>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ): FormControl<T, E> {
    return new FormControl(formState, validatorOrOpts, asyncValidator);
  }

  array<T, E extends object = any>(
    controlsConfig: FbControlConfig<T>[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ): FormArray<T, E> {
    const controls = controlsConfig.map(c => (this as any)._createControl(c));
    return new FormArray(controls, validatorOrOpts, asyncValidator);
  }
}
