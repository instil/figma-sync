import type {DesignSyncConfig} from "@src/config/types/DesignSyncConfig";
import {isDesignSyncConfig} from "@src/config/types/DesignSyncConfig";
import {fileExistsSync} from "tsconfig-paths/lib/filesystem";

const configPath = `${process.cwd()}/DesignSync.config.json`;
let config: DesignSyncConfig;

export async function loadConfig(): Promise<void> {
  if (!fileExistsSync(configPath)) throw Error(`Could not find configuration file at '${configPath}'. Please follow the readme instructions.`);

  const parsedConfigFile = await import(configPath);

  if (!isDesignSyncConfig(parsedConfigFile.default)) {
    console.log("Loaded config", config);
    throw Error("Configuration file did not match expect config, please use the typescript interface provided");
  }

  config = parsedConfigFile.default;
}

export const figmaId = (): string => config.figmaPageId;

export const figmaApiKey = (): string => config.figmaApiKey;

export const outputFolder = (): string => config.outputFolder;