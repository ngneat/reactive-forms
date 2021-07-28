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
  validateControlOn
} from './control-actions';
import {
  AsyncValidator,
  AsyncValidatorFn,
  ControlEventOptions,
  ControlOptions,
  ControlState,
  EmitEvent,
  ExtractStrings,
  OnlySelf,
  OrBoxedValue,
  UpdateValueAndValidityOptions,
  Validator,
  ValidatorFn,
  ValidatorOrOpts
} from './types';
import { coerceArray, mergeErrors, removeError, superAsyncValidator, superValidator } from './utils';

export class FormControl<T = any, E extends object = any> extends NgFormControl {
  readonly value: T;
  readonly errors: E | null;
  readonly valueChanges: Observable<T>;
  readonly status: ControlState;
  readonly statusChanges: Observable<ControlState>;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();
  private errorsSubject = new Subject<Partial<E>>();

  readonly touch$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
  readonly dirty$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());

  readonly value$ = controlValueChanges$<T>(this);
  readonly disabled$: Observable<boolean> = controlDisabled$<T>(this);
  readonly enabled$: Observable<boolean> = controlEnabled$<T>(this);
  readonly status$: Observable<ControlState> = controlStatusChanges$<T>(this);
  readonly errors$ = controlErrorChanges$<E>(this, this.errorsSubject.asObservable());

  get asyncValidator(): AsyncValidatorFn<T> | null {
    return superAsyncValidator.get.call(this);
  }
  set asyncValidator(asyncValidator: AsyncValidatorFn<T> | null) {
    superAsyncValidator.set.call(this, asyncValidator);
  }

  get validator(): ValidatorFn<T> | null {
    return superValidator.get.call(this);
  }
  set validator(validator: ValidatorFn<T> | null) {
    superValidator.set.call(this, validator);
  }

  constructor(formState?: OrBoxedValue<T>, validatorOrOpts?: ValidatorOrOpts, asyncValidator?: AsyncValidator) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  setValue(valueOrObservable: Observable<T>, options?: ControlOptions): Subscription;
  setValue(valueOrObservable: T, options?: ControlOptions): void;
  setValue(valueOrObservable: any, options?: ControlOptions): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    }

    super.setValue(valueOrObservable, options);
  }

  patchValue(valueOrObservable: Observable<T>, options?: ControlOptions): Subscription;
  patchValue(valueOrObservable: T, options?: ControlOptions): void;
  patchValue(valueOrObservable: any, options?: ControlOptions): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.patchValue(value, options));
    }

    super.patchValue(valueOrObservable, options);
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
    this.markAsDirty({ onlySelf: true });
  }

  reset(formState?: OrBoxedValue<T>, options?: ControlEventOptions): void {
    super.reset(formState, options);
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
    return validateControlOn(this, observableValidation);
  }

  getError<K extends ExtractStrings<E>>(errorCode: K): E[K] | null {
    return super.getError(errorCode) as E[K] | null;
  }

  hasError<K extends ExtractStrings<E>>(errorCode: K) {
    return super.hasError(errorCode);
  }

  setErrors(errors: Partial<E> | null, opts: EmitEvent = {}) {
    /**
     * @description
     * Use an elvis operator to avoid a throw when the control is used with an async validator
     * Which will be instantly resolved (like with `of(null)`)
     * In such case, Angular will call this method instantly before even instancing the properties causing the throw
     * Can be easily reproduced with a step-by-step debug once compiled when checking the stack trace of the constructor
     *
     * Issue: https://github.com/ngneat/reactive-forms/issues/91
     * Reproduction: https://codesandbox.io/embed/github/C0ZEN/ngneat-reactive-forms-error-issue-cs/tree/main/?autoresize=1&expanddevtools=1&fontsize=14&hidenavigation=1&theme=dark
     */
    this.errorsSubject?.next(errors);
    return super.setErrors(errors, opts);
  }

  mergeErrors(errors: Partial<E>, opts: EmitEvent = {}): void {
    this.setErrors(mergeErrors<E>(this.errors, errors), opts);
  }

  removeError(key: keyof E, opts: EmitEvent = {}): void {
    this.setErrors(removeError<E>(this.errors, key), opts);
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
