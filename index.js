/**
 * @fileoverview Suggest to change Lodash to native
 * @author Alexandra
 */
"use strict";

const MapRule = require("./lib/rules/map.js");

module.exports = {
    rules: {
        "map": MapRule,
    }
}