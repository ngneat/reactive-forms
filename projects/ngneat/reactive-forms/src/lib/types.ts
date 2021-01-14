import {
  AbstractControl as NgAbstractControl,
  AbstractControlOptions as NgAbstractControlOptions,
  ValidationErrors as NgValidationErrors
} from '@angular/forms';
import { Observable } from 'rxjs';
import { FormArray } from './formArray';
import { FormControl } from './formControl';
import { FormGroup } from './formGroup';
import { PersistManager } from './persistManager';

export type ValidationErrors<T = NgValidationErrors> = T;
export type ValidatorFn<T = any, E = any> = (
  control: AbstractControl<T> | NgAbstractControl
) => ValidationErrors<E> | null;
export type AsyncValidatorFn<T = any, E = any> = (
  control: AbstractControl<T> | NgAbstractControl
) => Promise<ValidationErrors<E> | null> | Observable<ValidationErrors<E> | null>;

export interface AbstractControlOptions<T = any, E = any> extends NgAbstractControlOptions {
  validators?: ValidatorFn<T, E> | ValidatorFn<T, E>[] | null;
  asyncValidators?: AsyncValidatorFn<T, E> | AsyncValidatorFn<T, E>[] | null;
}

export type ValidatorOrOpts = ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;
export type AsyncValidator = AsyncValidatorFn | AsyncValidatorFn[] | null;
export type Validator = ValidatorFn | ValidatorFn[];

export interface ControlOptions {
  onlySelf?: boolean;
  emitEvent?: boolean;
  emitModelToViewChange?: boolean;
  emitViewToModelChange?: boolean;
}

export type ControlEventOptions = Pick<ControlOptions, 'emitEvent' | 'onlySelf'>;
export type OnlySelf = Pick<ControlOptions, 'onlySelf'>;
export type EmitEvent = Pick<ControlOptions, 'emitEvent'>;
export type ControlPath = Array<string | number> | string;
export type ControlState = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

export interface AbstractControl<T = any, E extends object = any> extends NgAbstractControl {
  value: T;
  errors: E;
  touch$: Observable<boolean>;
  dirty$: Observable<boolean>;
  disabled$: Observable<boolean>;
  enabled$: Observable<boolean>;
  status$: Observable<ControlState>;
}

export type ExtractStrings<T> = Extract<keyof T, string>;

export interface NgValidatorsErrors {
  required: true;
  email: true;
  pattern: { requiredPattern: string; actualValue: string };
  minlength: { requiredLength: number; actualLength: number };
  maxlength: { requiredLength: number; actualLength: number };
  min: { min: number; actual: number };
  max: { max: number; actual: number };
}

export type BoxedValue<T> = { value: T; disabled?: boolean };
export type OrBoxedValue<T> = T | BoxedValue<T>;
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type Obj = { [key: string]: any };
type ArrayType<T> = T extends Array<infer R> ? R : any;

/*
 * Convert a Control type or a value type
 * Leaving non-control types as is
 * */
export type ControlValue<T> = T extends FormControl | FormGroup | FormArray | AbstractControl ? T['value'] : T;

/**
 * Convert an object of a FormGroup's "value" or "controls" to its "value"
 * */
export type ControlsValue<T extends object> = {
  [K in keyof T]: ControlValue<T[K]>;
};

type Primitive = number | string | boolean | null | undefined;

type UnwrapArray<T> = T extends Array<infer U> ? U : never;

type ExcludeControls<T> = Exclude<T, FormControl | FormGroup | FormArray>;

/**
 * Converts a value / form control to form control
 * Converting non-control types to AbstractControl of the type
 *
 * The intermediate type is to solve the issue of T being any, thus assignable to all condition and resulting in the "any" type.
 *
 * Note the use of an array is to prevent use of distributive conditional types. (https://github.com/microsoft/TypeScript/issues/37279)
 * */
type AbstractControlOfWithPotentialUnion<T> = [T] extends [AbstractControl]
  ? T
  : [T] extends [Primitive]
  ? FormControl<T> // in case we got no generic in the constructor, resolve the type as Abstract<T>.
  : T extends unknown
  ? AbstractControl<ExcludeControls<T>>
  : AbstractControl<T>;
export type AbstractControlOf<T> = AbstractControl extends AbstractControlOfWithPotentialUnion<T>
  ? AbstractControl<AbstractControlOfWithPotentialUnion<T>['value']>
  : AbstractControlOfWithPotentialUnion<T>;

/**
 * Convert an object of a FormGroup's "value" or "controls" to "controls".
 * Converting non-control types to AbstractControl of the type
 * */
export type AbstractControlsOf<T extends Obj> = {
  [K in keyof T]: AbstractControlOf<T[K]>;
};

/**
 * Use with FormGroup you want a FormControl for a primitive, a FormGroup for an object, and a FormArray for an array
 *
 * @example
 * new
 *   FormGroup<ControlsOf<{
 *   name: string;
 *   phone: {
 *     num: number;
 *     prefix: number;
 *   };
 *   children: string[],
 * }>>({
 *   name: new FormControl<string>(),
 *   phone: new FormGroup({
 *     num: new FormControl<number>(),
 *     prefix: new FormControl<number>(),
 *   }),
 *   children: new FormArray([
 *     new FormControl<number>()
 *   ])
 * });
 * */
type ExtractAny<T> = T extends Extract<T, string & number & boolean & object & null & undefined> ? any : never;
export type ControlOf<T> = [T] extends ExtractAny<T>
  ? AbstractControl<T>
  : [T] extends [any[]]
  ? FormArray<ControlOf<UnwrapArray<T>>>
  : [T] extends [object]
  ? FormGroup<ControlsOf<T>>
  : FormControl<T>;
export type ControlsOf<T extends Object, TOverrides extends Partial<AbstractControlsOf<T>> = {}> = {
  [key in keyof T]: unknown extends TOverrides[key] ? ControlOf<T[key]> : TOverrides[key];
};

export type ArrayKeys<T> = { [K in keyof T]: T[K] extends any[] ? K : never }[keyof T];
export type ControlFactory<T> = (value: T) => AbstractControl<T>;
export type ControlFactoryMap<T> = {
  [K in ArrayKeys<T>]?: ControlFactory<ArrayType<T[K]>>;
};

export interface PersistOptions<T> {
  debounceTime?: number;
  manager?: PersistManager<T>;
  arrControlFactory?: ControlFactoryMap<T>;
}

export type UpdateValueAndValidityOptions = Pick<ControlOptions, 'onlySelf' | 'emitEvent'>;
