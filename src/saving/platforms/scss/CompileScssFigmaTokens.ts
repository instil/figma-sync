import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {saveScssHelpers} from "@src/saving/platforms/scss/scss-helpers/SaveScssHelpers";
import {saveScssStyleDictionary} from "@src/saving/platforms/scss/style-dictionary/SaveScssStyleDictionary";

export function compileScssFigmaTokens(tokens: DesignToken): void {
  console.log("Compiling design token into web styles...");
  saveScssStyleDictionary(tokens);
  console.log("Style compiling complete!\n");

  console.log("Installing scss helpers...");
  saveScssHelpers();
  console.log("Sass helper installation complete\n");
}
