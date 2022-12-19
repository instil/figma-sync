import type {
  PixelToRemConvertorConfig,
  ConvertorConfig
} from "@src/loading/figma/utils/pixel-unit-convertor/types/ConvertorConfig";
import {isPixelToRemConvertorConfig} from "@src/loading/figma/utils/pixel-unit-convertor/types/ConvertorConfig";
import type {PixelConversionFunction} from "@src/loading/figma/utils/pixel-unit-convertor/types/PixelConversionFunction";

const defaultBaseFontSize = 16;

export function buildPixelUnitConvertor(config: ConvertorConfig | undefined): PixelConversionFunction {
  if (config === undefined) return pixelToPixelConvertor();

  if (isPixelToRemConvertorConfig(config)) return pixelToRemConvertor(config);

  return pixelToPixelConvertor();
}

function pixelToRemConvertor(config: PixelToRemConvertorConfig): PixelConversionFunction {
  const baseFontSizeAsDecimal = 1 / (config.baseFontSize ?? defaultBaseFontSize);

  return (pixelValueAsString: string) => {
    const withoutPixelUnitTag = pixelValueAsString.replace("px", "");
    const pixelValueAsNumber = Number(withoutPixelUnitTag);

    return `${pixelValueAsNumber * baseFontSizeAsDecimal}rem`;
  };
}

function pixelToPixelConvertor(): PixelConversionFunction {
  return pixelValueAsString => pixelValueAsString;
}