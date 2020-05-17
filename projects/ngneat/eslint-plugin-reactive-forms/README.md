# @ngneat/eslint-plugin-reactive-forms

ESLint rules for use with @ngneat/reactive-forms

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `@ngneat/eslint-plugin-reactive-forms`:

```
$ npm install @ngneat/eslint-plugin-reactive-forms --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `@ngneat/eslint-plugin-reactive-forms` globally.

## Usage

Add `reactive-forms` to the plugins section of your `.eslintrc` configuration file.

```json
"plugins": ["@ngneat/reactive-forms"],
```

**Note:** If you haven't set eslint up for use with Typescript, this article helps a lot: https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb

## Supported Rules

- @ngneat/reactive-forms/no-angular-forms-imports

Add the rule to your `.eslintrc`

```json
"rules": {
  "@ngneat/reactive-forms/no-angular-forms-imports": "error"
}
```
