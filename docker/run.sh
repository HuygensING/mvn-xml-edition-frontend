#!/usr/bin/env bash
export mvn_port=9999
docker stop mvn-frontend
export version=$(jq --raw-output ".version" < package.json)
docker run --rm --name mvn-frontend -d -v /tmp/data:/data -p ${mvn_port}:80 registry.diginfra.net/hi/mvn-frontend:$version
docker logs --follow --tail 10 mvn-frontend &
echo "waiting 10 s for the server to start.."
sleep 10s

export base=http://localhost:$mvn_port
curl -i $base
echo
curl -i $base/api/editions
echo
curl -i $base/SERRURE
echo
curl -I $base/docs/BS/config.json