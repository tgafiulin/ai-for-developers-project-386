#!/usr/bin/env bash
set -e
NODE_BIN="/tmp/node-v22.14.0-linux-x64/bin"
export PATH="$NODE_BIN:$PATH"
cd "$(dirname "$0")"
exec npx tsx src/main.ts
