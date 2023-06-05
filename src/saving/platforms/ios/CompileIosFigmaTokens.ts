import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {saveIosStyleDictionary} from "@src/saving/platforms/ios/style-dictionary/SaveIosStyleDictionary";

export function compileIosFigmaTokens(tokens: DesignToken): void {
  console.log("Compiling design token into ios styles...");
  saveIosStyleDictionary(tokens);
  console.log("Style compiling complete!\n");
}
