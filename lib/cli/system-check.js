var config = require('../config'),
    utils = require('../utils'),
    msg = require('../msg'),
    spawn = require('execSync'),
    resourceBundle = require('../resource-bundle'),
    format = require('string-format');

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
  if (type === 'error') {
    throw(resourceBundle.Error.Boot2Docker.NotInstalled);
  }
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
    if (compare.majorResult === 'lower') {
      type = 'error';
    }
  } else {
    out = 'exit code ' + obj.code;
    type = 'error';
  }
  msg.delayedItemEnd(out, type);
  if (out !== config.externalDependencies.boot2docker.toString() && type != 'error') {
    msg.warn(resourceBundle.Warnings.Boot2Docker.RequiredUpgrade);
  }
  if (type === 'error') {
    throw(resourceBundle.Error.Boot2Docker.OldVersionInstalled);
  }
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
  if (type === 'error') {
    throw(resourceBundle.Error.Boot2Docker.FailedToStart);
  }
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
  if (type === 'error') {
    throw(resourceBundle.Error.Boot2Docker.NotInstalled);
  }
  return out;
};

function b2dVariables() {
  var out, type;
  msg.delayedItemStart('boot2docker variables');
  var obj = spawn.exec('boot2docker start 1>&2');
  if (obj.code === 0) {
    var DOCKER_HOST = obj.stdout.match(/DOCKER_HOST=(.*)/),
        DOCKER_TLS_VERIFY = obj.stdout.match(/DOCKER_TLS_VERIFY=(.*)/),
        DOCKER_CERT_PATH = obj.stdout.match(/DOCKER_CERT_PATH=(.*)/);
    if (
      DOCKER_HOST &&
      DOCKER_TLS_VERIFY &&
      DOCKER_CERT_PATH
    ) {
      type = 'warn';
      out = 'unset';
      process.env.DOCKER_HOST = DOCKER_HOST[1];
      process.env.DOCKER_TLS_VERIFY = DOCKER_TLS_VERIFY[1];
      process.env.DOCKER_CERT_PATH = DOCKER_CERT_PATH[1];
    } else {
      type = 'log';
      out = 'ok';
    }
  } else {
    out = 'exit code ' + obj.code;
    type = 'error';
  }
  msg.delayedItemEnd(out, type);
  if (type === 'warn') {
    var envVarsNotSetObj = resourceBundle.Warnings.Boot2Docker.EnvVarsNotSet;
    msg.warn({
      msg: envVarsNotSetObj.msg,
      mitigation: format(envVarsNotSetObj.mitigation, {
        DOCKER_HOST: DOCKER_HOST[1],
        DOCKER_TLS_VERIFY: DOCKER_TLS_VERIFY[1],
        DOCKER_CERT_PATH: DOCKER_CERT_PATH[1]
      })
    });
  }
  if (type === 'error') {
    throw(resourceBundle.Boot2Docker.Error.NotInstalled);
  }
  return out;
};

function dockerVersion() {
  var out, type;
  msg.delayedItemStart('docker version');
  var obj = spawn.exec('docker version 1>&2');
  if (obj.code === 0) {
    var serverVersion = obj.stdout.match(/Server version: (.*)/);
    if (serverVersion) {
      serverVersion = utils.version(serverVersion[1]);
    }
    var required = config.externalDependencies.docker,
        compare = utils.versionCompare(required, serverVersion),
        out = ['required:', required, 'present:', serverVersion.toString()].join(' ');

    if (compare.result !== 'equal') {
      type = 'warn';
    } else {
      out = serverVersion.toString();
    }
    if (compare.majorResult === 'lower') {
      type = 'error';
    }
  } else {
    out = 'exit code ' + obj.code;
    type = 'error';
  }
  msg.delayedItemEnd(out, type);
  if (out !== config.externalDependencies.docker.toString() && type != 'error') {
    msg.warn(resourceBundle.Warnings.Boot2Docker.RequiredUpgrade);
  }
  if (type === 'error') {
    throw(resourceBundle.Error.Boot2Docker.OldVersionInstalled);
  }
  return out;
};

function localDockerCheck() {
  var out, type;
  msg.delayedItemStart('localdocker alias');
  var obj = spawn.exec('ping -c 4 localdocker 1>&2');
  if (obj.code === 0) {
    out = 'ok';
    type = 'log';
  } else {
    out = 'unset';
    type = 'warn';
  }
  msg.delayedItemEnd(out, type);
  if (type === 'warn') {
    msg.warn(resourceBundle.Warnings.Docker.LocalDockerNotSet);
  }
  return out;
}

exports.run = function(opts) {
  msg.head('System check');
  msg.item('Platform', process.platform);

  if (config.platform.isMac) {
    if (b2dInstalled() === 'ok') {
      b2dVersion();
      if (b2dStatus() !== 'running') {
        b2dStart();
      }
      b2dVariables();
      localDockerCheck();
    }
  }
  dockerVersion();
};