export interface FigmaSyncConfig {
  figmaPageId: string;
  figmaApiKey: string;
  outputFolder: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFigmaSyncConfig(maybeFigmaSyncConfig: any): maybeFigmaSyncConfig is FigmaSyncConfig {
  return maybeFigmaSyncConfig !== undefined && typeof maybeFigmaSyncConfig === "object"
    && maybeFigmaSyncConfig.figmaPageId !== undefined && typeof maybeFigmaSyncConfig.figmaPageId === "string"
    && maybeFigmaSyncConfig.figmaApiKey !== undefined && typeof maybeFigmaSyncConfig.figmaApiKey === "string"
    && maybeFigmaSyncConfig.outputFolder !== undefined && typeof maybeFigmaSyncConfig.outputFolder === "string";
}