import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {saveAndroidStyleDictionary} from "@src/saving/platforms/android/style-dictionary/SaveAndroidStyleDictionary";

export function compileAndroidFigmaTokens(tokens: DesignToken): void {
  console.log("Compiling design token into android styles...");
  saveAndroidStyleDictionary(tokens);
  console.log("Style compiling complete!\n");
}
