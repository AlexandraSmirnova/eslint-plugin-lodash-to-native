/**
 * @fileoverview Suggest change Lodash map to native
 * @author Alexandra
 */
"use strict";

const rule = require("../../../lib/rules/map");
const { RuleTester } = require("eslint");

const ruleTester = new RuleTester();

ruleTester.run("map", rule, {
    valid: [
        "bar",
        "var a = Array.map(function (){})"
    ],

    invalid: [
        {
            code: "var collection = [];\nvar a = _.map(collection, fn);",
            errors: [{
                message: "'collection' ia an array. You can use it instead of lodash",
            }],
            output: "var collection = [];\nvar a = collection.map(fn);"
        }
    ]
});
