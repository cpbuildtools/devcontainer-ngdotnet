import { PackageManager } from "@cpbuildtools/dev-container-common";
import { existsSync } from "fs";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import simpleGit from "simple-git";
import { CodeWorkspace } from "./CodeWorkspace";

export const workspaceDir = "/home/vscode/devcontainer/workspaces";
export const projectsBaseDir = "/home/vscode/devcontainer/projects";

export async function saveWorkspace(path: string, data: CodeWorkspace) {
  await writeFile(path, JSON.stringify(data, undefined, 4), {
    encoding: "utf-8",
  });
}

export async function readWorkspace(path: string) {
  return JSON.parse(
    await readFile(path, { encoding: "utf-8" })
  ) as CodeWorkspace;
}

export async function syncWorkspaceWithProjects(workspaceFile: string) {
  try {
    let workspaceChanged = false;
    const workspacePath = join(workspaceDir, workspaceFile);

    console.info("Syncronizing Workspace:", workspacePath);
    console.group();

    const workspace = await readWorkspace(workspacePath);

    for (const proj of workspace.folders) {
      if (proj.path.startsWith("../projects/")) {
        const projectPath = join(workspaceDir, proj.path);
        console.info("Syncronizing Project:", projectPath);
        console.group();
        let projectPathExists =
          existsSync(projectPath) && (await readdir(projectPath)).length !== 0;

        let repoUri = proj.repository;

        if (!projectPathExists && repoUri) {
          console.info("Cloning", repoUri, "to", projectPath);
          await mkdir(projectPath, { recursive: true });
          const git = simpleGit();
          await git.clone(repoUri, projectPath);
          console.info(repoUri, "cloned.");
          await runPmInstall(projectPath);
        } else if (projectPathExists && !repoUri) {
          const git = simpleGit(projectPath);
          if (await git.checkIsRepo()) {
            const remote = (await git.getRemotes(true)).find(
              (r) => r.name === "origin"
            );
            if (remote) {
              console.info(
                "Adding",
                remote.refs.fetch,
                "to workspace",
                workspacePath
              );
              proj.repository = remote.refs.fetch;
              workspaceChanged = true;
            }
          }
        } else if (projectPathExists && repoUri) {
          // make sure the origin repo matches workspace file, origin wins
          const git = simpleGit(projectPath);
          if (await git.checkIsRepo()) {
            const remote = (await git.getRemotes(true)).find(
              (r) => r.name === "origin"
            );
            if (remote) {
              if (proj.repository !== remote.refs.fetch) {
                console.info(
                  "Updating",
                  repoUri,
                  "to",
                  remote.refs.fetch,
                  "in workspace",
                  workspacePath
                );
                proj.repository = remote.refs.fetch;
                workspaceChanged = true;
              }
            } else {
              console.info("Adding remote origin to", repoUri);
              await git.addRemote("origin", repoUri);
            }
          } else {
            console.warn(
              projectPath,
              "is not a repo but should point to",
              repoUri
            );
          }
        }
        console.groupEnd();
      }
    }
    if (workspaceChanged) {
      await saveWorkspace(workspacePath, workspace);
    }
    console.groupEnd();
  } catch (e) {
    console.error(e);
  }
}

async function runPmInstall(path: string) {
  const pkg = await PackageManager.loadPackage(path);
  if (pkg) {
    console.info("Running install ", pkg.name);
    await pkg.install();
  }
}
