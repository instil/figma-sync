import type {Config} from "style-dictionary";
import {existsSync, mkdirSync, writeFileSync} from "fs";
import type {DesignToken} from "@src/loading/figma/types/design-token/DesignToken";
import {generatedFilesDirectory} from "./providers/Environment";
import {styleDictionaryFolderName, buildTemporaryStyleDictionaryDirectory} from "./utils/StyleDictionaryDirectory";
import {StyleDictionary} from "./providers/StyleDictionary";

export function compileFigmaTokens(tokens: DesignToken): void {
  const temporaryStyleDictionaryDirectory = buildTemporaryStyleDictionaryDirectory();

  if (!existsSync(temporaryStyleDictionaryDirectory)) {
    mkdirSync(temporaryStyleDictionaryDirectory);
  }
  writeFileSync(`${temporaryStyleDictionaryDirectory}/token.json`, JSON.stringify(tokens));

  StyleDictionary.extend(buildStyleDictionaryConfig()).buildAllPlatforms();
}

const buildStyleDictionaryConfig = (): Config => ({
  source: [`${styleDictionaryFolderName}/**/*.json`],
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: `${generatedFilesDirectory()}/scss/`,
      options: {
        showFileHeader: false,
        outputReferences: false
      },
      files: [
        {
          destination: "_colors.scss",
          format: "scss/variables",
          filter: {
            type: "color"
          }
        },
        {
          destination: "_typography.scss",
          format: "scss/map-deep",
          filter: {
            type: "typography"
          }
        },
        {
          destination: "_shadows.scss",
          format: "scss/variables",
          filter: {
            type: "shadows"
          }
        },
        {
          destination: "_spacers.scss",
          format: "scss/variables",
          filter: {
            type: "spacers"
          }
        }
      ]
    }
  }
});
