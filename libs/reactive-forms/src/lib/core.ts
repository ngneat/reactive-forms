import { AbstractControl, ValidationErrors } from '@angular/forms';
import { defer, merge, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

export function selectControlValue$<T, R>(
  control: any,
  mapFn: (state: T) => R
): Observable<R> {
  return (control.value$ as Observable<any>).pipe(
    map(mapFn),
    distinctUntilChanged()
  );
}

export function controlValueChanges$<T>(
  control: AbstractControl & { getRawValue: () => T }
): Observable<T> {
  return merge(
    defer(() => of(control.getRawValue())),
    control.valueChanges.pipe(map(() => control.getRawValue()))
  ) as Observable<T>;
}

export function controlValidValueChanges$<T>(
  control: AbstractControl & { getRawValue: () => T }
): Observable<T> {
  return merge(
    defer(() => of(control.getRawValue())),
    control.valueChanges.pipe(filter(() => control.valid), map(() => control.getRawValue()))
  ) as Observable<T>;
}

export type ControlState = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

export function controlStatus$<
  K extends 'disabled' | 'enabled' | 'invalid' | 'valid' | 'status'
>(
  control: AbstractControl,
  type: K
): Observable<K extends 'status' ? ControlState : boolean> {
  return merge(
    defer(() => of(control[type])),
    control.statusChanges.pipe(
      map(() => control[type]),
      distinctUntilChanged()
    )
  ) as Observable<any>;
}

export function enableControl(
  control: AbstractControl,
  enabled: boolean,
  opts?: any
) {
  if (enabled) {
    control.enable(opts);
  } else {
    control.disable(opts);
  }
}

export function disableControl(
  control: AbstractControl,
  disabled: boolean,
  opts?: any
) {
  enableControl(control, !disabled, opts);
}

export function controlDisabledWhile(
  control: AbstractControl,
  observable: Observable<boolean>,
  opts?: any
): Subscription {
  return observable.subscribe((isDisabled) =>
    disableControl(control, isDisabled, opts)
  );
}

export function controlEnabledWhile(
  control: AbstractControl,
  observable: Observable<boolean>,
  opts?: any
): Subscription {
  return observable.subscribe((isEnabled) =>
    enableControl(control, isEnabled, opts)
  );
}

export function mergeErrors(
  existing: ValidationErrors | null,
  toAdd: ValidationErrors | null
) {
  if (!existing && !toAdd) {
    return null;
  }

  return {
    ...existing,
    ...toAdd,
  };
}

export function removeError(errors: ValidationErrors | null, key: string) {
  if (!errors) {
    return null;
  }

  const updatedErrors = {
    ...errors,
  };

  delete updatedErrors[key];

  return Object.keys(updatedErrors).length > 0 ? updatedErrors : null;
}

export function hasErrorAnd(
  and: 'touched' | 'dirty',
  control: AbstractControl,
  error: string,
  path?: Parameters<AbstractControl['hasError']>[1]
): boolean {
  const hasError = control.hasError(
    error,
    !path || path.length === 0 ? undefined : path
  );
  return hasError && control[and];
}

export function controlErrorChanges$(
  control: AbstractControl,
  errors$: Observable<ValidationErrors | null>
): Observable<ValidationErrors | null> {
  return merge(
    defer(() => of(control.errors)),
    errors$,
    control.valueChanges.pipe(
      map(() => control.errors),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    )
  );
}

export function markAllDirty(control: AbstractControl): void {
  control.markAsDirty({ onlySelf: true });

  (control as any)._forEachChild((control: any) => control.markAllAsDirty?.() || control.markAsDirty({ onlySelf: true }));
}
