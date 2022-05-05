import chalk from 'chalk';
import { exec, run } from './cmd.js';
import { translateWindowsPath } from './wsl.js';

export async function dockerLogin(url: string, user: string, token: string) {
    console.info(`Atempting to log docker into ${chalk.blueBright(url)} with user ${chalk.yellowBright(user)}`);
    const result = await exec(`docker login ${url} -u ${user} -p ${token}`);
    return !result;
}

export async function getDockerDesktopPath(){
    const path = await translateWindowsPath('C:\\Program Files\\Docker\\Docker');
    return path;
}
export async function startDockerDesktop() {
    try{
        const cmd = `"${await getDockerDesktopPath()}/Docker Desktop.exe" &`;
        console.log('startDockerDesktop:', cmd);
        let started = false;
        while(!started){
            try{
                const r = await run('docker --version');
                console.log('ver:', r);
                started = true;
            }catch(e){
                console.log(e)
            }
        }
        await exec(cmd);
    }catch(e){
        console.error(e);
        throw e;
    }
}