#!/usr/bin/env bash

# Create version string.

VERS=`date +%s`
CERT="cert.p12"
KEY="bmVa6j7JhZ4H8d2jwYU6wTeN"
NAME="ai-brander"
COUNTRY="US"
CITY="Richmond"
ORG="Atomic Lotus, LLC"
DOMAIN="atomiclotus.net"

# Use these two lines to run a Gulp task or tasks and wait for completion.

# gulp host client
# wait $!

# If the `build` directory exists, delete it.

if [ -d build ]; then
    rm -Rf build
fi

if [ -d dist ]; then
    rm -Rf dist/*
fi

if [ ! -d dist ]; then
    mkdir dist
fi

# Create a clean build directory.

mkdir build

# Copy source code to build directory.

cp -R client build/client
cp -R csxs build/csxs
cp -R host build/host

# Build and sign the extension.

./bin/ZXPSignCmd -selfSignedCert $COUNTRY $CITY "$ORG" $DOMAIN $KEY ./bin/$CERT
./bin/ZXPSignCmd -sign build dist/$NAME-$VERS.zxp ./bin/$CERT $KEY -tsa https://www.safestamper.com/tsa

# Delete the build directory.

if [ -d build ]; then
    rm -Rf build
fi
