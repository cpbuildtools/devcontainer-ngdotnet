@echo off 
wsl -l -q 2> nul || goto :enableWSL

echo Downloading wsl update...
curl --ssl https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi > uwsl.msi && uwsl.msi
wsl --update 2> nul

wsl --shutdown
wsl --set-default-version 2

curl --ssl https://raw.githubusercontent.com/cpbuildtools/devcontainer-ngdotnet/release/latest/install/install_wsl.cmd > install_wsl.cmd && install_wsl.cmd

goto end

:enableWSL

echo Enabling Windows Subsystem Linux (this could take a while)...
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

echo Enabling Virtual Machine Platform (this could also take a while)...
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

echo.
echo.
echo.
echo Enabled Windows Subsystem for Linux. Please restart your computer and run this script again.
echo.
echo.
echo.
pause

goto end

:end