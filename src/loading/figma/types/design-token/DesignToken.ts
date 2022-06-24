import type {DesignTokenColors} from "./types/DesignTokenColors";
import type {DesignTokenShadows} from "./types/DesignTokenShadows";
import type {DesignTokenSpacers} from "./types/DesignTokenSpacers";
import type {DesignTokenFonts} from "./types/DesignTokenFonts";

export interface DesignToken {
  colors: DesignTokenColors;
  shadows: DesignTokenShadows;
  spacers: DesignTokenSpacers;
  fonts: DesignTokenFonts;
}
