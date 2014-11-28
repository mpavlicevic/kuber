var colors = require('colors');

function outcomePrint(outcomeTxt, outcomeType) {
  outcomeType = outcomeType || 'log';
  switch (outcomeType.toLowerCase()) {
  case 'error':
    process.stdout.write(colors.bold.red(outcomeTxt));
    break;
  case 'warn':
    process.stdout.write(colors.bold.yellow(outcomeTxt));
    break;
  default:
    process.stdout.write(colors.bold.green(outcomeTxt));
    break;
  }
};

exports.head = function (msg) {
  console.log('\n' + msg.bold.underline);
};

exports.item = function (msg, outcomeTxt, outcomeType) {
  exports.delayedItemStart(msg);
  exports.delayedItemEnd(outcomeTxt, outcomeType);
};

exports.delayedItemStart = function (msg) {
  process.stdout.write('* ' + msg + '... ');
};

exports.delayedItemEnd = function (outcomeTxt, outcomeType) {
  process.stdout.write('[');
  outcomePrint(outcomeTxt, outcomeType);
  process.stdout.write(']\n');
};
