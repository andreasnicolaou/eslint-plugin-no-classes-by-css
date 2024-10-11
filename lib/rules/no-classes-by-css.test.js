const rule = require(`${process.cwd()}/lib/rules/no-classes-by-css`);
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' }
});

// Tests with default settings (disallow classes)
ruleTester.run('no-classes-by-css', rule, {
  valid: [
    { code: 'By.css("button")' }, // Valid: Tag selector
    { code: 'By.css("[data-test=\'Hello\']")' }, // Valid: Data attribute
    { code: 'By.css("#my-id")' }, // Valid: ID selector
    { code: 'By.css("#another-id")' }, // Valid: ID selector
    { code: 'By.css("div > span")' }, // Valid: Combination of tag selectors
    { code: 'By.css("input[type=\'text\']")' }, // Valid: Attribute selector
    { code: 'By.css("a.b")' }, // Valid if tag selectors are allowed
    { code: 'By.css("div")' }, // Valid: Tag selector
  ],
  invalid: [
    {
      code: 'By.css(".my-class")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css(".another-class")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css(".class1.class2")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css(".nested .my-class")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css("div .my-class")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css(".my-class  .another-class")',
      errors: [{ messageId: 'noClasses' }]
    },
  ]
});

// Tests with options: allowIds and allowTags
ruleTester.run('no-classes-by-css with options: allowIds and allowTags', rule, {
  valid: [
    { code: 'By.css("button")' }, // Valid: Tag selector
    { code: 'By.css("[data-test=\'Hello\']")' }, // Valid: Data attribute
    { code: 'By.css("#my-id")' }, // Valid: ID selector
    { code: 'By.css("#another-id")' }, // Valid: ID selector
    { code: 'By.css("div > span")' }, // Valid: Tag combination
    { code: 'By.css("input[type=\'text\']")' }, // Valid: Attribute selector
    { code: 'By.css("a.b")' }, // Valid if tag selectors are allowed
    { code: 'By.css("div")' }, // Valid: Tag selector
  ],
  invalid: [
    {
      code: 'By.css(".my-class")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css(".another-class")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css(".class1.class2")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css(".nested .my-class")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css("div .my-class")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css(".my-class  .another-class")',
      errors: [{ messageId: 'noClasses' }]
    },
  ],
  options: [{ allowIds: true, allowTags: true, disallowClasses: true }]
});

// Tests with options: disallowClasses set to false
ruleTester.run('no-classes-by-css with options: disallowClasses=false', rule, {
  valid: [
    { code: 'By.css("button")' }, // Valid: Tag selector
    { code: 'By.css("[data-test=\'Hello\']")' }, // Valid: Data attribute
    { code: 'By.css("#my-id")' }, // Valid: ID selector
    { code: 'By.css("#another-id")' }, // Valid: ID selector
    { code: 'By.css("div > span")' }, // Valid: Tag combination
    { code: 'By.css("input[type=\'text\']")' }, // Valid: Attribute selector
    { code: 'By.css("a.b")' }, // Valid if tag selectors are allowed
    { code: 'By.css("div")' }, // Valid: Tag selector
    { code: 'By.css(".my-class")', options: [{ disallowClasses: false }] },
  ],
  invalid: [
    {
      code: 'By.css(".another-class")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css(".class1.class2")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css(".nested .my-class")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css("div .my-class")',
      errors: [{ messageId: 'noClasses' }]
    },
    {
      code: 'By.css(".my-class  .another-class")',
      errors: [{ messageId: 'noClasses' }]
    },
  ],
  options: [{ disallowClasses: false }]
});
