# base image
FROM python:3.6

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install mongodb -y 

# Install basics
RUN apt-get install -y --no-install-recommends \
  coreutils \
  git \
  wget \
  curl \
  unzip \
  procps\
  ca-certificates


# Install Node.js
RUN curl --silent --location https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential  

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json

RUN apt-get -yqq update && \
  apt-get -yqq --no-install-recommends install git bzip2 curl unzip && \
  apt-get -yqq autoremove && \
  apt-get -yqq clean && \
  rm -rf /var/lib/apt/lists/* /var/cache/* /tmp/* /var/tmp/*


#setup environment for sonar-scanner
ENV SONAR_SCANNER_VERSION 2.8
ENV SONAR_SCANNER_HOME /home/sonar-scanner-${SONAR_SCANNER_VERSION}
ENV SONAR_SCANNER_PACKAGE sonar-scanner-${SONAR_SCANNER_VERSION}.zip
ENV SONAR_RUNNER_HOME ${SONAR_SCANNER_HOME}
ENV PATH $PATH:${SONAR_SCANNER_HOME}/bin

# Install OpenJDK 8
RUN echo 'deb http://deb.debian.org/debian jessie-backports main' > /etc/apt/sources.list.d/jessie-backports.list && \
  apt-get update && \
  apt-get install -y -t jessie-backports openjdk-8-jre-headless ca-certificates-java

# Download sonar
RUN curl --insecure -OL https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/${SONAR_SCANNER_PACKAGE} && \
  unzip ${SONAR_SCANNER_PACKAGE} -d /home && \
  rm ${SONAR_SCANNER_PACKAGE}


# Create a db file for Mongo
RUN mkdir -p /data/db

# add app
COPY . /usr/src/app

RUN apt update && apt install -y procps
#RUN apt clean
RUN rm -rf /var/lib/apt/lists/*
