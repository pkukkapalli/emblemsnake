#!/bin/bash

pipenv run yapf -i -p -r --style=google emblemscraper || exit 1
npm run format
