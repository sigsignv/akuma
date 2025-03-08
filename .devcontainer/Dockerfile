FROM node:22-bookworm

ARG USERNAME=node

ENV LANG=C.UTF-8

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    export DEBIAN_FRONTEND=noninteractive && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
        bash-completion \
        dnsutils \
        less \
        sudo \
        vim \
        whiptail \
        zip

RUN usermod -aG adm,sudo ${USERNAME} && \
    echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/user && \
    chmod 440 /etc/sudoers.d/user

USER ${USERNAME}
CMD [ "/bin/bash", "-l" ]
