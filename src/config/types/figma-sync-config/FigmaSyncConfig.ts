import type {ColorsConfig} from "@src/config/types/figma-sync-config/types/ColorsConfig";
import {isColorsConfig} from "@src/config/types/figma-sync-config/types/ColorsConfig";
import type {SpacersConfig} from "@src/config/types/figma-sync-config/types/SpacersConfig";
import {isSpacersConfig} from "@src/config/types/figma-sync-config/types/SpacersConfig";
import type {TypographyConfig} from "@src/config/types/figma-sync-config/types/TypographyConfig";
import {isTypographyConfig} from "@src/config/types/figma-sync-config/types/TypographyConfig";

export interface FigmaSyncConfig {
  figmaPageId: string;
  figmaApiKey: string;
  outputFolder: string;
  colorsConfig?: ColorsConfig;
  spacersConfig?: SpacersConfig;
  typographyConfig?: TypographyConfig;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFigmaSyncConfig(maybeFigmaSyncConfig: any): maybeFigmaSyncConfig is FigmaSyncConfig {
  if (maybeFigmaSyncConfig === undefined && typeof maybeFigmaSyncConfig === "object") return false;
  if (maybeFigmaSyncConfig.colorsConfig !== undefined && !isColorsConfig(maybeFigmaSyncConfig.colorsConfig)) return false;
  if (maybeFigmaSyncConfig.spacersConfig !== undefined && !isSpacersConfig(maybeFigmaSyncConfig.spacersConfig)) return false;
  if (maybeFigmaSyncConfig.typographyConfig !== undefined && !isTypographyConfig(maybeFigmaSyncConfig.typographyConfig)) return false;

  return maybeFigmaSyncConfig.figmaPageId !== undefined && typeof maybeFigmaSyncConfig.figmaPageId === "string"
    && maybeFigmaSyncConfig.figmaApiKey !== undefined && typeof maybeFigmaSyncConfig.figmaApiKey === "string"
    && maybeFigmaSyncConfig.outputFolder !== undefined && typeof maybeFigmaSyncConfig.outputFolder === "string";
}

