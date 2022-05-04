import { run, exec } from './cmd.js';
import chalk from 'chalk';



export async function dockerLogin(url: string, user:string, token:string) {
    console.info(`Atempting to log docker into ${chalk.blueBright(url)} with user ${chalk.yellowBright(user)}`);
    const result = await exec(`docker login ${url} -u ${user} -p ${token}`);
    return !result;
}