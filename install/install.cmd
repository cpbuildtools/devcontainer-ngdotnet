wsl --update
wsl --shutdown
wsl --set-default-version 2

winget list Canonical.Ubuntu.2004 || winget install Canonical.Ubuntu.2004 --accept-package-agreements --accept-source-agreements

wsl --cd ~ curl --ssl https://raw.githubusercontent.com/cpbuildtools/devcontainer-ngdotnet/release/latest/install/install_wsl.sh -o install.sh
wsl --cd ~ chmod +x install.sh
wsl --cd ~ ./install.sh

wsl --shutdown
wsl --cd ~ cd .tmp/install/installer/ && ./initialize_wsl.sh

rem wsl --cd ~ code ./development