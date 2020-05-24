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
var FormControl = /** @class */ (function(_super) {
  __extends(FormControl, _super);
  function FormControl(formState, validatorOrOpts, asyncValidator) {
    var _this = _super.call(this, formState, validatorOrOpts, asyncValidator) || this;
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
  FormControl.prototype.select = function(mapFn) {
    return control_actions_1.selectControlValue$(this, mapFn);
  };
  FormControl.prototype.setValue = function(valueOrObservable, options) {
    var _this = this;
    if (rxjs_1.isObservable(valueOrObservable)) {
      return valueOrObservable.subscribe(function(value) {
        return _super.prototype.setValue.call(_this, value, options);
      });
    } else {
      _super.prototype.setValue.call(this, valueOrObservable, options);
    }
  };
  FormControl.prototype.patchValue = function(valueOrObservable, options) {
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
  FormControl.prototype.disabledWhile = function(observable, options) {
    return control_actions_1.controlDisabledWhile(this, observable, options);
  };
  FormControl.prototype.enabledWhile = function(observable, options) {
    return control_actions_1.controlEnabledWhile(this, observable, options);
  };
  FormControl.prototype.mergeValidators = function(validators) {
    control_actions_1.mergeControlValidators(this, validators);
  };
  FormControl.prototype.mergeAsyncValidators = function(validators) {
    this.setAsyncValidators(__spreadArrays([this.asyncValidator], utils_1.coerceArray(validators)));
    this.updateValueAndValidity();
  };
  FormControl.prototype.markAsTouched = function(opts) {
    _super.prototype.markAsTouched.call(this, opts);
    this.touchChanges.next(true);
  };
  FormControl.prototype.markAsUntouched = function(opts) {
    _super.prototype.markAsUntouched.call(this, opts);
    this.touchChanges.next(false);
  };
  FormControl.prototype.markAsPristine = function(opts) {
    _super.prototype.markAsPristine.call(this, opts);
    this.dirtyChanges.next(false);
  };
  FormControl.prototype.markAsDirty = function(opts) {
    _super.prototype.markAsDirty.call(this, opts);
    this.dirtyChanges.next(true);
  };
  FormControl.prototype.markAllAsDirty = function() {
    this.markAsDirty({ onlySelf: true });
  };
  FormControl.prototype.reset = function(formState, options) {
    _super.prototype.reset.call(this, formState, options);
  };
  FormControl.prototype.setValidators = function(newValidator) {
    _super.prototype.setValidators.call(this, newValidator);
    _super.prototype.updateValueAndValidity.call(this);
  };
  FormControl.prototype.setAsyncValidators = function(newValidator) {
    _super.prototype.setAsyncValidators.call(this, newValidator);
    _super.prototype.updateValueAndValidity.call(this);
  };
  FormControl.prototype.validateOn = function(observableValidation) {
    return control_actions_1.validateControlOn(this, observableValidation);
  };
  FormControl.prototype.getError = function(errorCode) {
    return _super.prototype.getError.call(this, errorCode);
  };
  FormControl.prototype.hasError = function(errorCode) {
    return _super.prototype.hasError.call(this, errorCode);
  };
  FormControl.prototype.setErrors = function(errors, opts) {
    if (opts === void 0) {
      opts = {};
    }
    return _super.prototype.setErrors.call(this, errors, opts);
  };
  FormControl.prototype.hasErrorAndTouched = function(error) {
    return control_actions_1.hasErrorAndTouched(this, error);
  };
  FormControl.prototype.hasErrorAndDirty = function(error) {
    return control_actions_1.hasErrorAndDirty(this, error);
  };
  FormControl.prototype.setEnable = function(enable, opts) {
    if (enable === void 0) {
      enable = true;
    }
    control_actions_1.enableControl(this, enable, opts);
  };
  FormControl.prototype.setDisable = function(disable, opts) {
    if (disable === void 0) {
      disable = true;
    }
    control_actions_1.disableControl(this, disable, opts);
  };
  return FormControl;
})(forms_1.FormControl);
exports.FormControl = FormControl;
