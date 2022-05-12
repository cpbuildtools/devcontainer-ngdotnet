#/bin/sh
rm -rf ./output/*
rm -rf ./output/.[a-zA-Z_-]*

pnpm schematics:build
pnpm schematics:create $*
