import {tokensToEntries} from "@src/saving/platforms/shared/utils/TokensToEntries";
import type {DesignTokenFont, DesignTokenFonts} from "@src/shared/types/design-token/types/DesignTokenFonts";

export function toTailwindCss(fonts: DesignTokenFonts): string {
  return `
    @tailwind base;
    
    @layer base {
      ${tokensToEntries(fonts).map(asFontFace).join("")}
    }
  `.trimStart();
}

function asFontFace([typographyKey, typographyDetails]: [string, DesignTokenFont]): string {
  return `
    .font-${typographyKey} {
      font-family: ${typographyDetails.family.value};
      line-height: ${typographyDetails.lineheight.value};
      font-size: ${typographyDetails.size.value};
      letter-spacing: ${typographyDetails.spacing.value};
      font-weight: ${typographyDetails.weight.value};
    }
  `;
}
