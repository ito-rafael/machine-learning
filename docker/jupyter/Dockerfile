# description: generic dev image to use with Jupyter Docker Stacks
# author: Rafael Ito
# version:
#   - v0.1: first release

# get parent image:
# https://github.com/jupyter/docker-stacks
FROM jupyter/minimal-notebook

# update system
USER root
RUN apt-get update && apt-get upgrade -y

# install packages
RUN apt install -y neovim

# Switch back to jovyan to avoid accidental container runs as root
USER ${NB_UID}

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

# Jupyter Notebook Extensions
# Widgets
# Matplotlib
# Vim bindings
# Vim copy to clipboard
RUN pip install \
    ipywidgets \
    ipympl \
    jupyterlab-vim \
    jupyterlab-vimrc

# conda env inside Jupyter
RUN conda install nb_conda_kernels

# Jupyter on terminal
RUN git clone https://github.com/davidbrochart/nbterm.git
WORKDIR nbterm
COPY nbterm/key_bindings.py nbterm/key_bindings.py
RUN pip install ipykernel
RUN pip install .

WORKDIR /home/jovyan
