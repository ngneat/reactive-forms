import { defer, merge, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FormArray } from './formArray';
import { FormGroup } from './formGroup';
import { AbstractControl, ControlOptions, ControlState, ValidatorFn } from './types';
import { coerceArray } from './utils';

function getControlValue<T>(control: AbstractControl<T>): T {
  if (control instanceof FormGroup || control instanceof FormArray) {
    return control.getRawValue();
  }
  return control.value;
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

type getControlType<T> = T extends AbstractControl<infer U> ? U : unknown;

export function mergeControlValidators<T, Control extends AbstractControl<T>, Validator extends ValidatorFn<T>>(
  control: Control,
  validators: ValidatorFn<getControlType<Control>> | ValidatorFn<getControlType<Control>>[]
): void {
  control.setValidators([control.validator, ...coerceArray(validators)]);
  control.updateValueAndValidity();
}

export function validateControlOn<T>(control: AbstractControl<T>, validation: Observable<null | object>): Subscription {
  return validation.subscribe(maybeError => {
    control.setErrors(maybeError);
  });
}

export function hasErrorAndTouched<T>(control: AbstractControl<T>, error: string, ...path: any): boolean {
  const hasError = control.hasError(error, path.length === 0 ? undefined : path);
  return hasError && control.touched;
}

export function hasErrorAndDirty<T>(control: AbstractControl<T>, error: string, ...path: any): boolean {
  const hasError = control.hasError(error, path.length === 0 ? undefined : path);
  return hasError && control.dirty;
}

export function markAllDirty<T extends object, R extends any>(control: FormArray<R> | FormGroup<T>): void {
  control.markAsDirty({ onlySelf: true });
  (control as any)._forEachChild(control => control.markAllAsDirty());
}

export function connectControl<T>(
  control: AbstractControl<T>,
  observable: Observable<T>,
  options?: ControlOptions
): Subscription {
  return observable.subscribe(value => control.patchValue(value, options));
}
