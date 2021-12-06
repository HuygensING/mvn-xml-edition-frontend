# build image

`docker build -t mvn-frontend-build -f docker/Dockerfile.build .`

`docker run -it -v $(pwd):/work mvn-frontend-build`

`npm i`

`npm run dist`


# production image

`export version=$(jq --raw-output ".version" < package.json)`

`docker build -t registry.diginfra.net/hi/mvn-frontend:$version -f docker/Dockerfile .`

`docker run -t mvn-frontend -d -p80:80 mvn-frontend`
