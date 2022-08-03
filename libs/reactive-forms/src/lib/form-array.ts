import {
  AbstractControl,
  UntypedFormArray,
  ValidationErrors,
} from '@angular/forms';
import { isObservable, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {ControlsOf, FormControl, FormGroup, ValuesOf} from '..';
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

type ValueOfControl<T> = T extends FormControl<infer C>
  ?  C
  : T extends FormGroup<infer C> ? ValuesOf<C> : never;


export class FormArray<
  T,
  Control extends AbstractControl = T extends Record<any, any>
    ? FormGroup<ControlsOf<T>>
    : FormControl<T>
> extends UntypedFormArray {
  readonly value!: ValueOfControl<Control>[];
  readonly valueChanges!: Observable<ValueOfControl<Control>[]>;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();
  private errorsSubject = new Subject<ValidationErrors | null>();

  readonly touch$ = this.touchChanges
    .asObservable()
    .pipe(distinctUntilChanged());
  readonly dirty$ = this.dirtyChanges
    .asObservable()
    .pipe(distinctUntilChanged());
  readonly value$ = controlValueChanges$<Array<ValueOfControl<Control>>>(this);
  readonly disabled$ = controlStatus$(this, 'disabled');
  readonly enabled$ = controlStatus$(this, 'enabled');
  readonly invalid$ = controlStatus$(this, 'invalid');
  readonly valid$ = controlStatus$(this, 'valid');
  readonly status$ = controlStatus$(this, 'status');
  readonly errors$ = controlErrorChanges$(
    this,
    this.errorsSubject.asObservable()
  );

  constructor(
    public controls: Array<Control>,
    validatorOrOpts?: ConstructorParameters<typeof UntypedFormArray>[1],
    asyncValidator?: ConstructorParameters<typeof UntypedFormArray>[2]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  select<R>(mapFn: (state: ValueOfControl<Control>[]) => R): Observable<R> {
    return this.value$.pipe(map(mapFn), distinctUntilChanged());
  }

  setValue(
    valueOrObservable: Observable<ValueOfControl<Control>[]>,
    options?: Parameters<UntypedFormArray['setValue']>[1]
  ): Subscription;
  setValue(
    valueOrObservable: ValueOfControl<Control>[],
    options?: Parameters<UntypedFormArray['setValue']>[1]
  ): void;
  setValue(
    valueOrObservable: any,
    options?: Parameters<UntypedFormArray['setValue']>[1]
  ): any {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe((value) =>
        super.setValue(value as T[], options)
      );
    }

    super.setValue(valueOrObservable, options);
  }

  patchValue(
    valueOrObservable: Observable<DeepPartial<ValueOfControl<Control>>[]>,
    options?: Parameters<UntypedFormArray['patchValue']>[1]
  ): Subscription;
  patchValue(
    valueOrObservable: DeepPartial<ValueOfControl<Control>>[],
    options?: Parameters<UntypedFormArray['patchValue']>[1]
  ): void;
  patchValue(valueOrObservable: any, options?: any): any {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe((value) =>
        super.patchValue(value as T[], options)
      );
    }

    super.patchValue(valueOrObservable, options);
  }

  getRawValue(): ValueOfControl<Control>[] {
    return super.getRawValue();
  }

  push(control: Control, options?: Parameters<UntypedFormArray['push']>[1]) {
    return super.push(control, options);
  }

  insert(index: number, control: Control, options?: Parameters<UntypedFormArray['insert']>[2]) {
    return super.insert(index, control, options);
  }

  setControl(index: number, control: Control, options?: Parameters<UntypedFormArray['setControl']>[2]) {
    return super.setControl(index, control, options);
  }

  at(index: number): Control {
    return super.at(index) as Control;
  }

  remove(value: ValueOfControl<Control>,  options?: Parameters<UntypedFormArray['removeAt']>[1]): void {
    this.removeWhen((v) => v.value === value);
  }

  removeWhen(predicate: (element: Control) => boolean, options?: Parameters<UntypedFormArray['removeAt']>[1]): void {
    for (let i = this.length - 1; i >= 0; --i) {
      if (predicate(this.at(i))) {
        this.removeAt(i, options);
      }
    }
  }

  markAsTouched(
    ...opts: Parameters<UntypedFormArray['markAllAsTouched']>
  ): ReturnType<UntypedFormArray['markAllAsTouched']> {
    super.markAsTouched(...opts);
    this.touchChanges.next(true);
  }

  markAsUntouched(
    ...opts: Parameters<UntypedFormArray['markAsUntouched']>
  ): ReturnType<UntypedFormArray['markAsUntouched']> {
    super.markAsUntouched(...opts);
    this.touchChanges.next(false);
  }

  markAsPristine(
    ...opts: Parameters<UntypedFormArray['markAsPristine']>
  ): ReturnType<UntypedFormArray['markAsPristine']> {
    super.markAsPristine(...opts);
    this.dirtyChanges.next(false);
  }

  markAsDirty(
    ...opts: Parameters<UntypedFormArray['markAsDirty']>
  ): ReturnType<UntypedFormArray['markAsDirty']> {
    super.markAsDirty(...opts);
    this.dirtyChanges.next(true);
  }

  markAllAsDirty(): void {
    markAllDirty(this);
  }

  setEnable(enable = true, opts?: Parameters<UntypedFormArray['enable']>[0]) {
    enableControl(this, enable, opts);
  }

  setDisable(disable = true, opts?: Parameters<UntypedFormArray['disable']>[0]) {
    disableControl(this, disable, opts);
  }

  disabledWhile(
    observable: Observable<boolean>,
    options?: Parameters<UntypedFormArray['disable']>[0]
  ) {
    return controlDisabledWhile(this, observable, options);
  }

  enabledWhile(
    observable: Observable<boolean>,
    options?: Parameters<UntypedFormArray['enable']>[0]
  ) {
    return controlEnabledWhile(this, observable, options);
  }

  reset(
    formState?: ValueOfControl<Control>[],
    options?: Parameters<UntypedFormArray['reset']>[1]
  ): void {
    super.reset(formState, options);
  }

  setValidators(
    newValidators: Parameters<UntypedFormArray['setValidators']>[0],
    options?: Parameters<UntypedFormArray['updateValueAndValidity']>[0]
  ) {
    super.setValidators(newValidators);
    super.updateValueAndValidity(options);
  }

  setAsyncValidators(
    newValidator: Parameters<UntypedFormArray['setAsyncValidators']>[0],
    options?: Parameters<UntypedFormArray['updateValueAndValidity']>[0]
  ) {
    super.setAsyncValidators(newValidator);
    super.updateValueAndValidity(options);
  }

  getError<E>(...params: Parameters<UntypedFormArray['getError']>): E | null {
    return super.getError(...params);
  }

  setErrors(...opts: Parameters<UntypedFormArray['setErrors']>) {
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
    opts?: Parameters<UntypedFormArray['setErrors']>[1]
  ) {
    this.setErrors(mergeErrors(this.errors, errors), opts);
  }

  removeError(
    key: string,
    opts?: Parameters<UntypedFormArray['setErrors']>[1]
  ): void {
    this.setErrors(removeError(this.errors, key), opts);
  }

  hasErrorAndTouched(
    error: string,
    path?: Parameters<UntypedFormArray['hasError']>[1]
  ): boolean {
    return hasErrorAnd('touched', this, error, path);
  }

  hasErrorAndDirty(
    error: string,
    path?: Parameters<UntypedFormArray['hasError']>[1]
  ): boolean {
    return hasErrorAnd('dirty', this, error, path);
  }
}
