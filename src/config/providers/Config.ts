import type {FigmaSyncConfig} from "@src/config/types/figma-sync-config/FigmaSyncConfig";
import {isFigmaSyncConfig} from "@src/config/types/figma-sync-config/FigmaSyncConfig";
import {existsSync, readFileSync} from "fs";
import {transpile} from "typescript";
import {default as requireFromString} from "require-from-string";
import {join} from "path";

const configPath = join(process.cwd(), "FigmaSync.config.ts");
let config: FigmaSyncConfig;

export async function loadConfig(): Promise<void> {
  if (!existsSync(configPath)) throw Error(`Could not find configuration file at '${configPath}'. Please follow the readme instructions.`);

  const asTypescript = readFileSync(configPath).toString("utf-8");
  const asJavascript = transpile(asTypescript);
  const result = requireFromString(asJavascript)?.default;

  if (!isFigmaSyncConfig(result)) {
    console.log("Loaded config", config);
    throw Error("Configuration file did not match expect config, please use the typescript interface provided");
  }

  config = result;
}

export const figmaId = (): FigmaSyncConfig["figmaPageId"] => config.figmaPageId;
export const figmaApiKey = (): FigmaSyncConfig["figmaApiKey"] => config.figmaApiKey;
export const outputFolder = (): FigmaSyncConfig["outputFolder"] => config.outputFolder;
export const spacersConfig = (): FigmaSyncConfig["spacersConfig"] => config.spacersConfig;
export const colorsConfig = (): FigmaSyncConfig["colorsConfig"] => config.colorsConfig;
export const typographyConfig = (): FigmaSyncConfig["typographyConfig"] => config.typographyConfig;
export const platform = (): Required<FigmaSyncConfig["platform"]> => config.platform ?? "web";