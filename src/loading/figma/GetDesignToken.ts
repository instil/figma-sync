import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {extractColorAndFont} from "@src/loading/figma/extractors/ColorAndFontExtractor";
import type {GetFileResult} from "figma-api/lib/api-types";

export async function getDesignToken(figmaGetFileResult: GetFileResult): Promise<DesignToken> {
  console.log("Downloading design token...");

  const colorAndFont = extractColorAndFont(figmaGetFileResult);

  const designToken: DesignToken = {
    colors: colorAndFont.colors ?? {},
    fonts: colorAndFont.fonts ?? {}
  };

  console.log("Design token download complete!\n");
  return designToken;
}
