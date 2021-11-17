import {
  AbstractControl,
  FormArray as NgFormArray,
  ValidationErrors,
} from '@angular/forms';
import { isObservable, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ControlsOf, FormControl, FormGroup } from '..';
import {
  controlValueChanges$,
  controlStatus$,
  controlErrorChanges$,
  hasErrorAnd,
  mergeErrors,
  removeError,
  controlDisabledWhile,
  controlEnabledWhile,
  disableControl,
  enableControl,
  markAllDirty,
} from './core';
import { DeepPartial } from './types';

export class FormArray<
  T,
  Control extends AbstractControl = T extends Record<any, any>
  ? FormGroup<ControlsOf<T>>
  : FormControl<T>
  > extends NgFormArray {
  readonly value!: T[];
  readonly valueChanges!: Observable<T[]>;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();
  private errorsSubject = new Subject<ValidationErrors | null>();

  readonly touch$ = this.touchChanges
    .asObservable()
    .pipe(distinctUntilChanged());
  readonly dirty$ = this.dirtyChanges
    .asObservable()
    .pipe(distinctUntilChanged());
  readonly value$ = controlValueChanges$<T[]>(this);
  readonly disabled$ = controlStatus$(this, 'disabled');
  readonly enabled$ = controlStatus$(this, 'enabled');
  readonly status$ = controlStatus$(this, 'status');
  readonly errors$ = controlErrorChanges$(
    this,
    this.errorsSubject.asObservable()
  );

  constructor(
    public controls: Array<Control>,
    validatorOrOpts?: ConstructorParameters<typeof NgFormArray>[1],
    asyncValidator?: ConstructorParameters<typeof NgFormArray>[2]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  select<R>(mapFn: (state: T[]) => R): Observable<R> {
    return this.value$.pipe(map(mapFn), distinctUntilChanged());
  }

  setValue(
    valueOrObservable: Observable<T[]>,
    options?: Parameters<AbstractControl['setValue']>[1]
  ): Subscription;
  setValue(
    valueOrObservable: T[],
    options?: Parameters<AbstractControl['setValue']>[1]
  ): void;
  setValue(
    valueOrObservable: any,
    options?: Parameters<AbstractControl['setValue']>[1]
  ): any {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe((value) =>
        super.setValue(value as T[], options)
      );
    }

    super.setValue(valueOrObservable, options);
  }

  patchValue(
    valueOrObservable: Observable<DeepPartial<T>[]>,
    options?: Parameters<AbstractControl['patchValue']>[1]
  ): Subscription;
  patchValue(
    valueOrObservable: DeepPartial<T>[],
    options?: Parameters<AbstractControl['patchValue']>[1]
  ): void;
  patchValue(valueOrObservable: any, options?: any): any {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe((value) =>
        super.patchValue(value as T[], options)
      );
    }

    super.patchValue(valueOrObservable, options);
  }

  getRawValue(): T[] {
    return super.getRawValue();
  }

  push(control: Control) {
    return super.push(control);
  }

  insert(index: number, control: Control) {
    return super.insert(index, control);
  }

  setControl(index: number, control: Control) {
    return super.setControl(index, control);
  }

  at(index: number): Control {
    return super.at(index) as Control;
  }

  remove(value: T): void {
    this.removeWhen((v) => v.value === value);
  }

  removeWhen(predicate: (element: Control) => boolean): void {
    for (let i = this.length - 1; i >= 0; --i) {
      if (predicate(this.at(i))) {
        this.removeAt(i);
      }
    }
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

  setEnable(enable = true, opts?: Parameters<AbstractControl['enable']>[0]) {
    enableControl(this, enable, opts);
  }

  setDisable(disable = true, opts?: Parameters<AbstractControl['disable']>[0]) {
    disableControl(this, disable, opts);
  }

  disabledWhile(
    observable: Observable<boolean>,
    options?: Parameters<AbstractControl['disable']>[0]
  ) {
    return controlDisabledWhile(this, observable, options);
  }

  enabledWhile(
    observable: Observable<boolean>,
    options?: Parameters<AbstractControl['enable']>[0]
  ) {
    return controlEnabledWhile(this, observable, options);
  }

  reset(
    formState?: T[],
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
