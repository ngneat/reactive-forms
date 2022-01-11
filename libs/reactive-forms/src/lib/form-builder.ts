import { Injectable } from "@angular/core";
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormBuilder as NgFormBuilder, ValidatorFn } from '@angular/forms';
import { FormControl, FormGroup } from "..";
import { FormArray } from "./form-array";
import { BoxedValue, ControlsOf } from "./types";

@Injectable({ providedIn: 'root' })
export class FormBuilder extends NgFormBuilder {

  control<T>(
    formState?: BoxedValue<T>,
    validatorOrOpts?: ConstructorParameters<typeof FormControl>[1],
    asyncValidator?: ConstructorParameters<typeof FormControl>[2]
  ) {
    return new FormControl<T>(formState, validatorOrOpts, asyncValidator);
  }

  array<T, Control extends AbstractControl = T extends Record<any, any> ? FormGroup<ControlsOf<T>> : FormControl<T>>(
    controlsConfig: Control[],
    validatorOrOpts?: ConstructorParameters<typeof FormArray>[1],
    asyncValidator?: ConstructorParameters<typeof FormArray>[2]) {
    const controls = controlsConfig.map(c => (this as any)._createControl(c));

    return new FormArray<T,Control>(controls, validatorOrOpts, asyncValidator);
  }


  group<T extends Record<string, any>>(
    controlsConfig: Controls<T>,
    options?: AbstractControlOptions,
  ): FormGroup<GroupResolverFormBuilder<T>> {
    const controls = (this as any)._reduceControls(controlsConfig);

    let validators: any = null;
    let asyncValidators: any = null;
    let updateOn: any;

    if (options != null) {
      validators = options.validators != null ? options.validators : null;
      asyncValidators = options.asyncValidators != null ? options.asyncValidators : null;
      updateOn = options.updateOn != null ? options.updateOn : undefined;
    }

    return new FormGroup(controls, { asyncValidators, updateOn, validators });
  }
}

export type GroupResolverFormBuilder<T extends Record<string, any>> = {
  [K in keyof T]:
  // { key: builder.group/array()/FormControl([]) }
  T[K] extends AbstractControl ? T[K] :

  // { key: [''], ['', Validators.required] }
  T[K] extends (infer U)[] ? FormControl<ResolveTypeArray<U>> :

  // { key: '' }
  FormControl<T[K]>
}

type FormControlBuilderOptions<T> = [T, (ValidatorFn | ValidatorFn[] | null)?, (AsyncValidatorFn | AsyncValidatorFn[] | null)?]

// { key: ['', Validators.required] } - get the first key type
type ResolveTypeArray<U> = Exclude<U, null | ValidatorFn | ValidatorFn[] | AsyncValidatorFn | AsyncValidatorFn[]>

type Controls<T> = {
  [K in keyof T]: T[K] extends AbstractControl ? T[K] :
  T[K] extends (infer U)[] ? FormControlBuilderOptions<ResolveTypeArray<U>> :
  T[K] extends Record<any, any> ? FormGroup<Controls<T[K]>> :
  T[K]
}
