import { FormGroup as NgFormGroup } from '@angular/forms';
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
  markAllDirty,
  mergeControlValidators,
  selectControlValue$,
  validateControlOn
} from './control-actions';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  ControlEventOptions,
  ControlOptions,
  ControlType,
  EmitEvent,
  ExtractStrings,
  ValidationErrors,
  ValidatorFn
} from './types';
import { coerceArray, isFunction } from './utils';

export class FormGroup<T = any, E extends object = any> extends NgFormGroup {
  value: T;
  errors: ValidationErrors<E> | null;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();

  touchChanges$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
  dirtyChanges$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());

  valueChanges$ = controlValueChanges$(this);
  disabledChanges$ = controlDisabled$(this);
  enabledChanges$ = controlEnabled$(this);
  statusChanges$ = controlStatusChanges$(this);
  errorChanges$ = controlErrorChanges$<T, E>(this);

  constructor(
    public controls: { [K in keyof T]: ControlType<T[K]> },
    validatorOrOpts?:
      | ValidatorFn<T, Partial<E>>
      | ValidatorFn<T, Partial<E>>[]
      | AbstractControlOptions<T, Partial<E>>
      | null,
    asyncValidator?: AsyncValidatorFn<T, Partial<E>> | AsyncValidatorFn<T, Partial<E>>[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  select<R>(mapFn: (state: T) => R): Observable<R> {
    return selectControlValue$(this, mapFn);
  }

  getRawValue(): T {
    return super.getRawValue();
  }

  get<K1 extends keyof T>(path?: [K1]): ControlType<T[K1]>;
  get<K1 extends keyof T, K2 extends keyof T[K1]>(path?: [K1, K2]): ControlType<T[K1][K2]>;
  get<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
    errorCode: ExtractStrings<E>,
    path?: [K1, K2, K3]
  ): ControlType<T[K1][K2][K3]>;
  get(path?: string): AbstractControl<any>;
  get(path: any) {
    return super.get(path);
  }

  getControl<P1 extends keyof T>(prop1: P1): ControlType<T[P1]>;
  getControl<P1 extends keyof T, P2 extends keyof T[P1]>(prop1: P1, prop2: P2): ControlType<T[P1][P2]>;
  getControl<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2]>(
    prop1: P1,
    prop2: P2,
    prop3: P3
  ): ControlType<T[P1][P2][P3]>;
  getControl<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2], P4 extends keyof T[P1][P2][P3]>(
    prop1: P1,
    prop2: P2,
    prop3: P3,
    prop4: P4
  ): ControlType<T[P1][P2][P3][P4]>;
  getControl(...names: any): any {
    return this.get(names.join('.'));
  }

  addControl<K extends ExtractStrings<T>>(name: K, control: ControlType<T[K]>): void {
    super.addControl(name, control);
  }

  removeControl(name: ExtractStrings<T>): void {
    super.removeControl(name);
  }

  contains(controlName: ExtractStrings<T>): boolean {
    return super.contains(controlName);
  }

  setControl<K extends ExtractStrings<T>>(name: K, control: ControlType<T[K]>): void {
    super.setControl(name, control);
  }

  setValue(valueOrObservable: Observable<T>, options?: ControlEventOptions): Subscription;
  setValue(valueOrObservable: T, options?: ControlEventOptions): void;
  setValue(valueOrObservable: T | Observable<T>, options?: ControlEventOptions): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    } else {
      super.setValue(valueOrObservable, options);
    }
  }

  patchValue(valueOrObservable: Observable<Partial<T>>, options?: ControlEventOptions): Subscription;
  patchValue(valueOrObservable: Partial<T>, options?: ControlEventOptions): void;
  patchValue(valueOrObservable: (state: T) => T, options?: ControlOptions): void;
  patchValue(
    valueOrObservable: Partial<T> | Observable<Partial<T>> | ((state: T) => T),
    options?: ControlEventOptions
  ): Subscription | void {
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
    markAllDirty(this);
  }

  reset(formState?: T, options?: ControlEventOptions): void {
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

  hasError<K1 extends keyof T>(errorCode: ExtractStrings<E>, path?: [K1]): boolean;
  hasError<K1 extends keyof T, K2 extends keyof T[K1]>(errorCode: ExtractStrings<E>, path?: [K1, K2]): boolean;
  hasError<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
    errorCode: ExtractStrings<E>,
    path?: [K1, K2, K3]
  ): boolean;
  hasError(errorCode: ExtractStrings<E>, path?: string): boolean;
  hasError(errorCode: ExtractStrings<E>, path?: any): boolean {
    return super.hasError(errorCode, path);
  }

  setErrors(errors: Partial<E> | null, opts: EmitEvent = {}) {
    return super.setErrors(errors, opts);
  }

  getError<K extends keyof E, K1 extends keyof T>(errorCode: K, path?: [K1]): E[K] | null;
  getError<K extends keyof E, K1 extends keyof T, K2 extends keyof T[K1]>(errorCode: K, path?: [K1, K2]): E[K] | null;
  getError<K extends keyof E, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
    errorCode: K,
    path?: [K1, K2, K3]
  ): E[K] | null;
  getError<K extends keyof E>(errorCode: K, path?: string): E[K] | null;
  getError<K extends keyof E>(errorCode: K, path?: any): E[K] | null {
    return super.getError(errorCode as any, path) as E[K] | null;
  }

  hasErrorAndTouched<P1 extends keyof T>(error: ExtractStrings<E>, prop1?: P1): boolean;
  hasErrorAndTouched<P1 extends keyof T, P2 extends keyof T[P1]>(
    error: ExtractStrings<E>,
    prop1?: P1,
    prop2?: P2
  ): boolean;
  hasErrorAndTouched<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2]>(
    error: ExtractStrings<E>,
    prop1?: P1,
    prop2?: P2,
    prop3?: P3
  ): boolean;
  hasErrorAndTouched<
    P1 extends keyof T,
    P2 extends keyof T[P1],
    P3 extends keyof T[P1][P2],
    P4 extends keyof T[P1][P2][P3]
  >(error: ExtractStrings<E>, prop1?: P1, prop2?: P2, prop3?: P3, prop4?: P4): boolean;
  hasErrorAndTouched(error: any, ...path: any): boolean {
    return hasErrorAndTouched(this, error, ...path);
  }

  hasErrorAndDirty<P1 extends keyof T>(error: ExtractStrings<E>, prop1?: P1): boolean;
  hasErrorAndDirty<P1 extends keyof T, P2 extends keyof T[P1]>(
    error: ExtractStrings<E>,
    prop1?: P1,
    prop2?: P2
  ): boolean;
  hasErrorAndDirty<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2]>(
    error: ExtractStrings<E>,
    prop1?: P1,
    prop2?: P2,
    prop3?: P3
  ): boolean;
  hasErrorAndDirty<
    P1 extends keyof T,
    P2 extends keyof T[P1],
    P3 extends keyof T[P1][P2],
    P4 extends keyof T[P1][P2][P3]
  >(error: ExtractStrings<E>, prop1?: P1, prop2?: P2, prop3?: P3, prop4?: P4): boolean;
  hasErrorAndDirty(error: any, ...path: any): boolean {
    return hasErrorAndDirty(this, error, ...path);
  }

  setEnable(enable = true, opts?: ControlEventOptions) {
    enableControl(this, enable, opts);
  }

  setDisable(disable = true, opts?: ControlEventOptions) {
    disableControl(this, disable, opts);
  }
}
