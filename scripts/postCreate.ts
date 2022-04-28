import { watch } from 'chokidar';
import { readdir } from 'fs/promises';
import { extname } from 'path';
import { syncWorkspaceWithProjects, workspaceDir } from './util/workspace';


(async()=>{
    const workspaces = await readdir(workspaceDir);
    for (const workspace of workspaces) {
        const ext = extname(workspace);
        if(ext === '.code-workspace'){
            await syncWorkspaceWithProjects(workspace);
        }
    }
})();
