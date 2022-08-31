#!/bin/bash

IMG_FINAL=$1

echo "Remocao dos arquivos temporarios"
rm public/temp/*.db3 public/temp/*.ovpn public/mount-temp/*.gz public/mount-temp/*.img
echo "Umount"
umount public/mounted-img
echo "Removendo Arquivo de Loading"
rm public/generated-images/loading-$IMG_FINAL.gz
echo "--Fim--"

exit 0