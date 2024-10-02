import {join} from "path";
import {existsSync} from "fs";

export function getHelpersFolderPath(folderName: string): string {
  const rootFolder = __dirname;
  const pathWhenExecutingViaTsNode = join(rootFolder, "..", "..", "..", "..", "..", folderName);
  if (existsSync(pathWhenExecutingViaTsNode)) return pathWhenExecutingViaTsNode;

  const pathWhenExecutingViaBuildFolder = join(rootFolder, "..", "..", "..", "..", "..", "..", folderName);
  if (existsSync(pathWhenExecutingViaBuildFolder)) return pathWhenExecutingViaBuildFolder;

  throw Error(`Could not find helpers folder '${folderName}'`);
}