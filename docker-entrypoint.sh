#!/bin/sh
# Generate an SSH host key on first boot if one isn't already present
# (e.g. via a mounted volume). Keeps private keys out of the built image.
set -e

KEY_DIR="/app/keys"
KEY_PATH="$KEY_DIR/ssh_host_rsa_key"

if [ ! -f "$KEY_PATH" ]; then
  echo "No host key found — generating one at $KEY_PATH"
  mkdir -p "$KEY_DIR"
  ssh-keygen -t rsa -b 2048 -f "$KEY_PATH" -N "" -q
fi

exec node bin/ssh-server.js
