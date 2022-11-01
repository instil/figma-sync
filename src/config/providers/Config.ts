import type {DesignSyncConfig} from "@src/config/types/DesignSyncConfig";
import {isDesignSyncConfig} from "@src/config/types/DesignSyncConfig";
import {existsSync, readFileSync} from "fs";
import {transpile} from "typescript";
import {default as requireFromString} from "require-from-string";

const configPath = `${process.cwd()}/DesignSync.config.ts`;
let config: DesignSyncConfig;

export async function loadConfig(): Promise<void> {
  if (!existsSync(configPath)) throw Error(`Could not find configuration file at '${configPath}'. Please follow the readme instructions.`);

  const asTypescript = readFileSync(configPath).toString("utf-8");
  const asJavascript = transpile(asTypescript);
  const result = requireFromString(asJavascript)?.default;

  if (!isDesignSyncConfig(result)) {
    console.log("Loaded config", config);
    throw Error("Configuration file did not match expect config, please use the typescript interface provided");
  }

  config = result;
}

export const figmaId = (): string => config.figmaPageId;

export const figmaApiKey = (): string => config.figmaApiKey;

export const outputFolder = (): string => config.outputFolder;