# description: base packages + conda env + MiLeNAS framework
# author: Rafael Ito
# version:
#   - v0.1: first release
#   - v0.2: copied CIFAR-10 dataset
#   - v0.3: pin upstream version + update vars

#FROM conda/miniconda3
FROM itorafael/conda-dev:v0.2

ARG GIT_USER="chaoyanghe"
ARG GIT_REPO="MiLeNAS"
ARG CONDA_ENV="milenas"

# update system
USER root
RUN apt update && apt upgrade -y

# clone repo
RUN git clone "https://github.com/$GIT_USER/$GIT_REPO.git"
WORKDIR $GIT_REPO

# create conda env
RUN conda create --name $CONDA_ENV python=3
RUN conda init bash
SHELL ["conda", "run", "-n", "milenas", "/bin/bash", "-c"]
RUN conda install -n $CONDA_ENV pytorch torchvision torchaudio cudatoolkit=10.2 -c pytorch
RUN echo 'conda activate '$CONDA_ENV >> ~/.bashrc

# additional packages
RUN pip install -r requirements.txt

# copy CIFAR-10 data
COPY data/cifar-10-batches-py data/cifar-10-batches-py

# prevent container from dying
ENTRYPOINT ["tail", "-f", "/dev/null"]
