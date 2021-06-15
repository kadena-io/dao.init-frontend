#!/bin/sh
echo 'Running: yarn build'
yarn build
echo 'Running: git subtree push --prefix build origin gh-pages'
git subtree push --prefix build origin gh-pages
