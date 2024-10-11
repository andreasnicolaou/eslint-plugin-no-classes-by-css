const rule = require(`${process.cwd()}/lib/rules/no-classes-by-css`);
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' }
});

ruleTester.run('no-classes-by-css', rule, {
  valid: [
    { code: 'By.css("button")' },
    { code: 'By.css("[data-test=\'Hello\']")' },
    { code: 'By.css("#my-id")' },
    { code: 'By.css("#another-id")' },
    { code: 'By.css("div > span")' },
    { code: 'By.css("input[type=\'text\']")' },
    { code: 'By.css("a.b")' }, // Valid, only the tag and class combination, if the rule allows tag selectors
    { code: 'By.css("div")' }, // Valid, only the tag selector
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
