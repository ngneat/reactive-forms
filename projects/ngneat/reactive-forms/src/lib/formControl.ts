import { FormControl as NgFormControl } from '@angular/forms';
import {
  AbstractControlOptions,
  AsyncValidatorFn,
  ControlOptions,
  ControlState,
  LimitedControlOptions,
  ValidatorFn
} from './types';
import { defer, isObservable, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { coerceArray, isFunction } from './utils';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class FormControl<T = null> extends NgFormControl {
  value: T;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();

  touchChanges$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
  dirtyChanges$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());

  valueChanges$: Observable<T> = merge(
    this.valueChanges.pipe(map(() => this.getRawValue())),
    defer(() => of(this.getRawValue()))
  );

  disabledChanges$: Observable<boolean> = merge(
    this.statusChanges.pipe(
      map(() => this.disabled),
      distinctUntilChanged()
    ),
    defer(() => of(this.disabled))
  );

  enabledChanges$: Observable<boolean> = merge(
    this.statusChanges.pipe(
      map(() => this.enabled),
      distinctUntilChanged()
    ),
    defer(() => of(this.enabled))
  );

  statusChanges$: Observable<ControlState> = merge(
    defer(() => of(this.status as ControlState)),
    this.statusChanges.pipe(
      map(() => this.status as ControlState),
      distinctUntilChanged()
    )
  );

  constructor(
    formState: T = null,
    validatorOrOpts?: ValidatorFn<T> | ValidatorFn<T>[] | AbstractControlOptions<T> | null,
    asyncValidator?: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null
  ) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  connect(observable: Observable<T>, options?: ControlOptions) {
    return observable.subscribe(value => this.patchValue(value, options));
  }

  select<R>(mapFn: (state: T) => R): Observable<R> {
    return this.valueChanges$.pipe(map(mapFn), distinctUntilChanged());
  }

  setValue(valueOrObservable: Observable<T>, options?: ControlOptions): Subscription;
  setValue(valueOrObservable: T, options?: ControlOptions): void;
  setValue(valueOrObservable: T | Observable<T>, options?: ControlOptions): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    } else {
      super.setValue(valueOrObservable, options);
    }
  }

  patchValue(valueOrObservable: Observable<T>, options?: ControlOptions): Subscription;
  patchValue(valueOrObservable: (state: T) => T, options?: ControlOptions): void;
  patchValue(valueOrObservable: T, options?: ControlOptions): void;
  patchValue(valueOrObservable: T | Observable<T> | ((state: T) => T), options?: ControlOptions): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.patchValue(value, options));
    } else {
      let value = valueOrObservable;
      if (isFunction(valueOrObservable)) {
        value = valueOrObservable(this.value);
      }
      super.patchValue(value, options);
    }
  }

  disabledWhile(observable: Observable<boolean>, options?: ControlOptions) {
    return observable.subscribe(isDisabled => {
      isDisabled ? this.disable(options) : this.enable(options);
    });
  }

  enableWhile(observable: Observable<boolean>, options?: ControlOptions) {
    return observable.subscribe(isEnabled => {
      isEnabled ? this.enable(options) : this.disable(options);
    });
  }

  mergeValidators(validators: ValidatorFn<T> | ValidatorFn<T>[]) {
    this.setValidators([this.validator, ...coerceArray(validators)]);
    this.updateValueAndValidity();
  }

  markAsTouched(opts?: { onlySelf?: boolean }): void {
    super.markAsTouched(opts);
    this.touchChanges.next(true);
  }

  markAsUntouched(opts?: { onlySelf?: boolean }): void {
    super.markAsUntouched(opts);
    this.touchChanges.next(false);
  }

  markAsPristine(opts?: { onlySelf?: boolean }): void {
    super.markAsPristine(opts);
    this.dirtyChanges.next(false);
  }

  markAsDirty(opts?: { onlySelf?: boolean }): void {
    super.markAsDirty(opts);
    this.dirtyChanges.next(true);
  }

  markAllAsDirty(): void {
    this.markAsDirty({ onlySelf: true });
  }

  reset(formState?: T, options?: LimitedControlOptions): void {
    super.reset(formState, options);
  }

  setValidators(newValidator: ValidatorFn<T> | ValidatorFn<T>[] | null): void {
    super.setValidators(newValidator);
  }

  setAsyncValidators(newValidator: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null): void {
    super.setAsyncValidators(newValidator);
  }

  validateOn(observableValidation: Observable<null | object>) {
    return observableValidation.subscribe(maybeError => {
      this.setErrors(maybeError);
    });
  }

  hasErrorAndTouched(error: string) {
    return this.hasError(error) && this.touched;
  }

  hasErrorAndDirty(error: string) {
    return this.hasError(error) && this.dirty;
  }

  private getRawValue() {
    return this.value;
  }
}
