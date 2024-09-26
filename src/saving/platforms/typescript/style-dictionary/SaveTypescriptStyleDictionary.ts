import type {Config} from "style-dictionary";
import {join, sep as separator} from "path";
import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {outputFolder} from "@src/config/providers/Config";
import {saveStyleDictionary, styleDictionaryInputFile} from "@src/saving/platforms/shared/SaveStyleDictonary";
import {typescriptOutputFiles} from "@src/saving/platforms/typescript/style-dictionary/output/TypescriptOutputFiles";

export function saveTypescriptStyleDictionary(tokens: DesignToken): void {
  saveStyleDictionary(tokens, buildStyleDictionaryConfig());
}

const buildStyleDictionaryConfig = (): Config => ({
  source: [styleDictionaryInputFile],
  platforms: {
    typescript: {
      transformGroup: "js",
      buildPath: join(outputFolder(), "typescript", separator),
      options: {
        showFileHeader: false,
        outputReferences: false
      },
      files: typescriptOutputFiles
    }
  }
});
