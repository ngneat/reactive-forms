import { Injectable } from '@angular/core';
import { AbstractControl as NgControlOptions, FormBuilder as NgFormBuilder } from '@angular/forms';
import { FormArray } from './formArray';
import { FormControl } from './formControl';
import { FormGroup } from './formGroup';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from './types';

export type ControlType<T> = T | { value: T; disabled?: boolean };

export type FbControlConfig<T = any> =
  | AbstractControl<T>
  | [ControlType<T>, ValidatorFn<T> | ValidatorFn<T>[] | null, AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null]
  | [ControlType<T>, ValidatorFn<T> | ValidatorFn<T>[] | AbstractControlOptions<T> | null]
  | [ControlType<T>]
  | ControlType<T>;

export type FbGroupConfig<T = any> = { [key in keyof T]: FbControlConfig<T[key]> };

@Injectable({ providedIn: 'root' })
export class FormBuilder extends NgFormBuilder {
  group<T extends object, GroupConfig extends FbGroupConfig<T> = FbGroupConfig<T>>(
    controlsConfig: GroupConfig,
    options: AbstractControlOptions<T> | NgControlOptions | null = null
  ): FormGroup<T> {
    return super.group(controlsConfig, options) as FormGroup<T>;
  }

  control<T>(
    formState: T,
    validatorOrOpts?: ValidatorFn<T> | ValidatorFn<T>[] | AbstractControlOptions<T> | null,
    asyncValidator?: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null
  ): FormControl<T> {
    return super.control(formState, validatorOrOpts, asyncValidator) as FormControl<T>;
  }

  array<T>(
    controlsConfig: FbControlConfig<T>[],
    validatorOrOpts?: ValidatorFn<T[]> | ValidatorFn<T[]>[] | AbstractControlOptions<T[]> | null,
    asyncValidator?: AsyncValidatorFn<T[]> | AsyncValidatorFn<T[]>[] | null
  ): FormArray<T> {
    return super.array(controlsConfig, validatorOrOpts, asyncValidator) as FormArray<T>;
  }
}
