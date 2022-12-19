import type {UnitType, PixelUnitType} from "@src/shared/types/UnitType";

export type PixelConversionFunction = (pixelValueAsString: PixelUnitType) => UnitType;
