/**
 * @fileoverview Disallow usage of CSS class selectors in Angular By.css tests.
 * @author Andreas Nicolaou
 */
'use strict';
const utils = require('@typescript-eslint/utils');
const selectorParser = require('postcss-selector-parser');

const DEFAULT_OPTIONS = {
    allowIds: true,
    allowTags: true,
    disallowClasses: true,
};

module.exports = {
    create(context) {
        /* istanbul ignore next -- Compatibility fallback for older ESLint versions. */
        const sourceCode = context.sourceCode || context.getSourceCode();
        const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0]);
        const { allowIds, allowTags, disallowClasses } = options;

        return {
            CallExpression(node) {
                if (!isByCssCall(node)) {
                    return;
                }

                const selector = getStaticSelectorValue(node.arguments[0], node);
                if (selector === null) {
                    return;
                }

                checkSelector(selector, node);
            },
        };

        function checkSelector(selector, node) {
            const selectorInfo = inspectSelector(selector);

            if (selectorInfo.hasClass && disallowClasses) {
                context.report({
                    node,
                    messageId: 'noClasses',
                });
                return;
            }

            if (!allowTags && selectorInfo.hasTag) {
                context.report({
                    node,
                    messageId: 'noTags',
                });
                return;
            }

            if (!allowIds && selectorInfo.hasId) {
                context.report({
                    node,
                    messageId: 'noIds',
                });
            }
        }

        function getStaticSelectorValue(node, callExpression) {
            if (node.type === utils.AST_NODE_TYPES.Literal && typeof node.value === 'string') {
                return node.value;
            }

            if (node.type === utils.AST_NODE_TYPES.TemplateLiteral && node.expressions.length === 0) {
                return node.quasis.map((quasi) => quasi.value.cooked).join('');
            }

            if (node.type !== utils.AST_NODE_TYPES.Identifier) {
                return null;
            }

            const scope = getScope(sourceCode, context, callExpression);
            const variable = utils.ASTUtils.findVariable(scope, node.name);
            const definition = variable?.defs[0];
            const declaration = definition?.node;

            if (
                definition?.type !== 'Variable' ||
                declaration?.type !== utils.AST_NODE_TYPES.VariableDeclarator ||
                declaration.parent?.kind !== 'const' ||
                declaration.init == null
            ) {
                return null;
            }

            return getStaticSelectorValue(declaration.init, declaration);
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
                    allowIds: { type: 'boolean', default: true },
                    allowTags: { type: 'boolean', default: true },
                    disallowClasses: { type: 'boolean', default: true },
                },
                additionalProperties: false,
            },
        ],
    },
};

function isByCssCall(node) {
    return (
        node.callee?.type === utils.AST_NODE_TYPES.MemberExpression &&
        !node.callee.computed &&
        node.callee.object?.type === utils.AST_NODE_TYPES.Identifier &&
        node.callee.object.name === 'By' &&
        node.callee.property?.type === utils.AST_NODE_TYPES.Identifier &&
        node.callee.property.name === 'css' &&
        node.arguments.length > 0
    );
}

function getScope(sourceCode, context, node) {
    /* istanbul ignore else -- Compatibility fallback for older ESLint versions. */
    if (typeof sourceCode.getScope === 'function') {
        return sourceCode.getScope(node);
    }

    /* istanbul ignore next -- Compatibility fallback for older ESLint versions. */
    return context.getScope();
}

function inspectSelector(selector) {
    const selectorInfo = {
        hasClass: false,
        hasTag: false,
        hasId: false,
    };

    try {
        selectorParser((root) => {
            root.walkClasses(() => {
                selectorInfo.hasClass = true;
            });
            root.walkTags(() => {
                selectorInfo.hasTag = true;
            });
            root.walkIds(() => {
                selectorInfo.hasId = true;
            });
        }).processSync(selector);
    } catch {
        return selectorInfo;
    }

    return selectorInfo;
}
