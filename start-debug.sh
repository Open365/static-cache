#!/bin/bash
set -e
set -u

node --debug-brk=5858 src/eyeos-static-cache.js
