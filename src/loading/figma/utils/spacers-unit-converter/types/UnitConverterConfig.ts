export type UnitTypeConfig = PixelUnitTypeConfig | RemUnitTypeConfig;

// eslint-disable-next-line
export function isUnitTypeConfig(maybeUnitTypeConfig: any): maybeUnitTypeConfig is UnitTypeConfig {
  if (maybeUnitTypeConfig === undefined || typeof maybeUnitTypeConfig !== "object") return false;

  return isRemUnitTypeConfig(maybeUnitTypeConfig) || isPixelUnitTypeConfig(maybeUnitTypeConfig);
}

export interface PixelUnitTypeConfig {
  unitType: "px";
}

// eslint-disable-next-line
export function isPixelUnitTypeConfig(maybeRemUnitTypeConfig: any): maybeRemUnitTypeConfig is RemUnitTypeConfig {
  if (maybeRemUnitTypeConfig === undefined || typeof maybeRemUnitTypeConfig !== "object") return false;

  return maybeRemUnitTypeConfig.unitType === "px";
}

export interface RemUnitTypeConfig {
  unitType: "rem";
  baseFontSize?: number;
}

// eslint-disable-next-line
export function isRemUnitTypeConfig(maybeRemUnitTypeConfig: any): maybeRemUnitTypeConfig is RemUnitTypeConfig {
  if (maybeRemUnitTypeConfig === undefined || typeof maybeRemUnitTypeConfig !== "object") return false;
  if (maybeRemUnitTypeConfig.baseFontSize !== undefined && typeof maybeRemUnitTypeConfig.baseFontSize !== "number") return false;

  return maybeRemUnitTypeConfig.unitType === "rem";
}
