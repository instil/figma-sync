export type ConvertorConfig =
  | PixelToPixelConvertorConfig
  | PixelToRemConvertorConfig;

// eslint-disable-next-line
export function isUnitConvertorConfig(maybeUnitConvertorConfig: any): maybeUnitConvertorConfig is ConvertorConfig {
  if (maybeUnitConvertorConfig === undefined || typeof maybeUnitConvertorConfig !== "object") return false;

  return isPixelToRemConvertorConfig(maybeUnitConvertorConfig) || isPixelToPixelConvertorConfig(maybeUnitConvertorConfig);
}

export interface PixelToPixelConvertorConfig {
  unitType: "px";
}

// eslint-disable-next-line
export function isPixelToPixelConvertorConfig(maybePixelToPixelConvertorConfig: any): maybePixelToPixelConvertorConfig is PixelToPixelConvertorConfig {
  if (maybePixelToPixelConvertorConfig === undefined || typeof maybePixelToPixelConvertorConfig !== "object") return false;

  return maybePixelToPixelConvertorConfig.unitType === "px";
}

export interface PixelToRemConvertorConfig {
  unitType: "rem";
  baseFontSize?: number;
}

// eslint-disable-next-line
export function isPixelToRemConvertorConfig(maybePixelToRemConvertorConfig: any): maybePixelToRemConvertorConfig is PixelToRemConvertorConfig {
  if (maybePixelToRemConvertorConfig === undefined || typeof maybePixelToRemConvertorConfig !== "object") return false;
  if (maybePixelToRemConvertorConfig.baseFontSize !== undefined && typeof maybePixelToRemConvertorConfig.baseFontSize !== "number") return false;

  return maybePixelToRemConvertorConfig.unitType === "rem";
}
