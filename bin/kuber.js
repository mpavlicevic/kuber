#!/usr/bin/env node

var nopt = require('nopt'),
    config = require('../lib/config'),
    msg = require('../lib/msg'),
    systemcheck = require('../lib/cli/system-check');

var opts = nopt(config.types, config.shorthands);

// console.log(opts);

try {
  var tree = require('../lib/tree').parsed();
  
  systemcheck.run();
  
  var cmd = opts.argv.cooked.shift();

  if (config.clicmds[cmd]) {
    config.clicmds[cmd].run(opts, tree);
  }
  console.log('\nDone! All good! \n'.green);
} catch (err) {
  msg.error(err);
  console.log('\nDone with errors!\n'.red);
}