import type {ConvertorConfig} from "@src/loading/figma/utils/pixel-unit-convertor/types/ConvertorConfig";
import {isUnitConvertorConfig} from "@src/loading/figma/utils/pixel-unit-convertor/types/ConvertorConfig";

export type SpacersConfig = ConvertorConfig

export const isSpacersConfig = isUnitConvertorConfig;