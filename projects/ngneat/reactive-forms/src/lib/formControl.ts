import { FormControl as NgFormControl } from '@angular/forms';
import { isObservable, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import {
  controlDisabled$,
  controlDisabledWhile,
  controlEnabled$,
  controlEnabledWhile,
  controlErrorChanges$,
  controlStatusChanges$,
  controlValueChanges$,
  disableControl,
  enableControl,
  hasErrorAndDirty,
  hasErrorAndTouched,
  mergeControlValidators,
  selectControlValue$,
  validateControlOn
} from './control-actions';
import {
  AbstractControlOptions,
  AsyncValidatorFn,
  ControlEventOptions,
  ControlOptions,
  ControlState,
  EmitEvent,
  ExtractStrings,
  OnlySelf,
  OrBoxedValue,
  ValidatorFn
} from './types';
import { coerceArray, isFunction } from './utils';

export class FormControl<T = any, E extends object = any> extends NgFormControl {
  readonly value: T;
  readonly errors: E | null;
  readonly asyncValidator: AsyncValidatorFn<T>;
  readonly valueChanges: Observable<T>;
  readonly status: ControlState;
  readonly statusChanges: Observable<ControlState>;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();

  readonly touch$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
  readonly dirty$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());

  readonly value$ = controlValueChanges$<T>(this);
  readonly disabled$ = controlDisabled$<T>(this);
  readonly enabled$ = controlEnabled$<T>(this);
  readonly status$ = controlStatusChanges$<T>(this);
  readonly errors$ = controlErrorChanges$<E>(this);

  constructor(
    formState?: OrBoxedValue<T>,
    validatorOrOpts?: ValidatorFn<T> | ValidatorFn<T>[] | AbstractControlOptions<T> | null,
    asyncValidator?: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null
  ) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  select<R>(mapFn: (state: T) => R): Observable<R> {
    return selectControlValue$(this, mapFn);
  }

  setValue(valueOrObservable: Observable<T>, options?: ControlOptions): Subscription;
  setValue(valueOrObservable: T, options?: ControlOptions): void;
  setValue(valueOrObservable: any, options?: ControlOptions): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    } else {
      super.setValue(valueOrObservable, options);
    }
  }

  patchValue(valueOrObservable: Observable<T>, options?: ControlOptions): Subscription;
  patchValue(valueOrObservable: (state: T) => T, options?: ControlOptions): void;
  patchValue(valueOrObservable: T, options?: ControlOptions): void;
  patchValue(valueOrObservable: any, options?: ControlOptions): Subscription | void {
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
    return controlDisabledWhile(this, observable, options);
  }

  enabledWhile(observable: Observable<boolean>, options?: ControlOptions) {
    return controlEnabledWhile(this, observable, options);
  }

  mergeValidators(validators: ValidatorFn<T> | ValidatorFn<T>[]) {
    mergeControlValidators(this, validators);
  }

  mergeAsyncValidators(validators: AsyncValidatorFn<T> | AsyncValidatorFn<T>[]) {
    this.setAsyncValidators([this.asyncValidator, ...coerceArray(validators)]);
    this.updateValueAndValidity();
  }

  markAsTouched(opts?: OnlySelf): void {
    super.markAsTouched(opts);
    this.touchChanges.next(true);
  }

  markAsUntouched(opts?: OnlySelf): void {
    super.markAsUntouched(opts);
    this.touchChanges.next(false);
  }

  markAsPristine(opts?: OnlySelf): void {
    super.markAsPristine(opts);
    this.dirtyChanges.next(false);
  }

  markAsDirty(opts?: OnlySelf): void {
    super.markAsDirty(opts);
    this.dirtyChanges.next(true);
  }

  markAllAsDirty(): void {
    this.markAsDirty({ onlySelf: true });
  }

  reset(formState?: OrBoxedValue<T>, options?: ControlEventOptions): void {
    super.reset(formState, options);
  }

  setValidators(newValidator: ValidatorFn<T> | ValidatorFn<T>[] | null): void {
    super.setValidators(newValidator);
    super.updateValueAndValidity();
  }

  setAsyncValidators(newValidator: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null): void {
    super.setAsyncValidators(newValidator);
    super.updateValueAndValidity();
  }

  validateOn(observableValidation: Observable<null | object>) {
    return validateControlOn(this, observableValidation);
  }

  getError<K extends ExtractStrings<E>>(errorCode: K): E[K] | null {
    return super.getError(errorCode) as E[K] | null;
  }

  hasError<K extends ExtractStrings<E>>(errorCode: K) {
    return super.hasError(errorCode);
  }

  setErrors(errors: Partial<E> | null, opts: EmitEvent = {}) {
    return super.setErrors(errors, opts);
  }

  hasErrorAndTouched(error: ExtractStrings<E>): boolean {
    return hasErrorAndTouched(this, error);
  }

  hasErrorAndDirty(error: ExtractStrings<E>): boolean {
    return hasErrorAndDirty(this, error);
  }

  setEnable(enable = true, opts?: ControlEventOptions) {
    enableControl(this, enable, opts);
  }

  setDisable(disable = true, opts?: ControlEventOptions) {
    disableControl(this, disable, opts);
  }
}
