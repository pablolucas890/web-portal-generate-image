#!/bin/bash

set -e

IMG_BASE=$1
IMG_FINAL=$2
IMG_FINAL=$2

echo "Inicio da Copia da Imagem"
cp public/base-images/$IMG_BASE public/mount-temp/$IMG_FINAL
echo "Fim da Copia dos Arquivos"
echo "Inicio do Mount"
# Fazer Ofsset Dinamico
# 4194304
# 1999872
mount -t ext4 -o rw,sync,offset=4194304 public/mount-temp/$IMG_FINAL public/mounted-img
echo "Fim do Mount"
echo "Inicio da Copia dos Arquivos"
cp public/temp/*.db3 public/temp/*.ovpn public/mounted-img/controllar
echo "Fim da Copia dos Arquivos"

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

echo "Inicio da Umount"
umount public/mounted-img
echo "Fim do Umount"
echo "Inicio da Comprecao"
gzip public/mount-temp/$IMG_FINAL
echo "Fim da Comprecao"
echo "Inicio da Copia da Imagem para Download"
cp public/mount-temp/$IMG_FINAL.gz public/generated-images/$IMG_FINAL.gz
echo "Inicio da Copia da Imagem para Download"
echo "Inicio da Remocao dos arquivos temporarios"
rm public/temp/*.db3 public/temp/*.ovpn public/mount-temp/*.gz
echo "Fim da Remocao dos arquivos temporarios"
echo "--Fim--"