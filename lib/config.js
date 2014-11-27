/*


kuber start [<container>]
kuber stop [<container>]

kuber status [<container>]

kuber log [<container>]

kuber destroy [<container>]

kuber build [<container>]

*/

exports.kuberfile = 'kuberfile.json';

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
}