import { FormGroup as NgFormGroup } from '@angular/forms';
import {
  isObservable,
  Observable,
  Subject,
  Subscription
} from 'rxjs';
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
  AsyncValidator,
  ControlEventOptions,
  ControlOptions,
  ControlState,
  EmitEvent,
  ExtractAbstractControl,
  ExtractStrings,
  KeyValueControls,
  Obj,
  OnlySelf,
  Validator,
  ValidatorOrOpts,
  ControlsValue,
  ControlsOfValue
} from './types';
import { coerceArray } from './utils';
import { FormArray } from './formArray';

export class FormGroup<T extends Obj = any,
  E extends object = any> extends NgFormGroup {
  readonly value: ControlsValue<T>;
  readonly errors: E | null;
  readonly valueChanges: Observable<ControlsValue<T>>;
  readonly status: ControlState;
  readonly statusChanges: Observable<ControlState>;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();

  touch$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
  dirty$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());

  readonly value$ = controlValueChanges$<ControlsValue<T>>(this);
  readonly disabled$ = controlDisabled$<ControlsValue<T>>(this);
  readonly enabled$ = controlEnabled$<ControlsValue<T>>(this);
  readonly status$ = controlStatusChanges$<ControlsValue<T>>(this);
  readonly errors$ = controlErrorChanges$<E>(this);

  constructor(public controls: ControlsOfValue<T>, validatorOrOpts?: ValidatorOrOpts, asyncValidator?: AsyncValidator) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  select<R>(mapFn: (state: ControlsValue<T>) => R): Observable<R> {
    return selectControlValue$(this, mapFn);
  }

  getRawValue(): ControlsValue<T> {
    return super.getRawValue();
  }

  get<K1 extends keyof ControlsValue<T>>(path?: [K1]): ControlsOfValue<T>[K1];
  get<K1 extends keyof ControlsValue<T>,
    K2 extends (ControlsOfValue<T>[K1] extends FormGroup | FormArray ? keyof ControlsOfValue<T>[K1]['controls'] : never)>(path?: [K1, K2]): ControlsOfValue<T>[K1] extends FormGroup | FormArray
    ? ControlsOfValue<T>[K1]['controls'][K2]
    : never;
  get<K1 extends keyof ControlsValue<T>,
    K2 extends keyof ControlsValue<T>[K1]>(path?: [K1, K2]): AbstractControl<ControlsValue<T>[K1][K2]>;
  get<K1 extends keyof ControlsValue<T>,
    K2 extends keyof ControlsValue<T>[K1],
    K3 extends keyof ControlsValue<T>[K1][K2],
    >(path?: [K1, K2, K3]): AbstractControl<ControlsValue<T>[K1][K2][K3]>;
  get(path?: Array<string | number> | string): AbstractControl;
  get(path: Array<string | number> | string) {
    return super.get(path);
  }

  getControl<P1 extends keyof ControlsValue<T>>(path?: P1): ControlsOfValue<T>[P1];
  getControl<P1 extends keyof ControlsValue<T>,
    P2 extends (ControlsOfValue<T>[P1] extends FormGroup | FormArray ? keyof ControlsOfValue<T>[P1]['controls'] : never)>(
    prop1: P1,
    prop2: P2,
  ): ControlsOfValue<T>[P1] extends FormGroup | FormArray
    ? ControlsOfValue<T>[P1]['controls'][P2]
    : never;
  getControl<P1 extends keyof ControlsValue<T>,
    P2 extends keyof ControlsValue<T>[P1]>(
    prop1: P1,
    prop2: P2,
  ): AbstractControl<ControlsValue<T>[P1][P2]>;
  getControl<P1 extends keyof ControlsValue<T>,
    P2 extends keyof ControlsValue<T>[P1],
    P3 extends keyof ControlsValue<T>[P1][P2],
    >(
    prop1: P1,
    prop2: P2,
    prop3: P3,
  ): AbstractControl<ControlsValue<T>[P1][P2][P3]>;
  getControl(path?: string): AbstractControl;
  getControl(...names: Array<string | number>): AbstractControl<any> {
    return this.get(names);
  }

  addControl<K extends ExtractStrings<T>>(name: K, control: ControlsOfValue<T>[K]): void {
    super.addControl(name, control);
  }

  removeControl(name: ExtractStrings<T>): void {
    super.removeControl(name);
  }

  contains(controlName: ExtractStrings<T>): boolean {
    return super.contains(controlName);
  }

  setControl<K extends ExtractStrings<T>>(name: K, control: ControlsOfValue<T>[K]): void {
    super.setControl(name, control);
  }

  setValue(valueOrObservable: Observable<ControlsValue<T>>, options?: ControlEventOptions): Subscription;
  setValue(valueOrObservable: ControlsValue<T>, options?: ControlEventOptions): void;
  setValue(valueOrObservable: any, options?: ControlEventOptions): any {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    }

    super.setValue(valueOrObservable, options);
  }

  patchValue(valueOrObservable: Observable<Partial<ControlsValue<T>>>, options?: ControlEventOptions): Subscription;
  patchValue(valueOrObservable: Partial<ControlsValue<T>>, options?: ControlEventOptions): void;
  patchValue(valueOrObservable: any, options?: ControlEventOptions): Subscription | void {
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

  mergeValidators(validators: Validator) {
    mergeControlValidators(this, validators);
  }

  mergeAsyncValidators(validators: AsyncValidator) {
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

  reset(formState?: Partial<ControlsValue<T>>, options?: ControlEventOptions): void {
    super.reset(formState, options);
  }

  setValidators(newValidator: Validator): void {
    super.setValidators(newValidator);
    super.updateValueAndValidity();
  }

  setAsyncValidators(newValidator: AsyncValidator): void {
    super.setAsyncValidators(newValidator);
    super.updateValueAndValidity();
  }

  validateOn(observableValidation: Observable<null | object>) {
    return validateControlOn(this, observableValidation);
  }

  hasError<K1 extends keyof ControlsValue<T>>(errorCode: ExtractStrings<E>, path?: [K1]): boolean;
  hasError<K1 extends keyof ControlsValue<T>, K2 extends keyof ControlsValue<T>[K1]>(
    errorCode: ExtractStrings<E>,
    path?: [K1, K2]
  ): boolean;
  hasError<K1 extends keyof ControlsValue<T>,
    K2 extends keyof ControlsValue<T>[K1],
    K3 extends keyof ControlsValue<T>[K1][K2]>(errorCode: ExtractStrings<E>, path?: [K1, K2, K3]): boolean;
  hasError(errorCode: ExtractStrings<E>, path?: string): boolean;
  hasError(errorCode: ExtractStrings<E>, path?: any): boolean {
    return super.hasError(errorCode, path);
  }

  setErrors(errors: Partial<E> | null, opts: EmitEvent = {}) {
    return super.setErrors(errors, opts);
  }

  getError<K extends keyof E, K1 extends keyof ControlsValue<T>>(errorCode: K, path?: [K1]): E[K] | null;
  getError<K extends keyof E, K1 extends keyof ControlsValue<T>, K2 extends keyof ControlsValue<T>[K1]>(
    errorCode: K,
    path?: [K1, K2]
  ): E[K] | null;
  getError<K extends keyof E,
    K1 extends keyof ControlsValue<T>,
    K2 extends keyof ControlsValue<T>[K1],
    K3 extends keyof ControlsValue<T>[K1][K2]>(errorCode: K, path?: [K1, K2, K3]): E[K] | null;
  getError<K extends keyof E>(errorCode: K, path?: string): E[K] | null;
  getError<K extends keyof E>(errorCode: K, path?: any): E[K] | null {
    return super.getError(errorCode as any, path) as E[K] | null;
  }

  hasErrorAndTouched<P1 extends keyof ControlsValue<T>>(error: ExtractStrings<E>, prop1?: P1): boolean;
  hasErrorAndTouched<P1 extends keyof ControlsValue<T>, P2 extends keyof ControlsValue<T>[P1]>(
    error: ExtractStrings<E>,
    prop1?: P1,
    prop2?: P2
  ): boolean;
  hasErrorAndTouched<P1 extends keyof ControlsValue<T>,
    P2 extends keyof ControlsValue<T>[P1],
    P3 extends keyof ControlsValue<T>[P1][P2]>(error: ExtractStrings<E>, prop1?: P1, prop2?: P2, prop3?: P3): boolean;
  hasErrorAndTouched<P1 extends keyof ControlsValue<T>,
    P2 extends keyof ControlsValue<T>[P1],
    P3 extends keyof ControlsValue<T>[P1][P2],
    P4 extends keyof ControlsValue<T>[P1][P2][P3]>(error: ExtractStrings<E>, prop1?: P1, prop2?: P2, prop3?: P3, prop4?: P4): boolean;
  hasErrorAndTouched(error: any, ...path: any): boolean {
    return hasErrorAndTouched(this, error, ...path);
  }

  hasErrorAndDirty<P1 extends keyof ControlsValue<T>>(error: ExtractStrings<E>, prop1?: P1): boolean;
  hasErrorAndDirty<P1 extends keyof ControlsValue<T>, P2 extends keyof ControlsValue<T>[P1]>(
    error: ExtractStrings<E>,
    prop1?: P1,
    prop2?: P2
  ): boolean;
  hasErrorAndDirty<P1 extends keyof ControlsValue<T>,
    P2 extends keyof ControlsValue<T>[P1],
    P3 extends keyof ControlsValue<T>[P1][P2]>(error: ExtractStrings<E>, prop1?: P1, prop2?: P2, prop3?: P3): boolean;
  hasErrorAndDirty<P1 extends keyof ControlsValue<T>,
    P2 extends keyof ControlsValue<T>[P1],
    P3 extends keyof ControlsValue<T>[P1][P2],
    P4 extends keyof ControlsValue<T>[P1][P2][P3]>(error: ExtractStrings<E>, prop1?: P1, prop2?: P2, prop3?: P3, prop4?: P4): boolean;
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
