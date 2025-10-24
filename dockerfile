#Recomendação do projeto ACBR para containers Linux
FROM ubuntu:noble

RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    libxml2-dev \
    libssl-dev \
    openssl \
    tini \
    nodejs \
    npm \
    nano \
    build-essential \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/local/lib/libxml2.so /usr/lib/libxml2.so

RUN echo "openssl_conf = openssl_init\n\
[openssl_init]\n\
providers = provider_sect\n\
[provider_sect]\n\
default = default_sect\n\
legacy = legacy_sect\n\
[legacy_sect]\n\
activate = 1" > /etc/ssl/openssl.cnf

RUN update-ca-certificates

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

COPY ./acbrlibs/libacbrnfe64.so /usr/lib/

COPY .env ./

RUN mkdir -p data/config data/notas data/pdf data/Schemas data/cert data/log lib

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["tini", "--"]

CMD ["node", "dist/server.js"]
