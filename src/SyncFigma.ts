import {getDesignToken} from "./loading/figma/GetDesignToken";
import {saveIcons} from "./saving/SaveIcons";
import {getIcons} from "./loading/figma/GetIcons";
import {loadConfig} from "@src/config/providers/Config";
import {extractFile} from "@src/loading/figma/extractors/FileExtractor";
import type {GetFileResult} from "figma-api/lib/api-types";
import {compileFigmaTokens} from "@src/saving/CompileFigmaTokens";

interface Configuration {
  withIcons?: true;
}

export async function syncFigma(configuration?: Configuration): Promise<void> {
  await loadConfig();

  const figmaGetFileResult = await extractFile();
  await syncDesignTokens(figmaGetFileResult);

  if (configuration?.withIcons) await syncIcons(figmaGetFileResult);
}

async function syncDesignTokens(figmaGetFileResult: GetFileResult): Promise<void> {
  const token = await getDesignToken(figmaGetFileResult);
  compileFigmaTokens(token);
}

async function syncIcons(figmaGetFileResult: GetFileResult): Promise<void> {
  const icons = await getIcons(figmaGetFileResult);
  saveIcons(icons);
}
