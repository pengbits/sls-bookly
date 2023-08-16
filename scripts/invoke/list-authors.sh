#!/usr/bin/env bash

method="list-authors"

directory="./scripts/invoke"
filename="$directory/$method.json"
param="--function $method"

if [ "$1" == "watch" ]; then
  param+=" --watch"
fi 

serverless invoke local $param \
  -p $filename \
  -e STAGE=local \
  -e EXECUTION_CONTEXT=lambda