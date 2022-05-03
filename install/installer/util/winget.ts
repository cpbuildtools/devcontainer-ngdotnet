import { run, exec } from './cmd';
import chalk from 'chalk';

export async function isInstalled(id: string) {
    try {
        await run(`winget.exe list -e --id ${id}`);
        return true;
    } catch (e: any) {
        if (e.code === 20) {
            return false;
        }
        throw e;
    }
}

export async function install(id: string) {
    console.log(chalk.greenBright(`Installing ${chalk.blueBright(id)}...`));
    return await exec(`winget.exe install -e --id ${id}`);
}

export async function update(id: string) {
    console.log(chalk.blueBright(`Checking for update for ${chalk.cyanBright(id)}...`));
    return await exec(`winget.exe upgrade -e --id ${id}`);
}

export async function updateOrInstall(id: string) {
    if (await isInstalled(id)) {
        return await update(id);
    }
    return await install(id);
}