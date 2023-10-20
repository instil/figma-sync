import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {saveTypescriptStyleDictionary} from "@src/saving/platforms/typescript/style-dictionary/SaveTypescriptStyleDictionary";

export function compileTypescriptFigmaTokens(tokens: DesignToken): void {
  console.log("Compiling design token into typescript styles...");
  saveTypescriptStyleDictionary(tokens);
  console.log("Style compiling complete!\n");
}
