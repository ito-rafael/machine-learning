# description: base packages + conda env + MiLeNAS framework
# author: Rafael Ito
# version:
#   - v0.1: first release
#   - v0.2: copied CIFAR-10 dataset

#FROM conda/miniconda3
FROM itorafael/conda-dev

ARG GIT_REPO='https://github.com/chaoyanghe/MiLeNAS.git'
ARG CONDA_ENV='milenas'

# update system
USER root
RUN apt update && apt upgrade -y

# clone repo
RUN git clone https://github.com/chaoyanghe/MiLeNAS.git
WORKDIR MiLeNAS

# create conda env
ENV PATH=$PATH:/root/miniconda/bin
RUN conda update -n base -c defaults conda
RUN conda create --name $CONDA_ENV python=3
RUN conda init bash
SHELL ["conda", "run", "-n", "milenas", "/bin/bash", "-c"]
RUN conda install -n milenas pytorch torchvision torchaudio cudatoolkit=10.2 -c pytorch
RUN pip install -r requirements.txt
RUN echo 'conda activate '$CONDA_ENV >> ~/.bashrc

# pip packages
RUN pip install nvidia-ml-py3

# copy CIFAR-10 data
COPY data/cifar-10-batches-py data/cifar-10-batches-py

# prevent container from dying
ENTRYPOINT ["tail", "-f", "/dev/null"]
