export interface FigmaSyncConfig {
  figmaPageId: string;
  figmaApiKey: string;
  outputFolder: string;
  colorsConfig?: ColorsConfig;
  spacersConfig?: SpacersConfig;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFigmaSyncConfig(maybeFigmaSyncConfig: any): maybeFigmaSyncConfig is FigmaSyncConfig {
  if (maybeFigmaSyncConfig === undefined && typeof maybeFigmaSyncConfig === "object") return false;
  if (maybeFigmaSyncConfig.colorsConfig !== undefined && !isColorsConfig(maybeFigmaSyncConfig.colorsConfig)) return false;
  if (maybeFigmaSyncConfig.spacersConfig !== undefined && !isSpacersConfig(maybeFigmaSyncConfig.spacersConfig)) return false;

  return maybeFigmaSyncConfig.figmaPageId !== undefined && typeof maybeFigmaSyncConfig.figmaPageId === "string"
    && maybeFigmaSyncConfig.figmaApiKey !== undefined && typeof maybeFigmaSyncConfig.figmaApiKey === "string"
    && maybeFigmaSyncConfig.outputFolder !== undefined && typeof maybeFigmaSyncConfig.outputFolder === "string";
}

export interface ColorsConfig {
  includeCssVariables?: boolean;
}

// eslint-disable-next-line
export function isColorsConfig(maybeColorsConfig: any): maybeColorsConfig is ColorsConfig {
  return maybeColorsConfig !== undefined && typeof maybeColorsConfig === "object";
}

export type SpacersConfig = PixelSpacersConfig | RemSpacersConfig;

export interface PixelSpacersConfig {
  unitType: "px";
}

export interface RemSpacersConfig {
  unitType: "rem";
  baseFontSize: number;
}

// eslint-disable-next-line
function isSpacersConfig(maybeSpacersConfig: any): maybeSpacersConfig is SpacersConfig {
  if (maybeSpacersConfig === undefined || typeof maybeSpacersConfig !== "object") return false;

  return isRemSpacersConfig(maybeSpacersConfig);
}

// eslint-disable-next-line
export function isRemSpacersConfig(maybeRemSpacersConfig: any): maybeRemSpacersConfig is RemSpacersConfig {
  if (maybeRemSpacersConfig === undefined || typeof maybeRemSpacersConfig !== "object") return false;

  return maybeRemSpacersConfig.unitType === "rem" && typeof maybeRemSpacersConfig.baseFontSize === "number";
}