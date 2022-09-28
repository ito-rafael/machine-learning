# description: base packages + conda env + SL & FL
# author: Rafael Ito
# version:
#   - v0.0.1: first scratch release

#FROM conda/miniconda3
FROM itorafael/conda-dev:v0.2

ARG GIT_USER="bt-s"
ARG GIT_REPO="Split-Learning-and-Federated-Learning"
ARG CONDA_ENV="splitlearning"

# update system
USER root
RUN apt update && apt upgrade -y

# clone repo
RUN git clone "https://github.com/$GIT_USER/$GIT_REPO.git"
WORKDIR $GIT_REPO

# create conda env
RUN conda create --name $CONDA_ENV python=3.7.3
RUN conda init bash
SHELL ["conda", "run", "-n", "splitlearning", "/bin/bash", "-c"]
RUN echo 'conda activate '$CONDA_ENV >> ~/.bashrc

# additional packages
RUN apt install -y libopenmpi-dev
RUN pip install -r requirements.txt
RUN pip install     \
    nvidia-ml-py3   \
    Pillow==6.1

# copy CIFAR-10 data
#COPY data/cifar-10-batches-py data/cifar-10-batches-py

# prevent container from dying
ENTRYPOINT ["tail", "-f", "/dev/null"]
