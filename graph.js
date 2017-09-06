"use strict";

var Gremlin = require('gremlin-secure');
var config = require("./config");

let graph = {}

graph.client = Gremlin.createClient(
    443, 
    config.endpoint, 
    { 
        "session": false,
        "ssl": true,
        "user": `/dbs/${config.database}/colls/${config.collection}`,
        "password": config.primaryKey
    });

module.exports = graph;