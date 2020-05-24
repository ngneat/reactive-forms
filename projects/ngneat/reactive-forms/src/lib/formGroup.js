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
var FormGroup = /** @class */ (function(_super) {
  __extends(FormGroup, _super);
  function FormGroup(controls, validatorOrOpts, asyncValidator) {
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
  FormGroup.prototype.select = function(mapFn) {
    return control_actions_1.selectControlValue$(this, mapFn);
  };
  FormGroup.prototype.getRawValue = function() {
    return _super.prototype.getRawValue.call(this);
  };
  FormGroup.prototype.get = function(path) {
    return _super.prototype.get.call(this, path);
  };
  FormGroup.prototype.getControl = function() {
    var names = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      names[_i] = arguments[_i];
    }
    return this.get(names.join('.'));
  };
  FormGroup.prototype.addControl = function(name, control) {
    _super.prototype.addControl.call(this, name, control);
  };
  FormGroup.prototype.removeControl = function(name) {
    _super.prototype.removeControl.call(this, name);
  };
  FormGroup.prototype.contains = function(controlName) {
    return _super.prototype.contains.call(this, controlName);
  };
  FormGroup.prototype.setControl = function(name, control) {
    _super.prototype.setControl.call(this, name, control);
  };
  FormGroup.prototype.setValue = function(valueOrObservable, options) {
    var _this = this;
    if (rxjs_1.isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(function(value) {
        return _super.prototype.setValue.call(_this, value, options);
      });
    } else {
      _super.prototype.setValue.call(this, valueOrObservable, options);
    }
  };
  FormGroup.prototype.patchValue = function(valueOrObservable, options) {
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
  FormGroup.prototype.disabledWhile = function(observable, options) {
    return control_actions_1.controlDisabledWhile(this, observable, options);
  };
  FormGroup.prototype.enabledWhile = function(observable, options) {
    return control_actions_1.controlEnabledWhile(this, observable, options);
  };
  FormGroup.prototype.mergeValidators = function(validators) {
    control_actions_1.mergeControlValidators(this, validators);
  };
  FormGroup.prototype.mergeAsyncValidators = function(validators) {
    this.setAsyncValidators(__spreadArrays([this.asyncValidator], utils_1.coerceArray(validators)));
    this.updateValueAndValidity();
  };
  FormGroup.prototype.markAsTouched = function(opts) {
    _super.prototype.markAsTouched.call(this, opts);
    this.touchChanges.next(true);
  };
  FormGroup.prototype.markAsUntouched = function(opts) {
    _super.prototype.markAsUntouched.call(this, opts);
    this.touchChanges.next(false);
  };
  FormGroup.prototype.markAsPristine = function(opts) {
    _super.prototype.markAsPristine.call(this, opts);
    this.dirtyChanges.next(false);
  };
  FormGroup.prototype.markAsDirty = function(opts) {
    _super.prototype.markAsDirty.call(this, opts);
    this.dirtyChanges.next(true);
  };
  FormGroup.prototype.markAllAsDirty = function() {
    control_actions_1.markAllDirty(this);
  };
  FormGroup.prototype.reset = function(formState, options) {
    _super.prototype.reset.call(this, formState, options);
  };
  FormGroup.prototype.setValidators = function(newValidator) {
    _super.prototype.setValidators.call(this, newValidator);
    _super.prototype.updateValueAndValidity.call(this);
  };
  FormGroup.prototype.setAsyncValidators = function(newValidator) {
    _super.prototype.setAsyncValidators.call(this, newValidator);
    _super.prototype.updateValueAndValidity.call(this);
  };
  FormGroup.prototype.validateOn = function(observableValidation) {
    return control_actions_1.validateControlOn(this, observableValidation);
  };
  FormGroup.prototype.hasError = function(errorCode, path) {
    return _super.prototype.hasError.call(this, errorCode, path);
  };
  FormGroup.prototype.setErrors = function(errors, opts) {
    if (opts === void 0) {
      opts = {};
    }
    return _super.prototype.setErrors.call(this, errors, opts);
  };
  FormGroup.prototype.getError = function(errorCode, path) {
    return _super.prototype.getError.call(this, errorCode, path);
  };
  FormGroup.prototype.hasErrorAndTouched = function(error) {
    var path = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      path[_i - 1] = arguments[_i];
    }
    return control_actions_1.hasErrorAndTouched.apply(void 0, __spreadArrays([this, error], path));
  };
  FormGroup.prototype.hasErrorAndDirty = function(error) {
    var path = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      path[_i - 1] = arguments[_i];
    }
    return control_actions_1.hasErrorAndDirty.apply(void 0, __spreadArrays([this, error], path));
  };
  FormGroup.prototype.setEnable = function(enable, opts) {
    if (enable === void 0) {
      enable = true;
    }
    control_actions_1.enableControl(this, enable, opts);
  };
  FormGroup.prototype.setDisable = function(disable, opts) {
    if (disable === void 0) {
      disable = true;
    }
    control_actions_1.disableControl(this, disable, opts);
  };
  return FormGroup;
})(forms_1.FormGroup);
exports.FormGroup = FormGroup;
