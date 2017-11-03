#!/usr/bin/env bash

set -e

STAGE=$1

if [[ "$STAGE" == "prod" ]]; then
  export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_PROD
  export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_PROD
else
  export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_DEV
  export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_DEV
  echo "Using dev access key: ${AWS_ACCESS_KEY_ID}"
fi