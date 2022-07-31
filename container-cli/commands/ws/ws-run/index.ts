import {
  PackageManager,
  RunScriptOptions,
  WorkspaceSortingOptions,
} from "@cpbuildtools/dev-container-common";
import Path from "path/posix";
import { Argv } from "yargs";

export const command = "run <script-name>";
export const describe = "Runs the script in each of the workspace sub-packages";

export const builder = (yargs: Argv) => {
  return yargs
    .option("parallel", {
      type: "boolean",
      alias: "p",
      default: false,
      describe: "",
    })
    .option("order", {
      type: "boolean",
      alias: "o",
      default: undefined,
      describe: "",
    })
    .option("order-dependencies", {
      type: "boolean",
      default: undefined,
      describe: "",
    })
    .option("order-dev-dependencies", {
      type: "boolean",
      default: undefined,
      describe: "",
    })
    .option("order-peer-dependencies", {
      type: "boolean",
      default: undefined,
      describe: "",
    })
    .option("order-optional-dependencies", {
      type: "boolean",
      default: undefined,
      describe: "",
    })
    .option("dir", {
      type: "string",
      default: ".",
      describe: "",
    })
    .positional("script-name", {
      type: "string",
      demandOption: true,
      describe: "",
    });
};

export const handler = async (args: any) => {
  if (args.order === undefined) {
    args.order = false;
  }

  const config: Partial<WorkspaceSortingOptions & RunScriptOptions> = {
    parallel: args.parallel ?? false,
    dependencies: args.orderDependencies ?? args.order ?? false,
    devDependencies: args.orderDevDependencies ?? args.order ?? false,
    peerDependencies: args.orderPeerDependencies ?? args.order ?? false,
    optionalDependencies: args.orderOptionalDependencies ?? args.order ?? false,
    throwOnError: false,
    throwOnMissing: false,
  };

  const dir = Path.isAbsolute(args.dir)
    ? args.dir
    : Path.join(process.cwd(), args.dir);
  const pkg = await PackageManager.loadPackage(dir);
  const result = await pkg.workspaceRunScript(args.scriptName, config);
  if (result.hasErrors) {
    process.exit(1);
  }
};
