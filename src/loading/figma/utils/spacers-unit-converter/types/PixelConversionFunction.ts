import type {OutputUnitType, PixelUnitType} from "@src/loading/figma/utils/spacers-unit-converter/types/UnitType";

export type PixelConversionFunction = (pixelValueAsString: PixelUnitType) => OutputUnitType;
