import {existsSync, readFileSync, writeFileSync} from "fs";
import {outputFolder} from "@src/config/providers/Config";

export function saveSassHelpers(): void {
  const sassHelpersPath = getSassHelpersPath();
  const outputPath = `${outputFolder()}/scss`;
  copySassHelper(sassHelpersPath, outputPath, "TypographyHelpers.scss");
  copySassHelper(sassHelpersPath, outputPath, "ColorHelpers.scss");
}

function copySassHelper(sassHelpersPath: string, outputPath: string, fileName: string): void {
  const fileContents = readFileSync(`${sassHelpersPath}/${fileName}`);
  writeFileSync(`${outputPath}/${fileName}`, fileContents);
  consoleLogInStyleDictionaryStyle(`✔︎ ${outputPath}`);
}

function consoleLogInStyleDictionaryStyle(text: string): void {
  const greenForeground = "\x1b[1m";
  const boldText = "\x1b[32m";
  const resetStyles = "\x1b[0m";

  console.log(`${greenForeground}${boldText}%s${resetStyles}`, text);
}

function getSassHelpersPath(): string {
  const folderName = "scss-helpers";
  const rootFolder = __dirname;
  const pathWhenExecutingViaTsNode = `${rootFolder}/../../${folderName}`;
  if (existsSync(pathWhenExecutingViaTsNode)) return pathWhenExecutingViaTsNode;

  const pathWhenExecutingViaBuildFolder = `${rootFolder}/../../../${folderName}`;
  if (existsSync(pathWhenExecutingViaBuildFolder)) return pathWhenExecutingViaBuildFolder;

  throw Error("Could not find sass helpers folder");
}