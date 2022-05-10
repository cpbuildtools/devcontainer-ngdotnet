@echo off

wsl --install > nul 2>&1
wsl --update
wsl --shutdown
wsl --set-default-version 2

 curl --ssl https://raw.githubusercontent.com/cpbuildtools/devcontainer-ngdotnet/release/latest/install/install_wsl.cmd > install_wsl.cmd && install_wsl.cmd
