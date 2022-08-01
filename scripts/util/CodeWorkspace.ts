export interface CodeWorkspace {
  folders: {
    path: string;
    name?: string;
    repository?: string;
  }[];
  settings: { [setting: string]: string };
}
