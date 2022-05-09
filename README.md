# Install Prerequisites 



## Windows 10+

  1. Press the start button and type `Check for Updates` and press Enter 
  1. Click `Advanced Options` 
  1. Make sure `Receive updates from other Microsoft products` is turned on
  1. Make sure windows is up to date with all patches and drivers
  1. Open the `Microsoft Store`
  1. Search for `App Installer` by Microsoft
      -  Note: In some versions of windows the app installer appears installed but is not fully installed
  1. Install the `App Installer`
  1. Open a cmd terminal as Administrator
  1. Run:  
     ```
     curl --ssl https://raw.githubusercontent.com/cpbuildtools/devcontainer-ngdotnet/release/latest/install/install.cmd -o install.cmd && install.cmd
     ``` 

## Windows 11

Run as Administrator
 ```
 curl --ssl https://raw.githubusercontent.com/cpbuildtools/devcontainer-ngdotnet/release/latest/install/install.cmd -o install.cmd && install.cmd
 ``` 
