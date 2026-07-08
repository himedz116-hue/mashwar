---
name: esbuild binary loses execute permission after zip import
description: Vite/esbuild fails with "spawn ... EACCES" after importing a project from a zip archive
---

Zip-based project imports (and some pnpm store restores) can strip the execute bit from native
binaries in `node_modules/.pnpm/**/@esbuild/*/bin/esbuild`, causing every Vite dev server and any
esbuild-based build script to fail immediately with `Error: The service was stopped: spawn ...
esbuild EACCES`.

**Why:** zip archives don't reliably preserve unix file-mode bits across extraction, so the
esbuild postinstall step (which normally chmods its own binary) never runs again after a fresh
`pnpm install` on already-extracted node_modules.

**How to apply:** this project (`workspace`, the مشوار/Mashwar pnpm monorepo) now runs
`scripts/fix-esbuild-permissions.sh` via a root `postinstall` script in `package.json`, which
re-chmods any esbuild binaries found under `node_modules`. If you see this EACCES error in a
different project, check for/add a similar postinstall safeguard rather than only doing a one-off
manual `chmod +x`.
