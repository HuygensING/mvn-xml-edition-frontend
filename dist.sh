#!/bin/bash

webpack --config webpack.config.dist.js
cp -r static/ public/
