#!/bin/bash

set -euo pipefail

AWS_CREDENTIALS_FILE=~/.aws/credentials

# Create credentials file, restrict permissions
if [ -f ${AWS_CREDENTIALS_FILE} ]; then
    # Delete file first if it already exists
    rm -f ${AWS_CREDENTIALS_FILE}
else
    # If it doesn't exist, we might have to create the directory first
    mkdir -p `dirname ${AWS_CREDENTIALS_FILE}`
fi
touch ${AWS_CREDENTIALS_FILE}
chmod 600 ${AWS_CREDENTIALS_FILE}

# Take both set of credentials, and shove them into a credentials file used
# by AWS CLI (actually, Yolo).
cat <<EOF > ${AWS_CREDENTIALS_FILE}
[randomlunchdev]
aws_access_key_id=${AWS_ACCESS_KEY_ID_DEV}
aws_secret_access_key=${AWS_SECRET_ACCESS_KEY_DEV}

[certsDev]
aws_access_key_id=${AWS_ACCESS_KEY_ID_DEV}
aws_secret_access_key=${AWS_SECRET_ACCESS_KEY_DEV}

[randomlunchprod]
aws_access_key_id=${AWS_ACCESS_KEY_ID_PROD}
aws_secret_access_key=${AWS_SECRET_ACCESS_KEY_PROD}

[certsProd]
aws_access_key_id=${AWS_ACCESS_KEY_ID_PROD}
aws_secret_access_key=${AWS_SECRET_ACCESS_KEY_PROD}
EOF