import type {DesignToken} from "./types/design-token/DesignToken";
import {extractSpacers} from "./extractors/SpacerExtractor";
import {extractShadows} from "./extractors/ShadowExtractor";
import {extractColorAndFont} from "@src/loading/figma/extractors/ColorAndFontExtractor";
import type {GetFileResult} from "figma-api/lib/api-types";

export async function getDesignToken(figmaGetFileResult: GetFileResult): Promise<DesignToken> {
  const colorAndFont = extractColorAndFont(figmaGetFileResult);

  return {
    colors: colorAndFont.colors ?? {},
    fonts: colorAndFont.fonts ?? {},
    spacers: extractSpacers(figmaGetFileResult),
    shadows: extractShadows(figmaGetFileResult)
  };
}
