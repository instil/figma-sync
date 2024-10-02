import type {DesignTokenColors} from "@src/shared/types/design-token/types/DesignTokenColors";
import {tokensToEntries} from "@src/saving/platforms/shared/utils/TokensToEntries";

export function toTailwindColourConfig(colours: DesignTokenColors): string {
  const coloursAsTailwindConfig = tokensToEntries(colours)
    .map(([colourKey, colourValue]) => {
      return `
        ${colourKey}: {
          DEFAULT: "${colourValue.value}"
        },
      `;
    });

  return `
    export default {
      ${coloursAsTailwindConfig.join("")}
    }
  `;
}