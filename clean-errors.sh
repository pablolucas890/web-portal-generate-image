#!/bin/bash

set -e

IMG_FINAL=$2

echo "Inicio da Remocao dos arquivos temporarios"
rm public/temp/*.db3 public/temp/*.ovpn public/mount-temp/*.gz
echo "Fim da Remocao dos arquivos temporarios"
echo "Inicio da Umount"
umount public/mounted-img
echo "Fim do Umount"
echo "Removendo Arquivo Temporario"
rm public/generated-images/loading-$IMG_FINAL.gz
echo "--Fim--"