#!/bin/bash
rm -rf app
mkdir app
rsync -r --exclude 'node_modules' --exclude '*.log' --exclude '*.md' --exclude 'tests' ../src/code-set-service/ ./app
docker build -t upmc-isd-eti/esb-code-set-api .
