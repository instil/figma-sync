import {getDesignToken} from "./loading/figma/GetDesignToken";
import {compileFigmaTokens} from "./saving/CompileFigmaTokens";
import {saveIcons} from "./saving/SaveIcons";
import {getIcons} from "./loading/figma/GetIcons";
import {loadConfig} from "@src/config/providers/Config";
import {saveSassHelpers} from "@src/saving/SaveSassHelpers";
import {extractFile} from "@src/loading/figma/extractors/FileExtractor";
import type {GetFileResult} from "figma-api/lib/api-types";

interface Configuration {
  withIcons?: true;
}

export async function syncFigma(configuration?: Configuration): Promise<void> {
  await loadConfig();

  console.log("Downloading figma file...");
  const figmaGetFileResult = await extractFile();
  console.log("Downloading figma file complete!");

  await syncDesignTokens(figmaGetFileResult);

  if (configuration?.withIcons) await syncIcons(figmaGetFileResult);
}

async function syncDesignTokens(figmaGetFileResult: GetFileResult): Promise<void> {
  console.log("Downloading design token...");
  const token = await getDesignToken(figmaGetFileResult);
  console.log("Design token download complete!\n");

  console.log("Compiling design token into styles...");
  compileFigmaTokens(token);
  console.log("Style compiling complete!\n");

  console.log("Installing sass helpers...");
  saveSassHelpers();
  console.log("Sass helper installation complete\n");
}

async function syncIcons(figmaGetFileResult: GetFileResult): Promise<void> {
  console.log("Downloading icons...");
  const icons = await getIcons(figmaGetFileResult);
  console.log("Icon download complete!\n");

  console.log("Saving icons...");
  saveIcons(icons);
  console.log("Icon saving complete!\n");
}
