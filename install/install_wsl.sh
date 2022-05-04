#!/bin/bash
 
curl https://raw.githubusercontent.com/creationix/nvm/release/latest/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install 16

nvm use 16

npm i -g pnpm

export PNPM_HOME="$HOME/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"

pnpm i -g typescript @types/node ts-node

rm -rf .tmp

git clone --branch release/latest https://github.com/cpbuildtools/devcontainer-ngdotnet.git .tmp
cd .tmp/install/installer
pnpm i

ts-node index.ts install