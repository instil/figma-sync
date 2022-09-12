import {existsSync, readFileSync, writeFileSync} from "fs";
import {outputFolder} from "@src/config/providers/Config";

const sassHelpersPath = `${__dirname}/../../scss-helpers`;

export function saveSassHelpers(): void {
  if (!existsSync(sassHelpersPath)) throw Error(`Could not find sass helpers folder at '${sassHelpersPath}'`);

  const outputPath = `${outputFolder()}/scss`;
  copySassHelper(outputPath, "TypographyHelpers.scss");
  copySassHelper(outputPath, "ColorHelpers.scss");
}

function copySassHelper(outputPath: string, fileName: string): void {
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