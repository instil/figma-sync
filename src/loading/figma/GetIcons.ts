import {extractIcons} from "./extractors/IconExtractor";
import type {SvgDictionary} from "./types/design-token/SvgDictionary";
import {figmaApi} from "./providers/FigmaApi";
import {figmaId} from "@src/config/providers/Config";

export async function getIcons(): Promise<SvgDictionary> {
  const figmaGetFileResult = await figmaApi().getFile(figmaId());

  return await extractIcons(figmaGetFileResult);
}
