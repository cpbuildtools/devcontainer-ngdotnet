import { updateOrInstall } from './util/winget';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv;

console.log('argv', argv);

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

    for (const install of windowsInstallsOptional) {
        await updateOrInstall(install);
    }

})();