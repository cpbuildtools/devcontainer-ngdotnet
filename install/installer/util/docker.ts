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
        while (!existsSync(dockerConfigPath)) {
            await sleep(500);
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}


export async function getDockerConfigPath(appdata: string) {
    const appdataPath = (await translateWindowsPath(appdata)).trim();
    return join(appdataPath, 'Docker', 'settings.json');
}

export async function waitForDockerInit() {
    let ver = '';
    while (!ver) {
        try {
            ver = await run('docker --version');
            await sleep(250);
        } catch { }
    }
}