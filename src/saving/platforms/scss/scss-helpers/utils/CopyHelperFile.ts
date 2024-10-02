import {readFileSync, writeFileSync} from "fs";
import {join} from "path";

interface CopyFileOptions {
  replace?: {
    match: string;
    with: string;
  }
}

export function copyHelperFile(helperFilePath: string, outputPath: string, fileName: string, options?: CopyFileOptions): void {
  const helperFileContents = readOriginalHelperFile(helperFilePath, fileName, options);
  writeFileSync(join(outputPath, fileName), helperFileContents);
  consoleLogInStyleDictionaryStyle(`✔︎ ${outputPath}`);
}

function readOriginalHelperFile(helperFilePath: string, fileName: string, options?: CopyFileOptions): string {
  const fileContents = readFileSync(join(helperFilePath, fileName)).toString("utf-8");
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