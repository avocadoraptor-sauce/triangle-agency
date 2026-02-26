#!/bin/bash
git checkout -b release/$(date +"%Y-%m-%d_%H-%M-%S")
npx webpack --output-filename bundle.js
# Override ignores for a release build
git add -f static
git add -f webpack-stats.json
git commit -a -m "Release"
git push