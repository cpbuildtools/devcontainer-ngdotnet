import { run } from "./cmd";


export async function setWindowsEnv(name: string, value: string | null) {
    try {
        if(value === null){
            console.log(await run(`setx.exe ${name} ''`));
        }else{
            await run(`setx.exe ${name} "${value}"`);
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}