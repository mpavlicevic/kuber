#!/usr/bin/env node

var nopt = require('nopt'),
    config = require('../lib/config'),
    tree = require('../lib/tree').parsed();



var parsed = nopt(config.types, config.shorthands);

console.log(parsed);

var cmd = parsed.argv.cooked.shift();

if (config.clicmds[cmd]) {
  config.clicmds[cmd].run(parsed);
}
