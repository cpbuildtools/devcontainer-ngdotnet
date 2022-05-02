wsl --update
wsl --shutdown
wsl --set-default-version 2

winget list Microsoft.VisualStudioCode && winget upgrade --accept-package-agreements --accept-source-agreements  Microsoft.VisualStudioCode 
winget list Microsoft.VisualStudioCode || winget install --accept-package-agreements --accept-source-agreements Microsoft.VisualStudioCode

winget list Docker.DockerDesktop && winget upgrade Docker.DockerDesktop --accept-package-agreements --accept-source-agreements
winget list Docker.DockerDesktop || winget install Docker.DockerDesktop --accept-package-agreements --accept-source-agreements

winget list Canonical.Ubuntu.2004 && winget upgrade Canonical.Ubuntu.2004 --accept-package-agreements --accept-source-agreements
winget list Canonical.Ubuntu.2004 || winget install Canonical.Ubuntu.2004 --accept-package-agreements --accept-source-agreements

winget list Microsoft.WindowsTerminal && winget upgrade Microsoft.WindowsTerminal --accept-package-agreements --accept-source-agreements
winget list Microsoft.WindowsTerminal || winget install Microsoft.WindowsTerminal --accept-package-agreements --accept-source-agreements

winget list Google.Chrome && winget upgrade Google.Chrome --accept-package-agreements --accept-source-agreements
winget list Google.Chrome || winget install Google.Chrome --accept-package-agreements --accept-source-agreements

winget list Google.Chrome.Dev && winget upgrade Google.Chrome.Dev --accept-package-agreements --accept-source-agreements
winget list Google.Chrome.Dev || winget install Google.Chrome.Dev --accept-package-agreements --accept-source-agreements

winget list Mozilla.Firefox && winget upgrade Mozilla.Firefox --accept-package-agreements --accept-source-agreements
winget list Mozilla.Firefox || winget install Mozilla.Firefox --accept-package-agreements --accept-source-agreements

winget list Mozilla.Firefox.DeveloperEdition && winget upgrade Mozilla.Firefox.DeveloperEdition --accept-package-agreements --accept-source-agreements
winget list Mozilla.Firefox.DeveloperEdition || winget install Mozilla.Firefox.DeveloperEdition --accept-package-agreements --accept-source-agreements