#!/usr/bin/env bash

### License: Open Source, BSD-3 Clause
### Source: https://github.com/cloud-hybrid
### Author: Jacob B. Sanders

openssl req -config "${PWD}/.ci/${1}.conf" -new -x509 -sha256 -newkey rsa:2048 -nodes -keyout "${PWD}/.ci/${1}.key" -days 1024 -out "${PWD}/.ci/${1}.crt"

openssl pkcs12 -export -out "${PWD}/.ci/${1}.pfx" -inkey "${PWD}/.ci/${1}.key" -in "${PWD}/.ci/${1}.crt"

### MacOS

sudo security -v add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "${PWD}/.ci/${1}.crt"

### Ubuntu LTS 20.04
# ... sudo apt install libnss3-tools --yes
# ... pk12util -d "sql:${HOME}/.pki/nssdb" -i "${1}.pfx"
# ... certutil -d sql:$HOME/.pki/nssdb -A -t "P,," -n "${1} Certificate" -i "${1}".crt

### Linux 2
# ... sudo yum install -y libnss3-tools
# ... pk12util -d "sql:${HOME}/.pki/nssdb" -i "${1}.pfx"
# ... certutil -d sql:$HOME/.pki/nssdb -A -t "P,," -n "${1} Certificate" -i "${1}".crt
