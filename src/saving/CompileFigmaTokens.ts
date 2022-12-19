import type {Config} from "style-dictionary";
import {existsSync, mkdirSync, writeFileSync, rmSync} from "fs";
import type {DesignToken} from "@src/loading/figma/types/design-token/DesignToken";
import {styleDictionaryFolderName, buildTemporaryStyleDictionaryDirectory} from "./utils/StyleDictionaryDirectory";
import {StyleDictionary} from "./providers/StyleDictionary";
import {colorsConfig, outputFolder} from "@src/config/providers/Config";

export function compileFigmaTokens(tokens: DesignToken): void {
  const temporaryStyleDictionaryDirectory = buildTemporaryStyleDictionaryDirectory();

  if (!existsSync(temporaryStyleDictionaryDirectory)) {
    mkdirSync(temporaryStyleDictionaryDirectory);
  }
  writeFileSync(`${temporaryStyleDictionaryDirectory}/token.json`, JSON.stringify(tokens));

  StyleDictionary.extend(buildStyleDictionaryConfig()).buildAllPlatforms();

  rmSync(temporaryStyleDictionaryDirectory, {
    recursive: true
  });
}

const buildStyleDictionaryConfig = (): Config => ({
  source: [`${styleDictionaryFolderName}/**/*.json`],
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: `${outputFolder()}/scss/`,
      options: {
        showFileHeader: false,
        outputReferences: false
      },
      files: buildFilesConfig()
    }
  }
});

function buildFilesConfig(): Config["platforms"]["scss"]["files"] {
  const defaultFilesConfig = [
    {
      destination: "_colors.scss",
      format: "scss/map-deep",
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
  ];

  if (colorsConfig()?.includeCssVariables) {
    defaultFilesConfig.push({
      destination: "_colors.variables.css",
      format: "css/variables",
      filter: {
        type: "color"
      }
    });
  }

  return defaultFilesConfig;
}
