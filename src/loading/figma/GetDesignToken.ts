import type {DesignToken} from "./types/design-token/DesignToken";
import {figmaApi} from "./providers/FigmaApi";
import {figmaId} from "@src/config/providers/Config";
import {extractColors} from "./extractors/ColorExtractor";
import {extractFonts} from "./extractors/FontExtractor";
import {extractSpacers} from "./extractors/SpacerExtractor";
import {extractShadows} from "./extractors/ShadowExtractor";

export async function getDesignToken(): Promise<DesignToken> {
  const figmaGetFileResult = await figmaApi().getFile(figmaId());

  return {
    colors: extractColors(figmaGetFileResult),
    fonts: extractFonts(figmaGetFileResult),
    spacers: extractSpacers(figmaGetFileResult),
    shadows: extractShadows(figmaGetFileResult)
  };
}
