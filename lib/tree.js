var config = require('./config'),
    fs = require('fs');

exports.parsed = function() {
  var out  = null,
      file = process.cwd() + '/' + config.kuberfile;

  if (fs.existsSync(file)) {
    var data = fs.readFileSync(file, {
      encoding: 'utf8', flag: 'r' 
    });
    out = JSON.parse(data);
  } else {
    console.log('Error! No kuberfile.json found');
  }
  
  return out;
};