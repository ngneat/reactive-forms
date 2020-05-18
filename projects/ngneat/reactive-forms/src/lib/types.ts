import { AbstractControl as AngularAbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

export interface ValidatorFn<T> {
  (control: AbstractControl<T>): ValidationErrors | null;
}

export interface AsyncValidatorFn<T> {
  (control: AbstractControl<T>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
}

export interface ControlOptions {
  onlySelf?: boolean;
  emitEvent?: boolean;
  emitModelToViewChange?: boolean;
  emitViewToModelChange?: boolean;
}

export type LimitedControlOptions = Pick<ControlOptions, 'emitEvent' | 'onlySelf'>;

export interface AbstractControlOptions<T> {
  validators?: ValidatorFn<T> | ValidatorFn<T>[] | null;
  asyncValidators?: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null;
  updateOn?: 'change' | 'blur' | 'submit';
}

export type ControlState = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

export interface AbstractControl<T> extends AngularAbstractControl {
  value: T;
  validator: ValidatorFn<T> | null;
  asyncValidator: AsyncValidatorFn<T> | null;

  setValue(value: T, options?: ControlOptions): void;

  patchValue(value: Partial<T>, options?: ControlOptions): void;

  setValidators(newValidator: ValidatorFn<T> | ValidatorFn<T>[] | null): void;

  setAsyncValidators(newValidator: AsyncValidatorFn<T> | AsyncValidatorFn<T>[] | null): void;
}

export type ExtractStrings<T> = Extract<keyof T, string>;

export interface ExtendedAbstractControl<T> extends AbstractControl<T> {
  mergeValidators(validators: ValidatorFn<T> | ValidatorFn<T>[]): void;

  validateOn(observableValidation: Observable<null | object>): Subscription;

  markAllAsDirty(): void;

  disabledWhile(observable: Observable<boolean>, options?: ControlOptions): Subscription;

  enableWhile(observable: Observable<boolean>, options?: ControlOptions): Subscription;

  getControl?<P1 extends keyof T>(prop1: P1): ExtendedAbstractControl<T[P1]>;

  getControl?<P1 extends keyof T, P2 extends keyof T[P1]>(prop1: P1, prop2: P2): ExtendedAbstractControl<T[P1][P2]>;

  getControl?<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2]>(
    prop1: P1,
    prop2: P2,
    prop3: P3
  ): ExtendedAbstractControl<T[P1][P2][P3]>;

  getControl?<P1 extends keyof T, P2 extends keyof T[P1], P3 extends keyof T[P1][P2], P4 extends keyof T[P1][P2][P3]>(
    prop1: P1,
    prop2: P2,
    prop3: P3,
    prop4: P4
  ): ExtendedAbstractControl<T[P1][P2][P3][P4]>;

  getControl?(...names: any): any;

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
  >(
    error: string,
    prop1?: P1,
    prop2?: P2,
    prop3?: P3,
    prop4?: P4
  ): boolean;

  hasErrorAndTouched(error: string, ...path: any): any;

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
  >(
    error: string,
    prop1?: P1,
    prop2?: P2,
    prop3?: P3,
    prop4?: P4
  ): boolean;

  hasErrorAndDirty(error: string, ...path: any): any;
}
