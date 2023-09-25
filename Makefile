all: help
TAG = mvn-frontend
DOCKER_DOMAIN = registry.diginfra.net/hi
version_fn = $(shell cat .make/.version)


.make:
	mkdir -p .make

.make/.version: .make package.json
	jq --raw-output ".version" < package.json > $@

.PHONY: docker-image
docker-image: package.json docker/* static/* src/*
	docker build -t $(DOCKER_DOMAIN)/$(TAG) --platform=linux/amd64 -f docker/Dockerfile .

.make/.push: docker/Dockerfile  .make/.version
	docker build -t $(DOCKER_DOMAIN)/$(TAG):$(call version_fn) --platform=linux/amd64 -f docker/Dockerfile .
	docker push $(DOCKER_DOMAIN)/$(TAG):$(call version_fn)
	@touch $@

.PHONY: push
push:   clean .make/.push

.PHONY: clean
clean:
	rm -rf .make

.PHONY: help
help:
	@echo "make-tools for $(TAG)"
	@echo
	@echo "Please use \`make <target>', where <target> is one of:"
	@echo "  docker-image              to build the linux/amd64 docker image"
	@echo "  push                      to push the linux/amd64 docker image to registry.diginfra.net"


