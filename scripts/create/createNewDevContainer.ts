import { readdir } from "fs/promises";




(async () => { 
    const ls = await readdir('/output');
    console.log(ls);
})();