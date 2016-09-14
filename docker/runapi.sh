#!/bin/bash

printf "\nEnter Azure Storage Host URL, followed by [Enter]:"
read -r AZ_HOST
if [ -z "$AZ_HOST" ]; then
  echo "\nAzure Host not supplied"
  exit 1
fi

printf "\nEnter Azure Storage SAS key, followed by [Enter]:"
read -sr AZ_SAS
if [ -z "$AZ_SAS" ]; then
  echo "\n SAS key required see Azure Storage Account Admin"
  exit 1
fi

printf "\nEnter the target Azure table for the service to reference, followed by [Enter]:"
read -r AZ_TABLE
if [ -z "$AZ_TABLE" ]; then
  echo "\n Azure Reference table muts be supplied see Azure Storage Account Admin"
  exit 1
fi

printf "\nEnter the JWT security shared Key value, followed by [Enter]:"
read -sr JWT_KEY
if [ -z "$JWT_KEY" ]; then
  echo "\nJWT shared key must be supplied"
  exit 1
fi

docker run -p 8000:8000 -d --env AZURE_STORAGE_HOST="$AZ_HOST" --env AZURE_STORAGE_SAS="$AZ_SAS" --env AZURE_STORAGE_TABLE="$AZ_TABLE" --env JWT_KEY="$JWT_KEY" upmc-isd-eti/esb-code-set-api
