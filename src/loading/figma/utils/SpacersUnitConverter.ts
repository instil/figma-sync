import type {RemSpacersConfig} from "@src/config/types/FigmaSyncConfig";
import {isRemSpacersConfig} from "@src/config/types/FigmaSyncConfig";
import {spacersConfig} from "@src/config/providers/Config";

type ConversionCallback = (pixelValueAsString: string) => string;

export function buildSpacersUnitConverter(): ConversionCallback {
  const spacersConfiguration = spacersConfig();

  if (isRemSpacersConfig(spacersConfiguration)) return pixelToRemConvertor(spacersConfiguration);

  return pixelValueAsString => pixelValueAsString;
}

function pixelToRemConvertor(remSpacersConfig: RemSpacersConfig): ConversionCallback {
  const baseFontSizeAsDecimal = 1 / remSpacersConfig.baseFontSize;

  return (pixelValueAsString: string) => {
    const withoutPixelUnitTag = pixelValueAsString.replace("px", "");
    const pixelValueAsNumber = Number(withoutPixelUnitTag);

    return `${pixelValueAsNumber * baseFontSizeAsDecimal}rem`;
  };
}
