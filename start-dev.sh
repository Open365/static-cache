#!/bin/bash
set -e
set -u

THISDIR="$(cd "$(dirname "$0")" && pwd)"

# this script is only used by the developers, so run it in localhost
# export EYEOS_STATICCACHE_URL=localhost
# export EYEOS_STATICCACHE_PERSISTENCE_HOST=localhost

node "$THISDIR/src/eyeos-static-cache.js"
