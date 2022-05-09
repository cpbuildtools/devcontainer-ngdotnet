@echo off
curl --ssl https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi -o uwsl.msi && uwsl.msi

wsl --install
