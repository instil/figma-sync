import type {DesignToken} from "./types/design-token/DesignToken";
import {figmaApi} from "./providers/FigmaApi";
import {figmaId} from "@src/config/providers/Config";
import {extractSpacers} from "./extractors/SpacerExtractor";
import {extractShadows} from "./extractors/ShadowExtractor";
import {extractColorAndFont} from "@src/loading/figma/extractors/ColorAndFontExtractor";

export async function getDesignToken(): Promise<DesignToken> {
  const figmaGetFileResult = await figmaApi().getFile(figmaId());
  const colorAndFont = extractColorAndFont(figmaGetFileResult);

  return {
    colors: colorAndFont.colors ?? {},
    fonts: colorAndFont.fonts ?? {},
    spacers: extractSpacers(figmaGetFileResult),
    shadows: extractShadows(figmaGetFileResult)
  };
}
