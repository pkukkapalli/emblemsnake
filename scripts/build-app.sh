#!/bin/bash

npm run build || exit 1
mkdir -p dist/assets || exit 1
cp -R assets dist
