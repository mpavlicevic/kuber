var utils = require('./utils');

/*


kuber start [<container>]
kuber stop [<container>]

kuber status [<container>]

kuber log [<container>]

kuber destroy [<container>]

kuber build [<container>]

*/

exports.kuberfile = 'kuberfile.json';

exports.externalDependencies = {
  boot2docker: utils.version('1.8.0'),
  docker: utils.version('1.8.0')
};

exports.types = {
  'foo' : [String, null]
              , "bloo" : [ "big", "medium", "small" ]
              , "flag" : Boolean
              , "verbose" : Boolean
              , "many" : [String, Array]
              };

exports.shorthants = { "foofoo" : ["--foo", "Mr. Foo"]
               , "b7" : ["--bar", "7"]
               , "m" : ["--bloo", "medium"]
               , "v" : ["--verbose"]
               , "f" : ["--flag"]
               };

exports.clicmds = {
  start: require('./cli/start')
};

exports.platform = {
  isMac: /darwin/.test(process.platform),
  isWin:   /win32/.test(process.platform),
  isLinux: /linux/.test(process.platform)
};