import type {UnitTypeConfig} from "@src/loading/figma/utils/spacers-unit-converter/types/UnitConverterConfig";
import {isUnitTypeConfig} from "@src/loading/figma/utils/spacers-unit-converter/types/UnitConverterConfig";

export type SpacersConfig = UnitTypeConfig

export const isSpacersConfig = isUnitTypeConfig;