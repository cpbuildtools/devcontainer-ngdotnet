import { run, exec } from './cmd.js';
import chalk from 'chalk';



export async function translateWindowsPath(path: string):Promise<string> {
    return await run(`wslpath -a -u "${path}"`);
}
export async function translateWslPath(path: string):Promise<string> {
    return await run(`wslpath -a -w "${path}"`);
}