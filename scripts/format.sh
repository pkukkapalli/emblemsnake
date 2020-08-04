#!/bin/bash

(cd scraper && pipenv run yapf -i -p -r --style=google src) || exit 1
