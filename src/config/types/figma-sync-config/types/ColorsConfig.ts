export interface ColorsConfig {
  includeCssVariables?: boolean;
}

// eslint-disable-next-line
export function isColorsConfig(maybeColorsConfig: any): maybeColorsConfig is ColorsConfig {
  return maybeColorsConfig !== undefined && typeof maybeColorsConfig === "object";
}