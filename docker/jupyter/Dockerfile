# description: generic dev image to use with Jupyter Docker Stacks
# author: Rafael Ito
# version:
#   - v0.1: first release
#   - v0.2: add jupyter-autopep8
#   - v0.3: add PyDrive2 & Google Drive API
#   - v0.4: configure vim keybindings: "hjkl" --> "jkl;" (qwerty shifted right 1u)
#   - v0.5:
#     - replace Neovim with standard Vim
#     - copy dotfiles for Bash and Vim
#     - Jupyter:
#       - update to JupyterLab 4
#       - uninstall jupyterlab-vimrc (breaks copy to clipboard)
#       - disable Jupyter announcements notification
#       - enable Jupyter extensions by default
#       - configure vim bindings (Colemak-DH) for notebook in "Keyboard Shortcuts"
#       - configure vim bindings (Colemak-DH) inside cells in "Notebook Vim" [@axlair/jupyterlab_vim]
#       - set Jupyter theme to dark
#       - install button to toggle theme
#       - enable line number in console & all cell types

# get parent image:
# https://github.com/jupyter/docker-stacks
FROM jupyter/minimal-notebook

# update system
USER root
RUN apt-get update && apt-get upgrade -y

# install packages with package manager
RUN apt install -y vim

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

# adjust some settings
COPY --chown=jovyan settings/shell-inputrc  /home/jovyan/.inputrc
COPY --chown=jovyan settings/shell-bashrc   /home/jovyan/.bashrc
COPY --chown=jovyan settings/vim-vimrc      /home/jovyan/.vimrc
# Neovim
#COPY --chown=jovyan settings/nvim-vimrc.vim    /home/jovyan/.config/nvim/vimrc.vim
#COPY --chown=jovyan settings/nvim-init.lua     /home/jovyan/.config/nvim/init.lua
#COPY --chown=jovyan settings/nvim-plugins.lua  /home/jovyan/.config/nvim/lua/plugins.lua

# Jupyter Notebook Extensions
#
# caveat:
#   - jupyterlab-vimrc is needed for "copy to clipoard" to work. However, it requires JupyterLab 3. If you want this feature include "jupyterlab-vimrc" in the list of the packages installed by pip. You will also need to install the button to toggle the theme from labextension instead of pip.
#
# with pip:
#   Both JupyterLab 3 and 4:
#     - ipywidgets:                Widgets
#     - ipympl:                    Matplotlib
#     - jupyterlab-vim:            Vim bindings
#     - autopep8:                  PEP 8 Python support
#
#   JupyterLab 3 only:
#     - jupyterlab-vimrc:          Vim copy to clipboard (requires JupyterLab 3, unfortunately)
#     - jupyterlab-theme-toggler:  Top bar button to toggle theme
#
RUN pip install \
    ipywidgets \
    ipympl \
    jupyterlab-vim \
    autopep8 \
    jupyterlab-theme-toggler
    #jupyterlab-vimrc  -->  JupyterLab 3 only

# with labextension: (will be deprecated in a future major version of JupyterLab)
#   JupyterLab 3 only:
#     - jupyterlab-topbar-extension jupyterlab-theme-toggle
#     - jupyterlab-theme-toggler:  Top bar button to toggle theme
#
# install top bar button to toggle theme
#RUN jupyter labextension install jupyterlab-topbar-extension jupyterlab-theme-toggle

# with npm:
#   - apputils:          UI utils (disable announcements notification)
RUN npm install @jupyterlab/apputils

# disable Jupyter announcements notification
RUN jupyter labextension disable "@jupyterlab/apputils-extension:announcements"

# enable copy to clipboard (JupyterLab 3 only)
#COPY --chown=jovyan extensions/jupyterlab-vimrc/vimrc.jupyterlab-settings /home/jovyan/.jupyter/lab/user-settings/jupyterlab-vimrc/vimrc.jupyterlab-settings

# set theme to dark
COPY --chown=jovyan extensions/\@jupyterlab/apputils-extension/themes.jupyterlab-settings /home/jovyan/.jupyter/lab/user-settings/\@jupyterlab/apputils-extension/themes.jupyterlab-settings

# enable extensions
COPY --chown=jovyan extensions/\@jupyterlab/extensionmanager-extension/plugin.jupyterlab-settings /home/jovyan/.jupyter/lab/user-settings/\@jupyterlab/extensionmanager-extension/plugin.jupyterlab-settings

# configure Colemak-DH in JupyterLab with jupyterlab-vim (hjkl --> neio)
COPY --chown=jovyan extensions/\@axlair/jupyterlab_vim/plugin.jupyterlab-settings /home/jovyan/.jupyter/lab/user-settings/\@axlair/jupyterlab_vim/plugin.jupyterlab-settings

# set keyboard shortcuts for Colemak-DH
COPY --chown=jovyan extensions/\@jupyterlab/shortcuts-extension/shortcuts.jupyterlab-settings /home/jovyan/.jupyter/lab/user-settings/\@jupyterlab/shortcuts-extension/shortcuts.jupyterlab-settings

# enable line numbers in console
COPY --chown=jovyan extensions/\@jupyterlab/console-extension/tracker.jupyterlab-settings /home/jovyan/.jupyter/lab/user-settings/\@jupyterlab/console-extension/tracker.jupyterlab-settings

# enable line numbers in notebook
COPY --chown=jovyan extensions/\@jupyterlab/notebook-extension/tracker.jupyterlab-settings /home/jovyan/.jupyter/lab/user-settings/\@jupyterlab/notebook-extension/tracker.jupyterlab-settings

WORKDIR /home/jovyan
