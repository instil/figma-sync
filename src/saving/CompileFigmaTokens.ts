import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {platform} from "@src/config/providers/Config";
import {compileScssFigmaTokens} from "@src/saving/platforms/scss/CompileScssFigmaTokens";
import {compileTailwindFigmaTokens} from "@src/saving/platforms/tailwind/CompileTailwindFigmaTokens";
import {compileIosFigmaTokens} from "@src/saving/platforms/ios/CompileIosFigmaTokens";
import {compileAndroidFigmaTokens} from "@src/saving/platforms/android/CompileAndroidFigmaTokens";

export function compileFigmaTokens(tokens: DesignToken): void {
  switch (platform()) {
    case "scss":
      compileScssFigmaTokens(tokens);
      return;
    case "tailwind":
      compileTailwindFigmaTokens(tokens);
      return;
    case "ios":
      compileIosFigmaTokens(tokens);
      return;
    case "android":
      compileAndroidFigmaTokens(tokens);
      return;
    default:
      // Just default to scss for backward compatibility
      compileScssFigmaTokens(tokens);
      return;
  }
}
