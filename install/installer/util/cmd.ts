import { spawn } from 'child_process';


export function exec(cmd: string): Promise<number> {
    return new Promise((res, rej) => {
        try {
            console.log('exec:', cmd);
            const child = spawn(cmd, { shell: true, stdio: 'inherit' });
            child.on('exit', (code) => {
                res(code ?? 0);
            });
        }
        catch (e) {
            rej(e);
        }
    });
}


export function run(cmd: string): Promise<string> {
    return new Promise((res, rej) => {
        try {
            let data: string[] = [];
            console.log('run:', cmd);
            const child = spawn(cmd, { shell: true, stdio: 'pipe' });
            child.on('exit', (code) => {
                let d = data.join('');
                if (code === 0) {
                    res(d);
                }
                else {
                    rej({
                        code,
                        data: d
                    });
                }
            });

            child.stdout?.on('data', (d) => {
                data.push(d.toString('utf-8'));
            })
        } catch (e) {
            rej(e);
        }
    });
}