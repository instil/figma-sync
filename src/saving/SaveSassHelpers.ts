import {existsSync} from "fs";
import {outputFolder, spacersConfig} from "@src/config/providers/Config";
import {copySassHelper} from "@src/saving/utils/CopySassHelper";
import {join} from "path";

export function saveSassHelpers(): void {
  const sassHelpersPath = getSassHelpersPath();
  const outputPath = join(outputFolder(), "scss");
  copySassHelper(sassHelpersPath, outputPath, "TypographyHelpers.scss");
  copySassHelper(sassHelpersPath, outputPath, "ColorHelpers.scss");
  copySassHelper(sassHelpersPath, outputPath, "SpacerHelpers.scss", {
    replace: {
      match: "$gridSize: 4px;",
      with: `$gridSize: ${spacersConfig()?.gridSize ?? 4}px;`
    }
  });
}

function getSassHelpersPath(): string {
  const folderName = "scss-helpers";
  const rootFolder = __dirname;
  const pathWhenExecutingViaTsNode = join(rootFolder, "..", "..", folderName);
  if (existsSync(pathWhenExecutingViaTsNode)) return pathWhenExecutingViaTsNode;

  const pathWhenExecutingViaBuildFolder = join(rootFolder, "..", "..", "..", folderName);
  if (existsSync(pathWhenExecutingViaBuildFolder)) return pathWhenExecutingViaBuildFolder;

  throw Error("Could not find sass helpers folder");
}