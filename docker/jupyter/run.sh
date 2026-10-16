#!/usr/bin/env bash

PORT=8888
docker run \
    --user root \
    -p 127.0.0.1:$PORT:8888 \
    -e JUPYTER_TOKEN="ChangeMe" \
    -e GRANT_SUDO="yes" \
    itorafael/jupyter-dev:latest &

