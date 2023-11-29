#!/usr/bin/env sh
docker build -t itorafael/jupyter-dev:${1:-latest} .
