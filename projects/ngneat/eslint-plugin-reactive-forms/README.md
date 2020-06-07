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

## Setting up the ESLint Rule in an Angular Project

To begin with, to allow ESLint to appropriately parse Typescript we need to install a few dependencies.
_NOTE: It is worthwhile doing this as TSLint is no longer supported [Roadmap: TSLint -> ESLint](https://github.com/palantir/tslint/issues/4534)_

Open up your favourite shell in your Angular directory and run:

```sh
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Next install our ESLint Plugin

```sh
npm install --save-dev @ngneat/eslint-plugin-reactive-forms
```

We now need to set up our ESLint config files. So create a new file at the root of your workspace called `.eslintrc`.
Place the following into it:

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "@ngneat/reactive-forms"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@ngneat/reactive-forms/no-angular-forms-imports": "error"
  }
}
```

We also want to set up a file to tell ESLint which files we should ignore. Create another file at the root of your workspace called `.eslintignore`:

```
node_modules
dist
```

Finally, we will want to set up a convenient script for linting our project. Add the following to the `scripts` in `package.json`:

```json
"scripts": {
  ...,
  "eslint": "eslint ./src --ext .ts"
}
```

If you use a monorepo via Angular CLI, you can also set it up to run linting per project:

```json
"scripts": {
  ...,
  "lint:my-library": "eslint ./projects/my-library/src --ext .ts"
}
```

Now you can run `npm run eslint` or `npm run lint:my-library` and the console will error everytime it encounters a disallowed import from `@angular/forms`.

We also provide a built in fixer, which will automatically fix any occurences it finds. To run it simply add `-- --fix` to the end of your npm command:
`npm run eslint -- --fix`
