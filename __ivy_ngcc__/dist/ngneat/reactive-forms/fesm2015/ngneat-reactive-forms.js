import {
  FormArray as FormArray$1,
  FormControl as FormControl$1,
  FormGroup as FormGroup$1,
  FormBuilder as FormBuilder$1
} from '@angular/forms';
import { merge, defer, of, Subject, isObservable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { __decorate } from 'tslib';
import { ɵɵdefineInjectable, Injectable } from '@angular/core';

import * as ɵngcc0 from '@angular/core';
function coerceArray(value) {
  return Array.isArray(value) ? value : [value];
}
function isFunction(x) {
  return typeof x === 'function';
}
function isNil(v) {
  return v === null || v === undefined;
}

function getControlValue(control) {
  if (control.getRawValue) {
    return control.getRawValue();
  }
  return control.value;
}
function compareErrors(a, b) {
  if (isNil(a) || isNil(b)) {
    return a === b;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}
function controlValueChanges$(control) {
  return merge(
    defer(() => of(getControlValue(control))),
    control.valueChanges.pipe(map(() => getControlValue(control)))
  );
}
function controlDisabled$(control) {
  return merge(
    defer(() => of(control.disabled)),
    control.statusChanges.pipe(
      map(() => control.disabled),
      distinctUntilChanged()
    )
  );
}
function controlEnabled$(control) {
  return merge(
    defer(() => of(control.enabled)),
    control.statusChanges.pipe(
      map(() => control.enabled),
      distinctUntilChanged()
    )
  );
}
function controlStatusChanges$(control) {
  return merge(
    defer(() => of(control.status)),
    control.statusChanges.pipe(
      map(() => control.status),
      distinctUntilChanged()
    )
  );
}
function controlErrorChanges$(control) {
  return merge(
    defer(() => of(control.errors)),
    control.valueChanges.pipe(
      map(() => control.errors),
      distinctUntilChanged((a, b) => compareErrors(a, b))
    )
  );
}
function enableControl(control, enabled, opts) {
  if (enabled) {
    control.enable(opts);
  } else {
    control.disable(opts);
  }
}
function disableControl(control, disabled, opts) {
  enableControl(control, !disabled, opts);
}
function controlDisabledWhile(control, observable, opts) {
  return observable.subscribe(isDisabled => disableControl(control, isDisabled, opts));
}
function controlEnabledWhile(control, observable, opts) {
  return observable.subscribe(isEnabled => enableControl(control, isEnabled, opts));
}
function mergeControlValidators(control, validators) {
  control.setValidators([control.validator, ...coerceArray(validators)]);
  control.updateValueAndValidity();
}
function validateControlOn(control, validation) {
  return validation.subscribe(maybeError => {
    control.setErrors(maybeError);
  });
}
function hasErrorAndTouched(control, error, path) {
  const hasError = control.hasError(error, !path || path.length === 0 ? undefined : path);
  return hasError && control.touched;
}
function hasErrorAndDirty(control, error, path) {
  const hasError = control.hasError(error, !path || path.length === 0 ? undefined : path);
  return hasError && control.dirty;
}
function markAllDirty(control) {
  control.markAsDirty({ onlySelf: true });
  control._forEachChild(control => control.markAllAsDirty());
}
function selectControlValue$(control, mapFn) {
  return control.value$.pipe(map(mapFn), distinctUntilChanged());
}

class FormArray extends FormArray$1 {
  constructor(controls, validatorOrOpts, asyncValidator) {
    super(controls, validatorOrOpts, asyncValidator);
    this.controls = controls;
    this.touchChanges = new Subject();
    this.dirtyChanges = new Subject();
    this.touch$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
    this.dirty$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());
    this.value$ = controlValueChanges$(this);
    this.disabledChanges$ = controlDisabled$(this);
    this.enabledChanges$ = controlEnabled$(this);
    this.statusChanges$ = controlStatusChanges$(this);
    this.errorChanges$ = controlErrorChanges$(this);
  }
  select(mapFn) {
    return this.value$.pipe(map(mapFn), distinctUntilChanged());
  }
  getRawValue() {
    return super.getRawValue();
  }
  at(index) {
    return super.at(index);
  }
  setValue(valueOrObservable, options) {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    } else {
      super.setValue(valueOrObservable, options);
    }
  }
  patchValue(valueOrObservable, options) {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.patchValue(value, options));
    } else {
      let value = valueOrObservable;
      if (isFunction(valueOrObservable)) {
        value = valueOrObservable(this.value);
      }
      super.patchValue(value, options);
    }
  }
  push(control) {
    return super.push(control);
  }
  insert(index, control) {
    return super.insert(index, control);
  }
  setControl(index, control) {
    return super.setControl(index, control);
  }
  disabledWhile(observable, options) {
    return controlDisabledWhile(this, observable, options);
  }
  enabledWhile(observable, options) {
    return controlEnabledWhile(this, observable, options);
  }
  mergeValidators(validators) {
    mergeControlValidators(this, validators);
  }
  mergeAsyncValidators(validators) {
    this.setAsyncValidators([this.asyncValidator, ...coerceArray(validators)]);
    this.updateValueAndValidity();
  }
  markAsTouched(opts) {
    super.markAsTouched(opts);
    this.touchChanges.next(true);
  }
  markAsUntouched(opts) {
    super.markAsUntouched(opts);
    this.touchChanges.next(false);
  }
  markAsPristine(opts) {
    super.markAsPristine(opts);
    this.dirtyChanges.next(false);
  }
  markAsDirty(opts) {
    super.markAsDirty(opts);
    this.dirtyChanges.next(true);
  }
  markAllAsDirty() {
    markAllDirty(this);
  }
  reset(value, options) {
    super.reset(value, options);
  }
  setValidators(newValidator) {
    super.setValidators(newValidator);
    super.updateValueAndValidity();
  }
  setAsyncValidators(newValidator) {
    super.setAsyncValidators(newValidator);
    super.updateValueAndValidity();
  }
  validateOn(observableValidation) {
    return observableValidation.subscribe(maybeError => {
      this.setErrors(maybeError);
    });
  }
  hasError(errorCode, path) {
    return super.hasError(errorCode, path);
  }
  setErrors(errors, opts = {}) {
    return super.setErrors(errors, opts);
  }
  getError(errorCode, path) {
    return super.getError(errorCode, path);
  }
  hasErrorAndTouched(errorCode, path) {
    return hasErrorAndTouched(this, errorCode, path);
  }
  hasErrorAndDirty(errorCode, path) {
    return hasErrorAndDirty(this, errorCode, path);
  }
  setEnable(enable = true, opts) {
    enableControl(this, enable, opts);
  }
  setDisable(disable = true, opts) {
    disableControl(this, disable, opts);
  }
}

class FormControl extends FormControl$1 {
  constructor(formState, validatorOrOpts, asyncValidator) {
    super(formState, validatorOrOpts, asyncValidator);
    this.touchChanges = new Subject();
    this.dirtyChanges = new Subject();
    this.touch$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
    this.dirty$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());
    this.value$ = controlValueChanges$(this);
    this.disabled$ = controlDisabled$(this);
    this.enabled$ = controlEnabled$(this);
    this.status$ = controlStatusChanges$(this);
    this.errors$ = controlErrorChanges$(this);
  }
  select(mapFn) {
    return selectControlValue$(this, mapFn);
  }
  setValue(valueOrObservable, options) {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    } else {
      super.setValue(valueOrObservable, options);
    }
  }
  patchValue(valueOrObservable, options) {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.patchValue(value, options));
    } else {
      let value = valueOrObservable;
      if (isFunction(valueOrObservable)) {
        value = valueOrObservable(this.value);
      }
      super.patchValue(value, options);
    }
  }
  disabledWhile(observable, options) {
    return controlDisabledWhile(this, observable, options);
  }
  enabledWhile(observable, options) {
    return controlEnabledWhile(this, observable, options);
  }
  mergeValidators(validators) {
    mergeControlValidators(this, validators);
  }
  mergeAsyncValidators(validators) {
    this.setAsyncValidators([this.asyncValidator, ...coerceArray(validators)]);
    this.updateValueAndValidity();
  }
  markAsTouched(opts) {
    super.markAsTouched(opts);
    this.touchChanges.next(true);
  }
  markAsUntouched(opts) {
    super.markAsUntouched(opts);
    this.touchChanges.next(false);
  }
  markAsPristine(opts) {
    super.markAsPristine(opts);
    this.dirtyChanges.next(false);
  }
  markAsDirty(opts) {
    super.markAsDirty(opts);
    this.dirtyChanges.next(true);
  }
  markAllAsDirty() {
    this.markAsDirty({ onlySelf: true });
  }
  reset(formState, options) {
    super.reset(formState, options);
  }
  setValidators(newValidator) {
    super.setValidators(newValidator);
    super.updateValueAndValidity();
  }
  setAsyncValidators(newValidator) {
    super.setAsyncValidators(newValidator);
    super.updateValueAndValidity();
  }
  validateOn(observableValidation) {
    return validateControlOn(this, observableValidation);
  }
  getError(errorCode) {
    return super.getError(errorCode);
  }
  hasError(errorCode) {
    return super.hasError(errorCode);
  }
  setErrors(errors, opts = {}) {
    return super.setErrors(errors, opts);
  }
  hasErrorAndTouched(error) {
    return hasErrorAndTouched(this, error);
  }
  hasErrorAndDirty(error) {
    return hasErrorAndDirty(this, error);
  }
  setEnable(enable = true, opts) {
    enableControl(this, enable, opts);
  }
  setDisable(disable = true, opts) {
    disableControl(this, disable, opts);
  }
}

class FormGroup extends FormGroup$1 {
  constructor(controls, validatorOrOpts, asyncValidator) {
    super(controls, validatorOrOpts, asyncValidator);
    this.controls = controls;
    this.touchChanges = new Subject();
    this.dirtyChanges = new Subject();
    this.touch$ = this.touchChanges.asObservable().pipe(distinctUntilChanged());
    this.dirty$ = this.dirtyChanges.asObservable().pipe(distinctUntilChanged());
    this.value$ = controlValueChanges$(this);
    this.disabled$ = controlDisabled$(this);
    this.enabled$ = controlEnabled$(this);
    this.status$ = controlStatusChanges$(this);
    this.errors$ = controlErrorChanges$(this);
  }
  select(mapFn) {
    return selectControlValue$(this, mapFn);
  }
  getRawValue() {
    return super.getRawValue();
  }
  get(path) {
    return super.get(path);
  }
  getControl(...names) {
    return this.get(names.join('.'));
  }
  addControl(name, control) {
    super.addControl(name, control);
  }
  removeControl(name) {
    super.removeControl(name);
  }
  contains(controlName) {
    return super.contains(controlName);
  }
  setControl(name, control) {
    super.setControl(name, control);
  }
  setValue(valueOrObservable, options) {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.setValue(value, options));
    } else {
      super.setValue(valueOrObservable, options);
    }
  }
  patchValue(valueOrObservable, options) {
    if (isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(value => super.patchValue(value, options));
    } else {
      let value = valueOrObservable;
      if (isFunction(valueOrObservable)) {
        value = valueOrObservable(this.value);
      }
      super.patchValue(value, options);
    }
  }
  disabledWhile(observable, options) {
    return controlDisabledWhile(this, observable, options);
  }
  enabledWhile(observable, options) {
    return controlEnabledWhile(this, observable, options);
  }
  mergeValidators(validators) {
    mergeControlValidators(this, validators);
  }
  mergeAsyncValidators(validators) {
    this.setAsyncValidators([this.asyncValidator, ...coerceArray(validators)]);
    this.updateValueAndValidity();
  }
  markAsTouched(opts) {
    super.markAsTouched(opts);
    this.touchChanges.next(true);
  }
  markAsUntouched(opts) {
    super.markAsUntouched(opts);
    this.touchChanges.next(false);
  }
  markAsPristine(opts) {
    super.markAsPristine(opts);
    this.dirtyChanges.next(false);
  }
  markAsDirty(opts) {
    super.markAsDirty(opts);
    this.dirtyChanges.next(true);
  }
  markAllAsDirty() {
    markAllDirty(this);
  }
  reset(formState, options) {
    super.reset(formState, options);
  }
  setValidators(newValidator) {
    super.setValidators(newValidator);
    super.updateValueAndValidity();
  }
  setAsyncValidators(newValidator) {
    super.setAsyncValidators(newValidator);
    super.updateValueAndValidity();
  }
  validateOn(observableValidation) {
    return validateControlOn(this, observableValidation);
  }
  hasError(errorCode, path) {
    return super.hasError(errorCode, path);
  }
  setErrors(errors, opts = {}) {
    return super.setErrors(errors, opts);
  }
  getError(errorCode, path) {
    return super.getError(errorCode, path);
  }
  hasErrorAndTouched(error, ...path) {
    return hasErrorAndTouched(this, error, ...path);
  }
  hasErrorAndDirty(error, ...path) {
    return hasErrorAndDirty(this, error, ...path);
  }
  setEnable(enable = true, opts) {
    enableControl(this, enable, opts);
  }
  setDisable(disable = true, opts) {
    disableControl(this, disable, opts);
  }
}

function isAbstractControlOptions(options) {
  return options.asyncValidators !== undefined || options.validators !== undefined || options.updateOn !== undefined;
}
let FormBuilder = class FormBuilder extends FormBuilder$1 {
  group(controlsConfig, options) {
    const controls = this._reduceControls(controlsConfig);
    let validators = null;
    let asyncValidators = null;
    let updateOn;
    if (options != null) {
      if (isAbstractControlOptions(options)) {
        validators = options.validators != null ? options.validators : null;
        asyncValidators = options.asyncValidators != null ? options.asyncValidators : null;
        updateOn = options.updateOn != null ? options.updateOn : undefined;
      } else {
        // `options` are legacy form group options
        validators = options['validator'] != null ? options['validator'] : null;
        asyncValidators = options['asyncValidator'] != null ? options['asyncValidator'] : null;
      }
    }
    // Todo: dan remove the any
    return new FormGroup(controls, { asyncValidators, updateOn, validators });
  }
  control(formState, validatorOrOpts, asyncValidator) {
    return new FormControl(formState, validatorOrOpts, asyncValidator);
  }
  array(controlsConfig, validatorOrOpts, asyncValidator) {
    const controls = controlsConfig.map(c => this._createControl(c));
    return new FormArray(controls, validatorOrOpts, asyncValidator);
  }
};
FormBuilder.ɵfac = function FormBuilder_Factory(t) {
  return ɵFormBuilder_BaseFactory(t || FormBuilder);
};
FormBuilder.ɵprov = ɵɵdefineInjectable({
  factory: function FormBuilder_Factory() {
    return new FormBuilder();
  },
  token: FormBuilder,
  providedIn: 'root'
});
const ɵFormBuilder_BaseFactory = ɵngcc0.ɵɵgetInheritedFactory(FormBuilder);
/*@__PURE__*/ (function() {
  ɵngcc0.ɵsetClassMetadata(
    FormBuilder,
    [
      {
        type: Injectable,
        args: [{ providedIn: 'root' }]
      }
    ],
    null,
    null
  );
})();

class ControlValueAccessor {
  constructor() {
    this.onChange = value => {};
    this.onTouched = () => {};
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
}

/**
 * Generated bundle index. Do not edit.
 */

export { ControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup };

//# sourceMappingURL=ngneat-reactive-forms.js.map
