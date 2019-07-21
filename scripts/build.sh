#!/bin/bash

set -e

yolo use-profile --profile-name "$1"
stage=${CIRCLE_PR_USERNAME:-$CIRCLE_USERNAME}

aws_identity_pool_id=`yolo show-outputs --stage ${stage} --format value --key IdentityPoolId`
aws_userpool_client_id=`yolo show-outputs --stage "${stage}" --format value --key UserPoolClientId`
aws_userpool_id=`yolo show-outputs --stage "${stage}" --format value --key UserPoolId`
aws_region=`yolo show-outputs --stage "${stage}" --format value --key AWSRegion`

export aws_identity_pool_id
export aws_userpool_client_id
export aws_userpool_id
export aws_region

echo "IdentityPoolId: ${aws_identity_pool_id}"
echo "UserPoolClientId: ${aws_userpool_client_id}"
echo "UserPoolId: ${aws_userpool_id}"
echo "Region: ${aws_region}"

yarn run dist
du -h dist/
tree dist/ -ah