import {readFileSync, writeFileSync, existsSync} from "fs";
import {outputFolder} from "@src/config/providers/Config";

const typographyHelperPath = `${__dirname}/../../scss-helpers/TypographyHelpers.scss`;

export function saveSassHelpers(): void {
  if (!existsSync(typographyHelperPath)) throw Error("Could not find typography helper file");

  const outputPath = `${outputFolder()}/scss/TypographyHelpers.scss`;
  writeFileSync(outputPath, readFileSync(typographyHelperPath));
  consoleLogInStyleDictionaryStyle(`✔︎ ${outputPath}`);
}

function consoleLogInStyleDictionaryStyle(text: string): void {
  const greenForeground = "\x1b[1m";
  const boldText = "\x1b[32m";
  const resetStyles = "\x1b[0m";

  console.log(`${greenForeground}${boldText}%s${resetStyles}`, text);
}