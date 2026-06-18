const { Linter } = require('eslint');
const noClassesByCss = require(`${process.cwd()}/lib/rules/no-classes-by-css`);

// Helper function to test the rule
function testRule(code, options = {}, expectValid = true) {
    const linter = new Linter();

    const config = {
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'script',
            globals: {
                By: 'readonly',
            },
        },
        plugins: {
            'test-plugin': {
                rules: {
                    'no-classes-by-css': noClassesByCss,
                },
            },
        },
        rules: {
            'test-plugin/no-classes-by-css': ['error', options],
        },
    };

    const messages = linter.verifyAndFix(code, config, { filename: 'test.js' }).messages;

    if (expectValid) {
        expect(messages).toHaveLength(0);
    } else {
        expect(messages.length).toBeGreaterThan(0);
        return messages;
    }
}

describe('no-classes-by-css', () => {
    test('should allow valid cases with default settings', () => {
        testRule('By.css("button")');
        testRule('By.css("[data-test=\'Hello\']")');
        testRule('By.css("[data-test=\'.my-class\']")');
        testRule('By.css("#my-id")');
        testRule('By.css("#another-id")');
        testRule('By.css("div > span")');
        testRule('By.css("input[type=\'text\']")');
        testRule('By.css("div")');
        testRule('By.css(`button`)');
    });

    test('should report invalid cases with default settings', () => {
        const invalidSelectors = [
            '.my-class',
            '.another-class',
            '.class1.class2',
            '.nested .my-class',
            'div .my-class',
            '.my-class  .another-class',
            'a.b',
            'button.primary',
            ':not(.hidden)',
        ];

        invalidSelectors.forEach((selector) => {
            const messages = testRule(`By.css("${selector}")`, {}, false);
            expect(messages[0].messageId).toBe('noClasses');
        });
    });

    test('should allow valid cases with allowIds and allowTags options', () => {
        const options = { allowIds: true, allowTags: true, disallowClasses: true };

        testRule('By.css("button")', options);
        testRule('By.css("[data-test=\'Hello\']")', options);
        testRule('By.css("#my-id")', options);
        testRule('By.css("#another-id")', options);
        testRule('By.css("div > span")', options);
        testRule('By.css("input[type=\'text\']")', options);
        testRule('By.css("div")', options);
    });

    test('should still report class selectors with allowIds and allowTags options', () => {
        const options = { allowIds: true, allowTags: true, disallowClasses: true };

        const messages1 = testRule('By.css(".my-class")', options, false);
        expect(messages1[0].messageId).toBe('noClasses');

        const messages2 = testRule('By.css(".another-class")', options, false);
        expect(messages2[0].messageId).toBe('noClasses');

        const messages3 = testRule('By.css(".class1.class2")', options, false);
        expect(messages3[0].messageId).toBe('noClasses');

        const messages4 = testRule('By.css(".nested .my-class")', options, false);
        expect(messages4[0].messageId).toBe('noClasses');

        const messages5 = testRule('By.css("div .my-class")', options, false);
        expect(messages5[0].messageId).toBe('noClasses');

        const messages6 = testRule('By.css(".my-class  .another-class")', options, false);
        expect(messages6[0].messageId).toBe('noClasses');

        const messages7 = testRule('By.css("a.b")', options, false);
        expect(messages7[0].messageId).toBe('noClasses');
    });

    test('should allow class selectors when disallowClasses=false', () => {
        testRule('By.css("button")');
        testRule('By.css("[data-test=\'Hello\']")');
        testRule('By.css("#my-id")');
        testRule('By.css("#another-id")');
        testRule('By.css("div > span")');
        testRule('By.css("input[type=\'text\']")');
        testRule('By.css("a.b")', { disallowClasses: false });
        testRule('By.css("div")');
        testRule('By.css(".my-class")', { disallowClasses: false });
    });

    test('should report tag and id selectors only when explicitly disallowed', () => {
        const messages1 = testRule('By.css("button")', { allowTags: false }, false);
        expect(messages1[0].messageId).toBe('noTags');

        const messages2 = testRule('By.css("div > span")', { allowTags: false }, false);
        expect(messages2[0].messageId).toBe('noTags');

        const messages3 = testRule('By.css("#my-id")', { allowIds: false }, false);
        expect(messages3[0].messageId).toBe('noIds');

        const messages4 = testRule('By.css("button.primary")', { allowTags: false }, false);
        expect(messages4[0].messageId).toBe('noClasses');
    });

    test('should handle static selector variables conservatively', () => {
        testRule('By.css("button");');
        testRule('const selector = "button"; By.css(selector);');
        testRule('let selector = ".my-class"; selector = "button"; By.css(selector);');
        testRule('const selector = ".my-class"; By.css(selector + "");');
        testRule('By.css(selector);');
        testRule('function getElement(selector) { By.css(selector); }');
        testRule('By.css("[");');
        testRule('const elements = [".data", "tags"]; elements.forEach(function(e) { By.css(e); });');
        testRule('const elements = [".data", "tags"]; elements.forEach(function(e) { console.log(e); });');

        const messages1 = testRule(
            'const sel = ".my-class"; By.css(sel);',
            { disallowClasses: true, allowTags: false },
            false
        );
        expect(messages1[0].messageId).toBe('noClasses');
        expect(messages1[0].line).toBe(1);

        const messages2 = testRule(
            ['const selector = `button.primary`;', 'By.css(selector);'].join('\n'),
            { disallowClasses: true, allowTags: false },
            false
        );
        expect(messages2[0].messageId).toBe('noClasses');
        expect(messages2[0].line).toBe(2);

        const messages3 = testRule(
            ['const selector = ".my-class";', 'const alias = selector;', 'By.css(alias);'].join('\n'),
            { disallowClasses: true },
            false
        );
        expect(messages3[0].messageId).toBe('noClasses');
        expect(messages3[0].line).toBe(3);
    });
});
