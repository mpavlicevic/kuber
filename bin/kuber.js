#!/usr/bin/env node

var nopt = require('nopt'),
    config = require('../lib/config'),
    systemcheck = require('../lib/cli/system-check'),
    tree = require('../lib/tree').parsed();

var parsed = nopt(config.types, config.shorthands);

console.log(parsed);

systemcheck.run();

var cmd = parsed.argv.cooked.shift();

if (config.clicmds[cmd]) {
  config.clicmds[cmd].run(parsed);
}
