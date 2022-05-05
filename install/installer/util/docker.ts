import chalk from 'chalk';
import { exec } from './cmd.js';
import { translateWindowsPath } from './wsl.js';

export async function dockerLogin(url: string, user: string, token: string) {
    console.info(`Atempting to log docker into ${chalk.blueBright(url)} with user ${chalk.yellowBright(user)}`);
    const result = await exec(`docker login ${url} -u ${user} -p ${token}`);
    return !result;
}

export async function getDockerDesktopPath(){
    return await translateWindowsPath('C:/Program Files/Docker/Docker');
}
export async function startDockerDesktop() {
    try{
        console.log('startDockerDesktop:', `start.exe "${await getDockerDesktopPath()}/Docker Desktop.exe"`)
        await exec(`start.exe "${await getDockerDesktopPath()}/Docker Desktop.exe"`);
    }catch(e){
        console.error(e);
        throw e;
    }
}