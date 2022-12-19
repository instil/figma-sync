import type {ConvertorConfig} from "@src/loading/figma/utils/pixel-unit-convertor/types/ConvertorConfig";
import {isUnitConvertorConfig} from "@src/loading/figma/utils/pixel-unit-convertor/types/ConvertorConfig";

export type TypographyConfig = ConvertorConfig

export const isTypographyConfig = isUnitConvertorConfig;