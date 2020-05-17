import { FormGroup as NgFormGroup } from '@angular/forms';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  LimitedControlOptions,
  ControlOptions,
  ControlState,
  ValidatorFn,
  ExtractStrings
} from './types';
import { defer, isObservable, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { coerceArray } from './utils';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class FormGroup<T = null> extends NgFormGroup {
  value: T;

  private touchChanges = new Subject<boolean>();
  private dirtyChanges = new Subject<boolean>();

  touchChanges$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
  dirtyChanges$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());

  valueChanges$: Observable<T> = merge(
    this.valueChanges.pipe(map(() => this.getRawValue())),
    defer(() => of(this.getRawValue()))
  );

  disabledChanges$: Observable<boolean> = merge(
    this.statusChanges.pipe(
      map(() => this.disabled),
      distinctUntilChanged()
    ),
    defer(() => of(this.disabled))
  );

  enabledChanges$: Observable<boolean> = merge(
    this.statusChanges.pipe(
      map(() => this.enabled),
      distinctUntilChanged()
    ),
    defer(() => of(this.enabled))
  );

  statusChanges$: Observable<ControlState> = merge(
    defer(() => of(this.status as ControlState)),
    this.statusChanges.pipe(
      map(() => this.status as ControlState),
      distinctUntilChanged()
    )
  );

  constructor(
    public controls: { [K in keyof T]: AbstractControl<T[K]> },
    validatorOrOpts?: ValidatorFn<T> | ValidatorFn<T>[] | AbstractControlOptions<T> | null,
    asyncValidator?: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  connect(observable: Observable<T>, options?: ControlOptions) {
    return observable.subscribe(value => this.patchValue(value, options));
  }

  select<R>(mapFn: (state: T) => R): Observable<R> {
    return this.valueChanges$.pipe(map(mapFn), distinctUntilChanged());
  }

  getControl<P1 extends keyof T>(prop1: P1): AbstractControl<T[P1]>;
  getControl<P1 extends keyof T, P2 extends keyof T[P1]>(prop1: P1, prop2: P2): AbstractControl<T[P1][P2]>;
  getControl<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2]>(
    prop1: P1,
    prop2: P2,
    prop3: P3
  ): AbstractControl<T[P1][P2][P3]>;
  getControl<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2], P4 extends keyof T[P1][P2][P3]>(
    prop1: P1,
    prop2: P2,
    prop3: P3,
    prop4: P4
  ): AbstractControl<T[P1][P2][P3][P4]>;
  getControl(...names: any): any {
    return this.get(names.join('.'));
  }

  addControl<K extends ExtractStrings<T>>(name: K, control: AbstractControl<T[K]>): void {
    super.addControl(name, control);
  }

  removeControl(name: ExtractStrings<T>): void {
    super.removeControl(name);
  }

  contains(controlName: ExtractStrings<T>): boolean {
    return super.contains(controlName);
  }

  setControl<K extends ExtractStrings<T>>(name: K, control: AbstractControl<T[K]>): void {
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

  patchValue(valueOrObservable: Observable<T>, options?: LimitedControlOptions): Subscription;
  patchValue(valueOrObservable: T, options?: LimitedControlOptions): void;
  patchValue(valueOrObservable: T | Observable<T>, options?: LimitedControlOptions): Subscription | void {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.patchValue(value, options));
    } else {
      super.patchValue(valueOrObservable, options);
    }
  }

  disabledWhile(observable: Observable<boolean>, options?: ControlOptions) {
    return observable.subscribe(isDisabled => {
      isDisabled ? this.disable(options) : this.enable(options);
    });
  }

  enableWhile(observable: Observable<boolean>, options?: ControlOptions) {
    return observable.subscribe(isEnabled => {
      isEnabled ? this.enable(options) : this.disable(options);
    });
  }

  mergeValidators(validators: ValidatorFn<T> | ValidatorFn<T>[]) {
    this.setValidators([this.validator, ...coerceArray(validators)]);
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
    this.markAsDirty({ onlySelf: true });
    (this as any)._forEachChild(control => control.markAllAsDirty());
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
}
