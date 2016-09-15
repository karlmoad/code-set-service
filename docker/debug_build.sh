#!/bin/bash
rm -rf debug
mkdir debug
rsync -r --exclude 'node_modules' --exclude '*.log' --exclude '*.md' --exclude 'tests' ../src/code-set-service/ ./debug
docker build -f DebugDockerfile -t upmc-isd-eti/esb-code-set-api-debug .
