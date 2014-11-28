var config = require('../config'),
    utils = require('../utils'),
    msg = require('../msg'),
    spawn = require('execSync');

function b2dInstalled() {
  var out, type;
  msg.delayedItemStart('boot2docker installed');
  var obj = spawn.exec('boot2docker version 1>&2');
  if (obj.code === 0) {
    out = 'ok';
    type = 'log';
  } else {
    out = 'nok';
    type = 'error';
  }
  msg.delayedItemEnd(out, type);
  return out;
};

function b2dVersion() {
  var out, type;
  msg.delayedItemStart('boot2docker version');
  var obj = spawn.exec('boot2docker version 1>&2');
  if (obj.code === 0) {
    var required = config.externalDependencies.boot2docker,
        b2dVersion = utils.version(obj.stdout.match(/(\d\.\d\.\d)/)[0]),
        compare = utils.versionCompare(required, b2dVersion),
        out = ['required:', required, 'present:', b2dVersion.toString()].join(' ');
    if (compare.result !== 'equal') {
      type = 'warn';
    } else {
      out = b2dVersion.toString();
    }
    if (compare.majorResult !== 'equal') {
      type = 'error';
    }
  } else {
    out = 'exit code ' + obj.code;
    type = 'error';
  }
  msg.delayedItemEnd(out, type);
  return out;
};

function b2dStart() {
  var out, type;
  msg.delayedItemStart('Starting boot2docker');
  var obj = spawn.exec('boot2docker start 1>&2');
  if (obj.code === 0) {
    var started = /Started\./.test(obj.stdout);
    if (started) {
      out = 'ok';
    } else {
      out = 'error starting: ' + obj.stdout;
      type = 'error';
    }
  } else {
    out = 'exit code ' + obj.code;
    type = 'error';
  }
  msg.delayedItemEnd(out, type);
  return out;
}

function b2dStatus() {
  var out, type;
  msg.delayedItemStart('boot2docker status');
  var obj = spawn.exec('boot2docker status 1>&2');
  if (obj.code === 0) {
    out = obj.stdout.replace(/\n/,'');
    type = 'log';
  } else {
    out = 'exit code ' + obj.code;
    type = 'error';
  }
  if (out === 'running') {
    type = 'log';
  } else {
    type = 'warn';
  }
  msg.delayedItemEnd(out, type);
  return out;
};

exports.run = function(opts) {
  msg.head('System check');
  msg.item('Platform', process.platform);
  
  if (config.platform.isMac) {
    if (b2dInstalled() === 'ok') {
      b2dVersion();
      if (b2dStatus() !== 'running') {
        b2dStart();
      }
    } else {
      throw ('boot2docker not installed');
    }
  }


  // spawn

  //TODO check boot2docker (mac)
  //TODO check variables (mac)
  //TODO check docker proper
};