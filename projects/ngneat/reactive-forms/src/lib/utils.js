'use strict';
exports.__esModule = true;
function coerceArray(value) {
  return Array.isArray(value) ? value : [value];
}
exports.coerceArray = coerceArray;
function isFunction(x) {
  return typeof x === 'function';
}
exports.isFunction = isFunction;
function isNil(v) {
  return v === null || v === undefined;
}
exports.isNil = isNil;
