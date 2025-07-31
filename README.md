# @andreasnicolaou/eslint-plugin-no-classes-by-css

ESLint plugin to disallow the use of `By.css` with CSS class selectors in Jasmine tests. This plugin helps enforce better practices by avoiding over-reliance on CSS classes for element selection in tests.

![JavaScript](https://img.shields.io/badge/JS-JavaScript-f7df1e?logo=javascript&logoColor=black)
![GitHub contributors](https://img.shields.io/github/contributors/andreasnicolaou/eslint-plugin-no-classes-by-css)
![GitHub License](https://img.shields.io/github/license/andreasnicolaou/eslint-plugin-no-classes-by-css)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/andreasnicolaou/eslint-plugin-no-classes-by-css/build.yaml)
![GitHub package.json version](https://img.shields.io/github/package-json/v/andreasnicolaou/eslint-plugin-no-classes-by-css)
[![Known Vulnerabilities](https://snyk.io/test/github/andreasnicolaou/eslint-plugin-no-classes-by-css/badge.svg)](https://snyk.io/test/github/andreasnicolaou/eslint-plugin-no-classes-by-css)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/@andreasnicolaou/eslint-plugin-no-classes-by-css)

![ESLint](https://img.shields.io/badge/linter-eslint-4B32C3.svg?logo=eslint)
![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?logo=prettier)
![Jest](https://img.shields.io/badge/tested_with-jest-99424f.svg?logo=jest)
![Maintenance](https://img.shields.io/maintenance/yes/2025)
[![codecov](https://codecov.io/gh/andreasnicolaou/eslint-plugin-no-classes-by-css/graph/badge.svg?token=ELH4YWG68O)](https://codecov.io/gh/andreasnicolaou/eslint-plugin-no-classes-by-css)

![NPM Downloads](https://img.shields.io/npm/dm/%40andreasnicolaou%2Feslint-plugin-no-classes-by-css)

# Installation

Install the npm package

```bash
# If eslint is installed globally
npm install -g @andreasnicolaou/eslint-plugin-no-classes-by-css

# If eslint is installed locally
npm install -D @andreasnicolaou/eslint-plugin-no-classes-by-css
```

Add the plugin to the plugins section and the rule to the rules section in your .eslintrc

```js
"plugins": [
  "@andreasnicolaou/no-classes-by-css"
],
"rules": {
  "@andreasnicolaou/no-classes-by-css/no-classes-by-css": [
    "error",
    {
      "allowIds": true,
      "allowTags": true
    }
  ]
}
```

# Configuration

- `allowIds`: If set to true, the plugin will allow using By.css with ID selectors (e.g., By.css('#elementId')).
- `allowTags`: If set to true, the plugin will allow using By.css with tag selectors (e.g., By.css('button')).
- `disallowClasses`: By default, the plugin will disallow the use of CSS class selectors in By.css (e.g., By.css('.my-class')).

# Usage

This plugin enforces the following:

- Disallow CSS class selectors (e.g., By.css('.my-class')) in Jasmine tests.
- Optionally allow tag selectors (e.g., By.css('button')).
- Optionally allow ID selectors (e.g., By.css('#my-id')).

To ensure proper usage, add the rule to your .eslintrc as shown above.

# Example

The following code will cause an ESLint error:

```js
const element = element(By.css('.my-class'));
```

The correct usage would be either:

```js
// With ID
const element = element(By.css('#my-id'));

// Or with a tag
const element = element(By.css('button'));
```

# Autofixing

Currently, this plugin does not support automatic fixes for code violations. It only detects incorrect usage and warns you to replace CSS class selectors in By.css.

# Notice

Make sure to follow best practices by using IDs or tag selectors when selecting elements for tests to ensure more stable and maintainable test code.
