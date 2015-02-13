var config = require('./config'),
    fs = require('fs'),
    msg = require('./msg'),
    _ = require('lodash'),
    format = require('string-format'),
    resourceBundle = require('./resource-bundle');

function setStartingOrder(tree) {

  var out = 'ok', type, err;

  var containerNames = _.keys(tree.containers);

  var starterCandidates = [];
  var leftContainers = _.clone(containerNames);
  var counter = 0;
  do {
    for(var containerIdx in leftContainers) {
      var containerName = leftContainers[containerIdx];
      var container = tree.containers[containerName];
      var canStart = true;
      for (var linkIdx in container.links) {
        var link = container.links[linkIdx];
        if (!_.contains(containerNames, link.containerId)) {
          out = 'nok';
          type = 'error';
          var kuberBrokenDependencies =
            resourceBundle.Errors.Kuber.BrokenDependencies;
          err = {
            msg: format(kuberBrokenDependencies.msg, {
              containerName: containerName,
              containerId: link.containerId
            }),
            mitigation: kuberBrokenDependencies.mitigation
          };
        }
        canStart = canStart && _.contains(starterCandidates, link.containerId);
      }
      if (canStart) {
        starterCandidates.push(containerName);
        _.remove(containerNames, function(cname) { return cname === containerIdx });
      }
    }
    leftContainers = _.difference(containerNames, starterCandidates);
    counter++;
  } while (leftContainers.length > 0 && counter < containerNames.length);

  if (starterCandidates.length !== containerNames.length) {
    out = 'nok';
    type = 'error';
    var kuberCircularDependencies =resourceBundle.Errors.Kuber.CircularDependencies;
    err = {
      msg: format(kuberCircularDependencies, {
        containers: leftContainers.join('", "')
      }),
      mitigation: kuberCircularDependencies.mitigation
    };
  }

  msg.delayedItemEnd(out, type);

  if (type === 'warn' && err) {
    msg.warn(err);
  }

  if (type === 'error') {
    throw(err);
  }

  if (out === 'ok') {
    tree.startingOrder = _.clone(starterCandidates);
    msg.item('Starting order', '"' + starterCandidates.join('", "') + '"');
  }

  return tree;
};

function setImageTags(tree) {
  for (var containerName in tree.containers) {
    var container = tree.containers[containerName];
    var parts = container.image.split(':');
    if (parts.length === 1) {
      container.image = container.image + ':latest';
      parts = container.image.split(':');
    }
    container.repository = parts[0];
    container.tag = parts[1];
  }

  return tree;
}

exports.parsed = function() {
  var out  = null,
      file = process.cwd() + '/' + config.kuberfile;

  msg.head('Reading kuberfile.json');
  msg.delayedItemStart('Parsing');

  if (fs.existsSync(file)) {
    var data = fs.readFileSync(file, {
      encoding: 'utf8', flag: 'r'
    });
    out = setStartingOrder(JSON.parse(data));
    out = setImageTags(out);
  } else {
    msg.delayedItemEnd('kuberfile.json?', 'error');
    throw (resourceBundle.Errors.Kuber.ConfigNotFound);
  }

  //TODO: validate kuberfile with json schema

  return out;
};