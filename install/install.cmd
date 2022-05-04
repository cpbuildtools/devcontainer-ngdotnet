wsl --install
wsl --update
wsl --shutdown
wsl --set-default-version 2

winget list Canonical.Ubuntu.2004 || winget install Canonical.Ubuntu.2004 --accept-package-agreements --accept-source-agreements

rem make sure to select ububto as the default wsl

wsl --cd ~ curl --ssl https://raw.githubusercontent.com/cpbuildtools/devcontainer-ngdotnet/release/latest/install/install_wsl.sh -o install.sh
wsl --cd ~ chmod +x install.sh
wsl --cd ~ ./install.sh

wsl --shutdown

wsl --cd ~ curl --ssl https://raw.githubusercontent.com/cpbuildtools/devcontainer-ngdotnet/release/latest/install/initialize_wsl.sh -o initialize.sh
wsl --cd ~ chmod +x initialize.sh
wsl --cd ~ ./initialize.sh

rem wsl --cd ~ code ./development