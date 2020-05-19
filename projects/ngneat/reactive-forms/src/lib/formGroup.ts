import { FormGroup as NgFormGroup } from '@angular/forms';
import { isObservable, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  connectControl,
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
  ControlOptions,
  ExtendedAbstractControl,
  ExtractStrings,
  LimitedControlOptions,
  ValidatorFn
} from './types';
import { isFunction } from './utils';

export class FormGroup<T extends object = null> extends NgFormGroup {
  value: T;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();

  touchChanges$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
  dirtyChanges$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());

  valueChanges$ = controlValueChanges$(this);
  disabledChanges$ = controlDisabled$(this);
  enabledChanges$ = controlEnabled$(this);
  statusChanges$ = controlStatusChanges$(this);
  errorChanges$ = controlErrorChanges$(this);

  constructor(
    public controls: { [K in keyof T]: AbstractControl<T[K]> },
    validatorOrOpts?: ValidatorFn<T> | ValidatorFn<T>[] | AbstractControlOptions<T> | null,
    asyncValidator?: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  connect(observable: Observable<Partial<T>>, options?: ControlOptions) {
    return connectControl(this, observable, options);
  }

  select<R>(mapFn: (state: T) => R): Observable<R> {
    return selectControlValue$(this, mapFn);
  }

  getRawValue(): T {
    return super.getRawValue();
  }

  getControl<P1 extends keyof T>(prop1: P1): ExtendedAbstractControl<T[P1]>;
  getControl<P1 extends keyof T, P2 extends keyof T[P1]>(prop1: P1, prop2: P2): ExtendedAbstractControl<T[P1][P2]>;
  getControl<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2]>(
    prop1: P1,
    prop2: P2,
    prop3: P3
  ): ExtendedAbstractControl<T[P1][P2][P3]>;
  getControl<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2], P4 extends keyof T[P1][P2][P3]>(
    prop1: P1,
    prop2: P2,
    prop3: P3,
    prop4: P4
  ): ExtendedAbstractControl<T[P1][P2][P3][P4]>;
  getControl(...names: any): any {
    return this.get(names.join('.'));
  }

  addControl<K extends ExtractStrings<T>>(name: K, control: ExtendedAbstractControl<T[K]>): void {
    super.addControl(name, control);
  }

  removeControl(name: ExtractStrings<T>): void {
    super.removeControl(name);
  }

  contains(controlName: ExtractStrings<T>): boolean {
    return super.contains(controlName);
  }

  setControl<K extends ExtractStrings<T>>(name: K, control: ExtendedAbstractControl<T[K]>): void {
    super.setControl(name, control);
  }

  setValue(valueOrObservable: Observable<T>, options?: LimitedControlOptions): Subscription;
  setValue(valueOrObservable: T, options?: LimitedControlOptions): void;
  setValue(valueOrObservable: T | Observable<T>, options?: LimitedControlOptions): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    } else {
      super.setValue(valueOrObservable, options);
    }
  }

  patchValue(valueOrObservable: Observable<Partial<T>>, options?: LimitedControlOptions): Subscription;
  patchValue(valueOrObservable: Partial<T>, options?: LimitedControlOptions): void;
  patchValue(valueOrObservable: (state: T) => T, options?: ControlOptions): void;
  patchValue(
    valueOrObservable: Partial<T> | Observable<Partial<T>> | ((state: T) => T),
    options?: LimitedControlOptions
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

  enableWhile(observable: Observable<boolean>, options?: ControlOptions) {
    return controlEnabledWhile(this, observable, options);
  }

  mergeValidators(validators: ValidatorFn<T> | ValidatorFn<T>[]) {
    mergeControlValidators(this, validators);
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
    return validateControlOn(this, observableValidation);
  }

  hasErrorAndTouched<P1 extends keyof T>(error: string, prop1?: P1): boolean;
  hasErrorAndTouched<P1 extends keyof T, P2 extends keyof T[P1]>(error: string, prop1?: P1, prop2?: P2): boolean;
  hasErrorAndTouched<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2]>(
    error: string,
    prop1?: P1,
    prop2?: P2,
    prop3?: P3
  ): boolean;
  hasErrorAndTouched<
    P1 extends keyof T,
    P2 extends keyof T[P1],
    P3 extends keyof T[P1][P2],
    P4 extends keyof T[P1][P2][P3]
  >(error: string, prop1?: P1, prop2?: P2, prop3?: P3, prop4?: P4): boolean;
  hasErrorAndTouched(error: string, ...path: any): boolean {
    return hasErrorAndTouched(this, error, ...path);
  }

  hasErrorAndDirty<P1 extends keyof T>(error: string, prop1?: P1): boolean;
  hasErrorAndDirty<P1 extends keyof T, P2 extends keyof T[P1]>(error: string, prop1?: P1, prop2?: P2): boolean;
  hasErrorAndDirty<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2]>(
    error: string,
    prop1?: P1,
    prop2?: P2,
    prop3?: P3
  ): boolean;
  hasErrorAndDirty<
    P1 extends keyof T,
    P2 extends keyof T[P1],
    P3 extends keyof T[P1][P2],
    P4 extends keyof T[P1][P2][P3]
  >(error: string, prop1?: P1, prop2?: P2, prop3?: P3, prop4?: P4): boolean;
  hasErrorAndDirty(error: string, ...path: any): boolean {
    return hasErrorAndDirty(this, error, ...path);
  }

  setEnable(enable = true, opts?: LimitedControlOptions) {
    enableControl(this, enable, opts);
  }

  setDisable(disable = true, opts?: LimitedControlOptions) {
    disableControl(this, disable, opts);
  }
}
