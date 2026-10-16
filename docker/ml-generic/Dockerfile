# description: image used for generic data science R&D
# author: Rafael Ito
# version:
#   - v0.1: first release

FROM debian:bullseye

# update system
USER root
RUN apt update && apt upgrade -y

# general packages
RUN apt install -y \
    neovim \
    python3 \
    python3-pip

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
    nvidia-ml-py \
    pandas \
    scikit-learn \
    thop \
    tabulate
