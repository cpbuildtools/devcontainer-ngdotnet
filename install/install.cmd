wsl --install
wsl --update
wsl --shutdown
wsl --set-default-version 2

winget list Canonical.Ubuntu.2004 || winget install Canonical.Ubuntu.2004 --accept-package-agreements --accept-source-agreements

@echo off
for /f "delims=" %%a in ('dir /b %userprofile%\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu20.04onWindows*') do set "ubuntuFile=%%a"
start %userprofile%\AppData\Local\Microsoft\WindowsApps\%ubuntuFile%\ubuntu2004.exe
echo Complete the ubuntu setup in the ubuntu terminal. One ubuntu is set up return to this window.
pause
wsl --shutdown
@echo on

rem make sure to select ububto as the default wsl

wsl --cd ~ curl --ssl https://raw.githubusercontent.com/cpbuildtools/devcontainer-ngdotnet/release/latest/install/install_wsl.sh -o install.sh
wsl --cd ~ chmod +x install.sh
wsl --cd ~ ./install.sh

wsl --shutdown

wsl --cd ~ curl --ssl https://raw.githubusercontent.com/cpbuildtools/devcontainer-ngdotnet/release/latest/install/initialize_wsl.sh -o initialize.sh
wsl --cd ~ chmod +x initialize.sh
wsl --cd ~ ./initialize.sh

rem wsl --cd ~ code ./development