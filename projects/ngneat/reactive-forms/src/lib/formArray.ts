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
  AsyncValidator,
  AsyncValidatorFn,
  ControlEventOptions,
  ControlOptions,
  ControlPath,
  ControlState,
  EmitEvent,
  ExtractStrings,
  OnlySelf,
  Validator,
  ValidatorOrOpts,
  ControlValue,
  AbstractControlOf,
  ValidatorFn,
  DeepPartial,
  UpdateValueAndValidityOptions
} from './types';
import { coerceArray, mergeErrors, removeError } from './utils';

export class FormArray<T = any, E extends object = any> extends NgFormArray {
  readonly value: ControlValue<T>[];
  readonly valueChanges: Observable<ControlValue<T>[]>;
  readonly status: ControlState;
  readonly statusChanges: Observable<ControlState>;
  readonly errors: E | null;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();
  private errorsSubject = new Subject<Partial<E>>();

  readonly touch$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
  readonly dirty$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());

  readonly value$ = controlValueChanges$<ControlValue<T>[]>(this);
  readonly disabled$ = controlDisabled$(this);
  readonly enabled$ = controlEnabled$(this);
  readonly status$ = controlStatusChanges$(this);
  readonly errors$ = controlErrorChanges$<E>(this, this.errorsSubject.asObservable());

  get asyncValidator(): AsyncValidatorFn<T[]> | null {
    return super.asyncValidator;
  }
  set asyncValidator(asyncValidator: AsyncValidatorFn<T[]> | null) {
    super.asyncValidator = asyncValidator;
  }

  get validator(): ValidatorFn<T[]> | null {
    return super.validator;
  }
  set validator(validator: ValidatorFn<T[]> | null) {
    super.validator = validator;
  }

  constructor(
    public controls: Array<AbstractControlOf<T>>,
    validatorOrOpts?: ValidatorOrOpts,
    asyncValidator?: AsyncValidator
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  select<R>(mapFn: (state: ControlValue<T>[]) => R): Observable<R> {
    return this.value$.pipe(map(mapFn), distinctUntilChanged());
  }

  getRawValue(): ControlValue<T>[] {
    return super.getRawValue();
  }

  at(index: number): AbstractControlOf<T> {
    return super.at(index) as AbstractControlOf<T>;
  }

  setValue(valueOrObservable: Observable<ControlValue<T>[]>, options?: ControlEventOptions): Subscription;
  setValue(valueOrObservable: ControlValue<T>[], options?: ControlEventOptions): void;
  setValue(
    valueOrObservable: ControlValue<T>[] | Observable<ControlValue<T>[]>,
    options?: ControlEventOptions
  ): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    }

    super.setValue(valueOrObservable, options);
  }

  patchValue(
    valueOrObservable: Observable<DeepPartial<ControlValue<T>>[]>,
    options?: ControlEventOptions
  ): Subscription;
  patchValue(valueOrObservable: DeepPartial<ControlValue<T>>[], options?: ControlEventOptions): void;
  patchValue(valueOrObservable: any, options?: ControlEventOptions): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe((value: T[]) => super.patchValue(value, options));
    }

    super.patchValue(valueOrObservable as T[], options);
  }

  push(control: AbstractControlOf<T>): void {
    return super.push(control);
  }

  insert(index: number, control: AbstractControlOf<T>): void {
    return super.insert(index, control);
  }

  setControl(index: number, control: AbstractControlOf<T>): void {
    return super.setControl(index, control);
  }

  disabledWhile(observable: Observable<boolean>, options?: ControlOptions) {
    return controlDisabledWhile(this, observable, options);
  }

  enabledWhile(observable: Observable<boolean>, options?: ControlOptions) {
    return controlEnabledWhile(this, observable, options);
  }

  mergeValidators(validators: Validator, options?: UpdateValueAndValidityOptions) {
    mergeControlValidators(this, validators, options);
  }

  mergeAsyncValidators(validators: AsyncValidator, options?: UpdateValueAndValidityOptions) {
    this.setAsyncValidators([this.asyncValidator, ...coerceArray(validators)]);
    this.updateValueAndValidity(options);
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

  reset(value?: ControlValue<T>[], options?: ControlEventOptions): void {
    super.reset(value, options);
  }

  setValidators(newValidator: Validator, options?: UpdateValueAndValidityOptions): void {
    super.setValidators(newValidator);
    super.updateValueAndValidity(options);
  }

  setAsyncValidators(newValidator: AsyncValidator, options?: UpdateValueAndValidityOptions): void {
    super.setAsyncValidators(newValidator);
    super.updateValueAndValidity(options);
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
    this.errorsSubject.next(errors);
    return super.setErrors(errors, opts);
  }

  mergeErrors(errors: Partial<E>, opts: EmitEvent = {}): void {
    this.setErrors(mergeErrors<E>(this.errors, errors), opts);
  }

  removeError(key: keyof E, opts: EmitEvent = {}): void {
    this.setErrors(removeError<E>(this.errors, key), opts);
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

  remove(value: T): void {
    this.removeWhen(v => v.value === value);
  }

  removeWhen(predicate: (element: AbstractControlOf<T>) => boolean): void {
    for (let i = this.length - 1; i >= 0; --i) {
      if (predicate(this.at(i))) {
        this.removeAt(i);
      }
    }
  }
}
