import { ValidationErrors } from '@angular/forms';
import { defer, merge, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FormArray } from './formArray';
import { FormControl } from './formControl';
import { FormGroup } from './formGroup';
import { AbstractControl, AsyncValidatorFn, ControlOptions, ControlPath, ControlState, ValidatorFn } from './types';
import { coerceArray, isNil } from './utils';

function getControlValue<T>(control: AbstractControl<T>): T {
  if ((control as any).getRawValue) {
    return (control as any).getRawValue();
  }
  return control.value;
}

function compareErrors(a: ValidationErrors | null, b: ValidationErrors | null) {
  if (isNil(a) || isNil(b)) {
    return a === b;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

export function controlValueChanges$<T>(control: AbstractControl<T>): Observable<T> {
  return merge(
    defer(() => of(getControlValue(control))),
    control.valueChanges.pipe(map(() => getControlValue(control)))
  );
}

export function controlDisabled$<T>(control: AbstractControl<T>): Observable<boolean> {
  return merge(
    defer(() => of(control.disabled)),
    control.statusChanges.pipe(
      map(() => control.disabled),
      distinctUntilChanged()
    )
  );
}

export function controlEnabled$<T>(control: AbstractControl<T>): Observable<boolean> {
  return merge(
    defer(() => of(control.enabled)),
    control.statusChanges.pipe(
      map(() => control.enabled),
      distinctUntilChanged()
    )
  );
}

export function controlStatusChanges$<T>(control: AbstractControl<T>): Observable<ControlState> {
  return merge(
    defer(() => of(control.status as ControlState)),
    control.statusChanges.pipe(
      map(() => control.status as ControlState),
      distinctUntilChanged()
    )
  );
}

export function controlErrorChanges$<E>(control: AbstractControl): Observable<E | null> {
  return merge(
    defer(() => of(control.errors as E)),
    control.valueChanges.pipe(
      map(() => control.errors as E),
      distinctUntilChanged((a, b) => compareErrors(a, b))
    )
  );
}

export function enableControl<T>(control: AbstractControl<T>, enabled: boolean, opts?: ControlOptions): void {
  if (enabled) {
    control.enable(opts);
  } else {
    control.disable(opts);
  }
}

export function disableControl<T>(control: AbstractControl<T>, disabled: boolean, opts?: ControlOptions): void {
  enableControl(control, !disabled, opts);
}

export function controlDisabledWhile<T>(
  control: AbstractControl<T>,
  observable: Observable<boolean>,
  opts?: ControlOptions
): Subscription {
  return observable.subscribe(isDisabled => disableControl(control, isDisabled, opts));
}

export function controlEnabledWhile<T>(
  control: AbstractControl<T>,
  observable: Observable<boolean>,
  opts?: ControlOptions
): Subscription {
  return observable.subscribe(isEnabled => enableControl(control, isEnabled, opts));
}

export function mergeControlValidators<T>(
  control: AbstractControl<T>,
  validators: ValidatorFn<T> | ValidatorFn<T>[] | null
): void {
  control.setValidators([control.validator as any, ...coerceArray(validators)]);
  control.updateValueAndValidity();
}

export function mergeControlAsyncValidators<T>(
  control: AbstractControl<T>,
  validators: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null
): void {
  control.setAsyncValidators([control.asyncValidator as any, ...coerceArray(validators)]);
  control.updateValueAndValidity();
}

export function validateControlOn<T>(control: AbstractControl<T>, validation: Observable<null | object>): Subscription {
  return validation.subscribe(maybeError => {
    control.setErrors(maybeError);
  });
}

export function hasErrorAndTouched<T>(control: AbstractControl<T>, error: string, path?: ControlPath): boolean {
  const hasError = control.hasError(error, !path || path.length === 0 ? undefined : path);
  return hasError && control.touched;
}

export function hasErrorAndDirty<T>(control: AbstractControl<T>, error: string, path?: ControlPath): boolean {
  const hasError = control.hasError(error, !path || path.length === 0 ? undefined : path);
  return hasError && control.dirty;
}

export function markAllDirty<T>(control: FormArray<T> | FormGroup<T>): void {
  control.markAsDirty({ onlySelf: true });
  (control as any)._forEachChild((control: any) => control.markAllAsDirty());
}

export function selectControlValue$<T, R>(
  control: FormGroup<T> | FormArray<T> | FormControl<T>,
  mapFn: (state: T) => R
): Observable<R> {
  return (control.value$ as Observable<any>).pipe(map(mapFn), distinctUntilChanged());
}
