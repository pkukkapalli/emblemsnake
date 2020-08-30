#!/bin/bash

./scripts/lint.sh || exit 1;
./scripts/format.sh
