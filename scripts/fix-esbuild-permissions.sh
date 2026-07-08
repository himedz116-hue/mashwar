#!/bin/bash
# Restores the execute bit on esbuild binaries under node_modules.
# Zip-based imports and some pnpm store restores can strip +x from
# native binaries, causing "spawn ... EACCES" errors from esbuild/Vite.
set -e

find node_modules/.pnpm -type f -path "*/@esbuild/*/bin/esbuild" -exec chmod +x {} \; 2>/dev/null || true
find node_modules -maxdepth 3 -type f -name "esbuild" -path "*/.bin/*" -exec chmod +x {} \; 2>/dev/null || true

exit 0
