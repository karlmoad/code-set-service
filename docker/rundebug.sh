#!/bin/bash

FILE=run.env

if [ ! -f $FILE ]; then
  printf "Runtime environment variable file does not exist\nExiting.... "
  exit 1
fi
source ${FILE}

if [ -z "${AZURE_STORAGE_HOST// }" ] || [ -z "${AZURE_STORAGE_SAS// }" ] || [ -z "${AZURE_STORAGE_TABLE// }" ] || [ -z "${JWT_KEY// }" ];
then
  printf "Runtime Envirnment Variable(s) were not set\nExiting...."
  exit 1
fi

printf "Envirnment variables set - running container..................."

docker run -p 8000:8000 -p 6000:6000 -d -e AZURE_STORAGE_HOST -e AZURE_STORAGE_SAS -e AZURE_STORAGE_TABLE -e JWT_KEY upmc-isd-eti/esb-code-set-api-debug

printf "\n\n\n...... END OF LINE ......\n\n\n"
