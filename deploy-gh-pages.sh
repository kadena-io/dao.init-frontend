#!/bin/sh
echo 'git push origin `git subtree split --prefix build master`:gh-pages --force'
git push origin `git subtree split --prefix build master`:gh-pages --force
