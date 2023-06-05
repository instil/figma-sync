import type {Config} from "style-dictionary";
import {join, sep as separator} from "path";
import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {outputFolder} from "@src/config/providers/Config";
import {saveStyleDictionary, styleDictionaryInputFile} from "@src/saving/platforms/shared/SaveStyleDictonary";
import {iosTransformKeys, iosTransforms} from "@src/saving/platforms/ios/style-dictionary/transforms/IosTransforms";
import {iosOutputFiles} from "@src/saving/platforms/ios/style-dictionary/output/IosOutputFiles";

export function saveIosStyleDictionary(tokens: DesignToken): void {
  saveStyleDictionary(tokens, buildStyleDictionaryConfig());
}

const buildStyleDictionaryConfig = (): Config => ({
  source: [styleDictionaryInputFile],
  transform: iosTransforms,
  platforms: {
    ios: {
      transformGroup: "ios",
      buildPath: join(outputFolder(), "ios", separator),
      transforms: iosTransformKeys,
      options: {
        showFileHeader: false,
        outputReferences: false
      },
      files: iosOutputFiles
    }
  }
});
