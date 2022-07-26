import { Argv } from "yargs";
import {Package, WorkspaceRunOptions} from '@cpbuildtools/dev-container-common'
import Path from 'path/posix'
export const command = "$0 <script-name>";
export const describe = "Runs the script in each of the workspace sub-packages";

export const builder = (yargs: Argv) => {
    return yargs
      .option('parallel', {
        type: 'boolean',
        default: false,
        describe: '',
      })
      .option('order', {
        type: 'boolean',
        default: undefined,
        describe: '',
      })
      .option('order-dependencies', {
        type: 'boolean',
        default: undefined,
        describe: '',
      })
      .option('order-dev-dependencies', {
        type: 'boolean',
        default: undefined,
        describe: '',
      })
      .option('order-peer-dependencies', {
        type: 'boolean',
        default: undefined,
        describe: '',
      })
      .option('order-optional-dependencies', {
        type: 'boolean',
        default: undefined,
        describe: '',
      }).option('dir', {
        type: 'string',
        default: '.',
        describe: '',
      }).positional('script-name', {
        type: 'string',
        demandOption: true,
        describe: '',
      })
  };
  
  export const handler = async (args: any) => {
    console.log(args);
    const config:WorkspaceRunOptions = {
      parallel: args.parallel ?? false
    };

    if(args.order === undefined){
      args.order = false;
    }
    config.dependencyOrder = args.order as boolean;

    if(args.orderDependencies !== undefined || args.orderDevDependencies !== undefined || args.orderPeerDependencies !== undefined || args.orderOptionalDependencies !== undefined){
      config.dependencyOrder = {
        include: {
          dependencies: args.orderDependencies ?? args.order,
          devDependencies: args.orderDevDependencies ?? args.order,
          optionalDependencies: args.orderOptionalDependencies ?? args.order,
          peerDependencies: args.orderPeerDependencies ?? args.order,
        }
      }
    }

    
    const dir = Path.isAbsolute(args.dir) ? args.dir : Path.join(process.cwd(), args.dir);
    console.log('dir:', dir);

    const pkg = await Package.load(dir);
    const result = await pkg.workspaceRun(args.scriptName, config);
    console.log(result);
  };