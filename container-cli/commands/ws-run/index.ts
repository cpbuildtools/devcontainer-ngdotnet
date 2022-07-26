import { Argv } from "yargs";

export const command = "$0";
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
      })
  };
  
  export const handler = async (args: any) => {
    console.log(args);
  };