'use strict';
exports.__esModule = true;
var expect_type_1 = require('expect-type');
var rxjs_1 = require('rxjs');
var formControl_1 = require('../formControl');
test('control value should be type of string', function() {
  var control = new formControl_1.FormControl('a string');
  expect_type_1.expectTypeOf(control.value).toBeString();
});
test('control valueChanges should be stream of strings', function() {
  var control = new formControl_1.FormControl('a string');
  expect_type_1.expectTypeOf(control.valueChanges$).toMatchTypeOf(new rxjs_1.Observable());
});
