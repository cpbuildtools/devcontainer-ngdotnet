import {prompt, InputQuestion} from 'inquirer';


prompt([
    {
        name: 'name',
        type: 'input',
        message: 'Your name',
        default: 'dsad'
    } as InputQuestion
])