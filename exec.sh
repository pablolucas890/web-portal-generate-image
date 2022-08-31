#!/bin/bash

set -e

IMG_BASE=$1
IMG_FINAL=$2
OFFSET=$3

touch public/generated-images/loading-$IMG_FINAL.gz
cp public/base-images/$IMG_BASE public/mount-temp/$IMG_FINAL
mount -t ext4 -o rw,sync,offset=$OFFSET public/mount-temp/$IMG_FINAL public/mounted-img
cp public/temp/*.db3 public/temp/*.ovpn public/mounted-img/controllar
cd public/mounted-img/controllar

expect << EOF
spawn ./maleta.sh
expect "Digite 1 para configurar o WebServer. Ou digite 2 para configurar a ShowCase:\r"
send -- "1\r"
expect "Digite 1 para Laranja, 2 para Raspberry Pi2 e 3 para Raspberry Pi3:\r"
send -- "3\r"
expect "Digite 1 para Sistema Novo e 2 para Sistema Velho:\r"
send -- "1\r"
expect "Sim/Nao\r"
send -- "Sim\r"
expect eof
EOF
cd -

gzip public/mount-temp/$IMG_FINAL
cp public/mount-temp/$IMG_FINAL.gz public/generated-images/$IMG_FINAL.gz