import { WingetPackage } from './util/winget.js';

export const wingetPackages: WingetPackage[] = [
    {
        id: 'Microsoft.VisualStudioCode',
        name: 'Microsoft Visual Studio Code',
        description: 'Microsoft Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications. Microsoft Visual Studio Code is free and available on your favorite platform - Linux, macOS, and Windows.',
        version: 'latest',
        required: true,
        category: "Core",
    },
    {
        id: 'Docker.DockerDesktop',
        name: 'Docker Desktop',
        description: 'Docker Desktop is an application for macOS and Windows machines for the building and sharing of containerized applications. Access Docker Desktop and follow the guided onboarding to build your first containerized application in minutes.',
        version: 'latest',
        required: true,
        category: "Core",
    },
    {
        id: 'Canonical.Ubuntu.2004',
        name: 'Ubuntu',
        description: 'Ubuntu on Windows allows you to use Ubuntu Terminal and run Ubuntu command line utilities including bash, ssh, git, apt and many more.',
        version: 'latest',
        required: true,
        category: "Core",
    },
    {
        id: 'Microsoft.WindowsTerminal',
        name: 'Windows Terminal',
        description: 'The new Windows Terminal, a tabbed command line experience for Windows.',
        version: 'latest',
        required: false,
        category: "Utils",
    },
    {
        id: 'Google.Chrome',
        name: 'Google Chrome',
        description: 'A fast, secure, and free web browser built for the modern web. Chrome syncs bookmarks across all your devices, fills out forms automatically, and so much more.',
        version: 'latest',
        required: false,
        category: "Browsers",
    },
    {
        id: 'Google.Chrome.Dev',
        name: 'Google Chrome',
        description: 'Google Chrome for developers',
        version: 'latest',
        required: false,
        category: "Browsers",
    },

    {
        id: 'Mozilla.Firefox',
        name: 'Mozilla Firefox',
        description: 'Mozilla Firefox is free and open source software, built by a community of thousands from all over the world.',
        version: 'latest',
        required: false,
        category: "Browsers",
    },
    {
        id: 'Mozilla.Firefox.DeveloperEdition',
        name: 'Firefox Developer Edition',
        description: 'Firefox Developer Edition is the blazing fast browser that offers cutting edge developer tools and latest features like CSS Grid support and framework debugging.',
        version: 'latest',
        required: false,
        category: "Browsers",
    },
    {
        id: 'dbeaver.dbeaver',
        name: 'DBeaver Community Edition',
        description: 'Windows database management application with support for most popular dbs',
        version: 'latest',
        required: false,
        category: "Databases",
    }
];
