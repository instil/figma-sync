import type {Config} from "style-dictionary";
import {join, sep as separator} from "path";
import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {outputFolder} from "@src/config/providers/Config";
import {saveStyleDictionary, styleDictionaryInputFile} from "@src/saving/platforms/shared/SaveStyleDictonary";
import {webOutputFiles} from "@src/saving/platforms/scss/style-dictionary/output/WebOutputFiles";

export function saveScssStyleDictionary(tokens: DesignToken): void {
  saveStyleDictionary(tokens, buildStyleDictionaryConfig());
}

const buildStyleDictionaryConfig = (): Config => ({
  source: [styleDictionaryInputFile],
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: join(outputFolder(), "scss", separator),
      options: {
        showFileHeader: false,
        outputReferences: false
      },
      files: webOutputFiles()
    }
  }
});
