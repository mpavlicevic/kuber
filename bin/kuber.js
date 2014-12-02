#!/usr/bin/env node

var nopt = require('nopt'),
    config = require('../lib/config'),
    msg = require('../lib/msg'),
    systemcheck = require('../lib/cli/system-check');

var parsed = nopt(config.types, config.shorthands);

// console.log(parsed);

try {
  var tree = require('../lib/tree').parsed()
  
  systemcheck.run();
  
  var cmd = parsed.argv.cooked.shift();

  if (config.clicmds[cmd]) {
    config.clicmds[cmd].run(parsed);
  }
  console.log('Done! All good! \n'.green);
} catch (err) {
  msg.error(err);
  console.log('Done with errors!\n'.red);
}