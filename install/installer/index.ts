import { update, updateOrInstall } from './util/winget';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';





const windowsInstalls: string[] = [
    'Microsoft.VisualStudioCode',
    'Docker.DockerDesktop'
];

const windowsInstallsOptional: string[] = [
    'Microsoft.WindowsTerminal',
    'Google.Chrome',
    'Google.Chrome.Dev',
    'Mozilla.Firefox',
    'Mozilla.Firefox.DeveloperEdition',
    'Fortinet.FortiClientVPN'
];


(async () => {

    const argv = await yargs(hideBin(process.argv))
        .option('skip-win-install', {
            type: 'boolean',
            description: 'Skip optional windows app installations'
        })
        .option('win-update-only', {
            type: 'boolean',
            description: 'Only update optional windows apps. Do not install new ones'
        })
        .parse();
    console.log('argv', argv);
    
    /* let answer = await prompt([
         {
             name: 'name',
             type: 'input',
             message: 'Your name',
             default: 'dsad'
         } as InputQuestion
     ]);
     console.log(answer);
 */

    //await run('winget.exe list skype');



    for (const install of windowsInstalls) {
        await updateOrInstall(install);
    }

    if (!argv.skipWinInstall) {
        for (const install of windowsInstallsOptional) {
            await (argv.winUpdateOnly ? update(install) : updateOrInstall(install));
        }
    }

})();