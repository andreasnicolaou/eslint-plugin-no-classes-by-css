/**
 * @fileoverview Disallow usage of By.css with CSS classes in Jasmine tests
 * @author Andreas Nicolaou
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        // Check if the call expression is for By.css
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'By' &&
          node.callee.property.name === 'css' &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal' &&
          typeof node.arguments[0].value === 'string'
        ) {
          const selector = node.arguments[0].value;
          const classSelectorPattern = /(?:^|[^#\w-])\s*\.\S+/;
          // Check if the selector includes a class selector
          if (classSelectorPattern.test(selector)) {
            context.report({
              node,
              messageId: 'noClasses',
            });
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
  },
};
