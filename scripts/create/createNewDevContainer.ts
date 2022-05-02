import { readdir } from "fs/promises";




(async () => { 
    console.log('CREATE!!!');
    const ls = await readdir('/output');
    console.log(ls);
})();