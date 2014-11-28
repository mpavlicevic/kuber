var config = require('./config'),
    fs = require('fs');

function augmentTree(tree) {
  //TODO check cicular dependencies
  //TODO sort starting/stopping order
  return tree;
};

exports.parsed = function() {
  var out  = null,
      file = process.cwd() + '/' + config.kuberfile;

  if (fs.existsSync(file)) {
    var data = fs.readFileSync(file, {
      encoding: 'utf8', flag: 'r' 
    });
    out = augmentTree(JSON.parse(data));
  } else {
    console.log('Error! No kuberfile.json found');
  }
  
  return out;
};