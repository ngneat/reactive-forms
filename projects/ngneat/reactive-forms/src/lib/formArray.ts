import { FormArray as NgFormArray } from '@angular/forms';
import { isObservable, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
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
  markAllDirty,
  mergeControlValidators
} from './control-actions';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  ControlEventOptions,
  ControlOptions,
  ControlPath,
  ControlState,
  EmitEvent,
  ExtractStrings,
  OnlySelf,
  ValidatorFn
} from './types';
import { coerceArray, isFunction } from './utils';

export class FormArray<T = any, E extends object = any> extends NgFormArray {
  value: T[];
  valueChanges: Observable<T[]>;
  status: ControlState;
  statusChanges: Observable<ControlState>;
  errors: E | null;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();

  touch$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
  dirty$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());

  value$ = controlValueChanges$<T[]>(this);
  disabledChanges$ = controlDisabled$(this);
  enabledChanges$ = controlEnabled$(this);
  statusChanges$ = controlStatusChanges$(this);
  errorChanges$ = controlErrorChanges$<E>(this);

  constructor(
    public controls: Array<AbstractControl<T>>,
    validatorOrOpts?:
      | ValidatorFn<Partial<E>, T[]>
      | ValidatorFn<Partial<E>, T[]>[]
      | AbstractControlOptions<T[], E>
      | null,
    asyncValidator?: AsyncValidatorFn<Partial<E>, T[]> | AsyncValidatorFn<Partial<E>, T[]>[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  select<R>(mapFn: (state: T[]) => R): Observable<R> {
    return this.value$.pipe(map(mapFn), distinctUntilChanged());
  }

  getRawValue(): T[] {
    return super.getRawValue();
  }

  at(index: number): AbstractControl<T> {
    return super.at(index) as AbstractControl<T>;
  }

  setValue(valueOrObservable: Observable<T[]>, options?: ControlEventOptions): Subscription;
  setValue(valueOrObservable: T[], options?: ControlEventOptions): void;
  setValue(valueOrObservable: T[] | Observable<T[]>, options?: ControlEventOptions): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    } else {
      super.setValue(valueOrObservable, options);
    }
  }

  patchValue(valueOrObservable: Observable<T[]>, options?: ControlEventOptions): Subscription;
  patchValue(valueOrObservable: T[], options?: ControlEventOptions): void;
  patchValue(valueOrObservable: (state: T[]) => T[], options?: ControlOptions): void;
  patchValue(
    valueOrObservable: T[] | Observable<T[]> | ((state: T[]) => T[]),
    options?: ControlEventOptions
  ): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.patchValue(value, options));
    } else {
      let value = valueOrObservable;
      if (isFunction(valueOrObservable)) {
        value = valueOrObservable(this.value);
      }
      super.patchValue(value as T[], options);
    }
  }

  push(control: AbstractControl<T>): void {
    return super.push(control);
  }

  insert(index: number, control: AbstractControl<T>): void {
    return super.insert(index, control);
  }

  setControl(index: number, control: AbstractControl<T>): void {
    return super.setControl(index, control);
  }

  disabledWhile(observable: Observable<boolean>, options?: ControlOptions) {
    return controlDisabledWhile(this, observable, options);
  }

  enabledWhile(observable: Observable<boolean>, options?: ControlOptions) {
    return controlEnabledWhile(this, observable, options);
  }

  mergeValidators(validators: ValidatorFn<Partial<E>, T[]> | ValidatorFn<Partial<E>, T[]>[]) {
    mergeControlValidators(this, validators);
  }

  mergeAsyncValidators(validators: AsyncValidatorFn<Partial<E>, T[]> | AsyncValidatorFn<any, T[]>[]) {
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
    markAllDirty(this);
  }

  reset(value?: T[], options?: ControlEventOptions): void {
    super.reset(value, options);
  }

  setValidators(newValidator: ValidatorFn<Partial<E>, T[]> | ValidatorFn<Partial<E>, T[]>[] | null): void {
    super.setValidators(newValidator);
    super.updateValueAndValidity();
  }

  setAsyncValidators(
    newValidator: AsyncValidatorFn<Partial<E>, T[]> | AsyncValidatorFn<Partial<E>, T[]>[] | null
  ): void {
    super.setAsyncValidators(newValidator);
    super.updateValueAndValidity();
  }

  validateOn(observableValidation: Observable<null | object>) {
    return observableValidation.subscribe(maybeError => {
      this.setErrors(maybeError);
    });
  }

  hasError(errorCode: ExtractStrings<E>, path?: ControlPath) {
    return super.hasError(errorCode, path);
  }

  setErrors(errors: Partial<E> | null, opts: EmitEvent = {}) {
    return super.setErrors(errors, opts);
  }

  getError<K extends ExtractStrings<E>>(errorCode: K, path?: ControlPath) {
    return super.getError(errorCode, path) as E[K] | null;
  }

  hasErrorAndTouched(errorCode: ExtractStrings<E>, path?: ControlPath): boolean {
    return hasErrorAndTouched(this, errorCode, path);
  }

  hasErrorAndDirty(errorCode: ExtractStrings<E>, path?: ControlPath): boolean {
    return hasErrorAndDirty(this, errorCode, path);
  }

  setEnable(enable = true, opts?: ControlEventOptions) {
    enableControl(this, enable, opts);
  }

  setDisable(disable = true, opts?: ControlEventOptions) {
    disableControl(this, disable, opts);
  }
}
