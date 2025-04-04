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

        // Track variable declarations that might contain class selectors
        const classSelectorVariables = new Set();
        const classSelectorArrays = new Set();

        // Patterns to match class selectors, tag selectors, and ID selectors
        const classSelectorPattern = /(?:^|[^#\w-])\s*\.\S+/;
        const tagSelectorPattern = /^[a-z]+$/;
        const idSelectorPattern = /^#[\w-]+$/;

        return {
            VariableDeclarator(node) {
                if (disallowClasses && node.init) {
                    // Check for direct string assignments with class selectors
                    if (
                        node.init.type === utils.AST_NODE_TYPES.Literal &&
                        typeof node.init.value === 'string' &&
                        classSelectorPattern.test(node.init.value)
                    ) {
                        if (node.id.type === utils.AST_NODE_TYPES.Identifier) {
                            classSelectorVariables.add(node.id.name);
                        }
                    }
                    // Check for array assignments with class selectors
                    if (node.init.type === utils.AST_NODE_TYPES.ArrayExpression) {
                        const hasClassSelector = node.init.elements.some(
                            (el) =>
                                el &&
                                el.type === utils.AST_NODE_TYPES.Literal &&
                                typeof el.value === 'string' &&
                                classSelectorPattern.test(el.value)
                        );
                        if (hasClassSelector && node.id.type === utils.AST_NODE_TYPES.Identifier) {
                            classSelectorArrays.add(node.id.name);
                        }
                    }
                }
            },

            CallExpression(node) {
                // Check if the call expression is for By.css
                if (
                    node.callee.type === utils.AST_NODE_TYPES.MemberExpression &&
                    node.callee.object.name === 'By' &&
                    node.callee.property.name === 'css' &&
                    node.arguments.length > 0
                ) {
                    const arg = node.arguments[0];
                    // Handle literal strings
                    if (arg.type === utils.AST_NODE_TYPES.Literal && typeof arg.value === 'string') {
                        checkSelector(arg.value, node);
                        return;
                    }
                    // Handle identifier references (variables)
                    if (
                        disallowClasses &&
                        arg.type === utils.AST_NODE_TYPES.Identifier &&
                        classSelectorVariables.has(arg.name)
                    ) {
                        context.report({
                            node,
                            messageId: 'noClasses',
                        });
                        return;
                    }
                } else {
                    const arrayNode = node.callee.object;
                    if (
                        disallowClasses &&
                        arrayNode.type === utils.AST_NODE_TYPES.Identifier &&
                        classSelectorArrays.has(arrayNode.name)
                    ) {
                        context.report({
                            node,
                            messageId: 'noClasses',
                        });
                    }
                }
            },
        };

        function checkSelector(selector, node) {
            // Check for class selectors if disallowClasses is true
            if (classSelectorPattern.test(selector) && disallowClasses) {
                context.report({
                    node,
                    messageId: 'noClasses',
                });
                return;
            }
            // Check for tag selectors if allowTags is false
            if (!allowTags && tagSelectorPattern.test(selector)) {
                context.report({
                    node,
                    messageId: 'noTags',
                });
                return;
            }
            // Check for ID selectors if allowIds is false
            if (!allowIds && idSelectorPattern.test(selector)) {
                context.report({
                    node,
                    messageId: 'noIds',
                });
            }
        }
    },
    meta: {
        type: 'problem',
        messages: {
            noClasses: 'Using class selectors is discouraged. Consider using data attributes instead',
            noTags: 'Using tag selectors is discouraged unless explicitly allowed',
            noIds: 'Using ID selectors is discouraged unless explicitly allowed',
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
