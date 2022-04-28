import { watch } from 'chokidar';
import { syncWorkspaceWithProjects, workspaceDir } from './util/workspace';


console.log('watch', workspaceDir);

watch(['*.code-workspace'], { cwd: workspaceDir, ignoreInitial: true })
    .on('all', (e, p, s) => {
        syncWorkspaceWithProjects(p);
    });
