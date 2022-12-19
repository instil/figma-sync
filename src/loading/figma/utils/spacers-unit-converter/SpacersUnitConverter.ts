import type {
  RemUnitTypeConfig,
  UnitTypeConfig
} from "@src/loading/figma/utils/spacers-unit-converter/types/UnitConverterConfig";
import {isRemUnitTypeConfig} from "@src/loading/figma/utils/spacers-unit-converter/types/UnitConverterConfig";
import type {PixelConversionFunction} from "@src/loading/figma/utils/spacers-unit-converter/types/PixelConversionFunction";

const defaultBaseFontSize = 16;

export function buildPixelUnitConverter(config: UnitTypeConfig | undefined): PixelConversionFunction {
  if (config === undefined) return pixelToPixelConverter();

  if (isRemUnitTypeConfig(config)) return pixelToRemConvertor(config);

  return pixelToPixelConverter();
}

function pixelToRemConvertor(config: RemUnitTypeConfig): PixelConversionFunction {
  const baseFontSizeAsDecimal = 1 / (config.baseFontSize ?? defaultBaseFontSize);

  return (pixelValueAsString: string) => {
    const withoutPixelUnitTag = pixelValueAsString.replace("px", "");
    const pixelValueAsNumber = Number(withoutPixelUnitTag);

    return `${pixelValueAsNumber * baseFontSizeAsDecimal}rem`;
  };
}

function pixelToPixelConverter(): PixelConversionFunction {
  return pixelValueAsString => pixelValueAsString;
}