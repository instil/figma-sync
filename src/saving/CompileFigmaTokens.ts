import type {DesignToken} from "@src/shared/types/design-token/DesignToken";
import {platform} from "@src/config/providers/Config";
import {compileWebFigmaTokens} from "@src/saving/platforms/web/CompileWebFigmaTokens";
import {compileIosFigmaTokens} from "@src/saving/platforms/ios/CompileIosFigmaTokens";

export function compileFigmaTokens(tokens: DesignToken): void {
  switch (platform()) {
    case "web":
      compileWebFigmaTokens(tokens);
      return;
    case "ios":
      compileIosFigmaTokens(tokens);
      return;
  }
}
