import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {saveTailwindStyleDictionary} from "@src/saving/platforms/tailwind/style-dictionary/SaveTailwindStyleDictionary";

export function compileTailwindFigmaTokens(tokens: DesignToken): void {
  console.log("Compiling design token into typescript styles...");
  saveTailwindStyleDictionary(tokens);
  console.log("Style compiling complete!\n");
}
