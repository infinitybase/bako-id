FROM ghcr.io/fuellabs/fuel-core:v0.31.0

ENV MIN_GAS_PRICE="${MIN_GAS_PRICE}"
ENV CONSENSUS_KEY="${CONSENSUS_KEY}"
ENV NETWORK_NAME="${NETWORK_NAME}"

# Install curl to use on
# healthcheck config
RUN apt update
RUN apt install curl -y

WORKDIR /root/

COPY config ./config
COPY run.sh .
EXPOSE ${PORT}

CMD ["sh", "./run.sh"]
