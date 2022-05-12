import chalk from 'chalk';
import { exec, run } from './cmd.js';
import { sleep } from './sleep.js';
import { translateWindowsPath } from './wsl.js';
import { join } from 'path';
import { existsSync } from 'fs'

export async function dockerLogin(url: string, user: string, token: string) {
    console.info(`Atempting to log docker into ${chalk.blueBright(url)} with user ${chalk.yellowBright(user)}`);
    const result = await exec(`echo "${token}" | docker login ${url} -u ${user} --password-stdin`);
    return !result;
}

export async function getDockerDesktopPath() {
    const path = await translateWindowsPath('C:\\Program Files\\Docker\\Docker');
    return path;
}

export async function startDockerDesktop(appdata: string) {
    try {
        const cmd = `"${await getDockerDesktopPath()}/Docker Desktop.exe" &`;
        await exec(cmd);
        const dockerConfigPath = await getDockerConfigPath(appdata);
        console.log('Waiting for:', dockerConfigPath)
        while (!existsSync(dockerConfigPath)) {
            await sleep(500);
        }
        console.log('found', dockerConfigPath);

    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function restartDocker(appdata: string) {
    console.info(chalk.gray('Restarting Dokcer Desktop...'));
    await killDocker();
    await startDockerDesktop(appdata);
    await waitForDockerInit();
}

export async function getDockerConfigPath(appdata: string) {
    const appdataPath = (await translateWindowsPath(appdata)).trim();
    return join(appdataPath, 'Docker', 'settings.json');
}

export async function killDocker() {
    return await run('taskkill.exe /IM "Docker Desktop.exe" /F');
}

export async function waitForDockerInit() {
    let c = 0;
    const headerDelay = 5;

    while (c !== -1) {
        try {
            if (c < headerDelay) {
                c++;
            } else if (c === headerDelay) {
                console.info();
                console.info(chalk.yellow('********************************************************************'))
                console.info(chalk.yellow('* Waiting for access to docker                                     *'))
                console.info(chalk.yellow('*                                                                  *'))
                console.info(chalk.yellow('* Please make sure that docker desktop is running and restart      *'))
                console.info(chalk.yellow('* the service if nessisarry                                        *'))
                console.info(chalk.yellow('********************************************************************'))
                console.info();
                c++;
            }
            await run('docker info');
            if (c >= headerDelay) {
                console.info(chalk.grey('Docker is ready.'))
            }
            c = -1;
        } catch {
            await sleep(250);
        }
    }
}