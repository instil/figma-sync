import type {UnitTypeConfig} from "@src/loading/figma/utils/spacers-unit-converter/types/UnitConverterConfig";
import {isUnitTypeConfig} from "@src/loading/figma/utils/spacers-unit-converter/types/UnitConverterConfig";

export type TypographyConfig = UnitTypeConfig

export const isTypographyConfig = isUnitTypeConfig;