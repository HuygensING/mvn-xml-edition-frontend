#!/bin/bash

rm -rf public
npx webpack --config webpack.config.dist.js
cp -r static/ public/
