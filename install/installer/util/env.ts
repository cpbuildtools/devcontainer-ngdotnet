import { run, exec } from "./cmd.js";


export async function setWindowsEnv(name: string, value: string | null) {
    try {
        if(value === null){
            console.log(await run(`setx.exe ${name} ''`));
        }else{
           await run(`setx.exe ${name} "${value}"`);
        }
        process.env[name] = value ?? undefined;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export function getEnv(name: string): string | null {
    return process.env[name] ?? null; 
}