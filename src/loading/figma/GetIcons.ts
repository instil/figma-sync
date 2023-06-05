import {extractIcons} from "./extractors/IconExtractor";
import type {SvgDictionary} from "@src/shared/types/design-token/SvgDictionary";
import type {GetFileResult} from "figma-api/lib/api-types";

export async function getIcons(figmaGetFileResult: GetFileResult): Promise<SvgDictionary> {
  console.log("Downloading icons...");

  const icons = await extractIcons(figmaGetFileResult);

  console.log("Icon download complete!\n");
  return icons;
}
