#!/usr/bin/env bash
set -e

# Start app with mocks
yarn run naked &
PID=$!
echo "UI server is running PID=$PID"

function isRunning() {
  nc -vz localhost 1337 &> /dev/null
}

echo -n "Waiting for the frontend server."
while ! isRunning; do
  echo -n "."
  sleep 0.1
done

echo -e "\nRunning integration specs."

yarn run e2e

function stopAll() {
  echo "Killing the frontend server PID=$PID"
  kill "$PID"
}

# ..check if it pass
if [ $? -ne 0 ]; then
  stopAll

  echo "Failed!"
  exit 1
else
  stopAll
fi

cd ..