import { FormArray as NgFormArray } from '@angular/forms';
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
  mergeControlValidators
} from './control-actions';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  ControlOptions,
  ExtendedAbstractControl,
  LimitedControlOptions,
  ValidatorFn
} from './types';
import { isFunction } from './utils';

export class FormArray<T = null> extends NgFormArray {
  value: T[];

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
    public controls: AbstractControl<T>[],
    validatorOrOpts?: ValidatorFn<T> | ValidatorFn<T[]>[] | AbstractControlOptions<T[]> | null,
    asyncValidator?: AsyncValidatorFn<T[]> | AsyncValidatorFn<T[]>[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  connect(observable: Observable<T[]>, options?: ControlOptions) {
    return connectControl(this, observable, options);
  }

  select<R>(mapFn: (state: T[]) => R): Observable<R> {
    return this.valueChanges$.pipe(map(mapFn), distinctUntilChanged());
  }

  getRawValue(): T[] {
    return super.getRawValue();
  }

  at(index: number): ExtendedAbstractControl<T> {
    return super.at(index) as ExtendedAbstractControl<T>;
  }

  setValue(valueOrObservable: Observable<T[]>, options?: LimitedControlOptions): Subscription;
  setValue(valueOrObservable: T[], options?: LimitedControlOptions): void;
  setValue(valueOrObservable: T[] | Observable<T[]>, options?: LimitedControlOptions): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    } else {
      super.setValue(valueOrObservable, options);
    }
  }

  patchValue(valueOrObservable: Observable<T[]>, options?: LimitedControlOptions): Subscription;
  patchValue(valueOrObservable: T[], options?: LimitedControlOptions): void;
  patchValue(valueOrObservable: (state: T[]) => T[], options?: ControlOptions): void;
  patchValue(
    valueOrObservable: T[] | Observable<T[]> | ((state: T[]) => T[]),
    options?: LimitedControlOptions
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

  enableWhile(observable: Observable<boolean>, options?: ControlOptions) {
    return controlEnabledWhile(this, observable, options);
  }

  mergeValidators(validators: ValidatorFn<T[]> | ValidatorFn<T[]>[]) {
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

  reset(value?: T[], options?: LimitedControlOptions): void {
    super.reset(value, options);
  }

  setValidators(newValidator: ValidatorFn<T[]> | ValidatorFn<T[]>[] | null): void {
    super.setValidators(newValidator);
    super.updateValueAndValidity();
  }

  setAsyncValidators(newValidator: AsyncValidatorFn<T[]> | AsyncValidatorFn<T[]>[] | null): void {
    super.setAsyncValidators(newValidator);
    super.updateValueAndValidity();
  }

  validateOn(observableValidation: Observable<null | object>) {
    return observableValidation.subscribe(maybeError => {
      this.setErrors(maybeError);
    });
  }

  hasErrorAndTouched(error: string, ...path: any): boolean {
    return hasErrorAndTouched(this, error, ...path);
  }

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
