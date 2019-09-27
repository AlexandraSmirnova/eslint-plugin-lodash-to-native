/**
 * @fileoverview Suggest change Lodash map to native
 * @author Alexandra
 */
"use strict";

const getFirstArgumentVariable = function(node, context) {
    const scope = context.getScope();
    return node.arguments && node.arguments.length > 1
        ? scope.set.get(node.arguments[0].name)
        : null;
}

const checkArrayExpression = function(variable, context) {
    return variable && variable.defs 
        && variable.defs.length
        && variable.defs[0].node
        && variable.defs[0].node.init
        && variable.defs[0].node.init.type === 'ArrayExpression';
}

const checkIfLodashSymbol = function(node) {
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
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {

        const handleFix = function(node) {
            return function (fixer) {
                const variable = getFirstArgumentVariable(node, context);

                if (checkArrayExpression(variable, context)) {
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
            ["CallExpression"]: function(node) {
                if (checkIfLodashSymbol(node)) {
                    context.report({
                        node: node,
                        message: "map",
                        // data: {
                        //     identifier: node.name
                        // }
                        fix: handleFix(node),
                    });
                }
            }
        };
    }
};
