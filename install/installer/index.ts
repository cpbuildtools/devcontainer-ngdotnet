import chalk from 'chalk';
import Enumerable from 'linq';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { update, updateOrInstall } from './util/winget.js';
import { wingetPackages } from './winget-packages.js';
import inquirer, { InputQuestion, Question, PasswordQuestion, ListQuestion } from 'inquirer';
import { getEnv, setWindowsEnv } from './util/env.js';
import { getConfig, setConfig } from './util/git.js';
import { readdir } from 'fs/promises';
import { resolve } from 'path';

const wingetQuery = Enumerable.from(wingetPackages);

const coreInstallsQuery = wingetQuery.where(x => !!x.required).orderBy(x => x.id);
const optInstallQuery = wingetQuery.where(x => !x.required);
const categories = optInstallQuery.select(x => x.category).distinct().toArray();

async function installCoreWinApps(updatesOnly?: boolean) {
    console.group(chalk.yellowBright(`Core`));
    for (const install of coreInstallsQuery.toArray()) {
        await (updatesOnly ? update(install.id) : updateOrInstall(install.id));
    }
    console.groupEnd();
}

async function installOptionalWinApps(updatesOnly?: boolean) {
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
async function initializeWsl() {
    console.log(resolve('../../../development'));
    const basePath = resolve('../../../development');
    const devPaths = await readdir(basePath);
    console.log('devPaths', devPaths);

    
    if (!devPaths.length){
        inquirer.prompt({
            type: 'list',
            name: 'cloneOrCreate',
            message: 'Whould you like to:',      
            choices: [
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
            ]
        } as ListQuestion)
    }
/*
    inquirer.prompt([
        {} as 
    ])
    */
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
                ;

        }, async argv => {
            await initializeWsl();
        })
        .parse();
})();