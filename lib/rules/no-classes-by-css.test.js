const noClassesByCss = require(`${process.cwd()}/lib/rules/no-classes-by-css`);
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester();

// Tests with default settings (disallow classes)
ruleTester.run('no-classes-by-css', noClassesByCss, {
    valid: [
        { code: 'By.css("button")', options: [{ allowTags: true }] },
        { code: 'By.css("[data-test=\'Hello\']")' },
        { code: 'By.css("#my-id")', options: [{ allowIds: true }] },
        { code: 'By.css("#another-id")', options: [{ allowIds: true }] },
        { code: 'By.css("div > span")' },
        { code: 'By.css("input[type=\'text\']")' },
        { code: 'By.css("a.b")' },
        { code: 'By.css("div")', options: [{ allowTags: true }] },
    ],
    invalid: [
        {
            code: 'By.css("button")',
            errors: [{ messageId: 'noTags' }],
        },
        {
            code: 'By.css("#my-id")',
            errors: [{ messageId: 'noIds' }],
        },
        {
            code: 'By.css("#another-id")',
            errors: [{ messageId: 'noIds' }],
        },
        {
            code: 'By.css("div")',
            errors: [{ messageId: 'noTags' }],
        },
        {
            code: 'By.css(".my-class")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css(".another-class")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css(".class1.class2")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css(".nested .my-class")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css("div .my-class")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css(".my-class  .another-class")',
            errors: [{ messageId: 'noClasses' }],
        },
    ],
});

// Tests with options: allowIds and allowTags
ruleTester.run('no-classes-by-css with options: allowIds and allowTags', noClassesByCss, {
    valid: [
        { code: 'By.css("button")', options: [{ allowTags: true }] },
        { code: 'By.css("[data-test=\'Hello\']")' },
        { code: 'By.css("#my-id")', options: [{ allowIds: true }] },
        { code: 'By.css("#another-id")', options: [{ allowIds: true }] },
        { code: 'By.css("div > span")' },
        { code: 'By.css("input[type=\'text\']")' },
        { code: 'By.css("a.b")' },
        { code: 'By.css("div")', options: [{ allowTags: true }] },
    ],
    invalid: [
        {
            code: 'By.css(".my-class")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css(".another-class")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css(".class1.class2")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css(".nested .my-class")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css("div .my-class")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css(".my-class  .another-class")',
            errors: [{ messageId: 'noClasses' }],
        },
    ],
    options: [{ allowIds: true, allowTags: true, disallowClasses: true }],
});

// Tests with options: disallowClasses set to false
ruleTester.run('no-classes-by-css with options: disallowClasses=false', noClassesByCss, {
    valid: [
        { code: 'By.css("button")', options: [{ allowTags: true }] },
        { code: 'By.css("[data-test=\'Hello\']")' },
        { code: 'By.css("#my-id")', options: [{ allowIds: true }] },
        { code: 'By.css("#another-id")', options: [{ allowIds: true }] },
        { code: 'By.css("div > span")' },
        { code: 'By.css("input[type=\'text\']")' },
        { code: 'By.css("a.b")' },
        { code: 'By.css("div")', options: [{ allowTags: true }] },
        { code: 'By.css(".my-class")', options: [{ disallowClasses: false }] },
    ],
    invalid: [
        {
            code: 'By.css(".another-class")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css(".class1.class2")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css(".nested .my-class")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css("div .my-class")',
            errors: [{ messageId: 'noClasses' }],
        },
        {
            code: 'By.css(".my-class  .another-class")',
            errors: [{ messageId: 'noClasses' }],
        },
    ],
});

// Tests with array and variable options: disallowClasses and allowTags
ruleTester.run('no-classes-by-css array and variable with options: disallowClasses and allowTags', noClassesByCss, {
    valid: [
        {
            code: 'By.css("button");',
            options: [{ allowTags: true }],
        },
        {
            code: ['var elements = [".data", "tags"];', 'elements.forEach(function(e) { By.css(e); });'].join('\n'),
            options: [{ disallowClasses: false, allowTags: true }],
        },
    ],
    invalid: [
        {
            code: 'var sel = ".my-class"; By.css(sel);',
            options: [{ disallowClasses: true, allowTags: false }],
            errors: [
                {
                    messageId: 'noClasses',
                    line: 1,
                },
            ],
        },
        {
            code: [
                'var elements = [".test", "div"];',
                'elements.forEach(function(element) {',
                '  By.css(element)',
                '});',
            ].join('\n'),
            options: [{ disallowClasses: true, allowTags: false }],
            errors: [
                {
                    messageId: 'noClasses',
                    line: 2,
                },
            ],
        },
    ],
});
