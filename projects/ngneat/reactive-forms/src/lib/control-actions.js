'use strict';
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
  };
exports.__esModule = true;
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var formArray_1 = require('./formArray');
var formGroup_1 = require('./formGroup');
var utils_1 = require('./utils');
function getControlValue(control) {
  if (control instanceof formGroup_1.FormGroup || control instanceof formArray_1.FormArray) {
    return control.getRawValue();
  }
  return control.value;
}
function compareErrors(a, b) {
  if (utils_1.isNil(a) || utils_1.isNil(b)) {
    return a === b;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}
function controlValueChanges$(control) {
  return rxjs_1.merge(
    rxjs_1.defer(function() {
      return rxjs_1.of(getControlValue(control));
    }),
    control.valueChanges.pipe(
      operators_1.map(function() {
        return getControlValue(control);
      })
    )
  );
}
exports.controlValueChanges$ = controlValueChanges$;
function controlDisabled$(control) {
  return rxjs_1.merge(
    rxjs_1.defer(function() {
      return rxjs_1.of(control.disabled);
    }),
    control.statusChanges.pipe(
      operators_1.map(function() {
        return control.disabled;
      }),
      operators_1.distinctUntilChanged()
    )
  );
}
exports.controlDisabled$ = controlDisabled$;
function controlEnabled$(control) {
  return rxjs_1.merge(
    rxjs_1.defer(function() {
      return rxjs_1.of(control.enabled);
    }),
    control.statusChanges.pipe(
      operators_1.map(function() {
        return control.enabled;
      }),
      operators_1.distinctUntilChanged()
    )
  );
}
exports.controlEnabled$ = controlEnabled$;
function controlStatusChanges$(control) {
  return rxjs_1.merge(
    rxjs_1.defer(function() {
      return rxjs_1.of(control.status);
    }),
    control.statusChanges.pipe(
      operators_1.map(function() {
        return control.status;
      }),
      operators_1.distinctUntilChanged()
    )
  );
}
exports.controlStatusChanges$ = controlStatusChanges$;
function controlErrorChanges$(control) {
  return rxjs_1.merge(
    rxjs_1.defer(function() {
      return rxjs_1.of(control.errors);
    }),
    control.valueChanges.pipe(
      operators_1.map(function() {
        return control.errors;
      }),
      operators_1.distinctUntilChanged(function(a, b) {
        return compareErrors(a, b);
      })
    )
  );
}
exports.controlErrorChanges$ = controlErrorChanges$;
function enableControl(control, enabled, opts) {
  if (enabled) {
    control.enable(opts);
  } else {
    control.disable(opts);
  }
}
exports.enableControl = enableControl;
function disableControl(control, disabled, opts) {
  enableControl(control, !disabled, opts);
}
exports.disableControl = disableControl;
function controlDisabledWhile(control, observable, opts) {
  return observable.subscribe(function(isDisabled) {
    return disableControl(control, isDisabled, opts);
  });
}
exports.controlDisabledWhile = controlDisabledWhile;
function controlEnabledWhile(control, observable, opts) {
  return observable.subscribe(function(isEnabled) {
    return enableControl(control, isEnabled, opts);
  });
}
exports.controlEnabledWhile = controlEnabledWhile;
function mergeControlValidators(control, validators) {
  control.setValidators(__spreadArrays([control.validator], utils_1.coerceArray(validators)));
  control.updateValueAndValidity();
}
exports.mergeControlValidators = mergeControlValidators;
function validateControlOn(control, validation) {
  return validation.subscribe(function(maybeError) {
    control.setErrors(maybeError);
  });
}
exports.validateControlOn = validateControlOn;
function hasErrorAndTouched(control, error, path) {
  var hasError = control.hasError(error, !path || path.length === 0 ? undefined : path);
  return hasError && control.touched;
}
exports.hasErrorAndTouched = hasErrorAndTouched;
function hasErrorAndDirty(control, error, path) {
  var hasError = control.hasError(error, !path || path.length === 0 ? undefined : path);
  return hasError && control.dirty;
}
exports.hasErrorAndDirty = hasErrorAndDirty;
function markAllDirty(control) {
  control.markAsDirty({ onlySelf: true });
  control._forEachChild(function(control) {
    return control.markAllAsDirty();
  });
}
exports.markAllDirty = markAllDirty;
function selectControlValue$(control, mapFn) {
  return control.valueChanges$.pipe(operators_1.map(mapFn), operators_1.distinctUntilChanged());
}
exports.selectControlValue$ = selectControlValue$;
