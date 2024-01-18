# Build Step
FROM mariadb:10.11 as BUILD

ARG MARIADB_ROOT_PASSWORD
ARG MARIADB_DATABASE
ARG MARIADB_USER
ARG MARIADB_PASSWORD

ENV MARIADB_ROOT_PASSWORD=$MARIADB_ROOT_PASSWORD
ENV MARIADB_DATABASE=$MARIADB_DATABASE
ENV MARIADB_USER=$MARIADB_USER
ENV MARIADB_PASSWORD=$MARIADB_PASSWORD

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y curl

COPY scripts/download.sh /download.sh
RUN /download.sh

RUN ["sed", "-i", "s/exec \"$@\"/echo \"not running $@\"/", "/usr/local/bin/docker-entrypoint.sh"]
RUN ["/usr/local/bin/docker-entrypoint.sh", "mysqld", "--datadir", "/initialized-db", "--aria-log-dir-path", "/initialized-db"]

# Run Step
FROM mariadb:10.11

RUN apt-get update
RUN apt-get upgrade -y

RUN echo "UTC" > /etc/timezone \
      && rm -rf /opt/jdk/*src.zip /var/lib/apt/lists/*

COPY --from=BUILD /initialized-db /var/lib/mysql
