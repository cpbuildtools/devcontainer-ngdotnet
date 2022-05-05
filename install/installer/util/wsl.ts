import { run } from './cmd.js';


export async function translateWindowsPath(path: string): Promise<string> {
    const result = await run(`wslpath -a -u "${path}"`);
    return result;
}
export async function translateWslPath(path: string): Promise<string> {
    return await run(`wslpath -a -w "${path}"`);
}



