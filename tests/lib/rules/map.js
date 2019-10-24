/**
 * @fileoverview Suggest change Lodash map to native
 * @author Alexandra
 */
"use strict";

const rule = require("../../../lib/rules/map");
const { RuleTester } = require("eslint");

const ruleTester = new RuleTester();

const ERROR_MESSAGE = 'Array native method can be used instead of lodash method.';

ruleTester.run("map", rule, {
    valid: [
        "bar",
        "var a = Array.map(function (){})",
        "function bar() { return [1, 2, 3].map(foo) }",
        "var bar = { a: 's', b: 'bar' }; _.map(bar, fn);"
    ],

    invalid: [
        {
            code: "var collection = [];\nvar a = _.map(collection, fn);",
            errors: [
                {
                    message: ERROR_MESSAGE,
                }
            ],
            output: "var collection = [];\nvar a = Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn);"
        },
        {
            code: "var a = _.map([1, 2, 3], fn);",
            errors: [
                {
                    message: ERROR_MESSAGE,
                }
            ],
            output: "var a = [1, 2, 3].map(fn);"
        },
        {
            code: "function test() { return _.map(bar, fn); }",
            errors: [
                {
                    message: ERROR_MESSAGE,
                }
            ],
            output: "function test() { return _.map(bar, fn); }"
        },

    ]
});
