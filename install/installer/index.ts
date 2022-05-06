import chalk from 'chalk';
import { existsSync } from 'fs';
import { mkdir, readdir, rm } from 'fs/promises';
import inquirer, { InputQuestion, ListQuestion, Question, ConfirmQuestion } from 'inquirer';
import Enumerable from 'linq';
import { resolve } from 'path';
import { join } from 'path/posix';
import { exit } from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { dockerLogin, startDockerDesktop, waitForDockerInit } from './util/docker.js';
import { getEnv, setWindowsEnv } from './util/env.js';
import { getConfig, setConfig } from './util/git.js';
import { readJsonFile, writeJsonFile } from './util/json.js';
import { locateInstallationPath } from './util/windows.js';
import { update, updateOrInstall } from './util/winget.js';
import { translateWindowsPath } from './util/wsl.js';
import { wingetPackages } from './winget-packages.js';

import simpleGit, { GitError } from 'simple-git';
import { exec } from './util/cmd.js';
import {Octokit} from '@octokit/rest';

const gh = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});
const wingetQuery = Enumerable.from(wingetPackages);

const coreInstallsQuery = wingetQuery.where(x => !!x.required).orderBy(x => x.id);
const optInstallQuery = wingetQuery.where(x => !x.required);
const categories = optInstallQuery.select(x => x.category).distinct().toArray();

async function installCoreWinApps(updatesOnly?: boolean) {
    console.info();
    console.info(chalk.yellowBright('********************************************************************'));
    console.info(chalk.yellowBright('* Installing Core Windows Applications                             *'));
    console.info(chalk.yellowBright('********************************************************************'));
    console.info();

    console.group(chalk.yellowBright(`Core`));
    for (const install of coreInstallsQuery.toArray()) {
        await (updatesOnly ? update(install.id) : updateOrInstall(install.id));
    }
    console.groupEnd();
}

async function installOptionalWinApps(updatesOnly?: boolean) {
    console.info();
    console.info(chalk.yellowBright('********************************************************************'));
    console.info(chalk.yellowBright('* Installing Windows Applications                                  *'));
    console.info(chalk.yellowBright('********************************************************************'));
    console.info();

    const cats = optInstallQuery.groupBy(x => x.category, x => x, (category, packages) => ({
        category,
        packages: packages.orderBy(x => x.id).toArray()
    })).orderBy(x => x.category).toArray();

    for (const cat of cats) {
        console.group(chalk.yellowBright(cat.category));
        for (const install of cat.packages) {
            await (updatesOnly ? update(install.id) : updateOrInstall(install.id));
        }
        console.groupEnd();
    }
}


async function cloneDevContainer(basePath: string) {
    const user = getEnv('GITHUB_USER')!;
    const token = getEnv('GITHUB_TOKEN')!;

    const answer = await inquirer.prompt({
        type: 'input',
        name: 'repo',
        message: 'Repository to clone:',
        default: `${user}/ngdotnet-devcontainer`
    } as InputQuestion);

    let repo = answer.repo as string;
    if (repo.startsWith('https://github.com/') && repo.endsWith('.git')) {
        repo = repo.substring('https://github.com/'.length, repo.lastIndexOf('.'));
    }
    if (repo.startsWith('https://github.com/')) {
        repo = repo.substring('https://github.com/'.length);
    }

    if (repo.startsWith('https://') || repo.startsWith('http://')) {
        throw new Error('Only https://github.com is currenly supported');
    }

    const git = simpleGit();
    const path = join(basePath, repo);
    await rm(path, { recursive: true, force: true });
    await mkdir(path, { recursive: true });

    const repoUrl = `https://${token}:x-oauth-basic@github.com/${repo}.git`;
    try {
        await git.clone(repoUrl, path);
    } catch (e) {
        if (e instanceof GitError) {
            console.log('GitError => ', e.message);
            if (e.message.indexOf('Cloning into') !== -1) {
                console.log('Repository not found!!!!!!!!!!!!!');
                const answer = await inquirer.prompt({
                    type: 'confirm',
                    name: 'create',
                    default: true
                } as ConfirmQuestion);
                console.log(answer);
                if (answer.create) {
                    await _createDevContainer(repo, repoUrl, path);
                }
            }
        } else {
            console.log('Other Error => ', e);
            throw e;
        }
    }
    await exec(`code "${path}"`);
}

async function _createDevContainer(repo:string, url:string, path: string) {
    const p = repo.split('/', 2);

    const r = await gh.repos.createInOrg({
        org: p[0],
        name: url,
        description: 'Personal Angular + .Net Devlopment Cocntainer',
        private: true,

    });
    console.log(r.status,r);
    const git = simpleGit();
    await git.clone(url, path);
}

async function createDevContainer(basePath: string) {
   
}
async function loadDevContainer(basePath: string) {
}

function exitInstaller(): never {
    exit(0);
}

async function initializeDocker(appdata: string) {

    const appdataPath = (await translateWindowsPath(appdata)).trim();
    const dockerConfigPath = join(appdataPath, 'Docker', 'settings.json');
    const dockerConfig = await readJsonFile(dockerConfigPath);

    const integratedWslDistros = (dockerConfig.integratedWslDistros ?? []) as string[];
    if (integratedWslDistros.indexOf('Ubuntu-20.04') === -1) {
        integratedWslDistros.push('Ubuntu-20.04');
    }

    dockerConfig.integratedWslDistros = integratedWslDistros;
    await writeJsonFile(dockerConfigPath, dockerConfig);

    console.info();
    console.info(chalk.yellow('********************************************************************'))
    console.info(chalk.yellow('* Waiting for access to docker                                     *'))
    console.info(chalk.yellow('*                                                                  *'))
    console.info(chalk.yellow('* Please make sure that docker desktop is running and restart      *'))
    console.info(chalk.yellow('* the service if nessisarry                                        *'))
    console.info(chalk.yellow('********************************************************************'))
    console.info();

    await waitForDockerInit();
    console.info(chalk.gray('Docker is ready.'));

    const user = getEnv('GITHUB_USER')!;
    const token = getEnv('GITHUB_TOKEN')!;
    await dockerLogin('ghcr.io', user, token);
    await dockerLogin('docker.pkg.github.com', user, token);
}

async function initializeWsl() {


    const basePath = resolve('../../../development');
    if (!existsSync(basePath)) {
        await mkdir(basePath, { recursive: true });
    }
    const devPaths = await readdir(basePath);

    const choices = [
        {
            name: 'Create a new Dev Conatiner.',
            value: 'create'
        },
        {
            name: 'Clone an exiting Dev Conatiner.',
            value: 'clone'
        },
        {
            name: 'Exit.',
            value: 'exit'
        }
    ];

    if (devPaths.length) {
        choices.splice(1, 0, {
            name: 'Load an exiting Dev Conatiner.',
            value: 'load'
        });
    }

    console.info();
    console.info(chalk.green('********************************************************************'));
    console.info(chalk.green('* Dev container prerequisites installed and configured             *'));
    console.info(chalk.green('********************************************************************'));
    console.info();

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: '',
        choices
    } as ListQuestion);

    switch (answer.action) {
        case 'create':
            return await createDevContainer(basePath);
        case 'clone':
            return await cloneDevContainer(basePath);
        case 'load':
            return await loadDevContainer(basePath);
        default:
            exitInstaller();
    }
}

async function configure(args: { name?: string, email?: string, "github-user"?: string, "github-token"?: string }) {
    const questions: Question[] = [];

    if (!args.name) {
        questions.push({
            type: 'input',
            name: 'name',
            message: 'Your full name. Used for git:',
            default: await getConfig('user.name') || undefined,
            validate: (val?: string) => !!val?.trim()
        } as Question);
    }

    if (!args.email) {
        questions.push({
            type: 'input',
            name: 'email',
            message: 'Your email address. Used for git:',
            default: await getConfig('user.email') || undefined,
            validate: (val?: string) => !!val?.trim()
        } as InputQuestion);
    }

    if (!args['github-user']) {
        questions.push({
            type: 'input',
            name: 'github-user',
            message: 'Your github user:',
            default: getEnv('GITHUB_USER') || undefined,
            validate: (val?: string) => !!val?.trim()
        } as InputQuestion);
    }

    if (!args['github-token']) {
        questions.push({
            type: 'input',
            name: 'github-token',
            message: 'Your github personal access token(PAT):',
            default: getEnv('GITHUB_TOKEN') || undefined,
            validate: (val?: string) => {
                if (val?.trim()) {
                    return true;
                }
                val = val === '' ? getEnv('GITHUB_TOKEN') ?? undefined : undefined;
                if (val) {
                    return true;
                }
                return false;
            }
        } as InputQuestion);
    }

    if (questions.length) {
        console.info();
        console.info(chalk.yellow('********************************************************************'));
        console.info(chalk.yellow('* User Information                                                 *'));
        console.info(chalk.yellow('********************************************************************'));
        console.info();
    }

    const answers = Object.assign({}, await inquirer.prompt(questions), args);

    await setConfig('user.name', answers.name ?? '');
    await setConfig('user.email', answers.email ?? '');

    await setWindowsEnv('GITHUB_USER', answers['github-user'] ?? null);
    await setWindowsEnv('GITHUB_TOKEN', answers['github-token'] ?? null);
}

(async () => {
    await yargs(hideBin(process.argv))
        .scriptName('ts-node index.ts')
        .command('install', 'install the dependancies for devcontainers', yargs => {
            return yargs
                .option('core-only', {
                    type: 'boolean',
                    description: 'Skip optional app installations.'
                })
                .option('name', {
                    type: 'string',
                    description: 'Your full name. Used for git.'
                })
                .option('email', {
                    type: 'string',
                    description: 'Your email address. Used for git.'
                })
                .option('github-user', {
                    type: 'string',
                    description: 'Your github user'
                })
                .option('appdata', {
                    type: 'string',
                    description: 'path to windows appdata',
                })
                .option('github-token', {
                    type: 'string',
                    description: 'Your github personal access token(PAT).'
                });
        }, async argv => {
            await configure(argv);
            await installCoreWinApps();
            if (!argv.coreOnly) {
                await installOptionalWinApps();
            }
            await startDockerDesktop(argv.appdata!);
        })
        .command('update', 'update the dependancies for devcontainers', yargs => {
            return yargs
                .option('core-only', {
                    type: 'boolean',
                    description: 'Skip optional app updates'
                })
        }, async argv => {
            await installCoreWinApps(true);
            if (!argv.coreOnly) {
                await installOptionalWinApps(true);
            }

        })
        .command('config', 'configure the dev env', yargs => {
            return yargs
                .option('name', {
                    type: 'string',
                    description: 'Your full name. Used for git.'
                })
                .option('email', {
                    type: 'string',
                    description: 'Your email address. Used for git.'
                })
                .option('github-user', {
                    type: 'string',
                    description: 'Your github user'
                })
                .option('github-token', {
                    type: 'string',
                    description: 'Your github personal access token(PAT).'
                });

        }, async argv => {
            await configure(argv);
        })
        .command('initialize-wsl', 'initialize the dev env', yargs => {
            return yargs
                .option('appdata', {
                    type: 'string',
                    description: 'path to windows appdata',
                })
                ;

        }, async argv => {
            await initializeDocker(argv.appdata!);
            await initializeWsl();
        })
        .parse();
})();