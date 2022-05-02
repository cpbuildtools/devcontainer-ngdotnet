#!/bin/bash

curr_name=$(git config --global user.name)

if [ -z "${curr_name}" ] 
then
    echo "Enter your Name: "
    read name
else 
    echo "Enter your Name [${curr_name}]: "
    read name
    if [ -z "${name}" ] 
    then
        name=${curr_name}
    fi
fi

if [ -z "${name}" ] 
then
    echo "Error"
    exit 1
fi


curr_email=$(git config --global user.email)

if [ -z "${curr_name}" ] 
then
    echo "Enter your Email: "
    read email
else 
    echo "Enter your Email [${curr_email}]: "
    read email
    if [ -z "${email}" ] 
    then
        email=${curr_email}
    fi
fi

if [ -z "${email}" ] 
then
    echo "Error"
    exit 1
fi

curr_username=${GITHUB_USER}

if [ -z "${curr_username}" ] 
then
    echo "Enter your Github Username: "
    read username
else 
    echo "Enter your Github Username [${curr_username}]: "
    read username
    if [ -z "${username}" ] 
    then
        username=${curr_username}
    fi
fi

if [ -z "${username}" ] 
then
    echo "Error"
    exit 1
fi

curr_token=${GITHUB_TOKEN}

if [ -z "${curr_token}" ] 
then
    echo "Enter your Github Persional Access Token: "
    read token
else 
    echo "Enter your Github Persional Access Token [${curr_token}]: "
    read token
    if [ -z "${token}" ] 
    then
        token=${curr_token}
    fi
fi

if [ -z "${token}" ] 
then
    echo "Error"
    exit 1
fi


git config --global --replace-all user.name "${name}"
git config --global --replace-all user.email "${email}"

setx.exe GITHUB_USER ${username}
setx.exe GITHUB_TOKEN ${token}
setx.exe WSLENV GITHUB_USER:GITHUB_TOKEN

GITHUB_USER=${username}
GITHUB_TOKEN=${token}

mkdir -p ~/development
