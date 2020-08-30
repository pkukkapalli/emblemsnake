#!/bin/bash

pipenv run pylint emblemscraper || exit 1;
npm run lint
