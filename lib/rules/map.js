/**
 * @fileoverview Suggest change Lodash map to native
 * @author Alexandra
 */
"use strict";

const getFirstArgumentVariable = function (node, context) {
    const scope = context.getScope();

    return node.arguments && node.arguments.length > 1
        ? scope.set.get(node.arguments[0].name)
        : null;
}

const checkArrayExpression = function (variable) {
    return variable && variable.defs
        && variable.defs.length
        && variable.defs[0].node
        && variable.defs[0].node.init
        && variable.defs[0].node.init.type === 'ArrayExpression';
}

const checkIfLodashSymbol = function (node) {
    return node.callee.property.name === 'map' && node.callee.object.name === '_';
}

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Suggest change Lodash map to native",
            category: "Fill me in",
            recommended: false
        },
        fixable: 'code',
    },

    create: function (context) {

        const handleFix = function (node, variable) {
            return function (fixer) {
                if (checkArrayExpression(variable)) {
                    const rangeToRemove = [
                        node.arguments[0].start,
                        node.arguments[1].start
                    ];

                    return [
                        fixer.removeRange(rangeToRemove),
                        fixer.replaceText(node.callee.object, variable.name)
                    ];
                }

                return fixer;
            }
        }

        return {
            "CallExpression": function (node) {
                if (checkIfLodashSymbol(node)) {
                    const arrayVar = getFirstArgumentVariable(node, context);
                    context.report({
                        node: node,
                        data: {
                            identifier: arrayVar.name
                        },
                        message: "'{{ identifier }}' ia an array. You can use it instead of lodash",
                        fix: handleFix(node, arrayVar),
                    });
                }
            }
        };
    }
};
