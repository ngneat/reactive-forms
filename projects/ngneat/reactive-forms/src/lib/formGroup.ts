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
  ControlsValue
} from './types';
import { coerceArray } from './utils';

export class FormGroup<C extends NgFormGroup['controls'] = { [key: string]: AbstractControl },
  E extends object = any> extends NgFormGroup {
  readonly value: ControlsValue<C>;
  readonly errors: E | null;
  readonly valueChanges: Observable<ControlsValue<C>>;
  readonly status: ControlState;
  readonly statusChanges: Observable<ControlState>;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();

  touch$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
  dirty$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());

  readonly value$ = controlValueChanges$<ControlsValue<C>>(this);
  readonly disabled$ = controlDisabled$<ControlsValue<C>>(this);
  readonly enabled$ = controlEnabled$<ControlsValue<C>>(this);
  readonly status$ = controlStatusChanges$<ControlsValue<C>>(this);
  readonly errors$ = controlErrorChanges$<E>(this);

  constructor(public controls: C, validatorOrOpts?: ValidatorOrOpts, asyncValidator?: AsyncValidator) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  select<R>(mapFn: (state: ControlsValue<C>) => R): Observable<R> {
    return selectControlValue$(this, mapFn);
  }

  getRawValue(): ControlsValue<C> {
    return super.getRawValue();
  }

  get<K1 extends keyof ControlsValue<C>>(path?: [K1]): C[K1];
  get<K1 extends keyof ControlsValue<C>, K2 extends keyof ControlsValue<C>[K1]>(path?: [K1, K2]): C[K1] extends FormGroup
    ? C[K1]['controls'][K2]
    : C[K1] extends AbstractControl
      ? AbstractControl<ControlsValue<C>[K1][K2]> : never;
  get<K1 extends keyof ControlsValue<C>,
    K2 extends keyof ControlsValue<C>[K1],
    K3 extends keyof ControlsValue<C>[K1][K2]>(path?: [K1, K2, K3]): C[K1] extends FormGroup
    ? C[K1]['controls'][K2] extends FormGroup
      ? C[K1]['controls'][K2]['controls'][K3]
      : C[K1]['controls'][K2] extends AbstractControl
        ? AbstractControl<ControlsValue<C>[K1][K2][K3]>
        : C[K1] extends AbstractControl
          ? AbstractControl<ControlsValue<C>[K1][K2][K3]> : never : never;
  get(path?: string): C[keyof ControlsValue<C>];
  get(path: Array<string | number> | string) {
    return super.get(path);
  }

  getControl<P1 extends keyof ControlsValue<C>>(prop1: P1): C[P1];
  getControl<P1 extends keyof ControlsValue<C>, P2 extends keyof ControlsValue<C>[P1]>(prop1: P1, prop2: P2): C[P1][P2];
  getControl<P1 extends keyof ControlsValue<C>,
    P2 extends keyof ControlsValue<C>[P1],
    P3 extends keyof ControlsValue<C>[P1][P2]>(prop1: P1, prop2: P2, prop3: P3): C[P1][P2][P3];
  getControl<P1 extends keyof ControlsValue<C>,
    P2 extends keyof ControlsValue<C>[P1],
    P3 extends keyof ControlsValue<C>[P1][P2],
    P4 extends keyof ControlsValue<C>[P1][P2][P3]>(prop1: P1, prop2: P2, prop3: P3, prop4: P4): AbstractControl<ControlsValue<C>[P1][P2][P3][P4]>;
  getControl(...names: any): AbstractControl<any> {
    return this.get(names.join('.'));
  }

  addControl<K extends ExtractStrings<C>>(name: K, control: C[K]): void {
    super.addControl(name, control);
  }

  removeControl(name: ExtractStrings<C>): void {
    super.removeControl(name);
  }

  contains(controlName: ExtractStrings<C>): boolean {
    return super.contains(controlName);
  }

  setControl<K extends ExtractStrings<C>>(name: K, control: C[K]): void {
    super.setControl(name, control);
  }

  setValue(valueOrObservable: Observable<ControlsValue<C>>, options?: ControlEventOptions): Subscription;
  setValue(valueOrObservable: ControlsValue<C>, options?: ControlEventOptions): void;
  setValue(valueOrObservable: any, options?: ControlEventOptions): any {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    }

    super.setValue(valueOrObservable, options);
  }

  patchValue(valueOrObservable: Observable<Partial<ControlsValue<C>>>, options?: ControlEventOptions): Subscription;
  patchValue(valueOrObservable: Partial<ControlsValue<C>>, options?: ControlEventOptions): void;
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

  reset(formState?: Partial<ControlsValue<C>>, options?: ControlEventOptions): void {
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

  hasError<K1 extends keyof ControlsValue<C>>(errorCode: ExtractStrings<E>, path?: [K1]): boolean;
  hasError<K1 extends keyof ControlsValue<C>, K2 extends keyof ControlsValue<C>[K1]>(
    errorCode: ExtractStrings<E>,
    path?: [K1, K2]
  ): boolean;
  hasError<K1 extends keyof ControlsValue<C>,
    K2 extends keyof ControlsValue<C>[K1],
    K3 extends keyof ControlsValue<C>[K1][K2]>(errorCode: ExtractStrings<E>, path?: [K1, K2, K3]): boolean;
  hasError(errorCode: ExtractStrings<E>, path?: string): boolean;
  hasError(errorCode: ExtractStrings<E>, path?: any): boolean {
    return super.hasError(errorCode, path);
  }

  setErrors(errors: Partial<E> | null, opts: EmitEvent = {}) {
    return super.setErrors(errors, opts);
  }

  getError<K extends keyof E, K1 extends keyof ControlsValue<C>>(errorCode: K, path?: [K1]): E[K] | null;
  getError<K extends keyof E, K1 extends keyof ControlsValue<C>, K2 extends keyof ControlsValue<C>[K1]>(
    errorCode: K,
    path?: [K1, K2]
  ): E[K] | null;
  getError<K extends keyof E,
    K1 extends keyof ControlsValue<C>,
    K2 extends keyof ControlsValue<C>[K1],
    K3 extends keyof ControlsValue<C>[K1][K2]>(errorCode: K, path?: [K1, K2, K3]): E[K] | null;
  getError<K extends keyof E>(errorCode: K, path?: string): E[K] | null;
  getError<K extends keyof E>(errorCode: K, path?: any): E[K] | null {
    return super.getError(errorCode as any, path) as E[K] | null;
  }

  hasErrorAndTouched<P1 extends keyof ControlsValue<C>>(error: ExtractStrings<E>, prop1?: P1): boolean;
  hasErrorAndTouched<P1 extends keyof ControlsValue<C>, P2 extends keyof ControlsValue<C>[P1]>(
    error: ExtractStrings<E>,
    prop1?: P1,
    prop2?: P2
  ): boolean;
  hasErrorAndTouched<P1 extends keyof ControlsValue<C>,
    P2 extends keyof ControlsValue<C>[P1],
    P3 extends keyof ControlsValue<C>[P1][P2]>(error: ExtractStrings<E>, prop1?: P1, prop2?: P2, prop3?: P3): boolean;
  hasErrorAndTouched<P1 extends keyof ControlsValue<C>,
    P2 extends keyof ControlsValue<C>[P1],
    P3 extends keyof ControlsValue<C>[P1][P2],
    P4 extends keyof ControlsValue<C>[P1][P2][P3]>(error: ExtractStrings<E>, prop1?: P1, prop2?: P2, prop3?: P3, prop4?: P4): boolean;
  hasErrorAndTouched(error: any, ...path: any): boolean {
    return hasErrorAndTouched(this, error, ...path);
  }

  hasErrorAndDirty<P1 extends keyof ControlsValue<C>>(error: ExtractStrings<E>, prop1?: P1): boolean;
  hasErrorAndDirty<P1 extends keyof ControlsValue<C>, P2 extends keyof ControlsValue<C>[P1]>(
    error: ExtractStrings<E>,
    prop1?: P1,
    prop2?: P2
  ): boolean;
  hasErrorAndDirty<P1 extends keyof ControlsValue<C>,
    P2 extends keyof ControlsValue<C>[P1],
    P3 extends keyof ControlsValue<C>[P1][P2]>(error: ExtractStrings<E>, prop1?: P1, prop2?: P2, prop3?: P3): boolean;
  hasErrorAndDirty<P1 extends keyof ControlsValue<C>,
    P2 extends keyof ControlsValue<C>[P1],
    P3 extends keyof ControlsValue<C>[P1][P2],
    P4 extends keyof ControlsValue<C>[P1][P2][P3]>(error: ExtractStrings<E>, prop1?: P1, prop2?: P2, prop3?: P3, prop4?: P4): boolean;
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
