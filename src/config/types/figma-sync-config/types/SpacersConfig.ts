export type SpacersConfig = {
  gridSize?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSpacersConfig(maybeSpacersConfig: any): maybeSpacersConfig is SpacersConfig {
  if (!maybeSpacersConfig.gridSize) return true;

  return Number.isNaN(maybeSpacersConfig.gridSize);
}