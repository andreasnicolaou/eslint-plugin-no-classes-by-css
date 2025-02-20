/**
 * @fileoverview Disallow usage of By.css with CSS classes in Jasmine tests.
 * @author Andreas Nicolaou
 */
'use strict';
const utils = require('@typescript-eslint/utils');
module.exports = {
    create(context) {
        const options = context.options[0] || {}; // Get the options passed in the ESLint config
        const allowIds = options.allowIds || false; // Default is false if not specified
        const allowTags = options.allowTags || false; // Default is false if not specified
        const disallowClasses = options.disallowClasses !== undefined ? options.disallowClasses : true; // Default is true

        return {
            CallExpression(node) {
                // Check if the call expression is for By.css
                if (
                    node.callee.type === 'MemberExpression' &&
                    node.callee.object.name === 'By' &&
                    node.callee.property.name === 'css' &&
                    node.arguments.length > 0 &&
                    node.arguments[0].type === utils.AST_NODE_TYPES.Literal &&
                    typeof node.arguments[0].value === 'string'
                ) {
                    const selector = node.arguments[0].value;
                    const classSelectorPattern = /(?:^|[^#\w-])\s*\.\S+/; // Regex to detect class selectors

                    // Check for class selectors if disallowClasses is true
                    if (classSelectorPattern.test(selector) && disallowClasses) {
                        context.report({
                            node,
                            messageId: 'noClasses',
                        });
                    }

                    // Check for tag selectors if allowTags is true
                    const tagSelectorPattern = /^[a-z]+$/; // Basic regex for tag selectors
                    if (allowTags && tagSelectorPattern.test(selector)) {
                        return; // Do not report if it's a valid tag selector
                    }

                    // Check for ID selectors if allowIds is true
                    const idSelectorPattern = /^#[\w-]+$/; // Regex to detect ID selectors
                    if (allowIds && idSelectorPattern.test(selector)) {
                        return; // Do not report if it's a valid ID selector
                    }
                }
            },
        };
    },
    meta: {
        type: 'problem',
        messages: {
            noClasses: 'Using class selectors is discouraged. Consider using data attributes instead',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    allowIds: { type: 'boolean', default: false },
                    allowTags: { type: 'boolean', default: false },
                    disallowClasses: { type: 'boolean', default: true },
                },
                additionalProperties: false,
            },
        ],
    },
};
