# eslint-plugin-no-classes-by-css
ESLint plugin to disallow the use of `By.css` with CSS class selectors in Jasmine tests. This plugin helps enforce better practices by avoiding over-reliance on CSS classes for element selection in tests.

# Installation

Install the npm package
```bash
# If eslint is installed globally
npm install -g eslint-plugin-no-classes-by-css

# If eslint is installed locally
npm install -D eslint-plugin-no-classes-by-css
```

Add the plugin to the plugins section and the rule to the rules section in your .eslintrc

```js
"plugins": [
  "no-classes-by-css"
],
"rules": {
  "no-classes-by-css/no-classes-in-by-css": [
    "error",
    {
      "allowIds": true,
      "allowTags": true
    }
  ]
}
```
# Configuration
 * `allowIds`: If set to true, the plugin will allow using By.css with ID selectors (e.g., By.css('#elementId')).
 * `allowTags`: If set to true, the plugin will allow using By.css with tag selectors (e.g., By.css('button')).
 * `disallowClasses`: By default, the plugin will disallow the use of CSS class selectors in By.css (e.g., By.css('.my-class')).

# Usage
 This plugin enforces the following:
 * Disallow CSS class selectors (e.g., By.css('.my-class')) in Jasmine tests.
 * Optionally allow tag selectors (e.g., By.css('button')).
 * Optionally allow ID selectors (e.g., By.css('#my-id')).

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
```bash
eslint --fix src
```
Make sure to follow best practices by using IDs or tag selectors when selecting elements for tests to ensure more stable and maintainable test code.
