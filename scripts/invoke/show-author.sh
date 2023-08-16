#!/usr/bin/env bash

method="show-author"

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