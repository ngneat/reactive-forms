'use strict';
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
  };
exports.__esModule = true;
var forms_1 = require('@angular/forms');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var control_actions_1 = require('./control-actions');
var utils_1 = require('./utils');
var FormArray = /** @class */ (function(_super) {
  __extends(FormArray, _super);
  function FormArray(controls, validatorOrOpts, asyncValidator) {
    var _this = _super.call(this, controls, validatorOrOpts, asyncValidator) || this;
    _this.controls = controls;
    _this.touchChanges = new rxjs_1.Subject();
    _this.dirtyChanges = new rxjs_1.Subject();
    _this.touchChanges$ = _this.touchChanges.asObservable().pipe(operators_1.distinctUntilChanged());
    _this.dirtyChanges$ = _this.dirtyChanges.asObservable().pipe(operators_1.distinctUntilChanged());
    _this.valueChanges$ = control_actions_1.controlValueChanges$(_this);
    _this.disabledChanges$ = control_actions_1.controlDisabled$(_this);
    _this.enabledChanges$ = control_actions_1.controlEnabled$(_this);
    _this.statusChanges$ = control_actions_1.controlStatusChanges$(_this);
    _this.errorChanges$ = control_actions_1.controlErrorChanges$(_this);
    return _this;
  }
  FormArray.prototype.select = function(mapFn) {
    return this.valueChanges$.pipe(operators_1.map(mapFn), operators_1.distinctUntilChanged());
  };
  FormArray.prototype.getRawValue = function() {
    return _super.prototype.getRawValue.call(this);
  };
  FormArray.prototype.at = function(index) {
    return _super.prototype.at.call(this, index);
  };
  FormArray.prototype.setValue = function(valueOrObservable, options) {
    var _this = this;
    if (rxjs_1.isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(function(value) {
        return _super.prototype.setValue.call(_this, value, options);
      });
    } else {
      _super.prototype.setValue.call(this, valueOrObservable, options);
    }
  };
  FormArray.prototype.patchValue = function(valueOrObservable, options) {
    var _this = this;
    if (rxjs_1.isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(function(value) {
        return _super.prototype.patchValue.call(_this, value, options);
      });
    } else {
      var value = valueOrObservable;
      if (utils_1.isFunction(valueOrObservable)) {
        value = valueOrObservable(this.value);
      }
      _super.prototype.patchValue.call(this, value, options);
    }
  };
  FormArray.prototype.push = function(control) {
    return _super.prototype.push.call(this, control);
  };
  FormArray.prototype.insert = function(index, control) {
    return _super.prototype.insert.call(this, index, control);
  };
  FormArray.prototype.setControl = function(index, control) {
    return _super.prototype.setControl.call(this, index, control);
  };
  FormArray.prototype.disabledWhile = function(observable, options) {
    return control_actions_1.controlDisabledWhile(this, observable, options);
  };
  FormArray.prototype.enabledWhile = function(observable, options) {
    return control_actions_1.controlEnabledWhile(this, observable, options);
  };
  FormArray.prototype.mergeValidators = function(validators) {
    control_actions_1.mergeControlValidators(this, validators);
  };
  FormArray.prototype.mergeAsyncValidators = function(validators) {
    this.setAsyncValidators(__spreadArrays([this.asyncValidator], utils_1.coerceArray(validators)));
    this.updateValueAndValidity();
  };
  FormArray.prototype.markAsTouched = function(opts) {
    _super.prototype.markAsTouched.call(this, opts);
    this.touchChanges.next(true);
  };
  FormArray.prototype.markAsUntouched = function(opts) {
    _super.prototype.markAsUntouched.call(this, opts);
    this.touchChanges.next(false);
  };
  FormArray.prototype.markAsPristine = function(opts) {
    _super.prototype.markAsPristine.call(this, opts);
    this.dirtyChanges.next(false);
  };
  FormArray.prototype.markAsDirty = function(opts) {
    _super.prototype.markAsDirty.call(this, opts);
    this.dirtyChanges.next(true);
  };
  FormArray.prototype.markAllAsDirty = function() {
    control_actions_1.markAllDirty(this);
  };
  FormArray.prototype.reset = function(value, options) {
    _super.prototype.reset.call(this, value, options);
  };
  FormArray.prototype.setValidators = function(newValidator) {
    _super.prototype.setValidators.call(this, newValidator);
    _super.prototype.updateValueAndValidity.call(this);
  };
  FormArray.prototype.setAsyncValidators = function(newValidator) {
    _super.prototype.setAsyncValidators.call(this, newValidator);
    _super.prototype.updateValueAndValidity.call(this);
  };
  FormArray.prototype.validateOn = function(observableValidation) {
    var _this = this;
    return observableValidation.subscribe(function(maybeError) {
      _this.setErrors(maybeError);
    });
  };
  FormArray.prototype.hasError = function(errorCode, path) {
    return _super.prototype.hasError.call(this, errorCode, path);
  };
  FormArray.prototype.setErrors = function(errors, opts) {
    if (opts === void 0) {
      opts = {};
    }
    return _super.prototype.setErrors.call(this, errors, opts);
  };
  FormArray.prototype.getError = function(errorCode, path) {
    return _super.prototype.getError.call(this, errorCode, path);
  };
  FormArray.prototype.hasErrorAndTouched = function(errorCode, path) {
    return control_actions_1.hasErrorAndTouched(this, errorCode, path);
  };
  FormArray.prototype.hasErrorAndDirty = function(errorCode, path) {
    return control_actions_1.hasErrorAndDirty(this, errorCode, path);
  };
  FormArray.prototype.setEnable = function(enable, opts) {
    if (enable === void 0) {
      enable = true;
    }
    control_actions_1.enableControl(this, enable, opts);
  };
  FormArray.prototype.setDisable = function(disable, opts) {
    if (disable === void 0) {
      disable = true;
    }
    control_actions_1.disableControl(this, disable, opts);
  };
  return FormArray;
})(forms_1.FormArray);
exports.FormArray = FormArray;
