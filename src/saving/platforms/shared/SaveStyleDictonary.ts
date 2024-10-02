import type {Config} from "style-dictionary";
import {join} from "path";
import {existsSync, mkdirSync, rmSync, writeFileSync} from "fs";
import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {buildTemporaryStyleDictionaryDirectory, styleDictionaryFolderName} from "@src/saving/platforms/shared/providers/StyleDictionaryDirectory";
import {StyleDictionary} from "@src/saving/providers/StyleDictionary";

export const styleDictionaryInputFile = join(styleDictionaryFolderName, "**", "*.json");

export function saveStyleDictionary(tokens: DesignToken, amazonStyleDictionaryConfig: Config): void {
  const temporaryStyleDictionaryDirectory = buildTemporaryStyleDictionaryDirectory();

  if (!existsSync(temporaryStyleDictionaryDirectory)) {
    mkdirSync(temporaryStyleDictionaryDirectory);
  }
  writeFileSync(join(temporaryStyleDictionaryDirectory, "token.json"), JSON.stringify(tokens));

  StyleDictionary.extend(amazonStyleDictionaryConfig).buildAllPlatforms();

  rmSync(temporaryStyleDictionaryDirectory, {
    recursive: true
  });
}