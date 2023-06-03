import {readFileSync, writeFileSync} from "fs";
import {join} from "path";

interface CopySassHelperOptions {
  replace?: {
    match: string;
    with: string;
  }
}

export function copySassHelper(sassHelpersPath: string, outputPath: string, fileName: string, options?: CopySassHelperOptions): void {
  const helperFileContents = readOriginalHelperFile(sassHelpersPath, fileName, options);
  writeFileSync(join(outputPath, fileName), helperFileContents);
  consoleLogInStyleDictionaryStyle(`✔︎ ${outputPath}`);
}

function readOriginalHelperFile(sassHelpersPath: string, fileName: string, options?: CopySassHelperOptions): string {
  const fileContents = readFileSync(join(sassHelpersPath, fileName)).toString("utf-8");
  if (!options?.replace) return fileContents;

  const regularExpression = new RegExp(options.replace.match, "g");
  return fileContents.replace(regularExpression, options.replace.with);
}

function consoleLogInStyleDictionaryStyle(text: string): void {
  const greenForeground = "\x1b[1m";
  const boldText = "\x1b[32m";
  const resetStyles = "\x1b[0m";

  console.log(`${greenForeground}${boldText}%s${resetStyles}`, text);
}