#!/usr/bin/env bash
export version=$(jq --raw-output ".version" < package.json)
export tag=registry.diginfra.net/hi/mvn-frontend:$version
docker build -t $tag -f docker/Dockerfile .
#docker run -rm -d -P -v /tmp/data:/data $tag

if [ $?==0 ]; then
  echo image built:
  docker images | grep mvn-backend
  echo
  echo "to run:"
  echo "  docker run --rm -d -P -v /tmp/data:/data $tag"
  echo "to push:"
  echo "  docker push $image"
  echo
else
  echo "error, no image built"
fi
