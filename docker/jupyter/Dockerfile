# https://github.com/jupyter/docker-stacks
FROM jupyter/minimal-notebook

USER root
RUN apt-get update && apt-get upgrade -y

RUN apt install -y vim
# switch back to jovyan user to avoid running container as root accidentally
USER ${NB_UID}

RUN pip install \
    torch \
    torchvision \
    torchaudio \
    torchmetrics

RUN pip install \
    tensorflow

RUN pip install \
    matplotlib \
    seaborn \
    tqdm

RUN pip install \
    nvidia-ml-py \
    pandas \
    scikit-learn \
    thop \
    tabulate

# Google Drive
RUN pip install \
    google-api-python-client \
    google-auth-httplib2 \
    google-auth-oauthlib \
    PyDrive2

COPY --chown=jovyan settings/shell-inputrc  /home/jovyan/.inputrc
COPY --chown=jovyan settings/shell-bashrc   /home/jovyan/.bashrc
COPY --chown=jovyan settings/vim-vimrc      /home/jovyan/.vimrc

# install packages with pip
RUN pip install \
    ipywidgets \
    ipympl \
    jupyterlab-vim \
    autopep8 \
    jupyterlab-theme-toggler
    #jupyterlab-vimrc  -->  JupyterLab 3 only

RUN npm install @jupyterlab/apputils

RUN jupyter labextension disable "@jupyterlab/apputils-extension:announcements"

RUN mamba install -y -c conda-forge "nodejs>=20.19.0"

COPY --chown=jovyan extensions/jupyterlab-relative-line-numbers /tmp/relnum
RUN cd /tmp/relnum && \
    npm install && \
    npm run build:prod && \
    pip install . && \
    cd / && rm -rf /tmp/relnum ~/.npm

COPY --chown=jovyan extensions /home/jovyan/.jupyter/lab/user-settings/

WORKDIR /home/jovyan
