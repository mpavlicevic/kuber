var config = require('../config'),
    msg = require('../msg'),
    spawn = require('execSync'),
    _ = require('lodash');

function runCommand(tree, realName, container) {
  var out = 'docker run ';
  out += '--name ' + realName + ' ';
  for(var linkIdx in container.links) {
    out += [
      '--link ', tree.name + '-' + container.links[linkIdx].containerId,
      ':', container.links[linkIdx].linkId, ' '
    ].join('');
  }
  for(var envIdx in container.env) {
    out += [
      '--env ', envIdx, '=', container.env[envIdx], ' '
    ].join('');
  }
  for(var portIdx in container.ports) {
    out += [
      '--publish ', container.ports[portIdx].hostPort,
      ':', container.ports[portIdx].containerPort, ' '
    ].join('');
  }
  out += '-d ' + container.image + ' 1>&2';
  return out;
}

function parseImages(stdout) {
  var out = [];
  var lines = stdout.split('\n');
  for (var i = 1; i<lines.length; i++) {
    var image = {
      repository: lines[i].substring(0, 30).trim(),
      tag: lines[i].substring(30, 50).trim(),
      imageId: lines[i].substring(50, 70).trim(),
      created: lines[i].substring(70, 90).trim(),
      size: lines[i].substring(90).trim()
    };
    if (image.repository !== '<none>') {
      out.push(image);
    }
  }
  return out;
}

function imageCheck(container) {
  var out, type, ret;
  msg.delayedItemStart('Checking image "' + container.image + '"');
  var obj = spawn.exec('docker images 1>&2');
  if (obj.code === 0) {
    var images = parseImages(obj.stdout);
    //TODO consider image tags as well
    if (
      !_.contains(
        _.map(images, function(image) { return image.repository }),
        container.image
      )) {
      out = 'download';
      type = 'warn';
      ret = false;
    } else {
      out = 'present';
      type = 'log';
      ret = true;
    }
  } else {
    out = 'nok';
    type = 'error';
    ret = false;
  }
  msg.delayedItemEnd(out, type);
  if (type === 'error') {
    throw({
      msg: 'docker failed to execute',
      mitigation: 'Make sure docker is installed (via boot2docker or directly)'
    });
  }
  return ret; 
}

function imagePull(container) {
  //TODO: docker pull
}

function containerCheck(tree, containerName, container) {
  var out, type, ret;
  var realName = [tree.name, containerName].join('-');
  msg.delayedItemStart('Checking container "' + realName + '"');
  var obj = spawn.exec('docker inspect ' + realName + ' 1>&2');
  if (obj.code === 0) {
    var inspect = JSON.parse(obj.stdout);
    //TODO make sure it has the correct image
    out = 'present';
    type = 'log';
    ret = true;
  } else {
    out = 'not present';
    type = 'warn';
    ret = false;
  }
  msg.delayedItemEnd(out, type);
  if (type === 'error') {
    throw({
      msg: 'docker failed to execute',
      mitigation: 'Make sure docker is installed (via boot2docker or directly)'
    });
  }
  return ret; 
}

function containerRun(tree, containerName, container) {
  var out, type, ret;
  var realName = [tree.name, containerName].join('-');
  msg.delayedItemStart('Running container "' + realName + '"');
  var cmd = runCommand(tree, realName, container);
  var obj = spawn.exec(cmd);
  if (obj.code === 0) {
    out = 'ok';
    type = 'log';
    ret = true;
  } else {
    out = 'nok';
    type = 'error';
    ret = false;
  }
  msg.delayedItemEnd(out, type);
  if (type === 'error') {
    throw({
      msg: 'docker failed to execute',
      mitigation: cmd + '\n' + obj.stdout
    });
  }
  return ret; 
}

function containerStarted(tree, containerName, container) {
  //TODO check if container is started
}

function containerStart(tree, containerName, container) {
  //TODO start stopped container
}

exports.run = function(opts, tree) {
  
  for (var containerIdx in tree.startingOrder) {
    var containerName = tree.startingOrder[containerIdx];
    var container = tree.containers[containerName];
    msg.head('Starting "' + containerName + '"');
    if (!imageCheck(container)) {
      imagePull(container);
    }
    if (!containerCheck(tree, containerName, container)) {
      containerRun(tree, containerName, container);
    } else {
      if (!containerStarted(tree, containerName, container)) {
        containerStart(tree, containerName, container);
      }
    }
  }

};