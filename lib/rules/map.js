/**
 * @fileoverview Suggest change Lodash map to native
 * @author Alexandra
 */
"use strict";

/**
 * Получение первого аргумента ноды и проверка, что аргументов более одного
 * @param {*} node 
 */
const getFirstArgument = function (node) {
    return node.arguments && node.arguments.length > 1
        ? node.arguments[0]
        : null;
}

/**
 * Проверка, что нода - массив (ex, [1, 2, 3])
 * @param {*} node 
 */
const checkIfArrayExpression = function (node) {
    return node.type === 'ArrayExpression';
}

/**
 * Проверка по скоупу, что нода - идентификатор массива
 * @param {*} node 
 */
const checkIfIdentifier = function (node, context, identifier) {
    if (!node.name) {
        return false;
    }

    const scope = context.getScope();
    const nodeFromScope = scope.set.get(node.name);

    return nodeFromScope && nodeFromScope.defs
        && nodeFromScope.defs.length
        && nodeFromScope.defs[0].node
        && nodeFromScope.defs[0].node.init
        && nodeFromScope.defs[0].node.init.type === identifier;
}

/**
 * Проверка на наличие в ноде символа lodash и метода map
 * @param {} node 
 */
const checkIfLodashSymbol = function (node) {
    return node.callee
        && node.callee.property
        && node.callee.property.name === 'map' && node.callee.object.name === '_';
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
        const handleFix = function (node, firstArg) {
            const sourceCode = context.getSourceCode();

            return function (fixer) {
                const firstArgString = sourceCode.getText(firstArg);
                const rangeToRemove = [
                    node.arguments[0].start,
                    node.arguments[1].start
                ];

                if (checkIfArrayExpression(firstArg)) {
                    return [
                        fixer.removeRange(rangeToRemove),
                        fixer.replaceText(node.callee.object, firstArgString)
                    ];
                }   
                const nodeString = sourceCode.getText(node); 

                if (checkIfIdentifier(firstArg, context, 'ArrayExpression')) {
                    return [
                        fixer.removeRange(rangeToRemove),
                        fixer.replaceText(node.callee.object, firstArgString),
                        fixer.insertTextBefore(node, `Array.isArray(${firstArgString}) ? `),
                        fixer.insertTextAfter(node, ` : ${nodeString}`)
                    ]
                }

                
            }
        }

        return {
            "CallExpression": function (node) {
                const firstArg = getFirstArgument(node);
                if (checkIfLodashSymbol(node) && firstArg 
                    && !checkIfIdentifier(firstArg, context, "ObjectExpression")) {
                    context.report({
                        node: node,
                        message: "Array native method can be used instead of lodash method.",
                        fix: handleFix(node, firstArg),
                    });
                }
            }
        };
    }
};
