import {
  AbstractControl,
  FormGroup as NgFormGroup,
  ValidationErrors,
} from '@angular/forms';
import { isObservable, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import {
  controlDisabledWhile,
  controlEnabledWhile,
  controlErrorChanges$,
  controlStatus$,
  controlValueChanges$,
  disableControl,
  enableControl,
  hasErrorAnd,
  markAllDirty,
  mergeErrors,
  removeError,
  selectControlValue$,
} from './core';
import { DeepPartial, ValuesOf } from './types';

export class FormGroup<T extends Record<string, any>> extends NgFormGroup {
  readonly value!: ValuesOf<T>;
  readonly valueChanges!: Observable<ValuesOf<T>>;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();
  private errorsSubject = new Subject<ValidationErrors | null>();

  readonly touch$ = this.touchChanges
    .asObservable()
    .pipe(distinctUntilChanged());
  readonly dirty$ = this.dirtyChanges
    .asObservable()
    .pipe(distinctUntilChanged());
  readonly value$ = controlValueChanges$<ValuesOf<T>>(this);
  readonly disabled$: Observable<boolean> = controlStatus$(this, 'disabled');
  readonly enabled$: Observable<boolean> = controlStatus$(this, 'enabled');
  readonly status$ = controlStatus$(this, 'status');
  readonly errors$ = controlErrorChanges$(
    this,
    this.errorsSubject.asObservable()
  );

  constructor(
    public controls: T,
    validatorOrOpts?: ConstructorParameters<typeof NgFormGroup>[1],
    asyncValidator?: ConstructorParameters<typeof NgFormGroup>[2]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  select<R>(mapFn: (state: ValuesOf<T>) => R): Observable<R> {
    return selectControlValue$(this, mapFn);
  }

  get<
    K extends keyof ValuesOf<T>,
    K1 extends keyof ValuesOf<T>[K],
    K2 extends keyof ValuesOf<T>[K][K1],
    FirstLevel = GroupPath<T[K], K1 & string>,
    SecondLevel = GroupPath<FirstLevel, K2 & string>
  >(keys: [K, K1, K2]): SecondLevel;
  get<K extends keyof ValuesOf<T>, K1 extends keyof ValuesOf<T>[K]>(
    keys: [K, K1]
  ): GroupPath<T[K], K1 & string>;

  get<K extends keyof ValuesOf<T>>(keys: [K]): T[K];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get<
    K extends string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    P = K extends `${infer Key}.${infer Rest}` ? unknown : K
  >(key: K): unknown extends P ? AbstractControl : T[K];
  get(key: string | string[]): AbstractControl {
    return super.get(key) as AbstractControl;
  }

  setValue(
    valueOrObservable: Observable<ValuesOf<T>>,
    options?: Parameters<AbstractControl['setValue']>[1]
  ): Subscription;
  setValue(
    valueOrObservable: ValuesOf<T>,
    options?: Parameters<AbstractControl['setValue']>[1]
  ): void;
  setValue(
    valueOrObservable: any,
    options?: Parameters<AbstractControl['setValue']>[1]
  ): any {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe((value) =>
        super.setValue(value as ValuesOf<T>, options)
      );
    }

    super.setValue(valueOrObservable, options);
  }

  patchValue(
    valueOrObservable: Observable<DeepPartial<ValuesOf<T>>>,
    options?: Parameters<AbstractControl['patchValue']>[1]
  ): Subscription;
  patchValue(
    valueOrObservable: DeepPartial<ValuesOf<T>>,
    options?: Parameters<AbstractControl['patchValue']>[1]
  ): void;
  patchValue(valueOrObservable: any, options?: any): any {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe((value) =>
        super.patchValue(value as DeepPartial<ValuesOf<T>>, options)
      );
    }

    super.patchValue(valueOrObservable, options);
  }

  getRawValue(): ValuesOf<T> {
    return super.getRawValue();
  }

  markAsTouched(
    ...opts: Parameters<AbstractControl['markAllAsTouched']>
  ): ReturnType<AbstractControl['markAllAsTouched']> {
    super.markAsTouched(...opts);
    this.touchChanges.next(true);
  }

  markAsUntouched(
    ...opts: Parameters<AbstractControl['markAsUntouched']>
  ): ReturnType<AbstractControl['markAsUntouched']> {
    super.markAsUntouched(...opts);
    this.touchChanges.next(false);
  }

  markAsPristine(
    ...opts: Parameters<AbstractControl['markAsPristine']>
  ): ReturnType<AbstractControl['markAsPristine']> {
    super.markAsPristine(...opts);
    this.dirtyChanges.next(false);
  }

  markAsDirty(
    ...opts: Parameters<AbstractControl['markAsDirty']>
  ): ReturnType<AbstractControl['markAsDirty']> {
    super.markAsDirty(...opts);
    this.dirtyChanges.next(true);
  }

  markAllAsDirty(): void {
    markAllDirty(this);
  }

  setEnable(enable = true, opts?: Parameters<AbstractControl['enable']>) {
    enableControl(this, enable, opts);
  }

  setDisable(disable = true, opts?: Parameters<AbstractControl['disable']>) {
    disableControl(this, disable, opts);
  }

  disabledWhile(
    observable: Observable<boolean>,
    options?: Parameters<AbstractControl['disable']>
  ) {
    return controlDisabledWhile(this, observable, options);
  }

  enabledWhile(
    observable: Observable<boolean>,
    options?: Parameters<AbstractControl['enable']>
  ) {
    return controlEnabledWhile(this, observable, options);
  }

  reset(
    formState?: ValuesOf<T>,
    options?: Parameters<AbstractControl['reset']>[1]
  ): void {
    super.reset(formState, options);
  }

  setValidators(
    newValidators: Parameters<AbstractControl['setValidators']>[0],
    options?: Parameters<AbstractControl['updateValueAndValidity']>[0]
  ) {
    super.setValidators(newValidators);
    super.updateValueAndValidity(options);
  }

  setAsyncValidators(
    newValidator: Parameters<AbstractControl['setAsyncValidators']>[0],
    options?: Parameters<AbstractControl['updateValueAndValidity']>[0]
  ) {
    super.setAsyncValidators(newValidator);
    super.updateValueAndValidity(options);
  }

  getError<E>(...params: Parameters<AbstractControl['getError']>): E | null {
    return super.getError(...params);
  }

  setErrors(...opts: Parameters<AbstractControl['setErrors']>) {
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
    this.errorsSubject?.next(opts[0]);
    return super.setErrors(...opts);
  }

  mergeErrors(
    errors: ValidationErrors | null,
    opts?: Parameters<AbstractControl['setErrors']>[1]
  ) {
    this.setErrors(mergeErrors(this.errors, errors), opts);
  }

  removeError(
    key: string,
    opts?: Parameters<AbstractControl['setErrors']>[1]
  ): void {
    this.setErrors(removeError(this.errors, key), opts);
  }

  hasErrorAndTouched(
    error: string,
    path?: Parameters<AbstractControl['hasError']>[1]
  ): boolean {
    return hasErrorAnd('touched', this, error, path);
  }

  hasErrorAndDirty(
    error: string,
    path?: Parameters<AbstractControl['hasError']>[1]
  ): boolean {
    return hasErrorAnd('dirty', this, error, path);
  }
}

type GroupPath<T, K extends string> = T extends FormGroup<infer U>
  ? U[K & string]
  : never;
