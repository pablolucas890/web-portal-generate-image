#!/bin/bash

echo "Remocao dos arquivos temporarios"
rm public/mount-temp/*.gz public/mount-temp/*.img
echo "Umount"
umount public/mounted-img
echo "Removendo Arquivo de Loading"
rm public/generated-images/loading-*.gz
echo "--Fim--"
mkdir public/mounted-img

exit 0