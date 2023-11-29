# description: generic dev image to use with Jupyter Docker Stacks
# author: Rafael Ito
# version:
#   - v0.1: first release
#   - v0.2: add jupyter-autopep8
#   - v0.3: add PyDrive2 & Google Drive API

# get parent image:
# https://github.com/jupyter/docker-stacks
FROM jupyter/minimal-notebook

# update system
USER root
RUN apt-get update && apt-get upgrade -y

# install packages with package manager
RUN apt install -y neovim

# switch back to jovyan user to avoid running container as root accidentally
USER ${NB_UID}

# install Python packages with pip
# PyTorch
RUN pip install \
    torch \
    torchvision \
    torchaudio

# TensorFlow
RUN pip install \
    tensorflow

# visualization
RUN pip install \
    matplotlib \
    seaborn \
    tqdm

# other packages
RUN pip install \
    nvidia-ml-py3 \
    pandas \
    scikit-learn \
    thop

# Google Drive
RUN pip install \
    google-api-python-client \
    google-auth-httplib2 \
    google-auth-oauthlib \
    PyDrive2

# Jupyter Notebook Extensions
#   - Widgets
#   - Matplotlib
#   - Vim bindings
#   - Vim copy to clipboard
#   - PEP 8 Python support
RUN pip install \
    ipywidgets \
    ipympl \
    jupyterlab-vim \
    jupyterlab-vimrc \
    autopep8

WORKDIR /home/jovyan
