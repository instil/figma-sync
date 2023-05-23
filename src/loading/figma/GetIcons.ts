import {extractIcons} from "./extractors/IconExtractor";
import type {SvgDictionary} from "./types/design-token/SvgDictionary";
import type {GetFileResult} from "figma-api/lib/api-types";

export async function getIcons(figmaGetFileResult: GetFileResult): Promise<SvgDictionary> {
  return await extractIcons(figmaGetFileResult);
}
