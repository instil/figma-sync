import type {FigmaSyncConfig} from "@src/config/types/FigmaSyncConfig";
import {isFigmaSyncConfig} from "@src/config/types/FigmaSyncConfig";
import {fileExistsSync} from "tsconfig-paths/lib/filesystem";

const configPath = `${process.cwd()}/FigmaSync.config.json`;
let config: FigmaSyncConfig;

export async function loadConfig(): Promise<void> {
  if (!fileExistsSync(configPath)) throw Error(`Could not find configuration file at '${configPath}'. Please follow the readme instructions.`);

  const parsedConfigFile = await import(configPath);

  if (!isFigmaSyncConfig(parsedConfigFile.default)) {
    console.log("Loaded config", config);
    throw Error("Configuration file did not match expect config, please use the typescript interface provided");
  }

  config = parsedConfigFile.default;
}

export const figmaId = (): string => config.figmaPageId;

export const figmaApiKey = (): string => config.figmaApiKey;

export const outputFolder = (): string => config.outputFolder;