exports.version = function(versionTxt) {
  var out = {
    major: null,
    minor: null,
    patch: null
  }
  
  var split = versionTxt.split('.');
  out.major = split[0];
  out.minor = split[1];
  out.patch = split[2];
  
  out.toString = function() {
    return [out.major, out.minor, out.patch].join('.');
  }
  
  return out;
};

exports.versionCompare = function(versionRequired, versionCollected) {
  var out = {
    result: null,
    majorResult: null,
    minorResult: null,
    patchResult: null
  };
  if (versionRequired.major > versionCollected.major) {
    out.majorResult = 'lower';
  } else if (versionRequired.major < versionCollected.major) {
    out.majorResult = 'higher';
  } else {
    out.majorResult = 'equal';
  }
  if (out.majorResult === 'equal') {
    if (versionRequired.minor > versionCollected.minor) {
      out.minorResult = 'lower';
    } else if (versionRequired.minor < versionCollected.minor) {
      out.minorResult = 'higher';
    } else {
      out.minorResult = 'equal';
    }
  }
  if (out.minorResult === 'equal') {
    if (versionRequired.patch > versionCollected.patch) {
      out.patchResult = 'lower';
    } else if (versionRequired.patch < versionCollected.patch) {
      out.patchResult = 'higher';
    } else {
      out.patchResult = 'equal';
    }
  }
  if (
    out.majorResult === 'equal' &&
    out.minorResult === 'equal' &&
    out.patchResult === 'equal'
  ) {
    out.result = 'equal';
  } else {
    if (
      out.majorResult === 'lower' ||
      out.minorResult === 'lower' ||
      out.patchResult === 'lower'
    ) {
      out.result = 'lower';
    } else {
      out.result = 'higher';
    }
  }
  
  return out;
};