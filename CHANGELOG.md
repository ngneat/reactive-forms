# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.1.3](https://github.com/ngneat/reactive-forms/compare/v3.1.1...v3.1.3) (2021-10-28)


### Bug Fixes

* 🐛 fix type of enable disable ([67a5490](https://github.com/ngneat/reactive-forms/commit/67a549046ffa874048d1cdeb9c35185be8f3a243)), closes [#115](https://github.com/ngneat/reactive-forms/issues/115)
* 🐛 fix type of status$ property ([a106a3e](https://github.com/ngneat/reactive-forms/commit/a106a3e79569b085c101155ec3c946b8c2276fdf)), closes [#113](https://github.com/ngneat/reactive-forms/issues/113)

### [3.1.2](https://github.com/ngneat/reactive-forms/compare/v3.1.1...v3.1.2) (2021-10-25)


### Bug Fixes

* 🐛 fix type of status$ property ([a106a3e](https://github.com/ngneat/reactive-forms/commit/a106a3e79569b085c101155ec3c946b8c2276fdf)), closes [#113](https://github.com/ngneat/reactive-forms/issues/113)

## [3.1.0](https://github.com/ngneat/reactive-forms/compare/v3.0.0...v3.1.0) (2021-10-21)


### Features

* bump rule ([8f9fa05](https://github.com/ngneat/reactive-forms/commit/8f9fa0570ac11cd73f4af0c310d308712bab20b6))


### Bug Fixes

* **controlsOf:** allow using optional fields ([513beee](https://github.com/ngneat/reactive-forms/commit/513beee460643b8bd0265cb7ef72399bc6d4542b)), closes [#111](https://github.com/ngneat/reactive-forms/issues/111)

## [3.0.0](https://github.com/ngneat/reactive-forms/compare/v1.7.5...v3.0.0) (2021-10-08)


### ⚠ BREAKING CHANGES

* **library:** refactor the entire code

I completely rewrote the library from scratch for two reasons:
1. Provide as much support as possible without introducing bugs, breaking strict mode, or creating an inconvenient API.
2. Reduce the library size.

Here are the changes:
- Angular's peer dependency is now `>= 12`.
- FormGroup's generic was removed in favor of the **experimental** `ControlsOf` interface.
- Remove `mergeValidators`.  Use addValidators in v12.
- Remove `validateOn`.
- Remove `getControl` in favor of `get(key)` or `get(['nested', 'key'])`.
- Remove errors typing.
- Validators should now be imported from Angular.
- `FormBuilder` doesn't support generic anymore. Due to the complexity of the builder API, we're currently couldn't create a "good" implementation of `ControlsOf` for the builder.
- Remove the `group.persist()` from the instance to an exported function to make it tree-shakeable.

### Features

* **library:** refactor the entire code base ([5cee6fe](https://github.com/ngneat/reactive-forms/commit/5cee6fef2b59499df86cbfcdf17dd468b41ac884)), closes [#197](https://github.com/ngneat/reactive-forms/issues/197) [#103](https://github.com/ngneat/reactive-forms/issues/103) [#102](https://github.com/ngneat/reactive-forms/issues/102) [#97](https://github.com/ngneat/reactive-forms/issues/97) [#100](https://github.com/ngneat/reactive-forms/issues/100)

### [1.7.5](https://github.com/ngneat/reactive-forms/compare/v1.7.4...v1.7.5) (2021-08-09)


### Bug Fixes

* 🐛 fix merge validators ([c8e524b](https://github.com/ngneat/reactive-forms/commit/c8e524b13acc18ff5d20376b58e66a81906e4ff5)), closes [#87](https://github.com/ngneat/reactive-forms/issues/87)

### [1.7.4](https://github.com/ngneat/reactive-forms/compare/v1.7.3...v1.7.4) (2021-07-28)


### Bug Fixes

* **control:** avoid throw of error with async validator ([cf8f861](https://github.com/ngneat/reactive-forms/commit/cf8f861cfcbdb2a4284287892c18737c6d3f9e81)), closes [#91](https://github.com/ngneat/reactive-forms/issues/91)

### [1.7.3](https://github.com/ngneat/reactive-forms/compare/v1.7.2...v1.7.3) (2021-05-20)


### Bug Fixes

* 🐛 fix umd bad complier for getters and setters ([6bf84bf](https://github.com/ngneat/reactive-forms/commit/6bf84bf93543037ee61c6e231c2c9ca58b4e7e37)), closes [#88](https://github.com/ngneat/reactive-forms/issues/88)

### [1.7.2](https://github.com/ngneat/reactive-forms/compare/v1.7.1...v1.7.2) (2021-03-21)


### Bug Fixes

* 🐛 fix control types ([b64da9c](https://github.com/ngneat/reactive-forms/commit/b64da9c004ab29edef190e70412206e463c145c6)), closes [#85](https://github.com/ngneat/reactive-forms/issues/85)

### [1.6.1](https://github.com/ngneat/reactive-forms/compare/v1.7.0...v1.6.1) (2021-03-14)


### Bug Fixes

* 🐛 expose diff operator ([3fc264e](https://github.com/ngneat/reactive-forms/commit/3fc264e117b311e4205d67a79c95dce9deb38a55)), closes [#83](https://github.com/ngneat/reactive-forms/issues/83)

## [1.6.0](https://github.com/ngneat/reactive-forms/compare/v1.5.2...v1.6.0) (2021-01-30)


### Features

* persist values of disabled controls ([9dae31f](https://github.com/ngneat/reactive-forms/commit/9dae31fdf107ac78c9ec48cd937f072a23be0101))

### [1.5.2](https://github.com/ngneat/reactive-forms/compare/v1.5.1...v1.5.2) (2021-01-20)


### Bug Fixes

* allow to pass options to updateValueAndValidity method ([3edb8ae](https://github.com/ngneat/reactive-forms/commit/3edb8ae65fcff5d87d0d7237b73589fc962aa8ec))

### [1.5.1](https://github.com/ngneat/reactive-forms/compare/v1.5.0...v1.5.1) (2020-12-10)


### Bug Fixes

* typescript 4.0 breaking changes ([#62](https://github.com/ngneat/reactive-forms/issues/62)) ([ecc1d6f](https://github.com/ngneat/reactive-forms/commit/ecc1d6f7b27d403a832d4bf12ec0bcabedbd3b22))

## [1.5.0](https://github.com/ngneat/reactive-forms/compare/v1.4.4...v1.5.0) (2020-11-29)


### Features

* 🎸 enrich abstract control type ([2a018eb](https://github.com/ngneat/reactive-forms/commit/2a018ebab77de330d1636020c00b49214f46fd06))


### Bug Fixes

* handle 'any' values properly in 'ControlOf' ([#60](https://github.com/ngneat/reactive-forms/issues/60)) ([779e083](https://github.com/ngneat/reactive-forms/commit/779e0830df22a0fb389958d1df31d3700c84584d))
* handle 'any' values properly in 'patchValue' ([#59](https://github.com/ngneat/reactive-forms/issues/59)) ([0ccdd2e](https://github.com/ngneat/reactive-forms/commit/0ccdd2ef2299ba6543fcb6e5fa3371bab873bbf4))

### [1.4.4](https://github.com/ngneat/reactive-forms/compare/v1.4.3...v1.4.4) (2020-11-18)


### Bug Fixes

* accept deep partials in patchValue and reset methods ([#54](https://github.com/ngneat/reactive-forms/issues/54)) ([ee41c40](https://github.com/ngneat/reactive-forms/commit/ee41c401c1772993e2cf52bef3a95eef1e75537c))

### [1.4.3](https://github.com/ngneat/reactive-forms/compare/v1.4.2...v1.4.3) (2020-10-27)


### Bug Fixes

* 🐛 resolve control type when no generic given ([#57](https://github.com/ngneat/reactive-forms/issues/57)) ([8eb1fa4](https://github.com/ngneat/reactive-forms/commit/8eb1fa40a0f523ef3d41a6fef771a981186cb7da))

### [1.4.2](https://github.com/ngneat/reactive-forms/compare/v1.4.1...v1.4.2) (2020-10-22)


### Bug Fixes

* 🐛 add ControlsOf type to public API ([8423c5a](https://github.com/ngneat/reactive-forms/commit/8423c5ad623a34562043ac187f925cc5efef4669))

### [1.4.1](https://github.com/ngneat/reactive-forms/compare/v1.4.0...v1.4.1) (2020-10-22)


### Bug Fixes

* 🐛 add ControlOf type to public API ([6c44f38](https://github.com/ngneat/reactive-forms/commit/6c44f38f9b324c223e5ae61e2e525483f6749a83))

## [1.4.0](https://github.com/ngneat/reactive-forms/compare/v1.3.1...v1.4.0) (2020-10-22)


### Features

* support exact control types in FormGroup and FormArray ([#35](https://github.com/ngneat/reactive-forms/issues/35)) ([0734d55](https://github.com/ngneat/reactive-forms/commit/0734d558f322efb97da2455466ba0e2f47282899))

### [1.3.1](https://github.com/ngneat/reactive-forms/compare/v1.3.0...v1.3.1) (2020-09-16)


### Bug Fixes

* make sure errors$ is nexted when setErrors is called manually ([ce820fc](https://github.com/ngneat/reactive-forms/commit/ce820fc2bf49c63989b02a45166c6bab97fa199e))

## [1.3.0](https://github.com/ngneat/reactive-forms/compare/v1.2.0...v1.3.0) (2020-08-27)


### Features

* add a helper to remove error by key ([64cabc6](https://github.com/ngneat/reactive-forms/commit/64cabc6dc3f26b973d1941260b766dbd1cae7e21))
* provide a mergeErrors helper method ([e6c9a82](https://github.com/ngneat/reactive-forms/commit/e6c9a82a4c9af5af3e83ebd0d63a090154217320))


### Bug Fixes

* better mergeErrors(null) support ([9925e49](https://github.com/ngneat/reactive-forms/commit/9925e49555bd536802f310708e8c979f68f83614))

## [1.2.0](https://github.com/ngneat/reactive-forms/compare/v1.1.0...v1.2.0) (2020-08-24)


### Features

* **form-array:** implement remove helpers ([0011944](https://github.com/ngneat/reactive-forms/commit/0011944e4300107bbb3a067cb018795f413d4132))


### Tests

* **form-array:** write spec for remove helpers ([419c8c2](https://github.com/ngneat/reactive-forms/commit/419c8c246ac8de9ab340efb79284ada30919fc7d))

## [1.1.0](https://github.com/ngneat/reactive-forms/compare/v1.0.0...v1.1.0) (2020-08-02)


### Features

* **doc:** documentation for persist form ([eae2ba7](https://github.com/ngneat/reactive-forms/commit/eae2ba771accb0d36ee983eaef0b4ae61ba277ba)), closes [#24](https://github.com/ngneat/reactive-forms/issues/24)
* **storage:** add persist form to storage ([2ca8e6e](https://github.com/ngneat/reactive-forms/commit/2ca8e6e677232eb80ae0eab4109b34bcabf77dae)), closes [#24](https://github.com/ngneat/reactive-forms/issues/24)
* **storage:** add support for async storage types ([6cd39d8](https://github.com/ngneat/reactive-forms/commit/6cd39d81b5d07e8ff449632de98f6057e570e67b)), closes [#24](https://github.com/ngneat/reactive-forms/issues/24)

## 1.0.0 (2020-07-06)
