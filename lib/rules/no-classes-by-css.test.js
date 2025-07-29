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
        testRule('By.css("button")', { allowTags: true });
        testRule('By.css("[data-test=\'Hello\']")');
        testRule('By.css("#my-id")', { allowIds: true });
        testRule('By.css("#another-id")', { allowIds: true });
        testRule('By.css("div > span")');
        testRule('By.css("input[type=\'text\']")');
        testRule('By.css("a.b")');
        testRule('By.css("div")', { allowTags: true });
    });

    test('should report invalid cases with default settings', () => {
        const messages1 = testRule('By.css("button")', {}, false);
        expect(messages1[0].messageId).toBe('noTags');

        const messages2 = testRule('By.css("#my-id")', {}, false);
        expect(messages2[0].messageId).toBe('noIds');

        const messages3 = testRule('By.css("#another-id")', {}, false);
        expect(messages3[0].messageId).toBe('noIds');

        const messages4 = testRule('By.css("div")', {}, false);
        expect(messages4[0].messageId).toBe('noTags');

        const messages5 = testRule('By.css(".my-class")', {}, false);
        expect(messages5[0].messageId).toBe('noClasses');

        const messages6 = testRule('By.css(".another-class")', {}, false);
        expect(messages6[0].messageId).toBe('noClasses');

        const messages7 = testRule('By.css(".class1.class2")', {}, false);
        expect(messages7[0].messageId).toBe('noClasses');

        const messages8 = testRule('By.css(".nested .my-class")', {}, false);
        expect(messages8[0].messageId).toBe('noClasses');

        const messages9 = testRule('By.css("div .my-class")', {}, false);
        expect(messages9[0].messageId).toBe('noClasses');

        const messages10 = testRule('By.css(".my-class  .another-class")', {}, false);
        expect(messages10[0].messageId).toBe('noClasses');
    });

    test('should allow valid cases with allowIds and allowTags options', () => {
        const options = { allowIds: true, allowTags: true, disallowClasses: true };

        testRule('By.css("button")', { allowTags: true });
        testRule('By.css("[data-test=\'Hello\']")', options);
        testRule('By.css("#my-id")', { allowIds: true });
        testRule('By.css("#another-id")', { allowIds: true });
        testRule('By.css("div > span")', options);
        testRule('By.css("input[type=\'text\']")', options);
        testRule('By.css("a.b")', options);
        testRule('By.css("div")', { allowTags: true });
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
    });

    test('should allow class selectors when disallowClasses=false', () => {
        testRule('By.css("button")', { allowTags: true });
        testRule('By.css("[data-test=\'Hello\']")');
        testRule('By.css("#my-id")', { allowIds: true });
        testRule('By.css("#another-id")', { allowIds: true });
        testRule('By.css("div > span")');
        testRule('By.css("input[type=\'text\']")');
        testRule('By.css("a.b")');
        testRule('By.css("div")', { allowTags: true });
        testRule('By.css(".my-class")', { disallowClasses: false });
    });

    test('should still report other class violations when disallowClasses=false for some', () => {
        const messages1 = testRule('By.css(".another-class")', {}, false);
        expect(messages1[0].messageId).toBe('noClasses');

        const messages2 = testRule('By.css(".class1.class2")', {}, false);
        expect(messages2[0].messageId).toBe('noClasses');

        const messages3 = testRule('By.css(".nested .my-class")', {}, false);
        expect(messages3[0].messageId).toBe('noClasses');

        const messages4 = testRule('By.css("div .my-class")', {}, false);
        expect(messages4[0].messageId).toBe('noClasses');

        const messages5 = testRule('By.css(".my-class  .another-class")', {}, false);
        expect(messages5[0].messageId).toBe('noClasses');
    });

    test('should handle variables with array and variable options', () => {
        testRule('By.css("button");', { allowTags: true });
        testRule('var elements = [".data", "tags"]; elements.forEach(function(e) { By.css(e); });', {
            disallowClasses: false,
            allowTags: true,
        });

        const messages1 = testRule(
            'var sel = ".my-class"; By.css(sel);',
            { disallowClasses: true, allowTags: false },
            false
        );
        expect(messages1[0].messageId).toBe('noClasses');
        expect(messages1[0].line).toBe(1);

        const messages2 = testRule(
            [
                'var elements = [".test", "div"];',
                'elements.forEach(function(element) {',
                '  By.css(element)',
                '});',
            ].join('\n'),
            { disallowClasses: true, allowTags: false },
            false
        );
        expect(messages2[0].messageId).toBe('noClasses');
        expect(messages2[0].line).toBe(2);
    });
});
