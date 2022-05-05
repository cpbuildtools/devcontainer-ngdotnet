import { run } from './cmd.js';


export async function translateWindowsPath(path: string): Promise<string> {
    console.log('translateWindowsPath:', path);
    return await run(`wslpath -a -u "${path}"`);
}
export async function translateWslPath(path: string): Promise<string> {
    return await run(`wslpath -a -w "${path}"`);
}



