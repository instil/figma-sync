import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {saveSassHelpers} from "@src/saving/platforms/web/sass-helpers/SaveSassHelpers";
import {saveWebStyleDictionary} from "@src/saving/platforms/web/style-dictionary/SaveWebStyleDictionary";

export function compileWebFigmaTokens(tokens: DesignToken): void {
  console.log("Compiling design token into web styles...");
  saveWebStyleDictionary(tokens);
  console.log("Style compiling complete!\n");

  console.log("Installing sass helpers...");
  saveSassHelpers();
  console.log("Sass helper installation complete\n");
}
