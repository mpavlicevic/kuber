Kuber
=====

A small library providing utility methods to `escape` and `unescape` HTML entities

## Installation

First, you will need access to `docker`. Docker is a linux-only platform as of now. However. If you are on a Mac or Windows, you can install the amazing `boot2docker` to have access to docker:

* [Installing boot2docker](http://boot2docker.io/)

If you are on a Linux box though, installing `docker` itself will take care of the dependencies:

* [Installing docker](https://docs.docker.com/)

Then you are set to install `kuber`:

    npm install -g kuber

## Usage

`Kuber` reads a `kuberfile.json` file from your current location and acts on its instructions.
A `kuberfile.json` is a collection of instructions to tell `docker` how it should operate on a
certain development environment.

Here is a sample that bootstraps a `drupal` container with a `mysql` container dependency:

    {
      "name": "kuberfile-test",
      "author": "Tiago Luchini <luchini@work.co>",
      "containers": {
        "drupal": {
          "image": "samos123/drupal",
          "ports": [{
            "containerPort": 80,
            "hostPort": 8090
          }],
          "env": {
            "DB_USER": "root",
            "DB_PASS": "test"
          },
          "links": [{
            "containerId": "mysql",
            "linkId": "db"
          }]
        },
        "mysql": {
          "image": "mysql",
          "ports": [{
            "containerPort": 3306,
            "hostPort": 3306
          }],
          "env": {
            "MYSQL_ROOT_PASSWORD": "test"
          }
        }
      }
    }

In order to start the containers as specified on your `kuberfile.json` just run:

    $ kuber start

## Release History

* 0.0.1 Pre-alpha release