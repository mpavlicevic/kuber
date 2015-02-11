'use strict';

module.exports = {
  Errors: {
    Boot2Docker: {
      NotInstalled: {
        msg: 'boot2docker not installed',
        mitigation: 'Visit http://boot2docker.io/ in order to download it'
      },
      FailedToStart: {
        msg: 'boot2docker failed to start'
      },
      OldVersionInstalled: {
        msg: 'can\'t run boot2docker or version is too old',
        mitigation: 'Visit http://boot2docker.io/ in order to upgrade it'
      }
    },
    Kuber: {
      BrokenDependencies: {
        msg: 'Container "{containerName}" links to non-existent container' +
          ' "{containerId}"',
        mitigation: 'Check your kuberfile.json for broken dependencies'
      },
      CircularDependencies: {
        msg:
          'Circular dependencies involving containers "{containers}"',
        mitigation: 'Check your kuberfile.json for circular dependencies'
      },
      ConfigNotFound: {
        msg: 'No kuberfile.json found',
        mitigation: 'Make sure you run kuber from a location where a kuberfile.json file is saved'
      }
    }
  },
  Warnings: {
    Boot2Docker: {
      RequiredUpgrade: {
        msg: 'boot2docker version may require upgrade',
        mitigation: 'Visit http://boot2docker.io/ in order to upgrade it'
      },
      EnvVarsNotSet: {
        msg: 'boot2docker environment variables not set',
        mitigation: 'Consider adding the following lines to your .bash_profile:\n' +
        '  export DOCKER_HOST={DOCKER_HOST}\n' +
        '  export DOCKER_TLS_VERIFY={DOCKER_TLS_VERIFY}\n' +
        '  export DOCKER_CERT_PATH={DOCKER_CERT_PATH}'
      }
    },
    Docker: {
      LocalDockerNotSet: {
        msg: 'localdocker not set on hosts file',
        mitigation: 'Consider adding a line to your hosts file pointing localdocker to 192.168.59.103'
      }
    }
  }
};