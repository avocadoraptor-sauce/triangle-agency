#!/bin/bash
RELEASE_DIR=$(mktemp -d)
ls -la
git worktree add -b release/$(date +"%Y-%m-%d_%H-%M-%S") "$RELEASE_DIR" HEAD
cd $RELEASE_DIR
source env.sh
npx webpack --output-filename bundle.js
# Override ignores for a release build
git add -f static
git add -f webpack-stats.json
git commit -a -m "Release"
git push