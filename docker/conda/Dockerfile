# description: image with base data science packages + conda environment
# author: Rafael Ito
# version:
#   - v0.1: first release

FROM itorafael/ml-generic

USER root
# add Debian non-free packages
RUN echo "deb http://deb.debian.org/debian bullseye contrib non-free" >> /etc/apt/sources.list
RUN echo "deb-src http://deb.debian.org/debian bullseye contrib non-free" >> /etc/apt/sources.list
# update system
RUN apt update && apt upgrade -y
RUN apt install -y \
    git \
    wget

# install Miniconda
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh
RUN bash ~/miniconda.sh -b -p $HOME/miniconda
RUN rm -rf ~/miniconda/miniconda.sh
RUN ~/miniconda/bin/conda init bash
