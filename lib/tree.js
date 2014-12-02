var config = require('./config'),
    fs = require('fs'),
    msg = require('./msg'),
    _ = require('lodash');

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
          err = {
            msg: [
              'Container "', containerName,
              '" links to non-existent container "',
              link.containerId, '"'
            ].join(''),
            mitigation: 'Check your kuberfile.json for broken dependencies'
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
    err = {
      msg: [
        'Circular dependencies involving containers "',
        leftContainers.join('", "'), '"'
      ].join(''),
      mitigation: 'Check your kuberfile.json for circular dependencies'
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
    throw ({
      msg: 'No kuberfile.json found',
      mitigation: 'Make sure you run kuber from a location where a kuberfile.json file is saved'
    });
  }
  
  //TODO: validate kuberfile with json schema
  
  return out;
};