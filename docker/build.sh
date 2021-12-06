#!/usr/bin/env bash
export version=$(jq --raw-output ".version" < package.json)
docker build --no-cache -t registry.diginfra.net/hi/mvn-frontend:$version -f docker/Dockerfile .
docker images | grep mvn